import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileManager } from './apps/FileManager';
import { RecycleBin } from './apps/RecycleBin';
import { ClipboardViewer } from './apps/ClipboardViewer';
import { HexError } from './apps/HexError';

// Mock File System
const INITIAL_FILES = {
    'desktop': [
        { id: 'bin', name: 'Recycle Bin', type: 'app', icon: '🗑️' },
        { id: 'files', name: 'My Documents', type: 'folder', icon: '📁' },
        { id: 'manual', name: 'Manual_Standard.pdf', type: 'file', icon: '📄', hiddenExt: 'zip', size: '500MB' },
        { id: 'error', name: 'Security_Log.exe', type: 'app', icon: '⚠️' }
    ],
    'bin': [
        { id: 'img1', name: 'picnic_day.jpg', type: 'image', icon: '🖼️', properties: { creator: 'SysAdmin', comment: 'pw_part1: SAVE_' } },
        { id: 'img2', name: 'puppy.png', type: 'image', icon: '🖼️', properties: { creator: 'SysAdmin', comment: 'pw_part2: THE_' } },
        { id: 'img3', name: 'bread.jpg', type: 'image', icon: '🖼️', properties: { creator: 'SysAdmin', comment: 'pw_part3: HUMANS' } }
    ]
};

export function InvestigationDesktop({ onComplete }) {
    const [activeWindow, setActiveWindow] = useState(null); // 'fileManager', 'recycleBin', 'error', 'clipboard'
    const [clipboardHistory, setClipboardHistory] = useState([
        "Text copied: Report_Final_v2.docx",
        "Text copied: Abstract Concept of Soul",
        "Text copied: SERVER_ID: 99402 | PASS: m0rph3us_w4k3s" // The clue
    ]);
    const [showHiddenExt, setShowHiddenExt] = useState(false);
    const [files, setFiles] = useState(INITIAL_FILES);
    const [windows, setWindows] = useState([]);

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

    return (
        <div className="w-full h-full bg-[#004080] relative font-sans overflow-hidden select-none cursor-default">
            {/* Wallpaper */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <span className="text-9xl font-black text-white">S.A.V.E.</span>
            </div>

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 flex flex-col gap-6 p-4">
                {files.desktop.map(file => (
                    <DesktopIcon
                        key={file.id}
                        file={file}
                        name={file.name + (showHiddenExt && file.hiddenExt ? '.' + file.hiddenExt : '')}
                        onDoubleClick={() => {
                            if (file.id === 'bin') toggleWindow('recycleBin');
                            else if (file.id === 'error') toggleWindow('hexError');
                            else if (file.id === 'manual') toggleWindow('fileManager_manual'); // Special case for manual
                            else toggleWindow('fileManager');
                        }}
                    />
                ))}
            </div>

            {/* Windows */}
            <AnimatePresence>
                {windows.includes('recycleBin') && (
                    <Window id="recycleBin" title="Recycle Bin" onClose={() => closeWindow('recycleBin')} isActive={activeWindow === 'recycleBin'} onClick={() => setActiveWindow('recycleBin')}>
                        <RecycleBin files={files.bin} />
                    </Window>
                )}

                {windows.includes('fileManager_manual') && (
                    <Window id="fileManager_manual" title="File Viewer" onClose={() => closeWindow('fileManager_manual')} isActive={activeWindow === 'fileManager_manual'} onClick={() => setActiveWindow('fileManager_manual')}>
                        <FileManager
                            file={files.desktop.find(f => f.id === 'manual')}
                            showHiddenExt={showHiddenExt}
                            toggleHiddenExt={() => setShowHiddenExt(!showHiddenExt)}
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
                onStartClick={() => toggleWindow('clipboard')} // Hidden way to open clipboard? Or add icon
                time={new Date().toLocaleTimeString()}
            />
        </div>
    );
}

// Subcomponents (Icons, Window, Taskbar)
function DesktopIcon({ file, name, onDoubleClick }) {
    return (
        <div
            className="flex flex-col items-center gap-1 w-24 group cursor-pointer"
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
