import { useState, useEffect } from 'react';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  // Internal optimization fields - not exposed to components
  originalKey?: string;
  optimizedKey?: string;
  hasOptimizedVersion?: boolean;
  optimizationStatus?: 'pending' | 'completed' | 'failed' | 'skipped';
}

export interface FileUrls {
  // URL for displaying/viewing the file (automatically optimized for fast loading)
  viewUrl: string;
  // URL for downloading the file (always original quality)
  downloadUrl: string;
}

/**
 * Hook for getting appropriate file URLs
 * Completely transparent - users don't see any "optimized" vs "original" concepts
 */
export function useFileUrls(fileId: string): FileUrls {
  return {
    viewUrl: `/api/file/${fileId}`, // Backend automatically serves optimized for viewing
    downloadUrl: `/api/file/${fileId}?mode=download` // Backend serves original for download
  };
}

/**
 * Utility function to generate file URLs without hooks
 */
export function getFileUrls(fileId: string): FileUrls {
  return {
    viewUrl: `/api/file/${fileId}`,
    downloadUrl: `/api/file/${fileId}?mode=download`
  };
}

/**
 * Utility function to format file sizes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
    const downloadUrl = `/api/file/${fileId}?mode=download`;
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
  
