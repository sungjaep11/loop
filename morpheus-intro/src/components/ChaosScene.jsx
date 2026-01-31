import React, { useEffect, useState } from 'react';

const ChaosScene = ({ onComplete }) => {
    const [chaosLevel, setChaosLevel] = useState(0);
    const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const dx = e.clientX - lastMouse.x;
            const dy = e.clientY - lastMouse.y;
            const velocity = Math.sqrt(dx * dx + dy * dy);

            setLastMouse({ x: e.clientX, y: e.clientY });

            if (velocity > 50) {
                setChaosLevel(prev => Math.min(prev + 1, 100));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [lastMouse]);

    useEffect(() => {
        // Apply destruction effects based on chaosLevel
        const intensity = chaosLevel / 10;
        document.body.style.transform = `translate(${Math.random() * intensity - intensity / 2}px, ${Math.random() * intensity - intensity / 2}px)`;

        if (chaosLevel >= 100) {
            onComplete();
        }
    }, [chaosLevel, onComplete]);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column',
            overflow: 'hidden',
            background: `rgb(${chaosLevel * 2}, 0, 0)`
        }}>
            <h1 style={{
                fontSize: `${2 + chaosLevel / 20}rem`,
                color: '#fff',
                mixBlendMode: 'difference'
            }}>
                {chaosLevel < 100 ? "ERROR: SYSTEM UNSTABLE" : "SYSTEM FAILURE"}
            </h1>

            <div className="mono" style={{ marginTop: '20px', color: '#fff' }}>
                CHAOS_LEVEL: {chaosLevel}%
            </div>

            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10rem',
                opacity: chaosLevel / 200,
                color: 'red',
                pointerEvents: 'none'
            }}>
                ☠
            </div>
        </div>
    );
};

export default ChaosScene;
