import { Env } from './types';
import { handleUpload, handleFileServing } from './upload';
import { serveLytsite } from './templates';
import { handleCORS } from './utils';
// Phase 2: Import chunked upload handlers
import { 
  initializeChunkedUpload, 
  handleChunkUpload, 
  completeChunkedUpload, 
  getUploadSessionStatus 
} from './chunked-upload';
// Phase 3: Import stream processing handlers
import { 
  initializeStreamSession, 
  handleStreamChunk, 
  getStreamStatus 
} from './stream-processing';
// Direct-to-Storage: Import direct upload handlers
import {
  initializeDirectChunkedUpload,
  getDirectChunkUploadUrls,
  handleDirectChunkUpload,
  completeDirectChunkedUpload,
  getDirectChunkedUploadStatus
} from './direct-upload';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }
    
    // API Routes
    if (url.pathname.startsWith('/api/upload')) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleUpload(request, env);
    }

    // Phase 2: Chunked upload routes
    if (url.pathname === '/api/chunked-upload/init') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return initializeChunkedUpload(request, env);
    }

    if (url.pathname.startsWith('/api/upload-chunk/')) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleChunkUpload(request, env);
    }

    if (url.pathname === '/api/chunked-upload/complete') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return completeChunkedUpload(request, env);
    }

    if (url.pathname === '/api/upload-session/status') {
      if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
      }
      return getUploadSessionStatus(request, env);
    }

    // Direct Chunked Upload routes
    if (url.pathname === '/api/direct-upload/init') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return initializeDirectChunkedUpload(request, env);
    }

    if (url.pathname === '/api/direct-upload/urls') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return getDirectChunkUploadUrls(request, env);
    }

    if (url.pathname.startsWith('/api/direct-chunk-upload/')) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      const pathParts = url.pathname.split('/');
      const sessionId = pathParts[3];
      const fileId = pathParts[4];
      const chunkIndex = pathParts[5];
      
      if (!sessionId || !fileId || !chunkIndex) {
        return new Response('Invalid chunk upload path', { status: 400 });
      }
      
      return handleDirectChunkUpload(request, env, sessionId, fileId, chunkIndex);
    }

    if (url.pathname === '/api/direct-upload/complete') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return completeDirectChunkedUpload(request, env);
    }

    if (url.pathname.startsWith('/api/direct-upload/status/')) {
      if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
      }
      const sessionId = url.pathname.split('/').pop();
      if (!sessionId) {
        return new Response('Session ID required', { status: 400 });
      }
      return getDirectChunkedUploadStatus(request, env, sessionId);
    }

    // Phase 3: Stream processing routes
    if (url.pathname === '/api/stream/init') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return initializeStreamSession(request, env);
    }

    if (url.pathname.startsWith('/api/stream/chunk/')) {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
      return handleStreamChunk(request, env);
    }

    if (url.pathname === '/api/stream/status') {
      if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
      }
      return getStreamStatus(request, env);
    }
    
    if (url.pathname.startsWith('/api/file/')) {
      return handleFileServing(request, env);
    }
    
    if (url.pathname.startsWith('/api/track/')) {
      return handleDownloadTracking(request, env);
    }
    
    if (url.pathname === '/api/health') {
      return Response.json({ 
        status: 'ok', 
        timestamp: Date.now(),
        environment: env.ENVIRONMENT 
      });
    }
    
    // Serve static assets from dist-standalone (JS, CSS, images, etc.)
    if (url.pathname.match(/^\/[a-zA-Z0-9._-]+\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
      // Try to serve from ASSETS binding if configured
      if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        try {
          const assetResponse = await env.ASSETS.fetch(request);
          if (assetResponse.status === 200) {
            return assetResponse;
          }
        } catch (error) {
          console.log('Asset serving error:', error);
        }
      }
      return new Response('Asset not found', { status: 404 });
    }
    
    // Static files (for development)
    if (url.pathname.startsWith('/static/')) {
      return new Response('Not found', { status: 404 });
    }
    
    // Lytsite project routes (8-character slugs)
    if (url.pathname.match(/^\/[a-zA-Z0-9]{8}$/)) {
      return serveLytsite(request, env);
    }
    
    // Root redirect to main site
    if (url.pathname === '/') {
      return Response.redirect('https://lytsite.com', 302);
    }
    
    return new Response('Not found', { status: 404 });
  }
};

async function handleDownloadTracking(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const url = new URL(request.url);
    const fileId = url.pathname.split('/').pop();
    
    if (!fileId) {
      return new Response('Invalid file ID', { status: 400 });
    }
    
    // Increment download count in KV
    const key = `downloads:${fileId}`;
    const currentCount = await env.LYTSITE_KV.get(key);
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
    
    await env.LYTSITE_KV.put(key, newCount.toString());
    
    return Response.json({ success: true, downloads: newCount });
    
  } catch (error) {
    console.error('Download tracking error:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}
