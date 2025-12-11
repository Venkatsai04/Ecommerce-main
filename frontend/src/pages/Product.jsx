import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {

  const apiRoute = import.meta.env.VITE_PORT


  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  // Delivery checking
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load product
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      console.log(productData);
      
      setImage(product.image[0]);
    }
  }, [productId, products]);

  // Load reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiRoute}/reviews/${productId}`);
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
      const res = await fetch(`${apiRoute}/reviews/${productId}`, {
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

  // Check delivery
  const handleCheckPincode = async () => {
    if (!pincode) return alert("Please enter a pincode");
    setLoading(true);
    setDeliveryInfo(null);

    try {
      const res = await axios.post(`${apiRoute}/shipping/check-pincode`, { pincode });
      setDeliveryInfo(res.data);
    } catch (err) {
      console.error(err);
      setDeliveryInfo({ available: false, message: "Error checking delivery" });
    } finally {
      setLoading(false);
    }
  };

  // Try On
  const handleTryOn = () => {
    if (!productData) return;
    navigate("/try-on", {
      state: {
        product: {
          id: productData._id,
          name: productData.name,
          price: productData.price,
          image: image,
          description: productData.description,
          category: productData.category,
        },
      },
    });
  };

  if (!productData) return <div className="opacity-0"></div>;

  // 69% OFF formula
  const originalPrice = Math.round(productData.price / 0.31);

  return (
    <div className="pt-10 border-t-2">
      <div className="flex flex-col gap-12 sm:flex-row">

        {/* ---------- IMAGES ---------- */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">

          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-[18%]">
            {productData.image.map((item, index) => (
              <div
                key={index}
                onClick={() => setImage(item)}
                className={`cursor-pointer border rounded-md overflow-hidden
                  ${image === item ? "border-black" : "border-gray-300"}
                  flex-shrink-0 w-20 h-20 sm:w-full sm:h-auto sm:aspect-square bg-gray-100`}
              >
                <img src={item} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full sm:w-[80%]">
            {productData.soldOut && (
              <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-xs rounded-sm z-10">
                SOLD OUT
              </div>
            )}
            <div className="w-full aspect-[4/5] bg-gray-100 rounded-md overflow-hidden">
              <img src={image} alt="product" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>

        {/* ---------- PRODUCT INFO ---------- */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>

          {/* SOLD OUT NOTICE */}
          {productData.soldOut && (
            <p className="text-red-600 font-semibold text-sm mt-1">🚫 Currently Sold Out</p>
          )}

          {/* PRICE SECTION */}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-3xl font-medium">{currency}{productData.price}</p>

            <p className="text-lg line-through text-gray-500">{currency}{originalPrice}</p>

            <p className="text-lg font-bold text-green-600">69% OFF</p>
          </div>

          {/* SIZE SELECTION */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => !productData.soldOut && setSize(item)}
                  disabled={productData.soldOut}
                  className={`border py-2 px-4 rounded-md 
                    ${size === item ? "border-orange-500 bg-gray-200" : "bg-gray-100"} 
                    ${productData.soldOut ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* ---------- ACTION BUTTONS ---------- */}
          <div className="flex gap-4 items-center">

            {/* Add to Cart Logic */}
            {productData.soldOut ? (
              <button disabled className="px-8 py-3 text-sm text-white bg-gray-400 cursor-not-allowed">
                SOLD OUT
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!size) return alert("Please select a size");
                  addToCart(productData._id, size);
                  
                }}
                className="px-8 py-3 text-sm text-white bg-black active:bg-gray-700"
              >
                ADD TO CART
              </button>
            )}

            {/* Try On */}
            <button
              onClick={handleTryOn}
              className="px-8 py-3 text-sm text-white bg-gradient-to-r from-yellow-600 to-purple-600 hover:opacity-90 shadow-md transition-all"
            >
              TRY ON ✨
            </button>
          </div>

          {/* ---------- DELIVERY CHECK ---------- */}
          <div className="mt-6 border-t pt-5">
            <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Delivery Check</h3>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="border-2 border-black px-4 py-2 w-40"
              />
              <button
                onClick={handleCheckPincode}
                disabled={loading}
                className="bg-black text-white px-5 py-2 border-2 border-black"
              >
                {loading ? "Checking..." : "Check"}
              </button>
            </div>

            {deliveryInfo && (
              <div className={`mt-4 p-3 border-2 ${deliveryInfo.available ? "border-black" : "border-red-500"}`}>
                {deliveryInfo.available ? (
                  <p className="text-base font-bold">
                    🚚 Delivery in{" "}
                    <span className="underline">
                      {deliveryInfo.delivery_range === "N/A"
                        ? "a few days"
                        : `${deliveryInfo.delivery_range} days`}
                    </span>
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">❌ Delivery not available</p>
                )}
              </div>
            )}

            {/* ---------- DESCRIPTION ---------- */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Product Description</h3>
              <p className="text-gray-700 text-sm md:text-base mb-6">
                {productData.description || "No description available."}
              </p>

              {/* CARE & RETURNS */}
              <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Care & Returns</h3>
              <p className="text-gray-700 mb-4 text-sm">
                <span className="font-semibold">Care Instructions:</span><br />
                • Machine wash cold (30°C) <br />
                • Wash with similar colors <br />
                • Do not bleach <br />
                • Low heat iron <br />
                • Air dry recommended
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Returns:</span><br />
                This item is <span className="font-bold">not eligible for returns</span>.
              </p>

              {/* ---------- REVIEWS ---------- */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-extrabold mb-4 uppercase tracking-tight">Customer Reviews</h3>

                {reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div key={i} className="border-b pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, j) => (
                          <img
                            key={j}
                            src={j < rev.rating ? assets.star_icon : assets.star_dull_icon}
                            className="w-4"
                            alt="star"
                          />
                        ))}
                        <p className="font-medium text-sm">{rev.userName || "User"}</p>
                      </div>
                      <p className="mt-1 text-gray-600 text-sm">{rev.review || rev.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                )}

                {/* Add Review */}
                {user && (
                  <div className="mt-4">
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm"
                      placeholder="Write your review..."
                    />

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm">Rating:</span>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border rounded p-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleAddReview}
                      className="mt-3 px-5 py-2 bg-black text-white text-sm rounded-md"
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
