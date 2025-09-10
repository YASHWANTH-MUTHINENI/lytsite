import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
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
  Loader2
} from "lucide-react";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Import PDF.js CSS
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PDFBlockProps {
  title: string;
  url: string;
  pages: number;
  thumbnails: string[];
  onDownload?: () => void;
  metadata?: {
    size: string;
    author?: string;
    created?: string;
  };
}

export default function PDFBlock({ 
  title, 
  url, 
  pages, 
  thumbnails, 
  onDownload,
  metadata 
}: PDFBlockProps) {
  const { theme } = useTheme();
  
  // PDF.js state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pageWidth, setPageWidth] = useState<number | null>(null);

  // Auto-detect content type from filename
  const isPitchDeck = title.toLowerCase().includes('pitch') || 
                     title.toLowerCase().includes('deck') || 
                     title.toLowerCase().includes('presentation');

  // Extract clean title from filename
  const cleanTitle = title.replace(/\.(pdf|PDF)$/, '');
  
  // Auto-generated subtitle
  const getSubtitle = () => {
    if (isPitchDeck) return `${numPages || pages}-slide presentation ready to view`;
    if ((numPages || pages) === 1) return "Document ready to view";
    return `${numPages || pages}-page document ready to view`;
  };

  // PDF.js event handlers
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
    setHasError(true);
    setIsLoading(false);
  }, []);

  const onPageLoadSuccess = useCallback((page: any) => {
    setPageWidth(page.width);
  }, []);

  // Navigation controls
  const goToPrevPage = () => {
    setPageNumber(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(numPages || pages, page + 1));
  };

  const goToPage = (page: number) => {
    setPageNumber(Math.min(Math.max(1, page), numPages || pages));
  };

  // Zoom controls
  const zoomIn = () => {
    setScale(scale => Math.min(3.0, scale + 0.2));
  };

  const zoomOut = () => {
    setScale(scale => Math.max(0.5, scale - 0.2));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  // Rotation control
  const rotate = () => {
    setRotation(rot => (rot + 90) % 360);
  };

  // Responsive scale calculation
  const getResponsiveScale = () => {
    if (typeof window === 'undefined') return scale;
    
    const containerWidth = Math.min(window.innerWidth - 64, 800); // Max width with padding
    const defaultPageWidth = pageWidth || 612; // Standard PDF page width
    const responsiveScale = Math.min(containerWidth / defaultPageWidth, scale);
    
    return responsiveScale;
  };
    if (url) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false);
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [url]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= pages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <section 
      className="py-6 sm:py-8 lg:py-12 overflow-x-hidden"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="text-center max-w-4xl mx-auto overflow-hidden">
          {/* Title */}
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-2"
            style={{ color: theme.colors.textPrimary }}
          >
            {cleanTitle}
          </h1>
          
          {/* Auto-generated Subtitle */}
          <p 
            className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 opacity-80 px-4"
            style={{ color: theme.colors.textSecondary }}
          >
            {getSubtitle()}
          </p>

          {/* Content Type Badge */}
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
                {pages} Slides
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Section - Mobile Optimized */}
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <Card 
          className="mx-auto shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden max-w-7xl"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full h-1 bg-gray-200 overflow-hidden">
              <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${loadProgress}%`,
                  backgroundColor: theme.colors.primary
                }}
              />
            </div>
          )}

          {/* PDF Viewer Container - Mobile First */}
          <div className="flex flex-col xl:flex-row min-h-[400px]">
            
            {/* Main PDF Viewer */}
            <div className="flex-1 p-2 sm:p-4 overflow-hidden">
              <div className="relative w-full max-w-full">
                {url && !isLoading ? (
                  <div className="w-full bg-white rounded-lg overflow-hidden shadow-inner relative">
                    {/* PDF Preview with proper fallback */}
                    <div className="w-full overflow-hidden" style={{ maxWidth: '100vw' }}>
                      {pdfViewerSupported ? (
                        <>
                          {/* Primary: Object tag for PDF viewing */}
                          <object
                            data={getOptimizedPdfUrl(url)}
                            type="application/pdf"
                            className="w-full border-0 h-[600px] sm:h-[700px] md:h-[800px] block bg-white"
                            style={{
                              maxWidth: '100%',
                              width: '100%',
                              backgroundColor: 'white'
                            }}
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                              console.log('PDF object failed, trying fallback');
                              setPdfViewerSupported(false);
                            }}
                          >
                            {/* Fallback: Show preview card instead of embed */}
                            <div className="w-full h-[600px] sm:h-[700px] md:h-[800px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                              <div className="text-center p-8 max-w-md">
                                <div 
                                  className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl"
                                  style={{ backgroundColor: theme.colors.primary }}
                                >
                                  <FileText 
                                    className="w-12 h-12" 
                                    style={{ color: theme.colors.surface }} 
                                  />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                  {cleanTitle}
                                </h3>
                                <p className="text-lg text-gray-700 mb-8">
                                  {getSubtitle()}
                                </p>
                                <div className="space-y-4">
                                  <Button
                                    onClick={() => window.open(url, '_blank')}
                                    className="w-full text-lg py-4"
                                    style={{
                                      backgroundColor: theme.colors.primary,
                                      color: theme.colors.surface
                                    }}
                                  >
                                    <Eye className="w-5 h-5 mr-3" />
                                    Open PDF Viewer
                                  </Button>
                                  <Button
                                    onClick={onDownload}
                                    variant="outline"
                                    className="w-full text-lg py-4"
                                    style={{
                                      borderColor: theme.colors.primary,
                                      color: theme.colors.primary
                                    }}
                                  >
                                    <Download className="w-5 h-5 mr-3" />
                                    Download PDF
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </object>
                        </>
                      ) : (
                        /* Clean preview when PDF viewer is not supported */
                        <div className="w-full h-[600px] sm:h-[700px] md:h-[800px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                          <div className="text-center p-8 max-w-md">
                            <div 
                              className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl"
                              style={{ backgroundColor: theme.colors.primary }}
                            >
                              <FileText 
                                className="w-12 h-12" 
                                style={{ color: theme.colors.surface }} 
                              />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {cleanTitle}
                            </h3>
                            <p className="text-lg text-gray-700 mb-8">
                              {getSubtitle()}
                            </p>
                            <div className="space-y-4">
                              <Button
                                onClick={() => window.open(url, '_blank')}
                                className="w-full text-lg py-4"
                                style={{
                                  backgroundColor: theme.colors.primary,
                                  color: theme.colors.surface
                                }}
                              >
                                <Eye className="w-5 h-5 mr-3" />
                                Open PDF Viewer
                              </Button>
                              <Button
                                onClick={onDownload}
                                variant="outline"
                                className="w-full text-lg py-4"
                                style={{
                                  borderColor: theme.colors.primary,
                                  color: theme.colors.primary
                                }}
                              >
                                <Download className="w-5 h-5 mr-3" />
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg h-[350px] sm:h-[450px] md:h-[550px]">
                    <div className="text-center p-4 sm:p-6 lg:p-8">
                      <div 
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: theme.colors.primary + '20' }}
                      >
                        <FileText 
                          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" 
                          style={{ color: theme.colors.primary }} 
                        />
                      </div>
                      {isLoading ? (
                        <>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            Loading PDF...
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">
                            Page {Math.ceil(loadProgress / 100 * pages)} of {pages}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            PDF Document Ready
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            Click to view or download your document
                          </p>
                          <Button
                            onClick={() => window.open(url, '_blank')}
                            className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                            style={{
                              backgroundColor: theme.colors.primary,
                              color: theme.colors.surface
                            }}
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            Open PDF
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Page Thumbnails Sidebar - Responsive Layout */}
            {thumbnails.length > 0 && (
              <div className="xl:w-64 bg-gray-50 border-t xl:border-t-0 xl:border-l border-gray-200">
                <div className="p-3 sm:p-4">
                  <h3 
                    className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Pages ({pages})
                  </h3>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-1 gap-2 sm:gap-3 max-h-64 xl:max-h-96 overflow-y-auto">
                    {thumbnails.map((thumb, index) => (
                      <button
                        key={index}
                        onClick={() => goToPage(index + 1)}
                        className={`relative aspect-[3/4] rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
                          currentPage === index + 1 
                            ? 'ring-1 sm:ring-2 ring-offset-1 sm:ring-offset-2 scale-105' 
                            : 'hover:scale-[1.02]'
                        }`}
                        style={{ 
                          borderColor: currentPage === index + 1 ? theme.colors.primary : theme.colors.border,
                          ringColor: theme.colors.primary
                        }}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`Page ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div 
                          className="absolute inset-x-0 bottom-0 text-xs font-medium text-center py-1"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.surface 
                          }}
                        >
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="xl:hidden border-t border-gray-200 p-3 sm:p-4 bg-white">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Prev
              </Button>
              
              <span 
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap"
                style={{ 
                  backgroundColor: theme.colors.primary + '15',
                  color: theme.colors.primary 
                }}
              >
                {currentPage} of {pages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('next')}
                disabled={currentPage === pages}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm"
              >
                Next
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons - Mobile Responsive */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 lg:mt-12">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          {/* Primary Download Button */}
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

          {/* Secondary Actions */}
          <div className="flex gap-3 sm:gap-4">
            <Button
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
          </div>
        </div>
      </div>

      {/* Cover Page Highlight */}
      {thumbnails[0] && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 lg:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 
              className="text-xl sm:text-2xl font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              Cover Preview
            </h3>
            <p 
              className="text-sm sm:text-base text-gray-600"
            >
              First page extracted as hero thumbnail
            </p>
          </div>
          
          <Card 
            className="max-w-xs sm:max-w-md mx-auto overflow-hidden shadow-lg sm:shadow-xl"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={thumbnails[0]}
                alt="Cover Page"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-3 sm:p-4 text-center">
              <p 
                className="text-xs sm:text-sm font-medium"
                style={{ color: theme.colors.textSecondary }}
              >
                Page 1 of {pages}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
