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
    'ending'
];

export function DebugSceneSwitcher() {
    const [isVisible, setIsVisible] = useState(false);
    const { currentScene, setScene } = useGameStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Toggle with Ctrl+Shift+D or generic specific key
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                setIsVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 z-[9999] bg-black/90 text-green-400 p-4 font-mono text-xs border-r border-b border-green-600 max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-2 border-b border-green-800 pb-1">
                <h3 className="font-bold">DEBUG: SCENE SELECTOR</h3>
                <button onClick={() => setIsVisible(false)} className="text-red-500 hover:text-red-400">[X]</button>
            </div>
            <div className="mb-2 text-gray-400">Current: <span className="text-white">{currentScene}</span></div>
            <div className="flex flex-col gap-1">
                {SCENES.map(scene => (
                    <button
                        key={scene}
                        onClick={() => setScene(scene)}
                        className={`text-left px-2 py-1 hover:bg-green-900 transition-colors
                        ${currentScene === scene ? 'bg-green-800 text-white font-bold' : ''}`}
                    >
                        {scene}
                    </button>
                ))}
            </div>
            <div className="mt-4 text-[10px] text-gray-500">
                Press Ctrl+Shift+D to toggle
            </div>
        </div>
    );
}
