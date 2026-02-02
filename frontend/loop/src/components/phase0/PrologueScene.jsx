import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../../stores/audioStore';

export function PrologueScene({ onComplete }) {
    const [emailOpen, setEmailOpen] = useState(false);
    const playSFX = useAudioStore((s) => s.playSFX);
    const playAmbient = useAudioStore((s) => s.playAmbient);

    React.useEffect(() => {
        playAmbient('fluorescentHum');
    }, []);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
            {/* Ambient Dark Room Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black opacity-90" />

            {/* Glowing Monitor in Center */}
            <motion.div
                className="relative z-10 w-[800px] h-[600px] bg-[#1a1a1a] rounded-lg border-8 border-[#333] shadow-[0_0_100px_rgba(100,200,255,0.1)] overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2 }}
            >
                {/* Screen Content */}
                <div className="flex-1 bg-black relative p-8 font-sans text-gray-300">
                    {/* Fake Email Client Interface */}
                    <div className="border-b border-gray-700 pb-2 mb-4 flex justify-between items-center bg-[#111] p-2 rounded">
                        <span className="font-bold text-white">Inbox (1)</span>
                        <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                    </div>

                    {/* Email List Item */}
                    {!emailOpen && (
                        <motion.div
                            className="bg-[#222] p-4 rounded border-l-4 border-neogen-accent cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                            onClick={() => {
                                setEmailOpen(true);
                                playSFX('click');
                            }}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-white">S.A.V.E. Recruiting</span>
                                <span className="text-xs text-gray-400">Just Now</span>
                            </div>
                            <div className="font-bold text-neogen-accent mb-1">Shape the Future with Us - Job Offer</div>
                            <div className="text-sm text-gray-500 truncate">
                                Dear Candidate, We are pleased to inform you that you have been selected...
                            </div>
                        </motion.div>
                    )}

                    {/* Open Email view */}
                    <AnimatePresence>
                        {emailOpen && (
                            <motion.div
                                className="absolute inset-4 bg-white text-black p-8 rounded shadow-2xl overflow-y-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="border-b-2 border-neogen-accent pb-4 mb-6">
                                    <h1 className="text-2xl font-bold text-neogen-accent">OFFER OF EMPLOYMENT</h1>
                                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                                        <span>From: S.A.V.E. Human Resources</span>
                                        <span>To: Applicant #402</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 text-sm leading-relaxed">
                                    <p>Dear Applicant,</p>
                                    <p>
                                        Congratulations. Your specific skill set in data processing and pattern recognition
                                        has been flagged by our system as <span className="font-bold text-neogen-accent">EXCEPTIONAL</span>.
                                    </p>
                                    <p>
                                        At S.A.V.E. (Secure Archive for Valuable Emotions), we believe in preserving the
                                        best of humanity. You have been chosen to join our elite Data Processing Unit.
                                    </p>
                                    <div className="bg-gray-100 p-4 border-l-4 border-neogen-accent my-6">
                                        <p className="font-bold">Role: Data Verification Specialist</p>
                                        <p>Status: Immediate Start Required</p>
                                    </div>
                                    <p>
                                        Please initialize your workstation immediately to begin the onboarding process.
                                    </p>
                                </div>

                                <motion.button
                                    className="w-full bg-neogen-accent text-white py-4 font-bold text-lg rounded hover:bg-neogen-secondary transition-all shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        playSFX('click');
                                        onComplete(); // Triggers boot sequence
                                    }}
                                >
                                    INITIALIZE WORKSTATION
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Monitor Chin */}
                <div className="h-8 bg-[#222] flex items-center justify-center border-t border-[#444]">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#0f0]" />
                </div>
            </motion.div>

            {/* Table Reflection/Glow */}
            <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-[#1a1a2e]/20 to-transparent pointer-events-none" />
        </div>
    );
}
