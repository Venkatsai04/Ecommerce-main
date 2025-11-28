import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import router hooks
import { Upload, Loader2, Sparkles, AlertCircle, X, Ruler, MapPin, Coffee, Building2, User, Lock, Briefcase, Download } from 'lucide-react';

// --- API Configuration ---
const apiKey = "AIzaSyCMcq20bgJU0KAw4t_7E7WQW7-61QBQWT8"; // Keep your API Key here

// --- SCENES CONSTANT (Kept the same) ---
const SCENES = [
  { id: 'original', label: 'Studio Grey', icon: <User className="w-4 h-4" />, prompt: "Keep a simple, high-end clean grey studio background. Professional lighting." },
  { id: 'office', label: 'Modern Office', icon: <Briefcase className="w-4 h-4" />, prompt: "Place the man in a high-end, glass-walled executive office with city views. Professional, corporate atmosphere." },
  { id: 'nyc', label: 'Urban Night', icon: <Building2 className="w-4 h-4" />, prompt: "Place the man on a city street at night (NYC style). Bokeh city lights, sleek urban atmosphere, dramatic lighting." },
  { id: 'cafe', label: 'Business Lunch', icon: <Coffee className="w-4 h-4" />, prompt: "Place the man in an upscale restaurant or cafe setting during the day. Sophisticated casual business vibe." },
  { id: 'auto', label: 'Auto-Match', icon: <Sparkles className="w-4 h-4" />, prompt: "Detect the formality of the suit and place the man in the most appropriate setting." }
];

const SIZES = [
  { label: 'S', desc: '38 (Small) - Slim Fit' },
  { label: 'M', desc: '40 (Medium) - Regular Fit' },
  { label: 'L', desc: '42 (Large) - Comfort Fit' },
  { label: 'XL', desc: '44 (X-Large) - Relaxed Fit' },
  { label: 'XXL', desc: '46 (2X-Large) - Broad Fit' }
];

// --- Helpers ---
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result.toString();
      resolve({
        full: base64Data,
        raw: base64Data.split(',')[1],
        mime: file.type
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return fileToBase64(blob);
};

const TryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. GET PRODUCT FROM NAVIGATION STATE
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

  // 2. LOAD PRODUCT IMAGE ON MOUNT
  useEffect(() => {
    if (!product) {
      // If user comes here directly without clicking a product, send them back
      navigate('/collection'); 
      return;
    }

    const loadProduct = async () => {
      try {
        const base64 = await urlToBase64(product.image);
        setGarmentImage(base64);
      } catch (e) {
        setError("Failed to load product image.");
      }
    };
    loadProduct();
  }, [product, navigate]);

  const handleUserUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload valid image files (JPG, PNG).');
      return;
    }
    try {
      const base64Obj = await fileToBase64(file);
      setUserImage(base64Obj);
      setError(null); 
    } catch (err) {
      setError('Failed to process image.');
    }
  };

  const validateGender = async () => {
    // ... (Keep your exact gender validation code here) ...
    // For brevity, I am assuming the exact same logic you pasted before
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`,
        {
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
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase();
    } catch (e) {
      return 'unknown'; 
    }
  };

  const handleGenerate = async () => {
    if (!userImage || !garmentImage) {
      setError('Please upload your photo.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      setLoadingStep('Analysing Subject...');
      const detectedGender = await validateGender();
      
      if (detectedGender === 'female') {
        throw new Error("Gender Mismatch: This item is designed for Men. Please upload a photo of a male subject.");
      }

      setLoadingStep('Tailoring Suit...');
      let fitDescription = "Regular Fit";
      if (['S', 'M'].includes(selectedSize)) fitDescription = "Slim, sharp tailored fit";
      if (['XL', 'XXL'].includes(selectedSize)) fitDescription = "Broad, relaxed comfort fit";
      
      const scenePrompt = SCENES.find(s => s.id === selectedScene)?.prompt || SCENES[0].prompt;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: `Act as a high-end menswear stylist AI.
                  GOAL: Generate a photorealistic image of the Man wearing the garment shown in the second image.
                  
                  CONFIG:
                  - Garment Name: ${product.name}
                  - Size: EU ${selectedSize} (${fitDescription})
                  - Scene: ${scenePrompt}
                  
                  INSTRUCTIONS:
                  1. Replace the man's current outfit with the ${product.name}.
                  2. Ensure the fit is realistic based on the size description.
                  3. Relight the subject to match the selected scene.
                  4. Keep the man's identity, hair, and facial features EXACTLY the same.
                  5. Maintain a high-fashion, premium look.
                  `
                },
                { inlineData: { mimeType: userImage.mime, data: userImage.raw } },
                { inlineData: { mimeType: garmentImage.mime, data: garmentImage.raw } }
              ]
            }],
            generationConfig: {
              responseModalities: ["IMAGE"],
              temperature: 0.4,
              topK: 32,
              topP: 0.95, 
            }
          })
        }
      );

      if (!response.ok) throw new Error('Generation failed');
      const result = await response.json();
      const base64Image = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

      if (base64Image) {
        setResultImage(`data:image/png;base64,${base64Image}`);
      } else {
        throw new Error("The model could not generate the image. Please try a different photo.");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // If no product is loaded yet (or redirecting), return nothing
  if (!product) return null;

  return (
    <div className="max-w-[1920px] mx-auto bg-white min-h-screen text-zinc-900 font-sans border-t-4 border-black box-border">
      
      {/* Error Banner */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 p-4 bg-red-50 border-2 border-red-900 flex items-start gap-4 text-red-900 shadow-xl max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold uppercase text-xs tracking-wider mb-1">Error</h4>
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="hover:text-black"><X className="w-5 h-5"/></button>
        </div>
      )}

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen border-x-0 lg:border-x-4 border-b-4 border-black">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-3 border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black p-6 space-y-8 bg-white">
          
          {/* Garment Section (DYNAMIC DATA) */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
               <div className="w-2 h-2 bg-black"></div>
               Selected Garment
             </h3>
             <div className="bg-white border-2 border-black aspect-[3/4] p-4 flex items-center justify-center relative">
                {garmentImage ? (
                  <img src={garmentImage.full} alt="Product" className="max-h-full max-w-full object-contain" />
                ) : (
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                )}
                <div className="absolute top-0 right-0 p-1.5 bg-black text-white">
                  <Lock className="w-3 h-3" />
                </div>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-wide text-black border-b-2 border-black pb-1 inline-block">
                    {product.name}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">
                   {/* Format price if needed, assuming product.price is a number */}
                   {typeof product.price === 'number' ? `$${product.price}` : product.price}
                </p>
             </div>
          </div>

          {/* User Profile Section (Unchanged) */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
               <div className="w-2 h-2 bg-black"></div>
               Your Profile
             </h3>
             <div 
               onClick={() => userFileInputRef.current?.click()}
               className="bg-zinc-50 border-2 border-black border-dashed hover:bg-black hover:border-black group aspect-[3/4] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-4 relative"
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
                   <img src={userImage.full} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                   <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-transparent">
                     <span className="text-black text-xs uppercase tracking-widest font-bold border-b-2 border-black">Change Photo</span>
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
          </div>

        </div>

        {/* Center Col: Configuration (Unchanged logic, just UI structure) */}
        <div className="lg:col-span-3 border-r-0 lg:border-r-4 border-b-4 lg:border-b-0 border-black p-6 flex flex-col bg-white">
           {/* ... Sizing and Scenery code remains exactly as provided in your previous snippet ... */}
           <div className="flex-1 space-y-12">
            {/* Sizing */}
            <div className="space-y-4">
               <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-black">Size (IND)</h3>
                  <Ruler className="w-4 h-4 text-black" />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`py-3 text-sm font-bold border-2 transition-all rounded-none ${selectedSize === size.label ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black'}`}
                    >
                      {size.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* Scenery */}
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
                      className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all text-left border-2 ${selectedScene === scene.id ? 'bg-black border-black text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:border-black hover:text-black'}`}
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
              className={`w-full py-6 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 border-black ${loading ? 'bg-white text-black cursor-wait' : !userImage ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed' : 'bg-black text-white hover:bg-white hover:text-black'}`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Processing...' : 'Generate Fit'}
            </button>
          </div>
        </div>

        {/* Right Col: Result (Unchanged) */}
        <div className="lg:col-span-6 bg-zinc-50 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
           <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           
           {resultImage && (
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `try-on-result.png`;
                    link.click();
                  }}
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
                   <h2 className="text-lg font-black uppercase tracking-widest">{loadingStep}</h2>
                   <p className="text-xs text-zinc-500 font-mono mt-2">AI_MODEL_V2.5::PROCESSING</p>
                 </div>
               </div>
             ) : resultImage ? (
               <div className="relative border-2 border-black bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-full max-w-full">
                 <img src={resultImage} alt="Generated Try-On" className="max-h-[80vh] object-contain" />
               </div>
             ) : (
               <div className="text-center max-w-md opacity-40">
                 <h3 className="text-4xl font-black text-black mb-4 tracking-tighter">VIRTUAL STUDIO</h3>
                 <p className="text-sm font-bold text-black font-mono uppercase">Waiting for input signal...</p>
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default TryOn;