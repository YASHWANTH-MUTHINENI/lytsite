/**
 * Dynamic Sitemap Generator for Lytsite
 * This can be used to generate sitemaps that include discoverable generated sites
 */

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(discoverableSites: Array<{slug: string, lastModified: string}> = []): string {
  const baseUrl = 'https://lytsite.com';
  const now = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    // Main site pages
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: now,
      changefreq: 'monthly', 
      priority: 0.8
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5
    }
  ];

  // Add discoverable generated sites (if any)
  discoverableSites.forEach(site => {
    urls.push({
      loc: `${baseUrl}/${site.slug}`,
      lastmod: site.lastModified,
      changefreq: 'monthly',
      priority: 0.6
    });
  });

  // Generate XML
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const xmlFooter = '</urlset>';
  
  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return xmlHeader + xmlUrls + '\n' + xmlFooter;
}

// Usage example for backend integration:
// const discoverableSites = await getDiscoverableSites(); // Fetch from KV
// const sitemap = generateSitemap(discoverableSites);
// return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });