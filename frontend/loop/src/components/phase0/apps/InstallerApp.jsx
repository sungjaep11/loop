import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function InstallerApp({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing...");

    useEffect(() => {
        const statuses = [
            "Unpacking resources...",
            "Verifying security certificates...",
            "Connecting to S.A.V.E. mainframe...",
            "Installing surveillance modules...",
            "Finalizing setup..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1000); // Close after 1s
                    return 100;
                }

                // Update status text periodically
                if (prev % 20 === 0 && i < statuses.length) {
                    setStatus(statuses[i]);
                    i++;
                }

                return prev + 1;
            });
        }, 50); // 5 seconds total

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="p-6 flex flex-col h-full bg-[#f0f0f0] font-sans text-xs">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-300 flex items-center justify-center border inset-shadow">
                    💻
                </div>
                <div>
                    <h2 className="font-bold text-lg">S.A.V.E. Workspace Setup</h2>
                    <p className="text-gray-600">Installing version 2.0.4...</p>
                </div>
            </div>

            <div className="mb-2 flex justify-between">
                <span>{status}</span>
                <span>{progress}%</span>
            </div>

            <div className="h-6 w-full bg-white border border-gray-400 p-[1px] shadow-inner mb-4">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-auto flex justify-end">
                <button
                    disabled
                    className="px-6 py-1 border bg-gray-200 text-gray-500 shadow-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
