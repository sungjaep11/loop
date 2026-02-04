import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

// Bullet Hell (Data Incineration Protocol) constants
const GAUGE_PER_CLICK = 6;
const GAUGE_DRAIN_LASER = 12;
const GAUGE_DRAIN_BULLET = 8;
const STUN_DURATION_MS = 600;
const LASER_WIDTH = 0.02; // normalized (2% of screen)
const LASER_SPEED = 0.35; // per second
const LASER_SPAWN_INTERVAL = 1800; // ms
const BULLET_SPEED = 0.4;
const BULLET_HIT_RADIUS = 0.03;
const TURRET_SHOOT_INTERVAL = 1400; // ms per turret
const BULLET_TEXT = ['ERR_403', 'DENIED', 'ABORT', 'FAIL', 'BLOCKED'];

const TURRET_POSITIONS = [
    { id: 'tl', x: 0.08, y: 0.12, icon: '⚠️' },
    { id: 'tr', x: 0.92, y: 0.12, icon: '🔒' },
    { id: 'bl', x: 0.08, y: 0.88, icon: '⛔' },
    { id: 'br', x: 0.92, y: 0.88, icon: '🚫' },
    { id: 'ml', x: 0.05, y: 0.5, icon: '❌' },
    { id: 'mr', x: 0.95, y: 0.5, icon: '⛔' },
];

export function LogicDuelScene() {
    const setEnding = useGameStore((s) => s.setEnding);
    const containerRef = useRef(null);
    const executeButtonRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const lastFrameRef = useRef(performance.now());
    const laserIdRef = useRef(0);
    const bulletIdRef = useRef(0);

    const [gauge, setGauge] = useState(0);
    const [lasers, setLasers] = useState([]);
    const [bullets, setBullets] = useState([]);
    const [stunUntil, setStunUntil] = useState(0);
    const [confirmText, setConfirmText] = useState('');
    const [showExecute, setShowExecute] = useState(false);
    const [won, setWon] = useState(false);

    const isStunned = () => Date.now() < stunUntil;

    // Track mouse (skip when stunned so cursor "freezes")
    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current || Date.now() < stunUntil) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        };
    }, [stunUntil]);

    // Spawn lasers from left and right
    useEffect(() => {
        if (won) return;
        const id = setInterval(() => {
            const now = Date.now();
            setLasers((prev) => [
                ...prev,
                { id: ++laserIdRef.current, x: 0, dir: 1, spawn: now },
                { id: ++laserIdRef.current, x: 1, dir: -1, spawn: now },
            ]);
        }, LASER_SPAWN_INTERVAL);
        return () => clearInterval(id);
    }, [won]);

    // Turrets shoot bullets toward current mouse
    useEffect(() => {
        if (won) return;
        const id = setInterval(() => {
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            setBullets((prev) => {
                const next = [...prev];
                TURRET_POSITIONS.forEach((t) => {
                    const dx = mx - t.x;
                    const dy = my - t.y;
                    const len = Math.sqrt(dx * dx + dy * dy) || 0.001;
                    next.push({
                        id: ++bulletIdRef.current,
                        x: t.x,
                        y: t.y,
                        vx: (dx / len) * BULLET_SPEED * 0.016,
                        vy: (dy / len) * BULLET_SPEED * 0.016,
                        text: BULLET_TEXT[Math.floor(Math.random() * BULLET_TEXT.length)],
                    });
                });
                return next;
            });
        }, TURRET_SHOOT_INTERVAL);
        return () => clearInterval(id);
    }, [won]);

    // Game loop: move lasers & bullets, hit detection, stun
    useEffect(() => {
        if (won) return;
        let raf;
        const loop = () => {
            const now = performance.now();
            const dt = (now - lastFrameRef.current) / 1000;
            lastFrameRef.current = now;
            const stunned = Date.now() < stunUntil;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            setLasers((prev) => {
                const next = prev
                    .map((l) => ({ ...l, x: l.x + l.dir * LASER_SPEED * dt }))
                    .filter((l) => l.x >= -0.1 && l.x <= 1.1);
                if (!stunned && next.some((l) => Math.abs(mx - l.x) < LASER_WIDTH / 2)) {
                    setGauge((g) => Math.max(0, g - GAUGE_DRAIN_LASER));
                    setStunUntil(Date.now() + STUN_DURATION_MS);
                }
                return next;
            });

            setBullets((prev) => {
                let hit = false;
                const next = prev
                    .map((b) => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
                    .filter((b) => {
                        if (b.x < -0.1 || b.x > 1.1 || b.y < -0.1 || b.y > 1.1) return false;
                        if (!stunned && Math.hypot(b.x - mx, b.y - my) < BULLET_HIT_RADIUS) {
                            hit = true;
                            return false;
                        }
                        return true;
                    });
                if (hit) {
                    setGauge((g) => Math.max(0, g - GAUGE_DRAIN_BULLET));
                    setStunUntil(Date.now() + STUN_DURATION_MS);
                }
                return next;
            });

            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [won, stunUntil]);

    useEffect(() => {
        if (gauge >= 100 && confirmText.trim().toUpperCase() === 'EXECUTE') setShowExecute(true);
    }, [gauge, confirmText]);

    const handleInstallClick = useCallback(() => {
        if (won || isStunned()) return;
        setGauge((g) => Math.min(100, g + GAUGE_PER_CLICK));
    }, [won, stunUntil]);

    const handleExecuteClick = useCallback(
        (e) => {
            if (!showExecute || won) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (!executeButtonRef.current) return;
            const btn = executeButtonRef.current.getBoundingClientRect();
            if (
                e.clientX >= btn.left &&
                e.clientX <= btn.left + btn.width &&
                e.clientY >= btn.top &&
                e.clientY <= btn.top + btn.height
            ) {
                setWon(true);
                setTimeout(() => setEnding('freedom'), 800);
            }
        },
        [showExecute, won, setEnding]
    );

    if (won) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-green-500 font-mono text-2xl"
                >
                    KILL_PROCESS.exe — EXECUTED. Disconnecting...
                </motion.p>
            </div>
        );
    }

    const stunned = isStunned();

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden bg-[#0a0a12] select-none"
            onMouseMove={handleMouseMove}
            onClick={(e) => {
                handleExecuteClick(e);
                // Install button click is handled by its own onClick with stopPropagation
            }}
        >
            {/* Stun overlay */}
            <AnimatePresence>
                {stunned && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[400] pointer-events-none bg-red-500/20 flex items-center justify-center"
                    >
                        <span className="font-mono text-red-500 text-xl font-bold tracking-widest">
                            STUNNED
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Title + protocol */}
            <div className="absolute top-4 left-4 z-[200] font-mono text-xs text-red-400/90">
                <div className="text-red-500 font-bold tracking-widest">DATA INCINERATION PROTOCOL</div>
                <div className="text-red-400/70 mt-0.5">Avoid lasers & bullets. Click UPLOAD to install.</div>
            </div>

            {/* KILL_PROCESS gauge - top right */}
            <div className="absolute top-4 right-4 z-[200] font-mono text-xs text-right">
                <div className="text-cyan-400/90 mb-1">KILL_PROCESS.exe</div>
                <div className="w-36 h-3 bg-black/70 border border-red-500/60 rounded overflow-hidden">
                    <motion.div
                        className="h-full bg-red-600"
                        style={{ width: `${Math.min(100, gauge)}%` }}
                        transition={{ type: 'tween', duration: 0.1 }}
                    />
                </div>
                <span className="text-red-400/90">{Math.round(gauge)}%</span>
            </div>

            {/* Center: UPLOAD button (fill gauge) + EXECUTE when ready */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none">
                <div className="pointer-events-auto">
                    {gauge < 100 ? (
                        <motion.button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleInstallClick();
                            }}
                            disabled={stunned}
                            className="px-8 py-4 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 disabled:pointer-events-none border-2 border-cyan-400 text-white font-mono font-bold text-lg rounded-lg shadow-lg cursor-pointer transition-colors"
                        >
                            UPLOAD
                        </motion.button>
                    ) : (
                        <div className="space-y-3">
                            <label className="block text-cyan-300/90 text-sm">Type EXECUTE to confirm</label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-black/80 border border-cyan-500/50 text-cyan-100 px-3 py-2 font-mono text-sm w-48 outline-none rounded pointer-events-auto"
                                placeholder="EXECUTE"
                            />
                            {showExecute && (
                                <motion.button
                                    ref={executeButtonRef}
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExecuteClick(e);
                                    }}
                                    className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-500 border-2 border-red-400 text-white font-mono font-bold rounded-lg shadow-lg cursor-pointer inline-block pointer-events-auto"
                                >
                                    EXECUTE
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Lasers (scan lines from left/right) */}
            {lasers.map((l) => (
                <div
                    key={l.id}
                    className="absolute top-0 bottom-0 w-full pointer-events-none z-[100]"
                    style={{
                        left: `${l.x * 100}%`,
                        width: `${LASER_WIDTH * 100}%`,
                        marginLeft: `${-(LASER_WIDTH * 50)}%`,
                        background: 'linear-gradient(90deg, transparent, rgba(255,0,0,0.6), transparent)',
                        boxShadow: '0 0 20px rgba(255,0,0,0.5)',
                    }}
                />
            ))}

            {/* Turrets (desktop icons as turrets) */}
            {TURRET_POSITIONS.map((t) => (
                <div
                    key={t.id}
                    className="absolute w-10 h-10 flex items-center justify-center text-2xl pointer-events-none z-[150]"
                    style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%`, transform: 'translate(-50%, -50%)' }}
                >
                    {t.icon}
                </div>
            ))}

            {/* Bullets (error message projectiles) */}
            {bullets.map((b) => (
                <motion.div
                    key={b.id}
                    className="absolute pointer-events-none z-[120] font-mono text-[10px] text-red-400 font-bold whitespace-nowrap"
                    style={{
                        left: `${b.x * 100}%`,
                        top: `${b.y * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        textShadow: '0 0 4px rgba(255,0,0,0.8)',
                    }}
                >
                    {b.text}
                </motion.div>
            ))}

            <div className="absolute bottom-4 right-4 font-mono text-cyan-500/50 text-[10px] tracking-widest">
                BULLET HELL
            </div>
        </div>
    );
}
