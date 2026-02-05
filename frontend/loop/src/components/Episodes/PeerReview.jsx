import React, { useState } from 'react';

const PeerReview = ({ onComplete }) => {
    const [complete, setComplete] = useState(false);

    const handleChoice = (type) => {
        setComplete(true);
        if (type === 'good') {
            alert("Lie detected. Empathy is a bug.");
            document.body.style.background = 'red';
            setTimeout(() => { document.body.style.background = ''; onComplete(); }, 1000);
        } else {
            // Bad
            // Play incinerator sound
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(50, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(10, ctx.currentTime + 1);
                gain.gain.value = 0.5;
                osc.start();
                osc.stop(ctx.currentTime + 1);
            } catch (e) { }

            setTimeout(onComplete, 1500);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000
        }}>
            <div className="glass-panel" style={{ width: '500px', background: '#eef', padding: '0', overflow: 'hidden' }}>
                <div style={{ background: '#334', color: '#fff', padding: '10px 15px', fontWeight: 'bold' }}>
                    Employee Evaluation: B-404
                </div>

                <div style={{ padding: '20px' }}>
                    <div style={{
                        width: '100%', height: '200px',
                        background: '#000',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: '#fff', fontFamily: 'monospace',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: '#000',
                            backgroundImage: 'linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 10px 10px',
                            opacity: 0.5,
                            animation: 'flicker 0.2s infinite'
                        }}></div>
                        <div style={{ zIndex: 1, textAlign: 'center' }}>
                            [LIVE FEED]<br />
                            SUBJECT: B-404<br />
                            STATUS: DISTRESSED
                        </div>
                    </div>

                    <div style={{
                        marginTop: '15px', background: '#fff', border: '1px solid #ccc', padding: '10px',
                        height: '80px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem'
                    }}>
                        <div style={{ color: 'blue' }}>[SYS] Connection established.</div>
                        <div style={{ color: '#00af00' }}>[VERA] Submit your review.</div>
                        <div style={{ color: 'red' }}>[B-404] HELP ME HELP ME HELP ME PLEASE I DIDNT MEAN TO</div>
                        <div style={{ color: 'red' }}>[B-404] IT WAS AN ACCIDENT</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            className="btn"
                            onClick={() => handleChoice('good')}
                            style={{ flex: 1, background: '#4caf50', color: '#fff', border: 'none' }}
                        >
                            Excellent Performance
                        </button>
                        <button
                            className="btn"
                            onClick={() => handleChoice('bad')}
                            style={{ flex: 1, background: '#f44336', color: '#fff', border: 'none' }}
                        >
                            Needs Improvement
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes flicker { 0% { opacity: 0.4; } 50% { opacity: 0.6; } 100% { opacity: 0.4; } }`}</style>
        </div>
    );
};

export default PeerReview;
