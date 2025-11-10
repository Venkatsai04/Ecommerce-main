import Order from "../models/orderModel.js";
import { createShiprocketOrder } from "../utils/shiprocket.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address, paymentMethod, totalAmount } = req.body;

    if (!items || !address || !paymentMethod || !totalAmount)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const order = await Order.create({
      userId,
      items,
      address,
      paymentMethod,
      totalAmount,
    });

    // ✅ Build a clean payload for Shiprocket instead of sending raw Mongo doc
    const payload = {
      order_id: `ORDER-${order._id.toString()}`,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: "Home",
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
      payment_method:
        paymentMethod.toLowerCase() === "cod" ? "COD" : "Prepaid",
      sub_total: totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    // ✅ Shiprocket auto-sync (non-blocking)
    createShiprocketOrder(payload).catch((err) =>
      console.error("Shiprocket automation failed:", err.response?.data || err.message)
    );

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
