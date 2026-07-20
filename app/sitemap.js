import { getAllPublishedPosts } from '@/lib/blogQueries';
import { SITE_URL, absoluteUrl } from '@/lib/siteConfig';

export const revalidate = 3600;

// Dynamic sitemap: static routes + every published blog post (drafts excluded
// because getAllPublishedPosts only returns published, in-past posts).
export default async function sitemap() {
    let posts = [];
    try {
        posts = await getAllPublishedPosts();
    } catch {
        posts = [];
    }

    const staticRoutes = [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: absoluteUrl('/blog'), lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: absoluteUrl('/all-products'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ];

    const blogRoutes = posts.map((p) => ({
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: p.updatedAt || p.publishedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes];
}
