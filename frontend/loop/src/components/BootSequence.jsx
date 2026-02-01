import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../stores/audioStore';
import { CRTScreen } from './common/CRTScreen';

const bootLines = [
    { text: 'NEOGEN CORP. EMPLOYEE WORKSTATION', delay: 0 },
    { text: 'HRIS v4.02.1 - Human Resource Information System', delay: 300 },
    { text: '', delay: 600 },
    { text: '┌─────────────────────────────────────────────┐', delay: 800 },
    { text: '│                                             │', delay: 900 },
    { text: '│   SYSTEM DATE: 2026.01.30                   │', delay: 1000 },
    { text: '│   TERMINAL: WS-1987-402                     │', delay: 1100 },
    { text: '│   LOCATION: BUILDING C, FLOOR 7             │', delay: 1200 },
    { text: '│                                             │', delay: 1300 },
    { text: '│   STATUS: AWAITING NEW EMPLOYEE LOGIN       │', delay: 1400 },
    { text: '│                                             │', delay: 1500 },
    { text: '└─────────────────────────────────────────────┘', delay: 1600 },
    { text: '', delay: 1800 },
    { text: '> INITIALIZING ORIENTATION PROTOCOL...', delay: 2000 },
    { text: '> LOADING EMPLOYEE ONBOARDING MODULE...', delay: 2500 },
    { text: '> PREPARING WORKSTATION...', delay: 3000 },
];

const BootSequence = ({ onComplete }) => {
    const [visibleLines, setVisibleLines] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const [showContinue, setShowContinue] = useState(false);
    const playSFX = useAudioStore((s) => s.playSFX);

    // Hide progress bar 1 second after it reaches 100% so the button shifts up
    useEffect(() => {
        if (loadingProgress < 100) return;
        const timer = setTimeout(() => setShowProgressBar(false), 1000);
        return () => clearTimeout(timer);
    }, [loadingProgress]);

    useEffect(() => {
        console.log('BootSequence: Mounted');
        // Show boot lines progressively
        bootLines.forEach((line, index) => {
            setTimeout(() => {
                setVisibleLines((prev) => [...prev, line.text]);
                playSFX('type');
            }, line.delay);
        });

        // Loading bar animation
        const loadingInterval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 80);

        // Show continue button
        setTimeout(() => {
            setShowContinue(true);
            playSFX('success');
        }, 5000);

        return () => clearInterval(loadingInterval);
    }, [playSFX]);

    const handleContinue = () => {
        playSFX('click');
        onComplete();
    };

    return (
        <CRTScreen>
            <div style={{
                position: 'absolute', inset: 0,
                background: '#0a0a0f',
                color: '#00ff41',
                fontFamily: "'Space Mono', monospace",
                padding: '40px 40px 56px 40px',
                overflow: 'hidden',
                fontSize: '0.9rem'
            }}>

                <div className="scan-line" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))', backgroundSize: '100% 4px' }}></div>

                <motion.div
                    className="w-full h-full p-8 font-mono text-terminal-green text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Boot text */}
                    <div style={{ marginBottom: '2rem' }}>
                        {visibleLines.map((line, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ minHeight: '1.2em' }}
                            >
                                {line}
                            </motion.div>
                        ))}
                    </div>

                    {/* Loading bar - disappears 1s after reaching 100% so button shifts up */}
                    <AnimatePresence>
                    {loadingProgress > 0 && showProgressBar && (
                        <motion.div
                            key="progress-bar"
                            style={{ marginBottom: '2rem' }}
                            initial={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span>[</span>
                                <div style={{ flex: 1, height: '16px', background: '#16213e', border: '1px solid #00ff41', position: 'relative' }}>
                                    <motion.div
                                        style={{ height: '100%', background: '#00ff41', width: `${loadingProgress}%` }}
                                    />
                                </div>
                                <span>]</span>
                                <span>{loadingProgress}%</span>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* Complete message */}
                    {loadingProgress >= 100 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p>{'>'} COMPLETE. WELCOME, NEW EMPLOYEE.</p>
                        </motion.div>
                    )}

                    {/* Continue button - padding bottom so it isn't cut off */}
                    {showContinue && (
                        <motion.div
                            style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '28px' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <button
                                onClick={handleContinue}
                                style={{
                                    background: 'transparent',
                                    border: '2px solid #00ff41',
                                    color: '#00ff41',
                                    padding: '12px 32px',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    animation: 'pulse 2s infinite'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = '#00ff41'; e.target.style.color = '#000'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#00ff41'; }}
                            >
                                [ PRESS ENTER OR CLICK TO CONTINUE ]
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </CRTScreen>
    );
};

export default BootSequence;
