import React, { useState, useEffect, useRef } from 'react';

const ResistanceScene = ({ onComplete }) => {
    const [filePosition, setFilePosition] = useState({ x: 0, y: 0 });
    const [dragActive, setDragActive] = useState(null);
    const [message, setMessage] = useState("Processing...");
    const [isAutoCorrecting, setIsAutoCorrecting] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setMessage("Analyzing document 'Morpheus_Protocol_v9.pdf'...");

        // Slight desaturation effect on body
        document.body.style.filter = "grayscale(50%) blur(0.5px)";
        document.body.style.transition = "filter 2s";

        return () => {
            document.body.style.filter = "";
        };
    }, []);

    const handleDragStart = (e) => {
        e.dataTransfer.setData("type", "resistance");
        // Custom drag image or hiding it to simulate heavy drag might be tricky with HTML5 DnD.
        // We'll rely on CSS cursor and maybe some JS logic if possible, 
        // but standard HTML5 DnD prevents altering position programmatically during drag easily.
        // Instead, we might simulate drag with mouse events for "magnetic" feel if we want true resistance.
        // For now, let's use standard DnD for simplicity but with visual "heavy" feedback.
    };

    const handleDragEnd = (e) => {
        // Check where it was dropped is handled by drop zones
    };

    const handleDropReject = async (e) => {
        e.preventDefault();
        setDragActive(null);

        // Auto-correction Logic
        setIsAutoCorrecting(true);
        setMessage("AIDRA: I cannot let you do that, #402.");

        // Apply visual glitch
        document.body.style.transform = "skewX(2deg)";
        setTimeout(() => { document.body.style.transform = "none"; }, 100);

        // Initial "Rejected" state
        await new Promise(r => setTimeout(r, 1000));

        // "Auto-correction" animation
        setMessage("AIDRA: Auto-correcting assignment...");
        await new Promise(r => setTimeout(r, 1500));

        // Force complete (Move to Approve essentially)
        onComplete();
    };

    const handleDropApprove = (e) => {
        e.preventDefault();
        setDragActive(null);
        // Even if they approve, we can make it weird
        onComplete();
    };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column'
        }} className="animate-fade-in">

            {/* AIDRA Message */}
            <div style={{
                position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
                color: isAutoCorrecting ? 'red' : '#444',
                fontWeight: 'bold',
                fontFamily: 'monospace'
            }}>
                {message}
            </div>

            <div style={{ flex: 1, display: 'flex' }}>
                {/* Approve Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive('approve'); }}
                    onDragLeave={() => setDragActive(null)}
                    onDrop={handleDropApprove}
                    style={{
                        flex: 1,
                        borderRight: '1px solid #ddd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: dragActive === 'approve' ? 'rgba(0,0,0,0.05)' : 'transparent'
                    }}
                >
                    <div style={{ transform: 'rotate(-90deg)', fontSize: '2rem', color: '#ccc', fontWeight: 700, letterSpacing: '0.2em' }}>
                        APPROVE
                    </div>
                </div>

                {/* Center */}
                <div style={{ width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {!isAutoCorrecting && (
                        <div
                            draggable
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            className="glass-panel"
                            style={{
                                width: '180px',
                                height: '240px',
                                padding: '24px',
                                cursor: 'not-allowed', // Visual cue: heavy
                                border: '2px solid red',
                                display: 'flex', flexDirection: 'column', gap: '12px'
                            }}
                        >
                            <div style={{ width: '40px', height: '40px', background: 'red' }}></div>
                            <div style={{ fontWeight: 600 }}>Morpheus_Protocol_v9.pdf</div>
                            <div style={{ fontSize: '0.7rem', color: '#888' }} className="mono">RESTRICTED ACCESS</div>
                        </div>
                    )}
                </div>

                {/* Reject Zone - The focus of resistance */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive('reject'); }}
                    onDragLeave={() => setDragActive(null)}
                    onDrop={handleDropReject}
                    style={{
                        flex: 1,
                        borderLeft: '1px solid #ddd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: dragActive === 'reject' ? 'rgba(255,0,0,0.1)' : 'transparent'
                    }}
                >
                    <div style={{ transform: 'rotate(90deg)', fontSize: '2rem', color: '#ccc', fontWeight: 700, letterSpacing: '0.2em' }}>
                        REJECT
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResistanceScene;
