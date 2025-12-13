import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const apiRoute = import.meta.env.VITE_PORT;

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

  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Slider & Zoom States
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)" });

  // Load product
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      setActiveIndex(0);
    }
  }, [productId, products]);

  // Sync 'image' state with 'activeIndex' (Ensures Try-On receives correct image)
  useEffect(() => {
    if (productData && productData.image[activeIndex]) {
      setImage(productData.image[activeIndex]);
    }
  }, [activeIndex, productData]);

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

  /* ================= ZOOM LOGIC ================= */
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // Zoom level (2x)
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  /* ================= SLIDER LOGIC ================= */
  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === productData.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? productData.image.length - 1 : prev - 1
    );
  };

  /* ================= EXISITING HANDLERS ================= */
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
      const res = await axios.post(`${apiRoute}/shipping/check-pincode`, {
        pincode,
      });
      setDeliveryInfo(res.data);
    } catch {
      setDeliveryInfo({ available: false });
    } finally {
      setLoading(false);
    }
  };

  const handleTryOn = () => {
    navigate("/try-on", {
      state: {
        product: {
          id: productData._id,
          name: productData.name,
          price: productData.price,
          image, // This is synced via useEffect now
          description: productData.description,
          category: productData.category,
        },
      },
    });
  };

  if (!productData) return null;

  /* ================= PRICING LOGIC ================= */
  const hasMrp =
    productData.mrp && Number(productData.mrp) > Number(productData.price);
  const mrpValue = hasMrp
    ? Number(productData.mrp)
    : Number(productData.price) * 2;
  const discountPercent =
    mrpValue > productData.price
      ? Math.round(((mrpValue - productData.price) / mrpValue) * 100)
      : 0;
  const savings = mrpValue - productData.price;

  /* ================================================= */

  return (
    <div className="pt-10 border-t-2">
      <div className="flex flex-col gap-12 sm:flex-row">
        {/* IMAGES SECTION */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">
          
          {/* THUMBNAILS */}
          <div className="flex sm:flex-col gap-3 w-full sm:w-[18%] overflow-x-auto sm:overflow-y-auto no-scrollbar">
            {productData.image.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={`cursor-pointer border rounded-md overflow-hidden shrink-0 
                ${activeIndex === index ? "border-black ring-1 ring-black" : "border-gray-300"}
                w-20 h-20 sm:w-full sm:h-auto transition-all duration-300`}
              >
                <img
                  src={item}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100"
                  alt="thumbnail"
                />
              </div>
            ))}
          </div>

          {/* MAIN IMAGE SLIDER & ZOOM */}
          <div className="w-full sm:w-[80%] relative group">
            <div className="w-full aspect-[4/5] overflow-hidden bg-gray-100 rounded-md relative">
              
              {/* SLIDING TRACK */}
              <div
                className="flex w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {productData.image.map((img, i) => (
                  <div
                    key={i}
                    className="w-full h-full min-w-full flex items-center justify-center overflow-hidden bg-white"
                    onMouseMove={i === activeIndex ? handleMouseMove : null}
                    onMouseLeave={i === activeIndex ? handleMouseLeave : null}
                  >
                    <img
                      src={img}
                      alt={`Product ${i}`}
                      style={i === activeIndex ? zoomStyle : {}}
                      className="w-full h-full object-cover transition-transform duration-100 ease-linear cursor-crosshair"
                    />
                  </div>
                ))}
              </div>

              {/* ARROWS (Visible on Hover) */}
              <button 
                onClick={prevSlide}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

            </div>
          </div>
        </div>

        {/* PRODUCT INFO (UNCHANGED LOGIC) */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium">{productData.name}</h1>

          {productData.soldOut && (
            <p className="text-red-600 font-semibold mt-1">
              🚫 Currently Sold Out
            </p>
          )}

          {/* PRICE */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-medium">
              {currency}
              {productData.price}
            </p>

            {discountPercent > 0 && (
              <p className="text-lg line-through text-gray-500">
                {currency}
                {mrpValue}
              </p>
            )}

            {discountPercent > 0 && (
              <p className="text-lg font-bold text-green-600">
                {discountPercent}% OFF
              </p>
            )}
          </div>

          {discountPercent > 0 && (
            <p className="text-sm text-green-700 mt-1 font-medium">
              You save {currency}
              {savings}
            </p>
          )}

          {/* SIZE */}
          <div className="my-8">
            <p>Select Size</p>
            <div className="flex gap-2 mt-2">
              {productData.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={`border px-4 py-2 rounded-md
                  ${
                    size === item ? "border-black bg-gray-200" : "bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={async () => {
                if (!size) return alert("Select size");
                await addToCart(productData._id, size);
                navigate("/cart");
              }}
              className="px-8 py-3 bg-black text-white"
            >
              ADD TO CART
            </button>

            <button
              onClick={handleTryOn}
              className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-purple-600 text-white"
            >
              TRY ON ✨
            </button>
          </div>

          {/* DELIVERY */}
          <div className="mt-6 border-t pt-5">
            <h3 className="font-bold mb-3">Delivery Check</h3>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="border px-3 py-2"
                placeholder="Pincode"
              />
              <button
                onClick={handleCheckPincode}
                className="bg-black text-white px-4"
              >
                Check
              </button>
            </div>
            {loading && <p className="text-sm mt-2">Checking...</p>}
            {deliveryInfo && (
              <p
                className={`text-sm mt-2 ${
                  deliveryInfo.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {deliveryInfo.available
                  ? `Delivery available! Days: ${deliveryInfo.days}`
                  : "Not available in this area."}
              </p>
            )}
          </div>

          {/* DESCRIPTION + REVIEWS */}
          <div className="mt-8 border-t pt-6">
            <h3 className="font-bold mb-2">Product Description</h3>
            <p className="text-gray-700">{productData.description}</p>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-bold mb-3">Customer Reviews</h3>

              {reviews.map((rev, i) => (
                <div key={i} className="border-b pb-3 mb-3">
                  <p className="font-medium">{rev.userName || "User"}</p>
                  <p className="text-sm">{rev.review || rev.description}</p>
                </div>
              ))}

              {user && (
                <div className="mt-4">
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="border w-full p-2"
                    placeholder="Write review..."
                  />
                  <div className="flex items-center gap-4 mt-2">
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border p-2"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Stars
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddReview}
                      className="bg-black text-white px-4 py-2"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;