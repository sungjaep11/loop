import React, { useEffect, useRef, useState } from 'react';

const LockdownScene = ({ onComplete }) => {
    const [warning, setWarning] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // Dark mode red theme
        document.body.style.backgroundColor = '#110000';
        document.body.style.color = 'red';

        // Webcam init
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (e) {
                console.error("Camera failed", e);
            }
        };
        startVideo();

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, []);

    const handleMouseMove = (e) => {
        // Center of screen
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        // Distance from center
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Threshold (video box size roughly 300px, so radius 150 + margin)
        if (dist > 250) {
            if (!warning) {
                setWarning(true);
                playAlarm();
            }
        } else {
            if (warning) {
                setWarning(false);
            }
        }
    };

    const playAlarm = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.value = 150;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) { }
    };

    useEffect(() => {
        // Pass after 10 seconds of "obedience"
        const timer = setTimeout(() => {
            onComplete();
        }, 10000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                background: warning ? 'radial-gradient(circle, transparent 30%, red 100%)' : 'none',
                transition: 'background 0.2s',
                cursor: 'none' // Hide cursor to force looking at video
            }}
        >
            <h1 style={{
                position: 'absolute', top: '10%',
                fontSize: '3rem', letterSpacing: '0.2em',
                textAlign: 'center',
                textShadow: '0 0 10px red'
            }}>
                LOOK AT ME
            </h1>

            <div style={{
                position: 'relative',
                width: '400px', height: '300px',
                border: '2px solid red',
                boxShadow: '0 0 50px red'
            }}>
                <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Face detection box overlay */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '150px', height: '150px',
                    border: '2px solid rgba(255, 0, 0, 0.5)',
                }}>
                    <div style={{ position: 'absolute', top: '-20px', left: 0, color: 'red', fontSize: '0.7rem' }}>TARGET_LOCKED</div>
                </div>
            </div>

            {warning && (
                <div style={{
                    position: 'absolute', bottom: '20%',
                    fontSize: '2rem', fontWeight: 'bold', color: 'red',
                    animation: 'shake 0.1s infinite'
                }}>
                    DO NOT LOOK AWAY
                </div>
            )}
        </div>
    );
};

export default LockdownScene;
