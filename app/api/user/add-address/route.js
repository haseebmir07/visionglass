// import connectDB from "@/config/db";
// import Address from "@/models/address";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { userId } = getAuth(request); // ✅ call function with (request)

//     const { address } = await request.json();
//     await connectDB();

//     const newAddress = await Address.create({ ...address, userId }); // ✅ spread correctly
//     return NextResponse.json({ success: true, message: "Address added successfully" });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message });
//   }
// }
import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ ADD ADDRESS
export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address required" },
        { status: 400 }
      );
    }

    await Address.create({
      ...address,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
    });

  } catch (error) {
    console.log("Address error:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
