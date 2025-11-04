// routes/shippingRoutes.js
import express from "express";
import { checkPincodeAvailability } from "../controllers/shippingController.js";

const router = express.Router();

router.post("/check-pincode", checkPincodeAvailability);

export default router;
