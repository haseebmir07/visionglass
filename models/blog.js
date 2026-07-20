import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
    {
        metaTitle: { type: String, default: "" },
        metaDescription: { type: String, default: "" },
        canonicalUrl: { type: String, default: "" },
        ogTitle: { type: String, default: "" },
        ogDescription: { type: String, default: "" },
        ogImage: { type: String, default: "" },
        focusKeyword: { type: String, default: "" },
    },
    { _id: false }
);

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // URL-friendly, lowercase, hyphenated, unique
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        // Sanitized HTML produced by the Tiptap editor
        content: {
            type: String,
            default: "",
        },

        excerpt: {
            type: String,
            default: "",
        },

        featuredImage: {
            type: String,
            default: "",
        },

        featuredImageAlt: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            default: "",
            index: true,
        },

        tags: {
            type: [String],
            default: [],
            index: true,
        },

        // Display name of the author (defaults to the logged-in admin)
        author: {
            type: String,
            default: "",
        },

        // Clerk userId of whoever created the post
        authorId: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
            index: true,
        },

        // The date shown publicly / used for ordering. For scheduled posts this
        // is the future date; a post is only publicly visible once this <= now.
        publishedAt: {
            type: Date,
            default: null,
        },

        // Optional scheduled publish date/time set in the admin form
        scheduledAt: {
            type: Date,
            default: null,
        },

        // Estimated reading time in minutes
        readingTime: {
            type: Number,
            default: 0,
        },

        seo: {
            type: seoSchema,
            default: () => ({}),
        },
    },
    { timestamps: true }
);

const Blog = mongoose.models.blog || mongoose.model("blog", blogSchema);

export default Blog;
