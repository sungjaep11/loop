import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videoScenes = [
    {
        id: 1,
        duration: 4000,
        text: 'Welcome to NEOGEN Corporation.',
        subtext: "For over three decades, we've been at the forefront of healthcare data management.",
        visual: 'office',
    },
    {
        id: 2,
        duration: 4000,
        text: "Here at NEOGEN, you're not just an employee.",
        subtext: "You're family. A family of over 12,000 dedicated professionals worldwide.",
        visual: 'employees',
    },
    {
        id: 3,
        duration: 5000,
        text: 'Your role as a Medical Claims Data Specialist is vital.',
        subtext: 'Every file you process represents a real person. A patient waiting for care.',
        visual: 'paperwork',
    },
    {
        id: 4,
        duration: 4000,
        text: "You won't be working alone.",
        subtext: 'Meet AIDRA - your Automated Intelligence for Data Review and Analysis.',
        visual: 'aidra',
    },
    {
        id: 5,
        duration: 500,
        text: '',
        subtext: '',
        visual: 'glitch',
        isGlitch: true,
    },
    {
        id: 6,
        duration: 4000,
        text: 'Remember: At NEOGEN, we see the bigger picture.',
        subtext: 'And now... so will you.',
        visual: 'ceo',
    },
];

const CorporateVideo = ({ onComplete }) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isEnding, setIsEnding] = useState(false);

    useEffect(() => {
        let totalDelay = 0;

        videoScenes.forEach((scene, index) => {
            if (index > 0) {
                setTimeout(() => {
                    setCurrentSceneIndex(index);
                }, totalDelay);
            }
            totalDelay += scene.duration;
        });

        // End video
        setTimeout(() => {
            setIsEnding(true);
        }, totalDelay);

        setTimeout(() => {
            onComplete();
        }, totalDelay + 3000);
    }, [onComplete]);

    const currentScene = videoScenes[currentSceneIndex];

    return (
        <div style={{
            position: 'absolute', inset: 0,
            background: '#000',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px'
        }}>
            {/* VHS Effect Container */}
            <div style={{
                position: 'relative',
                width: '100%', maxWidth: '800px',
                aspectRatio: '4/3',
                background: '#16213e',
                border: '4px solid #333',
                overflow: 'hidden',
                boxShadow: '0 0 50px rgba(0,0,0,0.5)'
            }}>

                {/* Scanlines */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                }}></div>

                <AnimatePresence mode="wait">
                    {!isEnding ? (
                        <motion.div
                            key={currentScene.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                width: '100%', height: '100%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                background: currentScene.isGlitch ? '#300' : '#1a1a2e',
                                position: 'relative',
                                padding: '40px',
                                color: '#eee',
                                textAlign: 'center'
                            }}
                        >
                            {/* Visual Placeholder */}
                            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>
                                {currentScene.visual === 'office' && '🏢'}
                                {currentScene.visual === 'employees' && '👥'}
                                {currentScene.visual === 'paperwork' && '📄'}
                                {currentScene.visual === 'aidra' && '👁️'}
                                {currentScene.visual === 'glitch' && '⚠️'}
                                {currentScene.visual === 'ceo' && '👤'}
                            </div>

                            {!currentScene.isGlitch && (
                                <>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: "'Arial', sans-serif", fontWeight: 'bold' }}>
                                        {currentScene.text}
                                    </h2>
                                    <p style={{ fontSize: '1rem', color: '#aaa', maxWidth: '600px', lineHeight: '1.5' }}>
                                        {currentScene.subtext}
                                    </p>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                width: '100%', height: '100%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                background: '#000',
                                color: '#fff',
                                fontFamily: "'Space Mono', monospace"
                            }}
                        >
                            <div>END OF TAPE.</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>PROCEEDING TO CONTRACT...</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* VHS OSD */}
                <div style={{
                    position: 'absolute', top: '20px', left: '20px',
                    fontFamily: "'Courier New', monospace",
                    color: '#fff',
                    fontSize: '1.2rem',
                    textShadow: '2px 2px 0 #000',
                    zIndex: 20
                }}>
                    PLAY ▶
                </div>
            </div>
        </div>
    );
};

export default CorporateVideo;
