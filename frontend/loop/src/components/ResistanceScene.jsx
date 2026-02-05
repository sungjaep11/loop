import React, { useState, useEffect, useRef } from 'react';

const ResistanceScene = ({ onComplete }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 }); // File position (relative to center)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 }); // Fake cursor position
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [message, setMessage] = useState("Processing Resignation request...");
    const [autoCorrect, setAutoCorrect] = useState(false);

    const containerRef = useRef(null);
    const fileRef = useRef(null);

    // Initial setup
    useEffect(() => {
        // Hide real cursor
        document.body.style.cursor = 'none';
        return () => { document.body.style.cursor = ''; };
    }, []);

    const handleMouseMove = (e) => {
        // Update fake cursor with resistance
        const rawX = e.clientX;
        const rawY = e.clientY;

        setCursorPos(prev => {
            // Calculate vector
            const dx = rawX - prev.x;
            const dy = rawY - prev.y;

            // Resistance Logic:
            // If dragging, and moving RIGHT (positive dx), reduce dx significantly
            let resistance = 1;
            if (isDragging && dx > 0) {
                resistance = 0.1; // Very heavy movement to the right
            }
            // Also adds random jitter
            if (isDragging) {
                // resistance *= (0.8 + Math.random() * 0.2); 
            }

            return {
                x: prev.x + dx * resistance,
                y: prev.y + dy // Y axis normal
            };
        });
    };

    const handleMouseDown = (e) => {
        const rect = fileRef.current.getBoundingClientRect();
        // Offset from top-left of file
        setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsDragging(true);

        // Sync cursor init
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        // Check Zones based on cursorPos
        const width = window.innerWidth;

        if (cursorPos.x < width * 0.3) {
            // Left Zone (Discard)
            // VERA likes this.
            setMessage("Wise choice. Resignation discarded.");
            setTimeout(onComplete, 1000);
        } else if (cursorPos.x > width * 0.7) {
            // Right Zone Drop (Submit)
            triggerResistance();
        }
    };

    const triggerResistance = () => {
        setAutoCorrect(true);
        setMessage("VERA: Request denied. Employees cannot resign during lockdown.");

        // Animation: Move file back to Left (Discard)
        setTimeout(() => {
            onComplete();
        }, 2500);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
                position: 'absolute', inset: 0,
                overflow: 'hidden',
                background: '#f0f0f0',
                userSelect: 'none',
                fontFamily: 'Helvetica, Arial, sans-serif'
            }}
        >
            {/* Premium Background Elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)' }}></div>
            <div className="glass-panel" style={{
                position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)',
                padding: '10px 30px', borderRadius: '50px',
                fontFamily: "'Space Mono', monospace", color: '#ff4444', fontWeight: 'bold'
            }}>
                ⚠ SYSTEM INSTABILITY DETECTED
            </div>

            {/* Zones */}
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                {/* DISCARD ZONE */}
                <div style={{
                    flex: 1, height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(90deg, rgba(255,0,0,0.05) 0%, transparent 100%)',
                    borderRight: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{ textAlign: 'center', opacity: 0.3, transform: 'rotate(-90deg)' }}>
                        <div style={{ fontSize: '3rem', fontFamily: "'Space Mono', monospace", letterSpacing: '0.2em' }}>DISCARD</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '10px' }}>SECURE DATA</div>
                    </div>
                </div>

                {/* SUBMIT ZONE (RESISTANCE) */}
                <div style={{
                    flex: 1, height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(-90deg, rgba(255,0,0,0.05) 0%, transparent 100%)',
                    borderLeft: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{ textAlign: 'center', opacity: 0.3, transform: 'rotate(90deg)' }}>
                        <div style={{ fontSize: '3rem', fontFamily: "'Space Mono', monospace", letterSpacing: '0.2em', color: '#ff4444' }}>RESIGN</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '10px' }}>SUBMIT REQUEST</div>
                    </div>
                </div>
            </div>

            {/* Custom Cursor */}
            <div style={{
                position: 'fixed',
                left: cursorPos.x, top: cursorPos.y,
                width: '16px', height: '16px',
                background: 'rgba(255, 68, 68, 0.8)',
                border: '1px solid #fff',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 15px rgba(255, 68, 68, 0.5)',
                transition: 'width 0.2s, height 0.2s',
                mixBlendMode: 'difference'
            }}>
                <div style={{
                    position: 'absolute', top: '20px', left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.5rem', color: '#ff4444',
                    fontFamily: "'Space Mono', monospace",
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 2px black'
                }}>PTR_OVERRIDE</div>
            </div>

            {/* Draggable File */}
            <div
                ref={fileRef}
                onMouseDown={handleMouseDown}
                style={{
                    position: 'absolute',
                    left: isDragging ? cursorPos.x : (autoCorrect ? '20%' : '50%'),
                    top: isDragging ? cursorPos.y : '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px', height: '420px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column',
                    transition: isDragging ? 'none' : 'all 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Spring back
                    zIndex: 10,
                    borderRadius: '2px',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                {/* File Visuals */}
                <div style={{ padding: '30px', flex: 1 }}>
                    <div style={{ width: '40px', height: '4px', background: '#000', marginBottom: '30px' }}></div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>FORM 109-R</h2>
                    <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}>Employment Termination</h3>

                    <div style={{ fontSize: '0.8rem', lineHeight: '1.6', color: '#333' }}>
                        <p><strong>Employee ID:</strong> 402</p>
                        <p><strong>Reason:</strong> Psychological Incompatibility</p>
                        <p><strong>Status:</strong> Pending Approval</p>

                        <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '4px', fontSize: '0.75rem', color: '#666' }}>
                            By submitting this form, the employee acknowledges potential forfeiture of all accumulated credits and memory assets.
                        </div>
                    </div>
                </div>

                <div style={{ height: '6px', background: isDragging ? '#ff4444' : '#000' }}></div>

                {autoCorrect && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(255,0,0,0.85)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '2rem', textAlign: 'center',
                        fontFamily: "'Space Mono', monospace",
                        flexDirection: 'column',
                        backdropFilter: 'blur(2px)'
                    }}>
                        <div>REQUEST DENIED</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 400, marginTop: '10px' }}>MANDATORY RETENTION CYCLE ACTIVE</div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{
                position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
                padding: '12px 24px', borderRadius: '30px',
                fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: isDragging ? '#ff4444' : '#666'
            }}>
                {message}
            </div>
        </div>
    );
};

export default ResistanceScene;
