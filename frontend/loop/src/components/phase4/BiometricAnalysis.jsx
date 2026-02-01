import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function BiometricAnalysis() {
    const [pulse, setPulse] = useState(72);
    const [fear, setFear] = useState(12);

    useEffect(() => {
        // Simulate rising stats
        const interval = setInterval(() => {
            setPulse(p => Math.min(145, p + Math.random() * 2));
            setFear(f => Math.min(99, f + Math.random()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="absolute top-4 right-4 bg-black/50 p-4 border border-terminal-green font-mono text-xs z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="mb-2 text-terminal-green text-opacity-50">BIOMETRIC TRACKING - LIVE</div>

            <div className="flex justify-between items-center mb-1">
                <span className="text-white">HEART_RATE:</span>
                <span className={pulse > 100 ? "text-red-500 animate-pulse" : "text-terminal-green"}>
                    {Math.floor(pulse)} BPM
                </span>
            </div>

            <div className="w-32 h-2 bg-gray-900 mb-4 overflow-hidden">
                <motion.div
                    className="h-full bg-red-600"
                    animate={{ width: `${(pulse / 180) * 100}%` }}
                />
            </div>

            <div className="flex justify-between items-center mb-1">
                <span className="text-white">CORTISOL_LEVELS:</span>
                <span className={fear > 50 ? "text-red-500" : "text-terminal-green"}>
                    {Math.floor(fear)}%
                </span>
            </div>

            <div className="w-32 h-2 bg-gray-900 overflow-hidden">
                <motion.div
                    className="h-full bg-purple-600"
                    animate={{ width: `${fear}%` }}
                />
            </div>

            {fear > 80 && (
                <div className="mt-4 text-red-500 font-bold animate-pulse text-center">
                    ⚠ SUBJECT UNSTABLE ⚠
                </div>
            )}
        </motion.div>
    );
}
