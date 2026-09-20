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
  const englishStories = stories.filter((story) => story.data.language === 'en');
  const japaneseStories = stories.filter((story) => story.data.language === 'ja');
  const englishThemes = [...new Set(englishStories.flatMap((story) => story.data.themes))];
  const japaneseThemes = [...new Set(japaneseStories.flatMap((story) => story.data.themes))];
  const sections = ['japan', 'world', 'arts', 'notebook'];
  const pages = [
    { path: '/', lastmod: undefined },
    { path: '/ja/', lastmod: undefined },
    { path: '/about/', lastmod: undefined },
    { path: '/ja/about/', lastmod: undefined },
    ...sections.filter((section) => englishStories.some((story) => story.data.section.toLowerCase() === section)).map((section) => ({ path: `/section/${section}/`, lastmod: undefined })),
    ...sections.filter((section) => japaneseStories.some((story) => story.data.section.toLowerCase() === section)).map((section) => ({ path: `/ja/section/${section}/`, lastmod: undefined })),
    ...englishThemes.map((theme) => ({ path: `/themes/${encodeURIComponent(theme)}/`, lastmod: undefined })),
    ...japaneseThemes.map((theme) => ({ path: `/ja/themes/${encodeURIComponent(theme)}/`, lastmod: undefined })),
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
