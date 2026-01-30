import React, { useEffect, useRef, useState } from 'react';

const WallpaperEyes = () => {
    const [eyes, setEyes] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // Generate grid of eyes
        const rows = 5;
        const cols = 8;
        const newEyes = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                newEyes.push({ id: `${r}-${c}`, r, c });
            }
        }
        setEyes(newEyes);
    }, []);

    const handleMouseMove = (e) => {
        const eyeElements = document.querySelectorAll('.eye-pupil');
        eyeElements.forEach(pupil => {
            const rect = pupil.parentElement.getBoundingClientRect();
            const eyeCenterX = rect.left + rect.width / 2;
            const eyeCenterY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const dist = 5; // pupil movement radius
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            pupil.style.transform = `translate(${x}px, ${y}px)`;
        });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [eyes]);

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
            pointerEvents: 'none',
            zIndex: -1,
            opacity: 0.1
        }}>
            {eyes.map(eye => (
                <div key={eye.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="eye-bg" style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%', border: '2px solid #000',
                        background: '#fff',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div className="eye-pupil" style={{
                            width: '12px', height: '12px',
                            borderRadius: '50%', background: '#000'
                        }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WallpaperEyes;
