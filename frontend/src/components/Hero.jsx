import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
import { ArrowRight, Camera, ScanLine, MoveRight } from "lucide-react";

// --- Grid Slots with Colors (Matching Image Layout) ---
// Each object represents a block in the grid, with specific spans
const gridSlots = [
  // Row 1 (Top)
  { id: 1, color: "bg-[#2a2a2a]", className: "col-span-4 md:col-span-3 lg:col-span-3 row-span-1 lg:row-span-2" }, // Top-Left Big
  { id: 2, color: "bg-[#8c8c8c]", className: "col-span-2 md:col-span-2 lg:col-span-2 row-span-1" }, // Top-Mid Small
  { id: 3, color: "bg-[#5e5e5e]", className: "col-span-2 md:col-span-3 lg:col-span-3 row-span-1 lg:row-span-1" }, // Top-Mid-Right Wide
  { id: 4, color: "bg-[#1a1a1a]", className: "col-span-4 md:col-span-2 lg:col-span-4 row-span-1" }, // Top-Right Long

  // Row 2 (or continuing from Row 1 for larger blocks)
  { id: 5, color: "bg-[#6c7a89]", className: "col-span-2 md:col-span-2 lg:col-span-2 row-span-1" }, // Below Top-Mid Small
  { id: 6, color: "bg-[#95a5a6]", className: "col-span-2 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2" }, // Below Top-Mid-Right (Tall)
  { id: 7, color: "bg-[#bdc3c7]", className: "col-span-4 md:col-span-4 lg:col-span-4 row-span-1 lg:row-span-3" }, // Big Vertical (Right of center)

  // Row 3
  { id: 8, color: "bg-[#f39c12]", className: "col-span-2 md:col-span-3 lg:col-span-3 row-span-1 lg:row-span-2" }, // Left-Mid Large
  { id: 9, color: "bg-[#d35400]", className: "col-span-2 md:col-span-2 lg:col-span-2 row-span-1" }, // Below Left-Mid Small
  { id: 10, color: "bg-[#c0392b]", className: "col-span-4 md:col-span-3 lg:col-span-3 row-span-1 lg:row-span-1" }, // Right of Left-Mid Large (Filler)

  // Row 4 (Bottom)
  { id: 11, color: "bg-[#e74c3c]", className: "col-span-4 md:col-span-5 lg:col-span-5 row-span-1" }, // Bottom-Left Wide
  { id: 12, color: "bg-[#9b59b6]", className: "col-span-4 md:col-span-3 lg:col-span-4 row-span-1" }, // Bottom-Right Wide
];

// --- Simplified Grid Item Component (Color Blocks Only) ---
const GridItem = ({ color, className }) => {
  return (
    <div className={`relative overflow-hidden ${color} ${className} group transition-all duration-300 hover:scale-[1.005]`}>
      {/* Optional: label for debugging specific blocks if needed */}
      {/* <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
        <span className="text-white/50 font-manrope text-xs uppercase tracking-widest border border-white/20 px-2 py-1">
            {color.replace('bg-[#', '').replace(']', '')}
        </span>
      </div> */}
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
    <section className="relative w-full min-h-screen bg-[#f4f4f5] text-[#1a1a1a] overflow-hidden flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white">
      
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Oswald:wght@400;500;700&display=swap');
          
          .font-oswald { font-family: 'Oswald', sans-serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          
          .bg-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          }

          .reveal-text {
            clip-path: inset(0 0 100% 0);
            animation: revealUp 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
          }
          
          @keyframes revealUp {
            0% { clip-path: inset(100% 0 0 0); transform: translateY(20px); opacity: 0; }
            100% { clip-path: inset(0 0 0 0); transform: translateY(0); opacity: 1; }
          }

          .grid-entrance {
            animation: zoomSettle 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            transform-origin: center center;
            opacity: 0;
          }
          
          @keyframes zoomSettle {
            0% { transform: scale(1.15) translateY(20px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }

          .hover-line-sweep::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background: currentColor;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
          }
          .hover-line-sweep:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
        `}
      </style>

      <div className="absolute inset-0 pointer-events-none z-50 bg-noise opacity-30 mix-blend-multiply fixed" />

      {/* --- Left Side: Content --- */}
      <div className="w-full lg:w-[40%] relative z-20 flex flex-col justify-center px-8 sm:px-16 lg:pl-24 lg:pr-4 pt-20 lg:pt-0">
        
        <div className="flex items-center gap-4 mb-8 overflow-hidden">
           <div className={`flex items-center gap-2 text-xs sm:text-sm font-manrope tracking-[0.2em] uppercase text-gray-500 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <span>Scan</span>
              <MoveRight size={12} />
              <span>Style</span>
              <MoveRight size={12} />
              <span className="text-black font-semibold">Snapshot Fit</span>
           </div>
        </div>

        <div className="flex flex-col gap-2 font-oswald uppercase leading-[0.9] tracking-tight mb-8">
           <div className="overflow-hidden">
             <h1 className={`text-6xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold text-black ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
               Try It
             </h1>
           </div>
           <div className="overflow-hidden flex items-baseline gap-4">
             <h1 className={`text-6xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] text-gray-300 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
               Before
             </h1>
           </div>
           <div className="overflow-hidden">
             <h1 className={`text-6xl sm:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-800 to-gray-400 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
               You Wear It.
             </h1>
           </div>
        </div>

        <p className={`font-manrope text-gray-600 text-base sm:text-lg max-w-md leading-relaxed mb-10 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          The future of fitting rooms is here. Upload your photo and let our AI tailor the new collection to your exact measurements.
        </p>

        <div className={`flex flex-row items-center gap-6 ${loaded ? 'reveal-text' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <a href="/virtual-try-on" className="no-underline">
            <button className="group relative px-8 py-4 bg-black text-white font-manrope font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap">
               <span className="relative z-10 flex items-center gap-2">
                  Virtual Try-On <ScanLine size={16} className="group-hover:rotate-90 transition-transform duration-500"/>
               </span>
               <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0" />
            </button>
          </a>

          <a href="/collection" className="no-underline">
            <button className="relative text-gray-500 font-manrope text-xs sm:text-sm uppercase tracking-widest hover:text-black transition-colors hover-line-sweep pb-1 cursor-pointer whitespace-nowrap">
              View Collection
            </button>
          </a>
        </div>
      </div>

      {/* --- Right Side: Densely Packed Masonry Grid (Matches User's Image) --- */}
      <div className="w-full lg:w-[60%] h-[70vh] lg:h-[80vh] relative z-10 bg-white flex items-center justify-center overflow-hidden p-0">
         
         {/* Key changes: grid-cols-4 (mobile), md:grid-cols-8 (tablet), lg:grid-cols-12 (desktop)
             grid-flow-dense: Ensures no gaps
             gap-0: No space between grid items
         */}
         <div className={`w-full h-full max-w-7xl grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 grid-rows-4 md:grid-rows-6 lg:grid-rows-4 grid-flow-dense gap-0 ${loaded ? 'grid-entrance' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            
            {gridSlots.map((slot) => (
              <GridItem 
                key={slot.id}
                color={slot.color}
                className={slot.className}
              />
            ))}

            {/* Decor - Camera Icon (placed relative to grid now) */}
            <div className="hidden lg:flex col-span-2 row-span-1 items-end justify-end p-2 opacity-20 col-start-11 row-start-4">
               <Camera className="text-black/20 w-12 h-12" />
            </div>

         </div>

         <div className="absolute inset-0 bg-gradient-to-r from-[#f4f4f5] via-transparent to-transparent z-20 pointer-events-none" />
         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f4f4f5] to-transparent z-20 pointer-events-none" />
      </div>

    </section>
  );
};

export default Hero;