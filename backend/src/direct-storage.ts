/**
 * Direct-to-Storage Upload System
 * Bypass Worker for file uploads using presigned URLs
 */

import { Env } from './types';
import { generateId, generateSlug, corsHeaders } from './utils';
import { 
  generateStorageKeys, 
  STORAGE_BUCKETS, 
  generateOptimizedVersion, 
  isOptimizableFile,
  storeFile
} from './optimization';

/**
 * Generate presigned URL for R2 bucket upload
 */
async function generatePresignedUrl(
  env: Env,
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  // Use R2 presigned URL generation
  const options = {
    method: 'PUT' as const,
    expires: new Date(Date.now() + expiresIn * 1000),
    conditions: [
      { bucket: env.LYTSITE_STORAGE },
      ['eq', '$Content-Type', contentType],
      ['content-length-range', 0, 1073741824] // 1GB max
    ]
  };

  // R2 presigned URL - this is a simplified version
  // In production, you'd use the actual R2 presigned URL API
  const presignedUrl = await env.LYTSITE_STORAGE.createPresignedUrl(key, {
    method: 'PUT',
    expiresIn: expiresIn
  });
  
  return presignedUrl;
}

export interface DirectUploadSession {
  sessionId: string;
  projectSlug: string;
  files: DirectUploadFile[];
  metadata: {
    title: string;
    description: string;
    template: string;
    authorName: string;
    password?: string;
    expiryDate?: string;
  };
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  createdAt: string;
}

export interface DirectUploadFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'processed' | 'error';
  presignedUrl?: string;
  uploadedAt?: string;
  storageKeys?: {
    original: string;
    preview?: string;
  };
}

export interface DirectUploadRequest {
  files: {
    fileName: string;
    fileSize: number;
    contentType: string;
  }[];
  metadata: {
    title: string;
    description: string;
    template?: string;
    authorName?: string;
    password?: string;
    expiryDate?: string;
  };
}

export interface DirectUploadResponse {
  success: boolean;
  sessionId: string;
  projectSlug: string;
  files: {
    fileId: string;
    fileName: string;
    presignedUrl: string;
    uploadUrl: string; // For frontend to track
  }[];
  error?: string;
}

/**
 * Initialize Direct-to-Storage upload session
 * Generates presigned URLs for direct R2 uploads
 */
export async function initializeDirectUpload(request: Request, env: Env): Promise<Response> {
  try {
    const requestData = await request.json() as DirectUploadRequest;
    const { files, metadata } = requestData;

    if (!files.length || !metadata.title) {
      return Response.json({
        success: false,
        error: 'Files and title are required'
      }, {
        status: 400,
        headers: corsHeaders()
      });
    }

    // Generate session and project identifiers
    const sessionId = generateId();
    const projectSlug = generateSlug();

    // Process each file and generate presigned URLs
    const uploadFiles: DirectUploadFile[] = [];
    const responseFiles: DirectUploadResponse['files'] = [];

    for (const fileInfo of files) {
      const fileId = generateId();
      const storageKeys = generateStorageKeys(projectSlug, fileId, fileInfo.fileName);

      // Generate presigned URL for original file upload
      const presignedUrl = await generateR2PresignedUrl(
        env.R2_BUCKET_ORIGINALS,
        storageKeys.original,
        'PUT',
        3600, // 1 hour expiration
        fileInfo.contentType,
        fileInfo.fileSize
      );

      const uploadFile: DirectUploadFile = {
        fileId,
        fileName: fileInfo.fileName,
        fileSize: fileInfo.fileSize,
        contentType: fileInfo.contentType,
        status: 'pending',
        presignedUrl,
        storageKeys
      };

      uploadFiles.push(uploadFile);
      responseFiles.push({
        fileId,
        fileName: fileInfo.fileName,
        presignedUrl,
        uploadUrl: `/api/direct-upload/complete/${fileId}`
      });
    }

    // Create upload session
    const session: DirectUploadSession = {
      sessionId,
      projectSlug,
      files: uploadFiles,
      metadata: {
        title: metadata.title,
        description: metadata.description || '',
        template: metadata.template || 'universal-file-template',
        authorName: metadata.authorName || '',
        password: metadata.password,
        expiryDate: metadata.expiryDate
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store session in KV
    await env.KV.put(`upload-session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 7200 // 2 hours
    });

    console.log(`Direct upload session initialized: ${sessionId} with ${files.length} files`);

    return Response.json({
      success: true,
      sessionId,
      projectSlug,
      files: responseFiles
    } as DirectUploadResponse, {
      headers: corsHeaders()
    });

  } catch (error) {
    console.error('Direct upload initialization error:', error);
    return Response.json({
      success: false,
      error: 'Failed to initialize direct upload'
    }, {
      status: 500,
      headers: corsHeaders()
    });
  }
}

/**
 * Mark file as uploaded and trigger post-processing
 */
export async function completeDirectUpload(request: Request, env: Env, fileId: string): Promise<Response> {
  try {
    // Find the session containing this file
    const sessions = await env.KV.list({ prefix: 'upload-session:' });
    let targetSession: DirectUploadSession | null = null;
    let sessionKey = '';

    for (const key of sessions.keys) {
      const sessionData = await env.KV.get(key.name);
      if (sessionData) {
        const session: DirectUploadSession = JSON.parse(sessionData);
        const fileIndex = session.files.findIndex(f => f.fileId === fileId);
        if (fileIndex !== -1) {
          targetSession = session;
          sessionKey = key.name;
          // Update file status
          session.files[fileIndex].status = 'uploaded';
          session.files[fileIndex].uploadedAt = new Date().toISOString();
          break;
        }
      }
    }

    if (!targetSession) {
      return Response.json({
        success: false,
        error: 'Upload session not found'
      }, {
        status: 404,
        headers: corsHeaders()
      });
    }

    // Update session status
    const allUploaded = targetSession.files.every(f => f.status === 'uploaded' || f.status === 'processed');
    if (allUploaded) {
      targetSession.status = 'processing';
    }

    // Save updated session
    await env.KV.put(sessionKey, JSON.stringify(targetSession), {
      expirationTtl: 7200
    });

    // Trigger post-processing for this file
    const uploadedFile = targetSession.files.find(f => f.fileId === fileId);
    if (uploadedFile && uploadedFile.storageKeys) {
      // Queue post-processing (this will happen asynchronously)
      env.ctx?.waitUntil(
        processUploadedFile(env, uploadedFile, targetSession)
      );
    }

    console.log(`File upload completed: ${fileId}, triggering post-processing`);

    return Response.json({
      success: true,
      fileId,
      status: 'uploaded',
      message: 'File upload completed, processing started'
    }, {
      headers: corsHeaders()
    });

  } catch (error) {
    console.error('Direct upload completion error:', error);
    return Response.json({
      success: false,
      error: 'Failed to complete upload'
    }, {
      status: 500,
      headers: corsHeaders()
    });
  }
}

/**
 * Get upload session status
 */
export async function getDirectUploadStatus(request: Request, env: Env, sessionId: string): Promise<Response> {
  try {
    const sessionData = await env.KV.get(`upload-session:${sessionId}`);
    
    if (!sessionData) {
      return Response.json({
        success: false,
        error: 'Session not found'
      }, {
        status: 404,
        headers: corsHeaders()
      });
    }

    const session: DirectUploadSession = JSON.parse(sessionData);

    return Response.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        projectSlug: session.projectSlug,
        status: session.status,
        files: session.files.map(f => ({
          fileId: f.fileId,
          fileName: f.fileName,
          status: f.status,
          uploadedAt: f.uploadedAt
        })),
        createdAt: session.createdAt
      }
    }, {
      headers: corsHeaders()
    });

  } catch (error) {
    console.error('Direct upload status error:', error);
    return Response.json({
      success: false,
      error: 'Failed to get session status'
    }, {
      status: 500,
      headers: corsHeaders()
    });
  }
}

/**
 * Process uploaded file (optimization and metadata storage)
 * This runs asynchronously after file upload
 */
async function processUploadedFile(
  env: Env, 
  file: DirectUploadFile, 
  session: DirectUploadSession
): Promise<void> {
  try {
    if (!file.storageKeys) {
      throw new Error('Storage keys missing');
    }

    // Get the uploaded file from R2
    const originalObject = await env.R2_BUCKET_ORIGINALS.get(file.storageKeys.original);
    if (!originalObject) {
      throw new Error('Uploaded file not found in storage');
    }

    // Import optimization functions
    const { generateOptimizedVersion, isOptimizableFile } = await import('./optimization');

    let optimizedKey: string | undefined;

    // Generate optimized version if file type supports it
    if (isOptimizableFile(file.fileName, file.contentType)) {
      try {
        const originalBuffer = await originalObject.arrayBuffer();
        const optimizedBuffer = await generateOptimizedVersion(originalBuffer, {
          fileName: file.fileName,
          fileType: file.contentType,
          fileSize: file.fileSize
        });

        // Store optimized version
        optimizedKey = file.storageKeys.original.replace('/originals/', '/previews/');
        await env.R2_BUCKET_PREVIEWS.put(optimizedKey, optimizedBuffer, {
          httpMetadata: {
            contentType: file.contentType.startsWith('image/') ? 'image/webp' : file.contentType,
            cacheControl: 'public, max-age=31536000'
          }
        });

        console.log(`Optimized version created: ${optimizedKey}`);
      } catch (optimizationError) {
        console.warn('Optimization failed, using original:', optimizationError);
      }
    }

    // Store file metadata
    const metadata = {
      fileId: file.fileId,
      fileName: file.fileName,
      fileSize: file.fileSize,
      contentType: file.contentType,
      projectSlug: session.projectSlug,
      originalKey: file.storageKeys.original,
      optimizedKey,
      uploadedAt: file.uploadedAt || new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    await env.KV.put(`file:${file.fileId}`, JSON.stringify(metadata));

    // Update file status in session
    const sessionData = await env.KV.get(`upload-session:${session.sessionId}`);
    if (sessionData) {
      const currentSession: DirectUploadSession = JSON.parse(sessionData);
      const fileIndex = currentSession.files.findIndex(f => f.fileId === file.fileId);
      if (fileIndex !== -1) {
        currentSession.files[fileIndex].status = 'processed';
        
        // Check if all files are processed
        const allProcessed = currentSession.files.every(f => f.status === 'processed');
        if (allProcessed) {
          currentSession.status = 'complete';
          
          // Create final project
          await createProjectFromSession(env, currentSession);
        }

        await env.KV.put(`upload-session:${session.sessionId}`, JSON.stringify(currentSession), {
          expirationTtl: 7200
        });
      }
    }

    console.log(`File processing completed: ${file.fileId}`);

  } catch (error) {
    console.error(`File processing failed for ${file.fileId}:`, error);
    
    // Update file status to error
    const sessionData = await env.KV.get(`upload-session:${session.sessionId}`);
    if (sessionData) {
      const currentSession: DirectUploadSession = JSON.parse(sessionData);
      const fileIndex = currentSession.files.findIndex(f => f.fileId === file.fileId);
      if (fileIndex !== -1) {
        currentSession.files[fileIndex].status = 'error';
        await env.KV.put(`upload-session:${session.sessionId}`, JSON.stringify(currentSession), {
          expirationTtl: 7200
        });
      }
    }
  }
}

/**
 * Create final project from completed session
 */
async function createProjectFromSession(env: Env, session: DirectUploadSession): Promise<void> {
  try {
    // Prepare file metadata for project
    const files = session.files.map(file => ({
      fileId: file.fileId,
      fileName: file.fileName,
      fileSize: file.fileSize,
      contentType: file.contentType,
      uploadedAt: file.uploadedAt || new Date().toISOString()
    }));

    // Create project data
    const projectData = {
      slug: session.projectSlug,
      title: session.metadata.title,
      description: session.metadata.description,
      template: session.metadata.template,
      authorName: session.metadata.authorName,
      authorEmail: '', // Not provided in direct upload
      password: session.metadata.password,
      expiryDate: session.metadata.expiryDate,
      files,
      createdAt: session.createdAt,
      completedAt: new Date().toISOString()
    };

    // Store project
    await env.KV.put(`project:${session.projectSlug}`, JSON.stringify(projectData));

    console.log(`Project created from direct upload session: ${session.projectSlug}`);

  } catch (error) {
    console.error('Failed to create project from session:', error);
    throw error;
  }
}
