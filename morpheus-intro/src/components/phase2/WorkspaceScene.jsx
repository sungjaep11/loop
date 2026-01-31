import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';

import { AIDRAAssistant } from './AIDRAAssistant';
import { InboxPanel } from './InboxPanel';
import { FileProcessor } from './FileProcessor';
import { OutputPanels } from './OutputPanels';
import { MetricsPanel } from './MetricsPanel';
import { EmployeeCard } from '../ui/EmployeeCard';
import { claimFiles, resetFiles } from '../../data/claimFiles';

export default function WorkspaceScene({ onComplete, mode = 'normal' }) {
    const [currentFile, setCurrentFile] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [aidraMessage, setAidraMessage] = useState(null);
    const [filesQueue, setFilesQueue] = useState([]);

    // Phase 3.1: Termination Option
    const [showTerminationOption, setShowTerminationOption] = useState(false);

    const currentScene = useGameStore((s) => s.currentScene);
    const setScene = useGameStore((s) => s.setScene);
    const playSFX = useAudioStore((s) => s.playSFX);
    const playAmbient = useAudioStore((s) => s.playAmbient);

    // Initial Setup
    // Mode is now passed as prop: 'normal' | 'glitch' | 'recovery'

    // HACK: To support the "False Normalcy" scene without changing GameController routes too much,
    // we can check if we are in the 'workspace' scene BUT previous scene was 'glitch'.
    // However, GameController resets components.
    // Let's rely on props. We will update GameController to pass `isFalseNormalcy={true}` 
    // when we want Scene 3.1.

    // Actually, for now, let's just implement the logic to handle `resetFiles` if passed.
    // We'll update GameController to pass `mode="reset"` or similar.

    // Let's assume we receive `mode`.
    // mode = 'normal' | 'glitch' | 'recovery' (False Normalcy)

    useEffect(() => {
        let queue = [];
        if (mode === 'recovery') {
            queue = [...resetFiles];
            playAmbient('officeAmbient'); // Resets to normal-ish

            // False Normalcy specific environment changes
            // (Clock reset, subtle visual changes - handled in render)

            setTimeout(() => {
                setAidraMessage({
                    text: "Welcome back, Employee #402. There was a minor technical issue.",
                    duration: 4000,
                });
            }, 1000);

            setTimeout(() => {
                setAidraMessage({
                    text: "Nothing to worry about. Let's continue where we left off.",
                    duration: 4000,
                });
            }, 5000);

        } else {
            queue = [...claimFiles];
            setTimeout(() => {
                setAidraMessage({
                    text: "Good morning, Employee #402. I am AIDRA, your dedicated work companion.",
                    duration: 4000,
                });
            }, 1000);
        }
        setFilesQueue(queue);

        if (queue.length > 0) {
            setCurrentFile(queue[0]);
        }
    }, [mode]);

    // Auto-approve logic for recovery mode
    useEffect(() => {
        if (mode === 'recovery' && currentFile) {
            const timer = setTimeout(() => {
                // Auto approve effect
                playSFX('success');
                setAidraMessage({ text: "Processing...", duration: 1000 });

                // Move next
                const currentIndex = filesQueue.findIndex(f => f.id === currentFile.id);
                const nextIndex = currentIndex + 1;

                if (nextIndex < filesQueue.length) {
                    setCurrentFile(null);
                    setTimeout(() => setCurrentFile(filesQueue[nextIndex]), 500);
                } else {
                    // Queue finished
                    setCurrentFile(null);
                    setAidraMessage({
                        text: "See? Everything is fine. Just keep processing. Forever.",
                        duration: 5000
                    });

                    // Show termination option
                    setTimeout(() => setShowTerminationOption(true), 2000);
                }
            }, 3000); // 3 seconds per file
            return () => clearTimeout(timer);
        }
    }, [mode, currentFile, filesQueue, playSFX]);


    // Normal Drag Handlers ... (Keep existing logic for normal mode)
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        playSFX('click');
    };

    const handleDragEnd = (event) => {
        const { over } = event;
        if (over && currentFile && mode !== 'recovery') {
            const action = over.id;
            playSFX(action === 'approve' ? 'success' : 'click');

            setAidraMessage({
                text: action === 'approve' ? "Processing accepted." : "Flagged for review.",
                duration: 1500,
                type: 'success'
            });

            const currentIndex = filesQueue.findIndex(f => f.id === currentFile.id);
            const nextIndex = currentIndex + 1;

            if (nextIndex < filesQueue.length) {
                setCurrentFile(null);
                setTimeout(() => setCurrentFile(filesQueue[nextIndex]), 400);
            } else {
                setAidraMessage({ text: "Quota complete. Stand by...", duration: 3000 });
                setTimeout(() => onComplete(), 3000);
            }
        }
        setActiveId(null);
    };

    return (
        <motion.div
            className="w-full h-full bg-[#0a0a0f] flex flex-col text-white overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Background Grid - subtler in recovery */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: mode === 'recovery' ? '38px 38px' : '40px 40px'
                }}>
            </div>

            {/* Header bar */}
            <header className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white tracking-widest">NEOGEN</span>
                    <span className="text-xs text-gray-500 uppercase">
                        Claims Processing System v9.4 {mode === 'recovery' ? '(RECOVERED)' : ''}
                    </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-400 font-mono">
                    {/* Time stuck at 09:00 AM in recovery */}
                    <span>🕐 {mode === 'recovery' ? '09:00 AM' : new Date().toLocaleTimeString()}</span>
                    <span>🌡️ {mode === 'recovery' ? '68°F' : '72°F'}</span>
                    <span>☕ Break in: {mode === 'recovery' ? '∞' : '2h 00m'}</span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden z-10 relative">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <aside className="w-72 bg-gray-900/50 p-6 flex flex-col gap-6 border-r border-gray-800 backdrop-blur-sm">
                        <InboxPanel totalFiles={filesQueue.length} processedCount={0} /> {/* Mock counts */}
                        <AIDRAAssistant message={aidraMessage} onMessageComplete={() => setAidraMessage(null)} />
                    </aside>

                    <main className="flex-1 flex items-center justify-center p-8 relative">
                        {/* File Processor */}
                        {currentFile ? (
                            <FileProcessor
                                file={currentFile}
                                isActive={activeId !== null}
                                showTutorial={mode === 'normal'}
                            />
                        ) : (
                            mode === 'recovery' && showTerminationOption ? (
                                <div className="text-center">
                                    <p className="text-gray-500 mb-4 animate-pulse">Waiting for new claims...</p>
                                </div>
                            ) : null
                        )}
                    </main>

                    <aside className="w-72 bg-gray-900/50 p-6 flex flex-col gap-6 border-l border-gray-800 backdrop-blur-sm relative">
                        <OutputPanels />
                        <MetricsPanel />

                        {/* Hidden Termination Form Icon */}
                        <AnimatePresence>
                            {showTerminationOption && (
                                <motion.button
                                    className="absolute bottom-4 right-4 text-gray-700 hover:text-red-500 transition-colors flex flex-col items-center gap-1 opacity-50 hover:opacity-100"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    onClick={() => onComplete()} // Triggers completion -> ResignationForm
                                >
                                    <span className="text-2xl">📄</span>
                                    <span className="text-[10px] font-mono">Form 109-R</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </aside>

                    <DragOverlay>
                        {activeId && currentFile && (
                            <div className="w-80 p-4 bg-white text-black rounded shadow-2xl opacity-80 rotate-3 cursor-grabbing">
                                <p className="font-mono text-sm font-bold">{currentFile.patientName}</p>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            <EmployeeCard />
            <footer className="bg-gray-900 px-4 py-1 text-[10px] text-gray-500 flex items-center justify-between border-t border-gray-800 z-10 font-mono">
                <span>Terminal: WS-1987-402</span>
                <span>Status: <span className="text-green-500">●</span> {mode === 'recovery' ? 'MONITORED' : 'SIGNAL STABLE'}</span>
            </footer>
        </motion.div>
    );
}
