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

    // Shiprocket auto-sync (non-blocking)
    createShiprocketOrder(order).catch((err) =>
      console.error("Shiprocket automation failed:", err.message)
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
