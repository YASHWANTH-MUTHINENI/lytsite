import { Env } from './types';
import { handleUpload, handleFileServing } from './upload';
import { serveLytsite } from './templates';
import { handleCORS } from './utils';

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
    
    // Static files (for development)
    if (url.pathname.startsWith('/static/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
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
