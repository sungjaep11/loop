import React, { useEffect, useState } from 'react';

const BiometricCursor = ({ stressLevel = 0 }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);

    useEffect(() => {
        const handleMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });

            // Add trail point
            if (stressLevel > 0) {
                setTrail(prev => [...prev.slice(-5), { x: e.clientX, y: e.clientY, id: `${Date.now()}-${Math.random()}` }]);
            }
        };

        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [stressLevel]);

    return (
        <>
            <style>{`
        body { cursor: none; }
        .cursor-main {
            position: fixed;
            top: 0; left: 0;
            width: 20px; height: 20px;
            border: 1px solid #0f0;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        }
        .cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 4px; height: 4px;
            background: #0f0;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        }
        .shaking {
            animation: cursorShake 0.1s infinite;
        }
        @keyframes cursorShake {
            0% { margin-left: -2px; margin-top: 1px; }
            25% { margin-left: 2px; margin-top: -1px; }
            50% { margin-left: -1px; margin-top: 2px; }
            75% { margin-left: 1px; margin-top: -2px; }
            100% { margin-left: 0px; margin-top: 0px; }
        }
      `}</style>

            {/* Main Cursor */}
            <div
                className={`cursor-main ${stressLevel > 0 ? 'shaking' : ''}`}
                style={{
                    left: pos.x,
                    top: pos.y,
                    borderColor: stressLevel > 1 ? 'red' : '#0f0'
                }}
            ></div>
            <div className="cursor-dot" style={{ left: pos.x, top: pos.y, background: stressLevel > 1 ? 'red' : '#0f0' }}></div>

            {/* Trail */}
            {trail.map((t, i) => (
                <div
                    key={t.id}
                    style={{
                        position: 'fixed',
                        left: t.x, top: t.y,
                        width: '6px', height: '6px',
                        background: 'red',
                        opacity: (i + 1) / trail.length,
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9998
                    }}
                ></div>
            ))}
        </>
    );
};

export default BiometricCursor;
