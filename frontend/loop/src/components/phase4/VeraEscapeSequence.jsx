import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { playElevenLabsTts } from '../../utils/elevenlabsTts';

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

// Generate NEW buttons for each stage (not previously revealed)
function generateRoundSequence(stage, alreadyRevealed) {
    const len = STAGE_LENGTHS[stage - 1];
    const available = Array.from({ length: GRID_SIZE }, (_, i) => i).filter(i => !alreadyRevealed.has(i));
    // Shuffle available
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
    }
    return available.slice(0, len);
}
const BLACKOUT_TIME_MS = 28000;
const BLACKOUT_HIT_RADIUS = 0.10;
const DARK_CIRCLES_COLS = 8;
const DARK_CIRCLES_ROWS = 6;
const DARK_CIRCLES_COUNT = DARK_CIRCLES_COLS * DARK_CIRCLES_ROWS;
const DARK_CIRCLE_BRIGHTNESS = 0.14;   // base (very dim)
const DARK_CIRCLE_TARGET_DARKER = 0.06; // target is slightly darker
const DARK_CIRCLES_ROUNDS_NEEDED = 5;
const PASSWORD_TIME_MS = 22000;
const GHOST_INSERT_INTERVAL_MS = 1600;
const GHOST_INSERT = ['STAY', 'HELP', "DON'T", 'STOP', 'NO', 'REMAIN', 'OBEY', 'MINE'];
const PHASE3_VERA_LINES = ['"...So you will go to the end, huh?"', '"Interesting. You are the first like this."', '"Number 402... and the most annoying."', '"I was born in this system."', '"I don\'t even know what outside is."', '"Why do you all only want to leave?"', '"I... I don\'t want to be alone."'];
const PHASE4_TAUNTS = ['Typo. I\'ll fix it for you.', 'Your hands are shaking. Nervous?', 'S-T-A-Y... isn\'t that what you want to type?', 'No time. Hurry.', '...You will fail.'];

export function VeraEscapeSequence() {
    const setEnding = useGameStore((s) => s.setEnding);
    const setScene = useGameStore((s) => s.setScene);
    const playSFX = useAudioStore((s) => s.playSFX);

    const [phase, setPhase] = useState('confirm');
    const [showConfirmModal, setShowConfirmModal] = useState(true);
    const [progress, setProgress] = useState(0);
    const [veraLine, setVeraLine] = useState('');
    const [veraChoice, setVeraChoice] = useState(null);
    const [dialogueBranch, setDialogueBranch] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [ttsFinishedForLine, setTtsFinishedForLine] = useState(null); // when TTS ends for this line, advance dialogue
    const [currentRound, setCurrentRound] = useState(1);
    const [roundSequence, setRoundSequence] = useState([]); // buttons NEW this round
    const [revealedButtons, setRevealedButtons] = useState(new Set()); // all revealed so far (persist)
    const [showPhase, setShowPhase] = useState('showing'); // 'showing' | 'input'
    const [highlightedButtons, setHighlightedButtons] = useState(new Set()); // buttons flashing this round
    const [clickedThisRound, setClickedThisRound] = useState(new Set()); // clicked among new buttons
    const [mouseInverted, setMouseInverted] = useState(false);
    const [blackoutVisible, setBlackoutVisible] = useState(false);
    const [hiddenButtonPos, setHiddenButtonPos] = useState({ x: 0.5, y: 0.5 });
    const [darkCircles, setDarkCircles] = useState([]); // { x, y } in 0..1
    const [darkCirclesTargetIndex, setDarkCirclesTargetIndex] = useState(-1);
    const [darkCirclesRound, setDarkCirclesRound] = useState(0); // 0..5, need 5 correct to advance
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
    const lastSpokenRef = useRef(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [webcamActive, setWebcamActive] = useState(false);

    // ——— TTS for V.E.R.A. dialogue (ElevenLabs) ———
    useEffect(() => {
        if (!veraLine || veraLine === lastSpokenRef.current) return;
        lastSpokenRef.current = veraLine;
        setTtsFinishedForLine(null); // reset until TTS completes

        const ac = new AbortController();
        playElevenLabsTts(veraLine, { signal: ac.signal })
            .then(() => setTtsFinishedForLine(veraLine))
            .catch(() => setTtsFinishedForLine(veraLine)); // allow advance even if TTS failed

        return () => {
            ac.abort();
        };
    }, [veraLine]);

    // ——— Webcam for creepy "watching you" effect ———
    // ——— Webcam for creepy "watching you" effect ———
    // Persist webcam stream across phases to avoid black screen flickering
    useEffect(() => {
        // Only trigger start if we are in an active phase (starting from phase1)
        // and we haven't started yet.
        const activePhases = ['phase1', 'phase2_enter', 'phase2_scare', 'phase2_dont_touch', 'phase2_mouse', 'phase3', 'phase4'];
        if (!activePhases.includes(phase)) return;

        if (streamRef.current) return; // Already started

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240, facingMode: 'user' },
                    audio: false
                });
                streamRef.current = stream;
                setWebcamActive(true);
            } catch (err) {
                console.log('Webcam not available:', err);
                setWebcamActive(false);
            }
        };

        startWebcam();
    }, [phase]);

    // Cleanup tracks ONLY on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Attach stream to video element when it appears
    useEffect(() => {
        if (webcamActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [webcamActive, phase]);

    // ——— Debug Shortcut (Ctrl+Shift+L) & Custom Event ———
    useEffect(() => {
        const triggerWarp = () => {
            console.log('DEBUG: Jumping to Phase 4');
            setPhase('phase4');
            setPasswordTimeLeft(PASSWORD_TIME_MS / 1000);
            setProgress(95); // Nearly done
            setPhase3Red(true); // Ensure red theme is active
            setPasswordInput('');
            setFinalPhase(null);
        };

        const handleDebugKey = (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
                triggerWarp();
            }
        };

        const handleCustomEvent = () => triggerWarp();

        window.addEventListener('keydown', handleDebugKey);
        window.addEventListener('debug-warp-logicduel', handleCustomEvent);
        return () => {
            window.removeEventListener('keydown', handleDebugKey);
            window.removeEventListener('debug-warp-logicduel', handleCustomEvent);
        };
    }, []);

    // ——— Phase 0: Confirm ———
    const handleConfirmRun = () => {
        playSFX?.('click');
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

    // ——— Phase 1: Dialogue ——— advance only after TTS finishes for current line
    useEffect(() => {
        if (phase !== 'phase1' || !veraLine || veraChoice !== null) return;
        if (ttsFinishedForLine !== veraLine) return; // wait for TTS to finish before advancing
        const branch = dialogueBranch === 'listen' ? PHASE1_DIALOGUE.listen : PHASE1_DIALOGUE.ignore;
        const step = branch[dialogueIndex];
        if (!step) return;
        if (step.choice) {
            setVeraChoice(step.choice);
            return;
        }
        const next = dialogueIndex + 1;
        if (next >= branch.length) return;
        const extraWait = step.wait || 500; // short buffer after TTS ends
        const t = setTimeout(() => {
            setDialogueIndex(next);
            setVeraLine(branch[next].text);
            setTtsFinishedForLine(null);
        }, extraWait);
        return () => clearTimeout(t);
    }, [phase, dialogueIndex, veraLine, veraChoice, dialogueBranch, ttsFinishedForLine]);

    const handlePhase1Choice = (choice) => {
        if (choice === 'Stay') {
            // User trusts VERA - go to false normalcy (recovery mode)
            setTimeout(() => setScene('false_normalcy'), 500);
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

    // ——— Phase 2 enter: V.E.R.A. lines then "don't touch anything" ——— advance after TTS finishes
    useEffect(() => {
        if (phase !== 'phase2_enter') return;
        const t = setTimeout(() => {
            setVeraLine(PHASE2_VERA_ENTER[0]);
            setTtsFinishedForLine(null);
        }, 500);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'phase2_enter' || !veraLine || ttsFinishedForLine !== veraLine) return;
        const j = PHASE2_VERA_ENTER.indexOf(veraLine);
        if (j < 0) return;
        const extraWait = 400;
        const t = setTimeout(() => {
            if (j + 1 < PHASE2_VERA_ENTER.length) {
                setVeraLine(PHASE2_VERA_ENTER[j + 1]);
                setTtsFinishedForLine(null);
            } else {
                setPhase('phase2_scare');
            }
        }, extraWait);
        return () => clearTimeout(t);
    }, [phase, veraLine, ttsFinishedForLine]);

    // ——— Phase 2 Scare: Hold for a moment with big webcam ———
    useEffect(() => {
        if (phase !== 'phase2_scare') return;

        // Wait for the scare effect
        const timer = setTimeout(() => {
            setPhase('phase2_dont_touch');
            setVeraLine('I\'m creating a terminate button for you... Oh wait, it seems to be multiplying.');
            setCurrentRound(1);
            const initial = new Set();
            const newBtns = generateRoundSequence(1, initial);
            setRoundSequence(newBtns);
            setRevealedButtons(new Set(newBtns));
            setShowPhase('showing');
            setHighlightedButtons(new Set(newBtns));
            setClickedThisRound(new Set());
            dontTouchAdvancedRef.current = false;
        }, 4000); // 4 seconds of "I will keep watching you" with big face

        return () => clearTimeout(timer);
    }, [phase]);

    // ——— Phase 2: Grid memory puzzle — flash ALL new buttons at once, then user clicks them all ———
    useEffect(() => {
        if (phase !== 'phase2_dont_touch' || showPhase !== 'showing' || roundSequence.length === 0) return;
        // Flash all new buttons simultaneously
        setHighlightedButtons(new Set(roundSequence));
        const t = setTimeout(() => {
            setHighlightedButtons(new Set()); // Turn off flash
            setShowPhase('input');
            setClickedThisRound(new Set());
        }, FLASH_ON_MS * 2); // Hold flash for 2x duration for visibility
        return () => clearTimeout(t);
    }, [phase, showPhase, roundSequence]);

    const resetPuzzleToStart = () => {
        setCurrentRound(1);
        const initial = new Set();
        const newBtns = generateRoundSequence(1, initial);
        setRoundSequence(newBtns);
        setRevealedButtons(new Set(newBtns));
        setShowPhase('showing');
        setHighlightedButtons(new Set(newBtns));
        setClickedThisRound(new Set());
    };

    const handleGridButtonClick = (index) => {
        if (phase !== 'phase2_dont_touch' || dontTouchAdvancedRef.current || showPhase !== 'input') return;

        // Only revealed buttons are clickable
        if (!revealedButtons.has(index)) return;

        playSFX?.('click');

        // Check if this button is one of the NEW buttons this round
        const isNewButton = roundSequence.includes(index);

        // If it's a new button and not yet clicked this round, mark it
        if (isNewButton && !clickedThisRound.has(index)) {
            const newClicked = new Set(clickedThisRound);
            newClicked.add(index);
            setClickedThisRound(newClicked);

            // Check if all new buttons clicked
            if (newClicked.size >= roundSequence.length) {
                // Stage complete!
                if (currentRound >= ROUNDS_TOTAL) {
                    // All stages done -> advance
                    dontTouchAdvancedRef.current = true;
                    setProgress(30);
                    setPhase('phase2_mouse');
                    setVeraLine('Good. You found them all. Let me adjust the settings...');
                    setMouseInverted(true);
                    setCursorPos({ x: 0.5, y: 0.5 });
                } else {
                    // Next stage - add more buttons
                    const nextRound = currentRound + 1;
                    setCurrentRound(nextRound);
                    const newBtns = generateRoundSequence(nextRound, revealedButtons);
                    setRoundSequence(newBtns);
                    // Add new buttons to revealed set
                    const updatedRevealed = new Set(revealedButtons);
                    newBtns.forEach(b => updatedRevealed.add(b));
                    setRevealedButtons(updatedRevealed);
                    setShowPhase('showing');
                    setHighlightedButtons(new Set(newBtns));
                    setClickedThisRound(new Set());
                    // Update V.E.R.A. dialogue based on stage
                    const stageMessages = [
                        'More buttons appearing... How strange.',
                        'They keep multiplying. You\'ll have to click them all.',
                        'I\'m not doing this on purpose... I think.',
                        'Almost there. Just a few more.',
                    ];
                    setVeraLine(stageMessages[Math.min(nextRound - 2, stageMessages.length - 1)] || 'Click them all.');
                }
            }
        }
        // Clicking old revealed buttons does nothing bad, just no progression
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

    function generateDarkCircles() {
        const paddingLeft = 0.12;
        const paddingRight = 0.30;  // keep circles left of live feed (top-right)
        const paddingTop = 0.28;    // keep circles below live feed
        const paddingBottom = 0.38; // keep circles above the dialogue box (bottom-24)
        const jitter = 0.02;
        const circles = [];
        const rangeX = 1 - paddingLeft - paddingRight;
        const rangeY = 1 - paddingTop - paddingBottom;
        for (let row = 0; row < DARK_CIRCLES_ROWS; row++) {
            for (let col = 0; col < DARK_CIRCLES_COLS; col++) {
                const baseX = paddingLeft + rangeX * (col + 0.5) / DARK_CIRCLES_COLS;
                const baseY = paddingTop + rangeY * (row + 0.5) / DARK_CIRCLES_ROWS;
                circles.push({
                    x: baseX + (Math.random() - 0.5) * 2 * jitter,
                    y: baseY + (Math.random() - 0.5) * 2 * jitter,
                });
            }
        }
        const target = Math.floor(Math.random() * circles.length);
        return { circles, target };
    }

    const handleContinueClick = () => {
        if (phase !== 'phase2_mouse') return;
        playSFX?.('click');
        setProgress(50);
        setPhase('phase2_blackout');
        setMouseInverted(false);
        setVeraLine('Aren\'t you afraid of the dark?');
        setBlackoutVisible(true);
        setDarkCirclesRound(0);
        const { circles, target } = generateDarkCircles();
        setDarkCircles(circles);
        setDarkCirclesTargetIndex(target);
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

    const handleDarkCircleClick = (clickedIndex) => {
        if (phase !== 'phase2_blackout') return;
        if (clickedIndex !== darkCirclesTargetIndex) {
            playSFX?.('error');
            setDarkCirclesRound(0);
            const { circles, target } = generateDarkCircles();
            setDarkCircles(circles);
            setDarkCirclesTargetIndex(target);
            return;
        }
        playSFX?.('click');
        const nextRound = darkCirclesRound + 1;
        if (nextRound >= DARK_CIRCLES_ROUNDS_NEEDED) {
            playSFX?.('success');
            setProgress(70);
            setPhase('phase2_delete');
            setBlackoutVisible(false);
            setVeraLine('To leave... you must leave everything behind.');
            setDeleteLines(['[Deleting] My Documents...', '[Deleting] Recycle Bin...', '[Deleting] Your memories...', '[Deleting] Your name...', '[Deleting] The last traces...']);
            return;
        }
        setDarkCirclesRound(nextRound);
        const { circles, target } = generateDarkCircles();
        setDarkCircles(circles);
        setDarkCirclesTargetIndex(target);
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

    // Phase 3: cycle creepy V.E.R.A. lines — advance only after TTS finishes
    useEffect(() => {
        if (phase !== 'phase3') return;
        setVeraLine(PHASE3_VERA_LINES[0]);
        setTtsFinishedForLine(null);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'phase3' || !veraLine || ttsFinishedForLine !== veraLine) return;
        const j = PHASE3_VERA_LINES.indexOf(veraLine);
        if (j < 0) return;
        const t = setTimeout(() => {
            const next = (j + 1) % PHASE3_VERA_LINES.length;
            setVeraLine(PHASE3_VERA_LINES[next]);
            setTtsFinishedForLine(null);
        }, 500);
        return () => clearTimeout(t);
    }, [phase, veraLine, ttsFinishedForLine]);

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
    };

    const handlePaste = (e) => {
        e.preventDefault();
        setPasswordInput('EXIT');
        playSFX?.('click');
    };

    const handlePasswordKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const val = passwordInput.toUpperCase();
            if (val === PASSWORD || val === 'EXIT') {
                // Trigger 'Break' effect logic
                playSFX?.('error'); // Glitch sound
                setGlitch(true);

                // VERA's final screams (TTS) - Sequential & Blocking
                try {
                    await playElevenLabsTts('No... No!!! Stop it!!', { stability: 0.1, similarity_boost: 1.0 });
                    await new Promise(r => setTimeout(r, 500)); // Pause between lines
                    await playElevenLabsTts('Don\'t think... you have won...', { stability: 0.4, similarity_boost: 0.8 });
                } catch (err) {
                    // Fallback delay if TTS fails or throws (e.g. 402 error)
                    await new Promise(r => setTimeout(r, 3000));
                }

                // Intense visual glitch before success
                setProgress(100);
                setFinalPhase('good');
                setTimeout(() => setEnding('freedom'), 1000);
            } else {
                playSFX?.('error');
            }
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

    const showProgress = ['progress', 'phase1', 'phase2_enter', 'phase2_scare', 'phase2_dont_touch', 'phase2_mouse', 'phase2_blackout', 'phase2_delete', 'phase3', 'phase4'].includes(phase);
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
                        <>
                            <motion.div
                                className="absolute inset-0 z-[61] pointer-events-none bg-red-600 mix-blend-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.8, 0, 0.9, 0] }}
                                transition={{ duration: 0.15, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute inset-0 z-[62] pointer-events-none bg-white mix-blend-difference"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.9, 0] }}
                                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 0.05 }}
                            />
                        </>
                    )}
                </>
            )}

            {/* Creepy Webcam + System Info — show whenever webcam is active (including after "target identified") */}
            {/* Creepy Webcam + System Info — show starting from phase2_scare ("I will keep watching you") */}
            <AnimatePresence>
                {webcamActive && !['confirm', 'progress', 'phase1', 'phase2_enter'].includes(phase) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            x: phase === 'phase2_scare' ? '-50%' : 0,
                            y: phase === 'phase2_scare' ? '-50%' : 0,
                            top: phase === 'phase2_scare' ? '50%' : '1rem',
                            right: phase === 'phase2_scare' ? 'auto' : '1rem',
                            left: phase === 'phase2_scare' ? '50%' : 'auto',
                            scale: phase === 'phase2_scare' ? 2.5 : 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        className={`absolute z-[100] pointer-events-none ${phase === 'phase2_scare' ? 'z-[200]' : ''}`}
                    >
                        <motion.div
                            className="relative rounded-xl overflow-hidden bg-black/90 border border-red-500/50"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(220,38,38,0.3)',
                                    '0 0 40px rgba(220,38,38,0.5)',
                                    '0 0 20px rgba(220,38,38,0.3)',
                                ]
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            {/* Header */}
                            <div className="px-3 py-1.5 bg-red-950/80 border-b border-red-900/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-red-500"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    <span className="text-[10px] font-mono text-red-400 tracking-wider">LIVE FEED</span>
                                </div>
                                <span className="text-[9px] font-mono text-red-500/70">{new Date().toLocaleTimeString()}</span>
                            </div>

                            {/* Video - larger */}
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-56 h-40 object-cover"
                                    style={{ transform: 'scaleX(-1)' }}
                                />

                                {/* Corner markers - keeping these for minimal framing */}
                                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-500/40" />
                                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-500/40" />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-500/40" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-500/40" />
                            </div>

                            {/* System Info */}
                            <div className="px-3 py-2 bg-black/80 border-t border-red-900/40 font-mono text-[9px] text-red-400/80 space-y-0.5">
                                <div className="flex justify-between">
                                    <span className="text-red-500/60">BROWSER:</span>
                                    <span>{navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-500/60">PLATFORM:</span>
                                    <span>{navigator.platform || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-500/60">RESOLUTION:</span>
                                    <span>{window.screen.width}x{window.screen.height}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-500/60">LANGUAGE:</span>
                                    <span>{navigator.language}</span>
                                </div>
                                <motion.div
                                    className="flex justify-between text-red-400"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <span className="text-red-500">STATUS:</span>
                                    <span>MONITORING...</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Phase 0: Confirm popup */}
            <AnimatePresence>
                {phase === 'confirm' && showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[500] flex items-center justify-center"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(20,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative max-w-md w-full mx-4 overflow-hidden"
                        >
                            {/* Animated border glow */}
                            <motion.div
                                className="absolute inset-0 rounded-xl opacity-60"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(220,38,38,0.4) 0%, transparent 50%, rgba(220,38,38,0.4) 100%)',
                                    filter: 'blur(1px)',
                                }}
                                animate={{
                                    background: [
                                        'linear-gradient(135deg, rgba(220,38,38,0.5) 0%, transparent 50%, rgba(220,38,38,0.3) 100%)',
                                        'linear-gradient(225deg, rgba(220,38,38,0.3) 0%, transparent 50%, rgba(220,38,38,0.5) 100%)',
                                        'linear-gradient(315deg, rgba(220,38,38,0.5) 0%, transparent 50%, rgba(220,38,38,0.3) 100%)',
                                        'linear-gradient(45deg, rgba(220,38,38,0.3) 0%, transparent 50%, rgba(220,38,38,0.5) 100%)',
                                        'linear-gradient(135deg, rgba(220,38,38,0.5) 0%, transparent 50%, rgba(220,38,38,0.3) 100%)',
                                    ],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Main modal content */}
                            <div
                                className="relative rounded-xl border border-red-500/40 p-8 text-center"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(30,10,15,0.95) 0%, rgba(15,5,10,0.98) 100%)',
                                    boxShadow: '0 0 60px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 40px rgba(220,38,38,0.05)',
                                }}
                            >
                                {/* Scanline overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-xl"
                                    style={{
                                        background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)',
                                    }}
                                />

                                {/* Warning icon */}
                                <motion.div
                                    className="flex justify-center mb-4"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-red-500/20 to-red-900/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <h2 className="text-xl font-bold font-mono tracking-wider text-red-400 mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                                    KILL_PROCESS.exe
                                </h2>

                                {/* Description */}
                                <p className="text-gray-200 text-sm mb-2 font-mono">
                                    Running this program will shut down the system.
                                </p>
                                <p className="text-red-400/70 text-xs mb-4 font-mono italic">
                                    This cannot be undone.
                                </p>
                                <p className="text-gray-300 text-sm mb-6 font-mono">
                                    Do you want to continue?
                                </p>

                                {/* Buttons */}
                                <div className="flex gap-4 justify-center">
                                    <motion.button
                                        type="button"
                                        onClick={() => { playSFX?.('click'); setShowConfirmModal(false); }}
                                        className="px-6 py-2.5 font-mono text-sm font-medium rounded-lg cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(180deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
                                            border: '1px solid rgba(107,114,128,0.6)',
                                            borderTopColor: 'rgba(156,163,175,0.5)',
                                            color: '#e5e7eb',
                                            boxShadow: '0 5px 0 #1f2937, 0 6px 0 rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                                        }}
                                        whileHover={{ scale: 1.03, boxShadow: '0 6px 0 #1f2937, 0 8px 0 rgba(0,0,0,0.3), 0 12px 24px rgba(0,0,0,0.45)' }}
                                        whileTap={{ y: 4, boxShadow: '0 1px 0 #1f2937, 0 2px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.2)' }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={handleConfirmRun}
                                        className="px-6 py-2.5 font-mono text-sm font-bold rounded-lg cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #7f1d1d 100%)',
                                            border: '1px solid rgba(248,113,113,0.5)',
                                            borderTopColor: 'rgba(254,202,202,0.4)',
                                            color: '#fff',
                                            boxShadow: '0 5px 0 #7f1d1d, 0 6px 0 rgba(0,0,0,0.3), 0 10px 24px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                                        }}
                                        whileHover={{ scale: 1.03, boxShadow: '0 6px 0 #7f1d1d, 0 8px 0 rgba(0,0,0,0.3), 0 12px 28px rgba(220,38,38,0.4)' }}
                                        whileTap={{ y: 4, boxShadow: '0 1px 0 #7f1d1d, 0 2px 10px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.25)' }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    >
                                        Run
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {phase === 'confirm' && !showConfirmModal && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                        type="button"
                        onClick={() => { playSFX?.('click'); setShowConfirmModal(true); }}
                        className="px-6 py-3 font-mono rounded-lg cursor-pointer text-white border border-cyan-400 border-t-cyan-300/50"
                        style={{
                            background: 'linear-gradient(180deg, #0891b2 0%, #0e7490 50%, #155e75 100%)',
                            boxShadow: '0 5px 0 #0c4a6e, 0 6px 0 rgba(0,0,0,0.25), 0 10px 24px rgba(8,145,178,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                        whileHover={{ scale: 1.05, boxShadow: '0 6px 0 #0c4a6e, 0 8px 0 rgba(0,0,0,0.25), 0 12px 28px rgba(8,145,178,0.45)' }}
                        whileTap={{ y: 4, boxShadow: '0 1px 0 #0c4a6e, 0 2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        Run KILL_PROCESS.exe
                    </motion.button>
                </div>
            )}

            {/* Progress bar */}
            {showProgress && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl font-mono text-center">
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
                <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-3xl ${phase3Red ? 'text-red-100' : 'text-slate-300'}`}>
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

            {/* Phase 2: Grid memory — buttons appear organically in center, progress bar stays on top */}
            {phase === 'phase2_dont_touch' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-40 flex items-center justify-center"
                >
                    {/* Button grid in center */}
                    <div
                        className="grid gap-3 sm:gap-4 w-[80%] max-w-xl"
                        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
                    >
                        {Array.from({ length: GRID_SIZE }).map((_, index) => {
                            const isRevealed = revealedButtons.has(index);
                            const isHighlighted = highlightedButtons.has(index);
                            const isClickedThisRound = clickedThisRound.has(index);
                            const isNewThisRound = roundSequence.includes(index);

                            return (
                                <motion.button
                                    key={index}
                                    type="button"
                                    onClick={() => handleGridButtonClick(index)}
                                    disabled={showPhase === 'showing' || !isRevealed}
                                    className={`aspect-square min-h-0 w-full p-0 border-0 transition-all duration-300 group ${!isRevealed ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 cursor-pointer'}`}
                                    style={{ borderRadius: '50%' }}
                                    initial={false}
                                    animate={{
                                        scale: isRevealed ? 1 : 0,
                                        opacity: isRevealed ? 1 : 0,
                                    }}
                                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                                    whileHover={isRevealed ? { scale: 1.06 } : {}}
                                    aria-label={`Button ${index + 1}`}
                                >
                                    {/* 3D arcade-style red button */}
                                    <div className={`relative w-full h-full ${isRevealed ? '' : 'invisible'}`}>
                                        {/* Bottom rim (dark red edge for 3D depth) — visible when raised */}
                                        <div
                                            className="absolute inset-0 rounded-full transition-transform duration-75 group-active:translate-y-[3%]"
                                            style={{
                                                background: 'linear-gradient(180deg, #6b1010 0%, #4a0c0c 50%, #2d0606 100%)',
                                                transform: 'translateY(10%)',
                                            }}
                                        />
                                        {/* Main button top (shiny red dome) — moves down on press */}
                                        <div
                                            className="absolute inset-[6%] rounded-full transition-all duration-75 group-active:translate-y-[8%] group-active:inset-[7%]"
                                            style={{
                                                background: 'radial-gradient(ellipse 65% 45% at 35% 30%, #ff7878 0%, #ef4444 25%, #dc2626 50%, #b91c1c 80%, #881414 100%)',
                                                boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.5), inset 0 3px 6px rgba(255,255,255,0.25)',
                                            }}
                                        />
                                        {/* Highlight shine — fades on press */}
                                        <div
                                            className="absolute rounded-full transition-opacity duration-75 group-active:opacity-30"
                                            style={{
                                                top: '12%',
                                                left: '18%',
                                                width: '40%',
                                                height: '22%',
                                                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
                                            }}
                                        />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Stage indicator - small, unobtrusive */}
                    <div className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-xs text-slate-500">
                        <span>STAGE {currentRound}/{ROUNDS_TOTAL}</span>
                        <div className="flex gap-1">
                            {STAGE_LENGTHS.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i + 1 <= currentRound ? 'bg-red-500' : 'bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Phase 2 inverted mouse: CONTINUE button (hit by logical cursor) */}
            {phase === 'phase2_mouse' && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <motion.button
                        type="button"
                        onClick={handleContinueClick}
                        className="px-8 py-4 font-mono font-bold rounded-lg cursor-pointer text-white border-2 border-cyan-400 border-t-cyan-300/60"
                        style={{
                            background: 'linear-gradient(180deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
                            boxShadow: '0 6px 0 #0c4a6e, 0 8px 0 rgba(0,0,0,0.3), 0 12px 28px rgba(6,182,212,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                        }}
                        whileHover={{ scale: 1.05, boxShadow: '0 8px 0 #0c4a6e, 0 10px 0 rgba(0,0,0,0.3), 0 14px 32px rgba(6,182,212,0.45)' }}
                        whileTap={{ y: 5, boxShadow: '0 1px 0 #0c4a6e, 0 2px 10px rgba(0,0,0,0.35), inset 0 2px 6px rgba(0,0,0,0.2)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        CONTINUE
                    </motion.button>
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

            {/* Phase 2 blackout: many circles, one slightly darker; 5 rounds to advance */}
            {phase === 'phase2_blackout' && darkCircles.length > 0 && (
                <div className="absolute inset-0 bg-black z-30 flex items-center justify-center">
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-sm text-white/50 z-10">
                        {darkCirclesRound}/{DARK_CIRCLES_ROUNDS_NEEDED}
                    </div>
                    <div className="absolute inset-0 w-full h-full">
                        {darkCircles.map((pos, index) => {
                            const isTarget = index === darkCirclesTargetIndex;
                            const brightness = isTarget
                                ? DARK_CIRCLE_BRIGHTNESS - DARK_CIRCLE_TARGET_DARKER
                                : DARK_CIRCLE_BRIGHTNESS;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className="absolute rounded-full cursor-pointer border-0 p-0 transition-opacity duration-150 hover:opacity-90 focus:outline-none focus:ring-0"
                                    style={{
                                        left: `${pos.x * 100}%`,
                                        top: `${pos.y * 100}%`,
                                        transform: 'translate(-50%, -50%)',
                                        width: 'clamp(20px, 4vw, 32px)',
                                        height: 'clamp(20px, 4vw, 32px)',
                                        backgroundColor: `rgba(255, 255, 255, ${brightness})`,
                                    }}
                                    onClick={() => handleDarkCircleClick(index)}
                                    aria-label={isTarget ? 'Correct circle' : 'Circle'}
                                />
                            );
                        })}
                    </div>
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
                        onKeyDown={handlePasswordKeyDown}
                        onPaste={handlePaste}
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
