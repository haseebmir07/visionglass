import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";

// Title + slug of all posts, used by the editor's "link to another post" picker.
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const posts = await Blog.find({})
            .sort({ updatedAt: -1 })
            .select("title slug status")
            .lean();

        return NextResponse.json({
            success: true,
            posts: posts.map((p) => ({
                title: p.title,
                slug: p.slug,
                status: p.status,
            })),
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
