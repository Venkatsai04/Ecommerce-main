import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Order from "../models/orderModel.js";

export const createRazorpayOrder = async (req, res) => {
   try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
      totalAmount,
    } = req.body;

    // Step 1: Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    // Step 2: Save Order
    const newOrder = new Order({
      userId: req.user.id,
      items: items.map((item) => ({
        productId: item._id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      })),
      address,
      paymentMethod: "razorpay",
      totalAmount,
      status: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await newOrder.save();

    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
