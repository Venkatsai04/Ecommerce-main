import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js"; // import Order model
import {verifyToken} from "../middleware/auth.js"; // if you have auth middleware

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_ID,
  key_secret: process.env.RAZORPAY_TEST_SECRET,
});

// Create Razorpay order
router.post("/order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  try {
    const options = {
      amount: amount * 100, // paise
      currency,
      receipt: "receipt_order_" + Math.random().toString(36).slice(2),
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// Verify payment & save order to DB
router.post("/verify", verifyToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address, totalAmount } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return res.status(400).json({ success: false, message: "Signature mismatch" });
  }

  try {
    // ✅ Create order in DB like your old COD order
    const order = await Order.create({
      userId: req.user.id,
      items,
      address,
      paymentMethod: "razorpay",
      totalAmount,
      status: "Paid",
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
});

export default router;
