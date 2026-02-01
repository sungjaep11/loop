import React, { useState, useEffect, useRef } from 'react';

const DigitalLunch = ({ onComplete }) => {
    const [imgIndex, setImgIndex] = useState(0);
    const [btnPos, setBtnPos] = useState({ x: 0, y: 0 }); // Relative to center

    const images = [
        { color: "#331100", text: "JUICY STEAK" },
        { color: "#002200", text: "FRESH PASTA" },
        { color: "#000033", text: "CRISP SALAD" },
        { color: "#330033", text: "WARM BREAD" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setImgIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Repel Logic
    const handleMouseMove = (e) => {
        const btn = document.getElementById('eat-btn');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - btnX, e.clientY - btnY);

        if (dist < 150) { // Repel radius
            const angle = Math.atan2(e.clientY - btnY, e.clientX - btnX);
            const repelDist = 200;
            const newX = -Math.cos(angle) * repelDist;
            const newY = -Math.sin(angle) * repelDist;

            // Add some randomness
            setBtnPos({
                x: newX + (Math.random() * 100 - 50),
                y: newY + (Math.random() * 100 - 50)
            });
        }
    };

    const handleClick = () => {
        alert("I can't believe you managed to click it. Good job.");
        onComplete();
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                position: 'fixed', inset: 0,
                background: '#000',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 2000
            }}
        >
            <div style={{
                position: 'absolute', top: '20px',
                color: '#fff', fontSize: '1.5rem', fontFamily: 'serif'
            }}>
                MANDATORY NUTRITION INTAKE
            </div>

            <div
                style={{
                    width: '60%', height: '60%',
                    background: images[imgIndex].color,
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', fontWeight: 'bold', fontFamily: 'serif',
                    border: '1px solid #444',
                    opacity: 0.8
                }}
            >
                {images[imgIndex].text}
            </div>

            <button
                id="eat-btn"
                onClick={handleClick}
                style={{
                    marginTop: '20px',
                    padding: '15px 40px',
                    fontSize: '1.2rem',
                    background: '#fff', color: '#000',
                    border: 'none', cursor: 'none', // Hide standard cursor over button
                    transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                    transition: 'transform 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1)'
                }}
            >
                EAT
            </button>

            <div style={{
                position: 'absolute', bottom: '20px',
                color: '#888', fontStyle: 'italic'
            }}>
                "Maintain table manners. Do not rush."
            </div>
        </div>
    );
};

export default DigitalLunch;
