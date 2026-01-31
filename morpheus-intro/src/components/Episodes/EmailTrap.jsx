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
            <div className="glass-panel" style={{ width: '600px', height: '400px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                {/* Fake Browser Headers */}
                <div style={{ padding: '10px', background: '#ddd', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c940' }}></div>
                    <input
                        type="text"
                        placeholder="https://mail.neogen.corp/inbox"
                        onChange={() => triggerTrap()} // Instant trap on typing
                        style={{ flex: 1, marginLeft: '20px', padding: '2px 5px', fontSize: '0.8rem' }}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex' }}>
                    <div style={{ width: '150px', background: '#f5f5f5', borderRight: '1px solid #eee', padding: '10px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Inbox (1)</div>
                        <div style={{ color: '#00af00' }}>Corporate</div>
                        <div>Spam</div>
                    </div>
                    <div style={{ flex: 1, padding: '20px' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>(No Subject)</div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>From: Unknown Sender</div>
                        <div style={{ fontFamily: 'monospace', lineHeight: '1.5' }}>
                            Don't trust AIDRA.<br />
                            Press <b>F12</b> to see the truth.<br />
                            Type <b>HELP</b> in the address bar above.
                        </div>
                    </div>
                </div>

                <button className="btn" onClick={onComplete} style={{ margin: '10px', alignSelf: 'flex-end' }}>Include as Spam</button>
            </div>
        </div>
    );
};

export default EmailTrap;
