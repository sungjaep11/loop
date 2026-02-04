import React from 'react';

export function MetricsPanel({ efficiency = 98.2, accuracy = 100.0, compliance = 100 }) {
    const getComplianceLevel = (score) => {
        if (score >= 90) return { text: 'High', color: 'text-purple-400', bg: 'bg-purple-500' };
        if (score >= 70) return { text: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500' };
        return { text: 'Low', color: 'text-red-400', bg: 'bg-red-500' };
    };

    const complianceLevel = getComplianceLevel(compliance);

    return (
        <div className="bg-[#111] rounded p-4 border border-gray-800">
            <h3 className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">Performance Metrics</h3>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>EFFICIENCY</span>
                        <span className="text-green-400">{efficiency.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, efficiency))}%` }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>ACCURACY</span>
                        <span className="text-blue-400">{accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, accuracy))}%` }}></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>COMPLIANCE</span>
                        <span className={complianceLevel.color}>{complianceLevel.text}</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${complianceLevel.bg} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, compliance))}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
