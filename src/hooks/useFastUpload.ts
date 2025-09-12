/**
 * Fast Upload Hook
 * Optimized Worker-based upload that minimizes upload time
 */

import { useState, useCallback } from 'react';

interface FastUploadMetadata {
  title: string;
  description: string;
  template?: string;
  authorName?: string;
  password?: string;
  expiryDate?: string;
  skipOptimization?: boolean; // Upload without optimization for maximum speed
}

interface FastUploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (projectSlug: string, url: string) => void;
  onError?: (error: string) => void;
}

export class FastUploader {
  private options: FastUploadOptions;
  private isUploading = false;
  private abortController: AbortController | null = null;

  constructor(options: FastUploadOptions = {}) {
    this.options = options;
  }

  /**
   * Fast upload that prioritizes speed over optimization
   */
  async uploadFiles(files: File[], metadata: FastUploadMetadata): Promise<{ success: boolean; url: string; slug: string }> {
    if (this.isUploading) {
      throw new Error('Upload already in progress');
    }

    this.isUploading = true;
    this.abortController = new AbortController();

    try {
      // Create FormData with minimal processing
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      formData.append('template', metadata.template || 'universal-file-template');
      formData.append('authorName', metadata.authorName || '');
      
      // Skip optimization for maximum speed
      if (metadata.skipOptimization) {
        formData.append('skipOptimization', 'true');
      }
      
      if (metadata.password) {
        formData.append('password', metadata.password);
      }
      if (metadata.expiryDate) {
        formData.append('expiryDate', metadata.expiryDate);
      }

      // Simple progress simulation (upload completes quickly)
      const progressInterval = setInterval(() => {
        this.options.onProgress?.(Math.min(Math.random() * 80 + 10, 95));
      }, 100);

      // Upload to optimized endpoint
      const response = await fetch('/api/fast-upload', {
        method: 'POST',
        body: formData,
        signal: this.abortController.signal
      });

      clearInterval(progressInterval);
      this.options.onProgress?.(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      this.options.onComplete?.(result.slug, result.url);

      return {
        success: true,
        url: result.url,
        slug: result.slug
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      this.options.onError?.(errorMessage);
      throw error;
    } finally {
      this.isUploading = false;
      this.abortController = null;
    }
  }

  /**
   * Cancel ongoing upload
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isUploading = false;
  }

  /**
   * Check if fast upload should be used
   */
  static shouldUseFastUpload(files: File[]): boolean {
    // Use fast upload for most scenarios - it's optimized for speed
    return true;
  }
}

/**
 * React hook for fast upload functionality
 */
export function useFastUpload(options: FastUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[], metadata: FastUploadMetadata) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const uploader = new FastUploader({
        ...options,
        onProgress: (progressValue) => {
          setProgress(progressValue);
          options.onProgress?.(progressValue);
        },
        onError: (errorMsg) => {
          setError(errorMsg);
          options.onError?.(errorMsg);
        }
      });

      const result = await uploader.uploadFiles(files, metadata);
      setProgress(100);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  return {
    uploadFiles,
    isUploading,
    progress,
    error,
    FastUploader
  };
}

export default FastUploader;
