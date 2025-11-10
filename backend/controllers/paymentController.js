import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Order from "../models/orderModel.js";
import { createShiprocketOrder } from "../utils/shiprocket.js";

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
    const newOrder = await Order.create({
      userId: req.user?.id || null,
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

    console.log("✅ Razorpay order created:", newOrder._id);

    // ✅ Build Shiprocket payload (identical to COD)
    const payload = {
      order_id: `ORDER-${newOrder._id.toString()}`,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: "Default",
      billing_customer_name: address.firstName,
      billing_last_name: address.lastName,
      billing_address: address.street,
      billing_city: address.city,
      billing_pincode: address.zip,
      billing_state: address.state,
      billing_country: address.country || "India",
      billing_email: address.email,
      billing_phone: address.mobile,
      shipping_is_billing: true,
      order_items: items.map((i) => ({
        name: i.name,
        sku: i.productId?.toString?.() || i.productId,
        units: i.quantity,
        selling_price: i.price,
      })),
      payment_method: "Prepaid", // ✅ Razorpay always prepaid
      sub_total: totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    // ✅ Send to Shiprocket
    createShiprocketOrder(payload).catch((err) =>
      console.error("❌ Shiprocket sync failed:", err.response?.data || err.message)
    );

    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
