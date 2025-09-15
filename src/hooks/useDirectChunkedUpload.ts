/**
 * Direct Chunked Upload Hook
 * Uploads large files as chunks directly to storage, bypassing Worker memory limitations
 */

import { useState, useCallback, useEffect } from 'react';

// Production Cloudflare Worker URL
const WORKER_URL = process.env.NODE_ENV === 'development' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev' 
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
const MAX_CONCURRENT_CHUNKS = 3; // Maximum concurrent chunk uploads per file

export interface DirectChunkedFile {
  file: File;
  fileId: string;
  chunkCount: number;
  uploadedChunks: number[];
  failedChunks: number[];
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface DirectChunkedUploadOptions {
  title: string;
  description: string;
  template?: string;
  authorName?: string;
  password?: string;
  expiryDate?: string;
  settings?: any; // ProjectSettings from types.ts
}

export interface DirectChunkedUploadResult {
  success: boolean;
  url?: string;
  slug?: string;
  sessionId?: string;
  error?: string;
}

export interface DirectChunkedUploadState {
  files: DirectChunkedFile[];
  sessionId: string | null;
  projectSlug: string | null;
  isUploading: boolean;
  overallProgress: number;
  result: DirectChunkedUploadResult | null;
}

export function useDirectChunkedUpload() {
  const [state, setState] = useState<DirectChunkedUploadState>({
    files: [],
    sessionId: null,
    projectSlug: null,
    isUploading: false,
    overallProgress: 0,
    result: null
  });

  const updateFileProgress = useCallback((fileId: string, updates: Partial<DirectChunkedFile>) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        file.fileId === fileId ? { ...file, ...updates } : file
      )
    }));
  }, []);

  const calculateOverallProgress = useCallback((files: DirectChunkedFile[]) => {
    if (files.length === 0) return 0;
    
    const totalChunks = files.reduce((sum, file) => sum + file.chunkCount, 0);
    const uploadedChunks = files.reduce((sum, file) => sum + file.uploadedChunks.length, 0);
    
    return Math.round((uploadedChunks / totalChunks) * 100);
  }, []);

  const uploadChunkWithRetry = useCallback(async (
    chunkData: ArrayBuffer, 
    uploadUrl: string, 
    retries = 3
  ): Promise<boolean> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: chunkData,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });

        if (response.ok) {
          return true;
        } else {
          console.warn(`Chunk upload attempt ${attempt + 1} failed:`, response.status);
          if (attempt === retries - 1) {
            throw new Error(`Upload failed with status ${response.status}`);
          }
        }
      } catch (error) {
        console.warn(`Chunk upload attempt ${attempt + 1} error:`, error);
        if (attempt === retries - 1) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    return false;
  }, []);

  const uploadFileChunks = useCallback(async (file: DirectChunkedFile, sessionId: string) => {
    const chunks: ArrayBuffer[] = [];
    
    // Split file into chunks
    for (let i = 0; i < file.chunkCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.file.size);
      const chunk = await file.file.slice(start, end).arrayBuffer();
      chunks.push(chunk);
    }

    console.log(`Starting upload of ${file.file.name}: ${chunks.length} chunks`);

    // Upload chunks in batches with concurrency control
    const uploadQueue = chunks.map((_, index) => index);
    const activeUploads = new Set<number>();
    
    while (uploadQueue.length > 0 || activeUploads.size > 0) {
      // Start new uploads up to concurrency limit
      while (uploadQueue.length > 0 && activeUploads.size < MAX_CONCURRENT_CHUNKS) {
        const chunkIndex = uploadQueue.shift()!;
        activeUploads.add(chunkIndex);
        
        // Get upload URL for this chunk
        const urlResponse = await fetch(`${WORKER_URL}/api/direct-upload/urls`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            fileId: file.fileId,
            chunkIndices: [chunkIndex]
          })
        });

        if (!urlResponse.ok) {
          activeUploads.delete(chunkIndex);
          updateFileProgress(file.fileId, {
            failedChunks: [...file.failedChunks, chunkIndex],
            status: 'error',
            error: `Failed to get upload URL for chunk ${chunkIndex}`
          });
          continue;
        }

        const urlData = await urlResponse.json();
        const uploadUrl = `${WORKER_URL}${urlData.uploadUrls[0].uploadUrl}`;

        // Upload chunk asynchronously
        uploadChunkWithRetry(chunks[chunkIndex], uploadUrl)
          .then(success => {
            activeUploads.delete(chunkIndex);
            
            if (success) {
              updateFileProgress(file.fileId, {
                uploadedChunks: [...file.uploadedChunks, chunkIndex].sort((a, b) => a - b),
                progress: Math.round(((file.uploadedChunks.length + 1) / file.chunkCount) * 100)
              });
              
              console.log(`Chunk ${chunkIndex} of ${file.file.name} uploaded successfully`);
            } else {
              updateFileProgress(file.fileId, {
                failedChunks: [...file.failedChunks, chunkIndex],
                status: 'error',
                error: `Chunk ${chunkIndex} upload failed`
              });
            }
          })
          .catch(error => {
            activeUploads.delete(chunkIndex);
            updateFileProgress(file.fileId, {
              failedChunks: [...file.failedChunks, chunkIndex],
              status: 'error',
              error: error.message
            });
          });
      }

      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Check if all chunks uploaded successfully
    const totalUploaded = file.uploadedChunks.length + 1; // +1 for the last chunk we just processed
    if (totalUploaded === file.chunkCount && file.failedChunks.length === 0) {
      updateFileProgress(file.fileId, {
        status: 'complete',
        progress: 100
      });
      console.log(`File ${file.file.name} upload completed: ${file.chunkCount} chunks`);
    } else {
      updateFileProgress(file.fileId, {
        status: 'error',
        error: `Upload incomplete: ${totalUploaded}/${file.chunkCount} chunks, ${file.failedChunks.length} failed`
      });
    }
  }, [updateFileProgress, uploadChunkWithRetry]);

  const uploadFiles = useCallback(async (files: File[], options: DirectChunkedUploadOptions): Promise<DirectChunkedUploadResult> => {
    try {
      console.log(`Starting direct chunked upload: ${files.length} files`);

      // Initialize upload session
      const initResponse = await fetch(`${WORKER_URL}/api/direct-upload/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          })),
          metadata: options
        })
      });

      if (!initResponse.ok) {
        throw new Error(`Failed to initialize upload: ${initResponse.status}`);
      }

      const initData = await initResponse.json();
      const { sessionId, projectSlug, files: sessionFiles } = initData;

      console.log(`Session initialized: ${sessionId}, project: ${projectSlug}`);

      // Prepare file objects for tracking
      const trackingFiles: DirectChunkedFile[] = files.map((file, index) => ({
        file,
        fileId: sessionFiles[index].fileId,
        chunkCount: sessionFiles[index].chunkCount,
        uploadedChunks: [],
        failedChunks: [],
        progress: 0,
        status: 'pending'
      }));

      setState(prev => ({
        ...prev,
        files: trackingFiles,
        sessionId,
        projectSlug,
        isUploading: true,
        overallProgress: 0
      }));

      // Upload all files concurrently
      await Promise.all(
        trackingFiles.map(file => {
          updateFileProgress(file.fileId, { status: 'uploading' });
          return uploadFileChunks(file, sessionId);
        })
      );

      // Complete the upload
      const completeResponse = await fetch(`${WORKER_URL}/api/direct-upload/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!completeResponse.ok) {
        throw new Error(`Failed to complete upload: ${completeResponse.status}`);
      }

      const completeData = await completeResponse.json();
      
      console.log(`Direct chunked upload completed:`, completeData);

      const result = {
        success: true,
        url: completeData.url,
        slug: completeData.slug,
        sessionId: completeData.sessionId
      };

      setState(prev => ({
        ...prev,
        isUploading: false,
        overallProgress: 100,
        result
      }));

      return result;

    } catch (error) {
      console.error('Direct chunked upload failed:', error);
      
      const result = {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };

      setState(prev => ({
        ...prev,
        isUploading: false,
        result
      }));

      return result;
    }
  }, [uploadFileChunks, updateFileProgress]);

  const getSessionStatus = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/api/direct-upload/status/${sessionId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get session status:', error);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      files: [],
      sessionId: null,
      projectSlug: null,
      isUploading: false,
      overallProgress: 0,
      result: null
    });
  }, []);

  // Update overall progress when files change
  useEffect(() => {
    const progress = calculateOverallProgress(state.files);
    if (progress !== state.overallProgress) {
      setState(prev => ({ ...prev, overallProgress: progress }));
    }
  }, [state.files, state.overallProgress, calculateOverallProgress]);

  return {
    state,
    uploadFiles,
    getSessionStatus,
    reset,
    
    // Computed values for convenience
    isUploading: state.isUploading,
    overallProgress: state.overallProgress,
    result: state.result,
    files: state.files,
    sessionId: state.sessionId,
    projectSlug: state.projectSlug
  };
}

// Helper function to check if files should use direct chunked upload
export function shouldUseDirectChunkedUpload(files: File[]): boolean {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const hasLargeFiles = files.some(file => file.size > 100 * 1024 * 1024); // >100MB
  
  // Use direct chunked for very large files or large total size
  return hasLargeFiles || totalSize > 200 * 1024 * 1024; // >200MB total
}

// Helper function to format file sizes
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
