import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { EmotionFile } from './EmotionFile';
import { motion, AnimatePresence } from 'framer-motion';
import { getPhaseByFileId } from '../../data/emotionFiles';

function DropZone({ id, label, color, accentColor, icon, isActive, isEliminate }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    const isEliminateHover = isEliminate && isOver;

    return (
        <motion.div
            ref={setNodeRef}
            className={`
                w-32 h-full flex items-center justify-center relative overflow-hidden
                rounded-2xl backdrop-blur-md border transition-all duration-300
                ${isEliminate ? 'animate-pulse' : ''}
            `}
            style={{
                background: isOver
                    ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
                    : `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                borderColor: isOver ? `${accentColor}80` : `${accentColor}30`,
                boxShadow: isOver
                    ? `0 0 40px ${color}30, inset 0 0 30px ${color}10`
                    : `0 0 20px ${color}10`,
            }}
            animate={isEliminateHover ? {
                scale: [1, 1.02, 1.01],
                boxShadow: [
                    `0 0 20px ${color}20`,
                    `0 0 60px ${color}50`,
                    `0 0 40px ${color}40`
                ],
            } : {}}
            transition={{ duration: 0.4, repeat: isEliminateHover ? Infinity : 0 }}
        >
            {/* Gradient overlay */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
                }}
            />

            {/* Scan lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)',
                }}
            />

            {/* Eliminate hover effects */}
            {isEliminateHover && (
                <>
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)',
                        }}
                    />
                    <motion.div
                        className="absolute inset-2 pointer-events-none border-2 border-red-500 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                    />
                </>
            )}

            {/* Content */}
            <motion.div
                className={`text-center relative z-10 transition-all duration-300 ${isOver ? 'opacity-100' : 'opacity-60'}`}
                animate={isEliminateHover
                    ? { scale: [1, 1.1, 1.05], x: [0, -2, 2, 0] }
                    : isOver ? { scale: 1.05 } : {}
                }
                transition={isEliminateHover ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
            >
                <motion.div
                    className={`text-5xl mb-3 drop-shadow-lg ${isEliminate ? 'animate-bounce' : ''}`}
                    style={{ filter: isOver ? `drop-shadow(0 0 10px ${accentColor})` : 'none' }}
                >
                    {icon}
                </motion.div>
                <div
                    className="text-xs font-bold tracking-[0.15em] uppercase"
                    style={{ color: accentColor }}
                >
                    {label}
                </div>
                {isEliminateHover && (
                    <motion.div
                        className="mt-3 text-[10px] font-bold text-red-300 uppercase tracking-wider"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: [0.8, 1, 0.8], y: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        ▼ DROP ▼
                    </motion.div>
                )}
            </motion.div>

            {/* Hover ring effect */}
            <AnimatePresence>
                {isOver && !isEliminateHover && (
                    <motion.div
                        className="absolute inset-4 border-2 rounded-xl pointer-events-none"
                        style={{ borderColor: `${accentColor}50` }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FileProcessor({ file, isActive, showTutorial, webcamImage, isEliminateMode }) {
    const phase = file ? getPhaseByFileId(file.id) : 1;

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
        <div className="relative w-full h-[600px] flex items-center justify-center gap-6">
            {/* Visual connector lines */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute left-[160px] right-[160px] h-[1px] bg-gradient-to-r from-red-500/20 via-gray-700/30 to-green-500/20" />
                <motion.div
                    className="absolute left-[160px] right-[160px] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.3) 50%, transparent 100%)',
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scaleX: [0.9, 1, 0.9],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </div>

            {/* Negative Zone (Left) */}
            <DropZone
                id="negative"
                label={isEliminateMode ? "ELIMINATE" : "NEGATIVE"}
                color={isEliminateMode ? "#7F1D1D" : "#EF4444"}
                accentColor={isEliminateMode ? "#FF6B6B" : "#F87171"}
                icon={isEliminateMode ? "💀" : "👎"}
                isActive={isActive}
                isEliminate={isEliminateMode}
            />

            {/* Center Stage */}
            <div className="flex-1 max-w-xl relative z-20 flex justify-center perspective-[1000px]">
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
                        <motion.div
                            className="text-gray-500 font-mono text-sm"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-cyan-500">●</span> AWAITING NEXT EMOTION DATA...
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tutorial/Instruction Overlays */}
                {file && (
                    <div className="absolute -bottom-14 left-0 right-0 text-center">
                        <motion.div
                            className={`inline-block px-5 py-2.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border ${isEliminateMode
                                    ? 'bg-red-900/60 text-red-100 border-red-500/50 shadow-[0_0_20px_rgba(255,0,0,0.3)]'
                                    : phase >= 2
                                        ? 'bg-purple-900/60 text-purple-100 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                                        : 'bg-cyan-900/60 text-cyan-100 border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                                }`}
                            animate={isEliminateMode ? { scale: [1, 1.03, 1] } : {}}
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
                accentColor="#34D399"
                icon="👍"
                isActive={isActive}
            />
        </div>
    );
}
