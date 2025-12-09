import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Upload,
  Loader2,
  Sparkles,
  Download,
  ArrowLeft,
  X,
  Ruler,
  MapPin,
  Briefcase,
  Coffee,
  Building2,
  User,
  AlertCircle,
} from "lucide-react";
import { assets } from "../assets/assets";

/*
  FULL TRYON PAGE (original UI preserved)
  - All Gemini / AI logic moved to backend at: api/tryon
  - Frontend now only:
    1) loads product image -> base64 (garmentImage)
    2) accepts user's upload -> base64 (userImage)
    3) sends both to backend with size/scene/category
    4) displays returned base64 image
  - UI, layout and styling kept exactly as in your original file
*/

// SCENES and SIZES (kept as in original)
const SCENES = [
  {
    id: "original",
    label: "original",
    icon: <User className="w-4 h-4" />,
    prompt: "Keep the original secne",
  },
  {
    id: "wedding",
    label: "Grand Wedding",
    icon: <Sparkles className="w-4 h-4" />,
    prompt:
      "Place the man in a luxurious Indian wedding venue with floral decorations, marigolds, and warm festive lighting.",
  },
  {
    id: "office",
    label: "Modern Office",
    icon: <Briefcase className="w-4 h-4" />,
    prompt:
      "Place the man in a high-end, glass-walled executive office with city views. Professional, corporate atmosphere.",
  },
  {
    id: "nyc",
    label: "Urban Night",
    icon: <Building2 className="w-4 h-4" />,
    prompt:
      "Place the man on a city street at night (NYC style). Bokeh city lights, sleek urban atmosphere, dramatic lighting.",
  },
  {
    id: "cafe",
    label: "Business Lunch",
    icon: <Coffee className="w-4 h-4" />,
    prompt:
      "Place the man in an upscale restaurant or cafe setting during the day. Sophisticated casual business vibe.",
  },
];

const SIZES = [
  { label: "S", desc: "38 (Small) - Slim Fit" },
  { label: "M", desc: "40 (Medium) - Regular Fit" },
  { label: "L", desc: "42 (Large) - Comfort Fit" },
  { label: "XL", desc: "44 (X-Large) - Relaxed Fit" },
  { label: "XXL", desc: "46 (2X-Large) - Broad Fit" },
];

// Helpers: convert urls/files to base64 objects { full, raw, mime }
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () =>
        resolve({
          full: reader.result.toString(),
          raw: reader.result.toString().split(",")[1],
          mime: blob.type,
        });
    });
  } catch (e) {
    console.warn("CORS / fetch error converting url to base64", e);
    return null;
  }
};

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve({
        full: reader.result.toString(),
        raw: reader.result.toString().split(",")[1],
        mime: file.type,
      });
  });

const TryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // product must be passed via navigate state (product object from product page)
  const product = location.state?.product;
  const userFileInputRef = useRef(null);

  const [userImage, setUserImage] = useState(null); // { full, raw, mime }
  const [garmentImage, setGarmentImage] = useState(null); // { full, raw, mime }
  const [resultImage, setResultImage] = useState(null); // data url from backend
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedScene, setSelectedScene] = useState("original");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // protect direct access to /try-on
    if (!product) {
      navigate(-1);
      return;
    }

    // load product image (first image if array) as base64 object for backend
    (async () => {
      try {
        const imageUrl = Array.isArray(product.image) ? product.image[0] : product.image;
        setLoading(true);
        setLoadingStep("Loading product image...");
        const base64 = await urlToBase64(imageUrl);
        if (!base64) {
          setError("Failed to load product image. CORS/network issue.");
          return;
        }
        setGarmentImage(base64);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load product image.");
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleUserUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      setLoadingStep("Processing photo...");
      const base64 = await fileToBase64(file);
      setUserImage(base64);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to process your photo.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleDemoLoad = async () => {
    setLoading(true);
    setLoadingStep("Loading demo...");
    try {
      const demoUrl =
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800";
      const base64 = await urlToBase64(demoUrl);
      if (!base64) throw new Error("Demo image load failed");
      setUserImage(base64);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load demo image.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // THIS is the only function that calls the backend.
  
  const handleGenerate = async () => {
    if (!userImage || !garmentImage) {
      setError("Please upload your photo.");
      return;
    }

    setLoading(true);
    setLoadingStep("Validating & Generating...");
    setError(null);
    setResultImage(null);

    try {
      // payload - keep minimal: backend holds prompts and model config
      const payload = {
        userImage, // { full, raw, mime }
        garmentImage,
        selectedSize,
        selectedScenePrompt: SCENES.find((s) => s.id === selectedScene)?.prompt || "Studio neutral",
        productCategory: product?.category || product?.subCategory || "",
      };

      const resp = await fetch("http://13.203.214.92/api/tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        const msg = data?.message || `Server returned ${resp.status}`;
        setError(msg);
      } else {
        setResultImage(data.image); // data:image/png;base64,....
      }
    } catch (err) {
      console.error("Try-on request failed:", err);
      setError("Server error while generating try-on. Try again later.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // allow user to download result image
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `tryon_${product?.name?.replace(/\s+/g, "_") || "result"}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Keep original UI exactly — below markup follows your original structure
  if (!product) return null;

  return (
    <div className="max-w-[1920px] mx-auto bg-white min-h-screen text-zinc-900 font-sans border-t-4 border-black box-border overflow-y-auto">
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 bg-red-50 border-2 border-red-900 flex items-start gap-4 text-red-900 shadow-xl max-w-2xl mx-auto animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold uppercase text-xs tracking-wider mb-1">System Error</h4>
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen border-x-0 lg:border-x-4 border-b-4 border-black">
        {/* Left Col: Inputs */}
        <div className="lg:col-span-3 border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black p-6 space-y-8 bg-white flex flex-col">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Product
          </button>

          {/* Garment */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
              <div className="w-2 h-2 bg-black"></div>The Garment
            </h3>
            <div className="bg-white border-2 border-black aspect-[3/4] p-4 flex items-center justify-center relative">
              {garmentImage ? (
                <img src={garmentImage.full} className="max-h-full max-w-full object-contain" alt="item" />
              ) : (
                <Loader2 className="animate-spin" />
              )}
              <div className="absolute top-0 right-0 p-1.5 bg-black text-white">
                <span className="text-[8px] font-bold">LOCKED</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-black border-b-2 border-black pb-1 inline-block">
                {product.name}
              </p>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {typeof product.price === "number" ? `₹${product.price.toLocaleString()}` : product.price}
              </p>
            </div>
          </div>

          {/* User upload */}
          <div className="space-y-4 mt-auto">
            <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
              <div className="w-2 h-2 bg-black"></div>Your Profile
            </h3>

            <div
              onClick={() => userFileInputRef.current?.click()}
              className="bg-zinc-50 border-2 border-black border-dashed hover:bg-black hover:border-black group aspect-[3/4] cursor-pointer transition-all flex flex-col items-center justify-center p-4 relative"
            >
              <input
                type="file"
                ref={userFileInputRef}
                onChange={handleUserUpload}
                className="hidden"
                accept="image/*"
              />
              {userImage ? (
                <>
                  <img
                    src={userImage.full}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    alt="user"
                  />
                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-transparent">
                    <span className="text-black text-xs uppercase tracking-widest font-bold border-b-2 border-black">
                      Change
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 group-hover:invert transition-all">
                  <div className="w-12 h-12 border-2 border-black flex items-center justify-center mx-auto rounded-none">
                    <Upload className="w-5 h-5 text-black" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-black">Upload</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Men Only</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleDemoLoad}
              disabled={loading}
              className={`w-full py-3 text-xs font-black uppercase tracking-widest border-2 transition-all ${
                loading ? "bg-zinc-100 text-zinc-400 border-zinc-200" : "bg-white border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Try Demo Model
            </button>
          </div>
        </div>

        {/* Center Col: Configuration */}
        <div className="lg:col-span-3 border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black p-6 flex flex-col bg-white">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-black">Size (IND)</h3>
                <Ruler className="w-4 h-4 text-black" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s.label)}
                    className={`py-3 text-sm font-bold border-2 transition-all rounded-none ${
                      selectedSize === s.label ? "bg-black text-white border-black" : "bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <p className="text-xs font-medium text-black bg-zinc-100 p-2 border border-zinc-200">
                Fit: {SIZES.find((x) => x.label === selectedSize)?.desc}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-black">Atmosphere</h3>
                <MapPin className="w-4 h-4 text-black" />
              </div>

              <div className="space-y-2">
                {SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all text-left border-2 ${
                      selectedScene === scene.id ? "bg-black border-black text-white" : "bg-white border-zinc-200 text-zinc-400 hover:border-black hover:text-black"
                    }`}
                  >
                    {scene.icon}
                    <span>{scene.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <button
              onClick={handleGenerate}
              disabled={loading || !userImage}
              className={`w-full py-6 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 border-black ${
                loading ? "bg-white text-black cursor-wait" : !userImage ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed" : "from-yellow-600 to-purple-600 text-white hover:bg-white hover:text-black"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? `${loadingStep || "Processing..."}` : "Generate Fit"}
            </button>
          </div>
        </div>

        {/* Right Col: Result / Preview Area */}
        <div className="lg:col-span-6 bg-zinc-50 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {resultImage && (
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={handleDownload}
                className="bg-white border-2 border-black text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          )}

          <div className="w-full h-full p-8 flex items-center justify-center">
            {loading ? (
              <div className="text-center space-y-6 bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="w-16 h-16 border-4 border-black border-t-zinc-200 animate-spin rounded-full mx-auto"></div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-widest">{loadingStep || "Processing..."}</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-2">AI_MODEL::PROCESSING</p>
                </div>
              </div>
            ) : resultImage ? (
              <div className="relative border-2 border-black bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-full max-w-full">
                <img src={resultImage} alt="Generated Try-On" className="max-h-[80vh] object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
                {product.image && (
                  <img
                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt="Selected Preview"
                    className="max-h-[50vh] object-contain mb-8 mix-blend-multiply drop-shadow-2xl"
                  />
                )}
                <h3 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase max-w-lg leading-none">
                  {product.name}
                </h3>
                <div className="bg-black text-white px-4 py-2 text-xl font-bold font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                  {typeof product.price === "number" ? `₹${product.price.toLocaleString()}` : product.price}
                </div>
                <p className="text-xs font-bold text-zinc-400 font-mono uppercase mt-6 tracking-widest">Ready for Virtual Try-On</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOn;
