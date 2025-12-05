import express from "express";
import { generateTryOn } from "../controllers/tryOnController.js";

const router = express.Router();

router.post("/generate", generateTryOn);

export default router;
