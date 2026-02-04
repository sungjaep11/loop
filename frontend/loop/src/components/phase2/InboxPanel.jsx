import React from 'react';
import { motion } from 'framer-motion';

export function InboxPanel({ totalFiles, processedCount }) {
    const remaining = Math.max(0, totalFiles - processedCount);
    const progress = totalFiles > 0 ? (processedCount / totalFiles) * 100 : 0;

    return (
        <div className="rounded-xl p-5 border border-cyan-500/20 backdrop-blur-md bg-gradient-to-br from-slate-900/80 to-slate-800/80 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.15em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Incoming Queue
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">STREAM_ACTIVE</span>
            </div>

            {/* File stack visualization */}
            <div className="space-y-2 mb-4">
                {Array.from({ length: Math.min(5, remaining) }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-9 rounded-lg border border-cyan-500/20 relative overflow-hidden"
                        style={{
                            opacity: 1 - (i * 0.15),
                            transform: `scale(${1 - (i * 0.03)})`,
                            background: 'linear-gradient(90deg, rgba(0,40,60,0.5) 0%, rgba(0,60,80,0.3) 100%)',
                        }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 - (i * 0.15) }}
                        transition={{ delay: i * 0.1 }}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.05) 50%, transparent 100%)',
                            }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                        />
                        {/* File indicator */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <div className="w-1 h-4 rounded-full bg-cyan-500/30" />
                            <div className="w-12 h-1 rounded-full bg-cyan-500/20" />
                        </div>
                    </motion.div>
                ))}
                {remaining === 0 && (
                    <div className="h-9 rounded-lg border border-dashed border-gray-700 flex items-center justify-center">
                        <span className="text-[10px] text-gray-600 font-mono">QUEUE EMPTY</span>
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div className="mb-3">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="pt-3 border-t border-gray-800/50 flex justify-between text-xs font-mono">
                <span className="text-gray-500">PENDING:</span>
                <span className="text-cyan-400 font-bold">{remaining} <span className="text-gray-600">FILES</span></span>
            </div>
        </div>
    );
}
