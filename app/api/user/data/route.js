import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    await connectDB();

    let user = await User.findById(userId);

    // ✅ Create user if missing
    if (!user) {
      const client = await clerkClient(); // ⭐ IMPORTANT FIX
      const clerkUser = await client.users.getUser(userId);

      user = await User.create({
        _id: userId,
        name:
          clerkUser.fullName ||
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
        cartItems: {},
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
