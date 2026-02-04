import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { getPhaseByFileId } from '../../data/emotionFiles';

export function EmotionFile({ file, showTutorial, webcamImage, isEliminateMode }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: file.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const phase = getPhaseByFileId(file.id);
    const isWebcam = file.type === 'webcam';
    const isText = file.type === 'text';
    const isImage = file.type === 'image';

    // Phase-based styling
    const getPhaseStyles = () => {
        switch (phase) {
            case 1: return {
                border: 'border-cyan-500/50',
                glow: 'rgba(0,255,255,0.15)',
                accent: 'cyan'
            };
            case 2: return {
                border: 'border-yellow-500/50',
                glow: 'rgba(234,179,8,0.15)',
                accent: 'yellow'
            };
            case 3: return {
                border: 'border-orange-500/50',
                glow: 'rgba(249,115,22,0.15)',
                accent: 'orange'
            };
            case 4: return {
                border: 'border-red-500/50',
                glow: 'rgba(239,68,68,0.2)',
                accent: 'red'
            };
            default: return {
                border: 'border-gray-500/50',
                glow: 'rgba(100,100,100,0.1)',
                accent: 'gray'
            };
        }
    };

    const phaseStyles = getPhaseStyles();

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                w-full max-w-xl rounded-2xl shadow-2xl 
                cursor-grab active:cursor-grabbing select-none relative
                backdrop-blur-md border-2
                ${isDragging ? 'opacity-80 z-50' : 'z-10 transition-shadow duration-300'}
                ${phaseStyles.border}
                ${isEliminateMode ? 'animate-pulse border-red-500' : ''}
            `}
            style={{
                transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.02 : 1})`
                    : undefined,
                background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
                boxShadow: isDragging
                    ? `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px ${phaseStyles.glow}`
                    : `0 10px 40px -10px rgba(0,0,0,0.4), 0 0 20px ${phaseStyles.glow}`,
            }}
        >
            {/* Scan line overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5 rounded-2xl overflow-hidden"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                }}
            />

            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center relative">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-2xl" />

                <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                        EMO-{String(file.id).padStart(3, '0')}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isText ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        isImage ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                        {isText ? 'TEXT' : isImage ? 'IMAGE' : 'SUBJECT'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {showTutorial && (
                        <span className="bg-green-500/20 text-green-300 px-2.5 py-1 rounded-full text-[10px] font-medium border border-green-500/30 animate-pulse">
                            TUTORIAL
                        </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${phase === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        phase === 2 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            phase === 3 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                        PHASE {phase}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[300px] flex flex-col items-center justify-center">
                {isWebcam && webcamImage ? (
                    <motion.div
                        className="relative"
                        animate={{
                            boxShadow: ['0 0 20px rgba(255,0,0,0.3)', '0 0 40px rgba(255,0,0,0.5)', '0 0 20px rgba(255,0,0,0.3)']
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <img
                            src={webcamImage}
                            alt="Subject"
                            className="w-56 h-56 object-cover rounded-xl border-4 border-red-500/50"
                        />
                        <div className="absolute -top-3 -right-3 bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                            SUBJECT #402
                        </div>
                        {/* Scan effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent rounded-xl"
                            animate={{ y: [-120, 120] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                ) : isWebcam ? (
                    <div className="w-56 h-56 bg-gray-900/50 rounded-xl border-2 border-dashed border-red-500/50 flex items-center justify-center">
                        <span className="text-red-400 text-5xl">📷</span>
                    </div>
                ) : isImage ? (
                    <div className="text-center w-full">
                        {file.imageSrc ? (
                            <div className="relative inline-block">
                                <img
                                    src={file.imageSrc}
                                    alt={file.description || file.content}
                                    className="w-full max-h-[360px] object-contain rounded-xl border border-white/10"
                                />
                                {/* Image glow effect */}
                                <div
                                    className="absolute inset-0 rounded-xl pointer-events-none"
                                    style={{
                                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-6xl mb-4">{file.emoji || '🖼️'}</div>
                        )}
                        <p className="text-gray-400 text-sm mt-4 font-light">{file.content}</p>
                    </div>
                ) : (
                    <div className="text-center px-6 py-4">
                        <div className="text-5xl mb-5 opacity-80">💬</div>
                        <p className={`text-xl font-light leading-relaxed ${file.isHiddenMessage
                            ? 'tracking-[0.3em] text-red-300 font-mono'
                            : 'text-gray-200'
                            }`}>
                            "{file.content}"
                        </p>
                        {file.subtext && (
                            <p className="text-xs text-gray-500 mt-4 italic font-mono">
                                ({file.subtext})
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/10 relative">
                {/* Decorative corner */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/30 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br-2xl" />

                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-mono flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isWebcam ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`} />
                        {isWebcam ? 'LIVE FEED' : file.description || 'Emotion Data'}
                    </span>
                    <span className={`font-mono ${isEliminateMode ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                        {isEliminateMode ? '[ELIMINATION PENDING]' : '[AWAITING INPUT]'}
                    </span>
                </div>
            </div>

            {/* Phase 4 glitch overlay */}
            {phase === 4 && (
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
                    animate={{ opacity: [0, 0.15, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }}
                >
                    <div
                        className="w-full h-full"
                        style={{
                            background: 'linear-gradient(transparent 50%, rgba(255,0,0,0.1) 50%)',
                            backgroundSize: '100% 4px',
                        }}
                    />
                </motion.div>
            )}

            {/* Drag indicator glow */}
            {isDragging && (
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        boxShadow: `0 0 40px ${phaseStyles.glow}, 0 0 80px ${phaseStyles.glow}`,
                    }}
                />
            )}
        </div>
    );
}
