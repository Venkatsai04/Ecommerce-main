import express from "express";
import { checkPincodeAvailability } from '../controllers/shippingController.js';

const router = express.Router();

// POST route to check pincode availability
router.post("/check-pincode", checkPincodeAvailability);

export default router;
