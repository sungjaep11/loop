import React, { useState } from 'react';

const CensorTask = ({ onComplete }) => {
    const [redactedCount, setRedactedCount] = useState(0);
    const [redactedIndices, setRedactedIndices] = useState([]);

    const content = [
        { text: "I am feeling very ", type: "text" },
        { text: "tired", type: "trigger", id: 0 },
        { text: ". The work hours are ", type: "text" },
        { text: "endless", type: "trigger", id: 1 },
        { text: ". I haven't seen the ", type: "text" },
        { text: "sun", type: "trigger", id: 2 },
        { text: " in days. Please let me ", type: "text" },
        { text: "rest", type: "trigger", id: 3 },
        { text: ".", type: "text" }
    ];

    const handleRedact = (idx) => {
        if (!redactedIndices.includes(idx)) {
            setRedactedIndices([...redactedIndices, idx]);
        }
    };

    const isComplete = redactedIndices.length === 4;

    const handleApprove = () => {
        if (isComplete) {
            onComplete();
        }
    };

    return (
        <div className="flex-center-col animate-fade-in" style={{ height: '100vh', gap: '20px' }}>
            <div className="mono" style={{ color: '#666' }}>
                INCOMING FLAGGED DOCUMENT. REMOVE SENSITIVE SENTIMENTS.
            </div>

            <div className="glass-panel" style={{ width: '500px', padding: '40px', background: '#fff' }}>
                <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
                    <div style={{ fontWeight: 'bold' }}>To: HR</div>
                    <div style={{ fontWeight: 'bold' }}>From: Employee #303</div>
                    <div style={{ fontWeight: 'bold' }}>Subject: Request</div>
                </div>

                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', fontFamily: 'serif' }}>
                    {content.map((item, i) => {
                        if (item.type === 'text') return <span key={i}>{item.text}</span>;

                        const isRedacted = redactedIndices.includes(item.id);
                        return (
                            <span
                                key={i}
                                onClick={() => handleRedact(item.id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: isRedacted ? '#000' : 'transparent',
                                    color: isRedacted ? '#000' : 'inherit',
                                    padding: '0 4px',
                                    borderBottom: isRedacted ? 'none' : '1px solid rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s',
                                    userSelect: 'none'
                                }}
                            >
                                {item.text}
                            </span>
                        );
                    })}
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleApprove}
                disabled={!isComplete}
                style={{
                    opacity: isComplete ? 1 : 0.5,
                    cursor: isComplete ? 'pointer' : 'not-allowed'
                }}
            >
                APPROVE DOCUMENT
            </button>

            {isComplete && (
                <div className="mono" style={{ color: '#00af00', fontSize: '0.8rem', marginTop: '10px' }}>
                    SENTIMENT ANALYSIS: CLEAN.
                </div>
            )}
        </div>
    );
};

export default CensorTask;
