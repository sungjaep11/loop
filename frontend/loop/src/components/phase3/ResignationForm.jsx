import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';

export function ResignationForm() {
    const [denied, setDenied] = useState(false);
    const [resistanceStage, setResistanceStage] = useState(0); // 0, 1, 2, 3 (fail)
    const [aidraWarnings, setAidraWarnings] = useState([]);
    const controls = useAnimation(); // To control form position programmatically

    const setScene = useGameStore((s) => s.setScene);
    const playSFX = useAudioStore((s) => s.playSFX);
    const playAmbient = useAudioStore((s) => s.playAmbient);

    useEffect(() => {
        playAmbient('officeAmbient'); // Start deceptively normal
    }, [playAmbient]);

    const handleDrag = (event, info) => {
        const x = info.offset.x;

        // Dragging RIGHT (Resign)
        if (x > 0) {
            // Check thresholds for stages
            if (resistanceStage === 0 && x > 50) {
                setResistanceStage(1);
                setAidraWarnings(prev => ["What are you doing, #402?", "You just started.", "Give it more time."]);
                playSFX('error'); // Subtle warning
            } else if (resistanceStage === 1 && x > 150) {
                setResistanceStage(2);
                setAidraWarnings(prev => ["You can't leave.", "You signed the contract.", "Remember?"]);
                playSFX('alarm'); // Louder
            } else if (resistanceStage === 2 && x > 250) {
                setResistanceStage(3);
                setAidraWarnings(prev => ["Y̷O̵U̶ ̸C̷A̵N̶N̵O̷T̸ ̵L̶E̸A̷V̵E̴", "T̶H̴E̵R̷E̶ ̵I̸S̷ ̶N̵O̶W̷H̴E̸R̵E̶ ̴T̷O̵ ̷G̶O̸", "Y̵O̷U̶ ̷A̸R̷E̴ ̶O̵U̷R̵S̶"]);
                playSFX('glitch'); // Intense
            }
        }
    };

    const handleDragEnd = async (event, info) => {
        const x = info.offset.x;

        // If they managed to drag far right (Resign) - FUTILE
        if (x > 50) {
            // Force snap back to left (Stay)
            await controls.start({ x: -200, transition: { type: "spring", stiffness: 300, damping: 20 } });

            // Trigger denial sequence
            setTimeout(() => {
                setDenied(true);
                playSFX('stamp');

                setTimeout(() => {
                    setScene('lockdown');
                }, 4000);
            }, 500);
        } else {
            controls.start({ x: 0 });
        }
    };

    // calculate elasticity based on stage
    const getElasticity = () => {
        if (resistanceStage === 0) return 0.5; // Normal-ish
        if (resistanceStage === 1) return 0.2; // Heavy
        if (resistanceStage === 2) return 0.05; // Very Heavy
        return 0; // Stuck
    };

    const getBgColor = () => {
        if (resistanceStage === 0) return 'bg-white';
        if (resistanceStage === 1) return 'bg-red-50';
        if (resistanceStage === 2) return 'bg-red-100';
        return 'bg-red-900';
    };

    return (
        <motion.div
            className={`w-full h-full flex items-center justify-center relative overflow-y-auto overflow-x-hidden transition-colors duration-1000 py-6 ${resistanceStage > 1 ? 'bg-red-950' : 'bg-neogen-bg'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Red Vignette/Overlay for intense stages */}
            {resistanceStage > 0 && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        boxShadow: `inset 0 0 ${resistanceStage * 100}px rgba(255,0,0,0.5)`
                    }}
                />
            )}

            <motion.div
                className={`${getBgColor()} text-black rounded-sm shadow-2xl w-[min(600px,95vw)] max-h-[calc(100vh-3rem)] flex flex-col relative z-20 border border-gray-400 flex-shrink-0 my-auto`}
                drag="x"
                dragConstraints={{ left: -200, right: 100 * (3 - resistanceStage) }} // Limit right movement as stages progress
                dragElastic={getElasticity()}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ touchAction: 'none' }}
            >
                {/* Form Header */}
                <div className="p-6 sm:p-8 border-b-4 border-double border-black bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-xl font-bold font-mono tracking-wider">NEOGEN CORPORATION</h1>
                            <h2 className="text-sm font-bold mt-1">FORM 109-R: VOLUNTARY EMPLOYMENT TERMINATION</h2>
                        </div>
                        <div className="border-2 border-black p-2 font-mono text-xs font-bold text-red-600 rotate-12 opacity-50">
                            OFFICIAL USE ONLY
                        </div>
                    </div>
                </div>

                {/* Form Body - scrollable if content overflows */}
                <div className="p-6 sm:p-8 font-mono text-sm space-y-6 overflow-y-auto flex-1 min-h-0">
                    <div className="grid grid-cols-2 gap-4 border-b border-black pb-6">
                        <div>
                            <span className="block text-gray-500 text-xs mb-1">Employee ID</span>
                            <span className="font-bold">#402</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs mb-1">Department</span>
                            <span className="font-bold">Medical Claims Processing</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs mb-1">Date of Request</span>
                            <span className="font-bold">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold mb-3 border-b border-gray-300 pb-1">REASON FOR TERMINATION:</p>
                        <div className="space-y-2 pl-4">
                            <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                <div className="w-4 h-4 border border-gray-400 bg-gray-100"></div>
                                Better opportunity elsewhere
                            </label>
                            <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                <div className="w-4 h-4 border border-gray-400 bg-gray-100"></div>
                                Relocation
                            </label>
                            <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                <div className="w-4 h-4 border border-gray-400 bg-gray-100"></div>
                                Personal reasons
                            </label>
                            <label className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                <div className="w-4 h-4 border border-gray-400 bg-gray-100"></div>
                                Health concerns
                            </label>
                            <label className="flex items-center gap-2 text-black font-bold">
                                <div className="w-4 h-4 border-2 border-red-600 bg-red-100 flex items-center justify-center text-red-600">✓</div>
                                I WANT TO LEAVE
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 border border-gray-300">
                        <p className="font-bold mb-2">ACKNOWLEDGMENT:</p>
                        <p className="text-xs text-gray-600 mb-2">
                            I understand that by submitting this form, I am requesting to terminate my employment with NEOGEN Corp.
                        </p>
                        <p className="text-xs text-gray-600">
                            I acknowledge that this decision is <span className="font-bold underline text-red-600 animate-pulse">FUTILE</span>.
                        </p>
                    </div>
                </div>

                {/* Footer / Drag Actions */}
                <div className="bg-gray-200 p-4 border-t border-gray-400 flex justify-between items-center font-bold text-gray-500 flex-shrink-0">
                    <span className="flex items-center gap-2">← [STAY]</span>
                    <span className="flex items-center gap-2">[RESIGN] →</span>
                </div>

                {/* Denied stamp */}
                {denied && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="bg-white border-4 border-red-600 p-8 transform -rotate-2 max-w-lg shadow-[0_0_50px_rgba(255,0,0,0.5)]"
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <h1 className="text-5xl font-black text-red-600 mb-4 tracking-tighter border-b-4 border-red-600 pb-2">
                                REQUEST DENIED
                            </h1>
                            <div className="font-mono text-red-900 font-bold space-y-2">
                                <p>Reason: Article 5, Section 2</p>
                                <p className="italic">"Employment may only be terminated by NEOGEN Corp."</p>

                                <div className="mt-6 border-t/2 border-red-200 pt-4 space-y-1">
                                    <p className="flex items-center gap-2">☑ <span className="text-sm">Logged</span></p>
                                    <p className="flex items-center gap-2">☑ <span className="text-sm">Analyzed</span></p>
                                    <p className="flex items-center gap-2">☑ <span className="text-sm">Reported to Compliance Division</span></p>
                                </div>

                                <p className="mt-4 text-xs uppercase bg-red-100 p-2 inline-block">
                                    You will be contacted regarding this... incident.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>

            {/* AIDRA warnings */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 space-y-2 z-50 pointer-events-none">
                {aidraWarnings.map((warning, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`px-6 py-3 rounded shadow-lg font-mono text-sm border-l-4 
                        ${resistanceStage > 1 ? 'bg-red-900 text-white border-red-500' : 'bg-white text-black border-neogen-accent'}`}
                    >
                        <span className="font-bold mr-2">{resistanceStage > 2 ? 'A̷I̷D̶R̵A̴' : 'AIDRA'}:</span>
                        "{warning}"
                    </motion.div>
                ))}
            </div>

            {/* Instructions Overlay */}
            {!denied && resistanceStage < 3 && (
                <motion.p
                    className="fixed top-12 text-center text-sm text-gray-400 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Drag the form to make your choice
                </motion.p>
            )}
        </motion.div>
    );
}
