// Central place for the site's public base URL, used for canonical tags,
// Open Graph URLs, sitemap.xml and the RSS feed.
// Set NEXT_PUBLIC_BASE_URL in your .env (e.g. https://www.visionglassinteriors.com).
export const SITE_URL = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Vision Glass & Interiors";

export const BLOG_DESCRIPTION =
    "Insights, guides and inspiration on glass, mirrors and interiors from Vision Glass & Interiors.";

export const absoluteUrl = (path = "") =>
    `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
