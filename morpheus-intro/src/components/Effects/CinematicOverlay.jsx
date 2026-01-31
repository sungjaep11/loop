import React from 'react';

const CinematicOverlay = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
        backgroundSize: '100% 4px',
        pointerEvents: 'none'
      }}></div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none'
      }}></div>

      {/* Film Grain (CSS Noise) */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        animation: 'grain 1s steps(10) infinite' // Optional animation if we wanted
      }}></div>
      
      {/* Chromatic Aberration Animation Style */}
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        
        body {
            text-shadow: 1px 0 2px rgba(255,0,0,0.3), -1px 0 2px rgba(0,0,255,0.3);
            animation: textFlicker 5s infinite;
        }

        @keyframes textFlicker {
            0% { text-shadow: 1px 0 2px rgba(255,0,0,0.3), -1px 0 2px rgba(0,0,255,0.3); }
            95% { text-shadow: 1px 0 2px rgba(255,0,0,0.3), -1px 0 2px rgba(0,0,255,0.3); }
            96% { text-shadow: 3px 0 2px rgba(255,0,0,0.5), -3px 0 2px rgba(0,0,255,0.5); transform: translate(1px, 1px); }
            97% { text-shadow: -2px 0 2px rgba(255,0,0,0.5), 2px 0 2px rgba(0,0,255,0.5); transform: translate(-1px, -1px); }
            98% { text-shadow: 1px 0 2px rgba(255,0,0,0.3), -1px 0 2px rgba(0,0,255,0.3); transform: translate(0, 0); }
            100% { text-shadow: 1px 0 2px rgba(255,0,0,0.3), -1px 0 2px rgba(0,0,255,0.3); }
        }
      `}</style>
    </div>
  );
};

export default CinematicOverlay;
