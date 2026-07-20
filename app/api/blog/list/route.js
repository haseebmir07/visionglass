import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";

// Admin list: returns all blogs (drafts + published). Not for public use.
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const blogs = await Blog.find({})
            .sort({ updatedAt: -1 })
            .select("title slug status category author publishedAt scheduledAt updatedAt featuredImage")
            .lean();

        return NextResponse.json({ success: true, blogs });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
