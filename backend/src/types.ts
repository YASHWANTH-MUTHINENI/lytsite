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
}

export interface UploadResponse {
  success: boolean;
  slug?: string;
  url?: string;
  error?: string;
}
