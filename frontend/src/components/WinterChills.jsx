import React, { useState, useEffect } from 'react';

const WinterChills = () => {
  const [snowflakes, setSnowflakes] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;

    const handleClick = (e) => {
      // 1. Better ID generation to fix the "same key" console error
      const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const x = e.clientX;
      const y = e.clientY;

      // 2. Create 8-12 snowflakes per click
      const particleCount = 3;
      const newFlakes = Array.from({ length: particleCount }, (_, i) => ({
        id: generateId() + i, // Unique ID
        x,
        y,
        emoji: '❄️',
        // Random spread for falling motion
        destX: (Math.random() - 0.5) * 150, // Sway left/right
        destY: Math.random() * 200 + 100,   // Fall distance
        size: Math.random() * 0.8 + 0.5,    // Random size scale
        duration: Math.random() * 1 + 1,    // Random fall speed (1s to 2s)
        rotation: Math.random() * 360       // Random starting rotation
      }));

      setSnowflakes(prev => [...prev, ...newFlakes]);

      // 3. Cleanup flakes after animation ends (2 seconds)
      setTimeout(() => {
        setSnowflakes(prev => {
          // Keep only flakes that are NOT in the current batch we just added
          // (This is a simplified cleanup; for perfect cleanup we filter by ID timestamp, 
          // but filtering by age is efficient enough here)
          const now = Date.now();
          return prev.filter(flake => {
             // Extract timestamp from our custom ID to check age
             const timestamp = parseInt(flake.id.split('-')[0]);
             return now - timestamp < 2500;
          });
        });
      }, 2500);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="winter-flake absolute text-white select-none"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            fontSize: '20px',
            '--dest-x': `${flake.destX}px`,
            '--dest-y': `${flake.destY}px`,
            '--duration': `${flake.duration}s`,
            '--rotation': `${flake.rotation}deg`,
            '--scale': flake.size,
          }}
        >
          {flake.emoji}
        </div>
      ))}
      <style>{`
        .winter-flake {
          animation: winterFall var(--duration) ease-out forwards;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        }

        @keyframes winterFall {
          0% {
            transform: translate(-50%, -50%) rotate(var(--rotation)) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--rotation)) scale(var(--scale));
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dest-x)), calc(-50% + var(--dest-y))) rotate(calc(var(--rotation) + 180deg)) scale(var(--scale));
          }
        }
      `}</style>
    </div>
  );
};

export default WinterChills;