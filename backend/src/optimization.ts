import { Env } from './types';

// Configuration for different file types and optimization levels
export const OPTIMIZATION_CONFIG = {
  IMAGE: {
    maxWidth: 1800,
    maxHeight: 1800,
    quality: 0.85,
    format: 'webp' as const,
    stripMetadata: true
  },
  PDF: {
    imageQuality: 0.85,
    compressText: true,
    flattenForms: true
  },
  VIDEO: {
    maxHeight: 720,
    videoBitrate: '1500k',
    audioBitrate: '128k',
    format: 'mp4' as const
  }
};

// R2 bucket structure for dual-quality storage
export const STORAGE_BUCKETS = {
  ORIGINALS: 'originals',
  PREVIEWS: 'previews'
};

export interface OptimizationResult {
  optimizedData: ArrayBuffer;
  contentType: string;
  size: number;
  format: string;
}

/**
 * Determines if a file type can be optimized
 */
export function isOptimizableFile(contentType: string): boolean {
  return contentType.startsWith('image/') || 
         contentType === 'application/pdf' ||
         contentType.startsWith('video/');
}

/**
 * Generates an optimized version of a file
 */
export async function generateOptimizedVersion(
  fileData: ArrayBuffer,
  contentType: string,
  fileName: string
): Promise<OptimizationResult | null> {
  
  // Only optimize supported file types
  if (!isOptimizableFile(contentType)) {
    return null;
  }

  try {
    if (contentType.startsWith('image/')) {
      return await optimizeImage(fileData, contentType, fileName);
    }
    
    if (contentType === 'application/pdf') {
      return await optimizePDF(fileData, fileName);
    }
    
    if (contentType.startsWith('video/')) {
      return await optimizeVideo(fileData, contentType, fileName);
    }
    
    return null;
  } catch (error) {
    console.error('Optimization failed:', error);
    return null;
  }
}

/**
 * Optimizes image files using Canvas API (for supported formats)
 */
async function optimizeImage(
  fileData: ArrayBuffer,
  contentType: string,
  fileName: string
): Promise<OptimizationResult> {
  
  const config = OPTIMIZATION_CONFIG.IMAGE;
  
  // For now, we'll implement a basic optimization
  // In a full implementation, you'd use a proper image processing library
  // or service like Cloudflare Images
  
  // Simple approach: convert to WebP if supported
  const optimizedFormat = config.format;
  const optimizedContentType = `image/${optimizedFormat}`;
  
  // For the MVP, we'll return the original with WebP content type
  // This would be replaced with actual image processing
  return {
    optimizedData: fileData,
    contentType: optimizedContentType,
    size: fileData.byteLength,
    format: optimizedFormat
  };
}

/**
 * Optimizes PDF files by compressing images and text
 */
async function optimizePDF(
  fileData: ArrayBuffer,
  fileName: string
): Promise<OptimizationResult> {
  
  // For the MVP, we'll return the original PDF
  // In a full implementation, you'd use PDF processing libraries
  return {
    optimizedData: fileData,
    contentType: 'application/pdf',
    size: fileData.byteLength,
    format: 'pdf'
  };
}

/**
 * Optimizes video files by reducing resolution and bitrate
 */
async function optimizeVideo(
  fileData: ArrayBuffer,
  contentType: string,
  fileName: string
): Promise<OptimizationResult> {
  
  // For the MVP, we'll return the original video
  // In a full implementation, you'd use video processing services
  return {
    optimizedData: fileData,
    contentType: contentType,
    size: fileData.byteLength,
    format: 'mp4'
  };
}

/**
 * Stores a file in the appropriate R2 bucket
 */
export async function storeFile(
  env: Env,
  bucketType: keyof typeof STORAGE_BUCKETS,
  key: string,
  data: ArrayBuffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<void> {
  
  const bucket = env.LYTSITE_STORAGE;
  const fullKey = `${STORAGE_BUCKETS[bucketType]}/${key}`;
  
  await bucket.put(fullKey, data, {
    httpMetadata: {
      contentType: contentType,
      cacheControl: 'public, max-age=31536000',
      contentDisposition: bucketType === 'ORIGINALS' 
        ? `attachment; filename="${encodeURIComponent(key.split('/').pop() || 'file')}"` 
        : `inline; filename="${encodeURIComponent(key.split('/').pop() || 'file')}"`,
    },
    customMetadata: metadata
  });
}

/**
 * Retrieves a file from R2 storage
 */
export async function retrieveFile(
  env: Env,
  bucketType: keyof typeof STORAGE_BUCKETS,
  key: string
): Promise<R2Object | null> {
  
  const bucket = env.LYTSITE_STORAGE;
  const fullKey = `${STORAGE_BUCKETS[bucketType]}/${key}`;
  
  return await bucket.get(fullKey);
}

/**
 * Generates storage keys for original and optimized versions
 */
export function generateStorageKeys(projectId: string, fileId: string, fileName: string) {
  return {
    originalKey: `projects/${projectId}/files/${fileId}/${fileName}`,
    optimizedKey: `projects/${projectId}/previews/${fileId}/${fileName}`
  };
}
