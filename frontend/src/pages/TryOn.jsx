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

// SCENES
const SCENES = [
  { id: "original", label: "Original", icon: <User className="w-4 h-4" />, prompt: "Keep the original scene" },
  { id: "wedding", label: "Grand Wedding", icon: <Sparkles className="w-4 h-4" />, prompt: "Place the man in a luxurious Indian wedding venue with warm festive lighting." },
  { id: "office", label: "Modern Office", icon: <Briefcase className="w-4 h-4" />, prompt: "Place the man in a high-end corporate office with glass walls and city views." },
  { id: "nyc", label: "Urban Night", icon: <Building2 className="w-4 h-4" />, prompt: "Place the man on a stylish city street at night with bokeh lights." },
  { id: "cafe", label: "Business Lunch", icon: <Coffee className="w-4 h-4" />, prompt: "Place the man in an upscale restaurant during the day." },
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
        resolve({ full: reader.result.toString(), raw: reader.result.toString().split(",")[1], mime: blob.type });
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
      resolve({ full: reader.result.toString(), raw: reader.result.toString().split(",")[1], mime: file.type });
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

  const [selectedSize, setSelectedSize] = useState(null); // start null so user selects
  const [selectedScene, setSelectedScene] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);

  // consent & accordion
  const [showConsent, setShowConsent] = useState(true);
  const [agreed, setAgreed] = useState(false);

  // Accordion: which panel is open
  const [openPanel, setOpenPanel] = useState(1);

  // Step completion derived flags
  const step1Done = !!userImage;
  const step2Done = !!selectedSize;
  const step3Done = !!selectedScene;
  const step4Done = agreed;

  useEffect(() => {
    if (!product) {
      navigate(-1);
      return;
    }
    (async () => {
      setLoading(true);
      setLoadingStep("Loading product image...");
      try {
        const imageUrl = Array.isArray(product.image) ? product.image[0] : product.image;
        const b64 = await urlToBase64(imageUrl);
        setGarmentImage(b64);
      } catch {
        setError("Unable to load product image.");
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    })();
  }, [product]);

  // When a step completes, auto-open next step
  useEffect(() => {
    if (step1Done && openPanel === 1) setOpenPanel(2);
  }, [step1Done, openPanel]);

  useEffect(() => {
    if (step2Done && openPanel === 2) setOpenPanel(3);
  }, [step2Done, openPanel]);

  useEffect(() => {
    if (step3Done && openPanel === 3) setOpenPanel(4);
  }, [step3Done, openPanel]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setLoadingStep("Processing your photo...");
    try {
      const b64 = await fileToBase64(file);
      setUserImage(b64);
      setError(null);
    } catch {
      setError("Failed to process your photo.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleGenerate = async () => {
    // final guards
    if (!step1Done) return setError("Please upload a photo.");
    if (!step2Done) return setError("Please select a size.");
    if (!step3Done) return setError("Please select a scene.");
    if (!step4Done) return setError("Please accept terms to continue.");

    setLoading(true);
    setLoadingStep("Generating try-on...");

    try {
      const payload = {
        userImage,
        garmentImage,
        selectedSize,
        selectedScenePrompt: SCENES.find((s) => s.id === selectedScene)?.prompt || "",
        productCategory: product?.category || "",
      };

      const res = await fetch(`${import.meta.env.VITE_PORT}/tryon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || `Server returned ${res.status}`);
      } else {
        setResultImage(data.image);
      }
    } catch (err) {
      console.error(err);
      setError("Server error while generating try-on.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `tryon_${product?.name?.replace(/\s+/g, "_") || "result"}.png`;
    a.click();
  };

  if (!product) return null;

  return (
    <div className="max-w-[1920px] mx-auto bg-white min-h-screen text-zinc-900 relative">
      {/* Consent popup */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
          <div className="bg-white border-4 border-black p-8 max-w-md shadow-[10px_10px_0_0_#000]">
            <h2 className="text-xl font-black uppercase tracking-widest mb-3">Before You Start</h2>
            <p className="text-sm text-gray-700 mb-3">To use AI Try-On, please agree to the terms below:</p>
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1 mb-4">
              <li>Your photo is processed securely and not stored permanently.</li>
              <li>Upload a clear front-facing photo (no cartoons or AI images).</li>
              <li>Only men's try-on supported currently.</li>
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

      {/* Error top */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border-2 border-red-900 p-4 flex gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5" />
          <div className="flex-1">
            <strong className="uppercase text-xs">Error</strong>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen border-black border-t-4 border-b-4">
        {/* LEFT: Product & Upload */}
        <div className="lg:col-span-3 border-b-4 lg:border-r-4 border-black p-6 flex flex-col">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h3 className="font-black text-xs uppercase tracking-widest mb-2">The Garment</h3>
          <div className="border-2 border-black aspect-[3/4] p-4 flex justify-center items-center relative">
            {garmentImage ? (
              <img src={garmentImage.full} className="object-contain max-w-full max-h-full" alt="garment" />
            ) : (
              <Loader2 className="animate-spin" />
            )}
            <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-[8px]">LOCKED</div>
          </div>

          <p className="font-bold text-xs mt-2">{product.name}</p>
          <p className="text-gray-500 text-sm">₹{product.price}</p>

          <h3 className="font-black text-xs uppercase tracking-widest mt-6 mb-2">Your Photo</h3>

          <div
            onClick={() => uploaderRef.current?.click()}
            className={`border-2 border-black border-dashed aspect-[3/4] flex flex-col items-center justify-center cursor-pointer transition ${step1Done ? "ring-2 ring-green-400" : ""}`}
          >
            <input ref={uploaderRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {!userImage ? (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-xs font-black uppercase">Upload Photo</p>
                <p className="text-[10px] text-gray-400 uppercase">Front-facing, good lighting</p>
              </>
            ) : (
              <img src={userImage.full} className="w-full h-full object-cover" alt="user" />
            )}
          </div>

          {/* removed demo button per request */}
        </div>

        {/* MIDDLE: Accordion steps */}
        <div className="lg:col-span-3 border-b-4 lg:border-r-4 border-black p-6">
          <div className="space-y-4">
            {/* Step 1 */}
            <div>
              <button
                onClick={() => setOpenPanel(1)}
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-black bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center">
                    {step1Done ? <CheckCircle className="w-5 h-5 text-green-600" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">Step 1</div>
                    <div className="text-sm font-bold">Upload Photo</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{step1Done ? "Completed" : "Required"}</div>
              </button>

              {openPanel === 1 && (
                <div className="border-l-2 border-black pl-4 mt-3">
                  <p className="text-xs text-gray-700 mb-3">Click the box on the left to upload a clear front-facing photo (full/half body).</p>
                  <div className="text-xs text-gray-600">Tip: Stand in good light, remove hats & sunglasses.</div>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div>
              <button
                onClick={() => step1Done && setOpenPanel(2)}
                className={`w-full flex items-center justify-between px-4 py-3 border-2 ${step1Done ? "border-black bg-white" : "border-zinc-200 bg-zinc-50 cursor-not-allowed"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center">
                    {step2Done ? <CheckCircle className="w-5 h-5 text-green-600" /> : step1Done ? <Ruler className="w-5 h-5" /> : <Lock className="w-5 h-5 text-zinc-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">Step 2</div>
                    <div className="text-sm font-bold">Select Size</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{step2Done ? selectedSize : step1Done ? "Choose" : "Locked"}</div>
              </button>

              {openPanel === 2 && step1Done && (
                <div className="border-l-2 border-black pl-4 mt-3">
                  <p className="text-xs text-gray-700 mb-3">Choose the size you normally wear. If unsure, pick the size you usually order.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSelectedSize(s.label)}
                        className={`py-3 border-2 text-sm font-bold ${selectedSize === s.label ? "bg-black text-white" : "bg-white border-zinc-200 text-gray-500 hover:border-black hover:text-black"}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {selectedSize && <p className="text-xs mt-2 text-gray-600">Selected: {selectedSize} — {SIZES.find(x => x.label === selectedSize).desc}</p>}
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div>
              <button
                onClick={() => step2Done && setOpenPanel(3)}
                className={`w-full flex items-center justify-between px-4 py-3 border-2 ${step2Done ? "border-black bg-white" : "border-zinc-200 bg-zinc-50 cursor-not-allowed"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center">
                    {step3Done ? <CheckCircle className="w-5 h-5 text-green-600" /> : step2Done ? <MapPin className="w-5 h-5" /> : <Lock className="w-5 h-5 text-zinc-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">Step 3</div>
                    <div className="text-sm font-bold">Pick Scene</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{step3Done ? SCENES.find(s => s.id === selectedScene)?.label : step2Done ? "Choose" : "Locked"}</div>
              </button>

              {openPanel === 3 && step2Done && (
                <div className="border-l-2 border-black pl-4 mt-3">
                  <p className="text-xs text-gray-700 mb-3">Select a background mood for your try-on. This only affects background & lighting style.</p>
                  <div className="space-y-2">
                    {SCENES.map((scene) => (
                      <button
                        key={scene.id}
                        onClick={() => setSelectedScene(scene.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 border-2 text-xs font-bold ${selectedScene === scene.id ? "bg-black text-white" : "bg-white text-gray-500 border-zinc-200 hover:border-black hover:text-black"}`}
                      >
                        {scene.icon}
                        <span>{scene.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div>
              <button
                onClick={() => step3Done && setOpenPanel(4)}
                className={`w-full flex items-center justify-between px-4 py-3 border-2 ${step3Done ? "border-black bg-white" : "border-zinc-200 bg-zinc-50 cursor-not-allowed"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center">
                    {step4Done ? <CheckCircle className="w-5 h-5 text-green-600" /> : step3Done ? <Sparkles className="w-5 h-5" /> : <Lock className="w-5 h-5 text-zinc-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">Step 4</div>
                    <div className="text-sm font-bold">Agree & Generate</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{step4Done ? "Agreed" : step3Done ? "Pending" : "Locked"}</div>
              </button>

              {openPanel === 4 && step3Done && (
                <div className="border-l-2 border-black pl-4 mt-3">
                  <p className="text-xs text-gray-700 mb-3">You must agree to the AI usage terms before generating the try-on image.</p>

                  <div className="flex items-start gap-3">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="consent" className="text-xs text-gray-700">
                      I consent to my photo being processed to create a try-on preview. I confirm this is my photo and not AI-generated.
                    </label>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !agreed}
                    className={`mt-4 w-full py-3 border-2 border-black text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 ${!agreed ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-black hover:text-white"}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> {loadingStep || "Processing..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate Fit
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="lg:col-span-6 bg-zinc-50 flex items-center justify-center p-6 relative">
          {resultImage ? (
            <>
              <button onClick={handleDownload} className="absolute top-6 right-6 border-2 bg-white border-black px-4 py-2 text-xs font-black uppercase hover:bg-black hover:text-white">
                <Download className="w-4 h-4 inline-block mr-1" /> Download
              </button>

              <img src={resultImage} className="border-2 border-black shadow-xl max-h-[80vh] object-contain" alt="Generated tryon" />
            </>
          ) : (
            <div className="text-center opacity-70">
              <img src={Array.isArray(product.image) ? product.image[0] : product.image} className="max-h-[40vh] mx-auto mb-6" alt="product" />
              <h2 className="text-3xl font-black">{product.name}</h2>
              <p className="font-mono text-lg mt-2">₹{product.price}</p>
              <p className="text-xs uppercase tracking-widest mt-4 text-gray-500">Ready for Virtual Try-On</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOn;
