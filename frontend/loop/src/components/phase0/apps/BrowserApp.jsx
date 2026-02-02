import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebcam } from '../../../hooks/useWebcam';
import { usePlayerStore } from '../../../stores/playerStore';

export function BrowserApp({ onDownload }) {
    const [url, setUrl] = useState('https://portal.save-corp.com/login');
    const [step, setStep] = useState(0); // 0: Login, 1: Permission, 2: Profile, 3: Download
    const { requestWebcam } = useWebcam();
    const [name, setName] = useState('');
    const setPlayerName = usePlayerStore(state => state.setPlayerName);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setUrl('https://portal.save-corp.com/verification');
            setStep(1);
        }, 1500);
    };

    const handlePermission = async (allow) => {
        if (allow) {
            const granted = await requestWebcam();
            if (granted) {
                setStep(2);
                setUrl('https://portal.save-corp.com/profile');
            } else {
                alert("Biometric verification failed. Please check your camera settings.");
                // For game flow, we might let them proceed or stuck them. 
                // Let's let them proceed for now to avoid frustration, or mock it.
                setStep(2);
                setUrl('https://portal.save-corp.com/profile');
            }
        } else {
            alert("Camera access is mandatory for S.A.V.E. employment.");
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        setTimeout(() => {
            setPlayerName(name); // Save to store
            setIsLoading(false);
            setStep(3); // Download
            setUrl('https://portal.save-corp.com/download');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans text-black">
            {/* Browser Chrome */}
            <div className="bg-gray-100 border-b p-2 flex items-center gap-2">
                <div className="flex gap-1 mr-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <button className="text-gray-400 hover:text-black font-bold px-2">&larr;</button>
                <button className="text-gray-400 hover:text-black font-bold px-2">&rarr;</button>
                <button className="text-gray-400 hover:text-black font-bold px-2">↻</button>
                <div className="flex-1 bg-white border rounded px-3 py-1 text-sm text-gray-700 flex items-center shadow-inner">
                    <span className="text-green-600 mr-2">🔒</span>
                    {url}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                )}

                <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow-md border">
                    <div className="flex justify-center mb-8">
                        <div className="text-2xl font-black text-gray-800 tracking-tighter">S.A.V.E. Portal</div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <h2 className="text-xl mb-6 font-bold">Employee Login</h2>
                                <button
                                    onClick={handleLogin}
                                    className="w-full flex items-center justify-center gap-3 border shadow-sm py-3 px-4 rounded hover:bg-gray-50 transition-colors"
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="w-5 h-5" />
                                    <span>Sign in with Google</span>
                                </button>
                                <p className="mt-4 text-xs text-gray-400">Secure 256-bit Encryption</p>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="permission"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl mb-4 font-bold text-center">Security Verification</h2>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6 text-sm text-yellow-800">
                                    S.A.V.E. requires camera access to verify your identity during work sessions.
                                </div>

                                {/* Fake Permission Popup Simulation */}
                                <div className="absolute inset-0 bg-black/20 flex items-start pt-20 justify-center z-50 rounded">
                                    <motion.div
                                        className="bg-white rounded-lg shadow-xl p-4 w-72 text-left"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                    >
                                        <p className="mb-4 text-sm font-medium text-gray-700">
                                            portal.save-corp.com wants to use your camera
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handlePermission(false)}
                                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                            >
                                                Block
                                            </button>
                                            <button
                                                onClick={() => handlePermission(true)}
                                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                                            >
                                                Allow
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl mb-6 font-bold text-center">Complete Profile</h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
                                            value="Data Processing Unit"
                                            disabled
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 mt-4"
                                    >
                                        Save & Continue
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="download"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="text-6xl mb-4">⬇️</div>
                                <h2 className="text-xl font-bold mb-2">Setup Required</h2>
                                <p className="text-gray-600 mb-6">
                                    Please download and install the secure workspace software to begin.
                                </p>
                                <button
                                    onClick={onDownload}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg animate-bounce"
                                >
                                    Download Workspace.exe (45MB)
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
