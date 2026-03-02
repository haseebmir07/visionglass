import { NextResponse } from "next/server";
import Product from "@/models/product";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/db";

export async function PUT(req) {
  try {

    await connectDB();

    const formData = await req.formData();
    const id = formData.get("id");

    // ================= BASIC FIELDS =================

    const updates = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      offerPrice: Number(formData.get("offerPrice")),
    };

    // ================= ✅ SIZES FIX =================

    const sizes = JSON.parse(formData.get("sizes") || "[]");
    updates.sizes = sizes;

    // remove empty values
    Object.keys(updates).forEach(key => {
      if (!updates[key] && updates[key] !== 0 && key !== "sizes") {
        delete updates[key];
      }
    });

    // ================= EXISTING IMAGES =================

    let existingImages = JSON.parse(
      formData.get("existingImages") || "[]"
    );

    // ================= NEW UPLOADS =================

    const files = formData.getAll("images");

    for (const file of files) {

      if (!file || file.size === 0) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(buffer);

      });

      existingImages.push(uploaded.secure_url);
    }

    updates.image = existingImages;

    // ================= UPDATE DB =================

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}