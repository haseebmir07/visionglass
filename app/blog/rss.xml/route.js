import { getAllPublishedPosts } from '@/lib/blogQueries';
import { SITE_NAME, BLOG_DESCRIPTION, SITE_URL, absoluteUrl } from '@/lib/siteConfig';

export const revalidate = 3600;

const escapeXml = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

export async function GET() {
    let posts = [];
    try {
        posts = await getAllPublishedPosts();
    } catch {
        posts = [];
    }

    const items = posts
        .map((p) => {
            const url = absoluteUrl(`/blog/${p.slug}`);
            const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : '';
            return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ''}
      <description>${escapeXml(p.excerpt || p.seo?.metaDescription || '')}</description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
    </item>`;
        })
        .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
