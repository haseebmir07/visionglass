import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";
import { ensureUniqueSlug, buildBlogPayload, withSeoFallbacks } from "@/lib/blogAdmin";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

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

        // Default author to the logged-in admin's name.
        let authorName = body.author;
        if (!authorName) {
            try {
                const client = await clerkClient();
                const u = await client.users.getUser(userId);
                authorName =
                    u.fullName ||
                    `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                    u.username ||
                    "Admin";
            } catch {
                authorName = "Admin";
            }
        }

        const slug = await ensureUniqueSlug(body.slug || body.title);

        let payload = buildBlogPayload(body, { author: authorName, authorId: userId });
        payload = withSeoFallbacks({ ...payload, slug });

        const blog = await Blog.create({ ...payload, slug });

        return NextResponse.json({ success: true, message: "Blog created", blog });
    } catch (error) {
        if (error?.code === 11000) {
            return NextResponse.json({ success: false, message: "Slug already exists" });
        }
        return NextResponse.json({ success: false, message: error.message });
    }
}
