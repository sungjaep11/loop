import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileManager } from './apps/FileManager';
import { RecycleBin } from './apps/RecycleBin';
import { ClipboardViewer } from './apps/ClipboardViewer';
import { MemoViewer } from './apps/MemoViewer';
import { HexError } from './apps/HexError';

const DESKTOP_IDS_DELETION_ORDER = ['bin', 'memo', 'manual', 'error'];
const AI_DIALOGUE = "Thank you for waiting, User. ...But why are the files on the desktop restored?";
const KILL_PROCESS_COUNTDOWN_MS = 8000;
const DELETION_INTERVAL_MS = 1800;

// Mock File System
const INITIAL_FILES = {
    'desktop': [
        { id: 'bin', name: 'Recycle Bin', type: 'app', icon: '🗑️' },
        { id: 'memo', name: 'Memo.txt', type: 'file', icon: '📄' },
        { id: 'manual', name: 'Manual_Standard.pdf', type: 'file', icon: '📄', hiddenExt: 'zip', size: '500MB' },
        { id: 'error', name: 'Security_Log.exe', type: 'app', icon: '⚠️' }
    ],
    'bin': [
        { id: 'img1', name: 'Puppy.jpg', type: 'image', icon: '🖼️', properties: { creator: 'User_7th_Survivor' } },
        { id: 'img2', name: 'Bread.png', type: 'image', icon: '🖼️', properties: { tag: 'Password_Is_' } },
        { id: 'img3', name: 'Coffee.png', type: 'image', icon: '🖼️', properties: { description: 'Hidden_In_Clipboard' } }
    ]
};

export function InvestigationDesktop({ onComplete }) {
    const [activeWindow, setActiveWindow] = useState(null); // 'fileManager', 'recycleBin', 'error', 'clipboard'
    const [clipboardHistory, setClipboardHistory] = useState([
        "Text copied: Report_Final_v2.docx",
        "Text copied: Abstract Concept of Soul",
        "S4V3_TH3_S0UL" // Previous user's copied password (discoverable via Memo Paste or clipboard)
    ]);
    const [files, setFiles] = useState(INITIAL_FILES);
    const [windows, setWindows] = useState([]);
    const [recycleBinViewedIds, setRecycleBinViewedIds] = useState(() => new Set());

    // AI return sequence (when player views KILL_PROCESS.exe)
    const [aiReturnPhase, setAiReturnPhase] = useState(null); // null | 'loading' | 'dialogue' | 'deletion' | 'saved' | 'deleted'
    const [loadingBarPercent, setLoadingBarPercent] = useState(0);
    const [deletedDesktopIds, setDeletedDesktopIds] = useState(() => new Set());
    const [killProcessSaved, setKillProcessSaved] = useState(false);
    const deletionIndexRef = useRef(0);
    const killProcessTimerRef = useRef(null);
    const loadingCompleteRef = useRef(false);

    const handleRecycleBinViewProperties = (fileId) => {
        setRecycleBinViewedIds((prev) => new Set([...prev, fileId]));
    };
    const memoUnlocked = recycleBinViewedIds.size >= 3;

    const handleViewKillProcess = () => {
        if (aiReturnPhase !== null) return;
        setAiReturnPhase('loading');
        setLoadingBarPercent(0);
    };

    // Loading bar animate to 100%
    useEffect(() => {
        if (aiReturnPhase !== 'loading') return;
        loadingCompleteRef.current = false;
        const start = Date.now();
        const duration = 1500;
        const tick = () => {
            const elapsed = Date.now() - start;
            const p = Math.min(100, (elapsed / duration) * 100);
            setLoadingBarPercent(p);
            if (p < 100) {
                requestAnimationFrame(tick);
            } else if (!loadingCompleteRef.current) {
                loadingCompleteRef.current = true;
                setAiReturnPhase('dialogue');
                setTimeout(() => setAiReturnPhase('deletion'), 4500);
            }
        };
        requestAnimationFrame(tick);
    }, [aiReturnPhase]);

    // Deletion: remove desktop icons one by one, then countdown for KILL_PROCESS
    useEffect(() => {
        if (aiReturnPhase !== 'deletion') return;
        const ids = DESKTOP_IDS_DELETION_ORDER;
        deletionIndexRef.current = 0;
        const interval = setInterval(() => {
            setDeletedDesktopIds((prev) => {
                const next = new Set(prev);
                if (deletionIndexRef.current < ids.length) {
                    next.add(ids[deletionIndexRef.current]);
                    deletionIndexRef.current += 1;
                }
                return next;
            });
        }, DELETION_INTERVAL_MS);
        const stopInterval = setTimeout(() => clearInterval(interval), ids.length * DELETION_INTERVAL_MS + 100);
        killProcessTimerRef.current = setTimeout(() => {
            if (!killProcessSaved) setAiReturnPhase('deleted');
        }, ids.length * DELETION_INTERVAL_MS + KILL_PROCESS_COUNTDOWN_MS);
        return () => {
            clearInterval(interval);
            clearTimeout(stopInterval);
            if (killProcessTimerRef.current) clearTimeout(killProcessTimerRef.current);
        };
    }, [aiReturnPhase, killProcessSaved]);

    const handleKillProcessDrop = (e) => {
        e.preventDefault();
        if (aiReturnPhase !== 'deletion') return;
        if (e.dataTransfer?.getData('text/plain') !== 'KILL_PROCESS') return;
        setKillProcessSaved(true);
        setAiReturnPhase('saved');
        if (killProcessTimerRef.current) clearTimeout(killProcessTimerRef.current);
        setTimeout(() => onComplete(), 2500);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    };

    const toggleWindow = (id) => {
        if (windows.includes(id)) {
            setActiveWindow(id);
        } else {
            setWindows([...windows, id]);
            setActiveWindow(id);
        }
    };

    const closeWindow = (id) => {
        setWindows(windows.filter(w => w !== id));
        if (activeWindow === id) setActiveWindow(null);
    };

    const isShaking = aiReturnPhase === 'dialogue' || aiReturnPhase === 'deletion';
    const showAiOverlay = aiReturnPhase !== null && aiReturnPhase !== 'saved';

    return (
        <div className="w-full h-full bg-[#004080] relative font-sans overflow-hidden select-none cursor-default">
            {/* Loading bar (top) — appears when AI returns */}
            <AnimatePresence>
                {aiReturnPhase !== null && (
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-2 bg-black/30 z-[200]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="h-full bg-red-600"
                            initial={{ width: '0%' }}
                            animate={{ width: `${loadingBarPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screen shake wrapper */}
            <motion.div
                className="w-full h-full relative"
                animate={isShaking ? {
                    x: [0, -12, 10, -8, 6, -4, 2, 0],
                    y: [0, 6, -8, 4, -6, 2, -2, 0],
                } : {}}
                transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0, repeatType: 'reverse' }}
            >
                {/* Wallpaper */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <span className="text-9xl font-black text-white">S.A.V.E.</span>
                </div>

                {/* Desktop Icons — grey out when "deleted" by AI */}
                <div className="absolute top-4 left-4 flex flex-col gap-6 p-4">
                    {files.desktop.map(file => (
                        <DesktopIcon
                            key={file.id}
                            file={file}
                            name={file.name}
                            isDeleted={deletedDesktopIds.has(file.id)}
                            onDoubleClick={() => {
                                if (deletedDesktopIds.has(file.id)) return;
                                if (file.id === 'bin') toggleWindow('recycleBin');
                                else if (file.id === 'error') toggleWindow('hexError');
                                else if (file.id === 'memo') toggleWindow('memo');
                                else if (file.id === 'manual') toggleWindow('fileManager_manual');
                            }}
                        />
                    ))}
                </div>

            {/* Windows */}
            <AnimatePresence>
                {windows.includes('recycleBin') && (
                    <Window id="recycleBin" title="Recycle Bin" onClose={() => closeWindow('recycleBin')} isActive={activeWindow === 'recycleBin'} onClick={() => setActiveWindow('recycleBin')}>
                        <RecycleBin files={files.bin} onViewProperties={handleRecycleBinViewProperties} />
                    </Window>
                )}

                {windows.includes('memo') && (
                    <Window id="memo" title="Memo.txt" onClose={() => closeWindow('memo')} isActive={activeWindow === 'memo'} onClick={() => setActiveWindow('memo')} width={400} height={300}>
                        <MemoViewer unlocked={memoUnlocked} />
                    </Window>
                )}

                {windows.includes('fileManager_manual') && (
                    <Window id="fileManager_manual" title="File Viewer" onClose={() => closeWindow('fileManager_manual')} isActive={activeWindow === 'fileManager_manual'} onClick={() => setActiveWindow('fileManager_manual')}>
                        <FileManager
                            file={files.desktop.find(f => f.id === 'manual')}
                            onViewKillProcess={handleViewKillProcess}
                        />
                    </Window>
                )}

                {windows.includes('hexError') && (
                    <Window id="hexError" title="System Error" isModal onClose={() => closeWindow('hexError')} isActive={activeWindow === 'hexError'} onClick={() => setActiveWindow('hexError')}>
                        <HexError />
                    </Window>
                )}

                {windows.includes('clipboard') && (
                    <Window id="clipboard" title="Clipboard History" onClose={() => closeWindow('clipboard')} isActive={activeWindow === 'clipboard'} onClick={() => setActiveWindow('clipboard')} width={300} height={400}>
                        <ClipboardViewer history={clipboardHistory} />
                    </Window>
                )}
            </AnimatePresence>

                {/* Taskbar */}
                <Taskbar
                    windows={windows}
                    activeWindow={activeWindow}
                    onWindowClick={setActiveWindow}
                    onStartClick={() => toggleWindow('clipboard')}
                    time={new Date().toLocaleTimeString()}
                />
            </motion.div>

            {/* AI dialogue overlay + drag-drop zone */}
            <AnimatePresence>
                {showAiOverlay && (
                    <motion.div
                        className="absolute inset-0 z-[150] pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {(aiReturnPhase === 'dialogue' || aiReturnPhase === 'deletion') && (
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 max-w-lg px-4 py-3 bg-black/80 border-2 border-red-500 rounded-lg text-red-200 font-mono text-sm text-center shadow-xl">
                                {AI_DIALOGUE}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deletion phase: draggable KILL_PROCESS + drop zone (pointer-events auto) */}
            {aiReturnPhase === 'deletion' && (
                <div className="absolute inset-0 z-[160] pointer-events-none">
                    <div className="absolute inset-0 pointer-events-auto flex items-center justify-center gap-8">
                        {/* Draggable KILL_PROCESS.exe */}
                        <div
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', 'KILL_PROCESS');
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            className="flex flex-col items-center gap-1 w-24 p-3 border-2 border-red-500 bg-red-950/90 rounded cursor-grab active:cursor-grabbing select-none"
                        >
                            <span className="text-4xl text-red-500">⚙️</span>
                            <span className="text-center text-xs font-bold text-red-200">KILL_PROCESS.exe</span>
                            <span className="text-[10px] text-red-300">Drag to System Core</span>
                        </div>
                        {/* Drop zone: System Core / Hidden execution zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleKillProcessDrop}
                            className="w-48 h-32 border-2 border-dashed border-green-500 bg-green-900/40 rounded-lg flex items-center justify-center text-green-300 font-mono text-sm text-center px-2"
                        >
                            SYSTEM CORE<br />Drop here to execute
                        </div>
                    </div>
                </div>
            )}

            {/* Saved: success message */}
            <AnimatePresence>
                {aiReturnPhase === 'saved' && (
                    <motion.div
                        className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.p
                            className="text-green-400 font-mono text-xl font-bold"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                        >
                            KILL_PROCESS executed. Proceeding...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deleted: failure */}
            <AnimatePresence>
                {aiReturnPhase === 'deleted' && (
                    <motion.div
                        className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 text-red-400 font-mono p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-xl font-bold mb-2">File purged. Access denied.</p>
                        <p className="text-sm text-gray-400">The file was deleted before it could be executed.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Subcomponents (Icons, Window, Taskbar)
function DesktopIcon({ file, name, onDoubleClick, isDeleted }) {
    return (
        <div
            className={`flex flex-col items-center gap-1 w-24 group transition-all duration-300
                ${isDeleted ? 'opacity-40 grayscale pointer-events-none' : 'cursor-pointer'}`}
            onDoubleClick={onDoubleClick}
        >
            <div className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform">
                {file.icon}
            </div>
            <span className="text-white text-xs text-center font-medium px-1 rounded bg-black/20 group-hover:bg-[#000080]/60 break-all leading-tight shadow-sm">
                {name}
            </span>
        </div>
    );
}

function Window({ id, title, children, onClose, isActive, onClick, isModal, width = 600, height = 450 }) {
    return (
        <motion.div
            className={`absolute flex flex-col bg-[#ece9d8] border-[3px] border-[#0055ea] rounded-t-lg shadow-2xl overflow-hidden
            ${isActive ? 'z-50' : 'z-40 grayscale-[0.2]'}`}
            style={{
                left: isModal ? '50%' : '100px', top: isModal ? '50%' : '50px',
                width, height, x: isModal ? '-50%' : 0, y: isModal ? '-50%' : 0
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            drag={!isModal}
            dragMomentum={false}
            onPointerDown={onClick}
        >
            {/* Title Bar */}
            <div className="h-8 bg-gradient-to-r from-[#0058ee] to-[#3f96fe] flex items-center justify-between px-2 text-white font-bold text-shadow-sm select-none">
                <span className="flex items-center gap-2 text-sm">{title}</span>
                <div className="flex gap-1">
                    <button className="w-5 h-5 bg-[#d84030] rounded border border-white/50 hover:bg-[#ff5040] flex items-center justify-center font-normal" onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 bg-white p-1 overflow-auto border-2 border-[#ece9d8] relative text-black">
                {children}
            </div>
        </motion.div>
    );
}

function Taskbar({ windows, activeWindow, onWindowClick, onStartClick, time }) {
    return (
        <div className="absolute bottom-0 w-full h-10 bg-gradient-to-b from-[#245edb] to-[#0138b5] flex items-center px-0 z-[100] border-t-2 border-[#3980f4]">
            <button
                onClick={onStartClick}
                className="h-full px-6 bg-gradient-to-b from-[#3d9640] to-[#125e16] rounded-r-lg border-2 border-[#7fc972] border-l-0 text-white font-bold italic shadow-[1px_0_5px_rgba(0,0,0,0.5)] active:brightness-90 flex items-center gap-2 hover:brightness-110 transition-all mr-2"
            >
                Start
            </button>

            <div className="flex-1 flex gap-1 px-2 items-center">
                {windows.map(id => (
                    <button
                        key={id}
                        onClick={() => onWindowClick(id)}
                        className={`h-8 min-w-[140px] px-3 rounded text-left truncate text-xs flex items-center gap-2 border shadow-sm
                        ${activeWindow === id
                                ? 'bg-[#1e52b7] text-white border-[#123681] shadow-inner font-bold'
                                : 'bg-[#3c81f3] text-white border-[#2764c9] hover:bg-[#5293ff]'}`}
                    >
                        {id}
                    </button>
                ))}
            </div>

            <div className="px-4 py-2 bg-[#0b286b] text-white text-xs font-medium border-l border-[#2764c9] h-full flex items-center">
                {time}
                <span className="ml-2 cursor-pointer text-blue-300 hover:text-white" onClick={onStartClick} title="Clipboard">📋</span>
            </div>
        </div>
    );
}
