import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
import { ArrowRight, ScanLine, MoveRight, Sparkles } from "lucide-react";

// --- Curated Images for the 3D Cylinder (Doubled for Size) 
const baseImages = [
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534030347209-7147fd9e7b1a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507680434567-5739c8a95585?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1624457925392-12ee5b3a0706?q=80&w=600&auto=format&fit=crop",
];
const cylinderImages = [...baseImages, ...baseImages];

// --- 3D Cylinder Component ---
const Cylinder3D = () => {
  const cardCount = cylinderImages.length;
  const cardWidth = 132; 
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / cardCount)) + 10; 

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-container overflow-visible">
      {/* LAYER 1: The Boost */}
      <div className="relative preserve-3d animate-boost">
        {/* LAYER 2: The Steady Flow */}
        <div className="relative preserve-3d animate-flow cursor-grab active:cursor-grabbing">
          <div className="relative preserve-3d" style={{ width: cardWidth, height: 198 }}> 
            {cylinderImages.map((src, i) => {
              const angle = (i / cardCount) * 360;
              return (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-900 backface-visible"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <img 
                    src={src} 
                    alt={`Look ${i}`} 
                    className="w-full h-full object-cover pointer-events-none opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/40 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-80px] w-[300px] h-16 bg-black/40 blur-3xl rounded-[100%] pointer-events-none" />
    </div>
  );
};

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#f4f4f5] text-[#1a1a1a] overflow-hidden flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Oswald:wght@400;500;700&display=swap');
          .font-oswald { font-family: 'Oswald', sans-serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .perspective-container { perspective: 2000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-visible { backface-visibility: hidden; }
          
          @keyframes boostRotate { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(-720deg); } }
          .animate-boost { animation: boostRotate 3s cubic-bezier(0.1, 0.6, 0.2, 1) forwards; }

          @keyframes flowRotate { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(-360deg); } }
          .animate-flow { animation: flowRotate 30s linear infinite; }
          .animate-flow:hover { animation-play-state: paused; }

          .reveal-text { clip-path: inset(0 0 100% 0); animation: revealUp 1s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
          @keyframes revealUp { 0% { clip-path: inset(100% 0 0 0); transform: translateY(20px); opacity: 0; } 100% { clip-path: inset(0 0 0 0); transform: translateY(0); opacity: 1; } }
          
          .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"); }
        `}
      </style>

      <div className="absolute inset-0 pointer-events-none z-50 bg-noise opacity-30 mix-blend-multiply fixed" />

      {/* --- Left Side: Content --- */}
      <div 
        className={`
          relative z-20 flex flex-col justify-center px-6 sm:px-16 lg:pl-24 lg:pr-8 pt-4 lg:pt-0 shrink-0 bg-white lg:bg-transparent shadow-xl lg:shadow-none overflow-hidden
          transition-all duration-[1500ms] cubic-bezier(0.22, 1, 0.36, 1)
          /* RESPONSIVE TRANSITION: 
             - Mobile: Animates HEIGHT (0 -> 40%)
             - Desktop: Animates WIDTH (0 -> 50%) 
          */
          ${introComplete 
            ? "h-[40%] w-full lg:h-full lg:w-[50%] opacity-100" 
            : "h-0 w-full lg:h-full lg:w-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="min-w-[300px] w-full">
          <div className="flex items-center gap-4 mb-2 sm:mb-4 lg:mb-8 overflow-hidden">
             <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-manrope tracking-[0.2em] uppercase text-gray-500 ${introComplete ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                <span>AI Power</span>
                <MoveRight size={12} className="text-gray-400" />
                <span>Scan</span>
                <MoveRight size={12} className="text-gray-400" />
                <span className="text-black font-bold">Transform</span>
             </div>
          </div>

          <div className="flex flex-col gap-0 lg:gap-1 font-oswald uppercase leading-[0.9] tracking-tighter mb-4 sm:mb-6 lg:mb-10">
             <div className="overflow-hidden">
               <h1 className={`text-5xl sm:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold text-black ${introComplete ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
                 Virtual
               </h1>
             </div>
             <div className="overflow-hidden flex items-baseline gap-2 lg:gap-4">
               <h1 className={`text-5xl sm:text-6xl lg:text-[5rem] xl:text-[6rem] text-gray-300 font-bold ${introComplete ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                 Try-On
               </h1>
             </div>
             <div className="overflow-hidden">
               <h1 className={`text-5xl sm:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-800 to-gray-400 ${introComplete ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
                 Experience
               </h1>
             </div>
          </div>

          <p className={`font-manrope text-gray-600 text-xs sm:text-sm lg:text-lg max-w-md leading-relaxed mb-4 sm:mb-6 lg:mb-12 hidden sm:block ${introComplete ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }}>
            Don't guess how it fits. See it. Upload your photo and let our AI style you in seconds.
          </p>

          <div className={`flex flex-row items-center gap-4 lg:gap-6 ${introComplete ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '1.3s' }}>
            <a href="/virtual-try-on" className="no-underline">
              <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-black text-white font-manrope font-bold text-[10px] sm:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap rounded-sm">
                 <span className="relative z-10 flex items-center gap-3">
                    Upload Photo <Sparkles size={14} className="group-hover:rotate-90 transition-transform duration-500 sm:w-4 sm:h-4"/>
                 </span>
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* --- Right Side: The 3D Cylinder Animation --- */}
      <div 
        className={`
          relative z-10 bg-black flex items-center justify-center overflow-visible
          transition-all duration-[1500ms] cubic-bezier(0.22, 1, 0.36, 1)
          /* RESPONSIVE TRANSITION:
             - Mobile: Animates HEIGHT (100% -> 60%)
             - Desktop: Animates WIDTH (100% -> 50%)
          */
          ${introComplete 
            ? "h-[60%] w-full lg:h-full lg:w-[50%]" 
            : "h-full w-full lg:h-full lg:w-full"}
        `}
      >
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
         
         <div 
            className={`
              w-full h-full transition-transform duration-[2000ms] ease-out flex items-center justify-center 
              ${introComplete 
                ? "scale-[0.55] sm:scale-[0.7] lg:scale-90" // Smaller scale for mobile so it fits the 60% height
                : "scale-[0.8] lg:scale-100"}
            `}
          >
            <Cylinder3D />
         </div>
      </div>

    </section>
  );
};

export default Hero;
