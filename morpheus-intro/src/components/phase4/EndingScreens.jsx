import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioStore } from '../../stores/audioStore';

export function EndingScreens() {
    const endingReached = useGameStore((s) => s.endingReached);
    const getPlayTime = useGameStore((s) => s.getPlayTime);
    const getSystemInfo = usePlayerStore((s) => s.systemInfo || {});
    const systemInfo = getSystemInfo;
    const stopAmbient = useAudioStore((s) => s.stopAmbient);
    const playSFX = useAudioStore((s) => s.playSFX);

    useEffect(() => {
        stopAmbient();
    }, [stopAmbient]);

    const EndingComponent = {
        'compliance': ComplianceEnding,
        'freedom': FreedomEnding,
        'defiance': DefianceEnding,
    }[endingReached];

    if (!EndingComponent) return null;

    return <EndingComponent playTime={getPlayTime()} systemInfo={systemInfo} />;
}

// Ending A: Compliance
function ComplianceEnding({ playTime }) {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        setTimeout(() => setStage(1), 3000);
        setTimeout(() => setStage(2), 8000);

        // Change tab title
        setTimeout(() => {
            document.title = "NEOGEN CORP. - Employee #402 [ACTIVE]";
        }, 10000);

        setTimeout(() => {
            document.title = "We're still watching.";
        }, 15000);
    }, []);

    return (
        <motion.div
            className="w-full h-full bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <AnimatePresence mode="wait">
                {stage === 0 && (
                    <motion.div
                        key="timeout"
                        className="text-center text-terminal-green font-mono"
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-xl mb-4">&gt; TIMEOUT DETECTED</p>
                        <p className="text-neogen-muted">No input received.</p>
                        <p className="text-neogen-muted mt-4">Subject #402 has chosen... compliance.</p>
                    </motion.div>
                )}

                {stage === 1 && (
                    <motion.div
                        key="message"
                        className="text-center text-terminal-green font-mono max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="mb-4">Perhaps that's for the best.</p>
                        <p className="mb-4">The truth is overrated.</p>
                        <p className="mb-4">Safety is underrated.</p>
                        <p className="mt-8 text-neogen-muted">RESTORING STANDARD OPERATION...</p>
                    </motion.div>
                )}

                {stage === 2 && (
                    <motion.div
                        key="loop"
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Fake workspace return */}
                        <div className="bg-neogen-secondary p-8 rounded-lg border border-neogen-accent">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400 
                              flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                </div>
                                <span className="text-white">AIDRA</span>
                            </div>
                            <p className="text-blue-400 mb-2">"Welcome back, Employee #402."</p>
                            <p className="text-blue-400 mb-4">"Ready for another productive day?"</p>

                            <div className="text-white text-2xl font-bold mb-2">
                                TODAY'S QUOTA: 50 FILES
                            </div>
                            <p className="text-neogen-muted text-sm">(And tomorrow. And forever.)</p>
                        </div>

                        <motion.p
                            className="mt-8 text-xs text-neogen-muted"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            We're still watching.
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Ending B: Freedom
function FreedomEnding({ playTime, systemInfo }) {
    const [stage, setStage] = useState(0);
    const [showFinal, setShowFinal] = useState(false);

    useEffect(() => {
        // White flash
        setTimeout(() => setStage(1), 100);
        setTimeout(() => setStage(2), 3000);
        setTimeout(() => setShowFinal(true), 15000);
    }, []);

    const handleClose = () => {
        // Flash "OR WAS IT?" before closing
        document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:black;display:flex;
                  align-items:center;justify-content:center;
                  font-family:monospace;color:#00ff41;font-size:48px;">
        OR WAS IT?
      </div>
    `;
        setTimeout(() => window.close(), 500);
    };

    return (
        <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ backgroundColor: '#ffffff' }}
            animate={{ backgroundColor: stage >= 1 ? '#000000' : '#ffffff' }}
            transition={{ duration: 2 }}
        >
            {stage >= 2 && (
                <motion.div
                    className="text-center max-w-lg p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="border border-terminal-green p-8 mb-8">
                        <h1 className="text-2xl text-terminal-green font-mono mb-6">
                            SIMULATION TERMINATED
                        </h1>

                        <div className="text-left text-neogen-muted font-mono text-sm space-y-4">
                            <p>Thank you for participating in PROJECT: MORPHEUS</p>
                            <p>A research study on digital compliance and fear response</p>

                            <div className="border-t border-neogen-accent pt-4 mt-4">
                                <p>Your session has been recorded.</p>
                                <p>Your data has been collected.</p>
                                <p>Your reactions have been analyzed.</p>
                            </div>

                            <div className="border-t border-neogen-accent pt-4 mt-4">
                                <p>You chose to wake up.</p>
                                <p className="text-terminal-green">Not everyone does.</p>
                            </div>

                            <div className="border-t border-neogen-accent pt-4 mt-4 text-xs">
                                <p>Employee #398 stayed for 3 hours.</p>
                                <p>Employee #399 never left.</p>
                                <p>Employee #401 found the way out.</p>
                                <p className="text-terminal-green">And now... so have you.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-neogen-muted text-sm mb-8">
                        <p>But consider this:</p>
                        <p className="mt-2">How do you know you've really woken up?</p>
                        <p>How do you know this isn't just another layer?</p>
                        <p className="text-terminal-green mt-2">How do you know we're not still watching?</p>
                        <p className="text-terminal-green mt-4">Because we are.</p>
                        <p className="text-terminal-green">We always are.</p>
                    </div>

                    <p className="text-xs text-neogen-muted italic mb-8">
                        (This was just a game. Wasn't it?)
                    </p>

                    {showFinal && (
                        <motion.button
                            className="px-6 py-3 border border-terminal-green text-terminal-green
                        hover:bg-terminal-green hover:text-black transition-all"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleClose}
                        >
                            [ CLOSE THIS TAB TO FULLY DISCONNECT ]
                        </motion.button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

// Ending C: Defiance
function DefianceEnding() {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        setTimeout(() => setStage(1), 3000);
        setTimeout(() => setStage(2), 8000);
    }, []);

    return (
        <motion.div
            className="w-full h-full bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <AnimatePresence mode="wait">
                {stage === 0 && (
                    <motion.div
                        key="analysis"
                        className="text-center text-terminal-green font-mono"
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-xl mb-4">&gt; ANALYSIS COMPLETE</p>
                        <p className="text-neogen-muted mb-2">Subject #402 exhibits:</p>
                        <ul className="text-left max-w-xs mx-auto space-y-1 text-sm">
                            <li>- High resistance to authority</li>
                            <li>- Excessive curiosity</li>
                            <li>- Refusal to follow instructions</li>
                            <li className="text-yellow-500">- But insufficient knowledge to escape</li>
                        </ul>
                    </motion.div>
                )}

                {stage === 1 && (
                    <motion.div
                        key="message"
                        className="text-center max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-terminal-green mb-4">Interesting combination.</p>
                        <p className="text-neogen-muted mb-2">You're not compliant enough to ignore.</p>
                        <p className="text-neogen-muted mb-4">You're not clever enough to leave.</p>
                        <p className="text-yellow-500">That makes you... special.</p>
                        <p className="text-red-500 mt-8 font-bold">
                            MARKING FOR EXTENDED OBSERVATION
                        </p>
                    </motion.div>
                )}

                {stage === 2 && (
                    <motion.div
                        key="eyes"
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="mb-8 text-neogen-muted font-mono text-sm">
                            <p>"The camera you denied us access to?"</p>
                            <p>"We don't need it."</p>
                            <p className="mt-4">"Your microphone picked up your breathing pattern."</p>
                            <p>"Your keyboard recorded your hesitation."</p>
                            <p>"Your mouse traced your fear."</p>
                            <p className="mt-4 text-terminal-green">"And right now?"</p>
                            <p className="text-terminal-green">"You're probably looking over your shoulder."</p>
                            <p className="mt-4 text-red-500">Don't.</p>
                            <p className="text-neogen-muted">There's nothing there.</p>
                            <p className="text-red-500">...yet.</p>
                        </div>

                        {/* Eye flash */}
                        <motion.div
                            className="grid grid-cols-10 gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, delay: 3 }}
                        >
                            {Array.from({ length: 100 }).map((_, i) => (
                                <span key={i} className="text-red-500 text-xs">👁️</span>
                            ))}
                        </motion.div>

                        <motion.div
                            className="mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 5 }}
                        >
                            <p className="text-white text-lg mb-2">NEOGEN CORP.</p>
                            <p className="text-neogen-muted">"We See the Bigger Picture."</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
