import React, { useEffect, useState, useRef } from 'react';

const NightShiftTask = ({ onComplete }) => {
    const [frequency, setFrequency] = useState(20);
    const [unlocked, setUnlocked] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [audioCtx, setAudioCtx] = useState(null);

    // Oscillator refs
    const staticOscRef = useRef(null);
    const voiceOscRef = useRef(null);
    const gainRef = useRef(null);

    useEffect(() => {
        // Dark Mode Transition
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ccc';
        document.body.style.transition = 'background-color 2s, color 2s';

        return () => {
            stopAudio();
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.transition = '';
        };
    }, []);

    const toggleAudio = () => {
        if (playing) {
            stopAudio();
        } else {
            startAudio();
        }
    };

    const startAudio = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioCtx(ctx);
        const mainGain = ctx.createGain();
        mainGain.connect(ctx.destination);
        gainRef.current = mainGain;

        // Static Noise (White noise buffer)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(mainGain);
        noise.start();
        staticOscRef.current = noise;

        // Voice (Simulated by a modulated sine wave for creepiness, real wav file would be better)
        // Here we use a low frequency AM/FM synth to simulate a ghostly "voice"
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 100;

        // Lowpass filter to muffle it
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        osc.connect(filter);
        filter.connect(mainGain);
        osc.start();
        voiceOscRef.current = osc;

        updateMix(frequency, mainGain);
        setPlaying(true);
    };

    const stopAudio = () => {
        if (audioCtx) {
            audioCtx.close();
            setAudioCtx(null);
        }
        setPlaying(false);
    };

    const updateMix = (val, gainNode) => {
        if (!gainNode) return;

        // Target zone: 75-80
        const diff = Math.abs(val - 78);
        const inZone = diff < 5;

        if (inZone) {
            setUnlocked(true);
            // Reduce gain overall to mimic "clarity"? Or just assume visual feedback is enough
        } else {
            setUnlocked(false);
        }
    };

    const handleSlider = (e) => {
        const val = parseInt(e.target.value);
        setFrequency(val);
        if (playing && gainRef.current) {
            updateMix(val, gainRef.current);
        }
    };

    const handleDelete = () => {
        stopAudio();
        onComplete();
    };

    return (
        <div className="flex-center-col full-screen animate-fade-in" style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: '100vh',
            gap: '30px'
        }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#0f0', fontFamily: 'monospace' }}>
                SHIFT: NIGHT<br />
                TASK: AUDIO_ANALYSIS
            </div>

            <div style={{
                width: '80%', height: '150px',
                background: '#000',
                border: '1px solid #0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Visual Waveform Simulation */}
                <div style={{
                    width: '100%', height: '2px', background: '#0f0',
                    boxShadow: unlocked ? '0 0 10px #0f0' : 'none',
                    opacity: playing ? 1 : 0.2,
                    transform: `scaleY(${unlocked ? 20 : (playing ? 5 : 1)})`,
                    transition: 'transform 0.1s'
                }}></div>
                {unlocked && playing && <div style={{ position: 'absolute', color: '#0f0', fontSize: '0.8rem', fontFamily: 'monospace' }}>VOICE PATTERN DETECTED</div>}
            </div>

            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.8rem', color: '#888' }} className="mono">FREQUENCY TUNER</label>
                <input
                    type="range" min="0" max="100"
                    value={frequency} onChange={handleSlider}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#444' }}>
                    <span>0Hz</span>
                    <span>100Hz</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    onClick={toggleAudio}
                    className="btn"
                    style={{
                        border: '1px solid #0f0',
                        color: '#0f0',
                        background: playing ? 'rgba(0, 255, 0, 0.1)' : 'transparent'
                    }}
                >
                    {playing ? "STOP SCAN" : "START SCAN"}
                </button>

                {unlocked && (
                    <button
                        onClick={handleDelete}
                        className="btn"
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            animation: 'pulse 1s infinite'
                        }}
                    >
                        DELETE LOG
                    </button>
                )}
            </div>
        </div>
    );
};

export default NightShiftTask;
