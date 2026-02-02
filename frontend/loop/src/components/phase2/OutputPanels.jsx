import React from 'react';

export function OutputPanels() {
    return (
        <div className="flex flex-col gap-4">
            {/* Approve Zone Stat */}
            <div className="bg-green-900/10 border border-green-900/30 rounded p-4">
                <h3 className="text-[10px] text-green-600 font-mono uppercase mb-1">Approved</h3>
                <div className="text-2xl text-green-500 font-mono font-bold">--</div>
            </div>

            {/* Reject Zone Stat */}
            <div className="bg-yellow-900/10 border border-yellow-900/30 rounded p-4">
                <h3 className="text-[10px] text-yellow-600 font-mono uppercase mb-1">Held for Review</h3>
                <div className="text-2xl text-yellow-500 font-mono font-bold">--</div>
            </div>

            {/* System Log */}
            <div className="bg-black/50 border border-gray-800 rounded p-4 flex-1">
                <h3 className="text-[10px] text-gray-500 font-mono uppercase mb-2">System Log</h3>
                <div className="font-mono text-[9px] text-green-900 space-y-1">
                    <div>{'>'} CONNECTED TO WS-1987</div>
                    <div>{'>'} AIDRA SYNC ACTIVE</div>
                    <div>{'>'} MONITORING...</div>
                </div>
            </div>
        </div>
    );
}
