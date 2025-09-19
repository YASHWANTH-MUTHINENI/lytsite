import { Env } from './types';
import { handleUpload, handleFileServing } from './upload';
import { serveLytsite } from './templates';
import { handleCORS, corsHeaders } from './utils';
import { rateLimit, addSecurityHeaders, optionalAuth } from './auth-middleware';

// Helper function to wrap API responses with security headers
async function secureApiResponse(handler: () => Promise<Response>): Promise<Response> {
  try {
    const response = await handler();
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('API Error:', error);
    const errorResponse = new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
    return addSecurityHeaders(errorResponse);
  }
}
import { AdvancedFeaturesAPI } from './api';
import { handleCreatorAPI } from './creator-api';
import { handleEmailCollection } from './email-collection';
import { BillingAPI } from './billing/api';
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
    
    console.log('🔥 Worker: Received request:', request.method, url.pathname);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Apply rate limiting to API routes
    if (url.pathname.startsWith('/api/')) {
      const rateLimitResult = await rateLimit(100, 60000)(request, env); // 100 requests per minute
      if (rateLimitResult instanceof Response) {
        return addSecurityHeaders(rateLimitResult); // Return rate limit error with security headers
      }
    }
    
    // Serve static files from dist-standalone/ directory (e.g., /logo.png, /favicon.ico, etc.)
    // Wrangler assets binding (ASSETS) must be configured in wrangler.toml to point to dist-standalone
    if (url.pathname.match(/^\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|svg|ico)$/)) {
      if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status === 200) return assetResponse;
      }
      return new Response('Not found', { status: 404 });
    }

    // API Routes
    if (url.pathname.startsWith('/api/upload')) {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => handleUpload(request, env));
    }

    // Phase 2: Chunked upload routes
    if (url.pathname === '/api/chunked-upload/init') {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => initializeChunkedUpload(request, env));
    }

    if (url.pathname.startsWith('/api/upload-chunk/')) {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => handleChunkUpload(request, env));
    }

    if (url.pathname === '/api/chunked-upload/complete') {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => completeChunkedUpload(request, env));
    }

    if (url.pathname === '/api/upload-session/status') {
      if (request.method !== 'GET') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => getUploadSessionStatus(request, env));
    }

    // Direct Chunked Upload routes
    if (url.pathname === '/api/direct-upload/init') {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => initializeDirectChunkedUpload(request, env));
    }

    if (url.pathname === '/api/direct-upload/urls') {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => getDirectChunkUploadUrls(request, env));
    }

    if (url.pathname.startsWith('/api/direct-chunk-upload/')) {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => {
        const pathParts = url.pathname.split('/');
        const sessionId = pathParts[3];
        const fileId = pathParts[4];
        const chunkIndex = pathParts[5];
        
        if (!sessionId || !fileId || !chunkIndex) {
          return new Response('Invalid chunk upload path', { status: 400 });
        }
        
        return handleDirectChunkUpload(request, env, sessionId, fileId, chunkIndex);
      });
    }

    if (url.pathname === '/api/direct-upload/complete') {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => completeDirectChunkedUpload(request, env));
    }

    if (url.pathname.startsWith('/api/direct-upload/status/')) {
      if (request.method !== 'GET') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => {
        const sessionId = url.pathname.split('/').pop();
        if (!sessionId) {
          return new Response('Session ID required', { status: 400 });
        }
        return getDirectChunkedUploadStatus(request, env, sessionId);
      });
    }

    // Phase 3: Stream processing routes
    if (url.pathname === '/api/stream/init') {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => initializeStreamSession(request, env));
    }

    if (url.pathname.startsWith('/api/stream/chunk/')) {
      if (request.method !== 'POST') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => handleStreamChunk(request, env));
    }

    if (url.pathname === '/api/stream/status') {
      if (request.method !== 'GET') {
        return secureApiResponse(async () => new Response('Method not allowed', { status: 405 }));
      }
      return secureApiResponse(async () => getStreamStatus(request, env));
    }
    
    if (url.pathname.startsWith('/api/file/') || url.pathname.startsWith('/api/files/')) {
      return secureApiResponse(async () => handleFileServing(request, env));
    }
    
    if (url.pathname.startsWith('/api/track/')) {
      return secureApiResponse(async () => handleDownloadTracking(request, env));
    }

    // Anonymous projects route
    if (url.pathname.startsWith('/api/projects/anonymous/')) {
      if (request.method === 'GET') {
        return secureApiResponse(async () => {
          const sessionId = url.pathname.split('/').pop();
          if (!sessionId) {
            return new Response('Session ID required', { status: 400, headers: corsHeaders() });
          }
          
          try {
            const { CreatorAPI } = await import('./creator-api');
            const api = new CreatorAPI(env);
            console.log('Fetching anonymous projects for session:', sessionId);
            const projects = await api.getAnonymousProjects(sessionId);
            console.log('Anonymous projects found:', projects?.length || 0);
            return new Response(JSON.stringify({ projects }), {
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders()
              },
            });
          } catch (error) {
            console.error('Failed to fetch anonymous projects:', error);
            return new Response(JSON.stringify({ 
              error: 'Internal server error', 
              message: error instanceof Error ? error.message : 'Unknown error'
            }), { 
              status: 500,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders()
              }
            });
          }
        });
      }
    }

    // Anonymous engagement summary route
    if (url.pathname.startsWith('/api/engagement/anonymous/')) {
      if (request.method === 'GET') {
        return secureApiResponse(async () => {
          const sessionId = url.pathname.split('/').pop();
          if (!sessionId) {
            return new Response(JSON.stringify({ error: 'Session ID required' }), { 
              status: 400, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders() } 
            });
          }
          
          try {
            const { CreatorAPI } = await import('./creator-api');
            const api = new CreatorAPI(env);
            console.log('Fetching engagement summary for session:', sessionId);
            const summary = await api.getAnonymousEngagementSummary(sessionId);
            
            if (!summary) {
              return new Response(JSON.stringify({ 
                error: 'No projects found for this session' 
              }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders() }
              });
            }
            
            console.log('Engagement summary found:', summary);
            return new Response(JSON.stringify(summary), {
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders()
              },
            });
          } catch (error) {
            console.error('Failed to fetch engagement summary:', error);
            return new Response(JSON.stringify({ 
              error: 'Internal server error', 
              message: error instanceof Error ? error.message : 'Unknown error'
            }), { 
              status: 500,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders()
              }
            });
          }
        });
      }
    }

    // Email collection route
    if (url.pathname === '/api/email-collection') {
      return secureApiResponse(async () => handleEmailCollection(request, env));
    }

    // Creator API routes
    if (url.pathname.startsWith('/api/creators')) {
      return handleCreatorAPI(request, env);
    }

    // Project details API route (comprehensive dashboard)
    if (url.pathname.match(/^\/api\/projects\/([^\/]+)\/details$/)) {
      return secureApiResponse(async () => {
        const projectId = url.pathname.split('/')[3];
        console.log('📊 Worker: Project details request for:', projectId);
        
        try {
          const { CreatorAPI } = await import('./creator-api');
          const api = new CreatorAPI(env);
          const projectDetails = await api.getProjectDetails(projectId);
          
          return new Response(JSON.stringify({ project: projectDetails }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        } catch (error) {
          console.error('💥 Project details error:', error);
          return new Response(JSON.stringify({ 
            error: 'Failed to load project details',
            message: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }
      });
    }

    // Billing API routes
    if (url.pathname.startsWith('/api/billing')) {
      console.log('💰 Worker: Billing API route matched:', url.pathname);
      return secureApiResponse(async () => {
        console.log('💰 Worker: Creating BillingAPI instance');
        const api = new BillingAPI(env);
        console.log('💰 Worker: Calling api.handleRequest');
        return api.handleRequest(request);
      });
    }

    // Advanced Features API routes
    if (url.pathname.startsWith('/api/favorites') || 
        url.pathname.startsWith('/api/comments') || 
        url.pathname.startsWith('/api/approvals') || 
        url.pathname.startsWith('/api/analytics') || 
        url.pathname.startsWith('/api/notifications') || 
        url.pathname.startsWith('/api/project-settings')) {
      console.log('🔥 Worker: Advanced Features API route matched:', url.pathname);
      return secureApiResponse(async () => {
        console.log('🔥 Worker: Creating AdvancedFeaturesAPI instance');
        const api = new AdvancedFeaturesAPI(env);
        console.log('🔥 Worker: Calling api.handleRequest');
        return api.handleRequest(request);
      });
    }
    
    if (url.pathname === '/api/health') {
      return secureApiResponse(async () => Response.json({ 
        status: 'ok', 
        timestamp: Date.now(),
        environment: env.ENVIRONMENT 
      }));
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
    
    const notFoundResponse = new Response('Not found', { status: 404 });
    return addSecurityHeaders(notFoundResponse);
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
    
    return addSecurityHeaders(Response.json({ success: true, downloads: newCount }));
    
  } catch (error) {
    console.error('Download tracking error:', error);
    return addSecurityHeaders(Response.json({ success: false }, { status: 500 }));
  }
}
