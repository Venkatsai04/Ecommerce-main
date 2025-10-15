import express from "express";
import Cart from "../models/cartModel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Add or update item
router.post("/cart/add", verifyToken, async (req, res) => {
  const { productId, quantity = 1, size } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, size }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size });
      }
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user cart
router.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price image"
    );
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove item
router.post("/cart/remove", verifyToken, async (req, res) => {
  const { productId, size } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Clear cart (after order)
router.post("/cart/clear", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
