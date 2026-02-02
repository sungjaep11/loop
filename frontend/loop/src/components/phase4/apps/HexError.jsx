import React, { useState } from 'react';

export function HexError() {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="p-4 w-full h-full flex flex-col bg-[#f0f0f0] font-sans">
            <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">❌</div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Application Error</h3>
                    <p className="text-xs text-gray-600 mb-2">Access to 'Security_Log.exe' was denied (Error 403).</p>
                    <p className="text-xs text-gray-600">You do not have sufficient privileges.</p>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-auto">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-3 py-1 border bg-white hover:bg-gray-50 text-xs"
                >
                    {showDetails ? 'Hide Details <<' : 'Show Details >>'}
                </button>
                <button className="px-3 py-1 border bg-white hover:bg-gray-50 text-xs shadow-sm">OK</button>
            </div>

            {showDetails && (
                <div className="mt-4 p-2 bg-white border border-gray-300 h-32 overflow-auto font-mono text-[10px] text-gray-500 select-text">
                    <p>Exception in thread "main" java.lang.SecurityException</p>
                    <p>at com.save.core.Auth.verify(Unknown Source)</p>
                    <p>Memory Dump:</p>
                    <p className="text-blue-800 font-bold hover:bg-yellow-100 cursor-help" title="Try accessing this address?">0x1A4F: 192.168.0.105:8080/admin</p>
                    <p>0x1A50: 00 00 00 00 00 00 00 00</p>
                    <p>0x1A60: FF FF FF FF 4A 21 9C 0D</p>
                    <p>0x1A70: ACCESS_VIOLATION at 0x000F</p>
                </div>
            )}
        </div>
    );
}
