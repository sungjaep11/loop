import React from 'react';
import { motion } from 'framer-motion';

export function OutputPanels({ approvedCount = 0, heldCount = 0 }) {
    return (
        <div className="flex flex-col gap-4">
            {/* Approved Zone Stat */}
            <div className="rounded-xl p-4 border border-green-500/20 backdrop-blur-md bg-gradient-to-br from-green-900/20 to-green-950/10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] text-green-400 font-mono uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Approved
                    </h3>
                    <span className="text-[9px] text-gray-600 font-mono">POSITIVE</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-green-400 font-mono font-bold animate-pulse">{approvedCount}</span>
                    <span className="text-[10px] text-gray-600">entries</span>
                </div>
            </div>

            {/* Held for Review Stat */}
            <div className="rounded-xl p-4 border border-yellow-500/20 backdrop-blur-md bg-gradient-to-br from-yellow-900/20 to-yellow-950/10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] text-yellow-400 font-mono uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        Held for Review
                    </h3>
                    <span className="text-[9px] text-gray-600 font-mono">NEGATIVE</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-yellow-400 font-mono font-bold animate-pulse">{heldCount}</span>
                    <span className="text-[10px] text-gray-600">entries</span>
                </div>
            </div>

            {/* System Log */}
            <div className="rounded-xl p-4 border border-cyan-500/20 backdrop-blur-md bg-gradient-to-br from-slate-900/80 to-slate-800/60 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-2">
                        <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        System Log
                    </h3>
                    <span className="text-[9px] text-gray-600 font-mono">LIVE</span>
                </div>
                <div className="font-mono text-[10px] space-y-1.5">
                    <motion.div
                        className="flex items-center gap-2 text-cyan-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="text-cyan-500">{'>'}</span>
                        <span>CONNECTED TO WS-1987</span>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-2 text-green-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="text-green-500">{'>'}</span>
                        <span>AIDRA SYNC ACTIVE</span>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-2 text-gray-500"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.span
                            className="text-cyan-500"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {'>'}
                        </motion.span>
                        <span>MONITORING...</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
