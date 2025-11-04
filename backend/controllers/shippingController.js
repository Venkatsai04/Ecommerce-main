import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const tokenFilePath = path.resolve("shiprocket_token.json");

// 🧩 Read existing token
const readTokenFromFile = () => {
  if (fs.existsSync(tokenFilePath)) {
    const data = JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
    return data;
  }
  return null;
};

// 🧩 Write new token
const writeTokenToFile = (tokenData) => {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
};

// 🧠 Generate new token if expired
const getShiprocketToken = async () => {
  const existing = readTokenFromFile();
  if (existing) {
    const now = new Date();
    const createdAt = new Date(existing.createdAt);
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (diffDays < 10 && existing.token) {
      console.log("✅ Using existing Shiprocket token");
      return existing.token;
    }
  }

  console.log("🔑 Generating new Shiprocket token...");
  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const token = res.data.token;
  if (!token) throw new Error("Failed to fetch Shiprocket token");

  writeTokenToFile({ token, createdAt: new Date() });
  return token;
};

// 🚚 Main controller — check delivery availability
export const checkPincodeAvailability = async (req, res) => {
  try {
    const { pincode } = req.body;
    if (!pincode || pincode.length !== 6)
      return res.status(400).json({ error: "Valid 6-digit pincode required" });

    const token = await getShiprocketToken();

    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      {
        params: {
          pickup_postcode: "501505", // your origin pincode
          delivery_postcode: pincode,
          weight: 0.5,
          cod: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (
      !data.data ||
      !data.data.available_courier_companies ||
      data.data.available_courier_companies.length === 0
    ) {
      return res.json({ available: false, message: "Delivery not available" });
    }

    const courier = data.data.available_courier_companies[0];

    res.json({
      available: true,
      courier_name: courier.courier_name,
      est_delivery_days: courier.estimated_delivery_days,
      charges: courier.rate,
    });
  } catch (err) {
    console.error("❌ Shiprocket Error:", {
      message: err.response?.data?.message || err.message,
      status_code: err.response?.status,
    });
    res.status(500).json({
      error: "Failed to check delivery",
      details: err.response?.data || err.message,
    });
  }
};

