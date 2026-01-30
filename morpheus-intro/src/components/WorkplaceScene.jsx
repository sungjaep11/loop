import React, { useState, useEffect } from 'react';
import WallpaperEyes from './MicroInteractions/WallpaperEyes';
import SalaryCounter from './MicroInteractions/SalaryCounter';

const WorkplaceScene = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [currentFile, setCurrentFile] = useState(null);
    const [dragActive, setDragActive] = useState(null); // 'approve' or 'reject'
    const [message, setMessage] = useState("Initializing workspace protocol...");

    // File names generator
    const fileNames = [
        "Q3_Financial_Report.pdf", "Employee_Compliance.docx", "Lunch_Menu_Week42.xlsx",
        "Server_Maintenance_Log.txt", "Asset_Allocation_v2.pdf", "Meeting_Minutes_0120.docx"
    ];

    const generateFile = () => {
        const name = fileNames[Math.floor(Math.random() * fileNames.length)];
        return { id: Date.now(), name };
    };

    useEffect(() => {
        // Initial file
        setCurrentFile(generateFile());

        // Initial AIDRA message
        setTimeout(() => {
            setMessage("Optimal performance detected. Keep up the good work, #402.");
        }, 2000);
    }, []);

    useEffect(() => {
        // Scene transition trigger
        if (score >= 5) {
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    }, [score, onComplete]);

    const playTrashSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            // Glitchy scream-like sound
            osc.type = 'sawtooth';
            // Random pitch shift
            const startFreq = 200 + Math.random() * 300;
            osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) { }
    };

    const handleDragStart = (e, file) => {
        e.dataTransfer.setData("fileId", file.id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, zone) => {
        e.preventDefault();
        setDragActive(zone);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(null);
    };

    const handleDrop = (e, zone) => {
        e.preventDefault();
        setDragActive(null);
        const fileId = e.dataTransfer.getData("fileId");

        if (fileId && currentFile && currentFile.id.toString() === fileId.toString()) {
            if (zone === 'reject') {
                // Play trash/scream sound
                // playTrashSound(); // Assuming this function exists elsewhere or will be added
            }

            // Success drop
            setScore(prev => prev + 1);

            // Play click sound (placeholder)
            // playClickSound();

            // Animation or localized effect could go here

            // Generate new file
            setCurrentFile(null); // Clear briefly for animation
            setTimeout(() => {
                setCurrentFile(generateFile());
            }, 300);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }} className="animate-fade-in">

            {/* Background Eyes */}
            <WallpaperEyes />

            {/* Salary Counter */}
            <SalaryCounter />

            {/* Top Bar / HUD */}
            <div className="glass-panel" style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 24px',
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                zIndex: 10
            }}>
                <span className="mono" style={{ fontSize: '0.8rem', color: '#666' }}>WORK_QUEUE</span>
                <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{score} / 5</span>
            </div>

            {/* AIDRA Message Area */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: '600px',
                color: '#444'
            }}>
                <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                    color: '#aaa'
                }}>AIDRA SYSTEM</div>
                <div className="mono" style={{ fontSize: '0.9rem', minHeight: '1.4em' }}>
                    {/* Simple typewriter effect could be added here, static for now */}
                    {/* <Typewriter text={message} /> */}
                    {message}
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Left Zone: Approve */}
                <div
                    onDragOver={(e) => handleDragOver(e, 'approve')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'approve')}
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRight: '1px solid rgba(0,0,0,0.05)',
                        backgroundColor: dragActive === 'approve' ? 'rgba(0,0,0,0.02)' : 'transparent',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <div style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: dragActive === 'approve' ? '#000' : '#ddd',
                        fontWeight: 700,
                        fontSize: '2rem',
                        transform: 'rotate(-90deg)',
                        pointerEvents: 'none'
                    }}>Approve</div>
                </div>

                {/* Center: File Stack */}
                <div style={{
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    {currentFile && (
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, currentFile)}
                            className="file-card glass-panel"
                            style={{
                                width: '180px',
                                height: '240px',
                                padding: '24px',
                                cursor: 'grab',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s',
                                backgroundColor: '#fff'
                            }}
                        >
                            <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px' }}></div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, wordBreak: 'break-all' }}>
                                {currentFile.name}
                            </div>
                            <div className="mono" style={{ fontSize: '0.6rem', color: '#999' }}>
                                DOC_ID: {currentFile.id}
                            </div>
                        </div>
                    )}

                    {!currentFile && (
                        <div style={{ opacity: 0.3 }}>Processing...</div>
                    )}
                </div>

                {/* Right Zone: Reject/Hold */}
                <div
                    onDragOver={(e) => handleDragOver(e, 'reject')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'reject')}
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderLeft: '1px solid rgba(0,0,0,0.05)',
                        backgroundColor: dragActive === 'reject' ? 'rgba(0,0,0,0.02)' : 'transparent',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <div style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: dragActive === 'reject' ? '#000' : '#ddd',
                        fontWeight: 700,
                        fontSize: '2rem',
                        transform: 'rotate(90deg)',
                        pointerEvents: 'none'
                    }}>Hold</div>
                </div>
            </div>
        </div>
    );
};

export default WorkplaceScene;
