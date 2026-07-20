import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Blog from "@/models/blog";

// Distinct categories & tags (all statuses) to power the creatable selects.
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const [categories, tags] = await Promise.all([
            Blog.distinct("category"),
            Blog.distinct("tags"),
        ]);

        return NextResponse.json({
            success: true,
            categories: categories.filter(Boolean).sort(),
            tags: tags.filter(Boolean).sort(),
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
