import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/razorpay/create-order", verifyToken, createRazorpayOrder);
router.post("/razorpay/verify", verifyToken, verifyRazorpayPayment);

export default router;
