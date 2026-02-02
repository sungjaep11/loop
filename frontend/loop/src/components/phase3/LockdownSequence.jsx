import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { useWebcam } from '../../hooks/useWebcam';
import { usePlayerStore } from '../../stores/playerStore';

export function LockdownSequence() {
    const [stage, setStage] = useState(0); // 0: alert, 1: webcam request, 2: verification
    const [lookAwayCount, setLookAwayCount] = useState(0);
    const [verificationProgress, setVerificationProgress] = useState(0);
    const [mousePath, setMousePath] = useState([]); // For Route B

    // Route A specific
    const [bioStats, setBioStats] = useState({ bpm: 89, compliance: 67, pupil: 23 });

    const centerRef = useRef(null);
    const pathRef = useRef([]); // To keep track without re-rendering too often

    const setScene = useGameStore((s) => s.setScene);
    const setWebcamPermission = useGameStore((s) => s.setWebcamPermission);
    const webcamAllowed = useGameStore((s) => s.webcamAllowed);
    const failCompliance = useGameStore((s) => s.failCompliance);

    const { videoRef, requestWebcam } = useWebcam();
    const webcamStream = usePlayerStore((s) => s.webcamStream);
    const mousePosition = usePlayerStore((s) => s.lastMousePosition);

    // Assign stream to video when it mounts (video only renders in stage 2)
    useEffect(() => {
        if (stage !== 2 || !webcamAllowed || !webcamStream) return;

        const applyStream = () => {
            if (videoRef.current && webcamStream) {
                videoRef.current.srcObject = webcamStream;
                videoRef.current.play().catch(() => {});
            }
        };

        applyStream();
        const retry = setTimeout(applyStream, 100);
        return () => clearTimeout(retry);
    }, [stage, webcamAllowed, webcamStream]);

    const playSFX = useAudioStore((s) => s.playSFX);
    const playAmbient = useAudioStore((s) => s.playAmbient);
    const stopAmbient = useAudioStore((s) => s.stopAmbient);

    useEffect(() => {
        stopAmbient();
        playSFX('alarm'); // Siren starting low and growing

        // Progress through stages
        setTimeout(() => setStage(1), 4000); // 2 seconds + reading time matches logic
    }, [playSFX, stopAmbient]);

    // Route B: Mouse Tracking Logic
    useEffect(() => {
        if (stage === 2 && !webcamAllowed) {
            pathRef.current.push(mousePosition);
            if (pathRef.current.length > 200) pathRef.current.shift(); // Keep trail reasonable
            setMousePath([...pathRef.current]);
        }
    }, [mousePosition, stage, webcamAllowed]);

    // Route A: Biometric Simulation
    useEffect(() => {
        if (stage === 2 && webcamAllowed) {
            const interval = setInterval(() => {
                setBioStats(prev => ({
                    bpm: Math.min(160, prev.bpm + Math.random() * 2),
                    compliance: Math.max(0, prev.compliance - Math.random()),
                    pupil: prev.pupil + Math.random()
                }));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [stage, webcamAllowed]);

    // Stage 2 Progression
    useEffect(() => {
        if (stage !== 2) return;

        const duration = webcamAllowed ? 10 : 15; // 10s or 15s roughly
        const interval = setInterval(() => {
            setVerificationProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setScene('mirror'), 3000);
                    return 100;
                }
                return prev + (100 / (duration * 10)); // Increment to fit duration
            });
        }, 100);

        return () => clearInterval(interval);
    }, [stage, setScene, webcamAllowed]);

    const handleWebcamRequest = async (allow) => {
        if (allow) {
            const success = await requestWebcam();
            if (success) {
                setStage(2);
            } else {
                // Failed to get camera (permission denied by browser)
                setStage(2);
            }
        } else {
            // Webcam denied by user choice
            setWebcamPermission(false);
            setStage(2);
        }
    };

    return (
        <motion.div
            className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Mouse Path Visualization (Route B) */}
            {!webcamAllowed && stage === 2 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                    <polyline
                        points={mousePath.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                    />
                    {/* Current cursor highlight */}
                    <circle cx={mousePosition.x} cy={mousePosition.y} r="10" fill="rgba(255,0,0,0.5)" />
                </svg>
            )}

            {/* Red alert overlay */}
            <motion.div
                className="absolute inset-0 bg-red-900/10 pointer-events-none"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1, repeat: Infinity }}
            />

            <AnimatePresence mode="wait">
                {/* Stage 0: Alert */}
                {stage === 0 && (
                    <motion.div
                        key="alert"
                        className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                        exit={{ opacity: 0 }}
                    >
                        <div className="border-4 border-red-600 bg-black p-8 max-w-4xl shadow-[0_0_50px_rgba(255,0,0,0.5)]">
                            <h1 className="text-4xl font-black text-red-600 mb-6 animate-pulse tracking-widest">
                                🔴🔴🔴 SECURITY ALERT - LEVEL 3 🔴🔴🔴
                            </h1>
                            <div className="text-white text-xl space-y-6 font-bold">
                                <p className="border-b border-red-800 pb-4">
                                    UNAUTHORIZED TERMINATION ATTEMPT DETECTED
                                </p>
                                <div className="text-left bg-red-950/30 p-6 border border-red-900">
                                    <p className="text-red-400 mb-4">EMPLOYEE #402 HAS VIOLATED:</p>
                                    <ul className="space-y-2 text-sm text-red-200">
                                        <li>- Article 3.1 (Follow all V.E.R.A. directives)</li>
                                        <li>- Article 5.2 (Termination procedures)</li>
                                        <li>- Article 6.1 (Special provisions) [CLASSIFIED]</li>
                                    </ul>
                                </div>
                                <p className="text-2xl text-red-500 animate-pulse pt-4">
                                    INITIATING COMPLIANCE VERIFICATION PROTOCOL
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stage 1: Webcam request */}
                {stage === 1 && (
                    <motion.div
                        key="webcam"
                        className="border-2 border-white bg-black p-12 max-w-2xl text-center shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h2 className="text-3xl text-white mb-8 border-b pb-4">ATTENTION, EMPLOYEE #402</h2>
                        <div className="text-lg text-gray-300 space-y-6 mb-8">
                            <p>We need to verify that you are still... you.</p>
                            <p className="text-red-400">Please enable camera access for verification.</p>
                        </div>

                        <div className="flex flex-col gap-4 items-center">
                            <button
                                onClick={() => handleWebcamRequest(true)}
                                className="px-8 py-4 bg-white text-black font-bold text-xl hover:bg-gray-200 tracking-widest border-2 border-transparent hover:border-white transition-all w-full"
                            >
                                [ ENABLE CAMERA ]
                            </button>
                            <button onClick={() => handleWebcamRequest(false)} className="text-xs text-gray-600 hover:text-red-500 mt-4">
                                (Refuse Request)
                            </button>
                        </div>

                        <p className="text-xs text-gray-600 mt-8 italic">
                            (This is mandatory per Article 6.1 of your agreement)
                        </p>
                    </motion.div>
                )}

                {/* Stage 2: Verification (Split Paths) */}
                {stage === 2 && (
                    <motion.div
                        key="verification"
                        className="w-full h-full relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {webcamAllowed ? (
                            /* ROUTE A: WEBCAM ALLOWED */
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="absolute top-10 text-center space-y-2 z-20">
                                    <h2 className="text-4xl font-bold text-red-600 bg-black/50 px-4">LOOK AT THE CENTER OF YOUR SCREEN</h2>
                                    <p className="text-xl text-white tracking-[0.5em] bg-black/50">DO NOT LOOK AWAY</p>
                                    <p className="text-sm text-red-400 animate-pulse">WE ARE ANALYZING YOUR RESPONSE</p>
                                </div>

                                {/* Central Target */}
                                <div className="w-96 h-96 border-4 border-red-600 rounded-full flex items-center justify-center relative">
                                    <div className="w-4 h-4 bg-red-600 rounded-full animate-ping" />
                                    <div className="absolute inset-0 border border-red-900 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                                    <div className="absolute inset-0 border border-red-900 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                                </div>

                                {/* Webcam Feed Box */}
                                <div className="absolute bottom-10 right-10 w-64 border-2 border-red-600 bg-black z-20">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover opacity-50 grayscale" />
                                    <div className="p-2 border-t border-red-600 text-[10px] text-red-500 font-mono bg-black/80">
                                        <p className="text-white font-bold border-b border-red-900 mb-1">BIOMETRIC ANALYSIS</p>
                                        <p>Eye tracking: ACTIVE</p>
                                        <p>Pupil dilation: +{Math.floor(bioStats.pupil)}%</p>
                                        <p>Micro-expressions: FEAR</p>
                                        <p>Heart rate est.: {Math.floor(bioStats.bpm)} BPM</p>
                                        <p className="mt-2 text-white">Compliance level: {Math.floor(bioStats.compliance)}%</p>
                                        <div className="mt-1 w-full h-1 bg-red-900">
                                            <div className="h-full bg-red-500" style={{ width: `${bioStats.compliance}%` }} />
                                        </div>
                                        <p className="mt-1 animate-pulse">Status: ANALYZING...</p>
                                    </div>
                                </div>

                                {verificationProgress >= 100 && (
                                    <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
                                        <div className="text-center">
                                            <h1 className="text-4xl text-green-500 font-bold mb-4">VERIFICATION COMPLETE</h1>
                                            <p className="text-white text-xl">SUBJECT: FEARFUL BUT CONTROLLABLE</p>
                                            <p className="text-gray-500 mt-4">PROCEEDING TO FINAL PHASE</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ROUTE B: WEBCAM DENIED */
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                {/* Completion overlay - shown before transition to mirror */}
                                {verificationProgress >= 100 ? (
                                    <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
                                        <div className="text-center">
                                            <h1 className="text-4xl text-green-500 font-bold mb-4">ANALYSIS COMPLETE</h1>
                                            <p className="text-white text-xl">SUBJECT: OBSERVABLE THROUGH ALTERNATIVE MEANS</p>
                                            <p className="text-gray-500 mt-4">PROCEEDING TO FINAL PHASE</p>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="text-center space-y-8 z-20 bg-black/50 p-8 pointer-events-none"
                                    >
                                        <h1 className="text-6xl text-white font-bold tracking-tighter">CAMERA ACCESS DENIED</h1>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 4 }}
                                            className="space-y-4"
                                        >
                                            <p className="text-2xl text-red-500">INTERESTING</p>
                                            <p className="text-white">YOU THINK THAT PROTECTS YOU?</p>
                                            <p className="text-white">WE DON'T NEED YOUR CAMERA</p>
                                            <p className="text-red-500 text-3xl font-bold">WE HAVE OTHER WAYS</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 8 }}
                                            className="space-y-4 pt-8"
                                        >
                                            <p className="text-red-400">YOUR CURSOR TELLS US EVERYTHING</p>
                                            <p className="text-gray-400 text-sm">THE HESITATION BEFORE CLICKING...</p>
                                            <p className="text-gray-400 text-sm">THE TREMBLING MOVEMENTS...</p>
                                            <p className="text-gray-400 text-sm">THE DESPERATE SEARCH FOR AN EXIT...</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 12 }}
                                            className="pt-8"
                                        >
                                            <p className="text-4xl text-white font-bold">WE SEE YOUR FEAR, #402</p>
                                            <p className="text-red-600 text-xl tracking-widest mt-2">WE ALWAYS HAVE</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
