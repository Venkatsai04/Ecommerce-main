import express from "express";
import { createCoupon, applyCoupon, getAllCoupons } from "../controllers/couponController.js";
import { verifyToken } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";


const router = express.Router();

router.post("/admin/create", adminAuth, createCoupon);
router.post("/apply", verifyToken, applyCoupon);
router.get("/admin/all", adminAuth, getAllCoupons); //get all coupons

export default router;
