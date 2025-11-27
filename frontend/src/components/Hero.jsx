import React, { useEffect, useState, useRef, useCallback } from "react";
// import { Link } from "react-router-dom"; 
import { ArrowRight, ScanLine, MoveRight, Sparkles, Shirt } from "lucide-react";

// --- Curated Pairs for "Before vs After" Transformation ---
const imagePairs = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop", // Casual / Base
    after: "https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=1600&auto=format&fit=crop",   // Styled / Coat
    label: "Formal Fit"
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=1600&auto=format&fit=crop", // Hoodie
    after: "https://images.unsplash.com/photo-1534030347209-7147fd9e7b1a?q=80&w=1600&auto=format&fit=crop",   // Denim Jacket
    label: "Street Style"
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop", // Portrait
    after: "https://images.unsplash.com/photo-1507680434567-5739c8a95585?q=80&w=1600&auto=format&fit=crop",   // Suit
    label: "Evening Wear"
  },
];

// --- The Before/After Slider Component ---
const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const directionRef = useRef(1); // 1 for right, -1 for left

  // --- 1. Auto-Drag Animation Logic ---
  useEffect(() => {
    const animate = () => {
      if (!isHovering) {
        setSliderPosition((prev) => {
          let next = prev + 0.4 * directionRef.current; // Speed of auto-drag
          if (next >= 80) directionRef.current = -1;
          if (next <= 20) directionRef.current = 1;
          return next;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isHovering]);

  // --- 2. Auto-Replace Image Logic ---
  useEffect(() => {
    const imageInterval = setInterval(() => {
      if (!isHovering) { // Only swap if user isn't actively inspecting
        setActivePairIndex((prev) => (prev + 1) % imagePairs.length);
      }
    }, 4000); // Swap images every 4 seconds
    return () => clearInterval(imageInterval);
  }, [isHovering]);

  // --- 3. Interaction Handlers ---
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    setIsHovering(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;
    setIsHovering(true);
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleLeave = () => setIsHovering(false);

  const currentPair = imagePairs[activePairIndex];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-col-resize group bg-gray-100"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
    >
      {/* --- Layer 1: The "After" Image (Right Side) --- */}
      <div className="absolute inset-0">
        <img 
          src={currentPair.after} 
          alt="After Try-On" 
          className="w-full h-full object-cover object-top transition-opacity duration-700"
        />
        {/* Label Tag - Right */}
        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border border-white/20 z-10">
          Virtual Fit
        </div>
      </div>

      {/* --- Layer 2: The "Before" Image (Left Side - Clipped) --- */}
      <div 
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
        }}
      >
        <img 
          src={currentPair.before} 
          alt="Original" 
          className="w-full h-full object-cover object-top transition-opacity duration-700" 
        />
        {/* Label Tag - Left */}
        <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md text-black px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border border-black/10 z-10">
          Original
        </div>
      </div>

      {/* --- Layer 3: The Drag Line & Differentiator --- */}
      <div 
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-30"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* The "Try On" Circle Button/Handle - Significantly Reduced Size */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl border border-white/50 backdrop-blur-sm">
           <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center animate-spin-slow">
              <Shirt size={10} className="text-white" />
           </div>
           {/* Text Ring (Thinner) */}
           <div className="absolute inset-0 rounded-full border border-dashed border-gray-400 animate-spin-reverse-slow" />
        </div>

        {/* Vertical Drag Indicators - Very Minimal */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-md">
          <MoveRight size={8} className="text-white rotate-180" />
        </div>
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-md">
          <MoveRight size={8} className="text-white" />
        </div>
      </div>

      {/* --- Overlay: Loading State / Transition Flash --- */}
      <div className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-300" />

    </div>
  );
};

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#f4f4f5] text-[#1a1a1a] overflow-hidden flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white">
      
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Oswald:wght@400;500;700&display=swap');
          .font-oswald { font-family: 'Oswald', sans-serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
          .reveal-text { clip-path: inset(0 0 100% 0); animation: revealUp 1s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
          @keyframes revealUp { 0% { clip-path: inset(100% 0 0 0); transform: translateY(20px); opacity: 0; } 100% { clip-path: inset(0 0 0 0); transform: translateY(0); opacity: 1; } }
          
          .animate-spin-slow { animation: spin 10s linear infinite; }
          .animate-spin-reverse-slow { animation: spin 15s linear infinite reverse; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}
      </style>

      <div className="absolute inset-0 pointer-events-none z-50 bg-noise opacity-30 mix-blend-multiply fixed" />

      {/* --- Left Side: Content --- */}
      <div className="w-full h-[40%] lg:h-full lg:w-[40%] relative z-20 flex flex-col justify-center px-6 sm:px-16 lg:pl-24 lg:pr-4 pt-4 lg:pt-0 shrink-0 bg-white lg:bg-transparent">
        
        <div className="flex items-center gap-4 mb-2 lg:mb-8 overflow-hidden">
           <div className={`flex items-center gap-2 text-[10px] sm:text-sm font-manrope tracking-[0.2em] uppercase text-gray-500 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <span>AI Power</span>
              <MoveRight size={10} className="sm:w-3 sm:h-3" />
              <span>Scan</span>
              <MoveRight size={10} className="sm:w-3 sm:h-3" />
              <span className="text-black font-semibold">Transform</span>
           </div>
        </div>

        <div className="flex flex-col gap-0 lg:gap-2 font-oswald uppercase leading-[0.9] tracking-tight mb-4 lg:mb-8">
           <div className="overflow-hidden">
             <h1 className={`text-4xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold text-black ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
               Virtual
             </h1>
           </div>
           <div className="overflow-hidden flex items-baseline gap-2 lg:gap-4">
             <h1 className={`text-4xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] text-gray-300 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
               Try-On
             </h1>
           </div>
           <div className="overflow-hidden">
             <h1 className={`text-4xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-800 to-gray-400 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
               Experience
             </h1>
           </div>
        </div>

        <p className={`font-manrope text-gray-600 text-xs sm:text-lg max-w-md leading-relaxed mb-4 lg:mb-10 hidden sm:block ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          Don't guess how it fits. See it. Upload your photo and let our AI style you in seconds.
        </p>

        <p className={`font-manrope text-gray-600 text-xs max-w-xs leading-relaxed mb-4 sm:hidden ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          Instant AI fitting room. Slide to see the transformation.
        </p>

        <div className={`flex flex-row items-center gap-4 lg:gap-6 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <a href="/virtual-try-on" className="no-underline">
            <button className="group relative px-6 py-3 lg:px-8 lg:py-4 bg-black text-white font-manrope font-bold text-[10px] sm:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap rounded-sm">
               <span className="relative z-10 flex items-center gap-2">
                  Upload Photo <Sparkles size={14} className="group-hover:rotate-90 transition-transform duration-500"/>
               </span>
            </button>
          </a>
        </div>
      </div>

      {/* --- Right Side: The Interactive Slider --- */}
      <div className="w-full h-[60%] lg:h-full lg:w-[60%] relative z-10 bg-gray-200 flex items-center justify-center overflow-hidden">
         <BeforeAfterSlider />
      </div>

    </section>
  );
};

export default Hero;