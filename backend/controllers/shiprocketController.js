import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";

dotenv.config();

// ----------------------------------------------------
// TOKEN MANAGEMENT
// ----------------------------------------------------
const tokenFilePath = path.resolve("shiprocket_token.json");

const readTokenFromFile = () => {
  if (fs.existsSync(tokenFilePath)) {
    return JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
  }
  return null;
};

const writeTokenToFile = (tokenData) => {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
};

export const getShiprocketToken = async () => {
  const existing = readTokenFromFile();
  if (existing) {
    const now = new Date();
    const createdAt = new Date(existing.createdAt);
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (diffDays < 10) {
      console.log("🔐 Using existing Shiprocket token");
      return existing.token;
    }
  }

  console.log("🔐 Generating new Shiprocket token");
  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  const token = res.data.token;
  writeTokenToFile({ token, createdAt: new Date() });
  return token;
};

// ----------------------------------------------------
// PINCODE CHECK
// ----------------------------------------------------
export const checkPincodeAvailability = async (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode || pincode.length !== 6)
      return res.status(400).json({ error: "Invalid pincode" });

    const token = await getShiprocketToken();

    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      {
        params: {
          pickup_postcode: "501505",
          delivery_postcode: pincode,
          weight: 0.5,
          cod: 0,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const couriers = response.data?.data?.available_courier_companies || [];
    if (couriers.length === 0)
      return res.json({ available: false });

    const valid = couriers.filter(c => c.estimated_delivery_days > 0);

    const minDays = Math.min(...valid.map(c => c.estimated_delivery_days));
    const maxDays = Math.max(...valid.map(c => c.estimated_delivery_days));

    const cheapest = couriers.reduce((a, b) => a.rate < b.rate ? a : b);

    res.json({
      available: true,
      delivery_range: `${minDays}-${maxDays}`,
      min_charges: cheapest.rate.toFixed(2),
    });

  } catch (err) {
    res.status(500).json({ error: "Service unavailable" });
  }
};

// ----------------------------------------------------
// TRACK SHIPMENT
// ----------------------------------------------------
export const trackShipment = async (req, res) => {
  try {
    const { shipment_id } = req.params;
    const token = await getShiprocketToken();

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipment_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ success: true, tracking: response.data.tracking_data });

  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to track" });
  }
};

// ----------------------------------------------------
// CREATE SHIPROCKET ORDER (Main Missing Feature)
// ----------------------------------------------------
export const createShiprocketOrder = async (order, items) => {
  try {
    const token = await getShiprocketToken();

    const payload = {
      order_id: `ORDER-${order._id}`,
      order_date: new Date(order.createdAt)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      pickup_location: "Home",

      billing_customer_name: order.address.firstName,
      billing_last_name: order.address.lastName,
      billing_address: order.address.street,
      billing_city: order.address.city,
      billing_pincode: order.address.zipCode || order.address.zip,
      billing_state: order.address.state,
      billing_country: order.address.country || "India",
      billing_email: order.address.email,
      billing_phone: order.address.mobile,

      shipping_is_billing: true,

      order_items: items.map(i => ({
        name: i.name,
        sku: i.productId,
        units: i.quantity,
        selling_price: i.price,
      })),

      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: order.totalAmount,

      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response.data;

    const shipment_id = data.shipment_id || data.data?.shipment_id;
    const awb_code = data.awb_code || data.data?.awb_code;

    await Order.findByIdAndUpdate(order._id, {
      shipment_id,
      awb_code,
      shipping_response: data,
      status: "Ready for Shipping",
    });

    return data;

  } catch (err) {
    console.error("Shiprocket Order Error:", err.response?.data || err.message);
    return null;
  }
};
