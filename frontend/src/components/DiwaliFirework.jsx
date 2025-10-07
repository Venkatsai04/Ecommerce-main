import React, { useState, useEffect } from 'react';

const DiwaliFirework = () => {
  const [fireworks, setFireworks] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true); // Set to false after Diwali season

  useEffect(() => {
    if (!isEnabled) return;

    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      const colors = [
        '#FF6B6B', '#FF8E53', '#FFA500', '#FFD700',
        '#90EE90', '#87CEEB', '#6B8EFF', '#9D7EFF',
        '#FF69B4', '#FF1493', '#00CED1', '#7FFFD4'
      ];
      
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
        angle: (i * 360) / 30,
        color: colors[i % colors.length],
        delay: Math.random() * 0.05,
      }));

      setFireworks(prev => [...prev, ...particles]);

      setTimeout(() => {
        setFireworks(prev => prev.filter(p => !particles.find(np => np.id === p.id)));
      }, 600);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            '--angle': `${particle.angle}deg`,
            '--delay': `${particle.delay}s`,
          }}
        >
          <div
            className="firework-trail"
            style={{
              background: `linear-gradient(to right, ${particle.color}, transparent)`,
            }}
          />
        </div>
      ))}
      <style>{`
        .firework-trail {
          width: 20px;
          height: 1px;
          border-radius: 0.5px;
          transform-origin: left center;
          animation: fireworkBurst 0.6s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
          box-shadow: 0 0 2px currentColor;
        }

        @keyframes fireworkBurst {
          0% {
            transform: rotate(var(--angle)) translateX(0) scaleX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: rotate(var(--angle)) translateX(14px) scaleX(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateX(18px) scaleX(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DiwaliFirework