import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_ID,
  key_secret: process.env.RAZORPAY_TEST_SECRET,
});

// ✅ Create Razorpay order
router.post("/razorpay/order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
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

// ✅ Verify Payment Signature
router.post("/razorpay/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update order as paid in DB
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Signature mismatch" });
  }
});

export default router;
