import express from "express";
import { generateTryOn } from "../controllers/tryOnController.js";

const router = express.Router();

// Single endpoint (validates gender internally and generates image)
router.post("/", generateTryOn);

export default router;
