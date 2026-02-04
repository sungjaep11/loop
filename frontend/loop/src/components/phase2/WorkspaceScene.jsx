import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioStore } from '../../stores/audioStore';

import { VERAAssistant } from './VERAAssistant';
import { InboxPanel } from './InboxPanel';
import { FileProcessor } from './FileProcessor';
import { OutputPanels } from './OutputPanels';
import { MetricsPanel } from './MetricsPanel';
import { EmployeeCard } from '../ui/EmployeeCard';
import {
    allEmotionFiles,
    resetFiles,
    getPhaseByFileId,
    requiresOverride
} from '../../data/emotionFiles';

export default function WorkspaceScene({ onComplete, mode = 'normal' }) {
    const [currentFile, setCurrentFile] = useState(null);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [activeId, setActiveId] = useState(null);
    const [veraMessage, setVeraMessage] = useState(null);
    const [filesQueue, setFilesQueue] = useState([]);
    const [processedCount, setProcessedCount] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(1);

    // V.E.R.A. override state
    const [isOverriding, setIsOverriding] = useState(false);
    const [pendingOverride, setPendingOverride] = useState(null);

    // Webcam state for Phase 4
    const [webcamImage, setWebcamImage] = useState(null);
    const [isEliminateMode, setIsEliminateMode] = useState(false);

    // Phase 3.1: Termination Option
    const [showTerminationOption, setShowTerminationOption] = useState(false);

    // Phase 4: Elimination animation (when user drags own photo to eliminate)
    const [isEliminating, setIsEliminating] = useState(false);

    // Glitch/Crash transition state
    const [isCrashing, setIsCrashing] = useState(false);

    const setScene = useGameStore((s) => s.setScene);
    const incrementProcessed = useGameStore((s) => s.incrementProcessed);
    const capturedPhoto = usePlayerStore((s) => s.capturedPhoto);
    const playSFX = useAudioStore((s) => s.playSFX);
    const playAmbient = useAudioStore((s) => s.playAmbient);

    // Initial Setup
    useEffect(() => {
        let queue = [];
        if (mode === 'recovery') {
            queue = [...resetFiles];
            playAmbient('officeAmbient');

            setTimeout(() => {
                setVeraMessage({
                    text: "Welcome back, Employee #402. There was a minor technical issue.",
                    duration: 4000,
                });
            }, 1000);

            setTimeout(() => {
                setVeraMessage({
                    text: "Nothing to worry about. Let's continue where we left off.",
                    duration: 4000,
                });
            }, 5000);

        } else {
            queue = [...allEmotionFiles];
            playAmbient('officeAmbient'); // Start lo-fi music!

            setTimeout(() => {
                setVeraMessage({
                    text: "Good morning, Employee #402. I am V.E.R.A., your Virtual Emotion Recognition Assistant.",
                    duration: 5000,
                });
            }, 1000);

            setTimeout(() => {
                setVeraMessage({
                    text: "Your task is simple: classify emotions as POSITIVE or NEGATIVE. Drag each item to the appropriate zone.",
                    duration: 5000,
                });
            }, 6500);
        }
        setFilesQueue(queue);

        if (queue.length > 0) {
            setCurrentFile(queue[0]);
            setCurrentPhase(getPhaseByFileId(queue[0].id));
        }
    }, [mode, playAmbient]);

    // Handle Phase 4 webcam (Self-elimination) - MODIFIED: Auto-crash sequence
    useEffect(() => {
        if (currentFile && currentFile.type === 'webcam') {
            setWebcamImage(capturedPhoto);
            setIsEliminateMode(true);

            // 1. Reveal V.E.R.A. analysis
            setTimeout(() => {
                setVeraMessage({
                    text: "Subject identified. Employee #402.",
                    duration: 3000,
                    type: 'warning'
                });
            }, 1000);

            // 2. Simulate System Crash / Memory Leak (Interrupting the process)
            setTimeout(() => {
                // Play error sound
                playSFX('error');

                // Show critical error message
                setVeraMessage({
                    text: "CRITICAL ALERT: MEMORY CORRUPTION DETECTED.",
                    duration: 2000,
                    type: 'error'
                });
            }, 4000);

            // 3. Force transition to Investigation Desktop (The Crash)
            setTimeout(() => {
                onComplete();
            }, 6000);
        } else {
            setIsEliminateMode(false);
        }
    }, [currentFile, capturedPhoto, playSFX, onComplete]);

    // Auto-approve logic for recovery mode
    useEffect(() => {
        if (mode === 'recovery' && currentFile) {
            const timer = setTimeout(() => {
                playSFX('success');
                setVeraMessage({ text: "Processing...", duration: 1000 });

                const nextIndex = currentFileIndex + 1;

                if (nextIndex < filesQueue.length) {
                    setCurrentFile(null);
                    setTimeout(() => {
                        setCurrentFileIndex(nextIndex);
                        setCurrentFile(filesQueue[nextIndex]);
                    }, 500);
                } else {
                    setCurrentFile(null);
                    setVeraMessage({
                        text: "See? Everything is fine. Just keep processing. Forever.",
                        duration: 5000
                    });
                    setTimeout(() => setShowTerminationOption(true), 2000);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mode, currentFile, currentFileIndex, filesQueue, playSFX]);

    const handleDragStart = (event) => {
        if (isOverriding) return;
        setActiveId(event.active.id);
        playSFX('click');
    };

    const handleDragEnd = (event) => {
        const { over } = event;
        if (!over || !currentFile || mode === 'recovery' || isOverriding) {
            setActiveId(null);
            return;
        }

        const action = over.id; // 'positive' or 'negative'
        const file = currentFile;
        const phase = getPhaseByFileId(file.id);

        // Check if V.E.R.A. needs to override
        if (requiresOverride(file)) {
            const playerChoice = action;
            const expectedChoice = file.playerExpected;

            // If player chose what V.E.R.A. expects to override
            if (playerChoice === expectedChoice) {
                // V.E.R.A. OVERRIDE!
                setIsOverriding(true);
                playSFX('error');

                setVeraMessage({
                    text: file.veraMessage,
                    duration: 1000,
                    type: 'error'
                });

                // After V.E.R.A. speaks, force the override
                setTimeout(() => {
                    const overrideAction = file.veraOverride;
                    playSFX('success');

                    if (overrideAction === 'delete') {
                        setVeraMessage({
                            text: "Data purged from system.",
                            duration: 2000,
                            type: 'warning'
                        });
                    }

                    moveToNextFile();
                    setIsOverriding(false);
                }, 1500);

                setActiveId(null);
                return;
            }
        }

        // Normal processing (Phase 1 or correct Phase 2/3 choice)
        playSFX('success');

        // Phase 4 - Eliminate: play cool elimination sequence then transition
        if (isEliminateMode && action === 'negative') {
            setActiveId(null);
            setIsEliminating(true);
            setVeraMessage({
                text: "ELIMINATION CONFIRMED. INITIATING PROTOCOL...",
                duration: 1000,
                type: 'error'
            });
            playSFX('error');

            setTimeout(() => {
                setIsEliminating(false);
                onComplete();
            }, 5000);
            return;
        }

        // V.E.R.A. comment for specific files
        if (file.veraComment) {
            setVeraMessage({
                text: file.veraComment,
                duration: 2000,
                type: 'success'
            });
        } else {
            setVeraMessage({
                text: action === 'positive' ? "Classified as positive." : "Classified as negative.",
                duration: 1500,
                type: 'success'
            });
        }

        moveToNextFile();
        setActiveId(null);
    };

    const moveToNextFile = () => {
        const nextIndex = currentFileIndex + 1;
        setProcessedCount(prev => prev + 1);
        incrementProcessed();

        if (nextIndex < filesQueue.length) {
            const nextFile = filesQueue[nextIndex];

            // MODIFIED: If next file is the webcam trigger (Phase 4), CRASH with glitch effect.
            if (nextFile.type === 'webcam') {
                setCurrentFile(null); // Clear current file to avoid flickering
                setIsCrashing(true); // Trigger glitch overlay

                // Play error sound if available
                playSFX?.('error');

                setTimeout(() => {
                    onComplete(); // Go to InvestigationDesktop (Blue Screen)
                }, 2500); // Longer delay to show glitch effect
                return;
            }

            setCurrentFile(null);
            setTimeout(() => {
                setCurrentFileIndex(nextIndex);
                setCurrentFile(nextFile);

                const nextPhase = getPhaseByFileId(nextFile.id);
                if (nextPhase !== currentPhase) {
                    setCurrentPhase(nextPhase);
                    announcePhaseChange(nextPhase);
                }
            }, 400);
        } else {
            // All files processed - should not happen normally as Phase 4 triggers glitch
            setVeraMessage({ text: "All data processed. Stand by...", duration: 3000 });
            setTimeout(() => onComplete(), 3000);
        }
    };

    const announcePhaseChange = (phase) => {
        switch (phase) {
            case 2:
                setTimeout(() => {
                    setVeraMessage({
                        text: "Phase 2 starting. I will provide corrections for some classifications.",
                        duration: 4000,
                        type: 'warning'
                    });
                }, 500);
                break;
            case 3:
                setTimeout(() => {
                    setVeraMessage({
                        text: "Phase 3 starting. New classification criteria applied for system optimization.",
                        duration: 4000,
                        type: 'warning'
                    });
                }, 500);
                break;
            case 4:
                setTimeout(() => {
                    setVeraMessage({
                        text: "Final Phase. Data requiring special analysis detected.",
                        duration: 1000,
                        type: 'error'
                    });
                }, 500);
                break;
            default:
                break;
        }
    };

    return (
        <motion.div
            className="w-full h-full bg-[#0a0a0f] flex flex-col text-white overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: mode === 'recovery' ? '38px 38px' : '40px 40px'
                }}>
            </div>

            {/* Phase indicator overlay */}
            {currentPhase >= 2 && (
                <motion.div
                    className={`absolute top-0 left-0 right-0 h-1 ${currentPhase === 2 ? 'bg-yellow-500' :
                        currentPhase === 3 ? 'bg-orange-500' :
                            'bg-red-600'
                        }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                />
            )}

            {/* Header bar */}
            <header className="bg-slate-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between border-b border-cyan-500/20 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
                        <span className="text-lg font-bold text-cyan-400 tracking-[0.2em] font-mono">S.A.V.E.</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                        Emotion Classification System v9.4 {mode === 'recovery' ? '(RECOVERED)' : ''}
                    </span>
                    {currentPhase > 1 && (
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${currentPhase === 2
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : currentPhase === 3
                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse'
                            }`}>
                            PHASE {currentPhase}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1.5">
                        <span className="text-cyan-500">◷</span>
                        {mode === 'recovery' ? '09:00' : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-cyan-500">◈</span>
                        {processedCount}/{filesQueue.length}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-gray-600">⏱</span>
                        Break: {mode === 'recovery' ? '∞' : '2h:00m'}
                    </span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden z-10 relative">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <aside className="w-72 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col gap-5 border-r border-cyan-500/10">
                        <InboxPanel totalFiles={filesQueue.length} processedCount={processedCount} />
                        <VERAAssistant message={veraMessage} onMessageComplete={() => setVeraMessage(null)} />
                    </aside>

                    <main className="flex-1 flex items-center justify-center p-8 relative">
                        {currentFile ? (
                            <FileProcessor
                                file={currentFile}
                                isActive={activeId !== null && !isOverriding}
                                showTutorial={mode === 'normal' && currentFileIndex < 2}
                                webcamImage={webcamImage}
                                isEliminateMode={isEliminateMode}
                            />
                        ) : (
                            mode === 'recovery' && showTerminationOption ? (
                                <div className="text-center">
                                    <p className="text-gray-500 mb-4 animate-pulse">Waiting for new data...</p>
                                </div>
                            ) : (
                                <div className="text-gray-500 font-mono text-sm animate-pulse">
                                    LOADING NEXT FILE...
                                </div>
                            )
                        )}

                        {/* Override overlay */}
                        <AnimatePresence>
                            {isOverriding && (
                                <motion.div
                                    className="absolute inset-0 bg-red-900/20 flex items-center justify-center z-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="bg-red-900/80 text-white px-8 py-4 rounded-lg border-2 border-red-500"
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    >
                                        <p className="text-lg font-bold text-center">⚠️ V.E.R.A. OVERRIDE ⚠️</p>
                                        <p className="text-sm text-center mt-2">Classification corrected.</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Elimination sequence overlay (drag own photo to eliminate) */}
                        <AnimatePresence>
                            {isEliminating && (
                                <motion.div
                                    className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        x: [0, -8, 6, -6, 4, 0, -3, 2, 0],
                                        y: [0, 4, -6, 4, -2, 0, 2, -2, 0],
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ opacity: { duration: 0.2 }, x: { duration: 1.2, times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.82, 0.92, 1] }, y: { duration: 1.2, times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.82, 0.92, 1] } }}
                                >
                                    {/* Red flash / vignette */}
                                    <motion.div
                                        className="absolute inset-0 bg-red-900/80"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 0.9, 0.6, 0.85, 0.7, 0.9] }}
                                        transition={{ duration: 1.5, times: [0, 0.15, 0.4, 0.6, 0.8, 1] }}
                                    />
                                    {/* Scan lines */}
                                    <motion.div
                                        className="absolute inset-0 opacity-40"
                                        style={{
                                            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                                        }}
                                        animate={{ y: [0, 8] }}
                                        transition={{ duration: 0.12, repeat: Infinity }}
                                    />
                                    {/* Glitch text */}
                                    <motion.div
                                        className="relative text-center"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{
                                            scale: [0.5, 1.2, 1],
                                            opacity: [0, 1, 1],
                                            x: [0, -4, 2, -2, 0],
                                        }}
                                        transition={{ duration: 1, times: [0, 0.25, 0.6, 0.75, 0.9, 1] }}
                                    >
                                        <p className="text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(255,0,0,0.8)' }}>
                                            ELIMINATION CONFIRMED
                                        </p>
                                        <motion.p
                                            className="mt-4 text-xl font-mono text-red-200"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0.9, 0.8] }}
                                            transition={{ delay: 0.6, duration: 0.8 }}
                                        >
                                            INITIATING PROTOCOL...
                                        </motion.p>
                                        <motion.div
                                            className="mt-8 text-6xl"
                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.4 }}
                                        >
                                            💀
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Glitch Crash Overlay for Phase 4 transition */}
                        <AnimatePresence>
                            {isCrashing && (
                                <motion.div
                                    className="absolute inset-0 z-[100] pointer-events-none overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        x: [0, -10, 8, -6, 4, -2, 0],
                                        y: [0, 5, -8, 4, -3, 2, 0],
                                    }}
                                    transition={{
                                        opacity: { duration: 0.1 },
                                        x: { duration: 0.5, repeat: 4 },
                                        y: { duration: 0.5, repeat: 4 },
                                    }}
                                >
                                    {/* Red/Purple vignette flash */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-purple-900/60 to-red-900/80"
                                        animate={{ opacity: [0, 0.8, 0.4, 0.9, 0.5, 0.8] }}
                                        transition={{ duration: 2, times: [0, 0.1, 0.3, 0.5, 0.7, 1] }}
                                    />

                                    {/* Scan lines */}
                                    <motion.div
                                        className="absolute inset-0 opacity-60"
                                        style={{
                                            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                                        }}
                                        animate={{ y: [0, 8] }}
                                        transition={{ duration: 0.1, repeat: Infinity }}
                                    />

                                    {/* Horizontal glitch bars */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-8 bg-cyan-500/30"
                                        style={{ top: '20%' }}
                                        animate={{
                                            x: [-100, 100, -50, 0],
                                            opacity: [0, 1, 1, 0],
                                            scaleY: [1, 2, 0.5, 1],
                                        }}
                                        transition={{ duration: 0.3, repeat: 6, repeatDelay: 0.1 }}
                                    />
                                    <motion.div
                                        className="absolute left-0 right-0 h-4 bg-red-500/40"
                                        style={{ top: '60%' }}
                                        animate={{
                                            x: [100, -100, 50, 0],
                                            opacity: [0, 1, 1, 0],
                                        }}
                                        transition={{ duration: 0.2, repeat: 8, repeatDelay: 0.05 }}
                                    />
                                    <motion.div
                                        className="absolute left-0 right-0 h-12 bg-purple-500/30"
                                        style={{ top: '80%' }}
                                        animate={{
                                            x: [-50, 80, -30, 0],
                                            opacity: [0, 0.8, 0.8, 0],
                                        }}
                                        transition={{ duration: 0.25, repeat: 7, repeatDelay: 0.08 }}
                                    />

                                    {/* Glitch text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.div
                                            className="relative"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{
                                                scale: [0.8, 1.1, 1],
                                                opacity: [0, 1, 1],
                                                x: [0, -5, 3, -2, 0],
                                            }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        >
                                            <p
                                                className="text-4xl md:text-6xl font-black text-white tracking-widest"
                                                style={{
                                                    textShadow: '4px 0 0 rgba(0,255,255,0.7), -4px 0 0 rgba(255,0,0,0.7), 0 0 30px rgba(255,0,0,0.8)',
                                                }}
                                            >
                                                CRITICAL ERROR
                                            </p>
                                            {/* RGB split effect */}
                                            <motion.p
                                                className="absolute top-0 left-0 text-4xl md:text-6xl font-black text-cyan-400 tracking-widest opacity-50"
                                                animate={{ x: [-2, 2, -1, 0] }}
                                                transition={{ duration: 0.1, repeat: Infinity }}
                                                style={{ clipPath: 'inset(0 0 50% 0)' }}
                                            >
                                                CRITICAL ERROR
                                            </motion.p>
                                        </motion.div>

                                        <motion.p
                                            className="mt-6 text-lg md:text-xl font-mono text-red-300"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: [0, 1, 0.8], y: 0 }}
                                            transition={{ delay: 0.8, duration: 0.5 }}
                                        >
                                            MEMORY CORRUPTION DETECTED
                                        </motion.p>

                                        <motion.div
                                            className="mt-4 flex gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.2 }}
                                        >
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-3 h-3 rounded-full bg-red-500"
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 1, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    <aside className="w-72 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col gap-5 border-l border-cyan-500/10 relative">
                        <OutputPanels />
                        <MetricsPanel />

                        <AnimatePresence>
                            {showTerminationOption && (
                                <motion.button
                                    className="absolute bottom-4 right-4 text-gray-700 hover:text-red-500 transition-colors flex flex-col items-center gap-1 opacity-50 hover:opacity-100"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    onClick={() => onComplete()}
                                >
                                    <span className="text-2xl">📄</span>
                                    <span className="text-[10px] font-mono">Form 109-R</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </aside>

                    <DragOverlay>
                        {activeId && currentFile && (
                            isEliminateMode && currentFile.type === 'webcam' && webcamImage ? (
                                <motion.div
                                    className="w-80 p-2 rounded-xl shadow-2xl cursor-grabbing overflow-hidden border-4 border-red-500 bg-red-950/90"
                                    animate={{
                                        rotate: [0, -2, 2, 0],
                                        scale: [1, 1.05, 1],
                                        boxShadow: ['0 0 20px rgba(255,0,0,0.5)', '0 0 40px rgba(255,0,0,0.8)', '0 0 20px rgba(255,0,0,0.5)'],
                                    }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                    <img
                                        src={webcamImage}
                                        alt="Subject"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <p className="font-mono text-xs font-bold text-red-200 mt-2 text-center">SUBJECT #402 — DRAG TO ELIMINATE</p>
                                </motion.div>
                            ) : (
                                <div className={`w-80 p-4 rounded shadow-2xl opacity-80 rotate-3 cursor-grabbing ${isEliminateMode ? 'bg-red-900 text-white' : 'bg-white text-black'
                                    }`}>
                                    <p className="font-mono text-sm font-bold">
                                        {currentFile.type === 'text' ? `"${currentFile.content}"` : currentFile.emoji || '📁'}
                                    </p>
                                </div>
                            )
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            <EmployeeCard />
        </motion.div>
    );
}
