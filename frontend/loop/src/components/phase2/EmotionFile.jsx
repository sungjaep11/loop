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
    const getPhaseColor = () => {
        switch (phase) {
            case 1: return 'border-blue-400';
            case 2: return 'border-yellow-400';
            case 3: return 'border-orange-500';
            case 4: return 'border-red-600';
            default: return 'border-gray-400';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`w-full max-w-md bg-[#1a1a2e] text-white rounded-lg shadow-2xl 
                 cursor-grab active:cursor-grabbing select-none relative
                 ${isDragging ? 'opacity-50 scale-105 z-50' : 'z-10'}
                 border-2 ${getPhaseColor()}
                 ${isEliminateMode ? 'animate-pulse border-red-600' : ''}`}
        >
            {/* Header */}
            <div className="bg-[#16213e] px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">
                        EMO-{String(file.id).padStart(3, '0')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                        isText ? 'bg-purple-600' : isImage ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                        {isText ? 'TEXT' : isImage ? 'IMAGE' : 'SUBJECT'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {showTutorial && (
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px]">
                            TUTORIAL
                        </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                        phase === 1 ? 'bg-blue-500' :
                        phase === 2 ? 'bg-yellow-500 text-black' :
                        phase === 3 ? 'bg-orange-500' :
                        'bg-red-600'
                    }`}>
                        PHASE {phase}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[200px] flex flex-col items-center justify-center">
                {isWebcam && webcamImage ? (
                    // Webcam photo display
                    <motion.div
                        className="relative"
                        animate={{ 
                            boxShadow: ['0 0 20px rgba(255,0,0,0.3)', '0 0 40px rgba(255,0,0,0.6)', '0 0 20px rgba(255,0,0,0.3)']
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <img 
                            src={webcamImage} 
                            alt="Subject" 
                            className="w-48 h-48 object-cover rounded-lg border-4 border-red-500"
                        />
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                            SUBJECT #402
                        </div>
                    </motion.div>
                ) : isWebcam ? (
                    // Webcam placeholder
                    <div className="w-48 h-48 bg-gray-800 rounded-lg border-2 border-dashed border-red-500 flex items-center justify-center">
                        <span className="text-red-400 text-4xl">📷</span>
                    </div>
                ) : isImage ? (
                    // Image display
                    <div className="text-center w-full">
                        {file.imageSrc ? (
                            <img
                                src={file.imageSrc}
                                alt={file.description || file.content}
                                className="w-full max-h-[280px] object-contain rounded-lg"
                            />
                        ) : (
                            <div className="text-6xl mb-4">{file.emoji || '🖼️'}</div>
                        )}
                        <p className="text-gray-300 text-sm mt-2">{file.content}</p>
                    </div>
                ) : (
                    // Text display
                    <div className="text-center px-4">
                        <div className="text-4xl mb-4">💬</div>
                        <p className={`text-lg font-medium ${file.isHiddenMessage ? 'tracking-widest text-red-300' : 'text-white'}`}>
                            "{file.content}"
                        </p>
                        {file.subtext && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                                ({file.subtext})
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-[#16213e] px-4 py-2 border-t border-gray-700">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-mono">
                        {isWebcam ? '⚠️ LIVE FEED' : `📁 ${file.description || 'Emotion Data'}`}
                    </span>
                    <span className={`font-mono ${isEliminateMode ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                        {isEliminateMode ? '[AWAITING ELIMINATION]' : '[AWAITING CLASSIFICATION]'}
                    </span>
                </div>
            </div>

            {/* Glitch overlay for Phase 4 */}
            {phase === 4 && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0, 0.1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    style={{
                        background: 'linear-gradient(transparent 50%, rgba(255,0,0,0.1) 50%)',
                        backgroundSize: '100% 4px',
                    }}
                />
            )}
        </div>
    );
}
