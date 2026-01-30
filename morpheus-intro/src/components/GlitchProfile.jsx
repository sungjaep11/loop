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
        // Prompt says: AIDRA says "Error. Close it immediately."
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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>SYSTEM IDLE...</div>

                    <div
                        onClick={handleOpen}
                        className="glitch-file"
                        style={{
                            width: '120px',
                            height: '160px',
                            background: '#333',
                            color: 'red',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            animation: 'shake 0.5s infinite',
                            position: 'relative'
                        }}
                    >
                        <div style={{ fontSize: '3rem' }}>⚠️</div>
                        <div style={{ fontSize: '0.6rem', padding: '4px', textAlign: 'center' }}>Project_Morpheus_Profile.dat</div>
                    </div>
                </div>
            )}

            {/* The Glitch Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    {/* AIDRA Warning */}
                    <div style={{
                        color: 'red',
                        fontFamily: 'monospace',
                        marginBottom: '20px',
                        fontSize: '1.2rem',
                        textShadow: '2px 2px red'
                    }} className="glitch-text">
                        AIDRA: ERROR. FILE RESTRICTED. CLOSE IMMEDIATELY.
                    </div>

                    <div className="glass-panel" style={{
                        width: '600px',
                        background: '#000',
                        border: '1px solid red',
                        color: '#0f0',
                        padding: '40px',
                        fontFamily: 'Courier New, monospace',
                        position: 'relative',
                        boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ borderBottom: '1px solid #0f0', paddingBottom: '10px' }}>SUBJECT ANALYSIS #402</h2>

                        <div style={{ marginTop: '20px', lineHeight: '2' }}>
                            <p>USER_AGENT: {userData.userAgent}</p>
                            <p>PLATFORM: {userData.platform} ({userData.cores} Cores)</p>
                            <p>SCREEN: {userData.screen}</p>
                            <p>BATTERY: {userData.battery}</p>
                            <p>LOCAL_TIME: {userData.time}</p>
                            <p style={{ color: 'red', marginTop: '20px', fontWeight: 'bold' }}>
                                &gt;&gt; MATCH CONFIRMED. TARGET LOCKED.
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            style={{
                                marginTop: '40px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '10px 30px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 'bold',
                                width: '100%'
                            }}
                        >
                            CLOSE VIEWER
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
