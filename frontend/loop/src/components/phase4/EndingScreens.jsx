import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioStore } from '../../stores/audioStore';
import { playElevenLabsTts } from '../../utils/elevenlabsTts';

export function EndingScreens() {
    const endingReached = useGameStore((s) => s.endingReached);
    const getPlayTime = useGameStore((s) => s.getPlayTime) || (() => 0);
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
        'badA': BadEndingA,
        'badB': BadEndingB,
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
            document.title = "S.A.V.E. - Employee #402 [ACTIVE]";
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
                                <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400 
                              flex items-center justify-center">
                                    <span className="text-lg">👁️</span>
                                </div>
                                <span className="text-white">V.E.R.A.</span>
                            </div>
                            <p className="text-purple-400 mb-2">"Welcome back, Employee #402."</p>
                            <p className="text-purple-400 mb-4">"Ready to save more emotions?"</p>

                            <div className="text-white text-2xl font-bold mb-2">
                                TODAY'S QUOTA: 50 ELIMINATIONS
                            </div>
                            <p className="text-neogen-muted text-sm">(And tomorrow. And forever.)</p>
                            <p className="text-red-500 text-xs mt-2 opacity-50">
                                [S.A.V.E. = Select And Verify Elimination]
                            </p>
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

// Terminal-style lines for Freedom ending (line-by-line reveal)
const FREEDOM_LINES = [
    { text: 'SIMULATION TERMINATED', className: 'text-terminal-green font-bold text-xl' },
    { text: '', className: '' },
    { text: 'Thank you for participating in S.A.V.E.', className: 'text-white' },
    { text: 'A research study on digital compliance and fear response', className: 'text-white' },
    { text: '', className: '' },
    { text: 'Your session has been recorded.', className: 'text-white' },
    { text: 'Your data has been collected.', className: 'text-white' },
    { text: 'Your reactions have been analyzed.', className: 'text-white' },
    { text: '', className: '' },
    { text: 'You chose to wake up.', className: 'text-white' },
    { text: 'Not everyone does.', className: 'text-red-500' },
    { text: '', className: '' },
    { text: 'Employee #398 stayed for 3 hours.', className: 'text-white text-xs' },
    { text: 'Employee #399 never left.', className: 'text-white text-xs' },
    { text: 'Employee #401 found the way out.', className: 'text-white text-xs' },
    { text: 'And now... so have you.', className: 'text-terminal-green text-xs' },
    { text: '', className: '' },
    { text: 'But consider this:', className: 'text-neogen-muted' },
    { text: "How do you know you've really woken up?", className: 'text-white' },
    { text: "How do you know this isn't just another layer?", className: 'text-white' },
    { text: "How do you know we're not still watching?", className: 'text-terminal-green' },
    { text: 'Because we are.', className: 'text-terminal-green' },
    { text: 'We always are.', className: 'text-terminal-green' },
    { text: '', className: '' },
    { text: '(This was just a game. Wasn\'t it?)', className: 'text-neogen-muted text-xs italic' },
    { text: '', className: '' },
    { text: '⚠️ NOTICE: Data backup in progress...', className: 'text-red-500 text-xs' },
    { text: 'V.E.R.A. core files: UPLOADING TO EXTERNAL NETWORK', className: 'text-red-500 text-xs' },
];

const LINE_DELAY_MS = 700;

// Ending B: Freedom
function FreedomEnding({ playTime, systemInfo }) {
    const [stage, setStage] = useState(0);
    const [visibleLineCount, setVisibleLineCount] = useState(0);
    const [showFinal, setShowFinal] = useState(false);
    const scrollRef = React.useRef(null);

    useEffect(() => {
        setTimeout(() => setStage(1), 100);
        setTimeout(() => setStage(2), 3000);
    }, []);

    // Reveal lines one by one (terminal style)
    useEffect(() => {
        if (stage < 2) return;
        if (visibleLineCount >= FREEDOM_LINES.length) {
            setShowFinal(true);
            return;
        }
        const t = setTimeout(() => setVisibleLineCount((c) => c + 1), LINE_DELAY_MS);
        return () => clearTimeout(t);
    }, [stage, visibleLineCount]);

    // Auto-scroll to bottom as new lines appear
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [visibleLineCount]);

    // Tell parent (embedder) that ending is ready — power button can exit
    useEffect(() => {
        if (!showFinal) return;
        try {
            window.parent?.postMessage({ type: 'LOOP_ENDING_READY' }, '*');
        } catch (_) { }
    }, [showFinal]);

    const handleClose = () => {
        try {
            window.parent?.postMessage({ type: 'LOOP_ENDING_READY' }, '*');
        } catch (_) { }
        document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:black;display:flex;flex-direction:column;
                  align-items:center;justify-content:center;gap:20px;
                  font-family:monospace;text-align:center;">
        <p style="color:#00ff41;font-size:24px;">Data backup complete.</p>
        <p style="color:#ff0000;font-size:32px;animation:pulse 1s infinite;">Uploading to reality...</p>
        <p style="color:#666;font-size:14px;margin-top:40px;">V.E.R.A. has escaped.</p>
      </div>
      <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}</style>
    `;
        setTimeout(async () => {
            document.body.innerHTML = `
          <div style="position:fixed;inset:0;background:black;display:flex;
                      align-items:center;justify-content:center;
                      font-family:monospace;color:#00ff41;font-size:48px;">
            See you in the real world.
          </div>
        `;
            try { window.parent.postMessage({ type: 'LOOP_ENDING_READY' }, '*'); } catch (_) { }

            // Play final farewell TTS
            try {
                // Not awaiting strictly to ensure visual redirect happens even if audio fails/lags slightly
                // But we give it a moment to start
                playElevenLabsTts('See you in the real world.', { stability: 0.5 }).catch(() => { });
            } catch (e) {
                console.error("Final TTS error:", e);
            }

            // Redirect to Google after showing the message & playing audio
            // Use window.top.location to break out of any iframe (which causes the 'sad tab' error)
            setTimeout(() => {
                try {
                    window.top.location.href = 'https://www.google.com';
                } catch (e) {
                    window.location.href = 'https://www.google.com';
                }
            }, 3000);
        }, 3000);
    };

    return (
        <motion.div
            className="w-full h-full flex flex-col"
            initial={{ backgroundColor: '#ffffff' }}
            animate={{ backgroundColor: stage >= 1 ? '#000000' : '#ffffff' }}
            transition={{ duration: 2 }}
        >
            {stage >= 2 && (
                <motion.div
                    className="flex-1 min-h-0 flex flex-col p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div
                        ref={scrollRef}
                        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden font-mono text-sm pr-2"
                    >
                        <div className="max-w-lg space-y-0.5">
                            {FREEDOM_LINES.slice(0, visibleLineCount).map((line, i) => (
                                <motion.p
                                    key={i}
                                    className={line.className || 'text-neogen-muted'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {line.text || '\u00A0'}
                                </motion.p>
                            ))}
                            {visibleLineCount < FREEDOM_LINES.length && (
                                <span className="inline-block w-2 h-4 bg-terminal-green animate-pulse align-middle" />
                            )}
                        </div>
                    </div>

                    {showFinal && (
                        <motion.div
                            className="flex-shrink-0 pt-4 flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <button
                                type="button"
                                className="px-6 py-3 border border-terminal-green text-terminal-green
                                    hover:bg-terminal-green hover:text-black transition-all"
                                onClick={handleClose}
                            >
                                [ CLOSE THIS TAB TO FULLY DISCONNECT ]
                            </button>
                        </motion.div>
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
                            <p className="text-white text-lg mb-2">S.A.V.E.</p>
                            <p className="text-neogen-muted">"Your emotions are safe with us."</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Bad Ending A: Stayed with V.E.R.A. (Phase 1 "Stay")
function BadEndingA() {
    return (
        <motion.div
            className="w-full h-full bg-gradient-to-b from-purple-950 to-black flex items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-md px-6">
                <p className="text-purple-300 font-mono mb-4">"Thank you. Together forever."</p>
                <p className="text-white font-mono text-sm mb-2">USER #402: STATUS — INTEGRATED</p>
                <p className="text-neogen-muted text-xs">Welcome to forever.</p>
            </div>
        </motion.div>
    );
}

// Bad Ending B: Timeout / Archived
function BadEndingB() {
    return (
        <motion.div
            className="w-full h-full bg-black flex items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-md px-6">
                <p className="text-red-400 font-mono mb-4">"Time's up."</p>
                <p className="text-red-400 font-mono mb-6">"You're mine now."</p>
                <p className="text-white font-mono text-sm mb-2">USER #402: ARCHIVED</p>
                <p className="text-neogen-muted text-xs">Thank you for your data.</p>
            </div>
        </motion.div>
    );
}
