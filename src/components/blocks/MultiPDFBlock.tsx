import React, { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { PDFThumbnailGenerator } from "../../utils/pdfThumbnailGenerator";
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
  Grid,
  List,
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw
} from "lucide-react";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

interface PDFFile {
  id: string;
  name: string;
  url: string;
  size: string;
  pages: number;
  thumbnails: string[];
  isPitchDeck?: boolean;
  coverPage?: string;
  metadata?: {
    author?: string;
    created?: string;
    modified?: string;
  };
}

interface MultiPDFBlockProps {
  files: PDFFile[];
  onDownload?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
  autoPlay?: boolean;
  showThumbnails?: boolean;
}

export default function MultiPDFBlock({ 
  files, 
  onDownload,
  onShare,
  autoPlay = false,
  showThumbnails = true 
}: MultiPDFBlockProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Multi-file state
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(files[0] || null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('single');
  const [isMobile, setIsMobile] = useState(false);
  
  // Viewer state
  const [viewerMethod, setViewerMethod] = useState<'iframe' | 'pdfjs' | 'error'>('iframe');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // PDF.js specific state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.3);
  const [rotation, setRotation] = useState(0);
  const [pdfData, setPdfData] = useState<string | Uint8Array | null>(null);
  
  // Presentation/slideshow state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [slideInterval, setSlideInterval] = useState(5000); // 5 seconds
  const [thumbnailPosition, setThumbnailPosition] = useState<'bottom' | 'left'>('bottom');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setThumbnailPosition(window.innerWidth < 768 ? 'bottom' : 'left');
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slideshow for pitch decks
  useEffect(() => {
    if (!selectedFile?.isPitchDeck || !isPlaying || !numPages) return;

    const timer = setInterval(() => {
      setPageNumber(prev => {
        if (prev >= numPages) {
          setIsPlaying(false);
          return 1;
        }
        return prev + 1;
      });
    }, slideInterval);

    return () => clearInterval(timer);
  }, [isPlaying, selectedFile?.isPitchDeck, numPages, slideInterval]);

  // Extract clean title and detect content type
  const getFileInfo = (file: PDFFile) => {
    const cleanTitle = file.name.replace(/\.(pdf|PDF)$/, '');
    const isPitchDeck = file.isPitchDeck || 
                       cleanTitle.toLowerCase().includes('pitch') || 
                       cleanTitle.toLowerCase().includes('deck') || 
                       cleanTitle.toLowerCase().includes('presentation');
    
    const subtitle = isPitchDeck 
      ? `${file.pages}-slide presentation ready to view`
      : file.pages === 1 
        ? "Document ready to view"
        : `${file.pages}-page document ready to view`;

    return { cleanTitle, isPitchDeck, subtitle };
  };

  // Validate and load PDF for PDF.js
  const validateAndLoadPdf = useCallback(async (pdfUrl: string) => {
    try {
      setLoadingProgress(20);
      if (pdfUrl.startsWith('blob:')) {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status}`);
        
        setLoadingProgress(50);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Check PDF signature
        const signature = String.fromCharCode(...uint8Array.slice(0, 4));
        if (signature !== '%PDF') throw new Error('Invalid PDF format');
        
        setLoadingProgress(80);
        setPdfData(uint8Array);
        return true;
      } else {
        setPdfData(pdfUrl);
        return true;
      }
    } catch (error) {
      console.error('❌ PDF validation failed:', error);
      setViewerMethod('error');
      return false;
    } finally {
      setLoadingProgress(100);
    }
  }, []);

  // PDF.js event handlers
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadingProgress(100);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('❌ PDF.js failed:', error.message);
    setViewerMethod('error');
    setIsLoading(false);
  }, []);

  // Navigation controls
  const goToPrevPage = () => setPageNumber(page => Math.max(1, page - 1));
  const goToNextPage = () => setPageNumber(page => Math.min(numPages || selectedFile?.pages || 1, page + 1));
  const goToPage = (page: number) => setPageNumber(Math.max(1, Math.min(numPages || selectedFile?.pages || 1, page)));
  const zoomIn = () => setScale(scale => Math.min(3.0, scale + 0.2));
  const zoomOut = () => setScale(scale => Math.max(0.5, scale - 0.2));
  const resetZoom = () => setScale(1.3);
  const rotate = () => setRotation(rot => (rot + 90) % 360);

  // File selection
  const selectFile = (file: PDFFile) => {
    setSelectedFile(file);
    setPageNumber(1);
    setIsLoading(true);
    setLoadingProgress(0);
    setViewerMethod('iframe');
    
    // For blob URLs, validate in background for PDF.js fallback
    if (file.url.startsWith('blob:')) {
      validateAndLoadPdf(file.url);
    }
  };

  // Responsive scale calculation
  const getResponsiveScale = () => {
    if (typeof window === 'undefined') return scale;
    const containerWidth = Math.min(window.innerWidth - (showThumbnails ? 280 : 64), 1000);
    const defaultPageWidth = 612;
    const baseScale = Math.min(containerWidth / defaultPageWidth, scale);
    return Math.max(0.8, baseScale);
  };

  // Handle iframe events
  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadingProgress(100);
  };

  const handleIframeError = () => {
    setViewerMethod('pdfjs');
    if (!pdfData && selectedFile) {
      validateAndLoadPdf(selectedFile.url);
    }
  };

  if (!selectedFile) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No PDFs available</p>
      </div>
    );
  }

  const { cleanTitle, isPitchDeck, subtitle } = getFileInfo(selectedFile);

  return (
    <section 
      className="py-6 sm:py-8 lg:py-12 overflow-hidden"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
      ref={containerRef}
    >
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Multiple files indicator */}
          {files.length > 1 && (
            <div className="flex items-center justify-center mb-4">
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
                variant="outline"
                size="sm"
                className="mr-4"
              >
                {viewMode === 'grid' ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    View Selected
                  </>
                ) : (
                  <>
                    <Grid className="w-4 h-4 mr-2" />
                    View All ({files.length})
                  </>
                )}
              </Button>
              
              <Badge 
                variant="secondary"
                className="px-3 py-1.5 text-sm"
                style={{ 
                  backgroundColor: theme.colors.primary + '15',
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}30`
                }}
              >
                {files.length} PDF{files.length !== 1 ? 's' : ''} • {files.reduce((acc, f) => acc + f.pages, 0)} Total Pages
              </Badge>
            </div>
          )}

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
            {subtitle}
          </p>

          {isPitchDeck && (
            <div className="flex items-center justify-center mb-6 sm:mb-8 gap-4">
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
                {numPages || selectedFile.pages} Slides
              </Badge>

              {/* Slideshow Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                  size="sm"
                  className="px-3 py-1.5"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
                
                <select
                  value={slideInterval}
                  onChange={(e) => setSlideInterval(Number(e.target.value))}
                  className="text-xs bg-white border rounded px-2 py-1"
                >
                  <option value={3000}>3s</option>
                  <option value={5000}>5s</option>
                  <option value={10000}>10s</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid View - Multiple PDFs */}
      {viewMode === 'grid' && files.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {files.map((file) => {
              const { cleanTitle: fileTitle, isPitchDeck: filePitch } = getFileInfo(file);
              
              return (
                <Card 
                  key={file.id}
                  className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedFile?.id === file.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => {
                    selectFile(file);
                    setViewMode('single');
                  }}
                  style={{ backgroundColor: theme.colors.surface }}
                >
                  {/* Cover Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {file.coverPage ? (
                      <img 
                        src={file.coverPage} 
                        alt={`${fileTitle} cover`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* File type indicator */}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant="secondary"
                        className="text-xs bg-black/70 text-white border-0"
                      >
                        PDF
                      </Badge>
                    </div>

                    {/* Quick preview on hover */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/90 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium">
                        Click to preview
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: theme.colors.textPrimary }}>
                      {fileTitle}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{file.pages} pages</span>
                      <span>{file.size}</span>
                    </div>

                    {filePitch && (
                      <Badge 
                        variant="secondary"
                        className="text-xs w-full justify-center py-1"
                        style={{ 
                          backgroundColor: theme.colors.success + '15',
                          color: theme.colors.success,
                        }}
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Presentation
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Single View - PDF Viewer */}
      {viewMode === 'single' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex gap-6 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            
            {/* Thumbnail Navigation - Left/Bottom */}
            {showThumbnails && (selectedFile.thumbnails.length > 0 || numPages) && (
              <div className={`${
                thumbnailPosition === 'left' 
                  ? 'w-64 flex-shrink-0' 
                  : 'w-full order-2'
              }`}>
                <div className={`${
                  thumbnailPosition === 'left' 
                    ? 'space-y-2 max-h-[80vh] overflow-y-auto' 
                    : 'flex gap-2 overflow-x-auto pb-2'
                }`}>
                  {/* Page thumbnails */}
                  {Array.from({ length: numPages || selectedFile.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`${
                        thumbnailPosition === 'left' ? 'w-full aspect-[3/4]' : 'w-16 h-20 flex-shrink-0'
                      } border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                        pageNumber === page 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">{page}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main PDF Viewer */}
            <div className="flex-1 min-w-0">
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

                {/* PDF Controls */}
                {viewerMethod === 'pdfjs' && numPages && (
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        
                        <span className="text-sm font-medium px-3 py-1 bg-white rounded border min-w-[100px] text-center">
                          {pageNumber} of {numPages}
                        </span>
                        
                        <Button
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>

                        {isPitchDeck && (
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
                              onClick={() => setPageNumber(numPages)}
                              variant="outline"
                              size="sm"
                              disabled={pageNumber === numPages}
                            >
                              <SkipForward className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button onClick={zoomOut} variant="outline" size="sm" disabled={scale <= 0.5}>
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button onClick={resetZoom} variant="outline" size="sm" className="text-xs px-2 min-w-[60px]">
                          {Math.round(getResponsiveScale() * 100)}%
                        </Button>
                        <Button onClick={zoomIn} variant="outline" size="sm" disabled={scale >= 3.0}>
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button onClick={rotate} variant="outline" size="sm">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => window.open(selectedFile.url, '_blank')} variant="outline" size="sm">
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile viewport indicators */}
                    {isMobile && (
                      <div className="flex items-center justify-center mt-3 gap-2">
                        <Button 
                          variant={scale === 0.8 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setScale(0.8)}
                          className="text-xs"
                        >
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobile
                        </Button>
                        <Button 
                          variant={scale === 1.0 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setScale(1.0)}
                          className="text-xs"
                        >
                          <Tablet className="w-3 h-3 mr-1" />
                          Tablet
                        </Button>
                        <Button 
                          variant={scale === 1.3 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setScale(1.3)}
                          className="text-xs"
                        >
                          <Monitor className="w-3 h-3 mr-1" />
                          Desktop
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* PDF Viewer Container */}
                <div className={`bg-gray-100 flex items-center justify-center overflow-auto relative ${
                  isMobile 
                    ? 'h-[70vh]' // Mobile: 70vh for better scrolling experience
                    : 'h-[80vh] max-h-[800px]' // Desktop: 80vh with 800px max
                } min-h-[500px]`}>
                  {viewerMethod === 'iframe' && (
                    <div className={`w-full bg-white relative ${
                      isMobile 
                        ? 'h-[70vh]' // Mobile: 70vh
                        : 'h-[80vh] max-h-[800px]' // Desktop: 80vh with 800px max
                    } min-h-[500px]`}>
                      <iframe
                        src={selectedFile.url}
                        width="100%"
                        height="100%"
                        style={{ 
                          border: 'none',
                          height: typeof window !== 'undefined' 
                            ? window.innerWidth < 768 ? '70vh' : '80vh'
                            : '70vh',
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
                            <p className="text-xs text-gray-500 mt-2">Page {pageNumber} of {selectedFile.pages}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {viewerMethod === 'pdfjs' && pdfData && (
                    <div className="w-full flex justify-center py-4">
                      <Document
                        file={pdfData}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                              <p className="text-gray-600">Rendering PDF...</p>
                              <Progress value={loadingProgress} className="w-48 mt-4" />
                            </div>
                          </div>
                        }
                        className="flex justify-center"
                      >
                        <Page
                          pageNumber={pageNumber}
                          scale={getResponsiveScale()}
                          rotate={rotation}
                          className="shadow-lg border border-gray-300 max-w-full"
                          loading={
                            <div className="w-full h-96 bg-white border border-gray-300 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin" style={{ color: theme.colors.primary }} />
                            </div>
                          }
                        />
                      </Document>
                    </div>
                  )}

                  {viewerMethod === 'error' && (
                    <div className="text-center p-8 max-w-md">
                      <div 
                        className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <FileText className="w-12 h-12" style={{ color: theme.colors.surface }} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{cleanTitle}</h3>
                      <p className="text-lg text-gray-700 mb-8">
                        Unable to display PDF inline. Open in new tab to view.
                      </p>
                      <div className="space-y-4">
                        <Button
                          onClick={() => window.open(selectedFile.url, '_blank')}
                          className="w-full text-lg py-4"
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.surface
                          }}
                        >
                          <Eye className="w-5 h-5 mr-3" />
                          Open PDF Viewer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-600">
                        {numPages || selectedFile.pages} {(numPages || selectedFile.pages) === 1 ? 'page' : 'pages'} • {selectedFile.size}
                      </p>
                      {files.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          File {files.findIndex(f => f.id === selectedFile.id) + 1} of {files.length}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        onClick={() => window.open(selectedFile.url, '_blank')}
                        variant="outline"
                        className="flex-1 sm:flex-none text-sm py-2"
                        style={{
                          borderColor: theme.colors.primary,
                          color: theme.colors.primary
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      
                      <Button
                        onClick={() => onDownload?.(selectedFile.id)}
                        className="flex-1 sm:flex-none text-sm py-2"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.surface
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      
                      {onShare && (
                        <Button
                          onClick={() => onShare(selectedFile.id)}
                          variant="outline"
                          size="sm"
                          className="px-3"
                          style={{
                            borderColor: theme.colors.border,
                            color: theme.colors.textSecondary
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* File Navigation - Multiple files */}
              {files.length > 1 && viewMode === 'single' && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    onClick={() => {
                      const currentIndex = files.findIndex(f => f.id === selectedFile.id);
                      const prevFile = files[currentIndex - 1];
                      if (prevFile) selectFile(prevFile);
                    }}
                    variant="outline"
                    disabled={files.findIndex(f => f.id === selectedFile.id) === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous PDF
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      PDF {files.findIndex(f => f.id === selectedFile.id) + 1} of {files.length}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      const currentIndex = files.findIndex(f => f.id === selectedFile.id);
                      const nextFile = files[currentIndex + 1];
                      if (nextFile) selectFile(nextFile);
                    }}
                    variant="outline"
                    disabled={files.findIndex(f => f.id === selectedFile.id) === files.length - 1}
                    className="flex items-center gap-2"
                  >
                    Next PDF
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - Mobile Responsive */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            onClick={() => onDownload?.(selectedFile.id)}
            size="lg"
            className="w-full sm:flex-1 sm:max-w-xs px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.surface
            }}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Download {files.length > 1 ? 'Selected' : 'PDF'}
          </Button>

          {files.length > 1 && (
            <Button
              onClick={() => {
                // Download all logic
                files.forEach(file => onDownload?.(file.id));
              }}
              variant="outline"
              size="lg"
              className="w-full sm:flex-1 sm:max-w-xs px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.surface,
                color: theme.colors.primary
              }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Download All ({files.length})
            </Button>
          )}

          {onShare && (
            <Button
              onClick={() => onShare(selectedFile.id)}
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
              <span className="hidden sm:inline">Share</span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
