import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';

const IdentityVerification = ({ onComplete }) => {
    const setCapturedPhoto = usePlayerStore((s) => s.setCapturedPhoto);
    const [status, setStatus] = useState('initializing'); // initializing, requesting, capturing, complete
    const [error, setError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const playShutterSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Shutter-like sound (short high burst then low)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.warn("Audio context failed", e);
        }
    };

    useEffect(() => {
        // Start sequence automatically
        const startSequence = async () => {
            setStatus('requesting');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }

                // Wait a bit before capturing (simulate scanning)
                setTimeout(() => {
                    capture(stream);
                }, 2000);

            } catch (err) {
                console.error("Camera denied", err);
                setError("Camera access required for employment verification.");
                setStatus('error');
            }
        };

        const capture = (stream) => {
            setStatus('capturing');
            playShutterSound();

            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = 300; // ID card photo width
                canvas.height = 300;

                const ctx = canvas.getContext('2d');
                // Draw video frame
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Apply grayscale
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;     // red
                    data[i + 1] = avg; // green
                    data[i + 2] = avg; // blue
                }
                ctx.putImageData(imgData, 0, 0);

                const dataUrl = canvas.toDataURL('image/png');
                setCapturedImage(dataUrl);
                setCapturedPhoto(dataUrl);

                // Stop stream
                stream.getTracks().forEach(track => track.stop());

                setStatus('complete');
                // Transition after showing the ID card for a moment
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 4000);
            }
        };

        const timer = setTimeout(startSequence, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full relative bg-[#0a0a0f]">
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 5
            }}>
            {/* Hidden Video/Canvas for capture logic */}
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Loading State */}
            {status === 'requesting' && (
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="spinner" style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #ccc',
                        borderTopColor: '#000',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <span style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>VERIFYING IDENTITY...</span>
                </div>
            )}

            {/* Error State */}
            {status === 'error' && (
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                    <span style={{ color: 'red' }}>{error}</span>
                    <button
                        onClick={() => onComplete?.()}
                        style={{
                            padding: '8px 24px',
                            background: '#333',
                            color: '#fff',
                            border: '1px solid #555',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Continue without photo
                    </button>
                </div>
            )}

            {/* Success / ID Card State */}
            {status === 'complete' && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }} className="animate-fade-in">
                        <h1 style={{ fontWeight: 200, letterSpacing: '0.2em', fontSize: '2rem' }}>
                            WELCOME, EMPLOYEE #402.
                        </h1>
                        <p style={{ marginTop: '16px', color: '#666', letterSpacing: '0.1em' }} className="mono">
                            IDENTITY CONFIRMED.
                        </p>
                    </div>

                    {/* ID Card Badge */}
                    <div className="glass-panel" style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        width: '240px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        zIndex: 100,
                        animation: 'slideIn 0.5s ease-out'
                    }}>
                        <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em' }}>S.A.V.E.</span>
                            <div style={{ width: '8px', height: '8px', background: '#0f0', borderRadius: '50%', boxShadow: '0 0 8px #0f0' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#eee',
                                backgroundImage: `url(${capturedImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'grayscale(100%) contrast(120%)'
                            }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span className="mono" style={{ fontSize: '0.65rem', color: '#888' }}>ID NUMBER</span>
                                <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>402</span>
                                <span className="mono" style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px' }}>CLASS C</span>
                            </div>
                        </div>

                        {/* Barcode Strip */}
                        <div style={{
                            height: '24px',
                            background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 9px)',
                            marginTop: '4px',
                            opacity: 0.8
                        }}></div>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default IdentityVerification;
