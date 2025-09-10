export interface Env {
  LYTSITE_KV: KVNamespace;
  LYTSITE_STORAGE: R2Bucket;
  ENVIRONMENT: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  template: string;
  files: FileMetadata[];
  createdAt: number;
  views: number;
  password?: string;
  expiryDate?: number;
  authorName?: string;
  authorEmail?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  // Add presentation-specific data
  presentationData?: {
    slides: Array<{
      id: number;
      imageUrl: string;
      thumbnailUrl: string;
      title?: string;
    }>;
    totalSlides: number;
    slideImages: string[];
    pdfUrl?: string;
    embedUrl?: string;
    theme?: string;
  };
  // Enhanced PowerPoint processing data
  powerPointData?: {
    originalFileUrl: string;     // Original PPTX for download
    pdfUrl: string;             // PDF for inline viewing
    thumbnailUrls: string[];     // PNG thumbnails for gallery
    slideCount: number;
    pdfViewerUrl?: string;      // Google Docs style viewer URL
  };
}

export interface UploadResponse {
  success: boolean;
  slug?: string;
  url?: string;
  error?: string;
}
