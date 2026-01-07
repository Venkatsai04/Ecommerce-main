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

  // Requirement 3: Fake Urgency Logic
  const [fakeStock, setFakeStock] = useState(null);

  // Define all possible sizes
  const allPossibleSizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      setActiveIndex(0);
      setScale(1);
      setTranslate({ x: 0, y: 0 });

      // Requirement 2: Select first available size by default
      if (product.sizes && product.sizes.length > 0) {
        setSize(product.sizes[0]);
      }

      // Requirement 3: Fake Stock Storage Logic
      const storageKey = `stock_${productId}`;
      const timeKey = `stock_time_${productId}`;
      let currentStock = localStorage.getItem(storageKey);
      let lastUpdated = localStorage.getItem(timeKey);
      const now = Date.now();

      if (!currentStock) {
        // Initial random stock between 2 and 10
        currentStock = Math.floor(Math.random() * 9) + 2;
        localStorage.setItem(storageKey, currentStock);
        localStorage.setItem(timeKey, now);
      } else {
        // Decrease by 1 every 3 hours (10800000 ms)
        const hoursPassed = Math.floor((now - lastUpdated) / 10800000);
        if (hoursPassed >= 1) {
          currentStock = Math.max(1, currentStock - hoursPassed);
          localStorage.setItem(storageKey, currentStock);
          localStorage.setItem(timeKey, now);
        }
      }
      setFakeStock(currentStock);
    }
  }, [productId, products]);

  // ... (Keeping all your existing Zoom/Pan/Slider functions exactly as they were)
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollTimeoutRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(null);
  const [doubleTapTimer, setDoubleTapTimer] = useState(null);

  useEffect(() => {
    if (productData?.image) {
      setImage(productData.image[activeIndex]);
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [activeIndex, productData]);

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
        body: JSON.stringify({ userId: user._id, description: newReview, rating }),
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
      const res = await axios.post(`${apiRoute}/shipping/check-pincode`, { pincode });
      setDeliveryInfo(res.data);
    } catch (err) {
      console.error(err);
      setDeliveryInfo({ available: false, message: "Error checking delivery" });
    } finally {
      setLoading(false);
    }
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const touchDistance = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };
  const toggleZoom = (targetCenter = null) => {
    if (scale === 1) {
      const newScale = 2.5;
      if (targetCenter && sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const cx = targetCenter.x - rect.left;
        const cy = targetCenter.y - rect.top;
        const tx = (rect.width / 2 - cx) * (newScale - 1) / newScale;
        const ty = (rect.height / 2 - cy) * (newScale - 1) / newScale;
        setTranslate({ x: clamp(tx, -rect.width * (newScale - 1), rect.width * (newScale - 1)), y: clamp(ty, -rect.height * (newScale - 1), rect.height * (newScale - 1)) });
      } else {
        setTranslate({ x: 0, y: 0 });
      }
      setScale(newScale);
    } else {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  };
  const onDoubleClick = (e) => { e.preventDefault(); toggleZoom({ x: e.clientX, y: e.clientY }); };
  const onMouseDown = (e) => { if (scale === 1) return; e.preventDefault(); setIsPanning(true); setLastPan({ x: e.clientX, y: e.clientY }); };
  const onMouseMove = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    const dx = e.clientX - lastPan.x;
    const dy = e.clientY - lastPan.y;
    setLastPan({ x: e.clientX, y: e.clientY });
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const limitX = rect.width * (scale - 1);
      const limitY = rect.height * (scale - 1);
      setTranslate((t) => ({ x: clamp(t.x + dx, -limitX, limitX), y: clamp(t.y + dy, -limitY, limitY) }));
    }
  };
  const onMouseUp = (e) => { if (!isPanning) return; e.preventDefault(); setIsPanning(false); };
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = touchDistance(e.touches[0], e.touches[1]);
      setLastTouchDistance(dist);
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      setIsPanning(true);
      const t = e.touches[0];
      setLastPan({ x: t.clientX, y: t.clientY });
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
        setDoubleTapTimer(null);
        toggleZoom({ x: t.clientX, y: t.clientY });
      } else {
        const timer = setTimeout(() => { setDoubleTapTimer(null); }, 300);
        setDoubleTapTimer(timer);
      }
    } else if (e.touches.length === 1 && scale === 1) {
      if (doubleTapTimer) {
        e.preventDefault();
        clearTimeout(doubleTapTimer);
        setDoubleTapTimer(null);
        const touch = e.touches[0];
        toggleZoom({ x: touch.clientX, y: touch.clientY });
      } else {
        const timer = setTimeout(() => { setDoubleTapTimer(null); }, 300);
        setDoubleTapTimer(timer);
      }
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = touchDistance(e.touches[0], e.touches[1]);
      if (lastTouchDistance) {
        const ratio = dist / lastTouchDistance;
        const newScale = clamp(scale * ratio, 1, 3);
        setScale(newScale);
        if (sliderRef.current) {
          const rect = sliderRef.current.getBoundingClientRect();
          const limitX = rect.width * (newScale - 1);
          const limitY = rect.height * (newScale - 1);
          setTranslate((t) => ({ x: clamp(t.x, -limitX, limitX), y: clamp(t.y, -limitY, limitY) }));
        }
      }
      setLastTouchDistance(dist);
    } else if (e.touches.length === 1 && isPanning && scale > 1) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - lastPan.x;
      const dy = t.clientY - lastPan.y;
      setLastPan({ x: t.clientX, y: t.clientY });
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const limitX = rect.width * (scale - 1);
        const limitY = rect.height * (scale - 1);
        setTranslate((tpos) => ({ x: clamp(tpos.x + dx, -limitX, limitX), y: clamp(tpos.y + dy, -limitY, limitY) }));
      }
    }
  };
  const onTouchEnd = (e) => { setLastTouchDistance(null); setIsPanning(false); };
  const goToIndex = (index) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({ left: index * width, behavior: "smooth" });
    setActiveIndex(index);
  };
  const prevSlide = () => { if (activeIndex > 0) goToIndex(activeIndex - 1); };
  const nextSlide = () => { if (activeIndex < productData.image.length - 1) goToIndex(activeIndex + 1); };
  const handleScroll = (e) => {
    if (scale > 1) return;
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < productData.image.length) setActiveIndex(newIndex);
  };

  if (!productData) return <div className="opacity-0"></div>;

  const price = Number(productData.price);
  const mrp = productData.mrp && Number(productData.mrp) > price ? Number(productData.mrp) : Math.round(price * 2);
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);
  const amountSaved = mrp - price;

  return (
    <div className="pt-10 border-t-2">
      <div className="flex flex-col gap-12 sm:flex-row">
        {/* IMAGES */}
        <div className="flex flex-col-reverse flex-1 gap-3 sm:flex-row">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-[18%] snap-x snap-mandatory">
            {productData.image.map((item, index) => (
              <div key={index} onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); goToIndex(index); }} className={`cursor-pointer border rounded-md overflow-hidden snap-center ${activeIndex === index ? "border-black" : "border-gray-300"} flex-shrink-0 w-20 h-20 sm:w-full sm:h-auto sm:aspect-square bg-gray-100`}>
                <img src={item} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="relative w-full sm:w-[80%]">
            <div ref={sliderRef} className="w-full aspect-[4/5] overflow-x-scroll snap-x snap-mandatory flex rounded-md bg-gray-100 relative" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", touchAction: scale > 1 ? "none" : "pan-x" }} onScroll={handleScroll} onDoubleClick={onDoubleClick} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
              {productData.image.map((img, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 snap-center relative overflow-hidden" style={{ touchAction: scale > 1 ? "none" : "auto" }}>
                  <img src={img} className="w-full h-full object-cover transition-transform duration-75" alt={`product-${index}`} style={index === activeIndex ? { transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`, transformOrigin: "center center", cursor: scale > 1 ? "grab" : "zoom-in" } : {}} draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          
          {/* Requirement 3: Fake Urgency UI */}
          {fakeStock && !productData.soldOut && (
            <p className="text-orange-600 font-bold text-sm mt-2 animate-pulse">
              🔥 Only {fakeStock} left in stock!
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <p className="text-3xl font-medium">{currency}{price}</p>
            <p className="text-lg line-through text-gray-500">{currency}{mrp}</p>
            <p className="text-lg font-bold text-green-600">{discountPercent}% OFF</p>
          </div>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {/* Requirement 1: Show all sizes, grey out unavailable ones */}
              {allPossibleSizes.map((item, index) => {
                const isAvailable = productData.sizes.includes(item);
                return (
                  <button
                    key={index}
                    onClick={() => isAvailable && setSize(item)}
                    className={`border py-2 px-4  transition-all ${
                      size === item ? "border-black bg-gray-200" : "bg-gray-100"
                    } ${!isAvailable ? "opacity-30 cursor-not-allowed border-dashed" : "hover:border-black"}`}
                  >
                    {item}
                    {/* {!isAvailable && <span className="block text-[8px] leading-none">Sold Out</span>} */}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {productData.soldOut ? (
              <button disabled className="px-8 py-3 text-sm text-white bg-gray-400 cursor-not-allowed">SOLD OUT</button>
            ) : (
              <button onClick={() => { if (!size) return alert("Please select a size"); addToCart(productData._id, size); }} className="px-8 py-3 text-sm text-white bg-black active:bg-gray-700">ADD TO BAG</button>
            )}
          </div>

          <div className="mt-6 border-t pt-5">
            <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Delivery Check</h3>
            <div className="flex gap-2 items-center">
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter Pincode" className="border-2 border-black px-4 py-2 w-40" />
              <button onClick={handleCheckPincode} disabled={loading} className="bg-black text-white px-5 py-2 border-2 border-black">{loading ? "Checking..." : "Check"}</button>
            </div>
            {deliveryInfo && (
              <div className={`mt-4 p-3 border-2 ${deliveryInfo.available ? "border-black" : "border-red-500"}`}>
                {deliveryInfo.available ? (
                  /* Requirement 4: Show city name in UI */
                  <p className="text-base font-bold">
                    🚚 Delivering to <span className="capitalize underline">{deliveryInfo.city || "your city"}</span> in <span className="underline">{deliveryInfo.delivery_range === "N/A" ? "a few days" : `${deliveryInfo.delivery_range} days`}</span>
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">❌ Delivery not available</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Product Description</h3>
              <p className="text-gray-700 text-sm md:text-base mb-6">{productData.description || "No description available."}</p>
              <h3 className="text-lg font-extrabold mb-3 uppercase tracking-tight">Care & Returns</h3>
              <p className="text-gray-700 mb-4 text-sm"><span className="font-semibold">Care Instructions:</span><br />• Machine wash cold (30°C) <br />• Wash with similar colors <br />• Do not bleach <br />• Low heat iron <br />• Air dry recommended</p>
              <p className="text-gray-700 text-sm"><span className="font-semibold">Returns:</span><br />This item is <span className="font-bold">not eligible for <span onClick={() => { navigate('/returns') }}> <a className="text-blue underline"> returns</a> </span></span>.</p>
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-extrabold mb-4 uppercase tracking-tight">Customer Reviews</h3>
                {reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div key={i} className="border-b pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, j) => (<img key={j} src={j < rev.rating ? assets.star_icon : assets.star_dull_icon} className="w-4" alt="star" />))}
                        <p className="font-medium text-sm">{rev.userName || "User"}</p>
                      </div>
                      <p className="mt-1 text-gray-600 text-sm">{rev.review || rev.description}</p>
                    </div>
                  ))
                ) : (<p className="text-gray-500 text-sm">No reviews yet.</p>)}
                {user && (
                  <div className="mt-4">
                    <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} className="w-full border rounded-md p-2 text-sm" placeholder="Write your review..." />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm">Rating:</span>
                      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded p-1 text-sm">{[5, 4, 3, 2, 1].map((r) => (<option key={r} value={r}>{r}</option>))}</select>
                    </div>
                    <button onClick={handleAddReview} className="mt-3 px-5 py-2 bg-black text-white text-sm rounded-md">Submit Review</button>
                  </div>
                )}
              </div>
            </div>
          </div>

      </div>
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;