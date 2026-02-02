import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videoScenes = [
    {
        id: 1,
        duration: 4000,
        text: 'WELCOME TO S.A.V.E.',
        subtext: 'Secure Archive for Valuable Emotions',
        subtext2: 'We preserve humanity\'s most precious memories.',
        visual: 'archive',
        accent: 'terminal',
    },
    {
        id: 2,
        duration: 4000,
        text: 'YOU ARE NOT JUST AN EMPLOYEE.',
        subtext: 'You are a guardian of human emotions.',
        subtext2: 'A curator of precious memories.',
        visual: 'guardian',
        accent: 'terminal',
    },
    {
        id: 3,
        duration: 5000,
        text: 'EMOTION CLASSIFICATION SPECIALIST',
        subtext: 'Your role is vital to the Archive.',
        subtext2: 'Every classification helps preserve the beauty of human experience.',
        visual: 'classify',
        accent: 'terminal',
    },
    {
        id: 4,
        duration: 4000,
        text: 'YOU WILL NOT WORK ALONE.',
        subtext: 'Meet V.E.R.A.',
        subtext2: 'Virtual Emotion Recognition Assistant.',
        visual: 'vera',
        accent: 'purple',
    },
    {
        id: 5,
        duration: 500,
        text: '',
        subtext: '',
        subtext2: '',
        visual: 'glitch',
        isGlitch: true,
    },
    {
        id: 6,
        duration: 4000,
        text: 'AT S.A.V.E., WE PROTECT WHAT MATTERS MOST.',
        subtext: 'Your emotions... are safe with us.',
        subtext2: '',
        visual: 'safe',
        accent: 'terminal',
    },
];

const CorporateVideo = ({ onComplete }) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isEnding, setIsEnding] = useState(false);

    useEffect(() => {
        let totalDelay = 0;

        videoScenes.forEach((scene, index) => {
            if (index > 0) {
                setTimeout(() => setCurrentSceneIndex(index), totalDelay);
            }
            totalDelay += scene.duration;
        });

        setTimeout(() => setIsEnding(true), totalDelay);
        setTimeout(() => onComplete(), totalDelay + 3000);
    }, [onComplete]);

    const currentScene = videoScenes[currentSceneIndex];
    const isPurpleAccent = currentScene?.accent === 'purple';

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black overflow-hidden">
            {/* CRT monitor frame */}
            <div
                className="relative w-full max-w-4xl"
                style={{
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                    border: '4px solid #2a2a2a',
                    borderRadius: '8px',
                    boxShadow: `
                        inset 0 0 60px rgba(0,0,0,0.8),
                        0 0 0 2px #333,
                        0 20px 60px rgba(0,0,0,0.9)
                    `,
                }}
            >
                {/* Screen bezel */}
                <div
                    className="relative m-3 rounded overflow-hidden"
                    style={{
                        aspectRatio: '16/10',
                        background: '#050508',
                        border: '1px solid #1a1a1a',
                    }}
                >
                    <AnimatePresence mode="wait">
                        {!isEnding ? (
                            <motion.div
                                key={currentScene.id}
                                className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12"
                                style={{
                                    background: currentScene?.isGlitch
                                        ? 'linear-gradient(135deg, #1a0505 0%, #0a0000 100%)'
                                        : 'linear-gradient(180deg, #0a0a0f 0%, #050508 50%, #0a0a0f 100%)',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Top status bar */}
                                <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-4 border-b border-[#00ff4122] bg-black/60 font-mono text-[10px] text-[#00ff4188]">
                                    <span>S.A.V.E. CORPORATE ORIENTATION v4.02</span>
                                    <span>REC {String(currentSceneIndex + 1).padStart(2, '0')}/{videoScenes.length}</span>
                                </div>

                                {!currentScene?.isGlitch && (
                                    <motion.div
                                        className="text-center max-w-2xl"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h2
                                            className="text-lg md:text-xl font-mono font-bold mb-4 tracking-[0.2em] uppercase"
                                            style={{
                                                color: isPurpleAccent ? '#a855f7' : '#00ff41',
                                                textShadow: isPurpleAccent ? '0 0 20px rgba(168,85,247,0.5)' : '0 0 20px rgba(0,255,65,0.3)',
                                            }}
                                        >
                                            {currentScene.text}
                                        </h2>
                                        <p
                                            className="text-sm md:text-base font-mono mb-1"
                                            style={{ color: 'rgba(0,255,65,0.9)' }}
                                        >
                                            {currentScene.subtext}
                                        </p>
                                        {currentScene.subtext2 && (
                                            <p
                                                className="text-xs md:text-sm font-mono"
                                                style={{ color: 'rgba(0,255,65,0.6)' }}
                                            >
                                                {currentScene.subtext2}
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Bottom scan line effect */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-px opacity-30"
                                    style={{ background: 'linear-gradient(90deg, transparent, #00ff41, transparent)' }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="ending"
                                className="absolute inset-0 flex flex-col items-center justify-center bg-black"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="font-mono text-[#00ff41] text-center">
                                    <p className="text-sm tracking-[0.3em] mb-2">— END OF TRANSMISSION —</p>
                                    <p className="text-xs text-[#00ff4166] tracking-[0.2em]">PROCEEDING TO CONTRACT...</p>
                                </div>
                                <motion.div
                                    className="mt-8 h-px bg-[#00ff4144] rounded-full"
                                    style={{ width: '200px', transformOrigin: 'center' }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 1.5 }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CRT scanlines */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.04]"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
                        }}
                    />
                </div>

                {/* Progress indicator - terminal style */}
                {!isEnding && (
                    <div className="flex items-center gap-2 px-4 py-2 border-t border-[#333] font-mono text-[10px] text-[#00ff4166]">
                        <span>LOADING:</span>
                        <div className="flex-1 h-1 bg-[#1a1a1a] rounded overflow-hidden">
                            <motion.div
                                className="h-full bg-[#00ff4166]"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${((currentSceneIndex + 1) / videoScenes.length) * 100}%`,
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span>{currentSceneIndex + 1}/{videoScenes.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CorporateVideo;
