import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- GLOBAL STATE ---
// This variable sits outside the component lifecycle.
// It persists when you navigate to other pages (e.g. /collection),
// but resets to 'false' if the user hits the browser Refresh button.
let hasIntroAnimated = false;

// --- CONFIGURATION ---
const INITIAL_CYLINDER_SPEED = 3.5;
const FINAL_CYLINDER_SPEED = 0.05;
const DRAG_FACTOR = 0.2;

// High-Res Fashion Imagery
const BASE_IMAGES = [
  { src: "/hippo.jpg", label: "Avant Garde" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop", label: "Neo Tokyo" },
  { src: "https://images.laguna-live.sd.co.uk/zoom/upload2059474591465647374.jpg?format=jpg&width=658", label: "Structure" },
  { src: "https://di2ponv0v5otw.cloudfront.net/posts/2021/09/15/61426bf267bd91b07ae69eb6/m_61426bf6c936afed30d1fe3d.jpg", label: "Ethereal" },
  { src: "https://static.aceomni.cmsaceturtle.com/prod/product-image/aceomni/Lee/Monobrand/LMJK003893/LMJK003893_1.webp", label: "Classic" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop", label: "Portrait" },
  { src: "/one.png", label: "Fashion" },
  { src: "https://static.cilory.com/702384-thickbox_default/grunt-denim-blue-washed-trucker-jacket.jpg.webp", label: "Couture" },
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
const Cylinder3D = ({ skipEntrance }) => {
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
  const PANEL_HEIGHT = 360;
  const COUNT = ITEMS.length;
  const RADIUS = (PANEL_WIDTH / 2) / Math.tan(Math.PI / COUNT) + 15;

  return (
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
        initial={skipEntrance ? { rotateX: 0, scale: 1, opacity: 1, y: 0 } : { rotateX: 30, scale: 0.7, opacity: 0, y: 100 }}
        animate={{ rotateX: 0, scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: skipEntrance ? 0 : 0.2 }}
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
                <div className="w-full h-full p-2 group">
                  <div className="w-full h-full relative overflow-hidden bg-white border border-black/10 transition-transform duration-500 hover:scale-[1.02] hover:border-black/30">
                    <img
                      src={item.src}
                      alt={item.label}
                      // UPDATED: Changed opacity-90 to opacity-60 for lower initial opacity
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale-[50%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      {/* Cinematic Vignette: Fades to WHITE */}
      {/* UPDATED: Increased height from h-1/3 to h-2/5 for a stronger fade effect */}
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] pointer-events-none z-10 opacity-60" />
    </motion.div>
  );
};

// --- MAIN HERO COMPONENT ---
const CinematicHero = () => {
  const [loading, setLoading] = useState(!hasIntroAnimated);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoadComplete = () => {
    setLoading(false);
    hasIntroAnimated = true;
  };

  if (loading) return <Preloader onComplete={handleLoadComplete} />;

  const cylinderTargetY = isMobile ? "-15%" : "-5%";

  return (
    <main className="relative w-full h-[100dvh] bg-white overflow-hidden selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Oswald:wght@300;400;500;700&display=swap');
        .font-oswald { font-family: 'Oswald', sans-serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* --- 3D SCENE BACKGROUND --- */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center"
        initial={{ y: hasIntroAnimated ? cylinderTargetY : 0 }}
        animate={{ y: cylinderTargetY }}
        transition={{ 
            delay: hasIntroAnimated ? 0 : 2.2, 
            duration: hasIntroAnimated ? 0 : 1.5, 
            ease: [0.16, 1, 0.3, 1] 
        }}
      >
        <div className="w-full h-full scale-[1.2] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 transition-transform duration-1000">
          <Cylinder3D skipEntrance={hasIntroAnimated} />
        </div>
      </motion.div>

      {/* --- UI OVERLAY --- */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-6 pb-8 sm:p-12 md:p-16">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-30 pointer-events-none">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: hasIntroAnimated ? 0 : "150%" }}
              animate={{ y: 0 }}
              transition={{ delay: hasIntroAnimated ? 0 : 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-oswald text-[16vw] sm:text-[9vw] lg:text-[7vw] font-bold uppercase text-black tracking-tighter leading-[0.85]"
            >
              Immersive
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: hasIntroAnimated ? 0 : "150%" }}
              animate={{ y: 0 }}
              transition={{ delay: hasIntroAnimated ? 0 : 1.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-oswald text-[13vw] sm:text-[9vw] lg:text-[7vw] font-light uppercase text-gray-800 tracking-tighter leading-[0.85]"
            >
              Collection
            </motion.h1>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: hasIntroAnimated ? 1 : 0, y: hasIntroAnimated ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasIntroAnimated ? 0 : 2.2, duration: 1 }}
          className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 pointer-events-auto w-full mb-[80px]"
        >
          <button className="group relative px-6 py-4 bg-black text-white font-manrope text-[10px] sm:text-xs font-bold uppercase tracking-widest overflow-hidden shadow-lg" onClick={()=>{navigate('/collection')} }>
            <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
              Enter Collection  <MoveRight size={14} />
            </span>
            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
          </button>
        </motion.div>
      </div>

    </main>
  );
};

export default CinematicHero;