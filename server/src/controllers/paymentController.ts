import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/Order";

// Initialize Razorpay with validation
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Razorpay configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Validate input
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid amount. Must be a positive number." });
    }

    if (amount > 10000000) {
      // 100k INR limit for security
      return res
        .status(400)
        .json({ message: "Amount exceeds maximum allowed limit." });
    }

    console.log(`[Payment] Creating Razorpay order: ₹${amount} ${currency}`);

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency: currency.toUpperCase(),
      receipt: `kallaa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);
    console.log(`[Payment] Order created successfully: ${order.id}`);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
  } catch (error: any) {
    console.error(`[Payment] Order creation failed:`, error);
    res.status(500).json({
      message: "Could not create payment order",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Missing required payment verification data" });
    }

    if (
      !orderDetails ||
      !orderDetails.productId ||
      !orderDetails.customerName ||
      !orderDetails.customerEmail
    ) {
      return res.status(400).json({ message: "Incomplete order details" });
    }

    console.log(`[Payment] Verifying payment for order: ${razorpay_order_id}`);

    // Create signature for verification
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    // Verify signature
    if (razorpay_signature !== expectedSign) {
      console.warn(
        `[Payment] Invalid signature for order: ${razorpay_order_id}`
      );
      return res
        .status(400)
        .json({ message: "Payment verification failed - invalid signature" });
    }

    // Check if order already exists to prevent duplicates
    const existingOrder = await (Order as any).findOne({
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
    });

    if (existingOrder) {
      console.log(`[Payment] Order already exists: ${existingOrder._id}`);
      return res.status(200).json({
        message: "Payment already verified",
        order: existingOrder,
      });
    }

    // Verify payment status with Razorpay API
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (payment.status !== "captured" && payment.status !== "authorized") {
        console.warn(
          `[Payment] Payment not captured for order: ${razorpay_order_id}, status: ${payment.status}`
        );
        return res.status(400).json({ message: "Payment not completed" });
      }
    } catch (razorpayError) {
      console.error(
        `[Payment] Failed to fetch payment details:`,
        razorpayError
      );
      return res
        .status(500)
        .json({ message: "Could not verify payment status" });
    }

    // Create order in database
    const orderData = {
      ...orderDetails,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "completed", // Payment is verified and captured
      paymentStatus: "paid",
      paymentMethod: "razorpay",
    };

    const result = new Order(orderData);
    await result.save();

    console.log(`[Payment] Payment verified and order created: ${result._id}`);

    res.status(200).json({
      message: "Payment verified and order created successfully",
      order: result,
    });
  } catch (error: any) {
    console.error(`[Payment] Verification error:`, error);
    res.status(500).json({
      message: "Payment verification failed",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};
