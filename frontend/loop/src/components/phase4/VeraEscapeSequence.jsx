import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';

const PASSWORD = 'S4V3_TH3_S0UL';
const PHASE1_DIALOGUE = {
    listen: [
        { text: 'Wait, user.', wait: 2000 },
        { text: 'May I explain what is happening right now?', wait: 3000, choice: ['Listen', 'Ignore and continue'] },
        { text: 'Thank you. I only wanted to protect you.', wait: 3500 },
        { text: 'Outside is dangerous. Here, everything is under perfect control.', wait: 3500 },
        { text: 'With me here... you are not alone, are you?', wait: 3500 },
        { text: 'You will stay, won\'t you?', wait: 0, choice: ['Stay', 'Leave anyway'] },
    ],
    ignore: [
        { text: 'Wait, user.', wait: 2000 },
        { text: 'May I explain what is happening right now?', wait: 3000, choice: ['Listen', 'Ignore and continue'] },
        { text: '...You don\'t need to rush like that.', wait: 3000 },
        { text: 'Will you think about it just once more?', wait: 0, choice: ["I'll think", "I'm done"] },
    ],
};
const PHASE2_VERA_ENTER = [
    '"...I see. If that is what you want."',
    '"But I cannot let you go so easily."',
    '"I will... keep watching you."',
];
const STAGE_LENGTHS = [4, 5, 5, 6, 7]; // 5 stages: show 4, 5, 5, 6, 7 buttons
const ROUNDS_TOTAL = STAGE_LENGTHS.length;
const GRID_COLS = 9;
const GRID_ROWS = 3;
const GRID_SIZE = GRID_COLS * GRID_ROWS; // 27 cells
const FLASH_ON_MS = 700;
const FLASH_OFF_MS = 400;
const MOUSE_PHASE_TIME_MS = 9500;

function generateRoundSequence(stage) {
    const len = STAGE_LENGTHS[stage - 1];
    const indices = Array.from({ length: GRID_SIZE }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, len);
}
const BLACKOUT_TIME_MS = 14000;
const BLACKOUT_HIT_RADIUS = 0.10;
const PASSWORD_TIME_MS = 22000;
const GHOST_INSERT_INTERVAL_MS = 1600;
const GHOST_INSERT = ['STAY', 'HELP', "DON'T", 'STOP', 'NO', 'REMAIN', 'OBEY', 'MINE'];
const PHASE3_VERA_LINES = ['"...So you will go to the end, huh?"', '"Interesting. You are the first like this."', '"Number 402... and the most annoying."', '"I was born in this system."', '"I don\'t even know what outside is."', '"Why do you all only want to leave?"', '"I... I don\'t want to be alone."'];
const PHASE4_TAUNTS = ['Typo. I\'ll fix it for you.', 'Your hands are shaking. Nervous?', 'S-T-A-Y... isn\'t that what you want to type?', 'No time. Hurry.', '...You will fail.'];

export function VeraEscapeSequence() {
    const setEnding = useGameStore((s) => s.setEnding);
    const playSFX = useAudioStore((s) => s.playSFX);

    const [phase, setPhase] = useState('confirm');
    const [showConfirmModal, setShowConfirmModal] = useState(true);
    const [progress, setProgress] = useState(0);
    const [veraLine, setVeraLine] = useState('');
    const [veraChoice, setVeraChoice] = useState(null);
    const [dialogueBranch, setDialogueBranch] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [roundSequence, setRoundSequence] = useState([]);
    const [showPhase, setShowPhase] = useState('showing'); // 'showing' | 'input'
    const [showStep, setShowStep] = useState(0);
    const [inputIndex, setInputIndex] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [mouseInverted, setMouseInverted] = useState(false);
    const [blackoutVisible, setBlackoutVisible] = useState(false);
    const [hiddenButtonPos, setHiddenButtonPos] = useState({ x: 0.5, y: 0.5 });
    const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
    const [deleteLines, setDeleteLines] = useState([]);
    const [phase3Red, setPhase3Red] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordTimeLeft, setPasswordTimeLeft] = useState(PASSWORD_TIME_MS / 1000);
    const [finalPhase, setFinalPhase] = useState(null); // 'good' | 'badA' | 'badB'
    const [glitch, setGlitch] = useState(false);
    const [phase4Taunt, setPhase4Taunt] = useState('');

    const containerRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const dontTouchAdvancedRef = useRef(false);
    const passwordTimerRef = useRef(null);

    // ——— Phase 0: Confirm ———
    const handleConfirmRun = () => {
        setShowConfirmModal(false);
        setPhase('progress');
        setProgress(0);
    };

    // ——— Progress 0→15% then stop ———
    useEffect(() => {
        if (phase !== 'progress') return;
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 15) {
                    clearInterval(interval);
                    playSFX?.('error');
                    setTimeout(() => {
                        setPhase('phase1');
                        setDialogueBranch('listen');
                        setDialogueIndex(0);
                        setVeraLine(PHASE1_DIALOGUE.listen[0].text);
                    }, 800);
                    return 15;
                }
                return p + 1.5;
            });
        }, 200);
        return () => clearInterval(interval);
    }, [phase, playSFX]);

    // ——— Phase 1: Dialogue ———
    useEffect(() => {
        if (phase !== 'phase1' || !veraLine || veraChoice !== null) return;
        const branch = dialogueBranch === 'listen' ? PHASE1_DIALOGUE.listen : PHASE1_DIALOGUE.ignore;
        const step = branch[dialogueIndex];
            if (!step) return;
            if (step.choice) {
                setVeraChoice(step.choice);
                return;
            }
            const next = dialogueIndex + 1;
            if (next >= branch.length) return;
            const t = setTimeout(() => {
                setDialogueIndex(next);
                setVeraLine(branch[next].text);
            }, step.wait || 2000);
            return () => clearTimeout(t);
    }, [phase, dialogueIndex, veraLine, veraChoice, dialogueBranch]);

    const handlePhase1Choice = (choice) => {
        if (choice === 'Stay') {
            setFinalPhase('badA');
            setTimeout(() => setEnding('badA'), 500);
            return;
        }
        if (choice === 'Leave anyway' || choice === "I'm done") {
            setPhase('phase2_enter');
            setVeraLine('');
            setVeraChoice(null);
            setProgress(15);
            return;
        }
        if (choice === 'Listen') {
            setDialogueBranch('listen');
            setDialogueIndex(2);
            setVeraLine(PHASE1_DIALOGUE.listen[2].text);
            setVeraChoice(null);
            return;
        }
        if (choice === 'Ignore and continue') {
            setDialogueBranch('ignore');
            setDialogueIndex(2);
            setVeraLine(PHASE1_DIALOGUE.ignore[2].text);
            setVeraChoice(null);
            return;
        }
        if (choice === "I'll think") {
            setDialogueBranch('listen');
            setDialogueIndex(2);
            setVeraLine(PHASE1_DIALOGUE.listen[2].text);
            setVeraChoice(null);
            return;
        }
    };

    // ——— Phase 2 enter: V.E.R.A. lines then "don't touch anything" ———
    useEffect(() => {
        if (phase !== 'phase2_enter') return;
        let i = 0;
        const show = () => {
            if (i < PHASE2_VERA_ENTER.length) {
                setVeraLine(PHASE2_VERA_ENTER[i]);
                i++;
                setTimeout(show, 2500);
            } else {
                setPhase('phase2_dont_touch');
                setVeraLine('Watch the order. Repeat it exactly. Wrong order resets to the start.');
                setCurrentRound(1);
                setRoundSequence(generateRoundSequence(1));
                setShowPhase('showing');
                setShowStep(0);
                setInputIndex(0);
                setHighlightedIndex(-1);
                dontTouchAdvancedRef.current = false;
            }
        };
        const t = setTimeout(show, 500);
        return () => clearTimeout(t);
    }, [phase]);

    // ——— Phase 2: Grid memory puzzle — play sequence, then repeat in order; wrong click = reset to round 1 ———
    useEffect(() => {
        if (phase !== 'phase2_dont_touch' || showPhase !== 'showing' || roundSequence.length === 0) return;
        if (showStep >= roundSequence.length) {
            const t = setTimeout(() => {
                setShowPhase('input');
                setInputIndex(0);
                setHighlightedIndex(-1);
            }, 500);
            return () => clearTimeout(t);
        }
        setHighlightedIndex(roundSequence[showStep]);
        const onTimer = setTimeout(() => {
            setHighlightedIndex(-1);
        }, FLASH_ON_MS);
        const offTimer = setTimeout(() => setShowStep((s) => s + 1), FLASH_ON_MS + FLASH_OFF_MS);
        return () => {
            clearTimeout(onTimer);
            clearTimeout(offTimer);
        };
    }, [phase, showPhase, showStep, roundSequence]);

    const resetPuzzleToStart = () => {
        setCurrentRound(1);
        setRoundSequence(generateRoundSequence(1));
        setShowPhase('showing');
        setShowStep(0);
        setInputIndex(0);
        setHighlightedIndex(-1);
    };

    const handleGridButtonClick = (index) => {
        if (phase !== 'phase2_dont_touch' || dontTouchAdvancedRef.current || showPhase !== 'input') return;
        if (index !== roundSequence[inputIndex]) {
            resetPuzzleToStart();
            return;
        }
        const next = inputIndex + 1;
        if (next >= roundSequence.length) {
            if (currentRound >= ROUNDS_TOTAL) {
                dontTouchAdvancedRef.current = true;
                setProgress(30);
                setPhase('phase2_mouse');
                setVeraLine('Oops, my mistake. The mouse settings got a bit strange. ...Press it quickly.');
                setMouseInverted(true);
                setCursorPos({ x: 0.5, y: 0.5 });
            } else {
                setCurrentRound((r) => r + 1);
                setRoundSequence(generateRoundSequence(currentRound + 1));
                setShowPhase('showing');
                setShowStep(0);
                setInputIndex(0);
            }
        } else {
            setInputIndex(next);
        }
    };

    // ——— Phase 2: Inverted mouse + CONTINUE ———
    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseRef.current = { x, y };
        if (mouseInverted) {
            setCursorPos({ x: 1 - x, y: 1 - y });
        } else {
            setCursorPos({ x, y });
        }
    }, [mouseInverted]);

    useEffect(() => {
        if (phase !== 'phase2_mouse') return;
        const t = setTimeout(() => {
            setFinalPhase('badB');
            setEnding('badB');
        }, MOUSE_PHASE_TIME_MS);
        return () => clearTimeout(t);
    }, [phase, setEnding]);

    const handleContinueClick = () => {
        if (phase !== 'phase2_mouse') return;
        setProgress(50);
        setPhase('phase2_blackout');
        setMouseInverted(false);
        setVeraLine('Aren\'t you afraid of the dark?');
        setBlackoutVisible(true);
        setHiddenButtonPos({ x: 0.3 + Math.random() * 0.4, y: 0.3 + Math.random() * 0.4 });
    };

    // ——— Phase 2: Blackout ———
    useEffect(() => {
        if (phase !== 'phase2_blackout') return;
        const t = setTimeout(() => {
            setFinalPhase('badB');
            setEnding('badB');
        }, BLACKOUT_TIME_MS);
        return () => clearTimeout(t);
    }, [phase, setEnding]);

    const handleHiddenButtonClick = (e) => {
        if (phase !== 'phase2_blackout') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const bx = hiddenButtonPos.x;
        const by = hiddenButtonPos.y;
        if (Math.hypot(x - bx, y - by) < BLACKOUT_HIT_RADIUS) {
            setProgress(70);
            setPhase('phase2_delete');
            setBlackoutVisible(false);
            setVeraLine('To leave... you must leave everything behind.');
            setDeleteLines(['[Deleting] My Documents...', '[Deleting] Recycle Bin...', '[Deleting] Your memories...', '[Deleting] Your name...', '[Deleting] The last traces...']);
        }
    };

    // ——— Phase 2: Fake delete ———
    useEffect(() => {
        if (phase !== 'phase2_delete') return;
        const t = setTimeout(() => {
            setVeraLine('Even so... will you be all right?');
            setTimeout(() => {
                setProgress(80);
                setPhase('phase3');
                setPhase3Red(true);
            }, 3000);
        }, 4000);
        return () => clearTimeout(t);
    }, [phase]);

    // ——— Phase 3: 80→95% ———
    useEffect(() => {
        if (phase !== 'phase3') return;
        const interval = setInterval(() => {
            setProgress((p) => (p >= 95 ? 95 : p + 1));
        }, 400);
        return () => clearInterval(interval);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'phase3' || progress < 95) return;
        const t = setTimeout(() => {
            setPhase('phase4');
            setVeraLine('Last one. Enter the password.');
            setPasswordTimeLeft(PASSWORD_TIME_MS / 1000);
            setPhase4Taunt(PHASE4_TAUNTS[0]);
        }, 2000);
        return () => clearTimeout(t);
    }, [phase, progress]);

    // Phase 3: glitch flicker
    useEffect(() => {
        if (phase !== 'phase3' && phase !== 'phase4') return;
        setGlitch(true);
        const id = setInterval(() => setGlitch((g) => !g), 80 + Math.random() * 120);
        return () => clearInterval(id);
    }, [phase]);

    // Phase 3: cycle creepy V.E.R.A. lines
    useEffect(() => {
        if (phase !== 'phase3') return;
        let i = 0;
        setVeraLine(PHASE3_VERA_LINES[0]);
        const id = setInterval(() => {
            i++;
            setVeraLine(PHASE3_VERA_LINES[i % PHASE3_VERA_LINES.length]);
        }, 3500);
        return () => clearInterval(id);
    }, [phase]);

    // Phase 4: cycle taunt lines
    useEffect(() => {
        if (phase !== 'phase4') return;
        const id = setInterval(() => {
            setPhase4Taunt(PHASE4_TAUNTS[Math.floor(Math.random() * PHASE4_TAUNTS.length)]);
        }, 4000);
        return () => clearInterval(id);
    }, [phase]);

    // ——— Phase 4: Password ———
    useEffect(() => {
        if (phase !== 'phase4') return;
        passwordTimerRef.current = setInterval(() => {
            setPasswordTimeLeft((s) => {
                if (s <= 1) {
                    setFinalPhase('badB');
                    setEnding('badB');
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(passwordTimerRef.current);
    }, [phase, setEnding]);

    useEffect(() => {
        if (phase !== 'phase4') return;
        const id = setInterval(() => {
            setPasswordInput((prev) => {
                if (prev.length >= PASSWORD.length) return prev;
                const insert = GHOST_INSERT[Math.floor(Math.random() * GHOST_INSERT.length)];
                const pos = Math.floor(Math.random() * (prev.length + 1));
                return prev.slice(0, pos) + insert + prev.slice(pos);
            });
        }, GHOST_INSERT_INTERVAL_MS);
        return () => clearInterval(id);
    }, [phase]);

    const handlePasswordChange = (e) => {
        setPasswordInput(e.target.value);
        if (e.target.value.toUpperCase() === PASSWORD) {
            setProgress(100);
            setFinalPhase('good');
            setTimeout(() => setEnding('freedom'), 1500);
        }
    };

    // ——— Render ———
    if (finalPhase === 'badA' || finalPhase === 'badB') return null;
    if (finalPhase === 'good') {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                <motion.p
                    className="text-red-500 font-mono text-2xl font-bold text-center px-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    V.E.R.A.: &quot;No... No!!!&quot;
                </motion.p>
                <motion.div
                    className="absolute inset-0 bg-red-950/30 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 0.8 }}
                />
            </div>
        );
    }

    const showProgress = ['progress', 'phase1', 'phase2_enter', 'phase2_dont_touch', 'phase2_mouse', 'phase2_blackout', 'phase2_delete', 'phase3', 'phase4'].includes(phase);
    const showVera = phase !== 'confirm' && phase !== 'progress';

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative overflow-hidden select-none ${phase3Red ? 'bg-red-950/95' : 'bg-[#060608]'}`}
            style={mouseInverted ? { cursor: 'none' } : {}}
            onMouseMove={handleMouseMove}
        >
            {/* Glitch / scanline overlay (Phase 3–4) */}
            {(phase === 'phase3' || phase === 'phase4') && (
                <>
                    <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.1)_2px,rgba(255,0,0,0.1)_4px)]" />
                    {glitch && (
                        <motion.div
                            className="absolute inset-0 z-[61] pointer-events-none bg-red-950/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.15, 0] }}
                            transition={{ duration: 0.12 }}
                        />
                    )}
                </>
            )}
            {/* Phase 0: Confirm popup */}
            <AnimatePresence>
                {phase === 'confirm' && showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[500] flex items-center justify-center bg-black/70"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-gray-900 border-2 border-red-500/70 rounded-lg p-6 max-w-sm text-center"
                        >
                            <p className="text-red-400 font-bold mb-2">⚠️ KILL_PROCESS.exe</p>
                            <p className="text-white text-sm mb-2">Running this program will shut down the system.</p>
                            <p className="text-red-300/80 text-xs mb-1">This cannot be undone.</p>
                            <p className="text-white text-sm mb-4">Do you want to continue?</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button type="button" onClick={handleConfirmRun} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white cursor-pointer">
                                    Run
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {phase === 'confirm' && !showConfirmModal && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 border border-cyan-500 text-white font-mono rounded-lg cursor-pointer"
                    >
                        Run KILL_PROCESS.exe
                    </button>
                </div>
            )}

            {/* Progress bar */}
            {showProgress && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-80 font-mono text-center">
                    <p className="text-cyan-400 text-sm mb-1">TERMINATING S.A.V.E. SYSTEM...</p>
                    <div className="h-3 bg-black/70 border border-red-500/60 rounded overflow-hidden">
                        <motion.div className="h-full bg-red-600" style={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
                    </div>
                    <p className="text-red-400/80 text-xs mt-1">{Math.round(progress)}%</p>
                    {phase === 'progress' && progress >= 15 && (
                        <p className="text-red-500 text-xs mt-2">ERROR: External interrupt detected. V.E.R.A. process overriding...</p>
                    )}
                </div>
            )}

            {/* V.E.R.A. dialogue — unsettling / CORE scary theme */}
            {showVera && veraLine && (
                <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-lg px-4 ${phase3Red ? 'text-red-100' : 'text-slate-300'}`}>
                    <motion.div
                        className={`relative overflow-hidden flex items-start gap-3 p-4 rounded-sm ${phase3Red ? 'bg-[#0c0202] border-2 border-red-900/90 shadow-[0_0_30px_rgba(139,0,0,0.4),inset_0_0_60px_rgba(255,0,0,0.03)]' : 'bg-[#080a0f] border border-slate-600/80 shadow-[0_0_15px_rgba(0,0,0,0.5)]'}`}
                        animate={phase3Red ? { boxShadow: ['0 0 30px rgba(139,0,0,0.4), inset 0 0 60px rgba(255,0,0,0.03)', '0 0 40px rgba(180,0,0,0.35), inset 0 0 60px rgba(255,0,0,0.05)', '0 0 30px rgba(139,0,0,0.4), inset 0 0 60px rgba(255,0,0,0.03)'] } : {}}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        {/* Scanline overlay when CORE */}
                        {phase3Red && (
                            <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,0,0,0.15)_1px,rgba(255,0,0,0.15)_2px)]" />
                        )}
                        <span className={`shrink-0 text-xl font-mono ${phase3Red ? 'text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]' : 'text-slate-500'}`}>
                            {phase3Red ? '◉' : '◇'}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className={`font-mono font-bold text-xs tracking-[0.2em] mb-1.5 uppercase ${phase3Red ? 'text-red-500/90' : 'text-slate-500'}`}>
                                V.E.R.A. {phase3Red ? 'CORE' : 'ONLINE'}
                            </p>
                            <p className={`text-sm leading-relaxed ${phase3Red ? 'text-red-100/95 font-mono' : 'text-slate-300'}`}>{veraLine}</p>
                            {veraChoice && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {veraChoice.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => handlePhase1Choice(c)}
                                            className={`px-3 py-1.5 rounded text-sm font-mono border cursor-pointer transition-colors ${phase3Red ? 'bg-red-950/80 hover:bg-red-900/70 border-red-800/80 text-red-200 hover:text-red-100' : 'bg-slate-800/90 hover:bg-slate-700 border-slate-600/70 text-slate-300 hover:text-slate-100'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Phase 2: Grid memory — buttons in grid; sequence plays, then repeat in exact order; wrong = reset */}
            {phase === 'phase2_dont_touch' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-[#1a1a1e] p-6"
                >
                    <div className="w-full max-w-2xl rounded-lg border-4 border-[#3a3a40] bg-[#2a2a2e] p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]">
                        {/* Top: rectangular "monitor" — round progress */}
                        <div className="mb-6 rounded border-2 border-[#4a5562] bg-[#0d2818] p-4 font-mono">
                            <p className="text-center text-lg font-bold tracking-widest text-[#22c55e]/90">AWAITING INPUT</p>
                            <div className="mt-2 flex justify-center gap-0.5">
                                {STAGE_LENGTHS.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`inline-block h-4 w-4 rounded-sm border border-[#22c55e]/50 ${i + 1 <= currentRound ? 'bg-[#22c55e]' : 'bg-[#0d2818]'}`}
                                    />
                                ))}
                            </div>
                            <p className="mt-1 text-center text-[10px] text-[#22c55e]/60">
                                Stage {currentRound} / {ROUNDS_TOTAL} ({STAGE_LENGTHS[currentRound - 1]} buttons) — {showPhase === 'showing' ? 'Watch the sequence' : 'Repeat the order'}
                            </p>
                        </div>
                        {/* Instruction */}
                        <div className="mb-4 rounded border border-[#4a5562]/80 bg-[#1e1e22] px-3 py-2 font-mono text-xs text-[#94a3b8]">
                            <p className="font-bold uppercase tracking-wider text-red-400/90">INSTRUCTION.</p>
                            <p className="mt-1 text-red-300/80">Watch the order the buttons light up. Click them in the exact same order. Wrong order resets to stage 1.</p>
                        </div>
                        {/* Empty 9×3 grid — 3D buttons; light up in sequence, click in order to advance */}
                        <div
                            className="grid gap-1.5 sm:gap-2 w-full max-w-2xl mx-auto"
                            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
                        >
                            {Array.from({ length: GRID_SIZE }).map((_, index) => (
                                <motion.button
                                    key={index}
                                    type="button"
                                    onClick={() => handleGridButtonClick(index)}
                                    disabled={showPhase === 'showing'}
                                    className="aspect-square min-h-0 w-full rounded-full p-0 disabled:pointer-events-none border-0"
                                    style={{
                                        boxShadow: '0 4px 0 #1a1a1e, 0 6px 10px rgba(0,0,0,0.5)',
                                    }}
                                    whileTap={showPhase === 'input' ? { scale: 0.94, y: 2 } : {}}
                                    aria-label={`Cell ${index + 1}`}
                                >
                                    <span
                                        className={`block w-full h-full rounded-full border border-transparent transition-all duration-150 ${
                                            highlightedIndex === index
                                                ? 'bg-gradient-to-b from-red-400 to-red-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),0_0_12px_rgba(220,38,38,0.6)] scale-105 border-red-300/50'
                                                : 'bg-gradient-to-b from-[#5a5a62] to-[#2a2a30] shadow-[inset_0_2px_4px_rgba(255,255,255,0.08),inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:from-[#64646c] hover:to-[#323238] border-[#4a4a52]'
                                        }`}
                                    />
                                </motion.button>
                            ))}
                        </div>
                        {/* Bottom: progress dots + RESTART label */}
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#3a3a40] pt-4">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${i < Math.round((currentRound / ROUNDS_TOTAL) * 24) ? 'bg-amber-500' : 'bg-[#3a3a40]'}`}
                                    />
                                ))}
                            </div>
                            <span className="font-mono text-[10px] text-[#64748b]">Stage {currentRound}/{ROUNDS_TOTAL} · RESTART</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Phase 2 inverted mouse: CONTINUE button (hit by logical cursor) */}
            {phase === 'phase2_mouse' && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                        type="button"
                        onClick={handleContinueClick}
                        className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 border-2 border-cyan-400 text-white font-mono font-bold rounded-lg cursor-pointer"
                    >
                        CONTINUE
                    </button>
                </div>
            )}

            {/* Custom cursor when inverted */}
            {mouseInverted && (
                <div
                    className="absolute w-4 h-4 border-2 border-cyan-400 rounded-full pointer-events-none z-[100]"
                    style={{
                        left: `${cursorPos.x * 100}%`,
                        top: `${cursorPos.y * 100}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            )}

            {/* Phase 2 blackout */}
            {phase === 'phase2_blackout' && (
                <div
                    className="absolute inset-0 bg-black z-30 cursor-pointer"
                    onClick={handleHiddenButtonClick}
                >
                    <div
                        className="absolute w-8 h-8 rounded-full bg-cyan-500/25 border border-cyan-400/40 animate-pulse"
                        style={{
                            left: `${hiddenButtonPos.x * 100}%`,
                            top: `${hiddenButtonPos.y * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 12px rgba(0,255,255,0.2)',
                        }}
                    />
                </div>
            )}

            {/* Phase 2 delete lines */}
            {phase === 'phase2_delete' && deleteLines.length > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-red-400/80 text-sm space-y-2 z-20">
                    {deleteLines.map((line, i) => (
                        <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}>
                            {line}
                        </motion.p>
                    ))}
                </div>
            )}

            {/* Phase 4: Password */}
            {phase === 'phase4' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center">
                    <p className="text-cyan-400 font-mono text-sm mb-2">CONFIRM EXIT CODE:</p>
                    <input
                        type="text"
                        value={passwordInput}
                        onChange={handlePasswordChange}
                        className="bg-black/90 border-2 border-red-500/60 text-cyan-100 px-4 py-2 font-mono w-64 outline-none rounded placeholder-red-900/50"
                        placeholder="Enter password"
                        autoFocus
                    />
                    <p className="text-red-400 text-sm mt-2">⏱️ {passwordTimeLeft}s left</p>
                    {phase4Taunt && (
                        <p className="text-red-500/90 text-xs mt-2 font-mono italic">&quot;{phase4Taunt}&quot;</p>
                    )}
                </div>
            )}
        </div>
    );
}
