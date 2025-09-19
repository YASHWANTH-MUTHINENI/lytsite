import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, AlertCircle, Loader2 } from 'lucide-react';
import { CompactFeatures } from '../features/CompactFeatures';
import { useEnhancedTheme } from '../../contexts/EnhancedThemeContext';
import { trackFileView, trackEvent } from '../../utils/simpleAnalytics';

// Global declarations for dynamically loaded PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// Global file store for preview data
declare global {
  var fileDataStore: Map<string, ArrayBuffer>;
}

if (typeof globalThis.fileDataStore === 'undefined') {
  globalThis.fileDataStore = new Map();
}

interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
  enableAnalytics?: boolean;
  enableNotifications?: boolean;
}

interface DynamicPDFBlockProps {
  url: string;
  projectId?: string;
  settings?: ProjectSettings;
  onDownload?: () => void;
}

type ViewerMethod = 'canvas' | 'iframe' | 'error' | 'loading';

export default function DynamicPDFBlock({ url, projectId, settings, onDownload }: DynamicPDFBlockProps) {
  console.log('🔧 DynamicPDFBlock: Initialized with URL:', url);
  const { theme } = useEnhancedTheme();
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [viewerMethod, setViewerMethod] = useState<ViewerMethod>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load PDF.js dynamically from CDN
  const loadPdfJs = async (): Promise<boolean> => {
    // Force clear any existing PDF.js to avoid conflicts with npm version
    if (window.pdfjsLib) {
      console.log('🔄 Clearing existing PDF.js instance...');
      delete window.pdfjsLib;
      delete (window as any).GlobalWorkerOptions;
    }

    // Use a stable version that we know works well
    const baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174';
    
    try {
      console.log('🔧 Loading fresh PDF.js from CDNJS...');
      setLoadingProgress(10);
      
      // Load PDF.js library with a unique timestamp to force fresh load
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${baseUrl}/pdf.min.js?t=${Date.now()}`;
        script.onload = () => {
          console.log('✅ PDF.js script loaded');
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js script'));
        document.head.appendChild(script);
      });

      setLoadingProgress(30);

      // Wait a bit for the library to initialize
      await new Promise(resolve => setTimeout(resolve, 200));

      if (window.pdfjsLib) {
        // Set worker source to same CDN
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${baseUrl}/pdf.worker.min.js`;
        console.log('🎉 Fresh PDF.js loaded successfully!');
        console.log('🔧 Worker source:', window.pdfjsLib.GlobalWorkerOptions.workerSrc);
        console.log('🔧 PDF.js version:', window.pdfjsLib.version || 'unknown');
        return true;
      } else {
        throw new Error('PDF.js library not available after loading');
      }
    } catch (error) {
      console.error('❌ Failed to load PDF.js:', error);
      return false;
    }
  };

  // Load PDF data from different sources
  const loadPdfData = async (source: string): Promise<Uint8Array> => {
    console.log('🚀 Starting PDF load for source:', source);
    setLoadingProgress(40);

    if (source.startsWith('preview://')) {
      console.log('📦 Looking for preview data in global store...');
      const dataKey = source.replace('preview://', '');
      const storedData = globalThis.fileDataStore.get(dataKey);
      
      if (!storedData) {
        throw new Error(`No preview data found for key: ${dataKey}`);
      }
      
      console.log('✅ Retrieved from global store:', storedData.byteLength, 'bytes');
      
      // Always create a fresh copy to prevent detachment issues
      // Check if the ArrayBuffer is detached first
      if (storedData.byteLength === 0) {
        throw new Error('ArrayBuffer is detached - data has been transferred elsewhere');
      }
      
      // Create a completely new ArrayBuffer and copy the data
      const freshBuffer = new ArrayBuffer(storedData.byteLength);
      const freshView = new Uint8Array(freshBuffer);
      const sourceView = new Uint8Array(storedData);
      
      // Copy byte by byte to ensure we don't transfer ownership
      for (let i = 0; i < sourceView.length; i++) {
        freshView[i] = sourceView[i];
      }
      
      console.log('📋 Created fresh copy:', freshView.length, 'bytes');
      
      return freshView;
    } else {
      // For regular URLs, fetch the data
      console.log('🌐 Fetching PDF from URL...');
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
  };

  // Render a specific page to canvas
  const renderPage = async (pdf: any, pageNumber: number, canvas: HTMLCanvasElement, scale: number) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale, rotation });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      console.log(`✅ Rendered page ${pageNumber} to canvas`);
    } catch (error) {
      console.error(`❌ Failed to render page ${pageNumber}:`, error);
      throw error;
    }
  };

  // Main PDF loading function
  const loadPdf = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setViewerMethod('loading');
      
      // Step 1: Load PDF.js library
      console.log('📚 Loading PDF.js library...');
      const pdfJsLoaded = await loadPdfJs();
      if (!pdfJsLoaded) {
        throw new Error('Failed to load PDF.js library');
      }
      setPdfJsLoaded(true);
      setLoadingProgress(35);

      // Step 2: Load PDF data
      console.log('📄 Loading PDF data...');
      const pdfData = await loadPdfData(url);
      setLoadingProgress(50);

      // Check if it's a valid PDF
      const signature = String.fromCharCode(...pdfData.slice(0, 4));
      console.log('🔍 PDF signature check:', signature, 'from bytes:', Array.from(pdfData.slice(0, 8)));
      
      if (signature !== '%PDF') {
        throw new Error(`Invalid PDF signature: ${signature}`);
      }

      setLoadingProgress(60);

      // Step 3: Parse PDF with PDF.js
      console.log('📄 Loading PDF with PDF.js, size:', pdfData.length, 'signature:', signature);
      
      const pdf = await window.pdfjsLib.getDocument({ 
        data: pdfData,
        verbosity: 0
      }).promise;
      
      console.log('🎉 PDF loaded successfully! Pages:', pdf.numPages);
      
      setPdfDocument(pdf);
      setNumPages(pdf.numPages);
      setLoadingProgress(70);
      
      // Step 4: Render first page
      if (canvasRef.current) {
        console.log('🖼️ Rendering page 1 to canvas...');
        await renderPage(pdf, 1, canvasRef.current, scale);
      }
      
      setLoadingProgress(100);
      setViewerMethod('canvas');
      setIsLoading(false);
      
    } catch (error) {
      console.error('❌ Failed to load PDF:', error);
      
      // Provide more specific error messages
      let errorMessage = (error as Error).message;
      
      if (errorMessage.includes('detached ArrayBuffer')) {
        errorMessage = 'PDF data is no longer available. Please refresh and try again.';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Unable to download PDF file. Please check your connection.';
      } else if (errorMessage.includes('Invalid PDF')) {
        errorMessage = 'This file is not a valid PDF document.';
      } else if (errorMessage.includes('PDF.js')) {
        errorMessage = 'PDF viewer failed to load. Please refresh the page.';
      }
      
      setError(errorMessage);
      setViewerMethod('error');
      setIsLoading(false);
    }
  };

  // Load PDF when component mounts or URL changes
  useEffect(() => {
    console.log('🔄 DynamicPDFBlock useEffect triggered with URL:', url);
    if (url) {
      trackFileView('pdf', url.split('/').pop() || 'PDF Document');
      // Clean up previous PDF document before loading new one
      if (pdfDocument) {
        console.log('🧹 Cleaning up previous PDF document...');
        try {
          pdfDocument.destroy();
        } catch (error) {
          console.warn('⚠️ Error destroying previous PDF document:', error);
        }
        setPdfDocument(null);
      }
      
      // Reset state for new PDF
      setCurrentPage(1);
      setNumPages(0);
      setScale(1.0);
      setRotation(0);
      setError(null);
      
      loadPdf();
    }
  }, [url]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (pdfDocument) {
        console.log('🧹 Component unmounting - cleaning up PDF document...');
        try {
          pdfDocument.destroy();
        } catch (error) {
          console.warn('⚠️ Error destroying PDF document on unmount:', error);
        }
      }
    };
  }, [pdfDocument]);

  // Re-render current page when scale or rotation changes
  useEffect(() => {
    if (pdfDocument && canvasRef.current && viewerMethod === 'canvas') {
      renderPage(pdfDocument, currentPage, canvasRef.current, scale);
    }
  }, [pdfDocument, currentPage, scale, rotation]);

  // Navigation functions
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      trackEvent('pdf_page_navigation', {
        'direction': 'previous',
        'from_page': currentPage,
        'to_page': currentPage - 1,
        'total_pages': numPages
      });
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      trackEvent('pdf_page_navigation', {
        'direction': 'next',
        'from_page': currentPage,
        'to_page': currentPage + 1,
        'total_pages': numPages
      });
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Render loading state
  if (viewerMethod === 'loading') {
    return (
      <section 
        className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-6xl mx-auto">
          <Card 
            className="w-full"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary
            }}
          >
            <CardContent 
              className="p-6"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.colors.primary }} />
                <div className="text-center">
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>Loading PDF</h3>
                  <p className="text-sm mb-4" style={{ color: theme.colors.textMuted }}>
                    {loadingProgress < 35 ? 'Loading PDF.js library...' :
                     loadingProgress < 50 ? 'Loading PDF data...' :
                     loadingProgress < 70 ? 'Parsing PDF document...' :
                   'Rendering preview...'}
                  </p>
                  <div className="w-64 rounded-full h-2" style={{ backgroundColor: theme.colors.borderLight }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${loadingProgress}%`,
                        backgroundColor: theme.colors.primary
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Render error state
  if (viewerMethod === 'error') {
    return (
      <section 
        className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-6xl mx-auto">
          <Card 
            className="w-full"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary
            }}
          >
            <CardContent 
              className="p-6"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <AlertCircle className="h-12 w-12" style={{ color: theme.colors.error }} />
                <div className="text-center">
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>Unable to load PDF</h3>
                  <p className="text-sm mb-4" style={{ color: theme.colors.textMuted }}>{error}</p>
                  <Button onClick={loadPdf} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Render canvas viewer
  if (viewerMethod === 'canvas') {
    return (
      <section 
        className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="max-w-6xl mx-auto">
          <Card 
            className="w-full"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary
            }}
          >
            <CardContent 
              className="p-4"
              style={{ backgroundColor: theme.colors.surface }}
            >
              {/* Controls */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm font-medium px-2" style={{ color: theme.colors.textPrimary }}>
                    {currentPage} / {numPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage >= numPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-xs px-2" style={{ color: theme.colors.textSecondary }}>
                    {Math.round(scale * 100)}%
                  </span>
                  
                  <Button variant="outline" size="sm" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={rotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* PDF Canvas */}
              <div 
                className="border rounded-lg overflow-auto min-h-[500px] max-h-[80vh]" 
                style={{ 
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto mx-auto block"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrated Features - Instagram Style */}
        {projectId && settings && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <CompactFeatures
              fileId={`${projectId}-pdf`}
              projectId={projectId}
              settings={settings}
              onDownload={onDownload}
              className="mt-6"
            />
          </div>
        )}
      </section>
    );
  }

  return null;
}
