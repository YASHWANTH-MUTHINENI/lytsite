import { Env, ProjectData, FileMetadata, UploadResponse } from './types';
import { generateSlug, generateId, corsHeaders, isImage, isPDF, isPowerPoint, processPowerPointFile } from './utils';

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
    const filesMetadataJson = formData.get('filesMetadata') as string;

    // Parse additional file metadata if provided (includes presentation data)
    let additionalMetadata: any[] = [];
    if (filesMetadataJson) {
      try {
        additionalMetadata = JSON.parse(filesMetadataJson);
      } catch (error) {
        console.warn('Failed to parse files metadata:', error);
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

    // Process and store files
    const fileMetadata: FileMetadata[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = generateId();
      const key = `files/${fileId}`;
      
      let finalFile = file;
      let finalContentType = file.type;
      let finalName = file.name;
      
      // Process PowerPoint files comprehensively
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
      
      // Store file in R2
      await env.LYTSITE_STORAGE.put(key, finalFile.stream(), {
        httpMetadata: {
          contentType: finalContentType,
          contentDisposition: `attachment; filename="${finalName}"`
        }
      });

      // Get additional metadata for this file (if available)
      const additionalData = additionalMetadata.find(meta => meta.name === file.name);
      
      fileMetadata.push({
        id: fileId,
        name: finalName,
        size: finalFile.size,
        type: finalContentType,
        url: `/api/file/${fileId}`,
        // Include presentation data if available (legacy)
        presentationData: additionalData?.presentationData,
        // Include PowerPoint processing data if available (new)
        powerPointData: additionalData?.powerPointData
      });
    }

    // Generate project slug
    const projectSlug = generateSlug();
    
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
      expiryDate: expiryDate ? new Date(expiryDate).getTime() : undefined
    };

    // Store project metadata in KV
    await env.LYTSITE_KV.put(`project:${projectSlug}`, JSON.stringify(projectData));

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
  const fileId = url.pathname.split('/').pop();

  if (!fileId) {
    return new Response('File not found', { status: 404 });
  }

  try {
    const object = await env.LYTSITE_STORAGE.get(`files/${fileId}`);
    
    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    
    return new Response(object.body, {
      headers
    });

  } catch (error) {
    return new Response('Error serving file', { status: 500 });
  }
}
