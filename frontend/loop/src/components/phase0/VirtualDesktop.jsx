import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmailApp } from './apps/EmailApp';
import { BrowserApp } from './apps/BrowserApp';
import { InstallerApp } from './apps/InstallerApp';
import { useAudioStore } from '../../stores/audioStore';

export function VirtualDesktop({ onComplete }) {
    const [wallpaper, setWallpaper] = useState('default'); // 'default' | 'save'
    const [openWindows, setOpenWindows] = useState([]); // Array of app IDs
    const [activeWindow, setActiveWindow] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const playSFX = useAudioStore(state => state.playSFX);

    useEffect(() => {
        // Trigger email notification shortly after boot
        const timer = setTimeout(() => {
            if (openWindows.length === 0) { // Only show if user hasn't opened anything yet
                setShowNotification(true);
                playSFX('success');
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [openWindows, playSFX]);

    const toggleWindow = (appId) => {
        if (openWindows.includes(appId)) {
            if (activeWindow === appId) {
                setActiveWindow(appId);
            } else {
                setActiveWindow(appId);
            }
        } else {
            setOpenWindows([...openWindows, appId]);
            setActiveWindow(appId);
        }
    };

    const closeWindow = (appId) => {
        setOpenWindows(openWindows.filter(id => id !== appId));
        if (activeWindow === appId) setActiveWindow(null);
    };

    const handleNotificationClick = () => {
        setShowNotification(false);
        toggleWindow('email');
    };

    return (
        <div className="w-full h-full relative overflow-hidden font-sans select-none">
            {/* Wallpaper */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{
                    backgroundImage: wallpaper === 'default'
                        ? 'url("https://images.unsplash.com/photo-1496247749665-49cf5bf8756c?q=80&w=2075&auto=format&fit=crop")'  // Generic blissful nature
                        : 'none', // Will be replaced by S.A.V.E branded color/logo
                    backgroundColor: wallpaper === 'save' ? '#0a0a0f' : 'transparent'
                }}
            >
                {wallpaper === 'save' && (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <h1 className="text-9xl font-black tracking-tighter text-neogen-accent">S.A.V.E.</h1>
                    </div>
                )}
            </motion.div>

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 flex flex-col gap-6">
                <DesktopIcon icon="📧" label="Mail" onClick={() => toggleWindow('email')} />
                <DesktopIcon icon="🌐" label="Browser" onClick={() => toggleWindow('browser')} />

                {/* loop.exe appears after installation */}
                <AnimatePresence>
                    {wallpaper === 'save' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <DesktopIcon
                                icon="💀"
                                label="loop.exe"
                                className="text-red-500"
                                onClick={onComplete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Windows */}
            <AnimatePresence>
                {openWindows.includes('email') && (
                    <Window
                        id="email"
                        title="Inbox - Mail"
                        isActive={activeWindow === 'email'}
                        onClose={() => closeWindow('email')}
                        onFocus={() => setActiveWindow('email')}
                        width={900}
                        height={650}
                    >
                        <EmailApp onOpenLink={() => toggleWindow('browser')} />
                    </Window>
                )}

                {openWindows.includes('browser') && (
                    <Window
                        id="browser"
                        title="Browser - S.A.V.E. Portal"
                        isActive={activeWindow === 'browser'}
                        onClose={() => closeWindow('browser')}
                        onFocus={() => setActiveWindow('browser')}
                        width={900}
                        height={700}
                    >
                        <BrowserApp onDownload={() => toggleWindow('installer')} />
                    </Window>
                )}

                {openWindows.includes('installer') && (
                    <Window
                        id="installer"
                        title="S.A.V.E. Workspace Setup"
                        isActive={activeWindow === 'installer'}
                        onClose={() => { }} // Cannot close installer
                        onFocus={() => setActiveWindow('installer')}
                        width={400}
                        height={300}
                        isModal
                    >
                        <InstallerApp onComplete={() => {
                            closeWindow('installer');
                            setWallpaper('save');
                        }} />
                    </Window>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="absolute bottom-16 right-4 w-72 bg-[#2d3748] border-l-4 border-blue-500 shadow-xl rounded overflow-hidden cursor-pointer z-[100]"
                        onClick={handleNotificationClick}
                    >
                        <div className="p-4 flex gap-3">
                            <div className="text-2xl">📧</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm mb-1">New Message Received</h4>
                                <p className="text-gray-300 text-xs truncate">From: S.A.V.E. Recruiting</p>
                                <p className="text-gray-400 text-xs mt-1">Final Offer: Data Verification...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Taskbar */}
            <div className="absolute bottom-0 w-full h-12 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 gap-2 shadow-md z-50">
                <div
                    className="h-8 px-4 bg-gradient-to-r from-green-600 to-green-700 flex items-center gap-2 border-2 border-gray-400 rounded-sm shadow text-white font-bold cursor-pointer hover:brightness-110 active:translate-y-px"
                >
                    <span className="italic font-serif">Start</span>
                </div>

                <div className="w-[2px] h-8 bg-gray-400 mx-2" />

                {/* Taskbar Items */}
                {openWindows.map(id => (
                    <div
                        key={id}
                        className={`h-8 px-4 min-w-[120px] flex items-center gap-2 border-2 text-xs font-bold cursor-pointer
                        ${activeWindow === id ? 'bg-white border-gray-600 border-inset' : 'bg-[#d4d0c8] border-white shadow-sm'}`}
                        onClick={() => setActiveWindow(id)}
                    >
                        {id === 'email' && '📧 Inbox'}
                        {id === 'browser' && '🌐 Portal'}
                        {id === 'installer' && '⚙️ Setup'}
                    </div>
                ))}

                <div className="ml-auto px-4 py-1 border-2 border-gray-400 border-inset bg-[#d4d0c8] text-xs">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}

function DesktopIcon({ icon, label, onClick, className = "" }) {
    return (
        <div
            className={`flex flex-col items-center gap-1 w-20 cursor-pointer group ${className}`}
            onClick={onClick}
        >
            <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-white text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium px-1 rounded group-hover:bg-[#000080]/50">
                {label}
            </span>
        </div>
    );
}

function Window({ id, title, children, isActive, onClose, onFocus, width = 600, height = 400, isModal = false }) {
    const [size, setSize] = useState({ width, height });
    const isResizing = React.useRef(false);

    useEffect(() => {
        const handlePointerUp = () => {
            isResizing.current = false;
            document.body.style.cursor = 'default';
        };

        const handlePointerMove = (e) => {
            if (!isResizing.current) return;

            // This is a simplified resize logic. 
            // In a real app with framer-motion drag, we'd need to account for position.
            // But since 'drag' affects transform, we might fight with it.
            // For now, let's assume simple resizing works if we don't move the window while resizing.
            // Or better: resizing should only add to width/height.

            setSize(prev => ({
                width: Math.max(300, prev.width + e.movementX),
                height: Math.max(200, prev.height + e.movementY)
            }));
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    const handleResizeStart = (e) => {
        e.stopPropagation(); // Prevent drag
        isResizing.current = true;
        document.body.style.cursor = 'nwse-resize';
    };

    return (
        <motion.div
            className={`absolute bg-[#d4d0c8] border-2 border-white shadow-[2px_2px_10px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden
            ${isActive ? 'z-40' : 'z-30'}`}
            style={{
                left: isModal ? '50%' : '100px',
                top: isModal ? '50%' : '50px',
                width: size.width,
                height: size.height,
                x: isModal ? '-50%' : 0,
                y: isModal ? '-50%' : 0
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            drag={!isModal}
            dragMomentum={false}
            dragListener={!isResizing.current} // Disable drag when resizing
            onPointerDown={onFocus}
        >
            {/* Title Bar */}
            <div
                className={`h-8 px-2 flex items-center justify-between select-none flex-shrink-0
                ${isActive ? 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white' : 'bg-[#808080] text-[#c0c0c0]'}`}
            >
                <span className="font-bold text-sm tracking-wide flex items-center gap-2">
                    {title}
                </span>
                {!isModal && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="w-5 h-5 bg-[#d4d0c8] text-black font-bold leading-none flex items-center justify-center border border-white active:border-gray-600 shadow-sm hover:bg-red-500 hover:text-white"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative bg-white border-2 border-l-gray-600 border-t-gray-600 border-r-white border-b-white m-1">
                {children}
            </div>

            {/* Resize Handle */}
            {!isModal && (
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
                    onPointerDown={handleResizeStart}
                >
                    {/* Visual grip stripes */}
                    <div className="w-full h-full border-r-[2px] border-b-[2px] border-gray-500" />
                </div>
            )}
        </motion.div>
    );
}
