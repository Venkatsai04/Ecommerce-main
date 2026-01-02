import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, AlertCircle, Clock, Zap, Target } from 'lucide-react';

/**
 * RAW SAHARA - V3: The Kinetic Grid
 * * Concept: "Controlled Chaos" - Rigid grid meets fluid motion.
 * * Upgrade: Staggered entrance, kinetic typography, scanline interactions.
 */

// --- Components ---

// 1. Noise Texture (Enhanced)
const Noise = () => (
  <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.05] mix-blend-overlay">
    <svg className='h-full w-full'>
      <filter id='noise'>
        <feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch' />
      </filter>
      <rect width='100%' height='100%' filter='url(#noise)' />
    </svg>
  </div>
);

// 2. Marquee Component
const Marquee = ({ text, speed = 20, className }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div
        className="flex"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
      >
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-6 uppercase tracking-widest font-mono text-xs md:text-sm">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// 3. Grid Cell Wrapper with Scanline Effect
const GridCell = ({ children, className, delay = 0, noHover = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group border-[0.5px] border-[#333] overflow-hidden bg-[#050505] ${className}`}
    >
      {/* Hover Background - Slide Up */}
      {!noHover && (
        <div className="absolute inset-0 bg-[#ff1f1f] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
      )}
      
      {/* Content */}
      <div className={`relative z-10 h-full w-full transition-colors duration-300 ${!noHover ? 'group-hover:text-black' : ''}`}>
        {children}
      </div>

      {/* Decorative Crosshairs */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-[#333] z-20 group-hover:bg-white transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#333] z-20 group-hover:bg-white transition-colors duration-500"></div>
    </motion.div>
  );
};

// 4. Rotating Wireframe (Visual Interest)
const WireframeGlobe = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 opacity-20 animate-[spin_10s_linear_infinite]">
    <div className="absolute inset-0 border border-white rounded-full skew-x-12 skew-y-12"></div>
    <div className="absolute inset-0 border border-white rounded-full skew-x-[-12deg] skew-y-[-12deg] scale-90"></div>
    <div className="absolute inset-0 border border-white rounded-full rotate-45 scale-75"></div>
  </div>
);

// 5. Main App
export default function App() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-[#ff1f1f] selection:text-black overflow-x-hidden">
      
      {/* Font Imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@300;400&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        /* Robust outlined text styling */
        .text-stroke { 
            -webkit-text-stroke: 1px #ededed; 
            -webkit-text-fill-color: transparent;
            color: transparent; 
        }
      `}</style>
      
      <Noise />

      {/* --- GRID SYSTEM --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 min-h-screen w-full border-[#333]">
        
        {/* 1. BRAND HEADER (Top Left) */}
        <GridCell className="md:col-span-3 lg:col-span-3 border-r border-b p-6 md:p-8 flex flex-col justify-between min-h-[160px]" delay={0.1}>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-[#ff1f1f] animate-pulse"></div>
             <span className="font-mono text-[10px] uppercase opacity-60 tracking-wider">Sys.Override</span>
          </div>
          <div>
            <h1 className="font-syne font-extrabold text-3xl md:text-4xl uppercase leading-none tracking-tight">
              Raw<br/>Sahara
            </h1>
            <p className="font-mono text-[10px] mt-2 opacity-50">EST. 2026 // GLOBAL</p>
          </div>
        </GridCell>

        {/* 2. MARQUEE BANNER (Top Center) */}
        <GridCell className="md:col-span-3 lg:col-span-6 border-r border-b flex items-center bg-[#0a0a0a]" delay={0.2} noHover>
           <div className="w-full py-6">
             <Marquee 
                text="SYSTEM REBOOT /// FABRIC TRIALS ACTIVE /// AWAIT SIGNAL /// SYSTEM REBOOT ///" 
                className="text-[#ff1f1f]" 
             />
           </div>
        </GridCell>

        {/* 3. CLOCK / LOC (Top Right) */}
        <GridCell className="md:col-span-6 lg:col-span-3 border-b p-6 md:p-8 flex flex-col justify-between min-h-[160px]" delay={0.3}>
           <div className="flex justify-between items-start">
             <Globe size={16} className="opacity-50" />
             <span className="font-mono text-[10px] border border-[#333] px-2 py-1 rounded-full">HYD</span>
           </div>
           <div>
             <span className="font-mono text-[10px] uppercase text-[#ff1f1f] block mb-1">Local Time</span>
             <div className="font-mono text-2xl md:text-3xl tracking-tighter">{time}</div>
           </div>
        </GridCell>

        {/* 4. MAIN HERO (Center) */}
        <GridCell className="md:col-span-6 lg:col-span-8 row-span-2 border-r border-b min-h-[50vh] flex items-center justify-center text-center p-8 relative" delay={0.4} noHover>
            
            {/* Background Graphic */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                 <WireframeGlobe />
            </div>

            <div className="relative z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mb-6 flex justify-center"
              >
                <span className="font-mono text-xs border border-white/20 px-4 py-1 rounded-full uppercase tracking-widest bg-black/50 backdrop-blur-md">
                   Maintenance Mode
                </span>
              </motion.div>
              
              <h2 className="font-syne font-bold text-5xl md:text-7xl lg:text-9xl uppercase leading-[0.85] tracking-tight">
                We Are<br/>
                <span className="text-stroke">Rebuilding</span>
              </h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2 }}
                className="mt-8 font-mono text-xs md:text-sm max-w-md mx-auto leading-relaxed"
              >
                Raw Sahara is currently dormant to ensure absolute quality upon return. 
                <br className="hidden md:block"/>One garment. One drop. No compromises.
              </motion.p>
            </div>
        </GridCell>

        {/* 5. SIDEBAR METRICS (Right Side) */}
        <div className="hidden md:flex flex-col col-span-4 row-span-2 border-b">
           {/* Metric A */}
           <GridCell className="flex-1 border-b border-r-0 p-8" delay={0.5}>
              <div className="flex items-center gap-3 mb-4 text-[#ff1f1f]">
                <Zap size={18} />
                <h3 className="font-mono text-xs">PRODUCTION</h3>
              </div>
              <div className="space-y-6">
                 <div>
                   <div className="flex justify-between font-mono text-xs mb-2 opacity-70">
                     <span>FABRIC WEIGHT</span>
                     <span>400 GSM</span>
                   </div>
                   <div className="h-[2px] w-full bg-[#1a1a1a] overflow-hidden">
                     <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.5, delay: 1 }} className="h-full w-full bg-white" />
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between font-mono text-xs mb-2 opacity-70">
                     <span>DURABILITY</span>
                     <span>TESTING</span>
                   </div>
                   <div className="h-[2px] w-full bg-[#1a1a1a] overflow-hidden">
                     <motion.div initial={{ x: '-100%' }} animate={{ x: '-20%' }} transition={{ duration: 1.5, delay: 1.2 }} className="h-full w-full bg-[#ff1f1f]" />
                   </div>
                 </div>
              </div>
           </GridCell>

           {/* Metric B */}
           <GridCell className="flex-1 border-r-0 p-8" delay={0.6}>
              <div className="flex items-center gap-3 mb-4 text-[#ff1f1f]">
                <Target size={18} />
                <h3 className="font-mono text-xs">OBJECTIVE</h3>
              </div>
              <p className="font-syne text-xl leading-tight uppercase">
                Redefine the standard of essential wear.
              </p>
           </GridCell>
        </div>

        {/* 6. MOBILE SUPPORT (Visible only on mobile) */}
        <GridCell className="md:hidden border-b p-6" delay={0.5}>
             <h3 className="font-syne font-bold text-xl uppercase mb-2 text-[#ff1f1f]">Support</h3>
             <div className="space-y-2 font-mono text-xs opacity-80">
                <a href="tel:+919705772881" className="block py-2 border-b border-[#333]">Studio: +91 97057 72881</a>
                <a href="tel:+919347175125" className="block py-2">Support: +91 93471 75125</a>
             </div>
        </GridCell>

        {/* 7. NOTIFY / CTA (Bottom) */}
        <div className="col-span-1 md:col-span-12 min-h-[250px] flex flex-col md:flex-row border-b border-[#333]">
           {/* Left Block */}
           <GridCell className="w-full md:w-1/3 border-r border-[#333] p-8 md:p-12 flex flex-col justify-center bg-[#ff1f1f] text-black" delay={0.7} noHover>
              <h3 className="font-syne font-extrabold text-4xl md:text-5xl uppercase leading-none">
                Get<br/>Notified
              </h3>
              <p className="font-mono text-xs mt-4 font-bold tracking-widest">
                /// NO SPAM. JUST THE DROP.
              </p>
           </GridCell>

           {/* Right Block (Input) */}
           <GridCell className="w-full md:w-2/3 p-8 md:p-12 flex items-center bg-[#0a0a0a]" delay={0.8} noHover>
              <form className="w-full relative" onSubmit={(e) => e.preventDefault()}>
                  <label className="font-mono text-[10px] text-[#ff1f1f] mb-2 block uppercase tracking-widest">Enter Email Address</label>
                  <div className="flex border-b border-[#333] focus-within:border-[#ff1f1f] transition-colors duration-300">
                    <input 
                      type="email" 
                      placeholder="YOU@EXAMPLE.COM" 
                      className="bg-transparent w-full py-4 font-syne text-xl md:text-3xl text-[#ededed] placeholder-[#333] focus:outline-none uppercase"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="text-[#ededed] hover:text-[#ff1f1f] transition-colors px-4">
                        <ArrowRight size={32} />
                    </button>
                  </div>
              </form>
           </GridCell>
        </div>

        {/* 8. FOOTER */}
        <div className="col-span-1 md:col-span-12 p-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#444] uppercase tracking-wider bg-[#030303]">
            <span className="mb-2 md:mb-0">© 2026 Raw Sahara. All Rights Reserved.</span>
          
        </div>

      </div>
    </div>
  );
}