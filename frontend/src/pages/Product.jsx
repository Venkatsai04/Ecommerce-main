import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  // New states for shipping
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/reviews/${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleAddReview = async () => {
    if (!user) return alert("Please login to add a review.");
    if (!newReview) return alert("Please write a review.");

    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          description: newReview,
          rating,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [...prev, data.review]);
        setNewReview("");
        setRating(5);
      } else {
        alert(data.message || "Failed to add review.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckPincode = async () => {
    if (!pincode) return alert("Please enter a pincode");
    setLoading(true);
    setDeliveryInfo(null);
    try {
      const res = await axios.post("http://localhost:4000/api/shipping/check-pincode", { pincode });
      setDeliveryInfo(res.data);
    } catch (err) {
      console.error(err);
      setDeliveryInfo({ available: false, message: "Error checking delivery" });
    } finally {
      setLoading(false);
    }
  };

  if (!productData) return <div className="opacity-0"></div>;

  return (
    <div className="pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100">
      <div className="flex flex-col gap-12 sm:flex-row">
        {/* Product Images */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">
          <div className="flex justify-between overflow-x-auto sm:flex-col sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${image === item ? "border-2 border-gray-600 py-2 px-2" : ""
                  }`}
                alt="Product"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="Product" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 rounded-md ${item === size ? "border-orange-500" : ""
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (!size) return alert("Please select a size");
              addToCart(productData._id, size);
            }}
            className="px-8 py-3 text-sm text-white bg-black active:bg-gray-700"
          >
            ADD TO CART
          </button>


          {/* --- Delivery Check Section --- */}
          <div className="mt-6 border-t pt-5">
            <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">
              Delivery Check
            </h3>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="border-2 border-black bg-yellow-50 text-black px-4 py-2 w-40 font-semibold tracking-wide placeholder:text-gray-500 focus:outline-none focus:border-gray-800 transition-all"
              />
              <button
                onClick={handleCheckPincode}
                disabled={loading}
                className="bg-black text-white px-5 py-2 border-2 border-black active:translate-y-[2px] active:border-gray-700 transition-all"
              >
                {loading ? "Checking..." : "Check"}
              </button>
            </div>

            {deliveryInfo && (
              <div
                className={`mt-4 border-2 ${deliveryInfo.available ? "border-black" : "border-red-500"
                  } bg-white p-3`}
              >
                {deliveryInfo.available ? (
                  <p className="text-base font-bold text-black">
                    🚚 Delivery in{" "}
                    <span className="underline">
                      {deliveryInfo.delivery_range === "N/A"
                        ? "a few days"
                        : `${deliveryInfo.delivery_range} days`}
                    </span>{" "}
                    (from ₹{deliveryInfo.min_charges})
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    ❌ Delivery not available for this area
                  </p>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
