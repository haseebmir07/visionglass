import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import Order from "@/models/Order";
import User from "@/models/user";
import connectDB from "@/config/db";
import nodemailer from "nodemailer";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {

  try {

    await connectDB();

    const { userId } = getAuth(request);
    const { address } = await request.json();

    if (!userId || !address) {
      return NextResponse.json({
        success: false,
        message: "Invalid data"
      });
    }

    // ✅ FIXED HERE
    const user = await User.findById(userId);

    if (!user || !user.cartItems || Object.keys(user.cartItems).length === 0) {
      return NextResponse.json({
        success: false,
        message: "Cart is empty"
      });
    }

    const cartItems = user.cartItems;

    let items = [];
    let amount = 0;

    for (const productId in cartItems) {

      const product = await Product.findById(productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {

        const quantity = cartItems[productId][size];
        if (quantity <= 0) continue;

        items.push({
          product: productId,
          size: size,
          quantity: quantity,
          price: product.offerPrice
        });

        amount += product.offerPrice * quantity;
      }
    }

    if (items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Cart is empty"
      });
    }

    const tax = Math.floor(amount * 0.02);
    const finalAmount = amount + tax;

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress || "";

    const addressWithEmail = {
      ...address,
      email
    };

    const order = await Order.create({
      userId,
      address: addressWithEmail,
      items,
      amount: finalAmount,
      tax,
      date: Date.now(),
      status: "Order Placed",
      paymentStatus: "Pending"
    });

    await order.populate("items.product");

    const itemsRows = order.items.map(item => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">
          ${item.product?.name}<br/>
          <small>Size: ${item.size}</small>
        </td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center;">
          ${item.quantity}
        </td>
      </tr>
    `).join("");

    const adminHtml = `
    <div style="font-family:Arial;background:#f4f4f4;padding:20px;">
      <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px;">
        <h2 style="text-align:center;">🧾 New Order Invoice</h2>
        <hr/>
        <h3>Customer Details</h3>
        <p>
          <b>Name:</b> ${order.address.fullName}<br/>
          <b>Email:</b> ${order.address.email}<br/>
          <b>Phone:</b> ${order.address.phoneNumber}
        </p>
        <h3>Delivery Address</h3>
        <p>
          ${order.address.area}<br/>
          ${order.address.city}, ${order.address.state}
        </p>
        <h3>Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#eee;">
            <th style="padding:8px;border:1px solid #ddd;">Product</th>
            <th style="padding:8px;border:1px solid #ddd;">Qty</th>
          </tr>
          ${itemsRows}
        </table>
        <h3 style="text-align:right;margin-top:15px;">
          Subtotal: ₹${amount}<br/>
          Tax: ₹${tax}<br/>
          Total: ₹${finalAmount}
        </h3>
        <hr/>
        <p style="text-align:center;color:gray;">
          New order received — please process promptly.
        </p>
      </div>
    </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Invoice",
      html: adminHtml,
    });

    await inngest.send({
      name: "order/create",
      data: order
    });

    user.cartItems = {};
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}