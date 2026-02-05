import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

const SCENES = [
    'opening',
    'prologue',
    'boot',
    'desktop',
    'video',
    'contract',
    'workspace',
    'glitch',
    'false_normalcy',
    'resignation',
    'lockdown',
    'investigation',
    'mirror',
    'terminal',
    'logicDuel',
    'ending'
];

export function DebugSceneSwitcher() {
    const [isVisible, setIsVisible] = useState(false);
    const currentScene = useGameStore((s) => s.currentScene);
    const setScene = useGameStore((s) => s.setScene);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsVisible((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            {/* Debug button: always visible in corner to open warp panel */}
            <button
                type="button"
                onClick={() => setIsVisible((v) => !v)}
                className="fixed top-2 right-2 z-[9998] px-2 py-1 font-mono text-[10px] bg-green-900/90 text-green-300 border border-green-600 rounded hover:bg-green-800 hover:text-white shadow-lg"
                title="Toggle debug scene warp (or Ctrl+Shift+D)"
            >
                DEBUG
            </button>

            {isVisible && (
                <div className="fixed top-0 left-0 z-[9999] bg-black/95 text-green-400 p-4 font-mono text-xs border-r border-b border-green-600 max-h-screen overflow-auto shadow-xl">
                    <div className="flex justify-between items-center mb-2 border-b border-green-800 pb-1">
                        <h3 className="font-bold">WARP TO STAGE</h3>
                        <button onClick={() => setIsVisible(false)} className="text-red-500 hover:text-red-400">[X]</button>
                    </div>
                    <div className="mb-2 text-gray-400">Current: <span className="text-white font-bold">{currentScene}</span></div>
                    <button
                        type="button"
                        onClick={() => {
                            setScene('investigation');
                            setIsVisible(false);
                        }}
                        className="mb-3 w-full px-3 py-2 bg-[#004080] text-white border border-[#3f96fe] rounded hover:bg-[#0055aa] font-bold text-left flex items-center gap-2"
                    >
                        <span>🖥️</span>
                        Jump to this screen (Investigation Desktop)
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (currentScene !== 'logicDuel') {
                                setScene('logicDuel');
                                // Wait for component to mount before triggering warp
                                setTimeout(() => {
                                    window.dispatchEvent(new CustomEvent('debug-warp-logicduel'));
                                }, 500);
                            } else {
                                window.dispatchEvent(new CustomEvent('debug-warp-logicduel'));
                            }
                            setIsVisible(false);
                        }}
                        className="mb-3 w-full px-3 py-2 bg-red-900/50 text-red-200 border border-red-500/50 rounded hover:bg-red-800/80 font-bold text-left flex items-center gap-2"
                    >
                        <span>💥</span>
                        Warp to LogicDuel Ending (Phase 4)
                    </button>
                    <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                        {SCENES.map((scene) => (
                            <button
                                key={scene}
                                type="button"
                                onClick={() => {
                                    setScene(scene);
                                    setIsVisible(false);
                                }}
                                className={`text-left px-2 py-1.5 rounded hover:bg-green-900 transition-colors
                                    ${currentScene === scene ? 'bg-green-800 text-white font-bold ring-1 ring-green-500' : ''}`}
                            >
                                {scene}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 text-[10px] text-gray-500">
                        Ctrl+Shift+D to toggle
                    </div>
                </div>
            )}
        </>
    );
}
