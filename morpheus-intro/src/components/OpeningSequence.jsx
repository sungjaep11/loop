import React, { useEffect, useState } from 'react';

const OpeningSequence = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade in
    const timer1 = setTimeout(() => setOpacity(1), 500);
    
    // Hold then fade out
    const timer2 = setTimeout(() => setOpacity(0), 3500);

    // Complete
    const timer3 = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'opacity 1s ease-in-out',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none'
      }}
    >
      <h1 
        style={{
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 200,
          fontSize: '3rem',
          letterSpacing: '0.8em',
          textTransform: 'uppercase',
          opacity: opacity,
          transition: 'opacity 1s ease-in-out',
          textAlign: 'center'
        }}
      >
        Neogen Corp
      </h1>
    </div>
  );
};

export default OpeningSequence;
