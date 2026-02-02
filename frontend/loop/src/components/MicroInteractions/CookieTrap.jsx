import React, { useState } from 'react';

const CookieTrap = () => {
    const [visible, setVisible] = useState(true);
    const [rejectStyle, setRejectStyle] = useState({});

    if (!visible) return null;

    const moveReject = () => {
        const x = Math.random() * 100 - 50;
        const y = Math.random() * 50 - 25;
        setRejectStyle({
            transform: `translate(${x}px, ${y}px)`,
            transition: 'all 0.2s'
        });
    };

    const handleAccept = () => {
        setVisible(false);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: '#eee',
            color: '#000',
            padding: '20px',
            borderTop: '1px solid #ccc',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem'
        }}>
            <div style={{ fontWeight: 600 }}>We use cookies to optimize your workflow and <span style={{ textDecoration: 'line-through' }}>Permanent Memory Deletion</span> personalization.</div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <label><input type="checkbox" checked disabled /> Marketing</label>
                <label><input type="checkbox" checked disabled /> Surveillance</label>
                <label><input type="checkbox" checked disabled /> Childhood Memories</label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn btn-primary" onClick={handleAccept} style={{ padding: '8px 16px', fontSize: '0.7rem' }}>
                    Accept All
                </button>
                <button
                    className="btn btn-ghost"
                    onMouseEnter={moveReject}
                    style={{ padding: '8px 16px', fontSize: '0.7rem', ...rejectStyle }}
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default CookieTrap;
