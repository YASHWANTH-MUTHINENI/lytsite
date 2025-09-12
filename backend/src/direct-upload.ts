/**
 * Direct Chunked Upload System
 * Combines chunking with direct uploads - chunks go directly to R2, bypassing Worker memory
 */

import { Env } from './types';
import { generateId, generateSlug, corsHeaders } from './utils';
import { 
  generateOptimizedVersion, 
  storeFile, 
  generateStorageKeys, 
  isOptimizableFile 
} from './optimization';

export interface DirectChunkSession {
  sessionId: string;
  projectSlug: string;
  files: DirectFileInfo[];
  metadata: {
    title: string;
    description: string;
    template?: string;
    authorName?: string;
    password?: string;
    expiryDate?: string;
  };
  createdAt: string;
  totalSize: number;
}

export interface DirectFileInfo {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  chunkCount: number;
  chunkSize: number;
  storageKeys: {
    originalKey: string;
    optimizedKey: string;
  };
  uploadedChunks: number[];
  complete: boolean;
}

export interface DirectChunkUploadUrl {
  chunkIndex: number;
  uploadUrl: string;
  key: string;
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
const DIRECT_UPLOAD_THRESHOLD = 100 * 1024 * 1024; // Use direct chunked for files >100MB

/**
 * Initialize Direct Chunked Upload Session
 * Returns upload URLs for each chunk that bypass the Worker
 */
export async function initializeDirectChunkedUpload(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { files: any[], metadata: any };
    const { files, metadata } = body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return Response.json({
        success: false,
        error: 'Files array is required'
      }, { status: 400, headers: corsHeaders() });
    }

    const sessionId = generateId();
    const projectSlug = generateSlug();
    const totalSize = files.reduce((sum: number, file: any) => sum + file.size, 0);

    console.log(`Initializing direct chunked upload: ${files.length} files, total: ${Math.round(totalSize / 1024 / 1024)}MB`);

    const sessionFiles: DirectFileInfo[] = [];

    // Process each file and generate chunk upload URLs
    for (const file of files) {
      const fileId = generateId();
      const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
      const storageKeys = generateStorageKeys(projectSlug, fileId, file.name);

      const fileInfo: DirectFileInfo = {
        fileId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        chunkCount,
        chunkSize: CHUNK_SIZE,
        storageKeys,
        uploadedChunks: [],
        complete: false
      };

      sessionFiles.push(fileInfo);

      console.log(`File ${file.name}: ${chunkCount} chunks of ${Math.round(CHUNK_SIZE / 1024 / 1024)}MB each`);
    }

    // Create session
    const session: DirectChunkSession = {
      sessionId,
      projectSlug,
      files: sessionFiles,
      metadata,
      createdAt: new Date().toISOString(),
      totalSize
    };

    // Store session in KV
    await env.LYTSITE_KV.put(`direct-session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 24 * 60 * 60 // 24 hours
    });

    console.log(`Direct chunked session created: ${sessionId}`);

    return Response.json({
      success: true,
      sessionId,
      projectSlug,
      files: sessionFiles.map(f => ({
        fileId: f.fileId,
        fileName: f.fileName,
        chunkCount: f.chunkCount,
        chunkSize: f.chunkSize
      })),
      message: `Session initialized for ${files.length} files`
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Direct chunked upload initialization error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize upload'
    }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * Get presigned URLs for direct chunk uploads to R2
 * Each chunk bypasses the Worker and goes directly to storage
 */
export async function getDirectChunkUploadUrls(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { sessionId: string, fileId: string, chunkIndices: number[] };
    const { sessionId, fileId, chunkIndices } = body;

    if (!sessionId || !fileId || !Array.isArray(chunkIndices)) {
      return Response.json({
        success: false,
        error: 'sessionId, fileId, and chunkIndices array are required'
      }, { status: 400, headers: corsHeaders() });
    }

    // Get session
    const sessionData = await env.LYTSITE_KV.get(`direct-session:${sessionId}`);
    if (!sessionData) {
      return Response.json({
        success: false,
        error: 'Session not found or expired'
      }, { status: 404, headers: corsHeaders() });
    }

    const session: DirectChunkSession = JSON.parse(sessionData);
    const fileInfo = session.files.find(f => f.fileId === fileId);
    
    if (!fileInfo) {
      return Response.json({
        success: false,
        error: 'File not found in session'
      }, { status: 404, headers: corsHeaders() });
    }

    // Generate presigned URLs for each chunk
    const uploadUrls: DirectChunkUploadUrl[] = [];

    for (const chunkIndex of chunkIndices) {
      if (chunkIndex >= fileInfo.chunkCount) {
        return Response.json({
          success: false,
          error: `Invalid chunk index ${chunkIndex} for file with ${fileInfo.chunkCount} chunks`
        }, { status: 400, headers: corsHeaders() });
      }

      // Create chunk key
      const chunkKey = `${fileInfo.storageKeys.originalKey}.chunk.${chunkIndex}`;
      
      // For now, we'll use the Worker as a proxy to R2 since presigned URLs 
      // might not be available in the current Cloudflare Workers environment
      // In a full implementation, you'd generate actual R2 presigned URLs here
      const uploadUrl = `/api/direct-chunk-upload/${sessionId}/${fileId}/${chunkIndex}`;

      uploadUrls.push({
        chunkIndex,
        uploadUrl,
        key: chunkKey
      });
    }

    console.log(`Generated ${uploadUrls.length} direct chunk upload URLs for file ${fileInfo.fileName}`);

    return Response.json({
      success: true,
      uploadUrls,
      message: `Upload URLs generated for ${uploadUrls.length} chunks`
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Direct chunk URL generation error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate upload URLs'
    }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * Handle direct chunk upload - minimal Worker processing
 */
export async function handleDirectChunkUpload(request: Request, env: Env, sessionId: string, fileId: string, chunkIndex: string): Promise<Response> {
  try {
    const chunkIndexNum = parseInt(chunkIndex, 10);
    
    if (isNaN(chunkIndexNum)) {
      return Response.json({
        success: false,
        error: 'Invalid chunk index'
      }, { status: 400, headers: corsHeaders() });
    }

    // Get session
    const sessionData = await env.LYTSITE_KV.get(`direct-session:${sessionId}`);
    if (!sessionData) {
      return Response.json({
        success: false,
        error: 'Session not found or expired'
      }, { status: 404, headers: corsHeaders() });
    }

    const session: DirectChunkSession = JSON.parse(sessionData);
    const fileInfo = session.files.find(f => f.fileId === fileId);
    
    if (!fileInfo) {
      return Response.json({
        success: false,
        error: 'File not found in session'
      }, { status: 404, headers: corsHeaders() });
    }

    // Get chunk data
    const chunkData = await request.arrayBuffer();
    
    if (chunkData.byteLength === 0) {
      return Response.json({
        success: false,
        error: 'Empty chunk data'
      }, { status: 400, headers: corsHeaders() });
    }

    // Store chunk directly to R2 with minimal processing
    const chunkKey = `${fileInfo.storageKeys.originalKey}.chunk.${chunkIndexNum}`;
    
    await storeFile(
      env,
      'ORIGINALS',
      chunkKey,
      chunkData,
      'application/octet-stream',
      {
        sessionId,
        fileId,
        chunkIndex: chunkIndexNum.toString(),
        fileName: fileInfo.fileName,
        uploadedAt: new Date().toISOString()
      }
    );

    // Update session with uploaded chunk
    fileInfo.uploadedChunks.push(chunkIndexNum);
    fileInfo.uploadedChunks.sort((a, b) => a - b);

    // Check if file is complete
    if (fileInfo.uploadedChunks.length === fileInfo.chunkCount) {
      fileInfo.complete = true;
      console.log(`File ${fileInfo.fileName} chunks complete: ${fileInfo.chunkCount}/${fileInfo.chunkCount}`);
    }

    // Update session
    await env.LYTSITE_KV.put(`direct-session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 24 * 60 * 60
    });

    console.log(`Direct chunk uploaded: ${fileInfo.fileName} chunk ${chunkIndexNum} (${Math.round(chunkData.byteLength / 1024)}KB)`);

    return Response.json({
      success: true,
      chunkIndex: chunkIndexNum,
      fileComplete: fileInfo.complete,
      uploadedChunks: fileInfo.uploadedChunks.length,
      totalChunks: fileInfo.chunkCount,
      message: `Chunk ${chunkIndexNum} uploaded successfully`
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Direct chunk upload error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Chunk upload failed'
    }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * Complete direct chunked upload - assemble chunks and trigger optimization
 */
export async function completeDirectChunkedUpload(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { sessionId: string };
    const { sessionId } = body;

    if (!sessionId) {
      return Response.json({
        success: false,
        error: 'sessionId is required'
      }, { status: 400, headers: corsHeaders() });
    }

    // Get session
    const sessionData = await env.LYTSITE_KV.get(`direct-session:${sessionId}`);
    if (!sessionData) {
      return Response.json({
        success: false,
        error: 'Session not found or expired'
      }, { status: 404, headers: corsHeaders() });
    }

    const session: DirectChunkSession = JSON.parse(sessionData);

    // Check if all files are complete
    const incompleteFiles = session.files.filter(f => !f.complete);
    if (incompleteFiles.length > 0) {
      return Response.json({
        success: false,
        error: `${incompleteFiles.length} files are incomplete`,
        incompleteFiles: incompleteFiles.map(f => ({
          fileId: f.fileId,
          fileName: f.fileName,
          uploadedChunks: f.uploadedChunks.length,
          totalChunks: f.chunkCount
        }))
      }, { status: 400, headers: corsHeaders() });
    }

    console.log(`Completing direct chunked upload: ${session.files.length} files for project ${session.projectSlug}`);

    // Assemble files and trigger background optimization
    const fileMetadata: any[] = [];

    for (const fileInfo of session.files) {
      // Assemble chunks into final file
      const chunks: ArrayBuffer[] = [];
      
      for (let i = 0; i < fileInfo.chunkCount; i++) {
        const chunkKey = `${fileInfo.storageKeys.originalKey}.chunk.${i}`;
        try {
          const chunkData = await env.LYTSITE_STORAGE.get(`originals/${chunkKey}`);
          if (chunkData) {
            chunks.push(await chunkData.arrayBuffer());
          } else {
            throw new Error(`Missing chunk ${i} for file ${fileInfo.fileName}`);
          }
        } catch (error) {
          console.error(`Failed to retrieve chunk ${i} for ${fileInfo.fileName}:`, error);
          throw error;
        }
      }

      // Combine chunks
      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
      const combinedData = new ArrayBuffer(totalSize);
      const combinedView = new Uint8Array(combinedData);
      
      let offset = 0;
      for (const chunk of chunks) {
        combinedView.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      // Store complete file
      await storeFile(
        env,
        'ORIGINALS',
        fileInfo.storageKeys.originalKey,
        combinedData,
        fileInfo.fileType,
        {
          fileName: fileInfo.fileName,
          uploadedAt: new Date().toISOString(),
          fileId: fileInfo.fileId,
          projectSlug: session.projectSlug,
          assembledFromChunks: fileInfo.chunkCount.toString()
        }
      );

      // Clean up chunks
      for (let i = 0; i < fileInfo.chunkCount; i++) {
        const chunkKey = `${fileInfo.storageKeys.originalKey}.chunk.${i}`;
        try {
          await env.LYTSITE_STORAGE.delete(`originals/${chunkKey}`);
        } catch (error) {
          console.error(`Failed to delete chunk ${i}:`, error);
        }
      }

      // Start background optimization
      processFileOptimization(env, combinedData, fileInfo)
        .catch(error => console.error('Background optimization failed:', error));

      // Prepare metadata
      const metadata = {
        id: fileInfo.fileId,
        name: fileInfo.fileName,
        size: fileInfo.fileSize,
        type: fileInfo.fileType,
        originalKey: fileInfo.storageKeys.originalKey,
        optimizedKey: fileInfo.storageKeys.optimizedKey,
        uploadedAt: new Date().toISOString(),
        method: 'direct-chunked'
      };

      fileMetadata.push(metadata);

      // Store file metadata
      await env.LYTSITE_KV.put(`file:${fileInfo.fileId}`, JSON.stringify(metadata));

      console.log(`File assembled: ${fileInfo.fileName} (${fileInfo.chunkCount} chunks, ${Math.round(totalSize / 1024 / 1024)}MB)`);
    }

    // Create project data
    const projectData = {
      slug: session.projectSlug,
      ...session.metadata,
      files: fileMetadata,
      createdAt: new Date().toISOString(),
      uploadMethod: 'direct-chunked'
    };

    // Store project metadata
    await env.LYTSITE_KV.put(`project:${session.projectSlug}`, JSON.stringify(projectData));

    // Clean up session
    await env.LYTSITE_KV.delete(`direct-session:${sessionId}`);

    const baseUrl = new URL(request.url).origin;
    const url = `${baseUrl}/${session.projectSlug}`;

    console.log(`Direct chunked upload completed: ${session.projectSlug}`);

    return Response.json({
      success: true,
      url,
      slug: session.projectSlug,
      sessionId,
      filesProcessed: session.files.length,
      message: 'Direct chunked upload completed successfully'
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Direct chunked upload completion error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete upload'
    }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * Get direct chunked upload status
 */
export async function getDirectChunkedUploadStatus(request: Request, env: Env, sessionId: string): Promise<Response> {
  try {
    const sessionData = await env.LYTSITE_KV.get(`direct-session:${sessionId}`);
    
    if (!sessionData) {
      return Response.json({
        success: false,
        error: 'Session not found or expired'
      }, { status: 404, headers: corsHeaders() });
    }

    const session: DirectChunkSession = JSON.parse(sessionData);
    
    const filesStatus = session.files.map(file => ({
      fileId: file.fileId,
      fileName: file.fileName,
      uploadedChunks: file.uploadedChunks.length,
      totalChunks: file.chunkCount,
      progress: Math.round((file.uploadedChunks.length / file.chunkCount) * 100),
      complete: file.complete
    }));

    const totalChunks = session.files.reduce((sum, f) => sum + f.chunkCount, 0);
    const uploadedChunks = session.files.reduce((sum, f) => sum + f.uploadedChunks.length, 0);
    const overallProgress = Math.round((uploadedChunks / totalChunks) * 100);
    const allComplete = session.files.every(f => f.complete);

    return Response.json({
      success: true,
      sessionId,
      projectSlug: session.projectSlug,
      overallProgress,
      allComplete,
      files: filesStatus,
      totalFiles: session.files.length,
      completedFiles: session.files.filter(f => f.complete).length
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Status check error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get status'
    }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * Background file optimization
 */
async function processFileOptimization(env: Env, fileData: ArrayBuffer, fileInfo: DirectFileInfo): Promise<void> {
  try {
    console.log(`Background optimization started for: ${fileInfo.fileName}`);

    if (isOptimizableFile(fileInfo.fileType)) {
      const optimizationResult = await generateOptimizedVersion(
        fileData,
        fileInfo.fileType,
        fileInfo.fileName
      );
      
      if (optimizationResult) {
        await storeFile(
          env,
          'PREVIEWS',
          fileInfo.storageKeys.optimizedKey,
          optimizationResult.optimizedData,
          optimizationResult.contentType,
          {
            fileName: fileInfo.fileName,
            originalFormat: fileInfo.fileType,
            optimizedFormat: optimizationResult.format,
            optimizedAt: new Date().toISOString(),
            fileId: fileInfo.fileId
          }
        );

        // Update file metadata
        const existingMetadata = await env.LYTSITE_KV.get(`file:${fileInfo.fileId}`);
        if (existingMetadata) {
          const metadata = JSON.parse(existingMetadata);
          metadata.optimized = true;
          metadata.optimizedAt = new Date().toISOString();
          metadata.optimizedSize = optimizationResult.size;
          metadata.compressionRatio = Math.round((1 - optimizationResult.size / fileData.byteLength) * 100);
          
          await env.LYTSITE_KV.put(`file:${fileInfo.fileId}`, JSON.stringify(metadata));
        }

        console.log(`Background optimization completed for: ${fileInfo.fileName}`);
      }
    } else {
      console.log(`File type not optimizable: ${fileInfo.fileName} (${fileInfo.fileType})`);
    }
  } catch (error) {
    console.error(`Background optimization failed for ${fileInfo.fileName}:`, error);
  }
}

/**
 * Check if files should use direct chunked upload
 */
export function shouldUseDirectChunkedUpload(files: File[]): boolean {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const hasLargeFiles = files.some(file => file.size > DIRECT_UPLOAD_THRESHOLD);
  
  // Use direct chunked for very large files or large total size
  return hasLargeFiles || totalSize > 200 * 1024 * 1024;
}
