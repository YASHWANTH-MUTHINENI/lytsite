import { Env, ProjectData } from './types';
import { formatFileSize, isImage } from './utils';

export async function serveLytsite(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const slug = url.pathname.slice(1); // Remove leading slash

  if (!slug || slug.length !== 8) {
    return new Response('Not found', { status: 404 });
  }

  // Check if this is an API request (wants JSON)
  const acceptHeader = request.headers.get('accept') || '';
  const wantsJson = acceptHeader.includes('application/json') || url.searchParams.has('json');

  try {
    // Get project from KV
    const projectJson = await env.LYTSITE_KV.get(`project:${slug}`);
    
    if (!projectJson) {
      return new Response('Project not found', { status: 404 });
    }

    const project: ProjectData = JSON.parse(projectJson);
    
    // Check if project has expired
    if (project.expiryDate && Date.now() > project.expiryDate) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen bg-gray-50 flex items-center justify-center">
          <div class="max-w-md mx-auto text-center p-8">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
            <p class="text-gray-600 mb-4">This Lytsite has expired and is no longer accessible.</p>
            <p class="text-sm text-gray-500">Contact the owner for a new link if needed.</p>
          </div>
        </body>
        </html>
      `, { 
        status: 410,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Check if password protection is enabled
    if (project.password) {
      const providedPassword = url.searchParams.get('password');
      
      if (!providedPassword || providedPassword !== project.password) {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Password Protected</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="min-h-screen bg-gray-50 flex items-center justify-center">
            <div class="max-w-md mx-auto p-8">
              <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-center mb-6">
                  <div class="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h1 class="text-2xl font-bold text-gray-900 mb-2">Password Required</h1>
                  <p class="text-gray-600">This Lytsite is password protected.</p>
                </div>
                
                <form onsubmit="handlePasswordSubmit(event)" class="space-y-4">
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Enter Password</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Enter password"
                    >
                  </div>
                  <button 
                    type="submit"
                    class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Access Site
                  </button>
                </form>
              </div>
            </div>
            
            <script>
              function handlePasswordSubmit(event) {
                event.preventDefault();
                const password = event.target.password.value;
                const currentUrl = new URL(window.location);
                currentUrl.searchParams.set('password', password);
                window.location.href = currentUrl.toString();
              }
            </script>
          </body>
          </html>
        `, { 
          status: 401,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Increment view count
    project.views++;
    await env.LYTSITE_KV.put(`project:${slug}`, JSON.stringify(project));

    // 🔑 Prepare the frontend data structure
    const frontendData = {
      title: project.title,
      subLine: project.description || "Shared via Lytsite",
      tagLine: project.authorName ? `By ${project.authorName}` : "Created with Lytsite",
      templateType: project.template || 'universal', // Add template type
      files: project.files.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        url: file.url,
        thumbnailUrl: isImage(file.type) ? file.url : undefined,
        uploadedAt: new Date(project.createdAt).toISOString(),
        uploadedBy: project.authorName || "Anonymous",
        // Pass through presentation data if available (legacy)
        presentationData: file.presentationData,
        // Pass through PowerPoint data if available (AWS LibreOffice conversion)
        powerPointData: file.powerPointData,
      })),
      views: project.views,
      createdAt: project.createdAt,
      slug,
      // Client delivery specific fields (from project data)
      clientName: (project as any).clientName,
      deliveryDate: (project as any).deliveryDate,
      status: (project as any).status,
      contactEmail: (project as any).contactEmail,
      contactPhone: (project as any).contactPhone,
      contactWebsite: (project as any).contactWebsite,
    };

    // If JSON is requested, return pure JSON (for API usage)
    if (wantsJson) {
      return new Response(JSON.stringify(frontendData), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Otherwise, return HTML wrapper that loads our universal template
    const html = generateHtmlWrapper(frontendData, slug);

    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error serving lytsite:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

function generateHtmlWrapper(projectData: any, slug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectData.title)} - Lytsite</title>
  <meta name="description" content="${escapeHtml(projectData.subLine)}">
  <meta property="og:title" content="${escapeHtml(projectData.title)} - Lytsite">
  <meta property="og:description" content="${escapeHtml(projectData.subLine)}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YASHWANTH-MUTHINENI/lytsite@master/dist-standalone/lytsite-template.css?v=104">
</head>
<body class="min-h-screen bg-slate-50">
  <div id="root">
    <!-- Loading state while React hydrates -->
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-slate-600">Loading ${escapeHtml(projectData.title)}...</p>
      </div>
    </div>
  </div>

  <script>
    // Inject project data for React app
    window.LYTSITE_DATA = ${JSON.stringify(projectData)};
    window.LYTSITE_SLUG = "${slug}";
  </script>

  <!-- Load React bundle -->
  <script src="https://cdn.jsdelivr.net/gh/YASHWANTH-MUTHINENI/lytsite@master/dist-standalone/lytsite-template.iife.js?v=104"></script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

