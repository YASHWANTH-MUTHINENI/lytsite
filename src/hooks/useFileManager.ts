import { useState, useCallback, useEffect } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { PDFThumbnailGenerator } from '../utils/pdfThumbnailGenerator';

// Ensure PDF.js worker is set up
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

// File type definitions
export type FileType = 'pdf' | 'image' | 'document' | 'presentation' | 'spreadsheet' | 'archive' | 'video' | 'audio' | 'other';

export interface ProcessedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  size: string;
  type: FileType;
  mimeType: string;
  extension: string;
  thumbnails: string[];
  coverImage?: string;
  metadata: Record<string, any>;
}

// Type-specific interfaces
export interface ProcessedPDF extends ProcessedFile {
  type: 'pdf';
  pages: number;
  isPitchDeck?: boolean;
}

export interface ProcessedImage extends ProcessedFile {
  type: 'image';
  width?: number;
  height?: number;
}

export interface ProcessedDocument extends ProcessedFile {
  type: 'document';
  pages?: number;
  content?: string;
}

export interface ProcessedPresentation extends ProcessedFile {
  type: 'presentation';
  slides?: number;
}

export interface ProcessedFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  size: string;
  type: FileType;
  mimeType: string;
  extension: string;
  thumbnails: string[];
  coverImage?: string;
  metadata: Record<string, any>;
}

interface FileManagerState {
  files: ProcessedFile[];
  isProcessing: boolean;
  processingProgress: number;
  currentProcessingFile: string | null;
  errors: { fileId: string; error: string }[];
}

interface UseFileManagerProps {
  files: File[];
  generateThumbnails?: boolean;
  extractContent?: boolean;
  maxConcurrent?: number;
}

export function useFileManager({
  files,
  generateThumbnails = true,
  extractContent = true,
  maxConcurrent = 3
}: UseFileManagerProps) {
  const [state, setState] = useState<FileManagerState>({
    files: [],
    isProcessing: false,
    processingProgress: 0,
    currentProcessingFile: null,
    errors: []
  });

  // Detect file type based on MIME type and extension
  const detectFileType = useCallback((file: File): FileType => {
    const mimeType = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    // PDF detection (highest priority)
    if (mimeType === 'application/pdf' || extension === 'pdf') {
      return 'pdf';
    }
    
    // Presentation detection (before image detection to avoid conflicts)
    if (mimeType.includes('presentation') || 
        mimeType.includes('powerpoint') ||
        ['ppt', 'pptx', 'key', 'odp'].includes(extension)) {
      return 'presentation';
    }
    
    // Document detection (before image detection)
    if (mimeType.includes('document') || 
        mimeType.includes('msword') || 
        mimeType.includes('wordprocessing') ||
        ['doc', 'docx', 'pages', 'rtf', 'txt', 'odt'].includes(extension)) {
      return 'document';
    }
    
    // Spreadsheet detection
    if (mimeType.includes('spreadsheet') || 
        mimeType.includes('excel') ||
        ['xls', 'xlsx', 'numbers', 'ods', 'csv'].includes(extension)) {
      return 'spreadsheet';
    }
    
    // Image detection (after document types to avoid conflicts)
    if (mimeType.startsWith('image/') || 
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic', 'heif', 'avif'].includes(extension)) {
      return 'image';
    }
    
    // Archive detection
    if (mimeType.includes('zip') || 
        mimeType.includes('archive') ||
        ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return 'archive';
    }
    
    // Video detection
    if (mimeType.startsWith('video/') ||
        ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
      return 'video';
    }
    
    // Audio detection
    if (mimeType.startsWith('audio/') ||
        ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension)) {
      return 'audio';
    }
    
    // Default
    return 'other';
  }, []);

  // Create blob URL with proper MIME type
  const createBlobUrl = useCallback((file: File): string => {
    // Ensure proper MIME type especially for PDFs
    let mimeType = file.type;
    
    // If type is empty or incorrect, infer from extension
    if (!mimeType || mimeType === 'application/octet-stream') {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Common MIME types
      const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      
      mimeType = mimeTypes[extension] || 'application/octet-stream';
    }
    
    const blob = new Blob([file], { type: mimeType });
    return URL.createObjectURL(blob);
  }, []);

  // Process PDF file
  const processPDF = useCallback(async (
    file: File, 
    url: string
  ): Promise<ProcessedPDF> => {
    const id = `${file.name}-${Date.now()}`;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    
    try {
      // Extract PDF info using PDF.js
      const pdf = await pdfjs.getDocument(url).promise;
      const metadata = await pdf.getMetadata().catch(() => null);
      const pages = pdf.numPages;
      
      // Generate thumbnails if requested
      let thumbnails: string[] = [];
      let coverImage: string | undefined;
      
      if (generateThumbnails) {
        const pdfThumbnails = await PDFThumbnailGenerator.generateThumbnails(url, {
          scale: 0.3,
          maxPages: Math.min(pages, 10),
          quality: 0.8,
          format: 'jpeg'
        });
        
        thumbnails = pdfThumbnails.map(t => t.dataUrl);
        
        if (thumbnails.length > 0) {
          coverImage = thumbnails[0];
        }
      }
      
      // Detect if it's likely a pitch deck
      const name = file.name.toLowerCase();
      const isPitchDeck = name.includes('pitch') || 
                         name.includes('deck') || 
                         name.includes('presentation') ||
                         name.includes('slides');
      
      return {
        id,
        name: file.name.split('.')[0], // Remove extension from display name
        originalName: file.name,
        url,
        size: fileSize,
        type: 'pdf' as const,
        mimeType: file.type || 'application/pdf',
        extension: file.name.split('.').pop()?.toLowerCase() || 'pdf',
        pages,
        isPitchDeck,
        thumbnails: thumbnails,
        coverImage,
        metadata: {
          author: (metadata?.info as any)?.Author || 'Unknown',
          created: (metadata?.info as any)?.CreationDate,
          modified: (metadata?.info as any)?.ModDate,
          title: (metadata?.info as any)?.Title || file.name.split('.')[0]
        }
      };
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      // Return basic info on error
      return {
        id,
        name: file.name.split('.')[0],
        originalName: file.name,
        url,
        size: fileSize,
        type: 'pdf' as const,
        mimeType: file.type || 'application/pdf',
        extension: file.name.split('.').pop()?.toLowerCase() || 'pdf',
        pages: 1,
        thumbnails: [],
        metadata: {}
      };
    }
  }, [generateThumbnails]);

  // Process image file
  const processImage = useCallback(async (
    file: File, 
    url: string
  ): Promise<ProcessedImage> => {
    const id = `${file.name}-${Date.now()}`;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    
    try {
      // Get image dimensions
      const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.onerror = () => {
          resolve({width: 0, height: 0});
        };
        img.src = url;
      });
      
      return {
        id,
        name: file.name.split('.')[0],
        originalName: file.name,
        url,
        size: fileSize,
        type: 'image' as const,
        mimeType: file.type || `image/${file.name.split('.').pop()?.toLowerCase()}`,
        extension: file.name.split('.').pop()?.toLowerCase() || 'jpg',
        thumbnails: [url],
        coverImage: url,
        width: dimensions.width,
        height: dimensions.height,
        metadata: {
          dimensions: `${dimensions.width} x ${dimensions.height}`
        }
      };
    } catch (error) {
      console.error('Error processing image:', error);
      
      return {
        id,
        name: file.name.split('.')[0],
        originalName: file.name,
        url,
        size: fileSize,
        type: 'image' as const,
        mimeType: file.type || `image/${file.name.split('.').pop()?.toLowerCase()}`,
        extension: file.name.split('.').pop()?.toLowerCase() || 'jpg',
        thumbnails: [url],
        coverImage: url,
        metadata: {}
      };
    }
  }, []);

  // Process document, presentation, or other file
  const processOtherFile = useCallback(async (
    file: File, 
    url: string,
    fileType: FileType
  ): Promise<ProcessedFile> => {
    const id = `${file.name}-${Date.now()}`;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Generate a generic file icon for the thumbnail
    const genericIcon = `/icons/${fileType}.svg`;
    
    return {
      id,
      name: file.name.split('.')[0],
      originalName: file.name,
      url,
      size: fileSize,
      type: fileType,
      mimeType: file.type || `application/${extension}`,
      extension,
      thumbnails: [genericIcon],
      coverImage: genericIcon,
      metadata: {
        extension,
        size: fileSize
      }
    };
  }, []);

  // Process a single file
  const processFile = useCallback(async (
    file: File, 
    index: number, 
    total: number
  ): Promise<ProcessedFile> => {
    setState(prev => ({
      ...prev,
      currentProcessingFile: file.name,
      processingProgress: Math.round((index / total) * 100)
    }));

    try {
      // Create blob URL with proper MIME type
      const url = createBlobUrl(file);
      const fileType = detectFileType(file);
      
      // Process based on file type
      switch (fileType) {
        case 'pdf':
          return processPDF(file, url);
        case 'image':
          return processImage(file, url);
        default:
          return processOtherFile(file, url, fileType);
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      
      const id = `${file.name}-${Date.now()}`;
      setState(prev => ({
        ...prev,
        errors: [...prev.errors, {
          fileId: id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]
      }));
      
      // Return minimal file info on error
      return {
        id,
        name: file.name.split('.')[0],
        originalName: file.name,
        url: createBlobUrl(file),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: detectFileType(file),
        mimeType: file.type || 'application/octet-stream',
        extension: file.name.split('.').pop()?.toLowerCase() || '',
        thumbnails: [],
        metadata: {}
      };
    }
  }, [createBlobUrl, detectFileType, processImage, processOtherFile, processPDF]);

  // Process all files in batches
  const processFiles = useCallback(async () => {
    if (files.length === 0) return;
    
    setState(prev => ({
      ...prev,
      isProcessing: true,
      processingProgress: 0,
      errors: []
    }));
    
    try {
      const results: ProcessedFile[] = [];
      
      // Process files in batches for better performance
      const batches: File[][] = [];
      for (let i = 0; i < files.length; i += maxConcurrent) {
        batches.push(files.slice(i, i + maxConcurrent));
      }
      
      let processedCount = 0;
      for (const batch of batches) {
        const batchResults = await Promise.all(
          batch.map(file => processFile(file, processedCount++, files.length))
        );
        results.push(...batchResults);
      }
      
      setState(prev => ({
        ...prev,
        files: results,
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
  }, [files, maxConcurrent, processFile]);

  // Auto-process files when they change
  useEffect(() => {
    if (files.length > 0) {
      processFiles();
    }
  }, [files, processFiles]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      state.files.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, []);

  // Helper to get files by type
  const getFilesByType = useCallback((type: FileType | FileType[]) => {
    const types = Array.isArray(type) ? type : [type];
    return state.files.filter(file => types.includes(file.type));
  }, [state.files]);

  // Group files by type
  const filesByType = useCallback(() => {
    return {
      pdf: state.files.filter(f => f.type === 'pdf') as ProcessedPDF[],
      image: state.files.filter(f => f.type === 'image') as ProcessedImage[],
      document: state.files.filter(f => f.type === 'document') as ProcessedDocument[],
      presentation: state.files.filter(f => f.type === 'presentation') as ProcessedPresentation[],
      spreadsheet: state.files.filter(f => f.type === 'spreadsheet'),
      archive: state.files.filter(f => f.type === 'archive'),
      video: state.files.filter(f => f.type === 'video'),
      audio: state.files.filter(f => f.type === 'audio'),
      other: state.files.filter(f => f.type === 'other')
    };
  }, [state.files]);

  // Get primary file type
  const getPrimaryFileType = useCallback((): FileType | 'mixed' => {
    const types = new Set(state.files.map(f => f.type));
    
    if (types.size === 0) return 'other';
    if (types.size === 1) return state.files[0].type;
    return 'mixed';
  }, [state.files]);

  // Remove a file
  const removeFile = useCallback((fileId: string) => {
    setState(prev => {
      const fileToRemove = prev.files.find(f => f.id === fileId);
      
      // Cleanup blob URL
      if (fileToRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      
      return {
        ...prev,
        files: prev.files.filter(f => f.id !== fileId),
        errors: prev.errors.filter(e => e.fileId !== fileId)
      };
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: []
    }));
  }, []);

  return {
    // State
    files: state.files,
    isProcessing: state.isProcessing,
    processingProgress: state.processingProgress,
    currentProcessingFile: state.currentProcessingFile,
    errors: state.errors,
    
    // File grouping
    filesByType: filesByType(),
    primaryFileType: getPrimaryFileType(),
    getFilesByType,
    
    // Methods
    removeFile,
    clearErrors,
    
    // Statistics
    totalFiles: state.files.length,
    totalSize: state.files.length > 0 
      ? `${state.files.reduce((acc, file) => {
          const sizeMB = parseFloat(file.size.replace(' MB', ''));
          return acc + (isNaN(sizeMB) ? 0 : sizeMB);
        }, 0).toFixed(1)} MB`
      : '0 MB'
  };
}