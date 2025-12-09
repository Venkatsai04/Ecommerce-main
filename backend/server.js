                                                                                                                    
import tryOnRoute from "./routes/tryOnRoute.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://api.flipakrt.in",
      "https://ecommerce-main-a517.vercel.app"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// Allow OPTIONS preflight requests
app.options("*", cors());




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


