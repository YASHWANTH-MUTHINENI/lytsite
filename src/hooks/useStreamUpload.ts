/**
 * Phase 3: Stream Processing Frontend Client
 * Real-time upload with live optimization and preview generation
 */

interface UploadFile {
  file: File;
  fileId?: string;
  chunks?: Blob[] | null;
}

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev' 
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

export interface StreamProgress {
  sessionId: string;
  fileId: string;
  stage: 'uploading' | 'optimizing' | 'previewing' | 'complete';
  progress: number;
  previewUrl?: string;
  estimatedCompletion: number;
  message: string;
}

export interface StreamOptions {
  onProgress?: (progress: StreamProgress) => void;
  onPreviewReady?: (fileId: string, previewUrl: string, quality: 'low' | 'medium' | 'high') => void;
  onOptimizationUpdate?: (fileId: string, originalSize: number, optimizedSize: number, quality: number) => void;
  onComplete?: (sessionId: string, results: StreamUploadResult) => void;
  onError?: (error: string, fileId?: string) => void;
}

export interface StreamUploadResult {
  success: boolean;
  url: string;
  slug: string;
  files: StreamFileResult[];
}

export interface StreamFileResult {
  fileId: string;
  fileName: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  previews: {
    thumbnails: string[];
    lowRes: string;
    mediumRes?: string;
    highRes?: string;
  };
  qualityScore: number;
}

export class StreamUploader {
  private session: any = null;
  private options: StreamOptions;
  private isUploading = false;
  private abortController: AbortController | null = null;
  private wsConnection: WebSocket | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor(options: StreamOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize stream upload session
   */
  async initializeStream(files: File[], metadata: any): Promise<void> {
    try {
      const uploadFiles: UploadFile[] = files.map(file => ({
        file,
        fileId: this.generateFileId(),
        chunks: null
      }));

      const response = await fetch(`${API_BASE}/api/stream/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: uploadFiles.map(uf => ({
            fileId: uf.fileId,
            fileName: uf.file.name,
            fileSize: uf.file.size,
            mimeType: uf.file.type
          })),
          metadata
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to initialize stream session');
      }

      this.session = {
        sessionId: result.sessionId,
        files: uploadFiles,
        websocketUrl: result.websocketUrl
      };

      // Connect WebSocket for real-time updates
      await this.connectWebSocket();
      
    } catch (error) {
      console.error('Stream initialization error:', error);
      this.options.onError?.(error instanceof Error ? error.message : 'Stream initialization failed');
      throw error;
    }
  }

  /**
   * Start stream upload with real-time optimization
   */
  async startStreamUpload(): Promise<StreamUploadResult> {
    if (!this.session) {
      throw new Error('Stream session not initialized');
    }

    try {
      this.isUploading = true;
      this.abortController = new AbortController();

      // Start uploading all files with stream processing
      const uploadPromises = this.session.files.map((uploadFile: UploadFile, index: number) => 
        this.streamUploadFile(uploadFile, index)
      );

      await Promise.all(uploadPromises);

      // Complete the upload session
      const result = await this.completeStreamUpload();
      
      this.options.onComplete?.(this.session.sessionId, result);
      return result;

    } catch (error) {
      console.error('Stream upload error:', error);
      this.options.onError?.(error instanceof Error ? error.message : 'Stream upload failed');
      throw error;
    } finally {
      this.isUploading = false;
      this.cleanup();
    }
  }

  /**
   * Upload single file with stream processing
   */
  private async streamUploadFile(uploadFile: UploadFile, fileIndex: number): Promise<void> {
    const { file, fileId } = uploadFile;
    
    // Create chunks for streaming
    const chunkSize = 10 * 1024 * 1024; // 10MB chunks
    const chunks = this.createChunks(file, chunkSize);
    
    // Upload chunks with stream processing
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      if (this.abortController?.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      await this.uploadStreamChunk(fileId!, chunkIndex, chunks[chunkIndex]);
      
      // Real-time progress update happens via WebSocket
      // But we can also manually trigger progress updates
      const uploadProgress = ((chunkIndex + 1) / chunks.length) * 100;
      
      this.options.onProgress?.({
        sessionId: this.session.sessionId,
        fileId: fileId!,
        stage: 'uploading' as const,
        progress: uploadProgress,
        estimatedCompletion: this.estimateCompletion(uploadProgress),
        message: `Uploading chunk ${chunkIndex + 1}/${chunks.length}...`
      });
    }
  }

  /**
   * Upload individual chunk with stream processing
   */
  private async uploadStreamChunk(fileId: string, chunkIndex: number, chunk: Blob): Promise<void> {
    const formData = new FormData();
    formData.append('chunk', chunk);

    const response = await fetch(
      `${API_BASE}/api/stream/chunk/${this.session.sessionId}/${fileId}/${chunkIndex}`,
      {
        method: 'POST',
        body: formData,
        signal: this.abortController?.signal
      }
    );

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Chunk upload failed');
    }

    // The backend will handle real-time optimization and send WebSocket updates
    console.log(`Chunk ${chunkIndex} uploaded. Upload: ${result.uploadProgress}%, Optimization: ${result.optimizationProgress}%`);
  }

  /**
   * Connect WebSocket for real-time updates
   */
  private async connectWebSocket(): Promise<void> {
    if (!this.session?.websocketUrl) {
      console.warn('No WebSocket URL available, falling back to polling');
      this.startPolling();
      return;
    }

    try {
      this.wsConnection = new WebSocket(this.session.websocketUrl);
      
      this.wsConnection.onopen = () => {
        console.log('Stream WebSocket connected');
      };
      
      this.wsConnection.onmessage = (event) => {
        try {
          const update: StreamProgress = JSON.parse(event.data);
          this.handleStreamUpdate(update);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.wsConnection.onclose = () => {
        console.log('Stream WebSocket disconnected, falling back to polling');
        this.startPolling();
      };
      
      this.wsConnection.onerror = (error) => {
        console.error('Stream WebSocket error:', error);
        this.startPolling();
      };
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.startPolling();
    }
  }

  /**
   * Fallback polling for real-time updates
   */
  private startPolling(): void {
    if (this.pollingInterval) return;

    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/stream/status?sessionId=${this.session.sessionId}`
        );
        const result = await response.json();
        
        if (result.success && result.session) {
          // Process each file's status
          result.session.files.forEach((file: any) => {
            const avgProgress = (file.progress.upload + file.progress.optimization + file.progress.preview) / 3;
            
            this.options.onProgress?.({
              sessionId: this.session.sessionId,
              fileId: file.fileId,
              stage: file.status as any,
              progress: avgProgress,
              previewUrl: file.previews.lowRes || file.previews.mediumRes || file.previews.highRes,
              estimatedCompletion: this.estimateCompletion(avgProgress),
              message: this.getStatusMessage(file.status, avgProgress)
            });

            // Check for new previews
            if (file.previews.lowRes && !this.hasNotifiedPreview(file.fileId, 'low')) {
              this.options.onPreviewReady?.(file.fileId, file.previews.lowRes, 'low');
              this.markPreviewNotified(file.fileId, 'low');
            }
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 1000); // Poll every second
  }

  /**
   * Handle real-time stream updates
   */
  private handleStreamUpdate(update: StreamProgress): void {
    this.options.onProgress?.(update);
    
    // Handle preview updates
    if (update.previewUrl && update.stage === 'previewing') {
      this.options.onPreviewReady?.(update.fileId, update.previewUrl, 'low'); // Default to low quality
    }
  }

  /**
   * Complete stream upload session
   */
  private async completeStreamUpload(): Promise<StreamUploadResult> {
    const response = await fetch(`${API_BASE}/api/stream/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: this.session.sessionId
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to complete stream upload');
    }

    return result;
  }

  /**
   * Get current upload status
   */
  async getStreamStatus(): Promise<any> {
    if (!this.session) {
      throw new Error('No stream session');
    }

    const response = await fetch(`${API_BASE}/api/stream/status?sessionId=${this.session.sessionId}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get stream status');
    }

    return result.session;
  }

  /**
   * Cancel ongoing stream upload
   */
  cancelStreamUpload(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isUploading = false;
    this.cleanup();
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Helper methods
   */
  private generateFileId(): string {
    return 'file_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private createChunks(file: File, chunkSize: number): Blob[] {
    const chunks: Blob[] = [];
    let start = 0;
    
    while (start < file.size) {
      const end = Math.min(start + chunkSize, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }
    
    return chunks;
  }

  private estimateCompletion(progress: number): number {
    if (progress === 0) return 60; // Initial estimate
    const remaining = 100 - progress;
    return Math.round((remaining / progress) * 30); // Rough estimate in seconds
  }

  private getStatusMessage(status: string, progress: number): string {
    switch (status) {
      case 'uploading':
        return `Uploading... ${Math.round(progress)}%`;
      case 'optimizing':
        return `Optimizing quality... ${Math.round(progress)}%`;
      case 'previewing':
        return `Generating previews... ${Math.round(progress)}%`;
      case 'complete':
        return 'Processing complete!';
      default:
        return `Processing... ${Math.round(progress)}%`;
    }
  }

  private notifiedPreviews = new Set<string>();

  private hasNotifiedPreview(fileId: string, quality: string): boolean {
    return this.notifiedPreviews.has(`${fileId}:${quality}`);
  }

  private markPreviewNotified(fileId: string, quality: string): void {
    this.notifiedPreviews.add(`${fileId}:${quality}`);
  }

  /**
   * Check if stream upload is recommended for files
   */
  static shouldUseStreamUpload(files: File[]): boolean {
    // Phase 3: Recommend stream upload for files that would benefit from real-time optimization
    // This includes large files, images, PDFs, and multiple files
    
    const STREAM_THRESHOLD = 25 * 1024 * 1024; // 25MB (lower than Phase 2)
    const hasLargeFiles = files.some(file => file.size > STREAM_THRESHOLD);
    const hasOptimizableFiles = files.some(file => 
      file.type.startsWith('image/') || 
      file.type === 'application/pdf' ||
      file.type.startsWith('video/')
    );
    const hasMultipleFiles = files.length > 1;

    return hasLargeFiles || hasOptimizableFiles || hasMultipleFiles;
  }
}
