import { NextResponse } from "next/server";
import Product from "@/models/product";

export async function DELETE(request) {

  try {

    const { id } = await request.json();

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted"
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}
