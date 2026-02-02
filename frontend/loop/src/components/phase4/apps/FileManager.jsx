import React, { useState } from 'react';

export function FileManager({ file, showHiddenExt, toggleHiddenExt }) {
    const [isExtracted, setIsExtracted] = useState(false);
    const [selected, setSelected] = useState(null);

    return (
        <div className="h-full flex flex-col font-sans text-xs bg-white text-black">
            {/* Toolbar / Options */}
            <div className="bg-[#ece9d8] border-b p-2 flex items-center justify-between">
                <div className="flex gap-4">
                    <span>File</span>
                    <span>Home</span>
                    <span>View</span>
                </div>
                <label className="flex items-center gap-1 cursor-pointer hover:bg-white/50 px-2 rounded">
                    <input
                        type="checkbox"
                        checked={showHiddenExt}
                        onChange={toggleHiddenExt}
                        className="rounded border-gray-400"
                    />
                    <span>Hidden items</span>
                </label>
            </div>

            {/* Path */}
            <div className="border-b p-1 bg-white flex items-center gap-2 text-gray-600">
                <span>📁</span>
                <span>C:\Users\SysAdmin\Desktop\</span>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
                {/* The Main File */}
                <div className="flex flex-wrap gap-4">
                    <div
                        className={`flex flex-col items-center gap-1 w-20 p-2 border rounded cursor-pointer
                        ${selected === 'file' ? 'bg-blue-100 border-blue-300' : 'border-transparent hover:bg-gray-100'}`}
                        onClick={() => setSelected('file')}
                        onDoubleClick={() => {
                            if (showHiddenExt && file.hiddenExt === 'zip') {
                                // Trigger extract
                                if (window.confirm("This is a compressed folder. Extract contents?")) {
                                    setIsExtracted(true);
                                }
                            } else {
                                // Default PDF open behavior (fake)
                                alert("Error: File is corrupted or too large to preview.");
                            }
                        }}
                    >
                        <span className="text-4xl text-red-500">
                            {showHiddenExt && file.hiddenExt === 'zip' ? '🤐' : '📄'}
                        </span>
                        <span className="text-center break-all">
                            {file.name}{showHiddenExt && file.hiddenExt ? `.${file.hiddenExt}` : ''}
                        </span>
                    </div>

                    {/* Extracted Content */}
                    {isExtracted && (
                        <div
                            className="flex flex-col items-center gap-1 w-20 p-2 border border-transparent hover:bg-gray-100 rounded cursor-pointer animate-pulse"
                            onClick={() => alert("EVIDENCE FOUND: Employee_Photos_v4.folder\n\nContains images of 'deleted' employees.")}
                        >
                            <span className="text-4xl">📂</span>
                            <span className="text-center break-all text-blue-600 font-bold">Evidence</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#ece9d8] border-t p-1 text-gray-500 flex gap-4">
                <span>{isExtracted ? '2 items' : '1 item'}</span>
                {selected === 'file' && <span>Size: {file.size}</span>}
            </div>
        </div>
    );
}
