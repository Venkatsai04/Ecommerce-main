// backend/utils/shiprocket.js
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
    return TOKEN_CACHE;
}

// 🔹 Create, assign, and schedule pickup
export async function createShiprocketOrder(order) {
    try {
        const token = await getShiprocketToken();
        const headers = { Authorization: `Bearer ${token}` };

        console.log(order);
        

        const address = order.address || {};

        const payload = {
            order_id: order._id.toString(),
            order_date: new Date(order.createdAt || Date.now()).toISOString(),
            pickup_location: "Primary",

            // ✅ Billing info (all required)
            billing_customer_name: address.firstName || "Unknown",
            billing_last_name: address.lastName || "",
            billing_address: address.street || "Default Street",
            billing_city: address.city || "Hyderabad",
            billing_pincode: address.zip || "500001", // ✅ fixed: your frontend uses `zip`
            billing_state: address.state || "Telangana",
            billing_country: address.country || "India",
            billing_email: address.email || "test@example.com",
            billing_phone: address.mobile || "9999999999",

            shipping_is_billing: true,

            order_items: order.items.map((i) => ({
                name: i.name || "Product",
                sku: i.productId,
                units: i.quantity,
                selling_price: i.price,
            })),

            payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
            sub_total: order.totalAmount || 0,

            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5,
        };


        // Step 1 – Create order

        console.log("🚀 Shiprocket Payload:", JSON.stringify(payload, null, 2));

        const orderRes = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
            payload,
            { headers }
        );
        console.log("✅ Shiprocket order created:", orderRes.data.shipment_id);

        // Step 2 – Assign courier & AWB
        const courierRes = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
            { shipment_id: orderRes.data.shipment_id },
            { headers }
        );
        console.log("🚚 Courier assigned, AWB:", courierRes.data.awb_code);

        // Step 3 – Generate pickup
        await axios.post(
            "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
            { shipment_id: orderRes.data.shipment_id },
            { headers }
        );
        console.log("📦 Pickup scheduled successfully");

        return { success: true };
    } catch (err) {
        console.error("Shiprocket Error:", err.response?.data || err.message);
        return { success: false, message: err.message };
    }
}
