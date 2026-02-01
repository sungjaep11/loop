import React from 'react';

export const CRTScreen = ({ children, className = '' }) => {
  return (
    <div className={`crt-container ${className}`} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      {/* Screen Curvature / Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 20
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>

      {/* Flicker Animation (Simulated via CSS) */}
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.97; }
          5% { opacity: 0.95; }
          10% { opacity: 0.9; }
          15% { opacity: 0.95; }
          20% { opacity: 0.99; }
          25% { opacity: 0.95; }
          30% { opacity: 0.9; }
          35% { opacity: 0.96; }
          40% { opacity: 0.98; }
          45% { opacity: 0.95; }
          50% { opacity: 0.99; }
          55% { opacity: 0.93; }
          60% { opacity: 0.9; }
          65% { opacity: 0.96; }
          70% { opacity: 1; }
          75% { opacity: 0.97; }
          80% { opacity: 0.95; }
          85% { opacity: 0.92; }
          90% { opacity: 0.98; }
          95% { opacity: 0.99; }
          100% { opacity: 0.94; }
        }
        .crt-container {
          animation: flicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
};
