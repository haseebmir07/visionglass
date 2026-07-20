import connectDB from "@/config/db";
import Blog from "@/models/blog";

// A post is publicly visible only when it is published AND its publishedAt is
// in the past (handles scheduled publishing). Drafts are never returned.
export function publishedFilter() {
    return {
        status: "published",
        publishedAt: { $ne: null, $lte: new Date() },
    };
}

// Convert a Mongoose document into a plain, serializable object safe to pass
// from a Server Component to the client.
function serialize(doc) {
    if (!doc) return null;
    const o = doc.toObject ? doc.toObject() : doc;
    return {
        _id: String(o._id),
        title: o.title || "",
        slug: o.slug || "",
        content: o.content || "",
        excerpt: o.excerpt || "",
        featuredImage: o.featuredImage || "",
        featuredImageAlt: o.featuredImageAlt || "",
        category: o.category || "",
        tags: o.tags || [],
        author: o.author || "",
        status: o.status || "draft",
        readingTime: o.readingTime || 0,
        publishedAt: o.publishedAt ? new Date(o.publishedAt).toISOString() : null,
        updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : null,
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
        seo: {
            metaTitle: o.seo?.metaTitle || "",
            metaDescription: o.seo?.metaDescription || "",
            canonicalUrl: o.seo?.canonicalUrl || "",
            ogTitle: o.seo?.ogTitle || "",
            ogDescription: o.seo?.ogDescription || "",
            ogImage: o.seo?.ogImage || "",
            focusKeyword: o.seo?.focusKeyword || "",
        },
    };
}

// Paginated list of published posts, with optional category / tag / search.
export async function getPublishedPosts({
    page = 1,
    limit = 9,
    category = "",
    tag = "",
    search = "",
} = {}) {
    await connectDB();

    const query = { ...publishedFilter() };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
        const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        query.$or = [{ title: rx }, { excerpt: rx }];
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [docs, total] = await Promise.all([
        Blog.find(query)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Blog.countDocuments(query),
    ]);

    return {
        posts: docs.map(serialize),
        total,
        page: Math.max(1, page),
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
}

export async function getPostBySlug(slug) {
    if (!slug) return null;
    await connectDB();
    const doc = await Blog.findOne({ slug: String(slug).toLowerCase(), ...publishedFilter() }).lean();
    return serialize(doc);
}

export async function getRelatedPosts(post, limit = 3) {
    if (!post) return [];
    await connectDB();
    const docs = await Blog.find({
        ...publishedFilter(),
        _id: { $ne: post._id },
        ...(post.category ? { category: post.category } : {}),
    })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();

    // Fall back to latest posts if the category has too few related items.
    if (docs.length < limit) {
        const extra = await Blog.find({
            ...publishedFilter(),
            _id: { $ne: post._id, $nin: docs.map((d) => d._id) },
        })
            .sort({ publishedAt: -1 })
            .limit(limit - docs.length)
            .lean();
        docs.push(...extra);
    }

    return docs.map(serialize);
}

// All published slugs + lastModified, for generateStaticParams / sitemap / RSS.
export async function getAllPublishedPosts() {
    await connectDB();
    const docs = await Blog.find(publishedFilter())
        .sort({ publishedAt: -1 })
        .lean();
    return docs.map(serialize);
}

// Distinct categories & tags across published posts, for the filter UI.
export async function getCategoriesAndTags() {
    await connectDB();
    const [categories, tags] = await Promise.all([
        Blog.distinct("category", publishedFilter()),
        Blog.distinct("tags", publishedFilter()),
    ]);
    return {
        categories: categories.filter(Boolean).sort(),
        tags: tags.filter(Boolean).sort(),
    };
}
