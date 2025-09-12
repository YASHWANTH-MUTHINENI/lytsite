/**
 * Simplified Direct Upload Hook
 * Uploads directly to Worker but with minimal processing time
 */

import { useState, useCallback } from 'react';

// Production Cloudflare Worker URL
const WORKER_URL = process.env.NODE_ENV === 'development' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev' 
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

export interface DirectUploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
}

export interface DirectUploadOptions {
  title: string;
  description: string;
  template?: string;
  authorName?: string;
  password?: string;
  expiryDate?: string;
}

export interface DirectUploadResult {
  success: boolean;
  url?: string;
  slug?: string;
  uploadTime?: number;
  message?: string;
  error?: string;
}

export interface DirectUploadState {
  files: DirectUploadFile[];
  isUploading: boolean;
  uploadProgress: number;
  result: DirectUploadResult | null;
  optimizationProgress: number;
  optimizationComplete: boolean;
}

export function useDirectUpload() {
  const [state, setState] = useState<DirectUploadState>({
    files: [],
    isUploading: false,
    uploadProgress: 0,
    result: null,
    optimizationProgress: 0,
    optimizationComplete: false
  });

  const updateFileProgress = useCallback((index: number, progress: number, status: DirectUploadFile['status'], error?: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map((file, i) => 
        i === index ? { ...file, progress, status, error } : file
      )
    }));
  }, []);

  const uploadFiles = useCallback(async (files: File[], options: DirectUploadOptions): Promise<DirectUploadResult> => {
    const uploadFiles = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));

    setState(prev => ({
      ...prev,
      files: uploadFiles,
      isUploading: true,
      uploadProgress: 0,
      result: null,
      optimizationProgress: 0,
      optimizationComplete: false
    }));

    try {
      const formData = new FormData();
      
      // Add files
      files.forEach(file => {
        formData.append('files', file);
      });

      // Add metadata
      formData.append('title', options.title);
      formData.append('description', options.description);
      if (options.template) formData.append('template', options.template);
      if (options.authorName) formData.append('authorName', options.authorName);
      if (options.password) formData.append('password', options.password);
      if (options.expiryDate) formData.append('expiryDate', options.expiryDate);

      console.log('Starting direct upload...', { fileCount: files.length, totalSize: files.reduce((sum, f) => sum + f.size, 0) });

      // Mark files as uploading
      uploadFiles.forEach((_, index) => {
        updateFileProgress(index, 0, 'uploading');
      });

      const startTime = Date.now();

      // Direct upload using fetch with built-in progress tracking
      const response = await fetch(`${WORKER_URL}/api/direct-upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json() as DirectUploadResult;
      const uploadTime = Date.now() - startTime;

      console.log('Direct upload completed:', { uploadTime, result });

      if (result.success) {
        // Mark all files as uploaded
        uploadFiles.forEach((_, index) => {
          updateFileProgress(index, 100, 'uploaded');
        });

        setState(prev => ({
          ...prev,
          isUploading: false,
          uploadProgress: 100,
          result: { ...result, uploadTime }
        }));

        // Start polling for optimization progress if we have a slug
        if (result.slug) {
          pollOptimizationProgress(result.slug);
        }

        return { ...result, uploadTime };
      } else {
        // Mark all files as error
        uploadFiles.forEach((_, index) => {
          updateFileProgress(index, 0, 'error', result.error);
        });

        setState(prev => ({
          ...prev,
          isUploading: false,
          result
        }));

        return result;
      }

    } catch (error) {
      console.error('Direct upload failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      // Mark all files as error
      uploadFiles.forEach((_, index) => {
        updateFileProgress(index, 0, 'error', errorMessage);
      });

      const result = {
        success: false,
        error: errorMessage
      };

      setState(prev => ({
        ...prev,
        isUploading: false,
        result
      }));

      return result;
    }
  }, [updateFileProgress]);

  const pollOptimizationProgress = useCallback(async (projectSlug: string) => {
    const pollInterval = 2000; // Poll every 2 seconds
    const maxPolls = 30; // Maximum 1 minute of polling
    let pollCount = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${WORKER_URL}/api/direct-upload/status/${projectSlug}`);
        const data = await response.json();

        if (data.success && data.project) {
          const progress = data.project.optimizationProgress || 0;
          const complete = data.project.optimizationComplete || false;

          setState(prev => ({
            ...prev,
            optimizationProgress: progress,
            optimizationComplete: complete
          }));

          console.log('Optimization progress:', { progress, complete });

          if (!complete && pollCount < maxPolls) {
            pollCount++;
            setTimeout(poll, pollInterval);
          }
        }
      } catch (error) {
        console.error('Failed to poll optimization progress:', error);
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 1000);
  }, []);

  const reset = useCallback(() => {
    setState({
      files: [],
      isUploading: false,
      uploadProgress: 0,
      result: null,
      optimizationProgress: 0,
      optimizationComplete: false
    });
  }, []);

  const getUploadSummary = useCallback(() => {
    const totalFiles = state.files.length;
    const uploadedFiles = state.files.filter(f => f.status === 'uploaded').length;
    const errorFiles = state.files.filter(f => f.status === 'error').length;
    const totalSize = state.files.reduce((sum, f) => sum + f.file.size, 0);

    return {
      totalFiles,
      uploadedFiles,
      errorFiles,
      totalSize,
      uploadProgress: state.uploadProgress,
      optimizationProgress: state.optimizationProgress,
      optimizationComplete: state.optimizationComplete,
      isComplete: uploadedFiles === totalFiles && state.optimizationComplete
    };
  }, [state]);

  return {
    state,
    uploadFiles,
    reset,
    getUploadSummary,
    
    // Computed values for convenience
    isUploading: state.isUploading,
    uploadProgress: state.uploadProgress,
    result: state.result,
    files: state.files,
    optimizationProgress: state.optimizationProgress,
    optimizationComplete: state.optimizationComplete
  };
}

// Helper function to format file sizes
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to estimate upload speed
export function calculateUploadSpeed(bytes: number, timeMs: number): string {
  const bytesPerSecond = bytes / (timeMs / 1000);
  return formatFileSize(bytesPerSecond) + '/s';
}
