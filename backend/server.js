import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import Product from "./models/productModel.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoute.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import tryOnRoute from "./routes/tryOnRoute.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/tryon", tryOnRoute);

app.get("/", (req, res) => {
  res.send("Sahara API running");
});

app.get("/api/products/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
