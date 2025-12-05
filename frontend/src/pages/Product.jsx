import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate(); // Initialize Navigation Hook
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

  // --- NEW: Handle Try On Navigation ---
  const handleTryOn = () => {
    if (!productData) return;

    // Navigate to TryOn page with the current product data
    navigate('/try-on', {
      state: {
        product: {
          id: productData._id,
          name: productData.name,
          price: productData.price,
          image: image, // Uses the currently selected image from state
          description: productData.description,
          category: productData.category
        }
      }
    });
  };

  if (!productData) return <div className="opacity-0"></div>;

  return (
    <div className="pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100">
      <div className="flex flex-col gap-12 sm:flex-row">
        {/* Product Images */}
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
                <img
                  src={item}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>


          <div className="w-full sm:w-[80%]">
            <div className="w-full aspect-[4/5] bg-gray-100 rounded-md overflow-hidden">
              <img
                src={image}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          {/* PRICE WITH 69% OFF */}
          <div className="mt-5">
            <div className="flex items-center gap-3">

              {/* Real Price */}
              <p className="text-3xl font-medium">
                {currency}{productData.price}
              </p>

              {/* Original MRP (calculated for exact 69% OFF) */}
              {(() => {
                const originalPrice = Math.round(productData.price / 0.31);
                return (
                  <>
                    <p className="text-lg line-through text-gray-500">
                      {currency}{originalPrice}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      69% OFF
                    </p>
                  </>
                );
              })()}
            </div>
          </div>


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

          {/* --- ACTION BUTTONS --- */}
          <div className="flex gap-4 items-center">
            {/* Add to Cart */}
            <button
              onClick={() => {
                if (!size) return alert("Please select a size");
                addToCart(productData._id, size);
              }}
              className="px-8 py-3 text-sm text-white bg-black active:bg-gray-700"
            >
              ADD TO CART
            </button>

            {/* NEW: Virtual Try On Button */}
            <button
              onClick={handleTryOn}
              className="px-8 py-3 text-sm text-white bg-gradient-to-r from-yellow-600 to-purple-600 hover:opacity-90 shadow-md transition-all flex items-center gap-2"
            >

              TRY ON ✨
            </button>
          </div>


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
                className="border-2 border-black text-black px-4 py-2 w-40 font-semibold tracking-wide placeholder:text-gray-500 focus:outline-none focus:border-gray-800 transition-all"
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
                    {/* (from ₹{deliveryInfo.min_charges}) */}
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    ❌ Delivery not available for this area
                  </p>
                )}
              </div>
            )}

            {/* --- PRODUCT DESCRIPTION --- */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">
                Product Description
              </h3>

              <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-6">
                {productData.description || "No description available for this product."}
              </p>

              {/* CARE & RETURNS */}
              <div className="mt-10">

                {/* HEADER (same UI as Product Description) */}
                <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">
                  Care & Returns
                </h3>

                {/* CARE */}
                <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                  <span className="font-semibold">Care Instructions:</span><br />
                  • Machine wash cold (30°C) <br />
                  • Wash with similar colors <br />
                  • Do not bleach <br />
                  • Low heat iron only <br />
                  • Air dry recommended
                </p>

                {/* RETURNS */}
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  <span className="font-semibold">Returns:</span><br />
                  This item is <span className="font-bold">not eligible for returns</span>.
                  Please review the size chart and details before ordering.
                </p>

              </div>


              {/* --- REVIEWS SECTION --- */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-extrabold mb-4 uppercase tracking-tight">
                  Customer Reviews
                </h3>

                <div className="flex-1 flex flex-col gap-4">

                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    reviews.map((rev, i) => (
                      <div key={i} className="border-b pb-3">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, j) => (
                            <img
                              key={j}
                              src={j < rev.rating ? assets.star_icon : assets.star_dull_icon}
                              alt="Rating"
                              className="w-4"
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
                        placeholder="Write your review here..."
                      />

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">Rating:</span>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="border rounded-md p-1 text-sm"
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleAddReview}
                        className="mt-3 px-5 py-2 text-sm text-white bg-black rounded-md active:bg-gray-800"
                      >
                        Submit Review
                      </button>
                    </div>
                  )}

                  {!user && (
                    <p className="text-gray-600 text-sm mt-2">
                      Login to write a review.
                    </p>
                  )}
                </div>
              </div>
            </div>

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