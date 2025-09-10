import React, { useState, useCallback, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { PDFThumbnailGenerator, usePDFThumbnails } from "../../utils/pdfThumbnailGenerator";
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
  showThumbnailFirst?: boolean; // New prop to control initial display
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

  // Disable automatic thumbnail generation to prevent errors and flickering
  // Use only provided thumbnails or simple placeholders
  const generatedThumbnails: any[] = [];
  const coverThumbnail = null;
  const isGeneratingThumbnails = false;
  const thumbnailProgress = 0;
  const thumbnailError = null;
  const regenerateThumbnails = () => {};

  // Use provided thumbnails or create simple placeholder
  const activeThumbnails = thumbnails.length > 0 
    ? thumbnails 
    : []; // No fallback thumbnails to prevent errors

  const activeCoverThumbnail = thumbnails[0] || null;

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

  // Initialize PDF data properly based on URL type
  useEffect(() => {
    console.log('🔧 PDF Component initialized:', { url, viewerMethod, pdfData: !!pdfData });
    
    // For blob URLs, data URLs, or preview URLs, use PDF.js directly
    if ((url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('preview://')) && viewerMethod === 'pdfjs' && !pdfData) {
      console.log('📡 Loading preview/blob/data URL for PDF.js...');
      
      // Check if we have ArrayBuffer data for preview URLs
      if (url.startsWith('preview://')) {
        const fileData = getFileData(url);
        if (fileData) {
          console.log('✅ Using ArrayBuffer data from global store, size:', fileData.byteLength, 'bytes');
          // Clone the ArrayBuffer to prevent detachment issues
          const clonedData = fileData.slice();
          const uint8Array = new Uint8Array(clonedData);
          console.log('📄 PDF signature check:', String.fromCharCode(...uint8Array.slice(0, 4)));
          setPdfData(uint8Array);
        } else {
          console.error('❌ No file data found for preview URL:', url);
          setViewerMethod('error');
        }
      } else {
        setPdfData(url); // PDF.js can handle blob and data URLs directly
      }
      
      setIsLoading(false);
      
      // Add timeout to catch if PDF.js doesn't respond
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log('⏰ PDF.js loading timeout, switching to error state...');
          setViewerMethod('error');
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeout);
    }
    
    // Add timeout for iframe loading (non-blob URLs)
    if (viewerMethod === 'iframe' && !url.startsWith('blob:')) {
      const timeout = setTimeout(() => {
        console.log('⏰ Iframe loading timeout, switching to PDF.js...');
        setViewerMethod('pdfjs');
        if (!pdfData) {
          validateAndLoadPdf(url);
        }
      }, 8000); // 8 second timeout for iframe
      
      return () => clearTimeout(timeout);
    }
    
    // For server URLs with PDF.js
    if (url && viewerMethod === 'pdfjs' && !pdfData && !url.startsWith('blob:')) {
      console.log('📡 Loading server URL for PDF.js...');
      validateAndLoadPdf(url);
    }
  }, [url, viewerMethod, pdfData, validateAndLoadPdf]);

  // Debug pdfData when it changes
  useEffect(() => {
    if (pdfData) {
      console.log('🎯 PDF data changed:', {
        dataType: typeof pdfData,
        isUint8Array: pdfData instanceof Uint8Array,
        isString: typeof pdfData === 'string',
        length: pdfData?.length || 'unknown',
        firstBytes: pdfData instanceof Uint8Array ? String.fromCharCode(...pdfData.slice(0, 4)) : 'not Uint8Array',
        preview: typeof pdfData === 'string' ? pdfData.substring(0, 50) : 'not string'
      });
    }
  }, [pdfData]);

  // PDF.js event handlers
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('✅ PDF.js loaded successfully, pages:', numPages, 'URL:', url);
    setNumPages(numPages);
    setIsLoading(false);
    setLoadingProgress(100);
  }, [url]);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('❌ PDF.js failed:', error.message, error);
    console.log('📝 PDF data type:', typeof pdfData, 'Has data:', !!pdfData);
    console.log('📝 URL:', url);
    
    // For preview URLs, we can't fall back to iframe, so show error
    if (url.startsWith('preview://')) {
      console.log('� Preview URL cannot use iframe, showing error...');
      setViewerMethod('error');
    } else {
      console.log('�🔄 Falling back to iframe mode...');
      setViewerMethod('iframe');
    }
    setIsLoading(false);
  }, [pdfData, url]);

  // Navigation controls
  const goToPrevPage = () => setPageNumber(page => Math.max(1, page - 1));
  const goToNextPage = () => setPageNumber(page => Math.min(numPages || pages, page + 1));
  const goToPage = (page: number) => setPageNumber(Math.max(1, Math.min(numPages || pages, page)));
  const zoomIn = () => setScale(scale => Math.min(3.0, scale + 0.2));
  const zoomOut = () => setScale(scale => Math.max(0.5, scale - 0.2));
  const resetZoom = () => setScale(1.0);
  const rotate = () => setRotation(rot => (rot + 90) % 360);

  // Handle iframe events
  const handleIframeLoad = () => {
    console.log('✅ Iframe loaded successfully for URL:', url);
    setIsLoading(false);
    setLoadingProgress(100);
  };

  const handleIframeError = () => {
    console.log('❌ Iframe failed for URL:', url);
    console.log('🔄 Switching to error state...');
    setViewerMethod('error');
    setIsLoading(false);
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
    if (isModalOpen && !pdfData) {
      setIsLoading(true);
      setLoadingProgress(0);
      validateAndLoadPdf(url);
    }
  }, [isModalOpen, pdfData, url, validateAndLoadPdf]);

  // Thumbnail Preview Component
  const ThumbnailPreview = () => (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => setIsModalOpen(true)}
      style={{ backgroundColor: theme.colors.surface }}
    >
      {/* Preview Container - Fixed height for consistent thumbnail experience */}
      <div className="relative h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {isGeneratingThumbnails && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: theme.colors.primary }} />
            <p className="text-sm text-gray-600 mb-2">Generating preview...</p>
            <Progress value={thumbnailProgress} className="w-32" />
          </div>
        )}

        {activeCoverThumbnail ? (
          <img 
            src={activeCoverThumbnail} 
            alt={`${cleanTitle} preview`}
            className="w-full h-full object-contain bg-white"
          />
        ) : !isGeneratingThumbnails ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-4"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <FileText className="w-10 h-10" style={{ color: theme.colors.surface }} />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">{cleanTitle}</p>
            <p className="text-sm text-gray-500 mb-3">{pages} pages • {metadata?.size}</p>
            
            {thumbnailError && (
              <div className="text-center">
                <p className="text-xs text-red-600 mb-2">Preview generation failed</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    regenerateThumbnails();
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            )}
          </div>
        ) : null}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Button
              size="lg"
              className="px-6 py-3 text-lg font-semibold shadow-xl"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.surface
              }}
            >
              <Expand className="w-5 h-5 mr-2" />
              Expand to Full View
            </Button>
          </div>
        </div>

        {/* Content Type Badge */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant="secondary"
            className="bg-black/70 text-white border-0 backdrop-blur-sm"
          >
            PDF • {pages} pages
          </Badge>
        </div>

        {/* Thumbnail Status */}
        {activeThumbnails.length > 1 && (
          <div className="absolute bottom-4 left-4">
            <Badge 
              variant="secondary"
              className="bg-white/90 text-gray-800 border-0 backdrop-blur-sm text-xs"
            >
              {activeThumbnails.length} previews ready
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 sm:p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: theme.colors.textPrimary }}>
          {cleanTitle}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {getSubtitle()}
        </p>

        {isPitchDeck && (
          <Badge 
            variant="secondary"
            className="mb-4"
            style={{ 
              backgroundColor: theme.colors.success + '15',
              color: theme.colors.success,
              border: `1px solid ${theme.colors.success}30`
            }}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Presentation
          </Badge>
        )}

        <div className="flex gap-2 sm:gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            variant="outline"
            className="flex-1"
            style={{
              borderColor: theme.colors.primary,
              color: theme.colors.primary
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.();
            }}
            className="flex-1"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.surface
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section 
      className="py-6 sm:py-8 lg:py-12"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-2"
            style={{ color: theme.colors.textPrimary }}
          >
            {cleanTitle}
          </h1>
          
          <p 
            className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 opacity-80 px-4"
            style={{ color: theme.colors.textSecondary }}
          >
            {getSubtitle()}
          </p>

          {isPitchDeck && (
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Badge 
                variant="secondary"
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full"
                style={{ 
                  backgroundColor: theme.colors.success + '15',
                  color: theme.colors.success,
                  border: `1px solid ${theme.colors.success}30`
                }}
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {numPages || pages} Slides
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showThumbnailFirst ? <ThumbnailPreview /> : (
          // Direct full view (original behavior)
          <Card 
            className="overflow-hidden shadow-lg sm:shadow-xl relative"
            style={{ backgroundColor: theme.colors.surface }}
          >
            {/* Progress Bar */}
            {isLoading && (
              <div className="absolute top-0 left-0 right-0 z-50">
                <Progress value={loadingProgress} className="h-1" />
              </div>
            )}

            {/* PDF Viewer Container with responsive heights */}
            <div className={`bg-gray-100 flex items-center justify-center overflow-auto relative ${
              isMobile 
                ? 'h-[70vh]' // Mobile: 70vh
                : 'h-[80vh] max-h-[800px]' // Desktop: 80vh with 800px max
            } min-h-[500px]`}>
              <iframe
                src={url}
                width="100%"
                height="100%"
                style={{ 
                  border: 'none',
                  height: isMobile ? '70vh' : '80vh',
                  maxHeight: '800px',
                  minHeight: '500px'
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`PDF: ${cleanTitle}`}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                    <p className="text-gray-600">Loading PDF viewer...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Full Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 overflow-hidden">
          <DialogHeader className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: theme.colors.primary }} />
              {cleanTitle}
            </DialogTitle>
            
            {/* Modal Controls */}
            <div className="flex items-center gap-2">
              {isPitchDeck && numPages && (
                <>
                  <Button
                    onClick={() => setPageNumber(1)}
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === 1}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={goToPrevPage}
                    variant="outline"
                    size="sm"
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm font-medium px-3 py-1 bg-white rounded border min-w-[80px] text-center">
                    {pageNumber} / {numPages}
                  </span>
                  
                  <Button
                    onClick={goToNextPage}
                    variant="outline"
                    size="sm"
                    disabled={pageNumber >= numPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setPageNumber(numPages)}
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === numPages}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant="outline"
                    size="sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => window.open(url, '_blank')}
                variant="outline"
                size="sm"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Modal PDF Viewer - Full 90vh height */}
          <div className="h-[90vh] bg-gray-100 flex items-center justify-center overflow-auto relative">
            {/* Debug info */}
            <div className="absolute top-2 left-2 bg-black text-white p-2 text-xs z-50 rounded">
              Debug: isLoading={isLoading.toString()}, viewerMethod={viewerMethod}, pdfData={!!pdfData ? 'yes' : 'no'}
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                  <p className="text-gray-600">Loading PDF...</p>
                  <Progress value={loadingProgress} className="w-48 mt-4" />
                </div>
              </div>
            )}
            
            {!isLoading && viewerMethod === 'iframe' && (
              <iframe
                src={url}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`PDF Modal: ${cleanTitle}`}
                sandbox="allow-same-origin allow-scripts allow-downloads allow-forms"
              />
            )}

            {!isLoading && viewerMethod === 'pdfjs' && pdfData && (
              <div className="w-full flex justify-center py-4">
                <div className="text-center">
                  <p className="mb-4">Testing PDF.js Document loading...</p>
                  <Document
                    file={{ data: pdfData }}
                    onLoadSuccess={(pdf) => {
                      console.log('✅ PDF Document loaded successfully! Pages:', pdf.numPages);
                      setNumPages(pdf.numPages);
                      setIsLoading(false);
                      setLoadingProgress(100);
                    }}
                    onLoadError={(error) => {
                      console.error('❌ PDF Document failed to load:', error);
                      setViewerMethod('error');
                      setIsLoading(false);
                    }}
                    loading={
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                          <p className="text-gray-600">Loading PDF Document...</p>
                          <Progress value={loadingProgress} className="w-48 mt-4" />
                        </div>
                      </div>
                    }
                  >
                    {numPages && (
                      <div className="text-center p-4">
                        <p className="text-green-600 font-semibold">✅ PDF loaded successfully!</p>
                        <p>Document has {numPages} pages</p>
                        <p className="text-sm text-gray-600">Click below to view the first page</p>
                        <div className="mt-4">
                          <Page
                            pageNumber={1}
                            scale={0.8}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onLoadSuccess={() => console.log('✅ Page 1 loaded successfully!')}
                            onLoadError={(error) => console.error('❌ Page 1 failed:', error)}
                          />
                        </div>
                      </div>
                    )}
                  </Document>
                </div>
              </div>
            )}

            {!isLoading && viewerMethod === 'error' && (
              <div className="flex flex-col items-center justify-center py-20">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Unable to display PDF</h3>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  The PDF viewer is having trouble loading this document. You can still access it using the options below.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.open(url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Open in New Tab
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={onDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                  <p className="text-gray-600">Loading full PDF viewer...</p>
                  <Progress value={loadingProgress} className="w-48 mt-4" />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Buttons - Mobile Responsive */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            onClick={onDownload}
            size="lg"
            className="w-full sm:flex-1 sm:max-w-xs px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.surface
            }}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Download PDF
          </Button>

          {onShare && (
            <Button
              onClick={onShare}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary
              }}
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
