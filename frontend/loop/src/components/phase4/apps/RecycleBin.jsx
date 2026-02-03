import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RecycleBin({ files, onViewProperties }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showProps, setShowProps] = useState(null); // fileId

    const openProperties = (fileId) => {
        setShowProps(fileId);
        onViewProperties?.(fileId);
    };

    return (
        <div className="h-full w-full bg-white flex flex-col font-sans text-xs">
            {/* Toolbar */}
            <div className="bg-[#ece9d8] border-b p-2 flex gap-2 text-black">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span className="text-gray-400">Tools</span>
            </div>
            {/* File Grip */}
            <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start relative" onClick={() => setSelectedFile(null)}>
                {files.map(file => (
                    <div
                        key={file.id}
                        className={`group flex flex-col items-center gap-1 p-2 border border-transparent rounded cursor-pointer relative
                        ${selectedFile === file.id ? 'bg-[#316ac5] text-white' : 'hover:bg-gray-100 text-black'}`}
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(file.id); }}
                        onDoubleClick={() => openProperties(file.id)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            openProperties(file.id);
                        }}
                    >
                        <span className="text-3xl opacity-50 grayscale">{file.icon}</span>
                        <span className="text-center break-all">{file.name}</span>
                    </div>
                ))}
            </div>

            {/* Properties Modal */}
            <AnimatePresence>
                {showProps && (
                    <PropertiesDialog
                        file={files.find(f => f.id === showProps)}
                        onClose={() => setShowProps(null)}
                    />
                )}
            </AnimatePresence>
        </div>
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
