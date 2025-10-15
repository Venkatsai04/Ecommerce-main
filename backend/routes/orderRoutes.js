import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { placeOrder, getUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", verifyToken, placeOrder);
router.get("/user", verifyToken, getUserOrders);

export default router;
