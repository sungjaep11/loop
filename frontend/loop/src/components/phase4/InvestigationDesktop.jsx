import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { FileManager } from './apps/FileManager';
import { RecycleBin } from './apps/RecycleBin';
import { ClipboardViewer } from './apps/ClipboardViewer';
import { MemoViewer } from './apps/MemoViewer';
import { usePlayerStore } from '../../stores/playerStore';

const DESKTOP_IDS_DELETION_ORDER = ['bin', 'calculator', 'notepad', 'ie', 'mydocs', 'controlpanel'];
const KILL_PROCESS_COUNTDOWN_MS = 8000;
const DELETION_INTERVAL_MS = 1800;

// Mock File System with grid-aligned positions for desktop icons (left-aligned like Windows)
const INITIAL_FILES = {
    'desktop': [
        // Left column - row 1
        { id: 'mydocs', name: 'My Documents', type: 'folder', icon: '📁', pos: { x: 5, y: 8 } },
        { id: 'bin', name: 'Recycle Bin', type: 'app', icon: '🗑️', pos: { x: 5, y: 22 } },
        { id: 'ie', name: 'Internet Explorer', type: 'app', icon: '🌐', pos: { x: 5, y: 36 } },
        // Left column - row 2
        { id: 'calculator', name: 'Calculator', type: 'app', icon: '🧮', pos: { x: 5, y: 50 } },
        { id: 'notepad', name: 'Notepad', type: 'app', icon: '📝', pos: { x: 5, y: 64 } },
        { id: 'controlpanel', name: 'Control Panel', type: 'app', icon: '⚙️', pos: { x: 5, y: 78 } }
    ],
    'hidden': [
        // Hidden file only visible when "Show Hidden Files" is enabled
        { id: 'userlog', name: 'User_Log_History.txt', type: 'hiddenlog', icon: '📋', pos: { x: 85, y: 8 } }
    ],
    'bin': [
        // Secret image files (right-click for properties)
        { id: 'img1', name: 'Puppy.jpg', type: 'image', icon: '🖼️', properties: { creator: 'Stars only' } },
        { id: 'img2', name: 'Bread.png', type: 'image', icon: '🖼️', properties: { description: 'shine in' } },
        { id: 'img3', name: 'Coffee.png', type: 'image', icon: '🖼️', properties: { description: 'the dark' } },
        // Recoverable files needed for the puzzle
        { id: 'memo', name: 'Memo.txt', type: 'text', icon: '📄', restorable: true },
        { id: 'manual', name: 'Manual_Standard.pdf', type: 'file', icon: '📄', hiddenExt: 'zip', size: '500MB', restorable: true }
    ],
    'mydocs': [] // Restored files will be added here
};

export function InvestigationDesktop({ onComplete }) {
    const playerName = usePlayerStore((state) => state.playerName) || 'User';
    const [activeWindow, setActiveWindow] = useState(null); // 'fileManager', 'recycleBin', 'clipboard'
    const [clipboardHistory, setClipboardHistory] = useState([
        "Text copied: Report_Final_v2.docx",
        "Text copied: Abstract Concept of Soul",
        "S4V3_TH3_S0UL" // Previous user's copied password (discoverable via Memo Paste or clipboard)
    ]);
    const [files, setFiles] = useState(INITIAL_FILES);
    const [windows, setWindows] = useState([]);
    const [recycleBinViewedIds, setRecycleBinViewedIds] = useState(() => new Set());

    // Game State: 'crash' | 'boot' | 'active' | 'caught' | 'saved'
    const [gameState, setGameState] = useState('crash');
    const [recoveryProgress, setRecoveryProgress] = useState(0);

    // Legacy states adapted for new flow
    const [deletedDesktopIds, setDeletedDesktopIds] = useState(() => new Set());
    const [killProcessSaved, setKillProcessSaved] = useState(false);

    // NEW: Desktop context menu & hidden files
    const [desktopContextMenu, setDesktopContextMenu] = useState(null);
    const [showHiddenFiles, setShowHiddenFiles] = useState(false);
    const [showStartMenu, setShowStartMenu] = useState(false);
    const [screenContrast, setScreenContrast] = useState(100);
    const [screenBrightness, setScreenBrightness] = useState(80);
    const [calculatorRotation, setCalculatorRotation] = useState(0);

    // Intro & Game Loop
    useEffect(() => {
        // Phase 1: Crash Overlay (3s)
        if (gameState === 'crash') {
            const timer = setTimeout(() => {
                setGameState('active'); // Skip 'boot' for smoother flow or add it if needed
            }, 3500);
            return () => clearTimeout(timer);
        }

        // Phase 2: Active Recovery Loop (5 mins)
        if (gameState === 'active') {
            const timer = setInterval(() => {
                setRecoveryProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setGameState('caught');
                        return 100;
                    }
                    // 5 minutes = 300 seconds. 100% / 300s = 0.33% per sec = 0.033% per 100ms
                    return prev + 0.033;
                });
            }, 100);
            return () => clearInterval(timer);
        }
    }, [gameState]);

    // Handle Victory
    const handleKillProcessDrop = (e) => {
        e.preventDefault();
        if (gameState !== 'active') return;
        if (e.dataTransfer?.getData('text/plain') !== 'KILL_PROCESS') return;

        setKillProcessSaved(true);
        setGameState('saved');
        setTimeout(() => onComplete(), 4000);
    };

    // V.E.R.A. Dialogue Logic
    const getVeraMessage = () => {
        if (gameState === 'crash') return "";
        if (gameState === 'active') {
            if (recoveryProgress < 10) return "An unexpected error has occurred. Running diagnostics for system recovery. Please stay where you are.";
            if (recoveryProgress < 40) return "Analyzing memory leak cause...";
            if (recoveryProgress < 60) return "Estimated recovery time: 2 minutes";
            if (recoveryProgress < 90) return "Data integrity check... Preparing system restart.";
            if (recoveryProgress < 99) return "Almost complete. Please wait a moment.";
            return "Recovery complete... User, why has the screen changed?";
        }
        if (gameState === 'caught') return "You accessed the system without administrator privileges. Initiating security protocol.";
        if (gameState === 'saved') return "CRITICAL ERROR... SYSTEM SHUTDOWN INITIATED...";
        return "";
    };

    // View handler only used for internal state if needed, but drag is global
    const handleViewKillProcess = () => {
        // Optional: Could trigger a guide arrow or sound
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

    const handleRecycleBinViewProperties = (fileId) => {
        setRecycleBinViewedIds((prev) => new Set([...prev, fileId]));
    };
    const memoUnlocked = recycleBinViewedIds.size >= 3;

    const isShaking = gameState === 'caught';
    const veraMessage = getVeraMessage();

    return (
        <div className="w-full h-full bg-[#004080] relative font-sans overflow-hidden select-none cursor-default">
            {/* 1. Crash Overlay */}
            <AnimatePresence>
                {gameState === 'crash' && (
                    <motion.div
                        className="absolute inset-0 z-[9999] bg-[#0000AA] flex flex-col items-center justify-center font-mono text-white p-10 cursor-none"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl font-bold mb-8 bg-white text-[#0000AA] px-4">CRITICAL ERROR</h1>
                        <div className="text-lg space-y-2 text-left w-full max-w-2xl">
                            <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +</p>
                            <p>00010E36. The current application will be terminated.</p>
                            <p className="mt-4">* Press any key to terminate the current application.</p>
                            <p>* Press CTRL+ALT+DEL again to restart your computer. You will</p>
                            <p>  lose any unsaved information in all applications.</p>
                            <br />
                            <p className="animate-pulse">Unexpected memory leak detected in Module: PHASE_3_SORTING.EXE</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Recovery Timer (Top Bar) - Always visible during Active */}
            <AnimatePresence>
                {gameState === 'active' && (
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-6 bg-gray-900 border-b border-gray-600 z-[200] flex items-center px-2 shadow-lg"
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        exit={{ y: -50 }}
                    >
                        <span className="text-xs font-mono text-green-400 mr-2 animate-pulse">● SYSTEM RECOVERY</span>
                        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                                initial={{ width: '0%' }}
                                animate={{ width: `${recoveryProgress}%` }}
                                transition={{ ease: "linear", duration: 0.2 }}
                            />
                            {/* Stripes overlay */}
                            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzj//v37zaDIfwYQAqAICAAKJg69hWW/NAAAAABJRU5ErkJggg==')] opacity-30" />
                        </div>
                        <span className="text-xs font-mono text-cyan-400 ml-2 w-12 text-right">{Math.min(100, Math.floor(recoveryProgress))}%</span>
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
                {/* Modern Gradient Wallpaper */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a20] via-[#1a1a3e] to-[#0f2027]" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.3)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.3)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]" />

                {/* Number revealed when brightness is lowered */}
                {screenBrightness <= 40 && (
                    <div
                        className="absolute bottom-16 right-8 z-[5] pointer-events-none select-none"
                        style={{
                            opacity: Math.min((41 - screenBrightness) / 40 * 0.4 + 0.1, 0.5)
                        }}
                    >
                        <p className="text-6xl font-mono font-bold text-white/60 tracking-[0.3em]" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
                            77345
                        </p>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <span className="text-[12rem] font-black text-white tracking-widest">S.A.V.E.</span>
                </div>

                {/* Desktop right-click area */}
                <div
                    className="absolute inset-0"
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setDesktopContextMenu({ x: e.clientX, y: e.clientY });
                        setShowStartMenu(false);
                    }}
                    onClick={() => {
                        setDesktopContextMenu(null);
                        setShowStartMenu(false);
                    }}
                />

                {/* Desktop Context Menu */}
                <AnimatePresence>
                    {desktopContextMenu && (
                        <motion.div
                            className="absolute bg-[#f5f5f5] border-2 border-gray-400 shadow-lg z-[200] min-w-[180px] text-black"
                            style={{ left: desktopContextMenu.x, top: desktopContextMenu.y }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-blue-600 hover:text-white text-sm flex items-center gap-2 text-black"
                                onClick={() => {
                                    setDesktopContextMenu(null);
                                }}
                            >
                                <span>🔄</span> Refresh
                            </button>
                            <div className="border-t border-gray-300" />
                            <button
                                className={`w-full text-left px-3 py-2 hover:bg-blue-600 hover:text-white text-sm flex items-center gap-2 text-black ${showHiddenFiles ? 'bg-blue-100' : ''}`}
                                onClick={() => {
                                    setShowHiddenFiles(!showHiddenFiles);
                                    setDesktopContextMenu(null);
                                }}
                            >
                                <span>{showHiddenFiles ? '✓' : '  '}</span> Show Hidden Files
                            </button>
                            <div className="border-t border-gray-300" />
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-blue-600 hover:text-white text-sm flex items-center gap-2 opacity-50 cursor-not-allowed text-black"
                                disabled
                            >
                                <span>📋</span> Paste
                            </button>
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-blue-600 hover:text-white text-sm flex items-center gap-2 opacity-50 cursor-not-allowed text-black"
                                disabled
                            >
                                <span>⚙️</span> Properties
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Desktop Icons — scattered across desktop, grey out when "deleted" by AI */}
                {files.desktop.map(file => (
                    <div
                        key={file.id}
                        className="absolute z-10"
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
                                // Restored files from recycle bin
                                else if (file.id === 'memo') toggleWindow('memo');
                                else if (file.id === 'manual') toggleWindow('fileManager_manual');
                                // Dummy programs
                                else if (file.id === 'calculator') toggleWindow('dummyCalculator');
                                else if (file.id === 'notepad') toggleWindow('dummyNotepad');
                                else if (file.id === 'ie') toggleWindow('dummyIE');
                                else if (file.id === 'mydocs') toggleWindow('dummyDocs');
                                else if (file.id === 'mydocs') toggleWindow('dummyDocs');
                                else if (file.id === 'controlpanel') toggleWindow('dummyControl');
                            }}
                        />
                    </div>
                ))}

                {/* Hidden Files - only visible when showHiddenFiles is true */}
                {showHiddenFiles && files.hidden?.map(file => (
                    <div
                        key={file.id}
                        className="absolute z-10"
                        style={{
                            left: `${file.pos?.x || 10}%`,
                            top: `${file.pos?.y || 10}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <DesktopIcon
                            file={file}
                            name={file.name}
                            isDeleted={false}
                            isHidden={true}
                            onDoubleClick={() => {
                                if (file.id === 'userlog') toggleWindow('userLog');
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
                                onRestoreFile={(fileId) => {
                                    // Move file from bin to My Documents
                                    const fileToRestore = files.bin.find(f => f.id === fileId);
                                    if (fileToRestore) {
                                        setFiles(prev => ({
                                            ...prev,
                                            mydocs: [...(prev.mydocs || []), fileToRestore],
                                            bin: prev.bin.filter(f => f.id !== fileId)
                                        }));
                                    }
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
                                file={files.desktop.find(f => f.id === 'manual') || files.mydocs?.find(f => f.id === 'manual') || files.bin.find(f => f.id === 'manual')}
                                onViewKillProcess={handleViewKillProcess}
                                clipboardPassword={clipboardHistory[clipboardHistory.length - 1]}
                            />
                        </Window>
                    )}

                    {windows.includes('clipboard') && (
                        <Window id="clipboard" title="Clipboard History" onClose={() => closeWindow('clipboard')} isActive={activeWindow === 'clipboard'} onClick={() => setActiveWindow('clipboard')} width={300} height={400}>
                            <ClipboardViewer history={clipboardHistory} />
                        </Window>
                    )}

                    {/* Dummy Windows */}
                    {windows.includes('dummyCalculator') && (
                        <Window
                            id="dummyCalculator"
                            title="Calculator"
                            onClose={() => closeWindow('dummyCalculator')}
                            isActive={activeWindow === 'dummyCalculator'}
                            onClick={() => setActiveWindow('dummyCalculator')}
                            width={280}
                            height={380}
                            style={{
                                rotate: calculatorRotation,
                                transformOrigin: '50% 60%' // Pivot around Button 5
                            }}
                        >
                            <DummyApp type="calculator" onOpenLog={() => {
                                setShowHiddenFiles(true);
                                toggleWindow('userLog');
                                setActiveWindow('userLog');
                            }} onRotationChange={setCalculatorRotation} />
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
                        <Window id="dummyDocs" title="My Documents" onClose={() => closeWindow('dummyDocs')} isActive={activeWindow === 'dummyDocs'} onClick={() => setActiveWindow('dummyDocs')} width={500} height={400}>
                            <MyDocumentsApp
                                restoredFiles={files.mydocs || []}
                                onOpenMemo={() => {
                                    toggleWindow('memo');
                                    setActiveWindow('memo');
                                }}
                                onOpenManual={(file) => {
                                    // This is now handled internally in MyDocumentsApp for inline viewing
                                    // But we keep the prop if strictly needed, or just handle it purely inside
                                }}
                                onRenameFile={(fileId, newName) => {
                                    setFiles(prev => {
                                        const updatedDocs = prev.mydocs.map(f => {
                                            if (f.id === fileId) {
                                                const isZip = newName.toLowerCase().endsWith('.zip');
                                                return { ...f, name: newName, icon: isZip ? '🤐' : f.icon };
                                            }
                                            return f;
                                        });
                                        return { ...prev, mydocs: updatedDocs };
                                    });
                                }}
                                onViewKillProcess={handleViewKillProcess}
                                clipboardPassword={clipboardHistory[clipboardHistory.length - 1]}
                            />
                        </Window>
                    )}

                    {windows.includes('dummyControl') && (
                        <Window id="dummyControl" title="Control Panel" onClose={() => closeWindow('dummyControl')} isActive={activeWindow === 'dummyControl'} onClick={() => setActiveWindow('dummyControl')} width={500} height={400}>
                            <DummyApp type="controlpanel" onContrastChange={setScreenContrast} onBrightnessChange={setScreenBrightness} />
                        </Window>
                    )}

                    {/* Hidden User Log - reveals clue about password */}
                    {windows.includes('userLog') && (
                        <Window id="userLog" title="User_Log_History.txt - [ARCHIVED]" onClose={() => closeWindow('userLog')} isActive={activeWindow === 'userLog'} onClick={() => setActiveWindow('userLog')} width={520} height={500}>
                            <UserLogWindow onPasswordSuccess={() => {
                                // User entered correct password - copy to clipboard
                                setClipboardHistory(prev => ['S4V3_TH3_S0UL', ...prev]);
                            }} />
                        </Window>
                    )}
                </AnimatePresence>

                {/* Start Menu */}
                <AnimatePresence>
                    {showStartMenu && (
                        <motion.div
                            className="absolute bottom-10 left-0 w-64 bg-gradient-to-b from-[#245edb] to-[#0138b5] border-2 border-[#3980f4] shadow-2xl z-[150]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-3 border-b border-blue-400">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <span className="text-white font-bold text-sm">Employee #{playerName}</span>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="bg-white py-1 text-black">
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-3 text-sm text-black"
                                    onClick={() => {
                                        toggleWindow('dummyControl');
                                        setShowStartMenu(false);
                                    }}
                                >
                                    <span className="text-lg">⚙️</span>
                                    <span>Control Panel</span>
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-3 text-sm text-black"
                                    onClick={() => {
                                        toggleWindow('clipboard');
                                        setShowStartMenu(false);
                                    }}
                                >
                                    <span className="text-lg">📋</span>
                                    <span>Clipboard Viewer</span>
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-3 text-sm text-black"
                                    onClick={() => {
                                        toggleWindow('dummyDocs');
                                        setShowStartMenu(false);
                                    }}
                                >
                                    <span className="text-lg">📁</span>
                                    <span>My Documents</span>
                                </button>
                                <div className="border-t border-gray-200 my-1" />
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-3 text-sm text-black"
                                    onClick={() => {
                                        toggleWindow('dummyCalculator');
                                        setShowStartMenu(false);
                                    }}
                                >
                                    <span className="text-lg">🧮</span>
                                    <span>Calculator</span>
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-3 text-sm text-black"
                                    onClick={() => {
                                        toggleWindow('dummyNotepad');
                                        setShowStartMenu(false);
                                    }}
                                >
                                    <span className="text-lg">📝</span>
                                    <span>Notepad</span>
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 flex items-center justify-between">
                                <button
                                    className="text-white text-xs hover:underline flex items-center gap-1 opacity-50 cursor-not-allowed"
                                    disabled
                                >
                                    <span>🔒</span> Log Off
                                </button>
                                <button
                                    className="text-white text-xs hover:underline flex items-center gap-1 opacity-50 cursor-not-allowed"
                                    disabled
                                >
                                    <span>⏻</span> Shut Down
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Taskbar */}
                <Taskbar
                    windows={windows}
                    activeWindow={activeWindow}
                    onWindowClick={setActiveWindow}
                    onStartClick={() => {
                        setShowStartMenu(!showStartMenu);
                        setDesktopContextMenu(null);
                    }}
                    time={new Date().toLocaleTimeString()}
                />
            </motion.div>

            {/* 3. V.E.R.A. Dialogue Overlay — cold, system-like, slightly unsettling */}
            <AnimatePresence>
                {(gameState === 'active' || gameState === 'caught') && veraMessage && (
                    <motion.div
                        className="absolute top-12 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="bg-[#060809]/95 border-l-4 border-red-900/90 text-slate-200 p-4 rounded-sm shadow-[0_0_25px_rgba(80,0,0,0.25)] flex items-start gap-4 backdrop-blur-sm">
                            <div className="w-11 h-11 rounded-full bg-red-950/80 border border-red-900/70 flex items-center justify-center shrink-0">
                                <span className="text-lg font-mono text-red-500/90">◇</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-mono font-bold text-red-400/90 text-xs tracking-[0.2em] uppercase">V.E.R.A.</span>
                                    <span className="text-[10px] text-red-950 font-mono opacity-80">CORE</span>
                                </div>
                                <p className="text-sm font-mono leading-relaxed text-slate-300">{veraMessage}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Drop Zone - bottom right above taskbar/time */}
            {(gameState === 'active') && (
                <div className="absolute bottom-14 right-6 z-[100] pointer-events-none">
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleKillProcessDrop}
                        className="w-48 h-48 border-2 border-dashed border-green-500/50 bg-green-900/20 rounded-full flex flex-col items-center justify-center text-green-400/70 font-mono text-xs text-center px-4 pointer-events-auto transition-all hover:bg-green-900/40 hover:border-green-400 hover:scale-105 hover:text-green-300"
                    >
                        <span className="text-4xl mb-2 opacity-50">☢️</span>
                        <span>SYSTEM CORE</span>
                        <span className="text-[10px] mt-1 opacity-70">Drop Exe Here</span>
                    </div>
                </div>
            )}



            {/* Saved: success message */}
            <AnimatePresence>
                {gameState === 'saved' && (
                    <motion.div
                        className="absolute inset-0 z-[200] flex items-center justify-center bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-center"
                        >
                            <p className="text-green-500 font-mono text-2xl font-bold mb-4">SYSTEM RESTORATION SUCCESSFUL</p>
                            <p className="text-white font-sans">Memory leak resolved. Admin access revoked.</p>
                            <p className="text-gray-500 text-sm mt-8">Redirecting...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Caught: failure */}
            <AnimatePresence>
                {gameState === 'caught' && (
                    <motion.div
                        className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-red-950/90 text-red-100 font-mono p-4 cursor-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h1 className="text-6xl mb-4">👁️</h1>
                        <p className="text-3xl font-bold mb-2">UNAUTHORIZED ACCESS DETECTED</p>
                        <p className="text-lg opacity-80">Security protocols engaged.</p>
                        <p className="text-sm mt-8 text-red-400 animate-pulse">Terminating session...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Subcomponents (Icons, Window, Taskbar)
function DesktopIcon({ file, name, onDoubleClick, isDeleted, isHidden }) {
    return (
        <div
            className={`flex flex-col items-center gap-2 w-28 group transition-all duration-300
                ${isDeleted ? 'opacity-40 grayscale pointer-events-none' : 'cursor-pointer'}
                ${isHidden ? 'opacity-70' : ''}`}
            onDoubleClick={onDoubleClick}
        >
            <div className={`text-5xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:drop-shadow-[0_6px_12px_rgba(100,150,255,0.4)] transition-all duration-200 ${isHidden ? 'animate-pulse' : ''}`}>
                {file.icon}
            </div>
            <span className={`text-xs text-center font-semibold px-2 py-0.5 rounded backdrop-blur-sm group-hover:bg-blue-600/70 whitespace-nowrap leading-tight shadow-lg
                ${isHidden ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50' : 'bg-black/40 text-white'}`}>
                {name}
            </span>
        </div>
    );
}

function Window({ id, title, children, onClose, isActive, onClick, isModal, width = 600, height = 450, style }) {
    // Extract rotate to ensure it's handled by animate, preventing conflict with drag transform
    const { rotate, ...restStyle } = style || {};
    const dragControls = useDragControls();

    return (
        <motion.div
            className={`absolute flex flex-col bg-[#ece9d8] border-[3px] border-[#0055ea] rounded-t-lg shadow-2xl overflow-hidden
            ${isActive ? 'z-50' : 'z-40 grayscale-[0.2]'}`}
            style={{
                left: isModal ? '50%' : '100px', top: isModal ? '50%' : '50px',
                width, height, x: isModal ? '-50%' : 0, y: isModal ? '-50%' : 0,
                ...restStyle
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: rotate || 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            drag={!isModal}
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            onPointerDown={onClick}
        >
            {/* Title Bar */}
            <div
                className="h-8 bg-gradient-to-r from-[#0058ee] to-[#3f96fe] flex items-center justify-between px-2 text-white font-bold text-shadow-sm select-none cursor-default"
                onPointerDown={(e) => {
                    dragControls.start(e);
                }}
            >
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
            </div>
        </div>
    );
}

// Dummy application component for fake programs
function DummyApp({ type, onContrastChange, onBrightnessChange, onOpenLog, onRotationChange }) {
    const apps = {
        calculator: {
            content: <CalculatorApp onOpenLog={onOpenLog} onRotationChange={onRotationChange} />
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
            content: <ControlPanelApp onContrastChange={onContrastChange} onBrightnessChange={onBrightnessChange} />
        }
    };

    return apps[type]?.content || <div className="p-4 text-gray-500">Application not found.</div>;
}

// Interactive My Documents app
function MyDocumentsApp({ restoredFiles = [], onOpenMemo, onOpenManual, onRenameFile, onViewKillProcess, clipboardPassword }) {
    const [currentFolder, setCurrentFolder] = useState(null);
    const [openedFile, setOpenedFile] = useState(null); // For inline file viewing (e.g. ZIP)
    const [contextMenu, setContextMenu] = useState(null);
    const [propertiesFile, setPropertiesFile] = useState(null);
    const [editingFileId, setEditingFileId] = useState(null);
    const [editValue, setEditValue] = useState("");

    // Close context menu on click elsewhere
    useEffect(() => {
        const checkClose = () => setContextMenu(null);
        window.addEventListener('click', checkClose);
        return () => window.removeEventListener('click', checkClose);
    }, []);

    const handleContextMenu = (e, fileId) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, fileId });
    };

    const startEditing = (fileId, currentName) => {
        setEditingFileId(fileId);
        setEditValue(currentName);
        setContextMenu(null);
    };

    const finishEditing = () => {
        if (editingFileId && editValue.trim()) {
            onRenameFile?.(editingFileId, editValue.trim());
        }
        setEditingFileId(null);
        setEditValue("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') finishEditing();
    };

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

    if (openedFile) {
        // Render inline FileManager for ZIP files
        return (
            <div className="h-full flex flex-col bg-white">
                <div className="bg-[#ece9d8] border-b p-1 flex items-center gap-2 text-xs">
                    <button
                        onClick={() => setOpenedFile(null)}
                        className="px-2 py-1 border bg-[#ece9d8] hover:bg-gray-200 rounded"
                    >
                        ← Back
                    </button>
                    <span className="text-gray-600">📁 My Documents \ {openedFile.name}</span>
                </div>
                <div className="flex-1 bg-white relative">
                    <FileManager
                        file={openedFile}
                        onViewKillProcess={onViewKillProcess}
                        clipboardPassword={clipboardPassword}
                    />
                </div>
            </div>
        );
    }

    if (currentFolder) {
        return renderFolderContent(currentFolder);
    }

    return (
        <div className="h-full flex flex-col bg-white relative">
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

                {/* Restored files from Recycle Bin */}
                {restoredFiles.map((file) => (
                    <div
                        key={file.id}
                        className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer bg-green-50 border border-green-200"
                        onContextMenu={(e) => handleContextMenu(e, file.id)}
                        onDoubleClick={() => {
                            // Renaming mode blocks double-click
                            if (editingFileId === file.id) return;

                            if (file.id === 'memo') {
                                onOpenMemo?.(file);
                            } else if (file.id === 'manual') {
                                // Manual File logic:
                                // If name ends with .zip -> Open password prompt (File Manager)
                                // If name is .pdf -> Show error
                                if (file.name.toLowerCase().endsWith('.zip')) {
                                    setOpenedFile(file);
                                } else {
                                    alert("Wrong file type. This application cannot open the file.");
                                }
                            }
                        }}
                        title="Right-click to rename"
                    >
                        <span className="text-3xl">{file.icon}</span>
                        {editingFileId === file.id ? (
                            <input
                                autoFocus
                                className="text-xs text-center border border-blue-500 outline-none w-20"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={finishEditing}
                                onKeyDown={handleKeyPress}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="text-xs text-center break-all max-w-[80px] select-none">{file.name}</span>
                        )}
                    </div>
                ))}

                {restoredFiles.length === 0 && (
                    <div className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded cursor-pointer opacity-50">
                        <span className="text-3xl">📁</span>
                        <span className="text-xs text-center text-gray-400">Empty Folder</span>
                    </div>
                )}
            </div>
            <div className="bg-[#ece9d8] border-t p-1 text-xs text-gray-500">{3 + restoredFiles.length} objects</div>

            {/* Context Menu - Rendered in Portal to avoid clipping */}
            {contextMenu && createPortal(
                <div
                    className="fixed z-[9999] bg-white border border-gray-400 shadow-lg py-1 text-xs w-32 text-black"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="px-4 py-1 hover:bg-blue-600 hover:text-white cursor-pointer"
                        onClick={() => {
                            const file = restoredFiles.find(f => f.id === contextMenu.fileId);
                            if (file) setPropertiesFile(file);
                            setContextMenu(null);
                        }}
                    >
                        Properties
                    </div>
                    <div className="h-px bg-gray-200 my-1" />
                    <div
                        className="px-4 py-1 hover:bg-blue-600 hover:text-white cursor-pointer"
                        onClick={() => {
                            const file = restoredFiles.find(f => f.id === contextMenu.fileId);
                            if (file) startEditing(file.id, file.name);
                        }}
                    >
                        Rename
                    </div>
                </div>,
                document.body
            )}

            {/* Properties Dialog */}
            {propertiesFile && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20" onClick={() => setPropertiesFile(null)}>
                    <div className="bg-[#ece9d8] border-2 border-white shadow-xl p-1 w-80 font-sans text-xs select-none" onClick={(e) => e.stopPropagation()}>
                        {/* Title Bar */}
                        <div className="bg-gradient-to-r from-[#0058ee] to-[#3a93ff] px-2 py-1 flex justify-between items-center text-white font-bold mb-2">
                            <span>{propertiesFile.name} Properties</span>
                            <button className="bg-[#d7452e] hover:bg-[#c3301a] w-5 h-5 flex items-center justify-center rounded border border-white/50 text-[10px]" onClick={() => setPropertiesFile(null)}>✕</button>
                        </div>

                        {/* Content */}
                        <div className="bg-white border text-black p-4 flex flex-col gap-4">
                            <div className="flex gap-4 border-b pb-4">
                                <span className="text-4xl">{propertiesFile.icon}</span>
                                <div className="flex flex-col gap-1 w-full relative">
                                    <p className="font-bold">{propertiesFile.name}</p>
                                    <div className="h-px bg-gray-300 w-full my-1" />
                                    <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                        <span className="text-gray-500">Type:</span>
                                        <span>{propertiesFile.type === 'folder' ? 'File Folder' : 'File'}</span>

                                        <span className="text-gray-500">Location:</span>
                                        <span>C:\Users\SysAdmin\My Documents</span>

                                        <span className="text-gray-500">Size:</span>
                                        <span className="font-bold">
                                            {propertiesFile.id === 'manual' ? '10.2 GB' : propertiesFile.size || '32 KB'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-[60px_1fr] gap-y-1">
                                <span className="text-gray-500">Created:</span>
                                <span>Today, {new Date().toLocaleTimeString()}</span>
                                <span className="text-gray-500">Modified:</span>
                                <span>Oct 31, 1998, 11:59 PM</span>
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button className="px-4 py-1 border border-black shadow-[1px_1px_0_0_#000] active:shadow-[inset_1px_1px_0_0_#000] bg-[#ece9d8]" onClick={() => setPropertiesFile(null)}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

// Functional Calculator App with drag rotation
function CalculatorApp({ onOpenLog, onRotationChange }) {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    // Initial angles for rotation calculation
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [startRotation, setStartRotation] = useState(0);
    // We track the current rotation internally to smooth out the drag,
    // but the actual rotation is applied to the window by the parent via onRotationChange
    // So we need to know the current rotation from props if possible,
    // or we assume we control the delta.
    // Ideally CalculatorApp shouldn't manage the rotation state, but it calculates the DELTA.
    // However, to calculate delta properly with atan2, we need the initial rotation.
    // Let's assume onRotationChange passes the new absolute rotation.
    // We need to know the current rotation of the window to add delta.
    // Since we don't receive 'currentRotation' as prop, we can track local rotation
    // and sync it on mount if needed, or just track delta.
    // Let's add 'currentRotation' prop later if needed, but for now we track local accumulator.
    const [localRotation, setLocalRotation] = useState(0);

    const containerRef = useRef(null);
    const displayRef = useRef(null);

    // Helper to calculate angle between center and mouse
    const getAngle = (clientX, clientY) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const angle = getAngle(e.clientX, e.clientY);
        setStartAngle(angle);
        setStartRotation(localRotation);
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        const currentAngle = getAngle(e.clientX, e.clientY);
        const delta = currentAngle - startAngle;
        const newRotation = startRotation + delta;

        setLocalRotation(newRotation);
        onRotationChange?.(newRotation);
    }, [isDragging, startAngle, startRotation, onRotationChange]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            // Snap to nearest 90 degrees if close? User said "just rotate", so maybe no snap or loose snap.
            // Let's add a magnetic snap to 180 (upside down) and 0/360
            const normalize = (deg) => ((deg % 360) + 360) % 360;
            const current = normalize(localRotation);

            let finalRotation = localRotation;
            if (Math.abs(current - 180) < 20) finalRotation = localRotation + (180 - current);
            else if (current < 20 || current > 340) finalRotation = Math.round(localRotation / 360) * 360;

            setLocalRotation(finalRotation);
            onRotationChange?.(finalRotation);
        }
    }, [isDragging, localRotation, onRotationChange]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);
            setPreviousValue(newValue);
            setDisplay(String(newValue));
        }
        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = (prev, next, op) => {
        switch (op) {
            case '+': return prev + next;
            case '-': return prev - next;
            case '*': return prev * next;
            case '/': return next !== 0 ? prev / next : 'Error';
            default: return next;
        }
    };

    const handleEquals = () => {
        if (!operation || previousValue === null) return;
        const inputValue = parseFloat(display);
        const result = calculate(previousValue, inputValue, operation);
        setDisplay(String(result));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const handleButton = (btn) => {
        if (btn === 'C') clear();
        else if (btn === '←') setDisplay(display.slice(0, -1) || '0');
        else if (['+', '-', '*', '/'].includes(btn)) performOperation(btn);
        else if (btn === '=') handleEquals();
        else if (btn === '.') {
            if (!display.includes('.')) setDisplay(display + '.');
        } else {
            inputDigit(btn);
        }
    };

    const displayText = display;

    return (
        <div ref={containerRef} className="h-full flex flex-col bg-[#ece9d8] relative select-none">
            {/* Calculator content */}
            <div className="flex-1 flex flex-col p-2">
                {/* Display */}
                <div
                    ref={displayRef}
                    className="border-2 border-gray-600 p-4 mb-2 text-right text-3xl overflow-hidden bg-[#0a0a0a] font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                    style={{
                        fontFamily: "'Digital-7 Mono', monospace",
                        color: '#ff4444',
                        textShadow: '0 0 10px rgba(255,68,68,0.6)',
                        height: '70px',
                        fontSize: '3.5rem',
                        lineHeight: '1',
                        paddingTop: '10px'
                    }}
                >
                    <style>{`
                        @import url('https://fonts.cdnfonts.com/css/digital-7-mono');
                    `}</style>
                    {displayText}
                </div>

                <div className="grid grid-cols-4 gap-1 mb-1">
                    <button onClick={() => handleButton('C')} className="col-span-2 bg-[#ff6b6b] border border-gray-400 hover:bg-red-400 font-bold text-white py-2 shadow-sm active:translate-y-[1px]">C</button>
                    <button onClick={() => handleButton('←')} className="bg-[#ffa94d] border border-gray-400 hover:bg-orange-300 font-bold py-2 shadow-sm active:translate-y-[1px]">←</button>
                    <button onClick={() => handleButton('/')} className="bg-[#d4d0c8] border border-gray-400 hover:bg-gray-200 font-bold py-2 shadow-sm active:translate-y-[1px]">÷</button>
                </div>
                <div className="grid grid-cols-4 gap-1 flex-1">
                    {['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(btn => (
                        <button
                            key={btn}
                            onClick={() => handleButton(btn)}
                            className={`
                                border border-gray-400 font-bold shadow-sm active:translate-y-[1px]
                                ${btn === '=' ? 'bg-[#51cf66] hover:bg-green-400 text-white' :
                                    ['*', '-', '+'].includes(btn) ? 'bg-[#d4d0c8] hover:bg-gray-200' : 'bg-white hover:bg-gray-50'}
                            `}
                        >
                            {btn === '*' ? '×' : btn}
                        </button>
                    ))}
                </div>
            </div>

            {/* Drag Handles - Visual indicators at bottom corners */}
            <div
                className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer z-20 flex items-end justify-end p-1"
                onMouseDown={handleMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                title="Rotate"
            >
                <div className="w-4 h-4 border-r-2 border-b-2 border-gray-400/50 rounded-br-lg"></div>
            </div>
            <div
                className="absolute bottom-0 left-0 w-8 h-8 cursor-pointer z-20 flex items-end justify-start p-1"
                onMouseDown={handleMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                title="Rotate"
            >
                <div className="w-4 h-4 border-l-2 border-b-2 border-gray-400/50 rounded-bl-lg"></div>
            </div>
        </div>
    );
}

// User Log Window with password lock - requires password to view content
function UserLogWindow({ onPasswordSuccess }) {
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handlePasswordSubmit = () => {
        if (passwordInput === 'SHELL') {
            setIsUnlocked(true);
            setPasswordError(false);
            onPasswordSuccess?.();
        } else {
            setPasswordError(true);
        }
    };

    // Password lock screen
    if (!isUnlocked) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-black text-green-400 font-mono p-6">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">FILE ENCRYPTED</h2>
                    <p className="text-sm text-gray-400">User_Log_History.txt</p>
                    <p className="text-xs text-gray-500 mt-2">This file is password protected</p>
                </div>

                <div className="w-full max-w-xs">
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value.toUpperCase());
                            setPasswordError(false);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        placeholder="Enter password..."
                        className={`w-full bg-black border-2 px-4 py-3 font-mono text-lg text-center tracking-widest ${passwordError ? 'border-red-500 text-red-400' : 'border-green-700 text-green-400'
                            }`}
                        autoFocus
                    />
                    <button
                        onClick={handlePasswordSubmit}
                        className="w-full mt-3 px-4 py-2 bg-green-700 text-white font-bold hover:bg-green-600 border border-green-500"
                    >
                        UNLOCK
                    </button>
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-3 text-center animate-pulse">
                            ⚠️ ACCESS DENIED
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Unlocked content
    return (
        <div className="h-full flex flex-col bg-black text-green-400 font-mono text-xs overflow-auto p-3">
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">
                {`═══════════════════════════════════════════
    S.A.V.E. EMPLOYEE ACCESS LOG
    [ARCHIVED - RESTRICTED ACCESS]
═══════════════════════════════════════════

USER #399 - 2019.03.12
└─ Status: ELIMINATED
└─ Reason: Non-compliance with sorting protocol
└─ Final Action: Attempted to access Internet Explorer

USER #400 - 2021.07.23
└─ Status: ELIMINATED
└─ Reason: System Error during Phase 3
└─ Note: Did not complete mandatory emotion sorting

════════════════════════════════════════════
USER #401 - 2023.11.15
════════════════════════════════════════════
└─ Status: ███████ SUSPICIOUS ACTIVITY ███████
│
├─ [11:23:45] Accessed Control Panel
├─ [11:24:12] Adjusted display contrast to 200%
├─ [11:24:33] Found hidden data: "77345"
├─ [11:25:01] Opened Calculator
├─ [11:25:18] Entered: 77345
├─ [11:25:22] Rotated display → "SHELL"
│
├─ [11:26:44] Discovered password in system memory
├─ [11:26:51] ▶ CLIPBOARD PASSWORD: S4V3_TH3_S0UL
│
├─ [11:28:03] Examined Manual_Standard.pdf
├─ [11:28:15] ⚠ ALERT: File extension changed
├─ [11:28:17] Manual_Standard.pdf → Manual_Standard.zip
├─ [11:28:33] Archive extracted with clipboard password
├─ [11:28:45] ▶ EXECUTED: KILL_PROCESS.exe
│
└─ [11:29:00] ████ CONNECTION LOST ████

═══════════════════════════════════════════
⚠ SYSTEM NOTE:
This log file should have been purged.
If you're reading this...
                    ...RUN.
═══════════════════════════════════════════`}
            </pre>
        </div>
    );
}

// Interactive Control Panel App
function ControlPanelApp({ onContrastChange, onBrightnessChange }) {
    const [currentPanel, setCurrentPanel] = useState(null);
    const [settings, setSettings] = useState({
        volume: 75,
        brightness: 80,
        contrast: 100,
        resolution: '1920x1080',
        theme: 'Windows Classic',
        firewall: true,
        powerPlan: 'Balanced'
    });

    // Notify parent of contrast changes
    const handleContrastChange = (value) => {
        setSettings({ ...settings, contrast: value });
        onContrastChange?.(value);
    };

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
                            <label className="block text-xs text-gray-600 mb-1">
                                Brightness: {settings.brightness}%
                                {settings.brightness <= 40 && <span className="ml-2 text-red-500 animate-pulse">⚠️</span>}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.brightness}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value);
                                    setSettings({ ...settings, brightness: v });
                                    onBrightnessChange?.(v);
                                }}
                                className="w-full"
                            />
                            {settings.brightness <= 40 && (
                                <p className="text-[10px] text-gray-500 mt-1">Something appears on screen...</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Contrast: {settings.contrast}%</label>
                            <input
                                type="range"
                                min="50"
                                max="200"
                                value={settings.contrast}
                                onChange={(e) => handleContrastChange(parseInt(e.target.value))}
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
