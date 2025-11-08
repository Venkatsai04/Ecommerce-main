import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const backendUrl = "http://localhost:4000/api";

const PlaceOrder = () => {
  const {
    cartItems,
    products,
    currency,
    updateCartItem,
    removeCartItem,
    getCartAmount,
    navigate,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [baseShipping, setBaseShipping] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mobile: "",
  });

  const token = localStorage.getItem("token");

  // 🧾 Fetch shipping from your route
  useEffect(() => {
    const checkShipping = async () => {
      if (!form.zip || form.zip.length < 5) return;
      setLoading(true);
      try {
        const res = await axios.post(`${backendUrl}/shipping/check-pincode`, {
          pincode: form.zip,
        });
        const data = res.data;
        if (data.available) {
          setBaseShipping(Number(data.shipping_fee) || 0);
          setDeliveryInfo(data);
        } else {
          setBaseShipping(0);
          setDeliveryInfo(data);
          toast.error(data.message || "Delivery not available for this pincode");
        }
      } catch (err) {
        console.error(err);
        setBaseShipping(0);
        setDeliveryInfo({ available: false });
        toast.error("Error checking shipping fee");
      } finally {
        setLoading(false);
      }
    };
    checkShipping();
  }, [form.zip]);

  // 🧠 Calculate dynamic shipping
  const cartAmount = getCartAmount();
  let deliveryFee = baseShipping;

  if (method === "cod") {
    // COD adds ₹30-₹40 extra based on cart value
    if (cartAmount < 500) deliveryFee += 40;
    else if (cartAmount < 1000) deliveryFee += 35;
    else deliveryFee += 30;
  } else {
    // Prepaid = Free Shipping
    deliveryFee = 0;
  }

  const totalAmount = cartAmount + deliveryFee;
  const format = (num) =>
    num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const validateForm = () => {
    for (const key in form) {
      if (!form[key]) {
        toast.error(`Please fill ${key}`);
        return false;
      }
    }
    return true;
  };

  // 🧾 Place order
  const handlePlaceOrder = async () => {
    if (!token) return toast.error("Login to place an order");
    if (!validateForm()) return;
    if (deliveryInfo && !deliveryInfo.available)
      return toast.error("Delivery not available for this address");

    const items = [];
    Object.entries(cartItems).forEach(([pid, sizes]) => {
      const product = products.find((p) => p._id === pid);
      if (!product) return;
      Object.entries(sizes).forEach(([size, qty]) => {
        items.push({
          productId: pid,
          name: product.name,
          size,
          quantity: qty,
          price: product.price,
          image: Array.isArray(product.image)
            ? product.image[0]
            : product.image,
        });
      });
    });

    if (items.length === 0) return toast.error("Cart is empty");

    try {
      if (method === "cod") {
        await axios.post(
          `${backendUrl}/order/place`,
          { items, address: form, paymentMethod: "cod", totalAmount, deliveryFee },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Order placed successfully!");
        items.forEach(({ productId, size }) => removeCartItem(productId, size));
        navigate("/orders");
      } else {
        const { data } = await axios.post(
          `${backendUrl}/payment/razorpay/create-order`,
          { amount: totalAmount * 100 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: "rzp_test_RU9gYhxqiyBnDV",
          amount: data.order.amount,
          currency: "INR",
          name: "Sahara Traders",
          description: "Payment for your order",
          order_id: data.order.id,
          image: assets.logoMini,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                `${backendUrl}/payment/razorpay/verify`,
                { ...response, items, address: form, totalAmount, deliveryFee },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (verifyRes.data.success) {
                toast.success("Payment successful and order placed!");
                items.forEach(({ productId, size }) => removeCartItem(productId, size));
                navigate("/payment-success", { state: { totalAmount } });
              } else toast.error("Payment verification failed");
            } catch (err) {
              console.error(err);
              toast.error("Something went wrong during payment verification");
            }
          },
          prefill: {
            name: form.firstName + " " + form.lastName,
            email: form.email,
            contact: form.mobile,
          },
          theme: { color: "#3399cc" },
        };
        new window.Razorpay(options).open();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t">
      {/* LEFT SIDE - ADDRESS */}
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input className="w-full px-4 py-2 border border-gray-300 rounded" type="text" name="firstName" value={form.firstName} onChange={handleInputChange} placeholder="First Name" />
          <input className="w-full px-4 py-2 border border-gray-300 rounded" type="text" name="lastName" value={form.lastName} onChange={handleInputChange} placeholder="Last Name" />
        </div>
        <input className="w-full px-4 py-2 border border-gray-300 rounded" type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email Address" />
        <input className="w-full px-4 py-2 border border-gray-300 rounded" type="text" name="street" value={form.street} onChange={handleInputChange} placeholder="Street" />
        <div className="flex gap-3">
          <input className="w-full px-4 py-2 border border-gray-300 rounded" type="text" name="city" value={form.city} onChange={handleInputChange} placeholder="City" />
          <input className="w-full px-4 py-2 border border-gray-300 rounded" type="text" name="state" value={form.state} onChange={handleInputChange} placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input className="w-full px-4 py-2 border border-gray-300 rounded" type="number" name="zip" value={form.zip} onChange={handleInputChange} placeholder="Zip Code" />
          <input className="w-full px-4 py-2 border border-gray-300 rounded" type="text" name="country" value={form.country} onChange={handleInputChange} placeholder="Country" />
        </div>
        <input className="w-full px-4 py-2 border border-gray-300 rounded" type="number" name="mobile" value={form.mobile} onChange={handleInputChange} placeholder="Mobile" />

        {loading && <p className="text-sm text-blue-500">Checking delivery...</p>}
        {deliveryInfo && (
          <p className={`text-sm ${deliveryInfo.available ? "text-green-600" : "text-red-500"}`}>
            {deliveryInfo.message || (deliveryInfo.available ? "Delivery available" : "Not deliverable")}
          </p>
        )}
      </div>

      {/* RIGHT SIDE - PAYMENT & CART SUMMARY */}
      <div className="mt-8 w-full sm:max-w-[480px]">

        {/* PAYMENT METHODS */}
        <div className="mt-8">
          <Title text1={"PAYMENT"} text2={"METHODS"} />
          <div className="flex flex-col gap-3 mt-3">
            {[
              { key: "razorpay", label: "RazorPay", img: assets.razorpay_logo, offer: "Free Shipping 🎉" },
              { key: "stripe", label: "Stripe", img: assets.stripe_logo, offer: "Free Shipping 🎉" },
              { key: "cod", label: "Cash on Delivery", img: null, offer: "₹30–₹40 Shipping Fee applies" },
            ].map(({ key, label, img, offer }) => (
              <div
                key={key}
                onClick={() => setMethod(key)}
                className={`flex justify-between items-center border p-3 rounded cursor-pointer ${method === key ? "border-green-500 bg-green-50" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 border rounded-full ${method === key ? "bg-green-600" : ""}`}></div>
                  {img ? <img src={img} alt={label} className="h-5" /> : <p className="font-medium">{label}</p>}
                </div>
                <p className={`text-xs ${key === "cod" ? "text-gray-500" : "text-green-600 font-medium"}`}>
                  {offer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CART TOTALS */}
        <div className="mt-10">
          <CartTotal
            cart={cartItems}
            products={products}
            currency={currency}
            updateCartItem={updateCartItem}
            removeItem={removeCartItem}
            delivery_fee={deliveryFee}
          />

          <p className="mt-2 text-sm text-gray-700">
            <strong>Final Payable:</strong> {currency}
            {format(totalAmount)}
          </p>

          <div className="w-full mt-6 text-end">
            <button
              onClick={handlePlaceOrder}
              disabled={deliveryInfo && !deliveryInfo.available}
              className={`px-16 py-3 text-sm text-white ${
                deliveryInfo && !deliveryInfo.available
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black active:bg-gray-800"
              }`}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
