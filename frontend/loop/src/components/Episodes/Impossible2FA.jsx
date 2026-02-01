import React, { useState } from 'react';

const Impossible2FA = ({ onComplete }) => {
    const [code, setCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code === "DO_NOT_LEAVE") {
            alert("Authentication success. Stay logged in forever.");
            onComplete();
        } else {
            alert("Incorrect code.");
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 3000
        }}>
            <div className="glass-panel" style={{ width: '350px', background: '#fff', padding: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Two-Factor Authentication</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Enter the verification code sent to your device to logout.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Code"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        style={{ width: '100%', padding: '10px', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px', marginBottom: '20px' }}
                    />
                    <button className="btn btn-primary" style={{ width: '100%' }}>Verify</button>
                </form>

                {/* Fake Phone */}
                <div style={{
                    position: 'absolute', bottom: '50px', right: '50px',
                    width: '200px', height: '350px',
                    background: '#111', borderRadius: '20px',
                    border: '5px solid #333',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    animation: 'vibrate 0.5s infinite'
                }}>
                    <div style={{ width: '90%', height: '90%', background: '#000', color: '#fff', padding: '10px', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Messages</div>
                        <div style={{ marginTop: '20px', background: '#333', padding: '10px', borderRadius: '10px' }}>
                            <div>NeogenAuth:</div>
                            <div style={{ fontSize: '1.2rem', color: '#00ff00', marginTop: '5px' }}>Code: DO_NOT_LEAVE</div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`@keyframes vibrate { 0% { transform: translate(0,0); } 25% { transform: translate(2px, 2px); } 50% { transform: translate(-2px, -2px); } 75% { transform: translate(-2px, 2px); } 100% { transform: translate(2px, -2px); } }`}</style>
        </div>
    );
};

export default Impossible2FA;
