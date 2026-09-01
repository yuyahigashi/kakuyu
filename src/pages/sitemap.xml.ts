import { getCollection } from 'astro:content';

const SITE = 'https://kakuyu.com';

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const absolute = (path: string) => new URL(path, SITE).href;

export async function GET() {
  const stories = await getCollection('stories', ({ data }) => !data.draft);
  const themes = [...new Set(stories.flatMap((story) => story.data.themes))];
  const pages = [
    { path: '/', lastmod: undefined },
    { path: '/ja/', lastmod: undefined },
    { path: '/about/', lastmod: undefined },
    { path: '/ja/about/', lastmod: undefined },
    ...['japan', 'world', 'arts', 'notebook'].map((section) => ({ path: `/section/${section}/`, lastmod: undefined })),
    ...themes.map((theme) => ({ path: `/themes/${encodeURIComponent(theme)}/`, lastmod: undefined })),
    ...stories.map((story) => ({
      path: `/stories/${story.id}/`,
      lastmod: story.data.publishedAt.toISOString().slice(0, 10),
    })),
  ];

  const entries = pages.map(({ path, lastmod }) => [
    '  <url>',
    `    <loc>${escapeXml(absolute(path))}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    '  </url>',
  ].filter(Boolean).join('\n')).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
