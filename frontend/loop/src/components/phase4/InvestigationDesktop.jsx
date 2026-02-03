import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileManager } from './apps/FileManager';
import { RecycleBin } from './apps/RecycleBin';
import { ClipboardViewer } from './apps/ClipboardViewer';
import { MemoViewer } from './apps/MemoViewer';
import { HexError } from './apps/HexError';

const DESKTOP_IDS_DELETION_ORDER = ['bin', 'calculator', 'notepad', 'ie', 'mydocs', 'controlpanel', 'error'];
const AI_DIALOGUE = "Thank you for waiting, User. ...But why are the files on the desktop restored?";
const KILL_PROCESS_COUNTDOWN_MS = 8000;
const DELETION_INTERVAL_MS = 1800;

// Mock File System with random-looking positions for desktop icons
const INITIAL_FILES = {
    'desktop': [
        { id: 'bin', name: 'Recycle Bin', type: 'app', icon: '🗑️', pos: { x: 85, y: 75 } },
        // Dummy programs - clicking these does nothing important
        { id: 'calculator', name: 'Calculator', type: 'app', icon: '🔢', pos: { x: 20, y: 15 } },
        { id: 'notepad', name: 'Notepad', type: 'app', icon: '📝', pos: { x: 50, y: 25 } },
        { id: 'ie', name: 'Internet Explorer', type: 'app', icon: '🌐', pos: { x: 75, y: 20 } },
        { id: 'mydocs', name: 'My Documents', type: 'folder', icon: '📁', pos: { x: 10, y: 55 } },
        { id: 'controlpanel', name: 'Control Panel', type: 'app', icon: '⚙️', pos: { x: 40, y: 60 } },
        { id: 'error', name: 'Security_Log.exe', type: 'app', icon: '⚠️', pos: { x: 65, y: 50 } }
    ],
    'bin': [
        // Secret image files (right-click for properties)
        { id: 'img1', name: 'Puppy.jpg', type: 'image', icon: '🖼️', properties: { creator: 'User_7th_Survivor' } },
        { id: 'img2', name: 'Bread.png', type: 'image', icon: '🖼️', properties: { tag: 'Password_Is_' } },
        { id: 'img3', name: 'Coffee.png', type: 'image', icon: '🖼️', properties: { description: 'Hidden_In_Clipboard' } },
        // Recoverable files needed for the puzzle
        { id: 'memo', name: 'Memo.txt', type: 'text', icon: '📄', restorable: true },
        { id: 'manual', name: 'Manual_Standard.pdf', type: 'file', icon: '📄', hiddenExt: 'zip', size: '500MB', restorable: true }
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

                {/* Desktop Icons — scattered across desktop, grey out when "deleted" by AI */}
                {files.desktop.map(file => (
                    <div
                        key={file.id}
                        className="absolute"
                        style={{
                            left: `${file.pos?.x || 10}%`,
                            top: `${file.pos?.y || 10}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <DesktopIcon
                            file={file}
                            name={file.name}
                            isDeleted={deletedDesktopIds.has(file.id)}
                            onDoubleClick={() => {
                                if (deletedDesktopIds.has(file.id)) return;
                                if (file.id === 'bin') toggleWindow('recycleBin');
                                else if (file.id === 'error') toggleWindow('hexError');
                                // Dummy programs
                                else if (file.id === 'calculator') toggleWindow('dummyCalculator');
                                else if (file.id === 'notepad') toggleWindow('dummyNotepad');
                                else if (file.id === 'ie') toggleWindow('dummyIE');
                                else if (file.id === 'mydocs') toggleWindow('dummyDocs');
                                else if (file.id === 'controlpanel') toggleWindow('dummyControl');
                            }}
                        />
                    </div>
                ))}

                {/* Windows */}
                <AnimatePresence>
                    {windows.includes('recycleBin') && (
                        <Window id="recycleBin" title="Recycle Bin" onClose={() => closeWindow('recycleBin')} isActive={activeWindow === 'recycleBin'} onClick={() => setActiveWindow('recycleBin')}>
                            <RecycleBin
                                files={files.bin}
                                onViewProperties={handleRecycleBinViewProperties}
                                onOpenFile={(fileId) => {
                                    if (fileId === 'memo') toggleWindow('memo');
                                    else if (fileId === 'manual') toggleWindow('fileManager_manual');
                                }}
                            />
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
                                file={files.bin.find(f => f.id === 'manual')}
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

                    {/* Dummy Windows */}
                    {windows.includes('dummyCalculator') && (
                        <Window id="dummyCalculator" title="Calculator" onClose={() => closeWindow('dummyCalculator')} isActive={activeWindow === 'dummyCalculator'} onClick={() => setActiveWindow('dummyCalculator')} width={280} height={350}>
                            <DummyApp type="calculator" />
                        </Window>
                    )}
                    {windows.includes('dummyNotepad') && (
                        <Window id="dummyNotepad" title="Notepad" onClose={() => closeWindow('dummyNotepad')} isActive={activeWindow === 'dummyNotepad'} onClick={() => setActiveWindow('dummyNotepad')} width={400} height={300}>
                            <DummyApp type="notepad" />
                        </Window>
                    )}
                    {windows.includes('dummyIE') && (
                        <Window id="dummyIE" title="Internet Explorer" onClose={() => closeWindow('dummyIE')} isActive={activeWindow === 'dummyIE'} onClick={() => setActiveWindow('dummyIE')} width={500} height={400}>
                            <DummyApp type="ie" />
                        </Window>
                    )}
                    {windows.includes('dummyDocs') && (
                        <Window id="dummyDocs" title="My Documents" onClose={() => closeWindow('dummyDocs')} isActive={activeWindow === 'dummyDocs'} onClick={() => setActiveWindow('dummyDocs')} width={450} height={350}>
                            <DummyApp type="mydocs" />
                        </Window>
                    )}
                    {windows.includes('dummyControl') && (
                        <Window id="dummyControl" title="Control Panel" onClose={() => closeWindow('dummyControl')} isActive={activeWindow === 'dummyControl'} onClick={() => setActiveWindow('dummyControl')} width={500} height={400}>
                            <DummyApp type="controlpanel" />
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

// Dummy application component for fake programs
function DummyApp({ type }) {
    const apps = {
        calculator: {
            content: <CalculatorApp />
        },
        notepad: {
            content: (
                <div className="h-full flex flex-col bg-white">
                    <div className="bg-[#ece9d8] border-b p-1 flex gap-4 text-xs">
                        <span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span>
                    </div>
                    <textarea
                        className="flex-1 p-2 resize-none outline-none font-mono text-sm"
                        placeholder="Untitled - Notepad"
                        defaultValue=""
                    />
                </div>
            )
        },
        ie: {
            content: (
                <div className="h-full flex flex-col bg-white">
                    <div className="bg-[#ece9d8] border-b p-1 flex gap-2 items-center text-xs">
                        <button className="px-2 py-1 border bg-white hover:bg-gray-100">←</button>
                        <button className="px-2 py-1 border bg-white hover:bg-gray-100">→</button>
                        <input className="flex-1 border px-2 py-1" defaultValue="http://www.save-corp.internal/" readOnly />
                        <button className="px-2 py-1 border bg-white hover:bg-gray-100">Go</button>
                    </div>
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4 p-4">
                        <span className="text-6xl">🌐</span>
                        <p className="text-center">This page cannot be displayed.</p>
                        <p className="text-xs text-gray-500">Network connection lost.</p>
                    </div>
                </div>
            )
        },
        mydocs: {
            content: <MyDocumentsApp />
        },
        controlpanel: {
            content: <ControlPanelApp />
        }
    };

    return apps[type]?.content || <div className="p-4 text-gray-500">Application not found.</div>;
}

// Interactive My Documents app
function MyDocumentsApp() {
    const [currentFolder, setCurrentFolder] = useState(null);

    const folders = {
        pictures: {
            name: 'My Pictures',
            icon: '📷',
            files: [
                { name: 'Vacation_2024.jpg', icon: '🖼️', size: '2.4 MB' },
                { name: 'Family_Photo.jpg', icon: '🖼️', size: '1.8 MB' },
                { name: 'Birthday_Party.png', icon: '🖼️', size: '3.2 MB' },
                { name: 'Sunset.jpg', icon: '🖼️', size: '1.1 MB' },
                { name: 'Screenshot_001.png', icon: '🖼️', size: '456 KB' },
            ]
        },
        music: {
            name: 'My Music',
            icon: '🎵',
            files: [
                { name: 'Favorite_Song.mp3', icon: '🎵', size: '4.2 MB' },
                { name: 'Jazz_Collection.mp3', icon: '🎵', size: '8.5 MB' },
                { name: 'Workout_Mix.mp3', icon: '🎵', size: '12.3 MB' },
                { name: 'Classical_Piano.mp3', icon: '🎵', size: '6.7 MB' },
            ]
        },
        videos: {
            name: 'My Videos',
            icon: '🎬',
            files: [
                { name: 'Home_Movie_2023.mp4', icon: '🎬', size: '245 MB' },
                { name: 'Tutorial_Recording.mp4', icon: '🎬', size: '156 MB' },
                { name: 'Graduation_Ceremony.mp4', icon: '🎬', size: '512 MB' },
            ]
        }
    };

    const renderFolderContent = (folderKey) => {
        const folder = folders[folderKey];
        return (
            <div className="h-full flex flex-col bg-white">
                <div className="bg-[#ece9d8] border-b p-1 flex gap-4 text-xs">
                    <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span>
                </div>
                <div className="bg-white border-b p-1 flex items-center gap-2 text-xs">
                    <button
                        onClick={() => setCurrentFolder(null)}
                        className="px-2 py-1 border bg-[#ece9d8] hover:bg-gray-200 rounded"
                    >
                        ← Back
                    </button>
                    <span className="text-gray-600">📁 My Documents \ {folder.name}</span>
                </div>
                <div className="flex-1 p-4 grid grid-cols-4 gap-3 content-start overflow-auto">
                    {folder.files.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer"
                            onDoubleClick={() => alert(`Opening ${file.name}...\n\nFile cannot be opened.\nThe associated application is not installed.`)}
                        >
                            <span className="text-2xl">{file.icon}</span>
                            <span className="text-[10px] text-center break-all leading-tight">{file.name}</span>
                            <span className="text-[9px] text-gray-400">{file.size}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-[#ece9d8] border-t p-1 text-xs text-gray-500">
                    {folder.files.length} objects
                </div>
            </div>
        );
    };

    if (currentFolder) {
        return renderFolderContent(currentFolder);
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="bg-[#ece9d8] border-b p-1 flex gap-4 text-xs">
                <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span>
            </div>
            <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start">
                <div
                    className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer"
                    onDoubleClick={() => setCurrentFolder('pictures')}
                >
                    <span className="text-3xl">📷</span>
                    <span className="text-xs text-center">My Pictures</span>
                </div>
                <div
                    className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer"
                    onDoubleClick={() => setCurrentFolder('music')}
                >
                    <span className="text-3xl">🎵</span>
                    <span className="text-xs text-center">My Music</span>
                </div>
                <div
                    className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer"
                    onDoubleClick={() => setCurrentFolder('videos')}
                >
                    <span className="text-3xl">🎬</span>
                    <span className="text-xs text-center">My Videos</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer opacity-50">
                    <span className="text-3xl">📁</span>
                    <span className="text-xs text-center text-gray-400">Empty Folder</span>
                </div>
            </div>
            <div className="bg-[#ece9d8] border-t p-1 text-xs text-gray-500">4 objects</div>
        </div>
    );
}

// Functional Calculator App
function CalculatorApp() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            let result;
            switch (operation) {
                case '+':
                    result = currentValue + inputValue;
                    break;
                case '-':
                    result = currentValue - inputValue;
                    break;
                case '*':
                    result = currentValue * inputValue;
                    break;
                case '/':
                    result = inputValue !== 0 ? currentValue / inputValue : 'Error';
                    break;
                default:
                    result = inputValue;
            }
            setDisplay(String(result));
            setPreviousValue(result);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const handleEquals = () => {
        if (!operation || previousValue === null) return;

        const inputValue = parseFloat(display);
        let result;
        switch (operation) {
            case '+':
                result = previousValue + inputValue;
                break;
            case '-':
                result = previousValue - inputValue;
                break;
            case '*':
                result = previousValue * inputValue;
                break;
            case '/':
                result = inputValue !== 0 ? previousValue / inputValue : 'Error';
                break;
            default:
                result = inputValue;
        }
        setDisplay(String(result));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
    };

    const handleButton = (btn) => {
        if (btn >= '0' && btn <= '9') {
            inputDigit(btn);
        } else if (btn === '.') {
            inputDecimal();
        } else if (btn === '=') {
            handleEquals();
        } else if (['+', '-', '*', '/'].includes(btn)) {
            performOperation(btn);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#ece9d8] p-2">
            <div className="bg-white border border-gray-400 p-2 mb-2 text-right font-mono text-xl overflow-hidden">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-1 mb-1">
                <button
                    onClick={clear}
                    className="col-span-2 bg-[#ff6b6b] border border-gray-400 hover:bg-red-400 font-bold text-white py-2"
                >
                    C
                </button>
                <button
                    onClick={() => setDisplay(display.slice(0, -1) || '0')}
                    className="bg-[#ffa94d] border border-gray-400 hover:bg-orange-300 font-bold py-2"
                >
                    ←
                </button>
                <button
                    onClick={() => handleButton('/')}
                    className={`border border-gray-400 font-bold py-2 ${operation === '/' ? 'bg-blue-300' : 'bg-[#d4d0c8] hover:bg-gray-200'}`}
                >
                    ÷
                </button>
            </div>
            <div className="grid grid-cols-4 gap-1 flex-1">
                {['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(btn => (
                    <button
                        key={btn}
                        onClick={() => handleButton(btn)}
                        className={`border border-gray-400 font-bold
                            ${btn === '=' ? 'bg-[#51cf66] hover:bg-green-400 text-white' : ''}
                            ${btn === '0' ? '' : ''}
                            ${['+', '-', '*'].includes(btn) && operation === btn ? 'bg-blue-300' : ''}
                            ${!['+', '-', '*', '='].includes(btn) || operation !== btn ? 'bg-[#d4d0c8] hover:bg-gray-200' : ''}
                        `}
                    >
                        {btn === '*' ? '×' : btn}
                    </button>
                ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">Standard Calculator</div>
        </div>
    );
}

// Interactive Control Panel App
function ControlPanelApp() {
    const [currentPanel, setCurrentPanel] = useState(null);
    const [settings, setSettings] = useState({
        volume: 75,
        brightness: 80,
        resolution: '1920x1080',
        theme: 'Windows Classic',
        firewall: true,
        powerPlan: 'Balanced'
    });

    const panels = {
        display: {
            icon: '🖥️',
            name: 'Display',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Display Settings</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Screen Resolution</label>
                            <select
                                className="w-full border p-1 text-sm"
                                value={settings.resolution}
                                onChange={(e) => setSettings({ ...settings, resolution: e.target.value })}
                            >
                                <option>1920x1080</option>
                                <option>1680x1050</option>
                                <option>1440x900</option>
                                <option>1280x720</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Brightness: {settings.brightness}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.brightness}
                                onChange={(e) => setSettings({ ...settings, brightness: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Theme</label>
                            <select
                                className="w-full border p-1 text-sm"
                                value={settings.theme}
                                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                            >
                                <option>Windows Classic</option>
                                <option>Windows XP</option>
                                <option>Silver</option>
                                <option>Olive Green</option>
                            </select>
                        </div>
                    </div>
                </div>
            )
        },
        sound: {
            icon: '🔊',
            name: 'Sound',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Sound Settings</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Master Volume: {settings.volume}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.volume}
                                onChange={(e) => setSettings({ ...settings, volume: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{settings.volume === 0 ? '🔇' : settings.volume < 50 ? '🔉' : '🔊'}</span>
                            <div className="flex-1 bg-gray-200 h-3 rounded">
                                <div
                                    className="bg-green-500 h-full rounded transition-all"
                                    style={{ width: `${settings.volume}%` }}
                                />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>🎵 Default Sound Device: Speakers (Realtek Audio)</p>
                            <p>🎤 Default Recording Device: Microphone (Realtek Audio)</p>
                        </div>
                    </div>
                </div>
            )
        },
        network: {
            icon: '🌐',
            name: 'Network',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Network Connections</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 border rounded bg-red-50">
                            <span className="text-2xl">❌</span>
                            <div>
                                <p className="font-bold text-red-600">Local Area Connection</p>
                                <p className="text-xs text-red-500">Network cable unplugged</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded bg-red-50">
                            <span className="text-2xl">📡</span>
                            <div>
                                <p className="font-bold text-red-600">Wireless Connection</p>
                                <p className="text-xs text-red-500">Not connected - No networks found</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        ⚠️ Warning: All network connections are unavailable. Please check your cables or contact your system administrator.
                    </div>
                </div>
            )
        },
        security: {
            icon: '🔒',
            name: 'Security',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Security Center</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🛡️</span>
                                <span>Windows Firewall</span>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, firewall: !settings.firewall })}
                                className={`px-3 py-1 rounded text-xs font-bold ${settings.firewall ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                            >
                                {settings.firewall ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded bg-yellow-50">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🦠</span>
                                <span>Virus Protection</span>
                            </div>
                            <span className="text-xs text-yellow-600 font-bold">NOT FOUND</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🔄</span>
                                <span>Automatic Updates</span>
                            </div>
                            <span className="text-xs text-green-600 font-bold">ON</span>
                        </div>
                    </div>
                </div>
            )
        },
        users: {
            icon: '👤',
            name: 'User Accounts',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">User Accounts</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 border rounded bg-blue-50">
                            <span className="text-3xl">👤</span>
                            <div>
                                <p className="font-bold">Administrator</p>
                                <p className="text-xs text-gray-500">Computer administrator</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded">
                            <span className="text-3xl">👤</span>
                            <div>
                                <p className="font-bold">Guest</p>
                                <p className="text-xs text-gray-500">Guest account (disabled)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded opacity-50">
                            <span className="text-3xl">👻</span>
                            <div>
                                <p className="font-bold text-gray-400">[DELETED]</p>
                                <p className="text-xs text-red-400">Account removed</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        datetime: {
            icon: '📅',
            name: 'Date and Time',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Date and Time</h3>
                    <div className="text-center space-y-4">
                        <div className="text-4xl font-mono">
                            {new Date().toLocaleTimeString()}
                        </div>
                        <div className="text-lg">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">
                            Time Zone: (UTC+09:00) Seoul
                        </div>
                    </div>
                </div>
            )
        },
        printers: {
            icon: '🖨️',
            name: 'Printers',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Printers and Faxes</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 border rounded">
                            <span className="text-2xl">🖨️</span>
                            <div>
                                <p className="font-bold">Microsoft XPS Document Writer</p>
                                <p className="text-xs text-gray-500">Ready</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 border rounded bg-red-50">
                            <span className="text-2xl">🖨️</span>
                            <div>
                                <p className="font-bold text-red-600">HP LaserJet Pro</p>
                                <p className="text-xs text-red-500">Offline - Connection error</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full p-2 border rounded hover:bg-gray-100 text-xs">
                        + Add a printer
                    </button>
                </div>
            )
        },
        power: {
            icon: '⚡',
            name: 'Power Options',
            content: (
                <div className="p-4 space-y-4">
                    <h3 className="font-bold border-b pb-2">Power Options</h3>
                    <div className="space-y-2">
                        {['Balanced', 'Power saver', 'High performance'].map(plan => (
                            <label key={plan} className={`flex items-center gap-3 p-2 border rounded cursor-pointer ${settings.powerPlan === plan ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="powerPlan"
                                    checked={settings.powerPlan === plan}
                                    onChange={() => setSettings({ ...settings, powerPlan: plan })}
                                />
                                <div>
                                    <p className="font-bold">{plan}</p>
                                    <p className="text-xs text-gray-500">
                                        {plan === 'Balanced' && 'Automatically balances performance with energy consumption'}
                                        {plan === 'Power saver' && 'Saves energy by reducing performance'}
                                        {plan === 'High performance' && 'Maximizes performance (uses more power)'}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )
        }
    };

    if (currentPanel) {
        const panel = panels[currentPanel];
        return (
            <div className="h-full flex flex-col bg-white">
                <div className="bg-[#ece9d8] border-b p-1 flex gap-4 text-xs">
                    <span>File</span><span>Edit</span><span>View</span><span>Tools</span><span>Help</span>
                </div>
                <div className="bg-white border-b p-1 flex items-center gap-2 text-xs">
                    <button
                        onClick={() => setCurrentPanel(null)}
                        className="px-2 py-1 border bg-[#ece9d8] hover:bg-gray-200 rounded"
                    >
                        ← Back
                    </button>
                    <span className="text-gray-600">{panel.icon} {panel.name}</span>
                </div>
                <div className="flex-1 overflow-auto">
                    {panel.content}
                </div>
                <div className="bg-[#ece9d8] border-t p-2 flex justify-end gap-2">
                    <button className="px-4 py-1 border bg-white hover:bg-gray-50 text-xs rounded">OK</button>
                    <button onClick={() => setCurrentPanel(null)} className="px-4 py-1 border bg-white hover:bg-gray-50 text-xs rounded">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="bg-[#ece9d8] border-b p-1 flex gap-4 text-xs">
                <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span>
            </div>
            <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start">
                {Object.entries(panels).map(([key, panel]) => (
                    <div
                        key={key}
                        className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer"
                        onDoubleClick={() => setCurrentPanel(key)}
                    >
                        <span className="text-3xl">{panel.icon}</span>
                        <span className="text-xs text-center">{panel.name}</span>
                    </div>
                ))}
            </div>
            <div className="bg-[#ece9d8] border-t p-1 text-xs text-gray-500">8 objects</div>
        </div>
    );
}
