import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Order from "@/models/Order";
import User from "@/models/user";

export async function GET(request) {

  try {

    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await User.findById(userId);

    const orders = await Order.find({ userId })
      .populate("items.product")
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      orders,
      email: user?.email || ""
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}
