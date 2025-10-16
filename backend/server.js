import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import Product from "./models/productModel.js"; // adjust path if needed
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from './routes/paymentRoute.js';


// INFO: Create express app
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// INFO: Middleware
app.use(express.json());
app.use(cors());

// INFO: API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", cartRoutes);
app.use('/api/payment/razorpay', paymentRoutes);


// INFO: Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});


//Test node
app.get("/api/products/all", async (req, res) => {
  try {
    const products = await Product.find(); // fetch all products from DB
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// INFO: Start server
app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
