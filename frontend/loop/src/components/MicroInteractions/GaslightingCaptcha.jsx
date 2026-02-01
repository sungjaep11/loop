import React, { useState } from 'react';

const GaslightingCaptcha = ({ onComplete }) => {
    const [error, setError] = useState(null);

    const images = [
        { text: "FIRE", color: "#000" },
        { text: "SMILE", color: "#333" },
        { text: "VOID", color: "#111" },
        { text: "HOME", color: "#222" },
        { text: "PAIN", color: "#444" },
        { text: "ERROR", color: "#000" },
        { text: "GRID", color: "#111" },
        { text: "LOST", color: "#333" },
        { text: "DATA", color: "#222" }
    ];

    const handleTileClick = () => {
        setError("Incorrect. Analysis suggests lack of empathy.");
    };

    const handleSkip = () => {
        // Pass
        if (onComplete) onComplete();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 10000
        }}>
            <div className="glass-panel" style={{ background: '#fff', padding: '16px', borderRadius: '4px', width: '320px' }}>
                <div style={{ background: '#4a90e2', color: '#fff', padding: '16px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.9rem' }}>Security Check</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Select all tiles containing</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>HAPPY FAMILIES</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                    {images.map((item, i) => (
                        <div
                            key={i}
                            onClick={handleTileClick}
                            style={{
                                width: '100%', height: '100px',
                                background: item.color,
                                color: '#fff',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '0.8rem', fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>

                {error && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <div style={{ fontSize: '1.5rem', color: '#ccc' }}>⟳ 🎧 ⓘ</div>
                    <button className="btn btn-ghost" onClick={handleSkip} style={{ padding: '8px 16px' }}>SKIP</button>
                </div>
            </div>
        </div>
    );
};

export default GaslightingCaptcha;
