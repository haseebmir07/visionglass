import { SITE_URL, absoluteUrl } from '@/lib/siteConfig';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/blog', '/blog/'],
                // Keep private/admin areas out of the index.
                disallow: ['/seller', '/seller/', '/cart', '/my-orders', '/add-address', '/api/'],
            },
        ],
        sitemap: absoluteUrl('/sitemap.xml'),
        host: SITE_URL,
    };
}
