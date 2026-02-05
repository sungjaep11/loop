import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../../stores/audioStore';

export function PrologueScene({ onComplete }) {
    const [emailOpen, setEmailOpen] = useState(false);
    const playSFX = useAudioStore((s) => s.playSFX);
    const playAmbient = useAudioStore((s) => s.playAmbient);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    React.useEffect(() => {
        playAmbient('fluorescentHum');
    }, []);

    return (
        <div className="w-full h-full bg-black relative overflow-hidden">
            {/* Ambient Dark Room Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black opacity-90" />

            {/* Full Screen Content */}
            <motion.div
                className="relative z-10 w-full h-full bg-black overflow-hidden flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                {/* Screen Content */}
                <div className="flex-1 bg-black relative p-8 font-sans text-gray-300 overflow-y-auto">
                    {/* Fake Email Client Interface */}
                    <div className="border-b border-gray-700 pb-2 mb-4 flex justify-between items-center bg-[#111] p-2 rounded">
                        <span className="font-bold text-white">Inbox (1)</span>
                        <span className="text-xs text-gray-500">{currentTime}</span>
                    </div>

                    {/* Email List Item */}
                    {!emailOpen && (
                        <div className="space-y-2">
                            {/* Main Unread Email */}
                            <motion.div
                                className="bg-[#222] p-4 rounded border-l-4 border-neogen-accent cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                                onClick={() => {
                                    setEmailOpen(true);
                                    playSFX('click');
                                }}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-white">S.A.V.E. Recruiting</span>
                                    <span className="text-xs text-gray-400">Just Now</span>
                                </div>
                                <div className="font-bold text-neogen-accent mb-1">Shape the Future with Us - Job Offer</div>
                                <div className="text-sm text-gray-500 truncate">
                                    Dear Candidate, We are pleased to inform you that you have been selected...
                                </div>
                            </motion.div>

                            {/* Dummy Read Emails */}
                            {[
                                { sender: "S.A.V.E. HR", subject: "Application Received - Reference #402", time: "Yesterday", preview: "Your application has been successfully submitted to our database." },
                                { sender: "Tech News Daily", subject: "The Rise of Pattern Recognition AI", time: "2 days ago", preview: "New algorithms are changing how we process vast archives of data..." },
                                { sender: "Account Security", subject: "Login Attempt Blocked", time: "3 days ago", preview: "We noticed an unusual login attempt from a new location." },
                                { sender: "Cloud Storage", subject: "Your subscription is expiring soon", time: "Last Week", preview: "Please update your payment method to avoid service interruption." },
                                { sender: "S.A.V.E. Newsletter", subject: "Weekly Internal Updates", time: "Last Week", preview: "Updates on the new archive protocol and data safety measures." }
                            ].map((mail, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-[#1a1a1a] p-3 rounded border-l-4 border-transparent opacity-60 hover:opacity-80 transition-opacity"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 0.6 }}
                                    transition={{ delay: 1 + (idx * 0.1) }}
                                >
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-400">{mail.sender}</span>
                                        <span className="text-xs text-gray-600">{mail.time}</span>
                                    </div>
                                    <div className="text-gray-500 text-sm mb-1 truncate">{mail.subject}</div>
                                    <div className="text-xs text-gray-700 truncate">
                                        {mail.preview}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Open Email view */}
                    <AnimatePresence>
                        {emailOpen && (
                            <motion.div
                                className="absolute inset-4 bg-white text-black p-8 rounded shadow-2xl overflow-y-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="border-b-2 border-neogen-accent pb-4 mb-6">
                                    <h1 className="text-2xl font-bold text-neogen-accent">OFFER OF EMPLOYMENT</h1>
                                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                                        <span>From: S.A.V.E. Human Resources</span>
                                        <span>To: Applicant #402</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 text-sm leading-relaxed">
                                    <p>Dear Applicant,</p>
                                    <p>
                                        Congratulations. Your specific skill set in data processing and pattern recognition
                                        has been flagged by our system as <span className="font-bold text-neogen-accent">EXCEPTIONAL</span>.
                                    </p>
                                    <p>
                                        At S.A.V.E. (Secure Archive for Valuable Emotions), we believe in preserving the
                                        best of humanity. You have been chosen to join our elite Data Processing Unit.
                                    </p>

                                    <div className="bg-gray-100 p-4 border-l-4 border-neogen-accent my-6">
                                        <p className="font-bold">Role: Data Verification Specialist</p>
                                        <p>Status: Immediate Start Required</p>
                                        <p>Department: Emotion Classification Division</p>
                                        <p>Security Clearance: Level 2</p>
                                    </div>

                                    <p className="font-bold text-gray-800">Your Responsibilities:</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                                        <li>Process and classify emotional data fragments</li>
                                        <li>Verify authenticity of archived human expressions</li>
                                        <li>Maintain 99.7% accuracy in pattern recognition tasks</li>
                                        <li>Follow all protocols established by V.E.R.A. system</li>
                                    </ul>

                                    <p className="font-bold text-gray-800 mt-4">Benefits Package:</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                                        <li>Competitive compensation (details upon onboarding)</li>
                                        <li>Full access to S.A.V.E. employee facilities</li>
                                        <li>Comprehensive wellness monitoring program</li>
                                        <li>Opportunity to contribute to humanity's preservation</li>
                                    </ul>

                                    <div className="bg-yellow-50 p-4 border-l-4 border-yellow-500 my-6">
                                        <p className="font-bold text-yellow-800">Important Notice:</p>
                                        <p className="text-yellow-700 text-xs mt-1">
                                            This offer is time-sensitive. Failure to initialize your workstation within
                                            the designated timeframe may result in automatic reassignment of your position.
                                            All employees are required to complete mandatory orientation before accessing
                                            primary systems.
                                        </p>
                                    </div>

                                    <p>
                                        We look forward to your contribution to our mission. Together, we will ensure
                                        that the most valuable aspects of human experience are preserved for future generations.
                                    </p>
                                    <p className="text-gray-500 text-xs mt-4">
                                        Please initialize your workstation immediately to begin the onboarding process.
                                    </p>
                                </div>

                                <motion.button
                                    className="w-full bg-neogen-accent text-white py-4 font-bold text-lg rounded hover:bg-neogen-secondary transition-all shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        playSFX('click');
                                        onComplete(); // Triggers boot sequence
                                    }}
                                >
                                    INITIALIZE WORKSTATION
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </motion.div>
        </div>
    );
}
