// controllers/shippingController.js
import axios from "axios";
import fs from "fs";
import path from "path";

const tokenFilePath = path.resolve("shiprocket_token.json");

const getStoredToken = () => {
  if (fs.existsSync(tokenFilePath)) {
    const data = JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
    return data.token;
  }
  return null;
};

export const checkPincodeAvailability = async (req, res) => {
  try {
    const { pincode } = req.body;
    if (!pincode) return res.status(400).json({ error: "Pincode required" });

    const token = getStoredToken();
    if (!token) return res.status(401).json({ error: "Shiprocket token missing" });

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
      {
        pickup_postcode: "500001", // your origin pincode
        delivery_postcode: pincode,
        weight: 0.5,
        cod: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response.data;
    const available = data.data.available_courier_companies.length > 0;
    if (!available) return res.json({ available: false, message: "Delivery not available" });

    const courier = data.data.available_courier_companies[0];
    res.json({
      available: true,
      courier_name: courier.courier_name,
      est_delivery_days: courier.estimated_delivery_days,
      charges: courier.rate,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to check delivery" });
  }
};
