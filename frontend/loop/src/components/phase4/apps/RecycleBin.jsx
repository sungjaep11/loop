import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample placeholder images for each file
const FILE_IMAGES = {
    'img1': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop', // Puppy
    'img2': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', // Bread
    'img3': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', // Coffee
};

export function RecycleBin({ files, onViewProperties, onRestoreFile }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showProps, setShowProps] = useState(null); // fileId for properties dialog (right-click)
    const [showImage, setShowImage] = useState(null); // fileId for image viewer (left-click/double-click)
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(null); // fileId for restore confirmation

    // Right-click: show properties with secret info
    const openProperties = (fileId) => {
        setShowProps(fileId);
        onViewProperties?.(fileId);
    };

    // Left-click (double-click): open file based on type
    const handleFileOpen = (file) => {
        if (file.type === 'image') {
            // Image files: open in image viewer
            setShowImage(file.id);
        } else if (file.restorable) {
            // Restorable files: show restore confirmation
            setShowRestoreConfirm(file.id);
        }
    };

    const handleRestore = (fileId) => {
        onRestoreFile?.(fileId);
        setShowRestoreConfirm(null);
    };

    if (!files || !Array.isArray(files)) return <div className="p-4 text-red-500">Error: No files data</div>;

    return (
        <div className="h-full w-full bg-white flex flex-col font-sans text-xs">
            {/* Toolbar */}
            <div className="bg-[#ece9d8] border-b p-2 flex gap-2 text-black">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span className="text-gray-400">Tools</span>
            </div>
            {/* File Grid */}
            <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start relative" onClick={() => setSelectedFile(null)}>
                {files.map(file => (
                    <div
                        key={file.id}
                        className={`group flex flex-col items-center gap-1 p-2 border border-transparent rounded cursor-pointer relative
                        ${selectedFile === file.id ? 'bg-[#316ac5] text-white' : 'hover:bg-gray-100 text-black'}`}
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(file.id); }}
                        onDoubleClick={() => handleFileOpen(file)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            openProperties(file.id);
                        }}
                    >
                        <span className="text-3xl opacity-50 grayscale">{file.icon}</span>
                        <span className="text-center break-all">{file.name}</span>
                        {file.restorable && (
                            <span className="absolute top-1 right-1 text-[10px] text-blue-500">↺</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Image Viewer Modal (opens on double-click for images) */}
            <AnimatePresence>
                {showImage && (
                    <ImageViewer
                        file={files.find(f => f.id === showImage)}
                        imageUrl={FILE_IMAGES[showImage]}
                        onClose={() => setShowImage(null)}
                    />
                )}
            </AnimatePresence>

            {/* Properties Modal (opens on right-click) */}
            <AnimatePresence>
                {showProps && (
                    <PropertiesDialog
                        file={files.find(f => f.id === showProps)}
                        onClose={() => setShowProps(null)}
                    />
                )}
            </AnimatePresence>

            {/* Restore Confirmation Dialog */}
            <AnimatePresence>
                {showRestoreConfirm && (
                    <motion.div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-lg shadow-2xl w-80"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-7 bg-gradient-to-r from-[#0058ee] to-[#3f96fe] flex items-center px-2 text-white font-bold text-sm rounded-t">
                                Restore File
                            </div>
                            <div className="p-4 text-black">
                                <div className="flex items-start gap-3 mb-4">
                                    <span className="text-3xl">♻️</span>
                                    <div>
                                        <p className="font-bold mb-1">Restore this file to desktop?</p>
                                        <p className="text-xs text-gray-600">
                                            "{files.find(f => f.id === showRestoreConfirm)?.name}" will be moved to the desktop.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleRestore(showRestoreConfirm)}
                                        className="px-4 py-1 bg-[#d4d0c8] border border-gray-400 hover:bg-gray-200 text-sm font-bold rounded"
                                    >
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => setShowRestoreConfirm(null)}
                                        className="px-4 py-1 bg-[#d4d0c8] border border-gray-400 hover:bg-gray-200 text-sm rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ImageViewer({ file, imageUrl, onClose }) {
    return (
        <motion.div
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-lg shadow-2xl overflow-hidden max-w-[90%] max-h-[90%]"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title Bar */}
                <div className="h-7 bg-gradient-to-r from-[#0058ee] to-[#3f96fe] flex items-center justify-between px-2 text-white text-xs font-bold select-none">
                    <span>{file?.name} - Image Viewer</span>
                    <button
                        className="w-5 h-5 bg-[#d84030] rounded border border-white/50 hover:bg-[#ff5040] flex items-center justify-center font-normal"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                {/* Image Content */}
                <div className="bg-gray-900 p-2">
                    <img
                        src={imageUrl}
                        alt={file?.name}
                        className="max-w-full max-h-[400px] object-contain mx-auto"
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23333" width="400" height="300"/><text fill="%23999" font-family="sans-serif" font-size="20" x="50%" y="50%" text-anchor="middle" dy=".3em">Image Not Found</text></svg>';
                        }}
                    />
                </div>
                {/* Info Bar */}
                <div className="bg-[#ece9d8] border-t p-2 text-xs text-gray-600 flex justify-between">
                    <span>{file?.name}</span>
                    <span className="text-gray-400">Recovered from Recycle Bin</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

function PropertiesDialog({ file, onClose }) {
    const p = file?.properties || {};
    return (
        <motion.div
            className="absolute top-10 left-10 w-72 bg-[#ece9d8] border shadow-xl text-black select-text z-50 p-1 rounded"
            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        >
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="font-bold">{file.name} Properties</span>
                <button onClick={onClose} className="border px-1">×</button>
            </div>
            <div className="bg-white border p-4 space-y-2 text-xs">
                <div className="flex gap-2">
                    <span className="w-20 text-gray-500">Type:</span>
                    <span>{file.type.toUpperCase()} File</span>
                </div>
                <div className="flex gap-2">
                    <span className="w-20 text-gray-500">Location:</span>
                    <span>Recycle Bin</span>
                </div>
                <div className="w-full h-px bg-gray-300 my-2" />
                <p className="text-gray-600 font-semibold mb-1">Details</p>
                {p.creator != null && (
                    <div className="flex gap-2">
                        <span className="w-20 text-gray-500">Creator:</span>
                        <span className="font-mono font-bold text-blue-600">{p.creator}</span>
                    </div>
                )}
                {p.tag != null && (
                    <div className="flex gap-2">
                        <span className="w-20 text-gray-500">Tag:</span>
                        <span className="font-mono font-bold text-blue-600">{p.tag}</span>
                    </div>
                )}
                {p.description != null && (
                    <div className="flex gap-2">
                        <span className="w-20 text-gray-500">Description:</span>
                        <span className="font-mono font-bold text-blue-600">{p.description}</span>
                    </div>
                )}
                {!p.creator && !p.tag && !p.description && (
                    <div className="text-gray-400 italic">No details</div>
                )}
            </div>
            <div className="flex justify-end gap-2 mt-2 px-1">
                <button className="px-3 py-1 bg-white border shadow hover:bg-gray-50" onClick={onClose}>OK</button>
            </div>
        </motion.div>
    );
}
