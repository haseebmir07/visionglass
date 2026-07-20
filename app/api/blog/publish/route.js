import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";

// Toggle a post between published and draft.
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id, status } = await request.json();
        if (!id) {
            return NextResponse.json({ success: false, message: "Blog id is required" });
        }

        await connectDB();
        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ success: false, message: "Blog not found" });
        }

        const nextStatus =
            status === "published" || status === "draft"
                ? status
                : blog.status === "published"
                    ? "draft"
                    : "published";

        blog.status = nextStatus;
        if (nextStatus === "published" && !blog.publishedAt) {
            blog.publishedAt = new Date();
        }
        await blog.save();

        return NextResponse.json({
            success: true,
            message: nextStatus === "published" ? "Blog published" : "Blog set to draft",
            blog,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
