import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText } from '../common/TypewriterText';

export function AIDRAAssistant({ message, onMessageComplete }) {
    const [isTyping, setIsTyping] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState(null);

    useEffect(() => {
        if (message) {
            setIsTyping(true);
            setDisplayedMessage(message);

            // Auto-dismiss after duration
            const duration = message.duration || 3000;
            if (duration > 0) {
                const timer = setTimeout(() => {
                    setIsTyping(false);
                    onMessageComplete?.();
                }, duration);
                return () => clearTimeout(timer);
            }
        }
    }, [message, onMessageComplete]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'error': return 'text-red-400 border-red-400';
            case 'warning': return 'text-yellow-400 border-yellow-400';
            case 'success': return 'text-green-400 border-green-400';
            default: return 'text-blue-400 border-blue-400';
        }
    };

    return (
        <div className="bg-[#111] rounded-lg p-4 border border-gray-800 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <span className="font-bold text-white font-mono text-sm">AIDRA</span>
                <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-4">
                <motion.div
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center
                     ${displayedMessage ? getTypeColor(displayedMessage.type) : 'border-blue-500'}`}
                    animate={{
                        scale: isTyping ? [1, 1.05, 1] : 1,
                        boxShadow: isTyping
                            ? ['0 0 10px rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.8)', '0 0 10px rgba(59, 130, 246, 0.5)']
                            : '0 0 10px rgba(59, 130, 246, 0.2)',
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-3 h-3 rounded-full bg-blue-400"
                        animate={isTyping ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </motion.div>
            </div>

            {/* Message area */}
            <div className="min-h-[60px] text-xs font-mono text-gray-300">
                <AnimatePresence mode="wait">
                    {displayedMessage ? (
                        <motion.div
                            key={displayedMessage.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={displayedMessage.type === 'error' ? 'text-red-400' : ''}
                        >
                            <TypewriterText
                                text={displayedMessage.text}
                                speed={30}
                                className="leading-relaxed"
                            />
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="text-gray-600 italic text-[10px]"
                        >
                            "Ready to assist."
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
