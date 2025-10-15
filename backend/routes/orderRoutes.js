import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", verifyToken, placeOrder);

export default router;
