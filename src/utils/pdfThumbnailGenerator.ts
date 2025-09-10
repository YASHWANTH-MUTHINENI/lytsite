import { pdfjs } from 'react-pdf';

// Ensure PDF.js worker is set up
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

interface ThumbnailOptions {
  scale?: number;
  maxPages?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

interface PDFThumbnail {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export class PDFThumbnailGenerator {
  private static canvas: HTMLCanvasElement | null = null;
  private static context: CanvasRenderingContext2D | null = null;

  private static getCanvas(): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
    if (!this.canvas || !this.context) {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      
      if (!this.context) {
        throw new Error('Cannot create canvas context');
      }
    }
    
    return { canvas: this.canvas, context: this.context };
  }

  /**
   * Generate thumbnail for a single PDF page
   */
  static async generatePageThumbnail(
    pdfUrl: string, 
    pageNumber: number,
    options: ThumbnailOptions = {}
  ): Promise<PDFThumbnail | null> {
    try {
      const {
        scale = 0.3, // Smaller scale for thumbnails
        quality = 0.8,
        format = 'jpeg'
      } = options;

      // Load PDF
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(pageNumber);
      
      // Get viewport
      const viewport = page.getViewport({ scale });
      const { canvas, context } = this.getCanvas();
      
      // Set canvas size
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert to data URL
      const dataUrl = canvas.toDataURL(`image/${format}`, quality);

      return {
        pageNumber,
        dataUrl,
        width: viewport.width,
        height: viewport.height
      };
    } catch (error) {
      console.error(`Error generating thumbnail for page ${pageNumber}:`, error);
      return null;
    }
  }

  /**
   * Generate thumbnails for multiple pages
   */
  static async generateThumbnails(
    pdfUrl: string,
    options: ThumbnailOptions = {}
  ): Promise<PDFThumbnail[]> {
    try {
      const {
        maxPages = 5, // Only generate first 5 pages for performance
        scale = 0.3,
        quality = 0.8,
        format = 'jpeg'
      } = options;

      // Load PDF to get page count
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const totalPages = pdf.numPages;
      const pagesToGenerate = Math.min(totalPages, maxPages);

      console.log(`📄 Generating thumbnails for ${pagesToGenerate} pages of ${totalPages}`);

      // Generate thumbnails in parallel (but limit concurrency)
      const thumbnailPromises: Promise<PDFThumbnail | null>[] = [];
      
      for (let i = 1; i <= pagesToGenerate; i++) {
        thumbnailPromises.push(
          this.generatePageThumbnail(pdfUrl, i, { scale, quality, format })
        );
      }

      // Wait for all thumbnails with timeout
      const results = await Promise.allSettled(thumbnailPromises);
      
      const thumbnails = results
        .map((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            return result.value;
          } else {
            console.warn(`Failed to generate thumbnail for page ${index + 1}`);
            return null;
          }
        })
        .filter((thumb): thumb is PDFThumbnail => thumb !== null);

      console.log(`✅ Generated ${thumbnails.length} thumbnails`);
      return thumbnails;

    } catch (error) {
      console.error('Error generating PDF thumbnails:', error);
      return [];
    }
  }

  /**
   * Generate cover page thumbnail (first page only)
   */
  static async generateCoverThumbnail(
    pdfUrl: string,
    options: ThumbnailOptions = {}
  ): Promise<string | null> {
    const thumbnail = await this.generatePageThumbnail(pdfUrl, 1, options);
    return thumbnail?.dataUrl || null;
  }

  /**
   * Generate thumbnails with progress callback
   */
  static async generateThumbnailsWithProgress(
    pdfUrl: string,
    options: ThumbnailOptions = {},
    onProgress?: (current: number, total: number) => void
  ): Promise<PDFThumbnail[]> {
    try {
      const { maxPages = 5 } = options;
      
      // Load PDF to get page count
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const totalPages = pdf.numPages;
      const pagesToGenerate = Math.min(totalPages, maxPages);

      const thumbnails: PDFThumbnail[] = [];

      // Generate thumbnails sequentially to show progress
      for (let i = 1; i <= pagesToGenerate; i++) {
        onProgress?.(i - 1, pagesToGenerate);
        
        const thumbnail = await this.generatePageThumbnail(pdfUrl, i, options);
        if (thumbnail) {
          thumbnails.push(thumbnail);
        }
        
        onProgress?.(i, pagesToGenerate);
      }

      return thumbnails;

    } catch (error) {
      console.error('Error generating PDF thumbnails with progress:', error);
      return [];
    }
  }

  /**
   * Create placeholder thumbnail when generation fails
   */
  static createPlaceholderThumbnail(pageNumber: number, width = 150, height = 200): PDFThumbnail {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw placeholder
    context.fillStyle = '#f3f4f6';
    context.fillRect(0, 0, width, height);
    
    // Draw border
    context.strokeStyle = '#d1d5db';
    context.lineWidth = 2;
    context.strokeRect(1, 1, width - 2, height - 2);
    
    // Draw page number
    context.fillStyle = '#6b7280';
    context.font = '16px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(pageNumber.toString(), width / 2, height / 2);
    
    return {
      pageNumber,
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      width,
      height
    };
  }
}

/**
 * React Hook for PDF thumbnail generation
 */
export function usePDFThumbnails(pdfUrl: string | null, options: ThumbnailOptions = {}) {
  const [thumbnails, setThumbnails] = React.useState<PDFThumbnail[]>([]);
  const [coverThumbnail, setCoverThumbnail] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const generateThumbnails = React.useCallback(async () => {
    if (!pdfUrl) return;
    
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    
    try {
      // Generate cover thumbnail first for quick preview
      const cover = await PDFThumbnailGenerator.generateCoverThumbnail(pdfUrl, {
        scale: 0.5, // Higher resolution for cover
        ...options
      });
      setCoverThumbnail(cover);
      
      // Generate all thumbnails with progress
      const thumbs = await PDFThumbnailGenerator.generateThumbnailsWithProgress(
        pdfUrl,
        options,
        (current, total) => setProgress((current / total) * 100)
      );
      
      setThumbnails(thumbs);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate thumbnails');
      console.error('Thumbnail generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [pdfUrl, options]);

  React.useEffect(() => {
    generateThumbnails();
  }, [generateThumbnails]);

  return {
    thumbnails,
    coverThumbnail,
    isGenerating,
    progress,
    error,
    regenerate: generateThumbnails
  };
}

// Import React for the hook
import React from 'react';
