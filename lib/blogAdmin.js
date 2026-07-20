import Blog from "@/models/blog";
import { slugify, estimateReadingTime } from "@/lib/slugify";
import { sanitizeBlogHtml, htmlToText } from "@/lib/sanitize";
import { absoluteUrl } from "@/lib/siteConfig";

// Ensure the slug is unique. If a collision exists (excluding the doc being
// edited), append -2, -3, ... Returns a guaranteed-unique lowercase slug.
export async function ensureUniqueSlug(rawSlug, excludeId = null) {
    let base = slugify(rawSlug);
    if (!base) base = `post-${Date.now()}`;

    let candidate = base;
    let n = 1;

    while (true) {
        const query = { slug: candidate };
        if (excludeId) query._id = { $ne: excludeId };
        const existing = await Blog.findOne(query).select("_id").lean();
        if (!existing) return candidate;
        n += 1;
        candidate = `${base}-${n}`;
    }
}

// Build a normalized, sanitized blog document from an incoming JSON body.
// `existing` is the current doc when editing (used for publishedAt logic).
export function buildBlogPayload(body, { author, authorId, existing } = {}) {
    const content = sanitizeBlogHtml(body.content || "");
    const excerpt = (body.excerpt || "").trim();
    const featuredImage = (body.featuredImage || "").trim();
    const status = body.status === "published" ? "published" : "draft";

    // Scheduled publishing: if a future date is provided use it, otherwise now.
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;

    let publishedAt = existing?.publishedAt || null;
    if (status === "published") {
        if (scheduledAt && scheduledAt.getTime() > Date.now()) {
            publishedAt = scheduledAt;
        } else if (!publishedAt) {
            publishedAt = new Date();
        }
    }

    const seo = body.seo || {};

    return {
        title: (body.title || "").trim(),
        content,
        excerpt,
        featuredImage,
        featuredImageAlt: (body.featuredImageAlt || "").trim(),
        category: (body.category || "").trim(),
        tags: Array.isArray(body.tags)
            ? body.tags.map((t) => String(t).trim()).filter(Boolean)
            : [],
        author: (body.author || author || "").trim(),
        authorId: authorId || existing?.authorId || "",
        status,
        scheduledAt,
        publishedAt,
        readingTime: estimateReadingTime(content),
        seo: {
            metaTitle: (seo.metaTitle || "").trim(),
            metaDescription: (seo.metaDescription || "").trim(),
            canonicalUrl: (seo.canonicalUrl || "").trim(),
            ogTitle: (seo.ogTitle || "").trim(),
            ogDescription: (seo.ogDescription || "").trim(),
            ogImage: (seo.ogImage || "").trim(),
            focusKeyword: (seo.focusKeyword || "").trim(),
        },
    };
}

// Sensible SEO fallbacks so posts are always crawlable even if the admin
// leaves the SEO section blank.
export function withSeoFallbacks(payload) {
    const slug = payload.slug;
    const seo = { ...payload.seo };

    if (!seo.metaTitle) seo.metaTitle = payload.title;
    if (!seo.metaDescription) {
        seo.metaDescription =
            payload.excerpt || htmlToText(payload.content).slice(0, 160);
    }
    if (!seo.canonicalUrl && slug) seo.canonicalUrl = absoluteUrl(`/blog/${slug}`);
    if (!seo.ogTitle) seo.ogTitle = seo.metaTitle;
    if (!seo.ogDescription) seo.ogDescription = seo.metaDescription;
    if (!seo.ogImage) seo.ogImage = payload.featuredImage;

    return { ...payload, seo };
}
