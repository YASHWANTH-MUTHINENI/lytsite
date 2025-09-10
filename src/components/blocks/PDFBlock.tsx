import React, { useState, useCallback, useEffect } from "react";
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
  Loader2,
  BarChart3
} from "lucide-react";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

interface PDFBlockProps {
  title: string;
  url: string;
  pages: number;
  thumbnails: string[];
  onDownload?: () => void;
  onShare?: () => void;
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
  onShare,
  metadata 
}: PDFBlockProps) {
  const { theme } = useTheme();
  
  // Viewer state
  const [viewerMethod, setViewerMethod] = useState<'iframe' | 'pdfjs' | 'error'>('iframe');
  const [isLoading, setIsLoading] = useState(true);
  
  // PDF.js specific state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.3); // Better default scale for readability
  const [rotation, setRotation] = useState(0);
  const [pdfData, setPdfData] = useState<string | Uint8Array | null>(null);

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

  // Check if URL is blob and validate PDF
  const validateAndLoadPdf = useCallback(async (pdfUrl: string) => {
    try {
      if (pdfUrl.startsWith('blob:')) {
        console.log('🔍 Validating blob PDF:', pdfUrl);
        
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Check PDF signature
        const signature = String.fromCharCode(...uint8Array.slice(0, 4));
        if (signature !== '%PDF') {
          throw new Error('Invalid PDF format');
        }
        
        console.log('✅ PDF validated, size:', arrayBuffer.byteLength);
        setPdfData(uint8Array);
        return true;
      } else {
        setPdfData(pdfUrl);
        return true;
      }
    } catch (error) {
      console.error('❌ PDF validation failed:', error);
      return false;
    }
  }, []);

  // PDF.js event handlers
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('✅ PDF.js loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('❌ PDF.js failed:', error.message);
    setViewerMethod('error');
    setIsLoading(false);
  }, []);

  // Navigation controls for PDF.js
  const goToPrevPage = () => setPageNumber(page => Math.max(1, page - 1));
  const goToNextPage = () => setPageNumber(page => Math.min(numPages || pages, page + 1));
  const zoomIn = () => setScale(scale => Math.min(3.0, scale + 0.2));
  const zoomOut = () => setScale(scale => Math.max(0.5, scale - 0.2));
  const resetZoom = () => setScale(1.3); // Reset to better default
  const rotate = () => setRotation(rot => (rot + 90) % 360);

  // Responsive scale calculation
  const getResponsiveScale = () => {
    if (typeof window === 'undefined') return scale;
    const containerWidth = Math.min(window.innerWidth - 64, 1000); // Increased max width
    const defaultPageWidth = 612; // Standard PDF page width
    const baseScale = Math.min(containerWidth / defaultPageWidth, scale);
    return Math.max(1.2, baseScale); // Minimum scale of 1.2 for better readability
  };

  // Initialize PDF viewer
  useEffect(() => {
    if (!url) return;

    console.log('🚀 Initializing PDF viewer for:', url);
    
    setIsLoading(true);
    setViewerMethod('iframe'); // Always try iframe first for blobs
    
    // For blob URLs, validate in background for PDF.js fallback
    if (url.startsWith('blob:')) {
      validateAndLoadPdf(url);
    }
  }, [url, validateAndLoadPdf]);

  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log('✅ Iframe PDF viewer loaded');
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.log('❌ Iframe failed, switching to PDF.js');
    setViewerMethod('pdfjs');
    if (!pdfData) {
      validateAndLoadPdf(url);
    }
  };

  return (
    <section 
      className="py-6 sm:py-8 lg:py-12 overflow-x-hidden"
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

      {/* Main PDF Viewer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card 
          className="overflow-hidden shadow-lg sm:shadow-xl relative"
          style={{ backgroundColor: theme.colors.surface }}
        >
          {/* Debug info - Development only */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 text-xs rounded z-50 max-w-xs">
              <div>Method: {viewerMethod}</div>
              <div>Is Blob: {url?.startsWith('blob:').toString()}</div>
              <div>Loading: {isLoading.toString()}</div>
              <div>Pages: {numPages || pages}</div>
            </div>
          )}

          {/* PDF Controls - Only show for PDF.js */}
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
                  
                  <span className="text-sm font-medium px-3 py-1 bg-white rounded border">
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
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={zoomOut} variant="outline" size="sm" disabled={scale <= 0.5}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button onClick={resetZoom} variant="outline" size="sm" className="text-xs px-2">
                    {Math.round(scale * 100)}%
                  </Button>
                  <Button onClick={zoomIn} variant="outline" size="sm" disabled={scale >= 3.0}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button onClick={rotate} variant="outline" size="sm">
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => window.open(url, '_blank')} variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PDF Viewer Container */}
          <div className={`bg-gray-100 flex items-center justify-center overflow-auto relative ${
            typeof window !== 'undefined' && window.innerWidth < 768
              ? 'h-[70vh]' // Mobile: 70vh for better scrolling experience
              : 'h-[80vh] max-h-[800px]' // Desktop: 80vh with 800px max
          } min-h-[500px]`}>
            {viewerMethod === 'iframe' && (
              <div className={`w-full bg-white relative ${
                typeof window !== 'undefined' && window.innerWidth < 768
                  ? 'h-[70vh]' // Mobile: 70vh
                  : 'h-[80vh] max-h-[800px]' // Desktop: 80vh with 800px max
              } min-h-[500px]`}>
                <iframe
                  src={url}
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
                    </div>
                  </div>
                )}
              </div>
            )}

            {viewerMethod === 'pdfjs' && pdfData && (
              <div className="w-full flex justify-center py-4">
                <Document
                  file={pdfData as any}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
                        <p className="text-gray-600">Rendering PDF...</p>
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
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  {numPages || pages} {(numPages || pages) === 1 ? 'page' : 'pages'} • {metadata?.size || 'PDF Document'}
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={() => window.open(url, '_blank')}
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
                  onClick={onDownload}
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
                    onClick={onShare}
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
      </div>

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
            <div className="flex gap-3 sm:gap-4">
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
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
