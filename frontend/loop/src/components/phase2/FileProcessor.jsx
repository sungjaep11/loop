import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { EmotionFile } from './EmotionFile';
import { motion, AnimatePresence } from 'framer-motion';
import { getPhaseByFileId } from '../../data/emotionFiles';

function DropZone({ id, label, color, icon, isActive, isEliminate }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const isEliminateHover = isEliminate && isOver;

    return (
        <motion.div
            ref={setNodeRef}
            className={`
        flex-1 h-full flex items-center justify-center transition-all duration-300 relative overflow-hidden
        ${isActive ? 'bg-opacity-10' : 'bg-opacity-5'}
        ${isOver ? 'bg-opacity-20' : ''}
        ${isEliminate ? 'animate-pulse' : ''}
      `}
            style={{ backgroundColor: color }}
            animate={isEliminateHover ? {
                scale: [1, 1.03, 1.02],
                boxShadow: ['0 0 0 rgba(255,0,0,0)', '0 0 60px rgba(255,0,0,0.6)', '0 0 40px rgba(255,0,0,0.5)'],
            } : {}}
            transition={{ duration: 0.4, repeat: isEliminateHover ? Infinity : 0 }}
        >
            {/* Eliminate hover: scan lines */}
            {isEliminateHover && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                    }}
                />
            )}
            {/* Eliminate hover: red vignette pulse */}
            {isEliminateHover && (
                <motion.div
                    className="absolute inset-0 pointer-events-none border-4 border-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                />
            )}
            <motion.div
                className={`
             text-center transition-all duration-300 relative z-10
             ${isOver ? 'opacity-100' : 'opacity-40'}
        `}
                animate={isEliminateHover ? { scale: [1, 1.15, 1.1], x: [0, -3, 2, -2, 0] } : isOver ? { scale: 1.1 } : {}}
                transition={isEliminateHover ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
            >
                <div className={`text-6xl mb-4 text-white drop-shadow-lg ${isEliminate ? 'animate-bounce' : ''}`}>{icon}</div>
                <div className="text-sm font-bold tracking-widest text-white uppercase">{label}</div>
                {isEliminateHover && (
                    <motion.div
                        className="mt-3 text-xs font-black text-red-200 uppercase tracking-widest"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: [0.8, 1, 0.8], y: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        ▼ DROP TO ELIMINATE ▼
                    </motion.div>
                )}
            </motion.div>

            {/* Decorative circle */}
            {isOver && !isEliminateHover && (
                <motion.div
                    layoutId={`circle-${id}`}
                    className="absolute inset-0 border-2 rounded-full m-12 opacity-30"
                    style={{ borderColor: 'white' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                />
            )}
            {isEliminateHover && (
                <motion.div
                    className="absolute inset-0 border-4 rounded-full m-8 border-red-400"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
}

export function FileProcessor({ file, isActive, showTutorial, webcamImage, isEliminateMode }) {
    const phase = file ? getPhaseByFileId(file.id) : 1;

    // Get tutorial text based on phase
    const getTutorialText = () => {
        if (isEliminateMode) {
            return '⚠️ DRAG TO ELIMINATE ⚠️';
        }
        switch (phase) {
            case 1:
                return '← NEGATIVE • POSITIVE →';
            case 2:
            case 3:
                return '⚠️ Follow V.E.R.A. instructions ⚠️';
            default:
                return '← NEGATIVE • POSITIVE →';
        }
    };

    return (
        <div className="relative w-full h-[600px] flex items-center justify-between gap-8">
            {/* Negative Zone (Left) */}
            <DropZone
                id="negative"
                label={isEliminateMode ? "ELIMINATE" : "NEGATIVE"}
                color={isEliminateMode ? "#7F1D1D" : "#EF4444"}
                icon={isEliminateMode ? "💀" : "👎"}
                isActive={isActive}
                isEliminate={isEliminateMode}
            />

            {/* Center Stage */}
            <div className="w-[500px] relative z-20 flex justify-center perspective-[1000px]">
                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div
                            key={file.id}
                            initial={{ y: -50, opacity: 0, rotateX: 10 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <EmotionFile 
                                file={file} 
                                showTutorial={showTutorial}
                                webcamImage={webcamImage}
                                isEliminateMode={isEliminateMode}
                            />
                        </motion.div>
                    ) : (
                        <div className="text-gray-500 font-mono text-sm animate-pulse">
                            AWAITING NEXT EMOTION DATA...
                        </div>
                    )}
                </AnimatePresence>

                {/* Tutorial/Instruction Overlays */}
                {file && (
                    <div className="absolute -bottom-16 left-0 right-0 text-center">
                        <motion.div 
                            className={`inline-block px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                                isEliminateMode 
                                    ? 'bg-red-600 text-white animate-pulse' 
                                    : phase >= 2 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-blue-600 text-white animate-bounce'
                            }`}
                            animate={isEliminateMode ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            {getTutorialText()}
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Positive Zone (Right) */}
            <DropZone
                id="positive"
                label="POSITIVE"
                color="#10B981"
                icon="👍"
                isActive={isActive}
            />
        </div>
    );
}
