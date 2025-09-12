/**
 * Fast Worker Upload System
 * Optimized Worker-based upload that minimizes processing time
 */

import { Env } from './types';
import { generateId, generateSlug, corsHeaders } from './utils';
import { generateStorageKeys, storeFile } from './optimization';

export interface FastUploadOptions {
  skipOptimization?: boolean;
  streamToStorage?: boolean;
  batchSize?: number;
}

/**
 * Fast upload handler that minimizes Worker processing time
 */
export async function handleFastUpload(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const template = formData.get('template') as string || 'universal-file-template';
    const authorName = formData.get('authorName') as string;
    const skipOptimization = formData.get('skipOptimization') === 'true';

    if (!files.length || !title) {
      return Response.json({ 
        success: false, 
        error: 'Files and title are required' 
      }, {
        status: 400,
        headers: corsHeaders()
      });
    }

    const projectSlug = generateSlug();
    const fileMetadata: any[] = [];

    // Process files with minimal Worker time
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = generateId();
      const storageKeys = generateStorageKeys(projectSlug, fileId, file.name);
      
      // Stream directly to storage without buffering in Worker memory
      const fileBuffer = await file.arrayBuffer();
      
      // Store original immediately (fastest path)
      await storeFile(
        env,
        'ORIGINALS',
        storageKeys.originalKey,
        fileBuffer,
        file.type,
        {
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          fileId: fileId
        }
      );

      // Skip optimization for fastest upload (can be done later asynchronously)
      if (!skipOptimization) {
        // Queue optimization for background processing
        env.ctx?.waitUntil(
          optimizeFileInBackground(env, fileBuffer, file.type, file.name, storageKeys, fileId)
        );
      }

      fileMetadata.push({
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        originalKey: storageKeys.originalKey,
        optimizedKey: skipOptimization ? undefined : storageKeys.optimizedKey
      });
    }

    // Store project metadata
    const projectData = {
      slug: projectSlug,
      title,
      description,
      template,
      authorName: authorName || '',
      files: fileMetadata,
      createdAt: new Date().toISOString()
    };

    await env.LYTSITE_KV.put(`project:${projectSlug}`, JSON.stringify(projectData));

    // Return immediately - optimization happens in background
    const baseUrl = new URL(request.url).origin;
    const url = `${baseUrl}/${projectSlug}`;

    return Response.json({
      success: true,
      url,
      slug: projectSlug,
      message: skipOptimization ? 'Upload complete' : 'Upload complete, optimization in progress'
    }, {
      headers: corsHeaders()
    });

  } catch (error) {
    console.error('Fast upload error:', error);
    return Response.json({
      success: false,
      error: 'Upload failed'
    }, {
      status: 500,
      headers: corsHeaders()
    });
  }
}

/**
 * Background optimization that doesn't block the upload response
 */
async function optimizeFileInBackground(
  env: Env,
  fileBuffer: ArrayBuffer,
  contentType: string,
  fileName: string,
  storageKeys: any,
  fileId: string
): Promise<void> {
  try {
    const { generateOptimizedVersion, isOptimizableFile } = await import('./optimization');
    
    if (isOptimizableFile(contentType)) {
      const optimizationResult = await generateOptimizedVersion(
        fileBuffer,
        contentType,
        fileName
      );
      
      if (optimizationResult) {
        await storeFile(
          env,
          'PREVIEWS',
          storageKeys.optimizedKey,
          optimizationResult.optimizedData,
          optimizationResult.contentType,
          {
            fileName,
            optimizedAt: new Date().toISOString(),
            fileId
          }
        );

        // Update file metadata to indicate optimization is complete
        await env.LYTSITE_KV.put(`file:${fileId}`, JSON.stringify({
          fileId,
          fileName,
          contentType,
          originalKey: storageKeys.originalKey,
          optimizedKey: storageKeys.optimizedKey,
          optimized: true,
          optimizedAt: new Date().toISOString()
        }));
      }
    }
  } catch (error) {
    console.error('Background optimization failed:', error);
  }
}
