import React, { useState, useCallback, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { 
  Download, 
  Share2,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Loader2,
  BarChart3,
  Expand,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw
} from "lucide-react";

// Set up PDF.js with reliable worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
}

// Global file data access for preview PDFs
declare global {
  interface Window {
    fileDataStore?: Map<string, ArrayBuffer>;
  }
}

// Access the global file store
const getFileData = (url: string): ArrayBuffer | null => {
  if (url.startsWith('preview://')) {
    const fileId = url.replace('preview://', '');
    return (window as any).fileDataStore?.get(fileId) || null;
  }
  return null;
};

interface EnhancedPDFBlockProps {
  title: string;
  url: string;
  pages: number;
  thumbnails?: string[];
  onDownload?: () => void;
  onShare?: () => void;
  metadata?: {
    size: string;
    author?: string;
    created?: string;
  };
  showThumbnailFirst?: boolean;
}

export default function EnhancedPDFBlock({ 
  title, 
  url, 
  pages, 
  thumbnails = [], 
  onDownload,
  onShare,
  metadata,
  showThumbnailFirst = true
}: EnhancedPDFBlockProps) {
  const { theme } = useTheme();
  
  // Canvas refs for direct PDF.js rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Viewer state
  const [viewerMethod, setViewerMethod] = useState<'iframe' | 'canvas' | 'error'>(() => {
    // Use canvas rendering for all preview URLs and blob URLs
    // Use iframe only for server URLs
    if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('preview://')) {
      return 'canvas';
    }
    return 'iframe';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // PDF.js specific state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  
  // Slideshow state for presentations
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideInterval, setSlideInterval] = useState(5000);

  // Auto-detect content type from filename
  const isPitchDeck = title.toLowerCase().includes('pitch') || 
                     title.toLowerCase().includes('deck') || 
                     title.toLowerCase().includes('presentation');

  // Extract clean title from filename
  const cleanTitle = title.replace(/\.(pdf|PDF)$/, '');
  
  // Auto-generated subtitle
  const getSubtitle = () => {
    const totalPages = numPages || pages;
    if (isPitchDeck) return `${totalPages}-slide presentation ready to view`;
    if (totalPages === 1) return "Document ready to view";
    return `${totalPages}-page document ready to view`;
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load and render PDF using direct PDF.js canvas approach
  const loadPDFDocument = useCallback(async (source: string) => {
    try {
      setIsLoading(true);
      setLoadingProgress(10);
      
      let pdfData: Uint8Array;
      
      if (source.startsWith('preview://')) {
        // Get from global file store
        const fileData = getFileData(source);
        if (!fileData) {
          throw new Error('Preview file data not found');
        }
        console.log('📦 Retrieved from global store:', fileData.byteLength, 'bytes');
        // Clone to prevent detachment
        const clonedData = fileData.slice();
        pdfData = new Uint8Array(clonedData);
      } else if (source.startsWith('blob:') || source.startsWith('data:')) {
        // Fetch blob/data URL
        console.log('🔗 Fetching blob/data URL...');
        const response = await fetch(source);
        const arrayBuffer = await response.arrayBuffer();
        pdfData = new Uint8Array(arrayBuffer);
      } else {
        // Regular URL
        console.log('🌐 Fetching server URL...');
        const response = await fetch(source);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        pdfData = new Uint8Array(arrayBuffer);
      }
      
      setLoadingProgress(30);
      
      // Validate PDF signature
      const signature = String.fromCharCode(...pdfData.slice(0, 4));
      if (signature !== '%PDF') {
        throw new Error(`Invalid PDF signature: ${signature}`);
      }
      
      console.log('📄 Loading PDF with direct PDF.js, size:', pdfData.byteLength, 'signature:', signature);
      setLoadingProgress(50);
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      setPdfDocument(pdf);
      setNumPages(pdf.numPages);
      setLoadingProgress(70);
      
      console.log('✅ PDF loaded successfully! Pages:', pdf.numPages);
      
      // Render the first page to main canvas
      if (canvasRef.current) {
        await renderPage(pdf, 1, canvasRef.current, scale);
      }
      
      setLoadingProgress(100);
      setIsLoading(false);
      
    } catch (error) {
      console.error('❌ Failed to load PDF:', error);
      
      // For preview URLs, we can't fall back to iframe
      if (source.startsWith('preview://') || source.startsWith('blob:') || source.startsWith('data:')) {
        setViewerMethod('error');
      } else {
        console.log('🔄 Falling back to iframe...');
        setViewerMethod('iframe');
        setIsLoading(false);
      }
    }
  }, [scale]);
  
  // Render a specific page to canvas
  const renderPage = useCallback(async (
    pdf: any, 
    pageNum: number, 
    canvas: HTMLCanvasElement | null, 
    renderScale: number = 1.0
  ) => {
    if (!pdf || !canvas) return;
    
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: renderScale, rotation });
      
      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const context = canvas.getContext('2d')!;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      console.log(`✅ Page ${pageNum} rendered to canvas`);
      
    } catch (error) {
      console.error(`❌ Failed to render page ${pageNum}:`, error);
    }
  }, [rotation]);

  // Auto slideshow for pitch decks in modal
  useEffect(() => {
    if (!isPitchDeck || !isPlaying || !numPages || !isModalOpen) return;

    const timer = setInterval(() => {
      setPageNumber(prev => {
        const nextPage = prev + 1;
        if (nextPage > numPages) {
          setIsPlaying(false);
          return 1;
        }
        return nextPage;
      });
    }, slideInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isPitchDeck, numPages, slideInterval, isModalOpen]);

  // Update page number and re-render
  const goToPageHandler = useCallback((newPageNumber: number) => {
    if (!pdfDocument || newPageNumber < 1 || newPageNumber > (numPages || 0)) return;
    
    setPageNumber(newPageNumber);
    
    // Render to both canvases if they exist
    if (canvasRef.current) {
      renderPage(pdfDocument, newPageNumber, canvasRef.current, scale);
    }
    if (modalCanvasRef.current && isModalOpen) {
      renderPage(pdfDocument, newPageNumber, modalCanvasRef.current, scale);
    }
  }, [pdfDocument, numPages, scale, isModalOpen, renderPage]);

  // Update scale and re-render current page
  const updateScale = useCallback((newScale: number) => {
    setScale(newScale);
    if (pdfDocument) {
      if (canvasRef.current) {
        renderPage(pdfDocument, pageNumber, canvasRef.current, newScale);
      }
      if (modalCanvasRef.current && isModalOpen) {
        renderPage(pdfDocument, pageNumber, modalCanvasRef.current, newScale);
      }
    }
  }, [pdfDocument, pageNumber, isModalOpen, renderPage]);

  // Initialize PDF loading
  useEffect(() => {
    console.log('🔧 PDF Component initialized:', { url, viewerMethod });
    
    // Load PDF for canvas rendering
    if ((url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('preview://')) && viewerMethod === 'canvas') {
      console.log('📡 Loading for canvas rendering...');
      loadPDFDocument(url);
    }
    
    // For iframe method (server URLs), handle loading
    if (viewerMethod === 'iframe' && !url.startsWith('blob:') && !url.startsWith('data:') && !url.startsWith('preview://')) {
      console.log('🖼️ Using iframe for server URL');
      setIsLoading(false);
      
      // Add timeout for iframe loading
      const timeout = setTimeout(() => {
        console.log('⏰ Iframe loading timeout, switching to canvas...');
        setViewerMethod('canvas');
        loadPDFDocument(url);
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
    
    // Handle Edge browser blob URL issues
    if (url.startsWith('blob:') && navigator.userAgent.includes('Edg') && viewerMethod === 'iframe') {
      console.log('🔵 Edge detected with blob URL, switching to canvas...');
      setViewerMethod('canvas');
      loadPDFDocument(url);
    }
    
    // Auto-load server URLs with canvas if needed
    if (url && viewerMethod === 'canvas' && !url.startsWith('blob:') && !url.startsWith('data:') && !url.startsWith('preview://')) {
      console.log('📡 Loading server URL for canvas...');
      loadPDFDocument(url);
    }
    
  }, [url, viewerMethod, loadPDFDocument]);

  // Navigation controls
  const goToPrevPage = () => {
    const newPage = Math.max(1, pageNumber - 1);
    goToPageHandler(newPage);
  };
  
  const goToNextPage = () => {
    const newPage = Math.min(numPages || pages, pageNumber + 1);
    goToPageHandler(newPage);
  };
  
  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(numPages || pages, page));
    goToPageHandler(newPage);
  };
  
  const zoomIn = () => updateScale(Math.min(3.0, scale + 0.2));
  const zoomOut = () => updateScale(Math.max(0.5, scale - 0.2));
  const resetZoom = () => updateScale(1.0);
  
  const rotate = () => {
    setRotation(rot => (rot + 90) % 360);
    // Re-render current page with new rotation
    if (pdfDocument) {
      if (canvasRef.current) {
        renderPage(pdfDocument, pageNumber, canvasRef.current, scale);
      }
      if (modalCanvasRef.current && isModalOpen) {
        renderPage(pdfDocument, pageNumber, modalCanvasRef.current, scale);
      }
    }
  };

  // Handle iframe events
  const handleIframeLoad = () => {
    console.log('✅ Iframe loaded successfully for URL:', url);
    setIsLoading(false);
    setLoadingProgress(100);
  };

  const handleIframeError = () => {
    console.log('❌ Iframe failed for URL:', url);
    console.log('🔄 Switching to canvas...');
    setViewerMethod('canvas');
    loadPDFDocument(url);
  };

  // Responsive scale calculation
  const getResponsiveScale = () => {
    if (typeof window === 'undefined') return scale;
    const containerWidth = Math.min(window.innerWidth - 64, 1000);
    const defaultPageWidth = 612;
    const baseScale = Math.min(containerWidth / defaultPageWidth, scale);
    return Math.max(0.8, baseScale);
  };

  // Initialize PDF data on modal open
  useEffect(() => {
    if (isModalOpen && viewerMethod === 'canvas' && !pdfDocument) {
      console.log('🔄 Loading PDF for modal...');
      setIsLoading(true);
      setLoadingProgress(0);
      loadPDFDocument(url);
    }
    
    // Re-render to modal canvas when modal opens and we have a document
    if (isModalOpen && pdfDocument && modalCanvasRef.current) {
      renderPage(pdfDocument, pageNumber, modalCanvasRef.current, scale);
    }
  }, [isModalOpen, viewerMethod, pdfDocument, url, loadPDFDocument, pageNumber, scale, renderPage]);

  const activeThumbnails = thumbnails.length > 0 ? thumbnails : [];
  const activeCoverThumbnail = thumbnails[0] || null;

  return (
    <>
      <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderColor: theme.colors.border }}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" style={{ color: theme.colors.primary }} />
                <Badge variant="secondary" className="text-xs">
                  {isPitchDeck ? "PRESENTATION" : "DOCUMENT"}
                </Badge>
                {metadata?.size && (
                  <Badge variant="outline" className="text-xs">
                    {metadata.size}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{cleanTitle}</h3>
              <p className="text-sm text-gray-600">{getSubtitle()}</p>
            </div>
            <div className="flex gap-2">
              {onShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShare}
                  className="p-2"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="p-2"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div className="relative">
            {isLoading && (
              <div className="flex items-center justify-center py-20 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                  <p className="text-gray-600">Loading PDF...</p>
                  <Progress value={loadingProgress} className="w-48 mt-4" />
                </div>
              </div>
            )}

            {/* Canvas Viewer */}
            {!isLoading && viewerMethod === 'canvas' && (
              <div className="w-full flex justify-center py-4">
                <div className="text-center">
                  <canvas
                    ref={canvasRef}
                    className="shadow-lg border border-gray-300 max-w-full h-auto"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  {numPages && numPages > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {pageNumber} of {numPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Iframe Viewer */}
            {!isLoading && viewerMethod === 'iframe' && (
              <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={url}
                  className="w-full h-full"
                  title={title}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              </div>
            )}

            {/* Error State */}
            {viewerMethod === 'error' && (
              <div className="flex items-center justify-center py-20 bg-red-50 rounded-lg">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">Unable to load PDF</p>
                  <p className="text-red-500 text-sm mt-2">
                    The PDF file could not be displayed. You can try downloading it instead.
                  </p>
                  {onDownload && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDownload}
                      className="mt-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="flex items-center gap-2"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Eye className="w-5 h-5" />
              {isPitchDeck ? 'View Presentation' : 'View Document'}
              <Expand className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">{cleanTitle}</DialogTitle>
              <div className="flex items-center gap-2">
                {/* Canvas viewer controls */}
                {viewerMethod === 'canvas' && pdfDocument && (
                  <>
                    <div className="flex items-center gap-2 mr-4">
                      <Button variant="outline" size="sm" onClick={zoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">{Math.round(scale * 100)}%</span>
                      <Button variant="outline" size="sm" onClick={zoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={rotate}>
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {numPages && numPages > 1 && (
                      <div className="flex items-center gap-2 mr-4">
                        <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm whitespace-nowrap">
                          {pageNumber} / {numPages}
                        </span>
                        <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        
                        {isPitchDeck && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="ml-2"
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
                
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto p-4">
            {/* Canvas Viewer in Modal */}
            {viewerMethod === 'canvas' && (
              <div className="w-full flex justify-center">
                <canvas
                  ref={modalCanvasRef}
                  className="shadow-lg border border-gray-300 max-w-full h-auto"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            )}
            
            {/* Iframe Viewer in Modal */}
            {viewerMethod === 'iframe' && (
              <iframe
                src={url}
                className="w-full h-full border border-gray-300 rounded-lg"
                title={title}
              />
            )}
            
            {/* Error State in Modal */}
            {viewerMethod === 'error' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 font-medium text-lg">Unable to load PDF</p>
                  <p className="text-red-500 mt-2">
                    The PDF file could not be displayed. You can try downloading it instead.
                  </p>
                  {onDownload && (
                    <Button
                      variant="outline"
                      onClick={onDownload}
                      className="mt-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
