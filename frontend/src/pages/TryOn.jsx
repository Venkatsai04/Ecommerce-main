import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Upload, Loader2, Sparkles, 
  Download, ArrowLeft, X, 
  Ruler, MapPin, Briefcase, Coffee, Building2, User, AlertCircle
} from 'lucide-react';

// --- API Configuration ---
const API_MODEL = "gemini-2.5-flash-image-preview";
const apiKey = import.meta.env.VITE_API_KEY; // <--- PASTE YOUR API KEY HERE

// --- SCENES CONSTANT ---
const SCENES = [
  { 
    id: 'original', 
    label: 'Studio Grey', 
    icon: <User className="w-4 h-4" />,
    prompt: "Keep a simple, high-end clean grey studio background. Professional lighting." 
  },
  { 
    id: 'wedding', 
    label: 'Grand Wedding', 
    icon: <Sparkles className="w-4 h-4" />,
    prompt: "Place the man in a luxurious Indian wedding venue with floral decorations, marigolds, and warm festive lighting." 
  },
  { 
    id: 'office', 
    label: 'Modern Office', 
    icon: <Briefcase className="w-4 h-4" />,
    prompt: "Place the man in a high-end, glass-walled executive office with city views. Professional, corporate atmosphere." 
  },
  { 
    id: 'nyc', 
    label: 'Urban Night', 
    icon: <Building2 className="w-4 h-4" />,
    prompt: "Place the man on a city street at night (NYC style). Bokeh city lights, sleek urban atmosphere, dramatic lighting." 
  },
  { 
    id: 'cafe', 
    label: 'Business Lunch', 
    icon: <Coffee className="w-4 h-4" />,
    prompt: "Place the man in an upscale restaurant or cafe setting during the day. Sophisticated casual business vibe." 
  }
];

const SIZES = [
  { label: 'S', desc: '38 (Small) - Slim Fit' },
  { label: 'M', desc: '40 (Medium) - Regular Fit' },
  { label: 'L', desc: '42 (Large) - Comfort Fit' },
  { label: 'XL', desc: '44 (X-Large) - Relaxed Fit' },
  { label: 'XXL', desc: '46 (2X-Large) - Broad Fit' }
];

// --- HELPER FUNCTIONS ---
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve({
        full: reader.result.toString(),
        raw: reader.result.toString().split(',')[1],
        mime: blob.type
      });
    });
  } catch (e) {
    console.warn("CORS Error on image load", e);
    return null;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({
      full: reader.result.toString(),
      raw: reader.result.toString().split(',')[1],
      mime: file.type
    });
  });
};

const fetchWithBackoff = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            if (response.status === 404) throw new Error("API Model Not Found. Check API Key/Model Name.");
            if (response.status >= 400 && response.status < 500) throw new Error(`Client Error ${response.status}`);
            throw new Error(`Server Error ${response.status}`);
        } catch (error) {
            if (i === maxRetries - 1) throw error; 
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

const TryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Get Product from Navigation State
  const product = location.state?.product;

  const [userImage, setUserImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedScene, setSelectedScene] = useState('original');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const userFileInputRef = useRef(null);

  // 2. Redirect if no product found (direct access protection)
  useEffect(() => {
    if (!product) {
        navigate('/'); // Go back home if someone tries to access /try-on directly
    }
  }, [product, navigate]);

  // 3. Load the product image passed from previous page
  useEffect(() => {
    const loadProduct = async () => {
      if (!product?.image) return;
      try {
        const base64 = await urlToBase64(product.image);
        if(base64) setGarmentImage(base64);
        else throw new Error("Image Load Error");
      } catch (e) {
        setError("Failed to load product image. CORS or Network issue.");
      }
    };
    loadProduct();
  }, [product]);

  const handleUserUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64Obj = await fileToBase64(file);
      setUserImage(base64Obj);
      setError(null); 
    } catch (err) {
      setError('Failed to process image.');
    }
  };

  const handleDemoLoad = async () => {
    setLoading(true);
    setLoadingStep('Loading demo...');
    try {
        const demoUrl = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800";
        const base64 = await urlToBase64(demoUrl);
        if(base64) setUserImage(base64);
        else throw new Error("Demo Load Failed");
        setError(null);
    } catch (e) {
        setError("Failed to load demo image.");
    } finally {
        setLoading(false);
        setLoadingStep('');
    }
  };

  const validateGender = async () => {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Look at this image. Is the primary subject 'Male' or 'Female'? Answer with exactly one word: 'Male' or 'Female'." },
                        { inlineData: { mimeType: userImage.mime, data: userImage.raw } }
                    ]
                }],
                generationConfig: { maxOutputTokens: 10, temperature: 0 }
            })
        };
        
        const response = await fetchWithBackoff(url, options);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase();
    } catch (e) {
        console.warn("Gender check skipped due to error", e);
        return null;
    }
  };

  const handleGenerate = async () => {
    if (!userImage || !garmentImage) {
      setError('Please upload your photo.');
      return;
    }

    if (!apiKey) {
      setError("API Key is missing.");
      return;
    }

    setLoading(true);
    setLoadingStep('Initializing...');
    setError(null);

    try {
      setLoadingStep('Scanning Subject...');
      const detectedGender = await validateGender();
      if (detectedGender && detectedGender.includes('female')) {
        throw new Error("This collection is designed for Men's tailoring. Please upload a photo of a male subject.");
      }

      setLoadingStep('Tailoring Fit...');
      let fitDescription = "Regular Fit";
      if (['S', 'M'].includes(selectedSize)) fitDescription = "Slim, sharp tailored fit";
      if (['L', 'XL', 'XXL'].includes(selectedSize)) fitDescription = "Broad, relaxed comfort fit";
      
      const scenePrompt = SCENES.find(s => s.id === selectedScene)?.prompt;
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${apiKey}`;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: `Act as a high-end menswear stylist.
                  GOAL: Generate a photorealistic image of the Man wearing the Outfit.
                  CONFIG: Size ${selectedSize} (${fitDescription}), Scene: ${scenePrompt}.
                  INSTRUCTIONS: Replace outfit, ensure realistic fit, match lighting to scene, preserve face exactly.
                  DO NOT ADD TEXT OVERLAYS OR WATERMARKS.`
                },
                { inlineData: { mimeType: userImage.mime, data: userImage.raw } },
                { inlineData: { mimeType: garmentImage.mime, data: garmentImage.raw } }
              ]
            }],
            generationConfig: { responseModalities: ["IMAGE"], temperature: 0.4 }
        })
      };
      
      const response = await fetchWithBackoff(url, options);
      const result = await response.json();
      
      const base64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (base64) setResultImage(`data:image/png;base64,${base64}`);
      else throw new Error("The AI could not generate the image. Try a different photo or setting.");
      
    } catch (err) {
      setError(err.message || "Failed to generate fit. Please check your image and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent render if product isn't loaded yet
  if (!product) return null;

  return (
    <div className="max-w-[1920px] mx-auto bg-white min-h-screen text-zinc-900 font-sans border-t-4 border-black box-border overflow-y-auto">
      
      {/* Error Banner */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 bg-red-50 border-2 border-red-900 flex items-start gap-4 text-red-900 shadow-xl max-w-2xl mx-auto animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold uppercase text-xs tracking-wider mb-1">System Error</h4>
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)}><X className="w-5 h-5"/></button>
        </div>
      )}

      {/* Brutalist Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen border-x-0 lg:border-x-4 border-b-4 border-black">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-3 border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black p-6 space-y-8 bg-white flex flex-col">
          
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline mb-4">
             <ArrowLeft className="w-4 h-4" /> Back to Product
          </button>

          {/* Locked Garment View - Sidebar */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2"><div className="w-2 h-2 bg-black"></div>The Garment</h3>
             <div className="bg-white border-2 border-black aspect-[3/4] p-4 flex items-center justify-center relative">
                {garmentImage ? <img src={garmentImage.full} className="max-h-full max-w-full object-contain" alt="item" /> : <Loader2 className="animate-spin"/>}
                <div className="absolute top-0 right-0 p-1.5 bg-black text-white">
                  <span className="text-[8px] font-bold">LOCKED</span> 
                </div>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-wide text-black border-b-2 border-black pb-1 inline-block">{product.name}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">
                   {/* Handle currency formatting based on your passed prop */}
                   {typeof product.price === 'number' 
                      ? `₹${product.price.toLocaleString()}` 
                      : product.price}
                </p>
             </div>
          </div>

          <div className="space-y-4 mt-auto">
             <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2"><div className="w-2 h-2 bg-black"></div>Your Profile</h3>
             <div 
               onClick={() => userFileInputRef.current?.click()} 
               className="bg-zinc-50 border-2 border-black border-dashed hover:bg-black hover:border-black group aspect-[3/4] cursor-pointer transition-all flex flex-col items-center justify-center p-4 relative"
             >
               <input type="file" ref={userFileInputRef} onChange={handleUserUpload} className="hidden" accept="image/*" />
               {userImage ? (
                 <>
                   <img src={userImage.full} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="user" />
                   <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-transparent"><span className="text-black text-xs uppercase tracking-widest font-bold border-b-2 border-black">Change</span></div>
                 </>
               ) : (
                 <div className="text-center space-y-4 group-hover:invert transition-all">
                   <div className="w-12 h-12 border-2 border-black flex items-center justify-center mx-auto rounded-none"><Upload className="w-5 h-5 text-black" /></div>
                   <div className="space-y-1"><p className="text-xs font-bold uppercase tracking-widest text-black">Upload</p><p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Men Only</p></div>
                 </div>
               )}
             </div>
             <button
                onClick={handleDemoLoad}
                disabled={loading}
                className={`w-full py-3 text-xs font-black uppercase tracking-widest border-2 transition-all ${loading ? 'bg-zinc-100 text-zinc-400 border-zinc-200' : 'bg-white border-black text-black hover:bg-black hover:text-white'}`}
             >
                Try Demo Model
             </button>
          </div>
        </div>

        {/* Center Col: Configuration */}
        <div className="lg:col-span-3 border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black p-6 flex flex-col bg-white">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
               <div className="flex items-center justify-between border-b-2 border-black pb-2"><h3 className="text-xs font-black uppercase tracking-widest text-black">Size (IND)</h3><Ruler className="w-4 h-4 text-black" /></div>
               <div className="grid grid-cols-2 gap-2">
                  {SIZES.map((size) => (
                    <button key={size.label} onClick={() => setSelectedSize(size.label)} className={`py-3 text-sm font-bold border-2 transition-all rounded-none ${selectedSize === size.label ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black'}`}>{size.label}</button>
                  ))}
               </div>
               <p className="text-xs font-medium text-black bg-zinc-100 p-2 border border-zinc-200">
                 Fit: {SIZES.find(s => s.label === selectedSize)?.desc}
               </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between border-b-2 border-black pb-2"><h3 className="text-xs font-black uppercase tracking-widest text-black">Atmosphere</h3><MapPin className="w-4 h-4 text-black" /></div>
               <div className="space-y-2">
                  {SCENES.map((scene) => (
                    <button key={scene.id} onClick={() => setSelectedScene(scene.id)} className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all text-left border-2 ${selectedScene === scene.id ? 'bg-black border-black text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:border-black hover:text-black'}`}>{scene.icon}<span>{scene.label}</span></button>
                  ))}
               </div>
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <button onClick={handleGenerate} disabled={loading || !userImage} className={`w-full py-6 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 border-black ${loading ? 'bg-white text-black cursor-wait' : !userImage ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed' : 'bg-black text-white hover:bg-white hover:text-black'}`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? `${loadingStep || 'Processing...'}` : 'Generate Fit'}
            </button>
          </div>
        </div>

        {/* Right Col: Result / Preview Area */}
        <div className="lg:col-span-6 bg-zinc-50 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
           <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           {resultImage && (
              <div className="absolute top-6 right-6 z-10">
                <button onClick={() => { const link = document.createElement('a'); link.href = resultImage; link.download = `try-on-result.png`; link.click(); }} className="bg-white border-2 border-black text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"><Download className="w-3 h-3" /> Download</button>
              </div>
           )}

           <div className="w-full h-full p-8 flex items-center justify-center">
              {loading ? (
                <div className="text-center space-y-6 bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="w-16 h-16 border-4 border-black border-t-zinc-200 animate-spin rounded-full mx-auto"></div>
                  <div><h2 className="text-lg font-black uppercase tracking-widest">{loadingStep || 'Processing...'}</h2><p className="text-xs text-zinc-500 font-mono mt-2">AI_MODEL_V2.5::PROCESSING</p></div>
                </div>
              ) : resultImage ? (
                <div className="relative border-2 border-black bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-full max-w-full"><img src={resultImage} alt="Generated Try-On" className="max-h-[80vh] object-contain" /></div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    {product.image && (
                      <img 
                          src={product.image} 
                          alt="Selected Preview" 
                          className="max-h-[50vh] object-contain mb-8 mix-blend-multiply drop-shadow-2xl" 
                      />
                    )}
                    <h3 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase max-w-lg leading-none">
                        {product.name}
                    </h3>
                    <div className="bg-black text-white px-4 py-2 text-xl font-bold font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        {typeof product.price === 'number' 
                          ? `₹${product.price.toLocaleString()}` 
                          : product.price}
                    </div>
                    <p className="text-xs font-bold text-zinc-400 font-mono uppercase mt-6 tracking-widest">
                        Ready for Virtual Try-On
                    </p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TryOn;