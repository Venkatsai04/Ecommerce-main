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

// SCENES
const SCENES = [
  {
    id: "original",
    label: "Original",
    icon: <User className="w-4 h-4" />,
    prompt: "Keep the original scene",
  },
  {
    id: "wedding",
    label: "Grand Wedding",
    icon: <Sparkles className="w-4 h-4" />,
    prompt:
      "Place the man in a luxurious Indian wedding venue with warm festive lighting.",
  },
  {
    id: "office",
    label: "Modern Office",
    icon: <Briefcase className="w-4 h-4" />,
    prompt:
      "Place the man in a high-end corporate office with glass walls and city views.",
  },
  {
    id: "nyc",
    label: "Urban Night",
    icon: <Building2 className="w-4 h-4" />,
    prompt:
      "Place the man on a stylish city street at night with bokeh lights.",
  },
  {
    id: "cafe",
    label: "Business Lunch",
    icon: <Coffee className="w-4 h-4" />,
    prompt:
      "Place the man in an upscale restaurant during the day.",
  },
];

// SIZES
const SIZES = [
  { label: "S", desc: "38 (Small) - Slim Fit" },
  { label: "M", desc: "40 (Medium) - Regular Fit" },
  { label: "L", desc: "42 (Large) - Comfort Fit" },
  { label: "XL", desc: "44 (X-Large) - Relaxed Fit" },
  { label: "XXL", desc: "46 (2X-Large) - Broad Fit" },
];

// Helpers
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          full: reader.result.toString(),
          raw: reader.result.toString().split(",")[1],
          mime: blob.type,
        });
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("CORS error:", err);
    return null;
  }
};

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        full: reader.result.toString(),
        raw: reader.result.toString().split(",")[1],
        mime: file.type,
      });
    reader.readAsDataURL(file);
  });

const TryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const uploaderRef = useRef(null);

  const [userImage, setUserImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedScene, setSelectedScene] = useState("original");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);

  // NEW
  const [showConsent, setShowConsent] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate(-1);
      return;
    }

    (async () => {
      setLoading(true);
      setLoadingStep("Loading product image...");

      try {
        const imageUrl = Array.isArray(product.image)
          ? product.image[0]
          : product.image;

        const b64 = await urlToBase64(imageUrl);
        setGarmentImage(b64);
      } catch {
        setError("Unable to load product image.");
      }

      setLoading(false);
      setLoadingStep("");
    })();
  }, [product]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLoadingStep("Processing your photo...");

    const b64 = await fileToBase64(file);
    setUserImage(b64);

    setLoading(false);
    setLoadingStep("");
  };

  const handleDemo = async () => {
    setLoading(true);
    setLoadingStep("Loading demo model...");

    const demoUrl =
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&q=80&w=800";
    const b64 = await urlToBase64(demoUrl);
    setUserImage(b64);

    setLoading(false);
    setLoadingStep("");
  };

  const handleGenerate = async () => {
    if (!userImage) {
      setError("Upload a photo first.");
      return;
    }
    if (!agreed) {
      setError("You must accept the terms first.");
      return;
    }

    setLoading(true);
    setLoadingStep("Generating try-on...");

    try {
      const payload = {
        userImage,
        garmentImage,
        selectedSize,
        selectedScenePrompt:
          SCENES.find((s) => s.id === selectedScene)?.prompt,
        productCategory: product?.category || "",
      };

      const res = await fetch(`${import.meta.env.VITE_PORT}/tryon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Try-on failed.");
      } else {
        setResultImage(data.image);
      }
    } catch {
      setError("Server error.");
    }

    setLoading(false);
    setLoadingStep("");
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `tryon_${product?.name}.png`;
    a.click();
  };

  if (!product) return null;

  return (
    <div className="max-w-[1920px] mx-auto bg-white min-h-screen text-zinc-900 relative">

      {/* CONSENT POPUP */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
          <div className="bg-white border-4 border-black p-8 max-w-md shadow-[10px_10px_0_0_#000]">
            <h2 className="text-xl font-black uppercase tracking-widest mb-4">
              Before You Start
            </h2>

            <p className="text-sm text-gray-700 mb-4">
              To use AI Try-On, you must agree to the following:
            </p>

            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1 mb-6">
              <li>Your photo is not stored or misused.</li>
              <li>Only real human photos are allowed.</li>
              <li>Clear lighting and front-facing images work best.</li>
              <li>Only men's try-on is supported currently.</li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAgreed(true);
                  setShowConsent(false);
                }}
                className="flex-1 bg-black text-white px-4 py-3 text-xs font-black uppercase hover:bg-zinc-800"
              >
                I Agree
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex-1 border-2 border-black px-4 py-3 text-xs font-black uppercase hover:bg-black hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border-2 border-red-900 p-4 flex gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5" />
          <div>
            <strong className="uppercase text-xs">Error</strong>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen border-black border-t-4 border-b-4">

        {/* LEFT SECTION */}
        <div className="lg:col-span-3 border-b-4 lg:border-r-4 border-black p-6 flex flex-col">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h3 className="font-black text-xs uppercase tracking-widest mb-2">The Garment</h3>

          <div className="border-2 border-black aspect-[3/4] p-4 flex justify-center items-center relative">
            {garmentImage ? (
              <img
                src={garmentImage.full}
                className="object-contain max-w-full max-h-full"
              />
            ) : (
              <Loader2 className="animate-spin" />
            )}

            <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-[8px]">
              LOCKED
            </div>
          </div>

          <p className="font-bold text-xs mt-2">{product.name}</p>
          <p className="text-gray-500 text-sm">₹{product.price}</p>

          <h3 className="font-black text-xs uppercase tracking-widest mt-6 mb-2">
            Your Photo
          </h3>

          <div
            onClick={() => uploaderRef.current?.click()}
            className="border-2 border-black border-dashed aspect-[3/4] flex flex-col items-center justify-center cursor-pointer"
          >
            <input
              ref={uploaderRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />

            {!userImage ? (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-xs font-black uppercase">Upload Photo</p>
                <p className="text-[10px] text-gray-400 uppercase">Men Only</p>
              </>
            ) : (
              <img src={userImage.full} className="w-full h-full object-cover" />
            )}
          </div>

          <button
            onClick={handleDemo}
            className="mt-4 border-2 border-black py-3 uppercase text-xs font-black hover:bg-black hover:text-white"
          >
            Use Demo Model
          </button>
        </div>

        {/* MIDDLE SECTION (with TOP instructions) */}
        <div className="lg:col-span-3 border-b-4 lg:border-r-4 border-black p-6 flex flex-col">

          {/* NEW TOP 4-STEP INSTRUCTIONS */}
          <div className="bg-yellow-50 border-2 border-black p-5 mb-8 shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black uppercase tracking-widest mb-3">
              How To Use Virtual Try-On
            </h3>

            <ol className="space-y-3 text-sm text-black font-semibold leading-relaxed">
              <li>
                <span className="font-extrabold">1.</span> Upload a clear front-facing photo
                with good lighting.
              </li>
              <li>
                <span className="font-extrabold">2.</span> Choose your correct size (S–XXL).
              </li>
              <li>
                <span className="font-extrabold">3.</span> Pick a background scene (Wedding, Office, Urban Night, etc.).
              </li>
              <li>
                <span className="font-extrabold">4.</span> Click
                <span className="text-purple-600 font-extrabold"> Generate Fit </span>
                to see your AI try-on.
              </li>
            </ol>

            {!agreed && (
              <p className="text-xs text-red-600 mt-3 font-semibold">
                * You must accept the terms to generate the try-on.
              </p>
            )}
          </div>

          {/* SIZE */}
          <h3 className="text-xs font-black uppercase tracking-widest mb-2">Size (India)</h3>

          <div className="grid grid-cols-2 gap-2">
            {SIZES.map((s) => (
              <button
                key={s.label}
                onClick={() => setSelectedSize(s.label)}
                className={`py-3 border-2 text-sm font-bold ${
                  selectedSize === s.label
                    ? "bg-black text-white"
                    : "bg-white border-zinc-200 text-gray-500 hover:border-black hover:text-black"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <p className="text-xs bg-zinc-100 p-2 mt-2 border border-zinc-200">
            Fit: {SIZES.find((x) => x.label === selectedSize).desc}
          </p>

          {/* SCENES */}
          <h3 className="text-xs font-black uppercase tracking-widest mt-6 mb-2">Scene</h3>

          <div className="space-y-2">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 border-2 text-xs font-bold uppercase ${
                  selectedScene === scene.id
                    ? "bg-black text-white"
                    : "bg-white text-gray-500 border-zinc-200 hover:border-black hover:text-black"
                }`}
              >
                {scene.icon}
                {scene.label}
              </button>
            ))}
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading || !userImage || !agreed}
            className={`mt-8 w-full py-4 border-2 border-black text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 ${
              !userImage || !agreed
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingStep}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Fit
              </>
            )}
          </button>
        </div>

        {/* RIGHT PREVIEW SECTION */}
        <div className="lg:col-span-6 bg-zinc-50 flex items-center justify-center p-6 relative">

          {resultImage ? (
            <>
              <button
                onClick={handleDownload}
                className="absolute top-6 right-6 border-2 bg-white border-black px-4 py-2 text-xs font-black uppercase hover:bg-black hover:text-white"
              >
                <Download className="w-4 h-4 inline-block mr-1" />
                Download
              </button>

              <img
                src={resultImage}
                className="border-2 border-black shadow-xl max-h-[80vh] object-contain"
              />
            </>
          ) : (
            <div className="text-center opacity-70">
              <img
                src={
                  Array.isArray(product.image)
                    ? product.image[0]
                    : product.image
                }
                className="max-h-[40vh] mx-auto mb-6"
              />
              <h2 className="text-3xl font-black">{product.name}</h2>
              <p className="font-mono text-lg mt-2">₹{product.price}</p>
              <p className="text-xs uppercase tracking-widest mt-4 text-gray-500">
                Ready for Virtual Try-On
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TryOn;
