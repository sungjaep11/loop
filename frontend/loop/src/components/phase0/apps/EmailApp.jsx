import React from 'react';

export function EmailApp({ onOpenLink }) {
    return (
        <div className="flex flex-col h-full font-sans text-sm">
            {/* Toolbar */}
            <div className="bg-gray-100 border-b p-2 flex gap-4 text-gray-600">
                <button className="hover:bg-gray-200 px-2 rounded">Reply</button>
                <button className="hover:bg-gray-200 px-2 rounded">Reply All</button>
                <button className="hover:bg-gray-200 px-2 rounded">Forward</button>
                <span className="border-l pl-4">Archive</span>
                <span>Delete</span>
            </div>

            {/* Headers */}
            <div className="bg-white p-6 border-b">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-xl font-bold text-gray-800">Final Offer: Data Verification Specialist</h1>
                    <span className="text-gray-500 text-xs">Today, 09:00 AM</span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 text-gray-600">
                    <div className="font-bold text-right">From:</div>
                    <div className="text-blue-600">recruitment@save-corp.net</div>
                    <div className="font-bold text-right">To:</div>
                    <div>Applicant #402</div>
                </div>
            </div>

            {/* Body */}
            <div className="p-8 bg-white flex-1 overflow-auto leading-relaxed text-gray-800">
                <p className="mb-4">Dear Applicant,</p>
                <p className="mb-4">
                    We are pleased to offer you the position of <strong>Data Verification Specialist</strong> at S.A.V.E. Corporation.
                    Your profile matched our predictive algorithms with 99.9% accuracy.
                </p>
                <p className="mb-4">
                    As discussed, this is a remote position requiring high attention to detail and absolute confidentiality.
                    You will be processing sensitive client data.
                </p>

                <div className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r shadow-sm">
                    <h3 className="font-bold text-blue-900 mb-2">Next Steps</h3>
                    <p className="mb-4">To finalize your employment, please complete the onboarding process immediately:</p>
                    <ol className="list-decimal list-inside space-y-2 mb-4">
                        <li>Access the Employee Portal</li>
                        <li>Verify your identity (Camera Access Required)</li>
                        <li>Download the specialized workspace software</li>
                    </ol>
                    <button
                        onClick={onOpenLink}
                        className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors shadow"
                    >
                        Go to Employee Portal &rarr;
                    </button>
                </div>

                <p className="text-gray-500 italic mt-8 text-xs border-t pt-4">
                    CONFIDENTIALITY NOTICE: The information contained in this message is confidential and intended only for the use of the individual or entity named above. If the reader of this message is not the intended recipient, you are hereby notified that any dissemination, distribution or copying of this communication is strictly prohibited.
                </p>
            </div>
        </div>
    );
}
