import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../stores/audioStore';
import { contractText } from '../data/contractText';

export default function ContractModal({ onAgree }) {
    const [isChecked, setIsChecked] = useState(false);
    const [showStamp, setShowStamp] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const scrollRef = useRef(null);
    const acceptTimerRef = useRef(null);

    const playSFX = useAudioStore((s) => s.playSFX);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (acceptTimerRef.current) clearTimeout(acceptTimerRef.current);
        };
    }, []);

    // If content doesn't overflow, consider scrolled (e.g. small viewport)
    useEffect(() => {
        const check = () => {
            if (scrollRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                if (scrollHeight <= clientHeight + 10 || scrollTop + clientHeight >= scrollHeight - 50) {
                    setScrolledToBottom(true);
                }
            }
        };
        check();
        const t = setTimeout(check, 100); // Recheck after layout
        return () => clearTimeout(t);
    }, [contractText]);

    // Track scroll position
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setScrolledToBottom(true);
            }
        }
    };

    const handleCheckbox = () => {
        playSFX('click');
        setIsChecked((prev) => !prev);
    };

    const handleDecline = () => {
        playSFX('error');
    };

    // Handle accept button - requires scroll + checkbox
    const handleAccept = () => {
        if (!isChecked || !scrolledToBottom || showStamp) return;

        playSFX('stamp');
        setShowStamp(true);

        acceptTimerRef.current = setTimeout(() => {
            onAgree?.();
            acceptTimerRef.current = null;
        }, 1500);
    };

    const canAccept = isChecked && scrolledToBottom && !showStamp;

    return (
        <motion.div
            className="w-full h-full flex items-center justify-center p-4 bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <motion.div
                className="w-full max-w-3xl h-[90vh] bg-white text-black rounded-lg shadow-2xl flex flex-col overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{ width: '100%', maxWidth: '48rem', height: '90vh', background: 'white', color: 'black', borderRadius: '0.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between" style={{ background: '#1f2937', color: 'white', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="text-xl font-bold" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>S.A.V.E.</h1>
                        <p className="text-sm text-gray-300" style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Employment Agreement</p>
                    </div>
                    <div className="text-right text-sm" style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                        <p>Form NE-2024-7C</p>
                        <p className="text-gray-400" style={{ color: '#9ca3af' }}>Revised Edition</p>
                    </div>
                </div>

                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed relative"
                    style={{ flex: '1 1 0%', overflowY: 'auto', padding: '1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.875rem', lineHeight: '1.625', position: 'relative' }}
                >
                    {/* Contract text */}
                    <div className="space-y-4 whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }}>
                        {contractText}
                    </div>

                    {/* Stamp overlay */}
                    <AnimatePresence>
                        {showStamp && (
                            <motion.div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 text-6xl font-bold border-8 border-red-600 px-8 py-4 bg-white/90"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-15deg)',
                                    color: '#dc2626',
                                    fontSize: '3.75rem',
                                    fontWeight: 'bold',
                                    border: '8px solid #dc2626',
                                    padding: '1rem 2rem',
                                    background: 'rgba(255,255,255,0.9)',
                                    zIndex: 50
                                }}
                                initial={{ scale: 2, opacity: 0, rotate: -30 }}
                                animate={{ scale: 1, opacity: 1, rotate: -15 }}
                                transition={{ type: 'spring', damping: 10 }}
                            >
                                APPROVED
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50" style={{ borderTop: '1px solid #e5e7eb', padding: '1.5rem', background: '#f9fafb' }}>
                    {/* Scroll reminder */}
                    {!scrolledToBottom && (
                        <p className="text-center text-sm text-gray-400 mb-4 animate-pulse" style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                            ↓ Please scroll to read the entire agreement ↓
                        </p>
                    )}

                    {/* Checkbox */}
                    <div className="flex items-center gap-3 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleCheckbox}
                            className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0`}
                            style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                border: isChecked ? '2px solid #1f2937' : '2px solid #9ca3af',
                                borderRadius: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isChecked ? '#1f2937' : 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            {isChecked && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{ color: 'white', fontSize: '0.875rem' }}
                                >
                                    ✓
                                </motion.span>
                            )}
                        </button>
                        <span
                            className="text-sm cursor-pointer select-none"
                            style={{ fontSize: '0.875rem', cursor: 'pointer' }}
                            onClick={handleCheckbox}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCheckbox(); } }}
                            role="button"
                            tabIndex={0}
                        >
                            I have read and agree to all terms
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                        <motion.button
                            onClick={handleAccept}
                            disabled={!canAccept}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '0.25rem',
                                fontWeight: 'bold',
                                background: canAccept ? '#16a34a' : '#d1d5db',
                                color: canAccept ? 'white' : '#6b7280',
                                cursor: canAccept ? 'pointer' : 'not-allowed',
                                border: 'none'
                            }}
                            whileHover={canAccept ? { scale: 1.02 } : {}}
                            whileTap={canAccept ? { scale: 0.98 } : {}}
                        >
                            I ACCEPT
                        </motion.button>

                        <motion.button
                            onClick={handleDecline}
                            className="flex-1 py-3 rounded font-bold border-2 border-gray-400 text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '0.25rem',
                                fontWeight: 'bold',
                                border: '2px solid #9ca3af',
                                background: 'transparent',
                                color: '#4b5563',
                                cursor: 'pointer'
                            }}
                        >
                            I DECLINE
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
