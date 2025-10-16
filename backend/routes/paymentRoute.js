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

  console.log("Verifying payment:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_SECRET)
    .update(body)
    .digest("hex");

  console.log("Expected signature:", expectedSignature);

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Signature mismatch" });
  }

  // Proceed to save order
});

export default router;
