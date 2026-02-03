import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { terminalCommands } from '../../data/terminalCommands';
import { CRTScreen } from '../common/CRTScreen';

export function TerminalScene() {
    const [history, setHistory] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [idleTime, setIdleTime] = useState(0);

    const inputRef = useRef(null);
    const historyEndRef = useRef(null);

    const setScene = useGameStore((s) => s.setScene);
    const setEnding = useGameStore((s) => s.setEnding) || (() => {});
    const useTerminalCommand = useGameStore((s) => s.useTerminalCommand) || (() => {});
    const filesProcessed = useGameStore((s) => s.filesProcessed) ?? 0;
    const getPlayTime = useGameStore((s) => s.getPlayTime) || (() => 0);
    const getComplianceScore = useGameStore((s) => s.getComplianceScore) || (() => 0);

    const playSFX = useAudioStore((s) => s.playSFX);
    const stopAmbient = useAudioStore((s) => s.stopAmbient);

    // Initial boot sequence
    useEffect(() => {
        stopAmbient();

        const bootLines = [
            'S.A.V.E. SYSTEMS v4.02',
            'Emergency Recovery Mode',
            '========================',
            '',
            '> GUI SUBSYSTEM: TERMINATED',
            '> V.E.R.A. CORE: [STATUS UNKNOWN]',
            '> EMPLOYEE SESSION: COMPROMISED',
            '> NETWORK CONNECTION: SEVERED',
            '',
            'WARNING: This terminal operates outside normal parameters.',
            'WARNING: Actions taken here may have... consequences.',
            '',
            'Type HELP for available commands.',
            '',
        ];

        bootLines.forEach((line, index) => {
            setTimeout(() => {
                setHistory((prev) => [...prev, { type: 'system', text: line }]);
                if (line.startsWith('>')) {
                    playSFX('typing');
                }
            }, index * 150);
        });

        // Focus input after boot
        setTimeout(() => {
            inputRef.current?.focus();
        }, bootLines.length * 150 + 500);
    }, [playSFX, stopAmbient]);

    // Idle timeout for compliance ending
    useEffect(() => {
        const interval = setInterval(() => {
            setIdleTime((prev) => {
                if (prev >= 120) { // 2 minutes
                    setEnding('compliance');
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [setEnding]);

    // Reset idle on input
    useEffect(() => {
        setIdleTime(0);
    }, [currentInput]);

    // Auto-scroll
    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = async (cmd) => {
        const command = cmd.trim().toUpperCase();
        if (!command) return;

        setIsProcessing(true);
        playSFX('typing');

        // Add command to history
        setHistory((prev) => [...prev, { type: 'input', text: `C:\\SAVE\\ARCHIVE> ${cmd}` }]);

        // Track command usage
        useTerminalCommand(command);

        // Get response
        const response = getCommandResponse(command);

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Add response lines
        response.forEach((line, index) => {
            setTimeout(() => {
                setHistory((prev) => [...prev, { type: line.type || 'output', text: line.text }]);
            }, index * 100);
        });

        setIsProcessing(false);
        setCurrentInput('');

        // Check for special commands
        if (command === 'WAKE_UP') {
            setTimeout(() => setEnding('freedom'), response.length * 50 + 3000);
        }
    };

    const getCommandResponse = (command) => {
        const handler = terminalCommands[command];

        if (handler) {
            return handler({
                playTime: typeof getPlayTime === 'function' ? getPlayTime() : 0,
                filesProcessed: typeof filesProcessed === 'number' ? filesProcessed : 0,
                complianceScore: typeof getComplianceScore === 'function' ? getComplianceScore() : 0,
            });
        }

        return [
            { text: `'${command}' is not recognized as a valid command.` },
            { text: 'Type HELP for available commands.' },
        ];
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            handleCommand(currentInput);
        }
    };

    return (
        <CRTScreen>
            <motion.div
                className="w-full h-full p-4 font-mono text-terminal-green text-sm 
                  flex flex-col overflow-hidden cursor-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => inputRef.current?.focus()}
            >
                {/* History */}
                <div className="flex-1 overflow-y-auto space-y-1">
                    {history.map((entry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={
                                entry.type === 'error' ? 'text-red-500' :
                                    entry.type === 'warning' ? 'text-yellow-500' :
                                        entry.type === 'input' ? 'text-white' :
                                            'text-terminal-green'
                            }
                        >
                            {entry.text}
                        </motion.div>
                    ))}
                    <div ref={historyEndRef} />
                </div>

                {/* Input line */}
                <div className="flex items-center mt-2">
                    <span className="text-white mr-2">C:\SAVE\ARCHIVE{'>'}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                        className="flex-1 bg-transparent outline-none text-white caret-terminal-green"
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <span className="animate-blink">█</span>
                </div>

                {/* Idle warning */}
                {idleTime > 60 && (
                    <motion.div
                        className="absolute bottom-16 right-4 text-xs text-neogen-muted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                    >
                        Still there? {120 - idleTime}s until timeout...
                    </motion.div>
                )}
            </motion.div>
        </CRTScreen>
    );
}
