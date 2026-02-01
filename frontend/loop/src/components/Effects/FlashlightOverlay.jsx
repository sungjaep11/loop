import React, { useState, useEffect } from 'react';

const FlashlightOverlay = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none',
      zIndex: 9998, // Just below CinematicOverlay
      background: 'rgba(0,0,0,0.95)',
      maskImage: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, transparent 0%, black 100%)`,
      WebkitMaskImage: `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, transparent 0%, black 100%)`, // For Safari/Chrome
      animation: 'flickerLight 4s infinite'
    }}>
      <style>{`
        @keyframes flickerLight {
            0% { opacity: 1; }
            90% { opacity: 1; }
            91% { opacity: 0.8; }
            92% { opacity: 1; }
            95% { opacity: 0.9; }
            100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FlashlightOverlay;
