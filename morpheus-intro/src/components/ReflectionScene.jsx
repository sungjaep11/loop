import React, { useEffect, useRef, useState } from 'react';

const ReflectionScene = ({ onComplete }) => {
    const videoRef = useRef(null);
    const [analysisText, setAnalysisText] = useState([]);

    useEffect(() => {
        // Request Fullscreen (Fake it via styling if browser denies auto-fullscreen without user interact)
        // Ideally we ask user to click something, but let's just make it cover viewport.

        // Webcam
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (e) {
                console.error("Camera fail", e);
            }
        };
        startVideo();

        // Matrix/Analysis Text generator
        const texts = [
            "PUPIL_DILATION: 112%",
            "HEART_RATE: 120 BPM",
            "CORTISOL_LEVELS: CRITICAL",
            "FACIAL_MICRO_EXPRESSION: FEAR DETECTED",
            "RESIGNATION_PROBABILITY: 0.00%",
            "SUBJECT_STATUS: COMPLIANT",
            "MEMORY_WIPE_REQUIRED: NO",
            "RETINAL_SCAN: MATCH FOUND (#402)",
            "TRUST_SCORE: -50"
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < texts.length) {
                setAnalysisText(prev => [...prev, texts[i]]);
                i++;
            }
        }, 800);

        // Audio: Binaural Whispers
        // Use Web Audio API for Pan
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const panner = ctx.createStereoPanner();
            const gain = ctx.createGain();

            osc.connect(panner);
            panner.connect(gain);
            gain.connect(ctx.destination);

            // Random pan loop
            const panInterval = setInterval(() => {
                panner.pan.value = Math.sin(ctx.currentTime) * 1; // Left to Right
            }, 100);

            osc.frequency.value = 100; // Low drone
            gain.gain.value = 0.05;
            osc.start();

            return () => {
                ctx.close();
                clearInterval(panInterval);
                clearInterval(interval);
            };
        } catch (e) { }

        setTimeout(onComplete, 10000); // 10s reflection

    }, [onComplete]);

    return (
        <div
            onClick={onComplete}
            style={{
                position: 'fixed', inset: 0,
                background: 'black',
                zIndex: 10000,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                cursor: 'pointer'
            }}>
            <video
                ref={videoRef}
                autoPlay playsInline muted
                style={{
                    width: '100vw', height: '100vh',
                    objectFit: 'cover',
                    opacity: 0.5,
                    filter: 'contrast(1.2) brightness(0.8)'
                }}
            />

            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,255,0,0.1), transparent 50%, rgba(0,0,0,0.8))',
                pointerEvents: 'none'
            }}></div>

            {/* Code Rain Overlay */}
            <div style={{
                position: 'absolute', top: 50, left: 50,
                fontFamily: 'monospace', color: '#0f0',
                fontSize: '1.2rem',
                textShadow: '0 0 5px #0f0'
            }}>
                {analysisText.map((t, idx) => (
                    <div key={idx} style={{ marginBottom: 10, animation: 'fadeIn 0.5s forwards' }}>
                        {'>'} {t}
                    </div>
                ))}
            </div>

            {/* Center Focus */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw', height: '80vh',
                border: '1px dashed rgba(0,255,0,0.3)',
                borderRadius: '50%'
            }}>
                <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', color: '#0f0', fontSize: '0.8rem' }}>
                    ANALYSING...
                </div>
            </div>
        </div>
    );
};

export default ReflectionScene;
