import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioStore } from '../../stores/audioStore';
import { BiometricAnalysis } from './BiometricAnalysis';

export function MirrorScene() {
    const [stage, setStage] = useState(0);
    const [revelationText, setRevelationText] = useState([]);

    const setScene = useGameStore((s) => s.setScene);
    const webcamAllowed = useGameStore((s) => s.webcamAllowed);
    const webcamStream = usePlayerStore((s) => s.webcamStream);
    const systemInfo = usePlayerStore((s) => s.systemInfo);
    const getPlayTime = useGameStore((s) => s.getPlayTime);

    const playAmbient = useAudioStore((s) => s.playAmbient);

    const revelations = [
        "You thought you were processing claims.",
        "You were being processed.",
        "Every file you approved taught us about your judgment.",
        "Every file you held taught us about your suspicion.",
        "Every hesitation taught us about your fear.",
    ];

    useEffect(() => {
        playAmbient('horrorDrone');

        // Progress through stages
        setTimeout(() => setStage(1), 2000);

        // Show revelations one by one
        revelations.forEach((text, index) => {
            setTimeout(() => {
                setRevelationText((prev) => [...prev, text]);
            }, 4000 + index * 3000);
        });

        // Show biometric analysis
        setTimeout(() => setStage(2), 4000 + revelations.length * 3000);

        // Transition to terminal
        setTimeout(() => setScene('terminal'), 4000 + revelations.length * 3000 + 10000);
    }, [playAmbient, setScene]);

    return (
        <motion.div
            className="w-full h-full bg-black flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Matrix code rain effect */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-terminal-green font-mono text-xs whitespace-nowrap"
                        style={{ left: `${i * 5}%` }}
                        initial={{ y: -100 }}
                        animate={{ y: '100vh' }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        {Array.from({ length: 50 }).map((_, j) => (
                            <div key={j}>
                                {String.fromCharCode(0x30A0 + Math.random() * 96)}
                            </div>
                        ))}
                    </motion.div>
                ))}
            </div>

            {/* Webcam feed / Avatar */}
            <div className="relative z-10">
                {webcamAllowed && webcamStream ? (
                    <div className="w-96 h-72 mx-auto mb-8 rounded-lg overflow-hidden 
                         border-2 border-terminal-green relative">
                        <video
                            autoPlay
                            playsInline
                            muted
                            ref={(el) => { if (el) el.srcObject = webcamStream; }}
                            className="w-full h-full object-cover opacity-70"
                            style={{ filter: 'sepia(50%) hue-rotate(70deg)' }}
                        />
                        {/* Green code overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                          to-terminal-green/30 pointer-events-none" />
                    </div>
                ) : (
                    <div className="w-96 h-72 mx-auto mb-8 rounded-lg border-2 border-terminal-green
                         flex items-center justify-center bg-black/50">
                        <motion.div
                            className="text-6xl text-terminal-green"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            👁️
                        </motion.div>
                    </div>
                )}

                {/* Revelation text */}
                <div className="text-center space-y-4 mb-8">
                    {revelationText.map((text, index) => (
                        <motion.p
                            key={index}
                            className="text-lg text-terminal-green font-mono"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {text}
                        </motion.p>
                    ))}
                </div>

                {/* Biometric analysis */}
                {stage >= 2 && <BiometricAnalysis />}

                {/* System info reveal */}
                {stage >= 2 && (
                    <motion.div
                        className="mt-8 p-4 border border-terminal-green bg-black/80 font-mono text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 5 }}
                    >
                        <p className="text-terminal-green mb-2">We know you:</p>
                        <p className="text-neogen-muted">Browser: {systemInfo.browser}</p>
                        <p className="text-neogen-muted">Screen: {systemInfo.screenResolution}</p>
                        <p className="text-neogen-muted">Timezone: {systemInfo.timezone}</p>
                        <p className="text-neogen-muted">
                            Time spent afraid: {Math.floor(getPlayTime() / 60)}m {getPlayTime() % 60}s
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
