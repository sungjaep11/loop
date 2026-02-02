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

    // Handle Phase 4 webcam
    useEffect(() => {
        if (currentFile && currentFile.type === 'webcam') {
            setWebcamImage(capturedPhoto);
            setIsEliminateMode(true);
            
            // V.E.R.A. dramatic reveal
            setTimeout(() => {
                setVeraMessage({
                    text: "Analyzing subject...",
                    duration: 2000,
                    type: 'warning'
                });
            }, 1000);
            
            setTimeout(() => {
                setVeraMessage({
                    text: currentFile.veraMessage,
                    duration: 6000,
                    type: 'error'
                });
            }, 3500);
        } else {
            setIsEliminateMode(false);
        }
    }, [currentFile, capturedPhoto]);

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
                    duration: 5000,
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
                }, 5500);
                
                setActiveId(null);
                return;
            }
        }

        // Normal processing (Phase 1 or correct Phase 2/3 choice)
        playSFX('success');
        
        // Phase 4 - Eliminate button triggers glitch
        if (isEliminateMode && action === 'negative') {
            setVeraMessage({
                text: "ELIMINATION CONFIRMED. INITIATING PROTOCOL...",
                duration: 3000,
                type: 'error'
            });
            
            setTimeout(() => {
                // Trigger Critical Error and transition
                onComplete();
            }, 3500);
            
            setActiveId(null);
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
            setCurrentFile(null);
            setTimeout(() => {
                setCurrentFileIndex(nextIndex);
                const nextFile = filesQueue[nextIndex];
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
                        duration: 4000,
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
                    className={`absolute top-0 left-0 right-0 h-1 ${
                        currentPhase === 2 ? 'bg-yellow-500' :
                        currentPhase === 3 ? 'bg-orange-500' :
                        'bg-red-600'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                />
            )}

            {/* Header bar */}
            <header className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white tracking-widest">S.A.V.E.</span>
                    <span className="text-xs text-gray-500 uppercase">
                        Emotion Classification System v9.4 {mode === 'recovery' ? '(RECOVERED)' : ''}
                    </span>
                    {currentPhase > 1 && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                            currentPhase === 2 ? 'bg-yellow-500 text-black' :
                            currentPhase === 3 ? 'bg-orange-500' :
                            'bg-red-600 animate-pulse'
                        }`}>
                            PHASE {currentPhase}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-400 font-mono">
                    <span>🕐 {mode === 'recovery' ? '09:00 AM' : new Date().toLocaleTimeString()}</span>
                    <span>📊 {processedCount}/{filesQueue.length}</span>
                    <span>☕ Break in: {mode === 'recovery' ? '∞' : '2h 00m'}</span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden z-10 relative">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <aside className="w-72 bg-gray-900/50 p-6 flex flex-col gap-6 border-r border-gray-800 backdrop-blur-sm">
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
                    </main>

                    <aside className="w-72 bg-gray-900/50 p-6 flex flex-col gap-6 border-l border-gray-800 backdrop-blur-sm relative">
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
                            <div className={`w-80 p-4 rounded shadow-2xl opacity-80 rotate-3 cursor-grabbing ${
                                isEliminateMode ? 'bg-red-900 text-white' : 'bg-white text-black'
                            }`}>
                                <p className="font-mono text-sm font-bold">
                                    {currentFile.type === 'text' ? `"${currentFile.content}"` : currentFile.emoji || '📁'}
                                </p>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            <EmployeeCard />
            <footer className="bg-gray-900 px-4 py-1 text-[10px] text-gray-500 flex items-center justify-between border-t border-gray-800 z-10 font-mono">
                <span>Terminal: WS-1987-402</span>
                <span>Status: <span className={currentPhase >= 3 ? 'text-orange-500' : 'text-green-500'}>●</span> {
                    mode === 'recovery' ? 'MONITORED' : 
                    currentPhase >= 3 ? 'ELEVATED MONITORING' : 
                    'SIGNAL STABLE'
                }</span>
            </footer>
        </motion.div>
    );
}
