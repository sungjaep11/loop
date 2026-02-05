import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText } from '../common/TypewriterText';
import { playElevenLabsTts } from '../../utils/elevenlabsTts';

// Audio waveform bars component
function AudioWaveform({ isActive }) {
    const bars = 12;
    return (
        <div className="flex items-end justify-center gap-[2px] h-8">
            {Array.from({ length: bars }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-full"
                    animate={{
                        height: isActive
                            ? [8, 20 + Math.random() * 12, 8, 16 + Math.random() * 8, 8]
                            : [4, 6, 4],
                        opacity: isActive ? [0.6, 1, 0.6] : 0.3,
                    }}
                    transition={{
                        duration: isActive ? 0.4 + Math.random() * 0.3 : 2,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export function VERAAssistant({ message, onMessageComplete }) {
    const [isTyping, setIsTyping] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState(null);
    const lastSpokenRef = React.useRef(null);
    const abortControllerRef = React.useRef(null);
    const completedRef = React.useRef(false); // Prevent double completion

    // Same pattern as LogicDuelScene: playElevenLabsTts with AbortController, no unlock gate.
    // Fixed for React StrictMode: don't abort on unmount, only on new message.
    useEffect(() => {
        if (!message || !message.text) {
            if (!message) lastSpokenRef.current = null;
            return;
        }

        setIsTyping(true);
        setDisplayedMessage(message);
        completedRef.current = false; // Reset for new message

        if (lastSpokenRef.current === message.text) return;

        // Abort previous TTS if a new message comes in
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const ac = new AbortController();
        abortControllerRef.current = ac;

        const maxWait = message.duration || 15000;
        const done = () => {
            if (completedRef.current) return; // Prevent double completion
            completedRef.current = true;
            setIsTyping(false);
            onMessageComplete?.();
        };

        lastSpokenRef.current = message.text;
        // Same ElevenLabs API as LogicDuelScene - uses default voice from server (.env ELEVENLABS_VOICE_ID)
        playElevenLabsTts(message.text, { signal: ac.signal })
            .then(done)
            .catch((err) => {
                // TTS failed - don't advance immediately, let the timeout handle it
                // This ensures minimum display time even when TTS is unavailable
                console.warn('TTS failed:', err?.message || err);
            });

        const t = setTimeout(done, maxWait);
        return () => {
            clearTimeout(t);
            // Don't abort here - React StrictMode causes double mount/unmount
            // Abort only happens when a new message comes in (above)
        };
    }, [message, onMessageComplete]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'error': return 'from-red-500/20 to-red-900/20 border-red-500/50';
            case 'warning': return 'from-yellow-500/20 to-yellow-900/20 border-yellow-500/50';
            case 'success': return 'from-green-500/20 to-green-900/20 border-green-500/50';
            default: return 'from-cyan-500/10 to-purple-900/10 border-cyan-500/30';
        }
    };

    const getTextColor = (type) => {
        switch (type) {
            case 'error': return 'text-red-300';
            case 'warning': return 'text-yellow-300';
            case 'success': return 'text-green-300';
            default: return 'text-cyan-100';
        }
    };

    return (
        <div className={`relative rounded-xl p-5 border backdrop-blur-md bg-gradient-to-br ${displayedMessage ? getTypeColor(displayedMessage.type) : 'from-cyan-500/10 to-purple-900/10 border-cyan-500/30'} shadow-[0_0_30px_rgba(0,255,255,0.1)]`}>
            {/* Scan line overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-10 rounded-xl overflow-hidden"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
                }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'bg-gray-600'}`} />
                    <span className="font-bold text-cyan-400 font-mono text-sm tracking-[0.2em]">V.E.R.A.</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">AI_ASSISTANT_v2.4</span>
            </div>

            {/* Holographic Avatar */}
            <div className="flex justify-center mb-4 relative">
                {/* Outer glow ring */}
                <motion.div
                    className="absolute w-24 h-24 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: isTyping ? [1, 1.2, 1] : 1,
                        opacity: isTyping ? [0.5, 0.8, 0.5] : 0.3,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Main avatar container */}
                <motion.div
                    className="w-20 h-20 rounded-full border-2 border-cyan-500/50 flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0,20,40,0.9) 0%, rgba(0,40,60,0.9) 100%)',
                        boxShadow: isTyping
                            ? '0 0 20px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,255,255,0.1)'
                            : '0 0 10px rgba(0,255,255,0.2), inset 0 0 10px rgba(0,255,255,0.05)',
                    }}
                    animate={{
                        borderColor: isTyping
                            ? ['rgba(0,255,255,0.5)', 'rgba(0,255,255,0.8)', 'rgba(0,255,255,0.5)']
                            : 'rgba(0,255,255,0.3)',
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {/* Centered Waveform */}
                    <div className="flex items-center justify-center h-full w-full px-3">
                        <AudioWaveform isActive={isTyping} />
                    </div>
                </motion.div>
            </div>

            {/* Message area */}
            <div className="min-h-[70px] overflow-visible">
                <AnimatePresence mode="wait">
                    {displayedMessage && typeof displayedMessage.text === 'string' ? (
                        <motion.div
                            key={displayedMessage.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`font-mono text-sm leading-relaxed ${getTextColor(displayedMessage.type)}`}
                        >
                            <TypewriterText
                                text={displayedMessage.text}
                                speed={25}
                                className="leading-relaxed"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <p className="text-gray-500 italic text-xs font-mono">
                                STANDBY MODE
                            </p>
                            <div className="flex justify-center gap-1 mt-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-cyan-600"
                                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
