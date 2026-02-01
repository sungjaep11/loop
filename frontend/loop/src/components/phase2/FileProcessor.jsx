import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ClaimFile } from './ClaimFile';
import { motion, AnimatePresence } from 'framer-motion';

function DropZone({ id, label, color, icon, isActive, isOver }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`
        flex-1 h-full flex items-center justify-center transition-all duration-300 relative overflow-hidden
        ${isActive ? 'bg-opacity-10' : 'bg-opacity-5'}
        ${isOver ? 'bg-opacity-20 scale-105' : ''}
      `}
            style={{ backgroundColor: color }}
        >
            <div className={`
             text-center transition-all duration-300
             ${isOver ? 'opacity-100 scale-110' : 'opacity-40'}
        `}>
                <div className="text-6xl mb-4 text-white drop-shadow-lg">{icon}</div>
                <div className="text-sm font-bold tracking-widest text-white uppercase">{label}</div>
            </div>

            {/* Decorative circle */}
            {isOver && (
                <motion.div
                    layoutId={`circle-${id}`}
                    className="absolute inset-0 border-2 rounded-full m-12 opacity-30"
                    style={{ borderColor: 'white' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                />
            )}
        </div>
    );
}

export function FileProcessor({ file, isActive, showTutorial, onTutorialComplete }) {

    return (
        <div className="relative w-full h-[600px] flex items-center justify-between gap-8">
            {/* Reject/Hold Zone (Left) */}
            <DropZone
                id="hold"
                label="HOLD / REJECT"
                color="#EF4444"
                icon="✕"
                isActive={isActive}
            />

            {/* Center Stage */}
            <div className="w-[450px] relative z-20 flex justify-center perspective-[1000px]">
                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div
                            key={file.id}
                            initial={{ y: -50, opacity: 0, rotateX: 10 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <ClaimFile file={file} showTutorial={showTutorial} />
                        </motion.div>
                    ) : (
                        <div className="text-gray-500 font-mono text-sm animate-pulse">
                            WAITING FOR NEXT FILE...
                        </div>
                    )}
                </AnimatePresence>

                {/* Tutorial Overlays */}
                {showTutorial && file && (
                    <div className="absolute -bottom-20 left-0 right-0 text-center">
                        <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold animate-bounce shadow-lg">
                            DRAG LEFT TO REJECT • DRAG RIGHT TO APPROVE
                        </div>
                    </div>
                )}
            </div>

            {/* Approve Zone (Right) */}
            <DropZone
                id="approve"
                label="APPROVE"
                color="#10B981"
                icon="✓"
                isActive={isActive}
            />
        </div>
    );
}
