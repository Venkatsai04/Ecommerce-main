import axios from "axios";

const SHIPROCKET_EMAIL = "your-shiprocket-api-email@example.com";
const SHIPROCKET_PASSWORD = "your-shiprocket-password";

let TOKEN_CACHE = null;
let TOKEN_EXPIRE = 0;

// 🔹 Get or refresh Shiprocket auth token
export async function getShiprocketToken() {
  const now = Date.now();
  if (TOKEN_CACHE && now < TOKEN_EXPIRE) return TOKEN_CACHE;

  const res = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
    email: "venkatsai0434@gmail.com",
    password: "107Cg4xwvB!qPN^H",
  });

  TOKEN_CACHE = res.data.token;
  TOKEN_EXPIRE = now + 1000 * 60 * 60 * 240; // 240 hours
  console.log("✅ Shiprocket token refreshed");
  return TOKEN_CACHE;
}

// 🔹 Create, assign, and schedule pickup
export async function createShiprocketOrder(order) {
  try {
    const token = await getShiprocketToken();
    const headers = { Authorization: `Bearer ${token}` };

    // ✅ Handle both Mongo order & clean payload
    const isMongoDoc = typeof order._id !== "undefined";
    const address = order.address || {};
    const items = order.items || order.order_items || [];

    const payload = {
      order_id:
        order.order_id ||
        (isMongoDoc ? `ORDER-${order._id.toString()}` : `ORDER-${Date.now()}`),
      order_date: new Date(order.createdAt || Date.now()).toISOString(),
      pickup_location: order.pickup_location || "Home",

      billing_customer_name: address.firstName || order.billing_customer_name || "Unknown",
      billing_last_name: address.lastName || order.billing_last_name || "",
      billing_address: address.street || order.billing_address || "Default Street",
      billing_city: address.city || order.billing_city || "Hyderabad",
      billing_pincode: address.zip || order.billing_pincode || "500001",
      billing_state: address.state || order.billing_state || "Telangana",
      billing_country: address.country || order.billing_country || "India",
      billing_email: address.email || order.billing_email || "test@example.com",
      billing_phone: address.mobile || order.billing_phone || "9999999999",
      shipping_is_billing: true,

      order_items: items.map((i) => ({
        name: i.name || "Product",
        sku: i.productId?.toString?.() || i.sku || "SKU-NA",
        units: i.quantity || i.units || 1,
        selling_price: i.price || i.selling_price || 0,
      })),

      payment_method:
        order.payment_method ||
        (order.paymentMethod?.toLowerCase?.() === "cod" ? "COD" : "Prepaid"),

      sub_total: order.sub_total || order.totalAmount || 0,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    console.log("🚀 Shiprocket Payload:", JSON.stringify(payload, null, 2));

    // 🧾 Step 1 – Create order
    const orderRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      { headers }
    );

    console.log("📦 Shiprocket create-order response:", JSON.stringify(orderRes.data, null, 2));

    // ✅ Extract shipment ID correctly
    const shipmentId = orderRes.data?.data?.shipment_id;

    if (!shipmentId) {
      console.error("❌ Failed to extract shipment_id from response:", orderRes.data);
      return { success: false, message: "Shipment ID missing in Shiprocket response" };
    }

    console.log("✅ Shiprocket order created:", shipmentId);

    // 🧾 Step 2 – Assign courier
    const courierRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
      { shipment_id: shipmentId },
      { headers }
    );
    console.log("🚚 Courier assigned, AWB:", courierRes.data.awb_code);

    // 🧾 Step 3 – Generate pickup
    await axios.post(
      "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
      { shipment_id: shipmentId },
      { headers }
    );
    console.log("📦 Pickup scheduled successfully");

    return { success: true };
  } catch (err) {
    console.error("Shiprocket Error:", err.response?.data || err.message);
    return { success: false, message: err.message };
  }
}
