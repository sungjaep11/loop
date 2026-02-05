import React, { useEffect, useState } from 'react';

const GlitchProfile = ({ onComplete }) => {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState({});
    const [audioContext, setAudioContext] = useState(null);

    useEffect(() => {
        // Gather Real User Data
        const data = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cores: navigator.hardwareConcurrency || 'Unknown',
            screen: `${window.screen.width}x${window.screen.height}`,
            time: new Date().toLocaleString(),
        };

        // Attempt to get battery
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                data.battery = `${Math.round(battery.level * 100)}%${battery.charging ? ' (Charging)' : ''}`;
                setUserData({ ...data });
            });
        } else {
            data.battery = "Unknown / Desktop Power";
            setUserData(data);
        }
    }, []);

    const playGlitchSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            setAudioContext(ctx);

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // High pitched sine wave (Tinnitus effect)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(6000, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(8000, ctx.currentTime + 3);

            gain.gain.setValueAtTime(0.02, ctx.currentTime); // Keep volume very low for safety
            gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);

            osc.start();

            // Stop after a few seconds or when closed
            return () => {
                osc.stop();
                ctx.close();
            };
        } catch (e) {
            console.error("Audio failed", e);
        }
    };

    const handleOpen = () => {
        setShowModal(true);
        const stopAudio = playGlitchSound();

        // Stop background music if any (simulation)

        // Auto terminate this scene after some time if they don't click anything? 
        // Or wait for user interaction to close?
        // Prompt says: VERA says "Error. Close it immediately."
    };

    const handleClose = () => {
        if (audioContext) audioContext.close();
        setShowModal(false);
        onComplete(); // Transition to Scene 3
    };

    return (
        <div className="fullscreen-center" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Background with one glitched file */}
            {!showModal && (
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    zIndex: 50
                }}>
                    <div className="glass-panel"
                        onClick={handleOpen}
                        style={{
                            padding: '20px 30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            cursor: 'pointer',
                            border: '1px solid #ff4444',
                            background: 'rgba(20, 0, 0, 0.6)',
                            boxShadow: '0 0 30px rgba(255, 0, 0, 0.2)',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        <div style={{
                            fontSize: '2rem',
                            background: '#ff4444',
                            width: '50px', height: '50px',
                            borderRadius: '8px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#fff'
                        }}>
                            ⚠️
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                SYSTEM ALERT
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#eee', marginTop: '4px' }}>
                                Corrupted Data Fragment Found
                            </span>
                            <span style={{ fontSize: '0.6rem', color: '#888', marginTop: '2px' }}>
                                Click to quarantine file
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* The Glitch Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    {/* VERA Warning */}
                    <div style={{
                        color: '#ff4444',
                        fontFamily: "'Space Mono', monospace",
                        marginBottom: '30px',
                        fontSize: '1rem',
                        letterSpacing: '2px',
                        background: 'rgba(50,0,0,0.5)',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                    }} className="glitch-text">
                        ⚠ Critical Security Violation
                    </div>

                    <div className="glass-panel" style={{
                        width: '600px',
                        maxWidth: '90vw',
                        background: 'rgba(10, 10, 10, 0.6)', // Darker glass
                        border: '1px solid rgba(255, 68, 68, 0.3)',
                        color: '#eee',
                        padding: '50px',
                        fontFamily: "'Space Mono', monospace",
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        borderRadius: '12px'
                    }}>
                        {/* Header Decoration */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ff4444' }}></div>

                        <h2 style={{
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            paddingBottom: '20px',
                            marginBottom: '30px',
                            fontWeight: 400,
                            letterSpacing: '1px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>SUBJECT ANALYSIS</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>#402</span>
                        </h2>

                        <div style={{ display: 'grid', gap: '15px', fontSize: '0.9rem', color: '#ccc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.5 }}>PLATFORM</span>
                                <span>{userData.platform}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.5 }}>CORES</span>
                                <span>{userData.cores}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.5 }}>BATTERY</span>
                                <span style={{ color: userData.battery.includes('Charging') ? '#0f0' : 'inherit' }}>{userData.battery}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ opacity: 0.5 }}>TIME_LOCAL</span>
                                <span>{userData.time}</span>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '40px',
                            padding: '15px',
                            background: 'rgba(255, 68, 68, 0.1)',
                            borderLeft: '2px solid #ff4444',
                            color: '#ffaaaa',
                            fontSize: '0.8rem'
                        }}>
                            &gt;&gt; UNAUTHORIZED DATA HARVESTING DETECTED.<br />
                            &gt;&gt; IMMEDIATE TERMINATION REQUIRED.
                        </div>

                        <button
                            onClick={handleClose}
                            style={{
                                marginTop: '40px',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                padding: '16px 32px',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontFamily: "'Space Mono', monospace",
                                fontWeight: 'bold',
                                width: '100%',
                                letterSpacing: '2px',
                                transition: 'transform 0.2s',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            [ SYSTEM_REBOOT ]
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); filter: invert(0); }
          20% { transform: translate(-3px, 0px) rotate(1deg); filter: invert(1); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); filter: invert(0); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .glitch-text {
          animation: glitch 1s infinite linear;
        }
        @keyframes glitch {
          2%, 64% { transform: translate(2px,0) skew(0deg); }
          4%, 60% { transform: translate(-2px,0) skew(0deg); }
          62% { transform: translate(0,0) skew(5deg); }
        }
      `}</style>
        </div>
    );
};

export default GlitchProfile;
