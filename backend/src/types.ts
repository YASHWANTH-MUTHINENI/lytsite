// Cloudflare Workers types (these should be available globally in the Workers runtime)
declare global {
  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }

  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: any): Promise<any>;
  }

  interface R2Bucket {
    get(key: string): Promise<R2Object | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | string, options?: any): Promise<R2Object>;
    delete(key: string): Promise<void>;
    list(options?: any): Promise<any>;
  }

  interface R2Object {
    key: string;
    size: number;
    body: ReadableStream;
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    json(): Promise<any>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    exec(query: string): Promise<D1ExecResult>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T>;
    run(): Promise<D1Result>;
    all<T = unknown>(): Promise<D1Result<T>>;
  }

  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: {
      served_by: string;
      duration: number;
      changes: number;
      last_row_id: number;
      rows_read: number;
      rows_written: number;
    };
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }
}

// Wrangler asset Fetcher type for static asset binding
export interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  LYTSITE_KV: KVNamespace;
  // Alternative KV binding name for compatibility
  KV?: KVNamespace;
  LYTSITE_STORAGE: R2Bucket;
  // Phase 2: Direct upload buckets
  LYTSITE_ORIGINALS: R2Bucket;
  LYTSITE_PREVIEWS: R2Bucket;
  // Alternative R2 bucket bindings for compatibility
  R2_BUCKET_ORIGINALS?: R2Bucket;
  R2_BUCKET_PREVIEWS?: R2Bucket;
  // Execution context for waitUntil
  ctx?: ExecutionContext;
  ENVIRONMENT: string;
  // D1 Database for advanced features
  LYTSITE_DB: D1Database;
  // Assets binding for serving static files from dist-standalone
  ASSETS?: {
    fetch(request: Request): Promise<Response>;
  };
  // Authentication & Security
  CLERK_SECRET_KEY?: string;
  INTERNAL_API_KEY?: string;
  WEBHOOK_API_KEY?: string;
  CLERK_WEBHOOK_SECRET?: string;
  // External services
  AWS_CONVERTER_URL?: string;
  AWS_REGION?: string;
  GOTENBERG_SERVICE_URL?: string;
  CLOUDMERSIVE_API_KEY?: string;
  ONLYOFFICE_SERVER_URL?: string;
  // Razorpay payment gateway
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
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
  // Advanced features settings
  settings?: ProjectSettings;
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

// Advanced Features Types
export interface ProjectSettings {
  enableFavorites: boolean;
  enableComments: boolean;
  enableApprovals: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  notificationEmail?: string;
  slackWebhook?: string;
}

export interface UserSession {
  id: string;
  email?: string;
  name?: string;
  userType: 'guest' | 'registered';
}

export interface Favorite {
  id: string;
  projectId: string;
  fileId: string;
  userEmail: string;
  userName?: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  projectId: string;
  fileId: string;
  threadId?: string;
  userEmail: string;
  userName?: string;
  commentText: string;
  resolved: boolean;
  createdAt: number;
  updatedAt: number;
  replies?: Comment[];
}

export interface Approval {
  id: string;
  projectId: string;
  fileId?: string; // NULL for gallery-level
  userEmail: string;
  userName?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AnalyticsEvent {
  id: string;
  projectId: string;
  fileId?: string;
  userEmail?: string;
  eventType: 'view' | 'download' | 'favorite' | 'comment' | 'approve';
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  projectId: string;
  recipientEmail: string;
  notificationType: 'new_favorite' | 'new_comment' | 'approval_change';
  title: string;
  message: string;
  metadata?: any;
  status: 'pending' | 'sent' | 'failed';
  createdAt: number;
  sentAt?: number;
}
