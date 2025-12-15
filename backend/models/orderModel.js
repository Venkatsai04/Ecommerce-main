import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        image: { type: String },
      },
    ],
    address: {
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      mobile: String,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "cod"],
      default: "cod",
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
      "Ordered",
      "Packed",
      "Delivery Partner Assigned",
      "In Transit",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      ],
      default: "Ordered",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
