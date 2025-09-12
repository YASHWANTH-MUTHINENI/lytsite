export interface Env {
  LYTSITE_KV: KVNamespace;
  LYTSITE_STORAGE: R2Bucket;
  // Phase 2: Direct upload buckets
  LYTSITE_ORIGINALS: R2Bucket;
  LYTSITE_PREVIEWS: R2Bucket;
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
  // Dual-quality storage paths
  originalKey?: string;
  optimizedKey?: string;
  hasOptimizedVersion?: boolean;
  optimizationStatus?: 'pending' | 'completed' | 'failed' | 'skipped';
  createdAt?: string; // Phase 2: Add creation timestamp
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

// Phase 2: Direct upload response types
export interface DirectUploadResponse {
  success: boolean;
  error?: string;
  sessionId?: string;
  projectSlug?: string;
  url?: string;
  slug?: string;
  files?: FileMetadata[];
}

export interface UploadInitResponse {
  success: boolean;
  sessionId: string;
  projectSlug: string;
  uploadUrls: Array<{
    fileId: string;
    fileName: string;
    uploadUrl?: string;
    chunks?: Array<{
      chunkIndex: number;
      uploadUrl: string;
      key: string;
    }>;
  }>;
  chunkSize: number;
}

export interface ChunkUploadResponse {
  success: boolean;
  chunkIndex: number;
  fileId: string;
  error?: string;
}

// Optimization-related types
export interface OptimizationJob {
  fileId: string;
  projectId: string;
  fileName: string;
  contentType: string;
  originalKey: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface DualQualityMetadata {
  fileId: string;
  fileName: string;
  contentType: string;
  size: number;
  originalKey: string;
  optimizedKey?: string;
  optimizedSize?: number;
  optimizedFormat?: string;
  hasOptimized: boolean;
  createdAt: string;
  optimizedAt?: string;
}
