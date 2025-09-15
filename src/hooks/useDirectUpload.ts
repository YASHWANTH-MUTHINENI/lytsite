/**
 * Direct-to-Storage Upload Hook
 * Handles presigned URL uploads that bypass the Worker
 */

import { useState, useCallback } from 'react';

interface DirectUploadFile {
  fileName: string;
  fileSize: number;
  contentType: string;
}

interface DirectUploadMetadata {
  title: string;
  description: string;
  template?: string;
  authorName?: string;
  password?: string;
  expiryDate?: string;
  settings?: any; // ProjectSettings from types.ts
}

interface DirectUploadSession {
  sessionId: string;
  projectSlug: string;
  files: {
    fileId: string;
    fileName: string;
    presignedUrl: string;
    uploadUrl: string;
  }[];
}

interface DirectUploadOptions {
  onProgress?: (progress: number, fileIndex: number) => void;
  onFileComplete?: (fileIndex: number, fileId: string) => void;
  onError?: (error: string, fileIndex?: number) => void;
  onSessionComplete?: (projectSlug: string, url: string) => void;
}

export class DirectUploader {
  private session: DirectUploadSession | null = null;
  private options: DirectUploadOptions;
  private isUploading = false;
  private abortController: AbortController | null = null;

  constructor(options: DirectUploadOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize direct upload session with presigned URLs
   */
  async initializeUpload(files: File[], metadata: DirectUploadMetadata): Promise<void> {
    if (this.isUploading) {
      throw new Error('Upload already in progress');
    }

    try {
      this.abortController = new AbortController();

      // Prepare file information
      const fileInfos: DirectUploadFile[] = files.map(file => ({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type || 'application/octet-stream'
      }));

      // Request presigned URLs from backend
      const response = await fetch('/api/direct-upload/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: fileInfos,
          metadata
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const sessionData = await response.json();
      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Failed to initialize upload');
      }

      this.session = sessionData;
      console.log(`Direct upload session initialized: ${sessionData.sessionId}`);

    } catch (error) {
      console.error('Direct upload initialization failed:', error);
      throw error;
    }
  }

  /**
   * Start direct upload to R2 using presigned URLs
   */
  async startUpload(files: File[]): Promise<{ success: boolean; url: string; slug: string }> {
    if (!this.session) {
      throw new Error('Upload session not initialized');
    }

    if (files.length !== this.session.files.length) {
      throw new Error('File count mismatch');
    }

    this.isUploading = true;

    try {
      // Upload files directly to R2 using presigned URLs
      const uploadPromises = this.session.files.map(async (sessionFile, index) => {
        const file = files[index];
        await this.uploadFileDirectly(file, sessionFile, index);
      });

      await Promise.all(uploadPromises);

      // Wait for all files to be processed
      await this.waitForProcessing();

      // Generate final URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/${this.session.projectSlug}`;

      this.options.onSessionComplete?.(this.session.projectSlug, url);

      return {
        success: true,
        url,
        slug: this.session.projectSlug
      };

    } catch (error) {
      console.error('Direct upload failed:', error);
      this.options.onError?.(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      this.isUploading = false;
    }
  }

  /**
   * Upload single file directly to R2
   */
  private async uploadFileDirectly(
    file: File, 
    sessionFile: { fileId: string; fileName: string; presignedUrl: string; uploadUrl: string }, 
    index: number
  ): Promise<void> {
    try {
      // Upload directly to R2 using presigned URL
      const uploadResponse = await fetch(sessionFile.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        },
        signal: this.abortController?.signal
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: HTTP ${uploadResponse.status}`);
      }

      // Notify backend that upload is complete
      const completeResponse = await fetch(sessionFile.uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: this.abortController?.signal
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to complete upload');
      }

      this.options.onProgress?.(100, index);
      this.options.onFileComplete?.(index, sessionFile.fileId);

      console.log(`Direct upload completed: ${sessionFile.fileName}`);

    } catch (error) {
      console.error(`Direct upload failed for ${sessionFile.fileName}:`, error);
      this.options.onError?.(error instanceof Error ? error.message : 'Upload failed', index);
      throw error;
    }
  }

  /**
   * Wait for backend processing to complete
   */
  private async waitForProcessing(): Promise<void> {
    if (!this.session) return;

    const maxWaitTime = 60000; // 1 minute
    const pollInterval = 2000; // 2 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await fetch(`/api/direct-upload/status/${this.session.sessionId}`, {
          signal: this.abortController?.signal
        });

        if (response.ok) {
          const statusData = await response.json();
          if (statusData.success && statusData.session.status === 'complete') {
            console.log('Direct upload processing completed');
            return;
          }

          if (statusData.session.status === 'error') {
            throw new Error('Processing failed on backend');
          }
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        console.warn('Status poll failed:', error);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    console.warn('Processing wait timeout - proceeding anyway');
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
   * Get current upload progress
   */
  getOverallProgress(): number {
    // Direct uploads complete quickly, so this is mainly for UI consistency
    return this.isUploading ? 95 : 100;
  }

  /**
   * Check if direct upload should be used based on file characteristics
   */
  static shouldUseDirectUpload(files: File[]): boolean {
    // Use direct upload for any files (it's generally faster)
    // Could add specific logic later (e.g., based on file size or type)
    return true;
  }
}

/**
 * React hook for direct upload functionality
 */
export function useDirectUpload(options: DirectUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[], metadata: DirectUploadMetadata) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const uploader = new DirectUploader({
        ...options,
        onProgress: (fileProgress, fileIndex) => {
          // Calculate overall progress
          const totalFiles = files.length;
          const baseProgress = (fileIndex / totalFiles) * 100;
          const fileProgressPortion = fileProgress / totalFiles;
          const overallProgress = Math.min(baseProgress + fileProgressPortion, 100);
          setProgress(overallProgress);
          options.onProgress?.(fileProgress, fileIndex);
        },
        onError: (errorMsg, fileIndex) => {
          setError(errorMsg);
          options.onError?.(errorMsg, fileIndex);
        }
      });

      await uploader.initializeUpload(files, metadata);
      const result = await uploader.startUpload(files);
      
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
    DirectUploader
  };
}

export default DirectUploader;
