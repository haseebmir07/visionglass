import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";

// Admin single fetch (any status) for the edit form.
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, message: "Blog id is required" });
        }

        await connectDB();
        const blog = await Blog.findById(id).lean();
        if (!blog) {
            return NextResponse.json({ success: false, message: "Blog not found" });
        }

        return NextResponse.json({ success: true, blog });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
