import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
      },

      // ✅ NEW: mirror dimension / custom size
      size: {
        type: String,
        required: true
      },

      quantity: {
        type: Number,
        required: true
      },

      // ✅ NEW: store price at time of order
      price: {
        type: Number,
        required: true
      }
    }
  ],

  amount: {
    type: Number,
    required: true
  },

  // ✅ NEW: store tax separately
  tax: {
    type: Number,
    required: true
  },

  address: {
    type: Object,
    required: true
  },

  status: {
    type: String,
    default: "Order Placed"
  },

  paymentStatus: {
    type: String,
    default: "Pending"
  },

  date: {
    type: Number,
    required: true
  }

}, { timestamps: true });

const Order =
  mongoose.models.order ||
  mongoose.model("order", orderSchema);

export default Order;