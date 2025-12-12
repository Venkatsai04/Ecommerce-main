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
  CheckCircle,
  Lock,
} from "lucide-react";

const SCENES = [
  { id: "original", label: "Original", icon: <User className="w-4 h-4" />, prompt: "Keep the original scene" },
  { id: "wedding", label: "Grand Wedding", icon: <Sparkles className="w-4 h-4" />, prompt: "Place the man in a luxurious Indian wedding venue." },
  { id: "office", label: "Modern Office", icon: <Briefcase className="w-4 h-4" />, prompt: "Place the man in a high-end corporate office." },
  { id: "nyc", label: "Urban Night", icon: <Building2 className="w-4 h-4" />, prompt: "Place the man on a stylish city street at night." },
  { id: "cafe", label: "Business Lunch", icon: <Coffee className="w-4 h-4" />, prompt: "Place the man in an upscale restaurant." },
];

const SIZES = [
  { label: "S", desc: "38 (Small) - Slim Fit" },
  { label: "M", desc: "40 (Medium) - Regular Fit" },
  { label: "L", desc: "42 (Large) - Comfort Fit" },
  { label: "XL", desc: "44 (X-Large) - Relaxed Fit" },
  { label: "XXL", desc: "46 (2X-Large) - Broad Fit" },
];

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
  } catch {
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

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);

  // consent modal
  const [showConsent, setShowConsent] = useState(true);
  const [agreed, setAgreed] = useState(false);

  // panel steps
  const [openPanel, setOpenPanel] = useState(1);
  const step1Done = !!userImage;
  const step2Done = !!selectedSize;
  const step3Done = !!selectedScene;
  const step4Done = agreed;

  useEffect(() => {
    if (!product) return navigate(-1);

    (async () => {
      setLoading(true);
      setLoadingStep("Loading product image...");
      const img = Array.isArray(product.image) ? product.image[0] : product.image;

      const b64 = await urlToBase64(img);
      setGarmentImage(b64);
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

  const handleGenerate = async () => {
    if (!step1Done) return setError("Upload a photo first.");
    if (!step2Done) return setError("Select a size.");
    if (!step3Done) return setError("Pick a scene.");
    if (!step4Done) return setError("Agree to continue.");

    setLoading(true);
    setLoadingStep("Generating...");

    try {
      const payload = {
        userImage,
        garmentImage,
        selectedSize,
        selectedScenePrompt: SCENES.find((s) => s.id === selectedScene)?.prompt,
      };

      const res = await fetch(`${import.meta.env.VITE_PORT}/tryon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) setError(data.message || "Try-on failed.");
      else setResultImage(data.image);
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
    a.download = "tryon_result.png";
    a.click();
  };

  if (!product) return null;

  return (
    <div className="max-w-[1920px] mx-auto bg-white min-h-screen text-zinc-900 relative overflow-hidden">

      {/* 🔥 COMING SOON OVERLAY (Works on Mobile) */}
      <div className="absolute inset-0 z-[9999] backdrop-blur-lg bg-black/40 flex items-center justify-center px-6 py-10">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] w-full max-w-sm sm:max-w-md p-8 text-center rounded-lg animate-fadeIn">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-4">
            Try-On Coming Soon
          </h1>

          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            We're building India's most advanced AI Try-On experience.
            Soon, you’ll preview outfits on yourself with stunning realism —
            directly on your phone.
          </p>

          <p className="font-black text-md uppercase tracking-wide text-green-700 mb-4">
            Launching Very Soon 🚀
          </p>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* ⭐ BELOW THIS — Your entire Try-On UI stays intact but hidden behind overlay */}

      {/* Consent modal (kept intact for future use) */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
          <div className="bg-white border-4 border-black p-8 max-w-md shadow-[10px_10px_0_0_#000]">
            <h2 className="text-xl font-black uppercase tracking-widest mb-3">
              Before You Start
            </h2>
            <p className="text-sm text-gray-700 mb-3">Agree to continue.</p>

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

      {/* Your original Try-On layout untouched */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen border-black border-t-4 border-b-4 opacity-30 pointer-events-none select-none">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-3 border-b-4 lg:border-r-4 border-black p-6 flex flex-col">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h3 className="font-black text-xs uppercase tracking-widest mb-2">The Garment</h3>

          <div className="border-2 border-black aspect-[3/4] p-4 flex justify-center items-center">
            <img src={product.image?.[0]} className="object-contain max-w-full max-h-full" />
          </div>

          <p className="font-bold text-xs mt-2">{product.name}</p>
          <p className="text-gray-500 text-sm">₹{product.price}</p>
        </div>

        {/* MIDDLE PANEL */}
        <div className="lg:col-span-3 border-b-4 lg:border-r-4 border-black p-6 opacity-50">
          <p className="text-center text-xs uppercase font-black opacity-60">
            Feature Locked (Coming Soon)
          </p>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:col-span-6 bg-zinc-50 flex items-center justify-center p-6">
          <img src={product.image?.[0]} className="max-h-[60vh] object-contain opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default TryOn;
