import express from "express";
import { verifyToken } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import { placeOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";

const router = express.Router();

// 🔹 User routes
router.post("/place", verifyToken, placeOrder);
router.get("/user", verifyToken, getUserOrders);

// 🔹 Admin route
router.get("/admin/all", adminAuth, getAllOrders);

export default router;
