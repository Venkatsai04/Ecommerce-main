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

  // SLIDER STATES
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ZOOM / PAN STATES (Simple Zoom - Option A)
  const [scale, setScale] = useState(1); // 1 = normal, >1 zoomed
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const [doubleTapTimer, setDoubleTapTimer] = useState(null);

  // Load product
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      setActiveIndex(0);
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [productId, products]);

  // Update image when activeIndex changes
  useEffect(() => {
    if (productData?.image) {
      setImage(productData.image[activeIndex]);
      // reset zoom on slide change
      setScale(1);
      setTranslate({ x: 0, y: 0 });
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

  const originalPrice = Math.round(productData.price / 0.31);

  /* -------------------- Zoom & Pan Helpers -------------------- */

  const MAX_SCALE = 3;
  const MIN_SCALE = 1;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // compute distance between two touches
  const touchDistance = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  // Double-click (desktop) or double-tap (mobile) toggles zoom
  const toggleZoom = (targetCenter = null) => {
    if (scale === 1) {
      // zoom in
      const newScale = 2.5;
      // optional: center zoom around tap point by adjusting translate
      if (targetCenter && sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const cx = targetCenter.x - rect.left;
        const cy = targetCenter.y - rect.top;
        // compute translate so the point remains at the same visual place after scale
        const tx = (rect.width / 2 - cx) * (newScale - 1) / newScale;
        const ty = (rect.height / 2 - cy) * (newScale - 1) / newScale;
        setTranslate({ x: clamp(tx, -rect.width * (newScale - 1), rect.width * (newScale - 1)), y: clamp(ty, -rect.height * (newScale - 1), rect.height * (newScale - 1)) });
      } else {
        setTranslate({ x: 0, y: 0 });
      }
      setScale(newScale);
    } else {
      // zoom out
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  };

  // Handle desktop double click
  const onDoubleClick = (e) => {
    e.preventDefault();
    toggleZoom({ x: e.clientX, y: e.clientY });
  };

  // Mouse pan (desktop)
  const onMouseDown = (e) => {
    if (scale === 1) return; // allow slider scroll when not zoomed
    e.preventDefault();
    setIsPanning(true);
    setLastPan({ x: e.clientX, y: e.clientY });
  };
  const onMouseMove = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    const dx = e.clientX - lastPan.x;
    const dy = e.clientY - lastPan.y;
    setLastPan({ x: e.clientX, y: e.clientY });
    // update translate; clamp to avoid excessive pan
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const limitX = rect.width * (scale - 1);
      const limitY = rect.height * (scale - 1);
      setTranslate((t) => ({
        x: clamp(t.x + dx, -limitX, limitX),
        y: clamp(t.y + dy, -limitY, limitY),
      }));
    }
  };
  const onMouseUp = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    setIsPanning(false);
  };

  // Touch handlers: support pinch-to-zoom, pan while zoomed, double-tap
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      // start pinch
      const dist = touchDistance(e.touches[0], e.touches[1]);
      setLastTouchDistance(dist);
    } else if (e.touches.length === 1) {
      // possible pan or double-tap
      if (doubleTapTimer) {
        // double-tap detected
        clearTimeout(doubleTapTimer);
        setDoubleTapTimer(null);
        const touch = e.touches[0];
        toggleZoom({ x: touch.clientX, y: touch.clientY });
      } else {
        // start a timer to detect second tap
        const timer = setTimeout(() => {
          setDoubleTapTimer(null);
        }, 300);
        setDoubleTapTimer(timer);
      }

      // start pan if zoomed
      if (scale > 1) {
        setIsPanning(true);
        const t = e.touches[0];
        setLastPan({ x: t.clientX, y: t.clientY });
      }
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      // pinch to zoom
      e.preventDefault();
      const dist = touchDistance(e.touches[0], e.touches[1]);
      if (lastTouchDistance) {
        const ratio = dist / lastTouchDistance;
        const newScale = clamp(scale * ratio, MIN_SCALE, MAX_SCALE);
        setScale(newScale);
        // after scaling, we should clamp translate too
        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect();
          const limitX = rect.width * (newScale - 1);
          const limitY = rect.height * (newScale - 1);
          setTranslate((t) => ({
            x: clamp(t.x, -limitX, limitX),
            y: clamp(t.y, -limitY, limitY),
          }));
        }
      }
      setLastTouchDistance(dist);
    } else if (e.touches.length === 1 && isPanning && scale > 1) {
      // pan while zoomed
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - lastPan.x;
      const dy = t.clientY - lastPan.y;
      setLastPan({ x: t.clientX, y: t.clientY });
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const limitX = rect.width * (scale - 1);
        const limitY = rect.height * (scale - 1);
        setTranslate((tpos) => ({
          x: clamp(tpos.x + dx, -limitX, limitX),
          y: clamp(tpos.y + dy, -limitY, limitY),
        }));
      }
    }
  };

  const onTouchEnd = (e) => {
    setLastTouchDistance(null);
    // stop panning on touch end
    setIsPanning(false);
  };

  // Prevent slider scroll when zoomed (touch)
  const onWheel = (e) => {
    // allow normal wheel behavior
  };

  /* -------------------- Slider navigation helpers -------------------- */

  const goToIndex = (index) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const prevSlide = () => {
    const next = clamp(activeIndex - 1, 0, productData.image.length - 1);
    goToIndex(next);
  };

  const nextSlide = () => {
    const next = clamp(activeIndex + 1, 0, productData.image.length - 1);
    goToIndex(next);
  };

  return (
    <div className="pt-10 border-t-2">
      <div className="flex flex-col gap-12 sm:flex-row">

        {/* ---------- IMAGES ---------- */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">

          {/* THUMBNAILS */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-[18%] snap-x snap-mandatory">
            {productData.image.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  // move slider; reset zoom
                  setScale(1);
                  setTranslate({ x: 0, y: 0 });
                  goToIndex(index);
                }}
                className={`cursor-pointer border rounded-md overflow-hidden snap-center 
                  ${activeIndex === index ? "border-black" : "border-gray-300"}
                  flex-shrink-0 w-20 h-20 sm:w-full sm:h-auto sm:aspect-square bg-gray-100`}
              >
                <img src={item} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* MAIN IMAGE SLIDER + ZOOM */}
          <div className="relative w-full sm:w-[80%]">

            {productData.soldOut && (
              <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-xs rounded-sm z-30">
                SOLD OUT
              </div>
            )}

            {/* Desktop arrows */}
            <button
              onClick={prevSlide}
              className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 rounded-full shadow-md hover:scale-105"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 rounded-full shadow-md hover:scale-105"
              aria-label="Next image"
            >
              ›
            </button>

            {/* SCROLLABLE SLIDER */}
            <div
              ref={sliderRef}
              className="w-full aspect-[4/5] overflow-x-auto snap-x snap-mandatory flex rounded-md bg-gray-100 relative touch-pan-x"
              style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
              onScroll={(e) => {
                if (scale > 1) return; // disable auto-sync while zoomed to avoid jump
                const scrollLeft = e.target.scrollLeft;
                const width = e.target.offsetWidth;
                const index = Math.round(scrollLeft / width);
                setActiveIndex(index);
              }}
              onDoubleClick={onDoubleClick}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onWheel={onWheel}
            >
              {productData.image.map((img, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden"
                  style={{ touchAction: scale > 1 ? "none" : "pan-y" }} // when zoomed, disable horizontal pan for native scrolling
                >
                  {/* The actual image. If this slide is active, apply transform for zoom/pan */}
                  <img
                    src={img}
                    className="w-full h-full object-cover transition-transform duration-75"
                    alt={`product-${index}`}
                    style={
                      index === activeIndex
                        ? {
                            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                            transformOrigin: "center center",
                            cursor: scale > 1 ? "grab" : "zoom-in",
                          }
                        : {}
                    }
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </div>

            {/* DOTS INDICATOR */}
            <div className="flex justify-center gap-2 mt-2">
              {productData.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setScale(1);
                    setTranslate({ x: 0, y: 0 });
                    goToIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full ${activeIndex === index ? "bg-black" : "bg-gray-400"}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------- PRODUCT INFO ---------- */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>

          {productData.soldOut && (
            <p className="text-red-600 font-semibold text-sm mt-1">🚫 Currently Sold Out</p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <p className="text-3xl font-medium">{currency}{productData.price}</p>
            <p className="text-lg line-through text-gray-500">{currency}{originalPrice}</p>
            <p className="text-lg font-bold text-green-600">69% OFF</p>
          </div>

          {/* SIZE */}
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
                    ${productData.soldOut ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 items-center">
            {productData.soldOut ? (
              <button disabled className="px-8 py-3 text-sm text-white bg-gray-400 cursor-not-allowed">
                SOLD OUT
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!size) return alert("Please select a size");
                  await addToCart(productData._id, size);
                  navigate("/cart");
                }}
                className="px-8 py-3 text-sm text-white bg-black active:bg-gray-700"
              >
                ADD TO CART
              </button>
            )}

            <button
              onClick={handleTryOn}
              className="px-8 py-3 text-sm text-white bg-gradient-to-r from-yellow-600 to-purple-600 hover:opacity-90 shadow-md transition-all"
            >
              TRY ON ✨
            </button>
          </div>

          {/* DELIVERY */}
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

            {/* DESCRIPTION + REVIEWS */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Product Description</h3>
              <p className="text-gray-700 text-sm md:text-base mb-6">
                {productData.description || "No description available."}
              </p>

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

              {/* REVIEWS */}
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

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
