import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";
import { ensureUniqueSlug, buildBlogPayload, withSeoFallbacks } from "@/lib/blogAdmin";

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id } = body;
        if (!id) {
            return NextResponse.json({ success: false, message: "Blog id is required" });
        }

        if (!body.title || !body.title.trim()) {
            return NextResponse.json({ success: false, message: "Title is required" });
        }
        if (body.featuredImage && !(body.featuredImageAlt || "").trim()) {
            return NextResponse.json({
                success: false,
                message: "Alt text is required for the featured image (SEO)",
            });
        }

        await connectDB();

        const existing = await Blog.findById(id);
        if (!existing) {
            return NextResponse.json({ success: false, message: "Blog not found" });
        }

        const slug = await ensureUniqueSlug(body.slug || body.title, id);

        let payload = buildBlogPayload(body, {
            author: existing.author,
            authorId: existing.authorId,
            existing,
        });
        payload = withSeoFallbacks({ ...payload, slug });

        const blog = await Blog.findByIdAndUpdate(
            id,
            { ...payload, slug },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, message: "Blog updated", blog });
    } catch (error) {
        if (error?.code === 11000) {
            return NextResponse.json({ success: false, message: "Slug already exists" });
        }
        return NextResponse.json({ success: false, message: error.message });
    }
}
