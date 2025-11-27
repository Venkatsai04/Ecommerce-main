import React, { useEffect, useState, useRef } from "react";
import { MoveRight, Zap, Play } from "lucide-react";

// --- DATA: High-Res Fashion Imagery ---
const BASE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", label: "Avant Garde" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", label: "Neo Tokyo" },
  { src: "https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=800&auto=format&fit=crop", label: "Structure" },
  { src: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?q=80&w=800&auto=format&fit=crop", label: "Ethereal" },
  { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop", label: "Classic" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", label: "Portrait" },
];

// Triple the array to create a dense, seamless ring (18 panels)
const CYLINDER_ITEMS = [...BASE_IMAGES, ...BASE_IMAGES, ...BASE_IMAGES].map((item, i) => ({
  ...item,
  id: `panel-${i}`
}));

// --- COMPONENT: The Cinematic Cylinder ---
const CinematicCylinder = ({ mode }) => {
  // REDUCED DIMENSIONS FOR SLEEKER LOOK
  const PANEL_WIDTH = 140; // Reduced from 200
  const PANEL_HEIGHT = 200; // Reduced from 280
  
  const PANEL_COUNT = CYLINDER_ITEMS.length;
  // Exact Math for a perfect circle with no gaps
  const RADIUS = (PANEL_WIDTH / 2) / Math.tan(Math.PI / PANEL_COUNT) + 10; 

  return (
    <div className={`cylinder-wrapper relative w-full h-full flex items-center justify-center`}>
      <style>{`
        .cylinder-wrapper {
          perspective: 1000px;
          perspective-origin: 50% 50%;
        }

        .cylinder-rig {
          transform-style: preserve-3d;
          transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* INTRO STATE: Tilted, spinning fast */
        .rig-intro {
          animation: spin-intro 2s infinite linear; 
          transform: rotateX(10deg) rotateZ(-5deg) scale(0.9);
        }

        /* DOCKED STATE: Straight, spinning slow */
        .rig-docked {
          animation: spin-infinite 40s infinite linear;
          transform: rotateX(0deg) rotateZ(0deg) scale(1);
        }

        .blur-motion {
          filter: blur(2px);
        }

        .panel {
          position: absolute;
          left: 50%;
          top: 50%;
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden;
        }

        @keyframes spin-intro {
          0% { transform: rotateX(10deg) rotateZ(-5deg) rotateY(0deg); }
          100% { transform: rotateX(10deg) rotateZ(-5deg) rotateY(-360deg); }
        }

        @keyframes spin-infinite {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-360deg); }
        }
      `}</style>

      {/* The Rotating Rig */}
      <div 
        className={`cylinder-rig w-0 h-0 ${mode === 'intro' ? 'rig-intro' : 'rig-docked'}`}
      >
        {CYLINDER_ITEMS.map((item, i) => {
          const angle = (i / PANEL_COUNT) * 360;
          
          return (
            <div
              key={item.id}
              className={`panel transition-all duration-700 ${mode === 'intro' ? 'blur-motion opacity-80' : 'opacity-100'}`}
              style={{
                width: `${PANEL_WIDTH}px`,
                height: `${PANEL_HEIGHT}px`,
                marginTop: `-${PANEL_HEIGHT / 2}px`, // Center vertically
                marginLeft: `-${PANEL_WIDTH / 2}px`, // Center horizontally
                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
              }}
            >
              <div className="w-full h-full relative overflow-hidden rounded-sm border-x border-black/20 bg-black">
                <img 
                  src={item.src} 
                  alt="" 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                
                {mode !== 'intro' && (
                  <span className="absolute bottom-4 left-0 right-0 text-center text-[9px] text-white/60 font-mono uppercase tracking-widest">
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,#f4f4f5_90%)]" />
    </div>
  );
};

// --- COMPONENT: Main Page ---
const Hero = () => {
  const [viewState, setViewState] = useState('intro'); // 'intro' | 'docked'
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // 1. Initial High-Speed Spin (Intro)
    // 2. Transition to Docked state
    const timer1 = setTimeout(() => {
      setViewState('docked');
    }, 1800);

    // 3. Reveal Text Content (synced with dock)
    const timer2 = setTimeout(() => {
      setContentVisible(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#f4f4f5] text-[#1a1a1a] overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Oswald:wght@400;500;700&display=swap');
        .font-oswald { font-family: 'Oswald', sans-serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .reveal-char {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(100%);
        }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

        /* Layout Transition Container */
        .stage-container {
          transition: all 1.5s cubic-bezier(0.65, 0, 0.35, 1);
        }
        
        /* Intro: Centered and larger */
        .stage-intro {
          left: 50%;
          width: 100vw;
          transform: translateX(-50%) scale(1);
        }
        
        /* Docked: Right side */
        .stage-docked {
          left: 100%; 
          width: 55vw; 
          transform: translateX(-100%) scale(1);
        }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 1024px) {
           .stage-intro {
             transform: translateX(-50%) scale(0.7); /* Scale down intro on mobile */
           }
           
           /* On mobile docked, we keep it centered but push it back/down and fade slightly */
           .stage-docked {
             left: 50%;
             width: 100vw;
             top: 10%; /* Move up slightly so it sits behind text */
             transform: translateX(-50%) scale(0.65); /* Keep it smaller */
             opacity: 0.4; /* Subtle background element */
             z-index: 0;
           }
        }

        /* Even smaller screens */
        @media (max-width: 640px) {
           .stage-intro {
             transform: translateX(-50%) scale(0.5); 
           }
           .stage-docked {
             top: 0%;
             transform: translateX(-50%) scale(0.5);
             opacity: 0.3;
           }
        }
      `}</style>

      {/* --- 3D STAGE (The Cylinder) --- */}
      <div 
        className={`absolute top-0 h-full z-10 stage-container flex items-center justify-center ${viewState === 'intro' ? 'stage-intro' : 'stage-docked'}`}
      >
        <CinematicCylinder mode={viewState === 'intro' ? 'intro' : 'docked'} />
      </div>


      {/* --- CONTENT LAYER (Left Side) --- */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col lg:flex-row">
        
        {/* Left Column */}
        <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-6 sm:px-12 lg:pl-20 pointer-events-auto">
          
          {/* Header Tags */}
          <div className="overflow-hidden h-8 mb-4">
            <div className={`flex items-center gap-3 text-[10px] font-manrope font-bold tracking-[0.25em] uppercase text-gray-500 transition-transform duration-700 delay-100 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <div className="w-2 h-2 bg-black rounded-full" />
              <span>Next Gen Fitting</span>
            </div>
          </div>

          {/* Main Title - Compact Typography */}
          <div className="flex flex-col font-oswald uppercase leading-[0.85] tracking-tight mix-blend-darken text-black mb-8">
            <div className="overflow-hidden">
               <h1 className={`text-[3.2rem] sm:text-[4rem] lg:text-[5rem] xl:text-[6rem] font-bold ${contentVisible ? 'reveal-char' : ''}`} style={{ animationDelay: '0.1s' }}>
                 Virtual
               </h1>
            </div>
            <div className="overflow-hidden">
               <h1 className={`text-[3.2rem] sm:text-[4rem] lg:text-[5rem] xl:text-[6rem] text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-black ${contentVisible ? 'reveal-char' : ''}`} style={{ animationDelay: '0.2s' }}>
                 Experience
               </h1>
            </div>
          </div>

          {/* Description */}
          <p 
            className={`font-manrope text-gray-600 text-xs sm:text-sm max-w-sm leading-relaxed mb-10 transition-all duration-1000 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '0.4s' }}
          >
            The future of fashion is fluid. Upload your photo and let our neural engine reconstruct your style in real-time 3D environments.
          </p>

          {/* Controls */}
          <div 
            className={`flex items-center gap-4 transition-all duration-1000 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '0.6s' }}
          >
            <button className="h-12 px-8 bg-black text-white font-manrope text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2 group shadow-xl">
              Start Scan <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="h-12 w-12 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors bg-white/50 backdrop-blur-sm">
               <Play className="w-3 h-3 fill-current" />
            </button>
          </div>

        </div>
      </div>

      {/* --- INTRO LOADING TEXT --- */}
      <div 
         className={`absolute inset-0 flex items-center justify-center z-40 pointer-events-none transition-all duration-500 ${viewState === 'intro' ? 'opacity-100 scale-100' : 'opacity-0 scale-150 blur-lg'}`}
      >
        <h2 className="font-oswald text-black text-5xl sm:text-6xl lg:text-9xl uppercase italic font-bold tracking-tighter opacity-10 mix-blend-overlay animate-pulse">
          Loading
        </h2>
      </div>

    </section>
  );
};

export default Hero;