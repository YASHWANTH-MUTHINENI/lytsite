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
    
    // Increment view count
    project.views++;
    await env.LYTSITE_KV.put(`project:${slug}`, JSON.stringify(project));

    // 🔑 Prepare the frontend data structure
    const frontendData = {
      title: project.title,
      subLine: project.description || "Shared via Lytsite",
      tagLine: project.authorName ? `By ${project.authorName}` : "Created with Lytsite",
      files: project.files.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        url: file.url,
        thumbnailUrl: isImage(file.type) ? file.url : undefined,
        uploadedAt: new Date(project.createdAt).toISOString(),
        uploadedBy: project.authorName || "Anonymous",
      })),
      views: project.views,
      createdAt: project.createdAt,
      slug,
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
  <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEwLjE3ODYgMjEgOS4yNjc4NiAyMC41OTIxIDguNTM4MDNDMjAuMjQ3NiA3LjkyMDgxIDE5LjYxMjUgNy41NDM5IDE4Ljg2NDEgNy4yNzI0OUMxOC4wMTU1IDYuOTYxNTMgMTUuOTk5NiA2Ljk2MTUzIDEyIDYuOTYxNTNDOC4wMDA0NCA2Ljk2MTUzIDUuOTg0NDggNi45NjE1MyA1LjEzNTkyIDcuMjcyNDlDNC4zODc1NCA3LjU0MzkgMy43NTI0NCA3LjkyMDgxIDMuNDA3OSA4LjUzODAzQzMgOS4yNjc4NiAzIDEwLjE3ODYgMyAxMlYxM0MzIDE0LjgyMTQgMyAxNS43MzIxIDMuNDA3OSAxNi40NjJDMy43NTI0NCAxNy4wNzkyIDQuMzg3NTQgMTcuNDU2MSA1LjEzNTkyIDE3LjcyNzVDNS45ODQ0OCAxOC4wMzg1IDguMDAwNDQgMTguMDM4NSAxMiAxOC4wMzg1QzE1Ljk5OTYgMTguMDM4NSAxOC4wMTU1IDE4LjAzODUgMTguODY0MSAxNy43Mjc1QzE5LjYxMjUgMTcuNDU2MSAyMC4yNDc2IDE3LjA3OTIgMjAuNTkyMSAxNi40NjJDMjEgMTUuNzMyMSAyMSAxNC44MjE0IDIxIDEzVjEyWiIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTMgMTFIMTYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+PC9zdmc+Cg==" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YASHWANTH-MUTHINENI/lytsite@master/dist-standalone/lytsite-template.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
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
  <script src="https://cdn.jsdelivr.net/gh/YASHWANTH-MUTHINENI/lytsite@master/dist-standalone/lytsite-template.iife.js"></script>
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

