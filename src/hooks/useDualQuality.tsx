/**
 * Dual Quality Hook for Phase 1 System
 * Provides optimized preview URLs and original download URLs
 */

import React, { useMemo } from 'react';

// Production Cloudflare Worker URL
const WORKER_URL = process.env.NODE_ENV === 'development' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev' 
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

export interface FileUrls {
  previewUrl: string;   // Optimized WebP for fast preview
  downloadUrl: string;  // Original file for download
  thumbnailUrl: string; // Small thumbnail for grid views
}

export interface DualQualityFile {
  id?: string;
  name: string;
  type?: string;
  size?: number | string; // Support both number (bytes) and string (formatted) for backward compatibility
  url?: string; // Legacy URL support
}

// Legacy interface for backward compatibility  
export interface FileMetadata {
  id: string;
  name: string;
  size: number | string; // Support both formats
  type: string;
  url?: string;
  // Internal optimization fields - not exposed to components
  originalKey?: string;
  optimizedKey?: string;
  hasOptimizedVersion?: boolean;
  optimizationStatus?: 'pending' | 'completed' | 'failed' | 'skipped';
}

/**
 * Hook to get dual-quality URLs for files
 * Returns optimized preview URLs and original download URLs
 */
export function useFileUrls(files: DualQualityFile[]): Record<string, FileUrls> {
  return useMemo(() => {
    const urlMap: Record<string, FileUrls> = {};

    files.forEach(file => {
      if (file.id) {
        // Phase 1 Dual-Quality URLs
        const previewUrl = `${WORKER_URL}/api/files/${file.id}?mode=preview`;
        const downloadUrl = `${WORKER_URL}/api/files/${file.id}?mode=download`;
        const thumbnailUrl = `${WORKER_URL}/api/files/${file.id}?mode=preview&size=300`;

        urlMap[file.id] = {
          previewUrl,
          downloadUrl,
          thumbnailUrl
        };
      } else if (file.url) {
        // Legacy fallback - use the provided URL for all modes
        urlMap[file.name] = {
          previewUrl: file.url,
          downloadUrl: file.url,
          thumbnailUrl: file.url
        };
      }
    });

    return urlMap;
  }, [files]);
}

/**
 * Hook to get a single file's URLs
 */
export function useFileUrl(file: DualQualityFile): FileUrls {
  return useMemo(() => {
    if (file.id) {
      return {
        previewUrl: `${WORKER_URL}/api/files/${file.id}?mode=preview`,
        downloadUrl: `${WORKER_URL}/api/files/${file.id}?mode=download`,
        thumbnailUrl: `${WORKER_URL}/api/files/${file.id}?mode=preview&size=300`
      };
    } else if (file.url) {
      // Legacy fallback
      return {
        previewUrl: file.url,
        downloadUrl: file.url,
        thumbnailUrl: file.url
      };
    } else {
      return {
        previewUrl: '',
        downloadUrl: '',
        thumbnailUrl: ''
      };
    }
  }, [file]);
}

/**
 * Legacy function for single file URL (backward compatibility with .tsx version)
 */
export function getFileUrls(fileId: string): { viewUrl: string; downloadUrl: string } {
  return {
    viewUrl: `${WORKER_URL}/api/files/${fileId}?mode=preview`,
    downloadUrl: `${WORKER_URL}/api/files/${fileId}?mode=download`
  };
}

/**
 * Helper function to determine if a file is an image
 */
export function isImageFile(file: DualQualityFile): boolean {
  if (file.type) {
    return file.type.startsWith('image/');
  }
  
  if (file.name) {
    const extension = file.name.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(extension || '');
  }
  
  return false;
}

/**
 * Helper function to determine if a file is a video
 */
export function isVideoFile(file: DualQualityFile): boolean {
  if (file.type) {
    return file.type.startsWith('video/');
  }
  
  if (file.name) {
    const extension = file.name.toLowerCase().split('.').pop();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension || '');
  }
  
  return false;
}

/**
 * Helper function to determine if a file is a PDF
 */
export function isPDFFile(file: DualQualityFile): boolean {
  if (file.type) {
    return file.type === 'application/pdf';
  }
  
  if (file.name) {
    return file.name.toLowerCase().endsWith('.pdf');
  }
  
  return false;
}

/**
 * Helper function to get the appropriate preview URL based on file type
 */
export function getOptimalPreviewUrl(file: DualQualityFile, fileUrls: FileUrls): string {
  if (isImageFile(file)) {
    // For images, use the optimized WebP preview
    return fileUrls.previewUrl;
  } else if (isVideoFile(file)) {
    // For videos, use the optimized preview (thumbnail or compressed version)
    return fileUrls.previewUrl;
  } else if (isPDFFile(file)) {
    // For PDFs, use the optimized preview (compressed version)
    return fileUrls.previewUrl;
  } else {
    // For other files, fall back to download URL
    return fileUrls.downloadUrl;
  }
}

/**
 * Hook for bulk file downloads with progress tracking
 */
export function useBulkDownload() {
  const downloadFiles = async (files: DualQualityFile[], onProgress?: (progress: number) => void) => {
    const total = files.length;
    let completed = 0;

    const downloadPromises = files.map(async (file) => {
      try {
        if (file.id) {
          const downloadUrl = `${WORKER_URL}/api/files/${file.id}?mode=download`;
          const response = await fetch(downloadUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }
        }
        
        completed++;
        if (onProgress) {
          onProgress(Math.round((completed / total) * 100));
        }
      } catch (error) {
        console.error(`Failed to download ${file.name}:`, error);
        completed++;
        if (onProgress) {
          onProgress(Math.round((completed / total) * 100));
        }
      }
    });

    await Promise.all(downloadPromises);
  };

  return { downloadFiles };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Simple download button - completely transparent to user
 * They just see "Download" and get the original file
 */
export function DownloadButton({
  fileId,
  fileName,
  className = "",
  style,
  children = "Download"
}: {
  fileId: string;
  fileName: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const handleDownload = () => {
    // Always download the original file - user doesn't see this complexity
    const downloadUrl = `${WORKER_URL}/api/files/${fileId}?mode=download`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <button
      onClick={handleDownload}
      className={className}
      style={style}
      title={`Download ${fileName}`}
    >
      {children}
    </button>
  );
}
