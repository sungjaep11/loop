import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../stores/playerStore';

export function EmployeeCard() {
    const capturedPhoto = usePlayerStore((s) => s.capturedPhoto);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
        <motion.div
            className="fixed top-8 right-8 z-50 pointer-events-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 w-64 shadow-2xl flex gap-3 text-white">
                <div className="w-16 h-20 bg-gray-800 rounded overflow-hidden relative flex-shrink-0">
                    {capturedPhoto ? (
                        <img
                            src={capturedPhoto}
                            alt="Employee"
                            className="w-full h-full object-cover grayscale contrast-110"
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-3xl">👤</div>
                            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Employee ID</div>
                    <div className="text-xl font-bold font-mono tracking-widest text-shadow">#000-402</div>
                    <div className="mt-1 flex gap-2">
                        <span className="text-[8px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded border border-green-500/30">ACTIVE</span>
                        <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">LEVEL 1</span>
                    </div>
                </div>
            </div>

            {/* Connector lines decoration */}
            <div className="absolute -top-4 right-10 w-[1px] h-4 bg-white/20"></div>
        </motion.div>
            )}
        </AnimatePresence>
    );
}
