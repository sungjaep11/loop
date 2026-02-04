import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../stores/audioStore';
import { CRTScreen } from './common/CRTScreen';

const bootLines = [
    { text: 'S.A.V.E. EMPLOYEE WORKSTATION', delay: 0 },
    { text: 'EMOTION ARCHIVE SYSTEM v4.02.1', delay: 300 },
    { text: '', delay: 600 },
    { text: '┌─────────────────────────────────────────────┐', delay: 800 },
    { text: '│                                             │', delay: 900 },
    { text: `│   SYSTEM DATE: ${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}                   │`, delay: 1000 },
    { text: '│   TERMINAL: WS-1987-402                     │', delay: 1100 },
    { text: '│   LOCATION: ARCHIVE CENTER, FLOOR 7         │', delay: 1200 },
    { text: '│                                             │', delay: 1300 },
    { text: '│   STATUS: AWAITING NEW EMPLOYEE LOGIN       │', delay: 1400 },
    { text: '│                                             │', delay: 1500 },
    { text: '└─────────────────────────────────────────────┘', delay: 1600 },
    { text: '', delay: 1800 },
    { text: '> INITIALIZING ORIENTATION PROTOCOL...', delay: 2000 },
    { text: '> LOADING EMOTION CLASSIFICATION MODULE...', delay: 2500 },
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

                    {/* Continue button - polished CRT terminal style */}
                    {showContinue && (
                        <motion.div
                            className="flex flex-col items-center gap-4"
                            style={{ marginTop: '2.5rem', textAlign: 'center', paddingBottom: '28px' }}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <motion.button
                                onClick={handleContinue}
                                className="relative overflow-hidden font-mono tracking-widest"
                                style={{
                                    background: 'transparent',
                                    border: '2px solid #00ff41',
                                    color: '#00ff41',
                                    padding: '14px 40px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.25em',
                                    boxShadow: '0 0 20px rgba(0,255,65,0.15), inset 0 0 20px rgba(0,255,65,0.05)',
                                }}
                                whileHover={{
                                    background: '#00ff41',
                                    color: '#0a0a0f',
                                    boxShadow: '0 0 30px rgba(0,255,65,0.4), inset 0 0 30px rgba(0,255,65,0.1)',
                                    scale: 1.02,
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="relative z-10">Continue</span>
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </CRTScreen>
    );
};

export default BootSequence;
