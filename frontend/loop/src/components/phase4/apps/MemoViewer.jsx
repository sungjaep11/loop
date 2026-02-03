import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEMO_TEXT = 'The last piece was in my hand.';
const PASTED_PASSWORD = 'S4V3_TH3_S0UL';

export function MemoViewer({ unlocked = false }) {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
    const [pastedContent, setPastedContent] = useState(null);

    const handlePaste = useCallback(() => {
        setPastedContent(PASTED_PASSWORD);
        setShowContextMenu(false);
    }, []);

    const handleContextMenu = (e) => {
        e.preventDefault();
        if (!unlocked) return;
        setContextPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    useEffect(() => {
        if (!unlocked) return;
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                handlePaste();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [unlocked, handlePaste]);

    return (
        <div
            className="h-full w-full bg-[#f5f5dc] text-black font-sans text-sm p-6 select-text cursor-default"
            onContextMenu={handleContextMenu}
            onClick={() => setShowContextMenu(false)}
        >
            <div className="font-mono whitespace-pre-wrap">
                {unlocked ? MEMO_TEXT : null}
                {unlocked && pastedContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded font-mono font-bold text-blue-800 break-all"
                    >
                        {pastedContent}
                    </motion.div>
                )}
            </div>

            {!unlocked && (
                <div className="text-gray-400 italic text-sm">Nothing to display.</div>
            )}
            <AnimatePresence>
                {unlocked && showContextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-[100] bg-white border border-gray-300 shadow-lg rounded py-1 min-w-[140px]"
                        style={{ left: contextPos.x, top: contextPos.y }}
                    >
                        <button
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-blue-100 text-sm"
                            onClick={handlePaste}
                        >
                            Paste
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
