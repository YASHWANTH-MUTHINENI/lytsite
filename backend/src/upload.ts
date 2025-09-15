import { Env, ProjectData, FileMetadata, UploadResponse, DualQualityMetadata } from './types';
import { generateSlug, generateId, corsHeaders, isImage, isPDF, isPowerPoint, processPowerPointFile } from './utils';
import { 
  generateOptimizedVersion, 
  storeFile, 
  retrieveFile,
  generateStorageKeys, 
  isOptimizableFile,
  STORAGE_BUCKETS 
} from './optimization';

export async function handleUpload(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const template = formData.get('template') as string || 'universal-file-template';
    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;
    const password = formData.get('password') as string || undefined;
    const expiryDate = formData.get('expiryDate') as string || undefined;
    const anonymousSessionId = formData.get('anonymousSessionId') as string || undefined;
    const filesMetadataJson = formData.get('filesMetadata') as string;
    const settingsJson = formData.get('settings') as string;

    // Parse additional file metadata if provided (includes presentation data)
    let additionalMetadata: any[] = [];
    if (filesMetadataJson) {
      try {
        additionalMetadata = JSON.parse(filesMetadataJson);
      } catch (error) {
        console.warn('Failed to parse files metadata:', error);
      }
    }

    // Parse project settings if provided
    let projectSettings: any = null;
    if (settingsJson) {
      try {
        projectSettings = JSON.parse(settingsJson);
      } catch (error) {
        console.warn('Failed to parse project settings:', error);
      }
    }

    if (!files.length || !title) {
      return Response.json({ 
        success: false, 
        error: 'Files and title are required' 
      } as UploadResponse, {
        status: 400,
        headers: corsHeaders()
      });
    }

    // Generate project slug first (we'll use this as project ID)
    const projectSlug = generateSlug();

    // Process and store files with dual-quality approach
    const fileMetadata: FileMetadata[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = generateId();
      
      let finalFile = file;
      let finalContentType = file.type;
      let finalName = file.name;
      
      // Handle PowerPoint files first (existing logic)
      if (isPowerPoint(file.type)) {
        try {
          console.log(`Processing PowerPoint file: ${file.name}`);
          const fileBuffer = await file.arrayBuffer();
          const processingResult = await processPowerPointFile(fileBuffer, file.name, env);
          
          // Store original PPTX file
          const originalKey = `files/${fileId}_original`;
          await env.LYTSITE_STORAGE.put(originalKey, processingResult.originalBuffer, {
            httpMetadata: {
              contentType: file.type,
              contentDisposition: `attachment; filename="${file.name}"`
            }
          });
          
          // Store PDF version
          const pdfKey = `files/${fileId}_pdf`;
          const pdfName = file.name.replace(/\.(ppt|pptx)$/i, '.pdf');
          await env.LYTSITE_STORAGE.put(pdfKey, processingResult.pdfBuffer, {
            httpMetadata: {
              contentType: 'application/pdf',
              contentDisposition: `inline; filename="${pdfName}"`
            }
          });
          
          // Store thumbnail images
          const thumbnailUrls: string[] = [];
          for (let i = 0; i < processingResult.thumbnails.length; i++) {
            const thumbnailKey = `files/${fileId}_thumb_${i + 1}`;
            await env.LYTSITE_STORAGE.put(thumbnailKey, processingResult.thumbnails[i], {
              httpMetadata: {
                contentType: 'image/png',
                contentDisposition: `inline; filename="slide_${i + 1}.png"`
              }
            });
            thumbnailUrls.push(`/api/file/${fileId}_thumb_${i + 1}`);
          }
          
          // Use PDF as the main file for viewing
          finalFile = new File([processingResult.pdfBuffer], pdfName, {
            type: 'application/pdf'
          });
          finalContentType = 'application/pdf';
          finalName = pdfName;
          
          // Store PowerPoint processing data for later use
          const powerPointData = {
            originalFileUrl: `/api/file/${fileId}_original`,
            pdfUrl: `/api/file/${fileId}_pdf`,
            thumbnailUrls,
            slideCount: processingResult.slideCount,
            pdfViewerUrl: `/api/file/${fileId}_pdf#view=FitH` // PDF viewer URL
          };
          
          // Add to additional metadata for this file
          if (!additionalMetadata.find(meta => meta.name === file.name)) {
            additionalMetadata.push({
              name: file.name,
              powerPointData
            });
          } else {
            const existingMeta = additionalMetadata.find(meta => meta.name === file.name);
            if (existingMeta) {
              existingMeta.powerPointData = powerPointData;
            }
          }
          
          console.log(`PowerPoint processed successfully: ${finalName} with ${processingResult.slideCount} slides`);
        } catch (error) {
          console.error(`PowerPoint processing failed for ${file.name}:`, error);
          // Fall back to original file if processing fails
        }
      }
      
      // Implement dual-quality storage for all files
      const storageKeys = generateStorageKeys(projectSlug, fileId, finalName);
      const fileBuffer = await finalFile.arrayBuffer();
      
      // Always store the original file
      await storeFile(
        env,
        'ORIGINALS',
        storageKeys.originalKey,
        fileBuffer,
        finalContentType,
        {
          fileName: finalName,
          uploadedAt: new Date().toISOString(),
          fileId: fileId
        }
      );
      
      // Generate and store optimized version if applicable
      let optimizedKey: string | undefined;
      let hasOptimizedVersion = false;
      let optimizationStatus: 'pending' | 'completed' | 'failed' | 'skipped' = 'skipped';
      
      if (isOptimizableFile(finalContentType)) {
        try {
          optimizationStatus = 'pending';
          const optimizationResult = await generateOptimizedVersion(
            fileBuffer,
            finalContentType,
            finalName
          );
          
          if (optimizationResult) {
            await storeFile(
              env,
              'PREVIEWS',
              storageKeys.optimizedKey,
              optimizationResult.optimizedData,
              optimizationResult.contentType,
              {
                fileName: finalName,
                originalFormat: finalContentType,
                optimizedFormat: optimizationResult.format,
                compressionRatio: (fileBuffer.byteLength / optimizationResult.size).toString(),
                optimizedAt: new Date().toISOString(),
                fileId: fileId
              }
            );
            
            optimizedKey = storageKeys.optimizedKey;
            hasOptimizedVersion = true;
            optimizationStatus = 'completed';
            
            console.log(`Optimized version created for ${finalName}: ${fileBuffer.byteLength} -> ${optimizationResult.size} bytes`);
          }
        } catch (error) {
          console.error(`Optimization failed for ${finalName}:`, error);
          optimizationStatus = 'failed';
        }
      }
      
      // Store dual-quality metadata in KV
      const dualQualityMetadata: DualQualityMetadata = {
        fileId,
        fileName: finalName,
        contentType: finalContentType,
        size: fileBuffer.byteLength,
        originalKey: storageKeys.originalKey,
        optimizedKey,
        hasOptimized: hasOptimizedVersion,
        createdAt: new Date().toISOString(),
        optimizedAt: hasOptimizedVersion ? new Date().toISOString() : undefined
      };
      
      await env.LYTSITE_KV.put(`file:${fileId}`, JSON.stringify(dualQualityMetadata));

      // Get additional metadata for this file (if available)
      const additionalData = additionalMetadata.find(meta => meta.name === file.name);
      
      fileMetadata.push({
        id: fileId,
        name: finalName,
        size: fileBuffer.byteLength,
        type: finalContentType,
        url: `/api/file/${fileId}`,
        // Dual-quality storage information
        originalKey: storageKeys.originalKey,
        optimizedKey,
        hasOptimizedVersion,
        optimizationStatus,
        // Include presentation data if available (legacy)
        presentationData: additionalData?.presentationData,
        // Include PowerPoint processing data if available (new)
        powerPointData: additionalData?.powerPointData
      });
    }

    // Create project data
    const projectData: ProjectData = {
      id: projectSlug,
      title,
      description,
      template,
      files: fileMetadata,
      createdAt: Date.now(),
      views: 0,
      authorName,
      authorEmail,
      password: password || undefined,
      expiryDate: expiryDate ? new Date(expiryDate).getTime() : undefined,
      settings: projectSettings || undefined
    };

    // Store project metadata in KV
    await env.LYTSITE_KV.put(`project:${projectSlug}`, JSON.stringify(projectData));

    // Store project in database with anonymous session support
    if (env.LYTSITE_DB) {
      try {
        // Insert project record
        await env.LYTSITE_DB.prepare(`
          INSERT INTO projects 
          (id, slug, title, description, author_name, anonymous_session_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
          projectSlug,
          projectSlug,
          title,
          description,
          authorName || null,
          anonymousSessionId || null
        ).run();

        // Store project settings if provided
        if (projectSettings) {
          await env.LYTSITE_DB.prepare(`
            INSERT OR REPLACE INTO project_settings 
            (project_id, enable_favorites, enable_comments, enable_approvals, enable_analytics, enable_notifications, notification_email, slack_webhook, anonymous_session_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            projectSlug,
            projectSettings.enableFavorites ? 1 : 0,
            projectSettings.enableComments ? 1 : 0,
            projectSettings.enableApprovals ? 1 : 0,
            projectSettings.enableAnalytics ? 1 : 0,
            projectSettings.enableNotifications ? 1 : 0,
            projectSettings.notificationEmail || null,
            projectSettings.slackWebhook || null,
            anonymousSessionId || null
          ).run();
        }
      } catch (error) {
        console.warn('Failed to store project in database:', error);
      }
    }

    const baseUrl = new URL(request.url).origin;
    const projectUrl = `${baseUrl}/${projectSlug}`;

    return Response.json({
      success: true,
      slug: projectSlug,
      url: projectUrl
    } as UploadResponse, {
      headers: corsHeaders()
    });

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({
      success: false,
      error: 'Upload failed'
    } as UploadResponse, {
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function handleFileServing(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const fileId = pathParts.pop();
  
  // Check for mode parameter (preview or download)
  const mode = url.searchParams.get('mode') || 'preview';

  if (!fileId) {
    return new Response('File not found', { status: 404 });
  }

  try {
    // Get file metadata from KV
    const metadataJson = await env.LYTSITE_KV.get(`file:${fileId}`);
    
    if (!metadataJson) {
      // Fallback to legacy file serving for existing files
      return handleLegacyFileServing(fileId, env);
    }
    
    const metadata: DualQualityMetadata = JSON.parse(metadataJson);
    
    // Determine which version to serve
    let bucketType: keyof typeof STORAGE_BUCKETS;
    let key: string;
    let contentType: string;
    let disposition: string;
    
    if (mode === 'download' || !metadata.hasOptimized) {
      // Serve original file for downloads or when no optimized version exists
      bucketType = 'ORIGINALS';
      key = metadata.originalKey;
      contentType = metadata.contentType;
      disposition = `attachment; filename="${encodeURIComponent(metadata.fileName)}"`;
    } else {
      // Serve optimized version for previews
      bucketType = 'PREVIEWS';
      key = metadata.optimizedKey!;
      // For optimized images, content type might be different (e.g., WebP)
      contentType = metadata.contentType.startsWith('image/') ? 'image/webp' : metadata.contentType;
      disposition = `inline; filename="${encodeURIComponent(metadata.fileName)}"`;
    }
    
    // Retrieve file from appropriate bucket
    const object = await retrieveFile(env, bucketType, key);
    
    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', object.size.toString());
    headers.set('Content-Disposition', disposition);
    headers.set('Cache-Control', 'public, max-age=31536000');
    
    // Add custom headers to indicate file version
    headers.set('X-Lytsite-Version', mode === 'download' ? 'original' : 'optimized');
    headers.set('X-Lytsite-File-ID', fileId);
    
    return new Response(object.body as ReadableStream, { headers });

  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('Error serving file', { status: 500 });
  }
}

// Legacy file serving for existing files that don't have dual-quality metadata
async function handleLegacyFileServing(fileId: string, env: Env): Promise<Response> {
  try {
    const object = await env.LYTSITE_STORAGE.get(`files/${fileId}`);
    
    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Length', object.size.toString());
    
    return new Response(object.body, {
      headers
    });

  } catch (error) {
    return new Response('Error serving file', { status: 500 });
  }
}
