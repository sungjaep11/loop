import React, { useEffect, useState } from 'react';

const EmailTrap = ({ onComplete }) => {
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                triggerTrap();
            }
        };

        // Fake Address Bar input listener handled inline
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const triggerTrap = () => {
        if (triggered) return;
        setTriggered(true);
        alert("SECURITY AUDIT FAILED. PHISHING ATTEMPT DETECTED.");
        // Deduct Score Logic here?
        setTimeout(onComplete, 1000);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000
        }}>
            <div className="glass-panel" style={{ width: 'min(380px, 92vw)', height: 'min(260px, 75vh)', maxWidth: '92vw', maxHeight: '75vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                {/* Fake Browser Headers */}
                <div style={{ padding: '6px 8px', background: '#ddd', borderBottom: '1px solid #ccc', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e', flexShrink: 0 }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c940', flexShrink: 0 }}></div>
                    <input
                        type="text"
                        placeholder="https://mail.neogen.corp/inbox"
                        onChange={() => triggerTrap()} // Instant trap on typing
                        style={{ flex: 1, minWidth: 0, marginLeft: '10px', padding: '2px 6px', fontSize: '0.7rem' }}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                    <div style={{ width: '90px', flexShrink: 0, background: '#f5f5f5', borderRight: '1px solid #eee', padding: '6px 8px', fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Inbox (1)</div>
                        <div style={{ color: '#00af00' }}>Corporate</div>
                        <div>Spam</div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 12px', minWidth: 0, overflow: 'auto' }}>
                        <div style={{ fontSize: '0.95rem', marginBottom: '6px' }}>(No Subject)</div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '10px' }}>From: Unknown Sender</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: '1.4' }}>
                            Don't trust VERA.<br />
                            Press <b>F12</b> to see the truth.<br />
                            Type <b>HELP</b> in the address bar above.
                        </div>
                    </div>
                </div>

                <button className="btn" onClick={onComplete} style={{ margin: '6px 8px', alignSelf: 'flex-end', fontSize: '0.75rem', padding: '4px 10px' }}>Include as Spam</button>
            </div>
        </div>
    );
};

export default EmailTrap;
