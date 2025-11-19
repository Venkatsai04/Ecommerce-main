import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
import { ArrowRight, Camera, ScanLine, MoveRight } from "lucide-react";

// --- Single Image Source ---
const singleImage = "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop";

// --- Grid Slots (6 Items - Slant Triangle Layout) ---
const gridSlots = [
  // 1. The Tower (Left Anchor)
  // Mobile: Top Left (2x2) | Desktop: Left Col (4x3) - Tallest
  { id: 1, className: "col-span-2 md:col-span-4 row-span-2 md:row-span-3" }, 

  // 2. The Step Down (Center Top)
  // Mobile: Top Right (2x2) | Desktop: Center Col (4x2) - Medium
  { id: 2, className: "col-span-2 md:col-span-4 row-span-2 md:row-span-2" }, 

  // 3. The Lowest Step (Right Top)
  // Mobile: Middle Left (2x1) | Desktop: Right Col (4x1) - Shortest
  { id: 3, className: "col-span-2 md:col-span-4 row-span-1 md:row-span-1" }, 

  // 4. Right Middle Fill
  // Mobile: Middle Right (2x1) | Desktop: Right Col (4x1)
  { id: 4, className: "col-span-2 md:col-span-4 row-span-1 md:row-span-1" }, 

  // 5. Right Bottom Fill
  // Mobile: Bottom Left (2x1) | Desktop: Right Col (4x1)
  { id: 5, className: "col-span-2 md:col-span-4 row-span-1 md:row-span-1" }, 

  // 6. Center Bottom Fill
  // Mobile: Bottom Right (2x1) | Desktop: Center Col (4x1) - Fills the gap under #2
  { id: 6, className: "col-span-2 md:col-span-4 row-span-1 md:row-span-1" }, 
];

const GridItem = ({ className }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-sm ${className} group transition-all duration-300 hover:scale-[1.005] border border-white/20`}
      style={{
        backgroundImage: `url(${singleImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center', 
      }}
    >
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
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
          .grid-entrance { animation: zoomSettle 2s cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: center center; opacity: 0; }
          @keyframes zoomSettle { 0% { transform: scale(1.15) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        `}
      </style>

      <div className="absolute inset-0 pointer-events-none z-50 bg-noise opacity-30 mix-blend-multiply fixed" />

      {/* --- Top Side: Content --- */}
      <div className="w-full h-[40%] lg:h-full lg:w-[40%] relative z-20 flex flex-col justify-center px-6 sm:px-16 lg:pl-24 lg:pr-4 pt-4 lg:pt-0 shrink-0">
        
        <div className="flex items-center gap-4 mb-2 lg:mb-8 overflow-hidden">
           <div className={`flex items-center gap-2 text-[10px] sm:text-sm font-manrope tracking-[0.2em] uppercase text-gray-500 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <span>Scan</span>
              <MoveRight size={10} className="sm:w-3 sm:h-3" />
              <span>Style</span>
              <MoveRight size={10} className="sm:w-3 sm:h-3" />
              <span className="text-black font-semibold">Fit</span>
           </div>
        </div>

        <div className="flex flex-col gap-0 lg:gap-2 font-oswald uppercase leading-[0.9] tracking-tight mb-4 lg:mb-8">
           <div className="overflow-hidden">
             <h1 className={`text-4xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold text-black ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
               Try It
             </h1>
           </div>
           <div className="overflow-hidden flex items-baseline gap-2 lg:gap-4">
             <h1 className={`text-4xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] text-gray-300 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
               Before
             </h1>
           </div>
           <div className="overflow-hidden">
             <h1 className={`text-4xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-800 to-gray-400 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
               You Wear It.
             </h1>
           </div>
        </div>

        <p className={`font-manrope text-gray-600 text-xs sm:text-lg max-w-md leading-relaxed mb-4 lg:mb-10 hidden sm:block ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          The future of fitting rooms is here. Upload your photo and let our AI tailor the new collection to your exact measurements.
        </p>

        <p className={`font-manrope text-gray-600 text-xs max-w-xs leading-relaxed mb-4 sm:hidden ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          Instant AI fitting room. Upload & see your look.
        </p>

        <div className={`flex flex-row items-center gap-4 lg:gap-6 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <a href="/virtual-try-on" className="no-underline">
            <button className="group relative px-6 py-3 lg:px-8 lg:py-4 bg-black text-white font-manrope font-bold text-[10px] sm:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap rounded-sm">
               <span className="relative z-10 flex items-center gap-2">
                  Start Try-On <ScanLine size={14} className="group-hover:rotate-90 transition-transform duration-500"/>
               </span>
            </button>
          </a>
        </div>
      </div>

      {/* --- Bottom Side: Slant Triangle Grid --- */}
      <div className="w-full h-[60%] lg:h-full lg:w-[60%] relative z-10 bg-white flex items-center justify-center overflow-hidden p-0">
         
         {/* Grid Structure: 4 cols Mobile, 12 cols Desktop. 3 Rows on Desktop to create the steps. */}
         <div className={`w-full h-full max-w-7xl grid grid-cols-4 md:grid-cols-12 grid-rows-4 lg:grid-rows-3 grid-flow-dense gap-0 ${loaded ? 'grid-entrance' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            
            {gridSlots.map((slot) => (
              <GridItem 
                key={slot.id}
                className={slot.className}
              />
            ))}

            <div className="hidden lg:flex col-span-2 row-span-1 items-end justify-end p-2 opacity-20 col-start-11 row-start-3">
               <Camera className="text-black/20 w-12 h-12" />
            </div>
         </div>
         
         <div className="absolute inset-0 bg-gradient-to-r from-[#f4f4f5] via-transparent to-transparent z-20 pointer-events-none hidden lg:block" />
         <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#f4f4f5] to-transparent z-20 pointer-events-none lg:hidden" />
      </div>

    </section>
  );
};

export default Hero;