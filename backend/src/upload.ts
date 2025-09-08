import { Env, ProjectData, FileMetadata, UploadResponse } from './types';
import { generateSlug, generateId, corsHeaders, isImage, isPDF } from './utils';

export async function handleUpload(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const template = formData.get('template') as string || 'universal-file-template';
    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;

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
    
    for (const file of files) {
      const fileId = generateId();
      const key = `files/${fileId}`;
      
      // Store file in R2
      await env.LYTSITE_STORAGE.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          contentDisposition: `attachment; filename="${file.name}"`
        }
      });
      
      fileMetadata.push({
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/api/file/${fileId}`
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
      authorEmail
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
