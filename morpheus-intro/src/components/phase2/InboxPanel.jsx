import React from 'react';

export function InboxPanel({ totalFiles, processedCount }) {
    const remaining = Math.max(0, totalFiles - processedCount);

    return (
        <div className="bg-[#1a1a1a] rounded p-4 border border-gray-800">
            <h3 className="text-xs font-mono text-gray-400 mb-4 uppercase tracking-wider">Incoming Queue</h3>

            <div className="space-y-2">
                {Array.from({ length: Math.min(5, remaining) }).map((_, i) => (
                    <div
                        key={i}
                        className="h-8 bg-gray-800 rounded border border-gray-700 relative overflow-hidden"
                        style={{ opacity: 1 - (i * 0.15), transform: `scale(${1 - (i * 0.05)})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-pulse"></div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs font-mono">
                <span className="text-gray-500">PENDING:</span>
                <span className="text-white font-bold">{remaining} FILES</span>
            </div>
        </div>
    );
}
