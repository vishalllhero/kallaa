import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled", "shipped"], default: "pending" },

  // Razorpay payment details
  razorpay_order_id: { type: String, sparse: true },
  razorpay_payment_id: { type: String, sparse: true },
  razorpay_signature: { type: String, sparse: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  paymentMethod: { type: String, default: "razorpay" },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance and duplicate prevention
orderSchema.index({ razorpay_order_id: 1, razorpay_payment_id: 1 }, { unique: true, sparse: true });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
