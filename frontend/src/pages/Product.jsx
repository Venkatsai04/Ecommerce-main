import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

// --- NEO-BRUTALIST STYLES (Tailwind Utility Classes) ---

// Base for all neo-brutalist blocks
const NB_BLOCK = "border-2 border-black p-4 shadow-[4px_4px_0_0_#000]";
// Button style
const NB_BUTTON = "bg-black text-white border-2 border-black font-bold p-3 active:shadow-[2px_2px_0_0_#000] transition-shadow";
// Input style
const NB_INPUT = "border-2 border-black p-2";
// Accent color for selected states/indicators (Orange accent kept for size)
const NB_ACCENT = "border-orange-500 bg-orange-100 font-bold";
// Tab style
const NB_TAB = "text-sm font-bold border-2 border-black p-3 cursor-pointer transition-colors";
const NB_TAB_ACTIVE = "bg-black text-white shadow-[2px_2px_0_0_#000]";

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

  // Shipping
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("description");

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
    <div className="pt-10 transition-opacity duration-500 ease-in opacity-100 font-mono container mx-auto px-4">
      {/* Product Layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        
        {/* PRODUCT IMAGES */}
        <div className="flex flex-col-reverse flex-1 gap-4 lg:flex-row">
          {/* Thumbnail Gallery */}
          <div className="flex justify-start overflow-x-auto lg:flex-col lg:overflow-y-scroll lg:w-[150px] w-full gap-2 lg:h-[400px]">
            {productData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)}
                className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-full flex-shrink-0 cursor-pointer object-cover ${NB_BLOCK} ${
                  image === item ? NB_ACCENT : "bg-white"
                }`}
                alt="Product thumbnail"
              />
            ))}
          </div>
          
          {/* Main Image */}
          <div className="flex-1 min-w-0">
            <img 
              src={image} 
              className={`w-full h-auto object-cover ${NB_BLOCK}`} 
              alt="Main product" 
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1 flex flex-col gap-4">
          <div className={`${NB_BLOCK} bg-white`}>
             <h1 className="text-4xl font-black mb-2">{productData.name.toUpperCase()}</h1>
             <p className="text-xl text-gray-700">Category: {productData.category}</p>

             <p className="mt-4 text-5xl font-black text-black">
               {currency}{productData.price}
             </p>
          </div>
          

          <div className={`${NB_BLOCK} bg-white`}>
            {/* Size */}
            <div className="flex flex-col gap-3">
              <p className="text-lg font-bold">SELECT SIZE:</p>
              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`border-2 border-black py-2 px-4 bg-white font-semibold transition-all hover:bg-gray-100 ${
                      item === size ? NB_ACCENT : ""
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
              className={`${NB_BUTTON} w-full mt-6`}
            >
              ADD TO CART
            </button>
          </div>
          
          {/* DELIVERY CHECK */}
          <div className={`${NB_BLOCK} bg-white`}>
            <h3 className="font-black mb-3 text-lg">CHECK DELIVERY AVAILABILITY 📦</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode (e.g., 110001)"
                className={`flex-grow ${NB_INPUT} w-full max-w-xs`}
              />
              <button
                onClick={handleCheckPincode}
                disabled={loading}
                className={`${NB_BUTTON} px-4 py-2 text-sm`}
              >
                {loading ? "CHECKING..." : "CHECK"}
              </button>
            </div>

            {deliveryInfo && (
              <div className="mt-3 text-sm font-semibold">
                {deliveryInfo.available ? (
                  <p className="text-green-700">
                    ✅ Delivery available! Est. <span className="underline">
                      {deliveryInfo.delivery_range === "N/A"
                        ? "2-5"
                        : `${deliveryInfo.delivery_range}`}
                    </span> days.
                  </p>
                ) : (
                  <p className="text-red-700">
                    ❌ Delivery currently not available in this area.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESCRIPTION + REVIEW TABS */}
      <div className="mt-16">
        <div className="flex">
          {/* Description Tab Button */}
          <button
            className={`${NB_TAB} ${
              activeTab === "description" ? NB_TAB_ACTIVE : "bg-white"
            } -mr-[2px]`}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>
          {/* Reviews Tab Button */}
          <button
            className={`${NB_TAB} ${
              activeTab === "reviews" ? NB_TAB_ACTIVE : "bg-white"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            REVIEWS ({reviews.length})
          </button>
        </div>

        <div className={`text-sm text-black ${NB_BLOCK} bg-white min-h-[150px]`}>

          {/* DESCRIPTION TAB CONTENT */}
          {activeTab === "description" && (
            <div className="leading-relaxed">
              <h2 className="text-lg font-bold mb-2">PRODUCT DETAILS:</h2>
              <p>{productData.description || "No description available for this minimal masterpiece. Just buy it."}</p>
            </div>
          )}

          {/* REVIEWS TAB CONTENT */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6">
              {/* Review List */}
              {reviews.length > 0 ? (
                reviews.map((rev, i) => (
                  <div key={i} className="border-b border-black pb-4">
                    <div className="flex items-center gap-4 mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, j) => (
                          <img
                            key={j}
                            src={j < rev.rating ? assets.star_icon : assets.star_dull_icon}
                            alt="Rating"
                            className="w-4"
                          />
                        ))}
                      </div>
                      <p className="font-black text-sm">{rev.userName || "ANONYMOUS USER"}</p>
                    </div>
                    <p className="text-gray-700 italic">"{rev.review}"</p>
                  </div>
                ))
              ) : (
                <p className="font-bold">Be the first to leave a review!</p>
              )}

              {/* Add Review */}
              {user ? (
                <div className="mt-4 p-4 border-2 border-black bg-gray-100">
                  <h3 className="font-black mb-3">SUBMIT YOUR REVIEW:</h3>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className={`w-full ${NB_INPUT} min-h-[100px] mb-3`}
                    placeholder="Tell us what you think..."
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-bold">RATING:</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className={`${NB_INPUT} bg-white`}
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} STARS
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddReview}
                    className={`${NB_BUTTON} mt-4 px-4 py-2`}
                  >
                    SUBMIT
                  </button>
                </div>
              ) : (
                 <p className="font-bold text-lg text-red-600">Please log in to leave a review.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16 mb-20">
         <h2 className="text-3xl font-black mb-6">RELATED PRODUCTS ⚡</h2>
         <RelatedProducts
           category={productData.category}
           subCategory={productData.subCategory}
         />
      </div>

    </div>
  );
};

export default Product;