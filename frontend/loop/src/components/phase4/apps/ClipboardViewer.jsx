import React from 'react';

export function ClipboardViewer({ history }) {
    return (
        <div className="h-full flex flex-col bg-white font-sans text-xs text-black">
            <div className="p-2 bg-gray-100 border-b font-bold">History (Win+V)</div>
            <div className="flex-1 overflow-auto divide-y">
                {history.map((item, i) => (
                    <div key={i} className="p-3 hover:bg-blue-50 cursor-copy group">
                        <div className="text-gray-800 break-all font-mono">{item}</div>
                        <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                            <span>{new Date(Date.now() - i * 1000000).toLocaleDateString()}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-blue-500">Click to copy</span>
                        </div>
                    </div>
                ))}
                {history.length === 0 && (
                    <div className="p-4 text-center text-gray-400">Clipboard is empty</div>
                )}
            </div>
        </div>
    );
}
