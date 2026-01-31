import React from 'react';

export function MetricsPanel() {
    return (
        <div className="bg-[#111] rounded p-4 border border-gray-800">
            <h3 className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">Performance Metrics</h3>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>EFFICIENCY</span>
                        <span className="text-green-400">98.2%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[98%]"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>ACCURACY</span>
                        <span className="text-blue-400">100.0%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-full"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>COMPLIANCE</span>
                        <span className="text-purple-400">High</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[95%]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
