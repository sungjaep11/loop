import React, { useState } from 'react';

const ARCHIVE_PASSWORD = 'S4V3_TH3_S0UL';

export function FileManager({ file, onViewKillProcess }) {
    const [isExtracted, setIsExtracted] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [displayName, setDisplayName] = useState(file.name);
    const [showRenameInput, setShowRenameInput] = useState(false);
    const [renameValue, setRenameValue] = useState('');

    const isZip = displayName.toLowerCase().endsWith('.zip');

    const handleDoubleClickFile = () => {
        if (isZip) {
            setShowPasswordPrompt(true);
            setPasswordInput('');
        } else {
            alert("Wrong file type. This application cannot open the file.");
        }
    };

    const handlePasswordSubmit = () => {
        if (passwordInput.trim() === ARCHIVE_PASSWORD) {
            setIsExtracted(true);
            setShowPasswordPrompt(false);
            setPasswordInput('');
        } else {
            alert("Incorrect password.");
        }
    };

    const handleRenameClick = () => {
        setRenameValue(displayName);
        setShowRenameInput(true);
    };

    const handleRenameSubmit = () => {
        const trimmed = renameValue.trim();
        if (trimmed) {
            setDisplayName(trimmed);
            setShowRenameInput(false);
        }
    };

    return (
        <div className="h-full flex flex-col font-sans text-xs bg-white text-black">
            {/* Toolbar */}
            <div className="bg-[#ece9d8] border-b p-2 flex items-center justify-between">
                <div className="flex gap-4">
                    <span>File</span>
                    <span>Home</span>
                    <span>View</span>
                </div>
                {selected === 'file' && (
                    <button
                        type="button"
                        onClick={handleRenameClick}
                        className="px-2 py-1 border border-gray-500 rounded hover:bg-white/70"
                    >
                        Rename
                    </button>
                )}
            </div>

            {/* Path */}
            <div className="border-b p-1 bg-white flex items-center gap-2 text-gray-600">
                <span>📁</span>
                <span>C:\Users\SysAdmin\Desktop\</span>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
                <div className="flex flex-wrap gap-4">
                    <div
                        className={`flex flex-col items-center gap-1 w-20 p-2 border rounded cursor-pointer
                        ${selected === 'file' ? 'bg-blue-100 border-blue-300' : 'border-transparent hover:bg-gray-100'}`}
                        onClick={() => setSelected('file')}
                        onDoubleClick={handleDoubleClickFile}
                    >
                        <span className="text-4xl text-red-500">
                            {isZip ? '🤐' : '📄'}
                        </span>
                        <span className="text-center break-all">
                            {displayName}
                        </span>
                    </div>

                    {isExtracted && (
                        <>
                            <div
                                className="flex flex-col items-center gap-1 w-20 p-2 border border-transparent hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => onViewKillProcess?.()}
                            >
                                <span className="text-4xl text-red-600">⚙️</span>
                                <span className="text-center break-all text-red-600 font-bold">KILL_PROCESS.exe</span>
                            </div>
                            <div
                                className="flex flex-col items-center gap-1 w-20 p-2 border border-transparent hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => alert("Victim_List\n\nFolder containing records of 'deleted' employees.")}
                            >
                                <span className="text-4xl">📂</span>
                                <span className="text-center break-all text-blue-600 font-bold">Victim_List</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Rename modal */}
            {showRenameInput && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowRenameInput(false)}>
                    <div className="bg-[#ece9d8] border-2 border-[#0055ea] rounded-lg p-4 shadow-xl min-w-[280px]" onClick={(e) => e.stopPropagation()}>
                        <p className="font-bold mb-2">Rename file</p>
                        <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                            className="w-full border border-gray-400 px-2 py-1 rounded font-mono mb-3"
                            placeholder="New name (e.g. manual_standard.zip)"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200" onClick={() => setShowRenameInput(false)}>Cancel</button>
                            <button className="px-3 py-1 bg-[#0055ea] text-white rounded hover:bg-[#0044c0]" onClick={handleRenameSubmit}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password prompt modal */}
            {showPasswordPrompt && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowPasswordPrompt(false)}>
                    <div className="bg-[#ece9d8] border-2 border-[#0055ea] rounded-lg p-4 shadow-xl min-w-[280px]" onClick={(e) => e.stopPropagation()}>
                        <p className="font-bold mb-2">Enter password to extract archive</p>
                        <input
                            type="text"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                            className="w-full border border-gray-400 px-2 py-1 rounded font-mono mb-3"
                            placeholder="Password"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200" onClick={() => setShowPasswordPrompt(false)}>Cancel</button>
                            <button className="px-3 py-1 bg-[#0055ea] text-white rounded hover:bg-[#0044c0]" onClick={handlePasswordSubmit}>Extract</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#ece9d8] border-t p-1 text-gray-500 flex gap-4">
                <span>{isExtracted ? '3 items' : '1 item'}</span>
                {selected === 'file' && <span>Size: {file.size}</span>}
            </div>
        </div>
    );
}
