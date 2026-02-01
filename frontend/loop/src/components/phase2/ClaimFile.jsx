import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';

export function ClaimFile({ file, showTutorial }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: file.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`w-full max-w-sm bg-white text-black rounded-sm shadow-xl 
                 cursor-grab active:cursor-grabbing select-none relative
                 ${isDragging ? 'opacity-50 scale-105 z-50' : 'z-10'}
                 ${file.isAnomaly ? 'border-2 border-red-500' : 'border border-gray-300'}`}
        >
            {/* Header */}
            <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center text-xs">
                <span className="font-mono text-gray-600">
                    CLAIM FORM #{file.formNumber}
                </span>
                {showTutorial && (
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px]">
                        TUTORIAL
                    </span>
                )}
                {file.isAnomaly && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded animate-pulse text-[10px]">
                        ANOMALY
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5 font-mono text-sm space-y-4 bg-[#f8f9fa]">
                {/* Patient Information */}
                <section>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
                        Patient Data
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Name:</span>
                            <span className={`font-bold ${file.isAnomaly ? 'text-red-600 font-mono tracking-tighter' : ''}`}>
                                {file.patientName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">DOB:</span>
                            <span>{file.dob}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">SSN:</span>
                            <span className={file.ssnError ? 'text-red-500 bg-red-50 px-1' : ''}>
                                {file.ssn}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Claim Details */}
                <section>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1 mt-4">
                        Claim Details
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Provider:</span>
                            <span className="text-xs">{file.provider}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Diagnosis:</span>
                            <span className="text-xs italic">{file.diagnosis}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-500 font-bold">Total:</span>
                            <span className="font-bold font-mono">{file.amount}</span>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="pt-2 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                    Neogen Corp Confidential
                </div>
            </div>
        </div>
    );
}
