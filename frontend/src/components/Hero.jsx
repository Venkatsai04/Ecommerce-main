import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { MoveRight, Play } from "lucide-react";

// --- CONFIGURATION ---
const INITIAL_CYLINDER_SPEED = 3.5; 
const FINAL_CYLINDER_SPEED = 0.05;  
const DRAG_FACTOR = 0.2;            

// High-Res Fashion Imagery
const BASE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop", label: "Avant Garde" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop", label: "Neo Tokyo" },
  { src: "https://images.unsplash.com/photo-1617137968427-85924c809a10?q=80&w=600&auto=format&fit=crop", label: "Structure" },
  { src: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?q=80&w=600&auto=format&fit=crop", label: "Ethereal" },
  { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop", label: "Classic" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop", label: "Portrait" },
  { src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600&auto=format&fit=crop", label: "Fashion" },
  { src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop", label: "Couture" },
];

const ITEMS = [...BASE_IMAGES, ...BASE_IMAGES, ...BASE_IMAGES]; 

// --- COMPONENT: PRELOADER (White Theme) ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const total = ITEMS.length;
    
    if (total === 0) {
      onComplete();
      return;
    }

    const checkComplete = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / total) * 100);
      setProgress(percent);
      if (loadedCount >= total) {
        setTimeout(onComplete, 800); 
      }
    };

    ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.src;
      img.onload = checkComplete;
      img.onerror = checkComplete;
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-black">
      <div className="text-6xl sm:text-8xl font-oswald font-bold tracking-tighter animate-pulse">
        {progress}%
      </div>
      <div className="mt-8 w-48 sm:w-64 h-[2px] bg-black/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 font-manrope text-[10px] uppercase tracking-[0.3em] text-gray-500">Loading Experience</p>
    </div>
  );
};

// --- COMPONENT: 3D CYLINDER ---
const Cylinder3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const currentSpeed = useRef(INITIAL_CYLINDER_SPEED);
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { damping: 20, stiffness: 100 });
  
  useAnimationFrame((time, delta) => {
    if (!isHovered) {
      if (currentSpeed.current > FINAL_CYLINDER_SPEED) {
        currentSpeed.current = currentSpeed.current * 0.98;
      }
      if (currentSpeed.current < FINAL_CYLINDER_SPEED) {
        currentSpeed.current = FINAL_CYLINDER_SPEED;
      }
      const current = rotation.get();
      rotation.set(current - (currentSpeed.current * (delta / 16))); 
    }
  });

  const PANEL_WIDTH = 200; 
  const PANEL_HEIGHT = 300; 
  const COUNT = ITEMS.length;
  const RADIUS = (PANEL_WIDTH / 2) / Math.tan(Math.PI / COUNT) + 15; 

  return (
    // UPDATED: Changed div to motion.div and moved pan/touch handlers here
    // touchAction: "pan-y" allows vertical scroll but captures horizontal swipes for rotation
    <motion.div 
      className="perspective-container w-full h-full flex items-center justify-center relative select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }} 
      onPan={(e, info) => {
         const current = rotation.get();
         rotation.set(current + info.delta.x * DRAG_FACTOR);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <style>{`
        .perspective-container {
          perspective: 2000px;
        }
        .cylinder-stage {
          transform-style: preserve-3d;
        }
      `}</style>

      <motion.div
        initial={{ rotateX: 30, scale: 0.7, opacity: 0, y: 100 }}
        animate={{ rotateX: 0, scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }} 
        className="cylinder-stage w-0 h-0 relative"
      >
        <motion.div 
            className="cylinder-ring absolute inset-0"
            style={{ 
                transformStyle: "preserve-3d", 
                rotateY: smoothRotation 
            }}
        >
          {ITEMS.map((item, i) => {
            const angle = (360 / COUNT) * i;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: `${PANEL_WIDTH}px`,
                  height: `${PANEL_HEIGHT}px`,
                  marginLeft: `-${PANEL_WIDTH / 2}px`,
                  marginTop: `-${PANEL_HEIGHT / 2}px`,
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                }}
              >
                {/* Image Card: White Background, Dark Border */}
                <div className="w-full h-full p-2 group">
                    <div className="w-full h-full relative overflow-hidden bg-white border border-black/10 transition-transform duration-500 hover:scale-[1.02] hover:border-black/30">
                        <img 
                            src={item.src} 
                            alt={item.label}
                            // UPDATED: grayscale-[50%] for slight grey, transition-all for smooth color change
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 grayscale-[50%] group-hover:grayscale-0" 
                        />
                        {/* Inner Gradient for Label Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Text Label */}
                        <div className="absolute bottom-6 left-0 right-0 text-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white font-manrope">
                                {item.label}
                            </span>
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Cinematic Vignette: Fades to WHITE now */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] pointer-events-none z-10 opacity-60" />
    </motion.div>
  );
};

// --- MAIN HERO COMPONENT ---
const CinematicHero = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile to adjust the "Move Up" animation distance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

  return (
    <main className="relative w-full h-[100dvh] bg-white overflow-hidden selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Oswald:wght@300;400;500;700&display=swap');
        .font-oswald { font-family: 'Oswald', sans-serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* --- 3D SCENE BACKGROUND --- */}
      {/* WRAPPER ANIMATION: 
         1. Starts centered (y: 0).
         2. Delays for 2.2s (waiting for text reveal).
         3. Moves UP (y: -15% on mobile, -5% desktop) to make room for text.
      */}
      <motion.div 
          className="absolute inset-0 z-0 flex items-center justify-center"
          initial={{ y: 0 }}
          animate={{ y: isMobile ? "-15%" : "-5%" }} 
          transition={{ delay: 2.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
          {/* MOBILE SCALE: Keeps it large enough to be immersive */}
          <div className="w-full h-full scale-[1.2] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 transition-transform duration-1000">
            <Cylinder3D />
          </div>
      </motion.div>

      {/* --- UI OVERLAY --- */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-6 pb-8 sm:p-12 md:p-16">
        
        {/* Center Title */}
        {/* UPDATED: Added pointer-events-none so touches pass through to cylinder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-30 pointer-events-none">
            <div className="overflow-hidden">
                <motion.h1 
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-oswald text-[16vw] sm:text-[9vw] lg:text-[7vw] font-bold uppercase text-black tracking-tighter leading-[0.85]"
                >
                    Immersive
                </motion.h1>
            </div>
            <div className="overflow-hidden">
                <motion.h1 
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 1.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-oswald text-[13vw] sm:text-[9vw] lg:text-[7vw] font-light uppercase text-gray-500 tracking-tighter leading-[0.85]"
                >
                    Reality
                </motion.h1>
            </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 pointer-events-auto w-full mb-[80px]"
        >
            {/* Play Button Group */}
            <div className="flex items-center gap-4 ">
                <button className="w-12 h-12 border border-black/20 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-sm bg-white/50 backdrop-blur-sm">
                    <Play className="w-4 h-4 fill-current ml-0.5 text-black hover:text-white transition-colors" />
                </button>
                <p className="hidden sm:block max-w-[200px] text-[10px] text-gray-600 font-manrope leading-relaxed uppercase tracking-wide">
                    Drag to explore the <br/> Fall / Winter 2025 Archive
                </p>
            </div>

            {/* Enter Gallery Button */}
            <button className="group relative px-6 py-4 bg-black text-white font-manrope text-[10px] sm:text-xs font-bold uppercase tracking-widest overflow-hidden shadow-lg">
                <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    Enter Gallery <MoveRight size={14} />
                </span>
                <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
            </button>
        </motion.div>
      </div>

    </main>
  );
};

export default CinematicHero;