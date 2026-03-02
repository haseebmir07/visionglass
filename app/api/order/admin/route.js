import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";


// ⭐ invoice email builder
function buildInvoiceEmail(order, title, message) {

  const itemsRows = order.items.map(item => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd;">
        ${item.product?.name}
      </td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center;">
        ${item.quantity}
      </td>
    </tr>
  `).join("");

  return `
  <div style="font-family:Arial;background:#f4f4f4;padding:20px;">

    <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px;">

      <h2 style="text-align:center;">${title}</h2>

      <p style="text-align:center;color:#555;">${message}</p>

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
        Total: ₹${order.amount}
      </h3>

      <hr/>

      <p style="text-align:center;color:gray;">
        Thank you for shopping with us.
      </p>

    </div>

  </div>
  `;
}


// ✅ GET — fetch orders
export async function GET() {

  try {

    await connectDB();

    const orders = await Order.find()
      .populate("items.product")
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: error.message,
    });

  }
}


// ✅ POST — admin actions (atomic update + email)
export async function POST(req) {

  try {

    const { orderId, action } = await req.json();

    await connectDB();

    let update = {};
    let title = "";
    let message = "";

    // ⭐ action mapping
    if (action === "accept") {
      update.status = "Accepted";
      title = "✅ Order Accepted";
      message = "Your order has been accepted and is being prepared.";
    }

    if (action === "reject") {
      update.status = "Rejected";
      title = "❌ Order Rejected";
      message = "Unfortunately your order was rejected.";
    }

    if (action === "payment") {
      update.paymentStatus = "Paid";
      title = "💰 Payment Confirmed";
      message = "Your payment has been successfully received.";
    }

    // ⭐ atomic DB update
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      update,
      { new: true }
    ).populate("items.product");

    if (!updatedOrder) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    // ⭐ build invoice email
    const html = buildInvoiceEmail(updatedOrder, title, message);

    // ⭐ send email
    const recipient = updatedOrder.address?.email;

    if (recipient) {

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: title,
        html,
      });

      console.log("✅ Invoice email sent:", recipient);

    } else {

      console.log("⚠ Missing email for order:", updatedOrder._id);

    }

    return NextResponse.json({
      success: true,
      message: "Action completed",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });

  }
}
