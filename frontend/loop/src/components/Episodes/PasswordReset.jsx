import React, { useState } from 'react';

const PasswordReset = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [val, setVal] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 0) {
            if (!/[!@#$%^&*]/.test(val)) {
                setError("Must include a special character.");
            } else {
                setStep(1);
                setVal("");
                setError("Password updated. New requirement involved.");
            }
        } else if (step === 1) {
            // Just fail arbitrarily once if short, then pass? Or just require "street" text?
            // Let's just pass to step 2 after any input length > 3
            if (val.length < 3) {
                setError("Must include your childhood street name.");
            } else {
                setStep(2);
                setVal("");
                setError("Password updated.");
            }
        } else if (step === 2) {
            // Regret
            if (val.length < 2) {
                setError("Must include your biggest regret.");
            } else {
                // Finish
                onComplete();
            }
        }
    };

    const getLabel = () => {
        if (step === 0) return "New Password";
        if (step === 1) return "Childhood Street Name";
        if (step === 2) return "Biggest Regret";
        return "";
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000
        }}>
            <div className="glass-panel" style={{ width: '400px', padding: '30px', background: '#fff', color: '#000' }}>
                <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Security Policy Update</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Your password has expired. Please update it immediately.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{getLabel()}</label>
                    <input
                        type="text"
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc' }}
                        autoFocus
                    />
                    {error && <div style={{ color: 'red', fontSize: '0.8rem' }}>{error}</div>}

                    <button className="btn btn-primary" type="submit">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
