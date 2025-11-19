import express from "express";
import { checkPincodeAvailability , trackAwb} from '../controllers/shippingController.js';

const router = express.Router();

// POST route to check pincode availability
router.post("/check-pincode", checkPincodeAvailability);
router.post("/order/track/:awb", trackAwb);

export default router;
