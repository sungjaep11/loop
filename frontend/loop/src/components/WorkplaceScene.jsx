import React, { useState, useEffect, useRef } from 'react';
import WallpaperEyes from './MicroInteractions/WallpaperEyes';
import SalaryCounter from './MicroInteractions/SalaryCounter';
import GlitchProfile from './GlitchProfile';
import { playElevenLabsTts } from '../utils/elevenlabsTts';
import { useAudioStore } from '../stores/audioStore';

const WorkplaceScene = ({ onComplete, isGlitch = false, isResistance = false }) => {
    const [score, setScore] = useState(0);
    const [currentFile, setCurrentFile] = useState(null);
    const [dragActive, setDragActive] = useState(null);
    const [message, setMessage] = useState("Initializing workspace protocol...");
    const [glitchActive, setGlitchActive] = useState(false);

    // Audio Refs
    const bgmRef = useRef(null);

    const ttsUnlocked = useAudioStore((s) => s.ttsUnlocked);
    const lastSpokenRef = useRef({ text: null, wasUnlocked: false });

    // -----------------------------------------------------------
    // VERA TTS Integration (ElevenLabs)
    // -----------------------------------------------------------
    useEffect(() => {
        if (!message) return;

        const alreadySpoken =
            lastSpokenRef.current.text === message &&
            lastSpokenRef.current.wasUnlocked;
        if (alreadySpoken) return;

        if (!ttsUnlocked) return;

        lastSpokenRef.current = { text: message, wasUnlocked: true };

        const ac = new AbortController();
        const VERA_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

        playElevenLabsTts(message, {
            voiceId: VERA_VOICE_ID,
            signal: ac.signal,
        }).catch((err) => {
            if (err.name !== "AbortError") {
                console.warn("TTS Error:", err);
            }
        });

        return () => ac.abort();
    }, [message, ttsUnlocked]);

    // File names
    const normalFiles = [
        "2024_Marketing_Trends.pdf", "Cafeteria_Menu.xlsx", "Quarterly_Compliance.docx",
        "Asset_List_v4.pdf", "Meeting_Minutes_Final.txt"
    ];

    // Initial Setup
    useEffect(() => {
        setCurrentFile(generateFile());

        // BGM removed: external CDN (Pixabay) returns 403 when embedded. Use audioStore.playAmbient or self-hosted file if needed.
        return () => {
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current.src = "";
                bgmRef.current = null;
            }
        };
    }, []);

    // VERA Compliments Loop
    useEffect(() => {
        if (isGlitch || isResistance) return;

        const compliments = [
            "Your efficiency is in the top 3.2%.",
            "Keep up the rhythm, #402.",
            "Visual cortex engagement: Optimal.",
            "The company values your dedication.",
            "Did you have your coffee? You seem energized."
        ];

        const interval = setInterval(() => {
            setMessage(compliments[Math.floor(Math.random() * compliments.length)]);
        }, 8000);

        return () => clearInterval(interval);
    }, [isGlitch, isResistance]);

    // Glitch Phase Trigger
    useEffect(() => {
        if (isGlitch) {
            setMessage("Error... Data corruption detected...");
            if (bgmRef.current) bgmRef.current.playbackRate = 0.5; // Slow down music

            // Trigger overlay after delay
            setTimeout(() => setGlitchActive(true), 2000);

            setTimeout(() => {
                onComplete();
            }, 8000); // Auto-advance to next for demo flow? Or wait for interaction?
        }
    }, [isGlitch, onComplete]);

    const generateFile = () => {
        const name = normalFiles[Math.floor(Math.random() * normalFiles.length)];
        return { id: Date.now(), name };
    };

    const playSound = (type) => {
        // Simple synth sounds for UI
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'drop') {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'approve') {
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        }
    };

    const [tutorialStep, setTutorialStep] = useState(0); // 0: Intro, 1: Approve, 2: Hold, 3: Done

    // ... (existing refs)

    // ... (existing useEffects)

    // Tutorial Logic
    useEffect(() => {
        if (!isGlitch && !isResistance && score === 0 && tutorialStep === 0) {
            setMessage("Initializing... Protocol #402 loaded.");
            setTimeout(() => {
                setMessage("Step 1: Sorting calibration required.");
                setTutorialStep(1); // Prompt Approve
            }, 3000);
        }
    }, [isGlitch, isResistance, score, tutorialStep]);

    const handleDrop = (e, zone) => {
        e.preventDefault();
        setDragActive(null);

        // Tutorial Guard Rails
        if (tutorialStep === 1) {
            if (zone === 'approve') {
                playSound('approve');
                setMessage("Correct. Now calibrate retention protocols.");
                setTutorialStep(2); // Prompt Hold
                return; // Don't score yet, just advance tutorial
            } else {
                setMessage("Error. Drag LEFT to Approve.");
                return;
            }
        }

        if (tutorialStep === 2) {
            if (zone === 'reject') {
                playSound('drop');
                setMessage("Calibration complete. Begin standard processing.");
                setTutorialStep(3); // Tutorial Done
                setTimeout(() => setCurrentFile(generateFile()), 1000); // Allow delay to read
                return;
            } else {
                setMessage("Error. Drag RIGHT to Hold.");
                return;
            }
        }

        // Normal Gameplay
        if (isResistance && zone === 'reject') {
            // ...
        }

        playSound(zone === 'approve' ? 'approve' : 'drop');
        setScore(pre => pre + 1);
        setCurrentFile(null);
        setTimeout(() => setCurrentFile(generateFile()), 300);

        if (!isGlitch && !isResistance && score >= 5) {
            // Visual feedback via message before transition
            setMessage("Quota met. Calibrating next module...");
            setTimeout(() => {
                onComplete(); // Transition to Glitch
            }, 2000);
        }
    };

    const handleDragOver = (e, zone) => {
        e.preventDefault();
        setDragActive(zone);
    };

    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
            <WallpaperEyes />
            <SalaryCounter />

            {/* Header HUD */}
            <div className="glass-panel" style={{
                position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)',
                padding: '12px 40px', zIndex: 10,
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
                <span className="mono" style={{ fontSize: '0.9rem', color: '#888', marginRight: '15px' }}>PROCESSED</span>
                <span style={{ fontWeight: 700, fontSize: '1.5rem', fontFamily: "'Space Mono', monospace" }}>{score} / 5</span>
            </div>

            {/* VERA Message - Bottom Floating rounded pill */}
            <div className="glass-panel" style={{
                position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
                padding: '16px 32px', borderRadius: '16px',
                textAlign: 'center', width: 'auto', maxWidth: '600px',
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 20
            }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#999', marginBottom: 4, textTransform: 'uppercase' }}>VERA OS v9.4</div>
                <div style={{ fontSize: '1.1rem', color: '#111', fontWeight: 500 }}>{message}</div>
            </div>

            {/* Work Zones */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', zIndex: 5 }}>
                {/* Left Zone: APPROVE */}
                <div
                    onDragOver={(e) => handleDragOver(e, 'approve')}
                    onDrop={(e) => handleDrop(e, 'approve')}
                    style={{
                        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        transition: 'all 0.3s ease',
                        background: dragActive === 'approve' ? 'rgba(0,0,0,0.03)' : 'transparent',
                        position: 'relative',
                        boxShadow: tutorialStep === 1 ? 'inset 0 0 50px rgba(0,255,0,0.1)' : 'none' // Tutorial Highlight
                    }}
                >
                    <div style={{
                        transform: 'rotate(-90deg)',
                        opacity: (dragActive === 'approve' || tutorialStep === 1) ? 1 : 0.3,
                        transition: 'opacity 0.3s',
                        textAlign: 'center',
                        color: tutorialStep === 1 ? '#000' : 'inherit'
                    }}>
                        <div style={{ fontSize: '4rem', lineHeight: 1 }}>←</div>
                        <div style={{ fontSize: '1rem', letterSpacing: '0.2em', fontWeight: 600, marginTop: '10px' }}>
                            {tutorialStep === 1 ? "DRAG HERE" : "APPROVE"}
                        </div>
                    </div>
                    {/* Subtle Guide Line */}
                    <div style={{ position: 'absolute', right: 0, top: '20%', bottom: '20%', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)' }}></div>
                </div>

                {/* Center Stage */}
                <div style={{ width: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px' }}>
                    {currentFile ? (
                        <div draggable onDragStart={(e) => { e.dataTransfer.setData("id", currentFile.id); }} style={{
                            width: 280, height: 380, background: '#fff',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                            display: 'flex', flexDirection: 'column',
                            cursor: 'grab', borderRadius: '4px', overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            transform: dragActive ? 'rotate(2deg) scale(1.02)' : 'rotate(0deg)'
                        }}>
                            {/* File Header */}
                            <div style={{ height: '6px', background: '#111' }}></div>
                            <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f0f0f0', borderRadius: '50%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📄</span>
                                </div>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#999', marginBottom: '5px' }}>DOC_ID: {currentFile.id}</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '20px' }}>
                                    {currentFile.name.replace(/_/g, ' ').replace('.pdf', '').replace('.docx', '')}
                                </div>

                                {/* Fake Content Lines */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', opacity: 0.5 }}>
                                    <div style={{ height: '4px', background: '#eee', width: '100%' }}></div>
                                    <div style={{ height: '4px', background: '#eee', width: '80%' }}></div>
                                    <div style={{ height: '4px', background: '#eee', width: '90%' }}></div>
                                </div>
                            </div>
                            {/* Footer */}
                            <div style={{ padding: '15px 30px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.6rem', color: '#aaa', fontWeight: 600 }}>CONFIDENTIAL</span>
                                <div style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }}></div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: '#ccc', letterSpacing: '1px', fontSize: '0.9rem' }} className="animate-pulse">Fetching next assignment...</div>
                    )}
                </div>

                {/* Right Zone: HOLD */}
                <div
                    onDragOver={(e) => handleDragOver(e, 'reject')}
                    onDrop={(e) => handleDrop(e, 'reject')}
                    style={{
                        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        transition: 'all 0.3s ease',
                        background: dragActive === 'reject' ? 'rgba(0,0,0,0.03)' : 'transparent',
                        position: 'relative',
                        boxShadow: tutorialStep === 2 ? 'inset 0 0 50px rgba(0,0,0,0.1)' : 'none' // Tutorial Highlight
                    }}
                >
                    {/* Subtle Guide Line */}
                    <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)' }}></div>

                    <div style={{
                        transform: 'rotate(90deg)',
                        opacity: (dragActive === 'reject' || tutorialStep === 2) ? 1 : 0.3,
                        transition: 'opacity 0.3s',
                        textAlign: 'center',
                        color: tutorialStep === 2 ? '#000' : 'inherit'
                    }}>
                        <div style={{ fontSize: '4rem', lineHeight: 1 }}>→</div>
                        <div style={{ fontSize: '1rem', letterSpacing: '0.2em', fontWeight: 600, marginTop: '10px' }}>
                            {tutorialStep === 2 ? "DRAG HERE" : "HOLD"}
                        </div>
                    </div>
                </div>
            </div>

            {glitchActive && <GlitchProfile onComplete={onComplete} />}
        </div>
    );
};

export default WorkplaceScene;
