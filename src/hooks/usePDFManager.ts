import { useState, useCallback, useEffect } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { PDFThumbnailGenerator } from '../utils/pdfThumbnailGenerator';

// Ensure PDF.js worker is set up
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

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

interface PDFThumbnail {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

interface UsePDFManagerProps {
  files: File[] | PDFFile[];
  autoDetectPitchDeck?: boolean;
  shouldGenerateThumbnails?: boolean;
  extractCoverPage?: boolean;
}

interface PDFManagerState {
  processedFiles: PDFFile[];
  isProcessing: boolean;
  processingProgress: number;
  currentProcessingFile: string | null;
  errors: { fileId: string; error: string }[];
}

export function usePDFManager({
  files,
  autoDetectPitchDeck = true,
  shouldGenerateThumbnails = true,
  extractCoverPage = true
}: UsePDFManagerProps) {
  const [state, setState] = useState<PDFManagerState>({
    processedFiles: [],
    isProcessing: false,
    processingProgress: 0,
    currentProcessingFile: null,
    errors: []
  });

  // Convert File to blob URL with proper MIME type
  const createPDFBlobUrl = useCallback((file: File): string => {
    // Ensure proper MIME type for PDFs
    const mimeType = file.type === 'application/pdf' ? file.type : 'application/pdf';
    const blob = new Blob([file], { type: mimeType });
    return URL.createObjectURL(blob);
  }, []);

  // Detect if PDF is a pitch deck based on filename and content
  const detectPitchDeck = useCallback((filename: string, pageCount: number): boolean => {
    const name = filename.toLowerCase();
    const isPitchKeywords = name.includes('pitch') || 
                           name.includes('deck') || 
                           name.includes('presentation') ||
                           name.includes('slides') ||
                           name.includes('keynote');
    
    // Also consider short PDFs (< 30 pages) with presentation-like names
    const isShortPresentation = pageCount <= 30 && (
      name.includes('demo') || 
      name.includes('overview') ||
      name.includes('intro')
    );

    return isPitchKeywords || isShortPresentation;
  }, []);

  // Extract PDF metadata and page count
  const extractPDFInfo = useCallback(async (file: File | PDFFile): Promise<{
    pages: number;
    metadata?: any;
    title?: string;
  }> => {
    try {
      const url = file instanceof File ? createPDFBlobUrl(file) : file.url;
      
      // Load PDF with PDF.js to get accurate page count and metadata
      const pdf = await pdfjs.getDocument(url).promise;
      const metadata = await pdf.getMetadata().catch(() => null);
      
      return {
        pages: pdf.numPages,
        metadata: metadata?.info,
        title: (metadata?.info as any)?.Title || (file instanceof File ? file.name : file.name)
      };
    } catch (error) {
      console.error('Error extracting PDF info:', error);
      // Fallback to basic info
      return {
        pages: file instanceof File ? 1 : file.pages,
        metadata: null,
        title: file instanceof File ? file.name : file.name
      };
    }
  }, [createPDFBlobUrl]);

  // Generate thumbnail for specific page
  const generatePageThumbnail = useCallback(async (
    pdfUrl: string, 
    pageNumber: number, 
    scale: number = 0.5
  ): Promise<PDFThumbnail | null> => {
    try {
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(pageNumber);
      
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      return {
        pageNumber,
        dataUrl: canvas.toDataURL('image/jpeg', 0.7),
        width: viewport.width,
        height: viewport.height
      };
    } catch (error) {
      console.error(`Error generating thumbnail for page ${pageNumber}:`, error);
      return null;
    }
  }, []);

  // Generate thumbnails for all pages (or just first few for performance)
  const generatePDFThumbnails = useCallback(async (
    pdfUrl: string, 
    totalPages: number,
    maxThumbnails: number = 10
  ): Promise<string[]> => {
    // Use the PDFThumbnailGenerator utility
    const thumbnails = await PDFThumbnailGenerator.generateThumbnails(pdfUrl, {
      scale: 0.3,
      maxPages: Math.min(totalPages, maxThumbnails),
      quality: 0.8,
      format: 'jpeg'
    });
    
    return thumbnails.map(t => t.dataUrl);
  }, []);

  // Process individual file
  const processFile = useCallback(async (file: File | PDFFile, index: number, total: number): Promise<PDFFile> => {
    const fileId = file instanceof File ? `${file.name}-${Date.now()}` : file.id;
    const fileName = file instanceof File ? file.name : file.name;
    const fileSize = file instanceof File ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : file.size;
    
    setState(prev => ({
      ...prev,
      currentProcessingFile: fileName,
      processingProgress: Math.round((index / total) * 100)
    }));

    try {
      // Extract basic PDF info
      const pdfInfo = await extractPDFInfo(file);
      
      // Create or use existing URL
      const pdfUrl = file instanceof File ? createPDFBlobUrl(file) : file.url;
      
      // Detect if it's a pitch deck
      const isPitchDeck = autoDetectPitchDeck 
        ? detectPitchDeck(fileName, pdfInfo.pages)
        : (file instanceof File ? false : file.isPitchDeck || false);

      // Generate thumbnails if requested
      let thumbnails: string[] = [];
      let coverPage: string | undefined;

      if (shouldGenerateThumbnails) {
        thumbnails = await generatePDFThumbnails(pdfUrl, pdfInfo.pages);
        
        // Extract cover page if requested
        if (extractCoverPage && thumbnails.length > 0) {
          coverPage = thumbnails[0];
        }
      }

      const processedFile: PDFFile = {
        id: fileId,
        name: fileName,
        url: pdfUrl,
        size: fileSize,
        pages: pdfInfo.pages,
        thumbnails,
        isPitchDeck,
        coverPage,
        metadata: {
          author: pdfInfo.metadata?.Author,
          created: pdfInfo.metadata?.CreationDate,
          modified: pdfInfo.metadata?.ModDate,
          ...((file instanceof File ? {} : file.metadata) || {})
        }
      };

      return processedFile;
    } catch (error) {
      console.error(`Error processing file ${fileName}:`, error);
      
      // Add error to state
      setState(prev => ({
        ...prev,
        errors: [...prev.errors, { 
          fileId, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }]
      }));

      // Return basic file info even on error
      const pdfUrl = file instanceof File ? createPDFBlobUrl(file) : file.url;
      
      return {
        id: fileId,
        name: fileName,
        url: pdfUrl,
        size: fileSize,
        pages: file instanceof File ? 1 : file.pages,
        thumbnails: [],
        isPitchDeck: false,
        metadata: {}
      };
    }
  }, [autoDetectPitchDeck, shouldGenerateThumbnails, extractCoverPage, createPDFBlobUrl, extractPDFInfo, detectPitchDeck, generatePDFThumbnails]);

  // Process all files
  const processFiles = useCallback(async (filesToProcess: File[] | PDFFile[]) => {
    if (filesToProcess.length === 0) return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      processingProgress: 0,
      errors: [],
      processedFiles: []
    }));

    try {
      const processed: PDFFile[] = [];
      
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const processedFile = await processFile(file, i, filesToProcess.length);
        processed.push(processedFile);
      }

      setState(prev => ({
        ...prev,
        processedFiles: processed,
        isProcessing: false,
        processingProgress: 100,
        currentProcessingFile: null
      }));
    } catch (error) {
      console.error('Error processing files:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        currentProcessingFile: null
      }));
    }
  }, [processFile]);

  // Auto-process files when they change
  useEffect(() => {
    if (files.length > 0) {
      processFiles(files);
    }
  }, [files, processFiles]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      state.processedFiles.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, []);

  // Public methods
  const reprocessFile = useCallback(async (fileId: string) => {
    const file = files.find(f => 
      (f instanceof File ? `${f.name}-${Date.now()}` : f.id) === fileId
    );
    
    if (!file) return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentProcessingFile: file instanceof File ? file.name : file.name
    }));

    try {
      const processed = await processFile(file, 0, 1);
      
      setState(prev => ({
        ...prev,
        processedFiles: prev.processedFiles.map(f => 
          f.id === fileId ? processed : f
        ),
        isProcessing: false,
        currentProcessingFile: null,
        errors: prev.errors.filter(e => e.fileId !== fileId)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        currentProcessingFile: null
      }));
    }
  }, [files, processFile]);

  const removeFile = useCallback((fileId: string) => {
    setState(prev => {
      const fileToRemove = prev.processedFiles.find(f => f.id === fileId);
      
      // Cleanup blob URL
      if (fileToRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      return {
        ...prev,
        processedFiles: prev.processedFiles.filter(f => f.id !== fileId),
        errors: prev.errors.filter(e => e.fileId !== fileId)
      };
    });
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: []
    }));
  }, []);

  return {
    // State
    files: state.processedFiles,
    isProcessing: state.isProcessing,
    processingProgress: state.processingProgress,
    currentProcessingFile: state.currentProcessingFile,
    errors: state.errors,
    
    // Methods
    reprocessFile,
    removeFile,
    clearErrors,
    
    // Utils
    totalPages: state.processedFiles.reduce((acc, file) => acc + file.pages, 0),
    totalSize: state.processedFiles.length > 0 
      ? `${state.processedFiles.reduce((acc, file) => {
          const sizeMB = parseFloat(file.size.replace(' MB', ''));
          return acc + (isNaN(sizeMB) ? 0 : sizeMB);
        }, 0).toFixed(1)} MB`
      : '0 MB',
    pitchDecks: state.processedFiles.filter(f => f.isPitchDeck),
    documents: state.processedFiles.filter(f => !f.isPitchDeck)
  };
}
