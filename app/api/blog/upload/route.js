import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";
import authSeller from "@/lib/authSeller";

// Uploads a single image to Cloudinary and returns its secure URL.
// Used for the featured image and for inline images inside the editor.
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("image");

        if (!file) {
            return NextResponse.json({ success: false, message: "No image provided" });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "image", folder: "blog" },
                (error, uploaded) => {
                    if (error) reject(error);
                    else resolve(uploaded);
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ success: true, url: result.secure_url });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
