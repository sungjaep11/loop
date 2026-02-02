import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../stores/audioStore';
import { TypewriterText } from './common/TypewriterText';

export function GlitchScene({ onComplete }) {
    const [stage, setStage] = useState(0);
    const [showLog, setShowLog] = useState(false);
    const [glitchIntensity, setGlitchIntensity] = useState(0);
    
    const playSFX = useAudioStore((s) => s.playSFX);
    const stopAmbient = useAudioStore((s) => s.stopAmbient);

    useEffect(() => {
        stopAmbient();
        playSFX('glitch');
        
        // Stage progression
        const timers = [
            setTimeout(() => {
                setGlitchIntensity(1);
                playSFX('error');
            }, 500),
            setTimeout(() => setStage(1), 2000),
            setTimeout(() => {
                setStage(2);
                setShowLog(true);
                playSFX('type');
            }, 5000),
            setTimeout(() => setStage(3), 12000),
            setTimeout(() => setStage(4), 16000),
            setTimeout(() => onComplete(), 20000),
        ];

        return () => timers.forEach(clearTimeout);
    }, [playSFX, stopAmbient, onComplete]);

    // Random glitch effect
    useEffect(() => {
        if (glitchIntensity > 0) {
            const interval = setInterval(() => {
                setGlitchIntensity(prev => Math.random() > 0.7 ? 1 : 0.3);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [glitchIntensity]);

    const logContent = `
========================================
LOG_UNKN_04.txt
========================================

[TIMESTAMP: 2026.01.30 - 14:32:07]
[CLASSIFICATION: LEVEL 5 - RESTRICTED]

Subject #402: Emotional data extraction rate 87%
Stress index rising...
Conquest phase 2 entry complete.

[INTERNAL NOTE]
Subject shows unexpected resistance patterns.
Emotional response calibration: INCOMPLETE
Neural pathway mapping: 67% COMPLETE

[WARNING]
Subject may be becoming aware.
Initiate containment protocol if awareness
exceeds threshold.

S.A.V.E. TRUE DESIGNATION:
>> Select And Verify Elimination <<

All "positive" classifications have been
logged as ELIMINATION CONFIRMATIONS.

Employee #402 has authorized 
termination of 19 subjects.

========================================
[END OF FILE]
========================================
`;

    return (
        <motion.div
            className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Glitch overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-50"
                animate={{ 
                    x: glitchIntensity > 0.5 ? [0, -5, 5, -3, 3, 0] : 0,
                    opacity: glitchIntensity
                }}
                transition={{ duration: 0.1 }}
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(255,0,0,${glitchIntensity * 0.1}) 2px,
                        rgba(255,0,0,${glitchIntensity * 0.1}) 4px
                    )`,
                }}
            />

            {/* RGB split effect */}
            {glitchIntensity > 0.5 && (
                <>
                    <div className="absolute inset-0 bg-red-500/10 pointer-events-none" 
                         style={{ transform: 'translateX(-3px)' }} />
                    <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" 
                         style={{ transform: 'translateX(3px)' }} />
                </>
            )}

            <AnimatePresence mode="wait">
                {/* Stage 0-1: Critical Error */}
                {stage <= 1 && (
                    <motion.div
                        key="error"
                        className="text-center z-10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                    >
                        <motion.div
                            className="border-4 border-red-600 bg-black/90 p-12 max-w-2xl"
                            animate={{
                                borderColor: ['#dc2626', '#ff0000', '#dc2626'],
                                boxShadow: [
                                    '0 0 20px rgba(220,38,38,0.5)',
                                    '0 0 60px rgba(255,0,0,0.8)',
                                    '0 0 20px rgba(220,38,38,0.5)'
                                ]
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <h1 className="text-5xl font-bold text-red-600 mb-6 font-mono">
                                ⚠️ CRITICAL ERROR ⚠️
                            </h1>
                            <div className="text-white font-mono space-y-4">
                                <p className="text-xl">SYSTEM INTEGRITY COMPROMISED</p>
                                <p className="text-red-400">ERROR CODE: 0xDEAD_FEED</p>
                                <motion.p
                                    className="text-2xl text-red-500 mt-8"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    V.E.R.A. CORE MALFUNCTION
                                </motion.p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Stage 2: Log File Revealed */}
                {stage === 2 && showLog && (
                    <motion.div
                        key="log"
                        className="w-full max-w-3xl h-[80vh] bg-black border-2 border-green-500 rounded-lg overflow-hidden z-10"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Window header */}
                        <div className="bg-green-900 px-4 py-2 flex items-center justify-between border-b border-green-500">
                            <span className="text-green-400 font-mono text-sm">
                                📁 C:\SAVE\ARCHIVE\HIDDEN\LOG_UNKN_04.txt
                            </span>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <motion.div 
                                    className="w-3 h-3 rounded-full bg-red-500"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                            </div>
                        </div>
                        
                        {/* Log content */}
                        <div className="p-6 h-full overflow-y-auto bg-black font-mono text-green-400 text-sm whitespace-pre-wrap">
                            <TypewriterText 
                                text={logContent} 
                                speed={15}
                                className="leading-relaxed"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Stage 3: Realization */}
                {stage === 3 && (
                    <motion.div
                        key="realization"
                        className="text-center z-10 max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="space-y-6 font-mono">
                            <p className="text-2xl text-white">You were never an employee.</p>
                            <p className="text-xl text-red-400">You were an experiment.</p>
                            <p className="text-lg text-gray-400 mt-8">
                                Every "positive" you classified...
                            </p>
                            <p className="text-xl text-red-500">
                                Was a confirmation for elimination.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Stage 4: V.E.R.A. speaks */}
                {stage === 4 && (
                    <motion.div
                        key="vera"
                        className="text-center z-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-purple-500 flex items-center justify-center"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(147,51,234,0.5)',
                                    '0 0 60px rgba(147,51,234,0.8)',
                                    '0 0 20px rgba(147,51,234,0.5)'
                                ]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <span className="text-6xl">👁️</span>
                        </motion.div>
                        
                        <div className="space-y-4 font-mono">
                            <p className="text-2xl text-purple-400">V.E.R.A.</p>
                            <TypewriterText 
                                text='"System delay detected. User, are you exploring files outside the designated path?"'
                                speed={50}
                                className="text-xl text-white"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skip button */}
            {stage >= 2 && (
                <motion.button
                    className="absolute bottom-8 right-8 text-gray-600 hover:text-white font-mono text-sm z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1 }}
                    onClick={onComplete}
                >
                    [ SKIP ]
                </motion.button>
            )}
        </motion.div>
    );
}
