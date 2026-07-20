import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ success: false, message: "Blog id is required" });
        }

        await connectDB();
        await Blog.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Blog deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
