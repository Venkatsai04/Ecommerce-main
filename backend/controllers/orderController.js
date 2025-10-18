import Order from "../models/orderModel.js";


export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // match verifyToken
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

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // optional: show user details
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // match placeOrder
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
