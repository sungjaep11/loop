import React, { useState, useEffect } from 'react';

const AdOverlay = ({ onComplete }) => {
    const [timer, setTimer] = useState(15);
    const [isCreepy, setIsCreepy] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                if (prev === 11) { // Trigger creepy change at 10s left
                    setIsCreepy(true);
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSkip = () => {
        if (timer === 0) onComplete();
    };

    return (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '400px', height: '300px',
            background: '#fff',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            zIndex: 2000,
            border: '1px solid #ccc'
        }}>
            <div style={{ background: '#eee', padding: '5px 10px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Neogen Corp - Sponsor</span>
                <span>{timer > 0 ? `Skip in ${timer}s` : "Skip Ad"}</span>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: isCreepy ? '#000' : '#aaccff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isCreepy ? (
                    <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>I KNOW YOU ARE THERE</div>
                    </div>
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#aaccff', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: '3rem' }}>😊</div>
                        <div style={{ color: '#000', fontWeight: 'bold', marginTop: '10px' }}>Happy Employees Smiling</div>
                    </div>
                )}

                {isCreepy && (
                    <div style={{
                        position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center',
                        color: 'red', fontSize: '1.5rem', fontWeight: 800, textShadow: '0 0 5px black'
                    }}>
                        I SEE YOU
                    </div>
                )}
            </div>

            <button
                onClick={handleSkip}
                disabled={timer > 0}
                style={{
                    padding: '10px',
                    background: timer > 0 ? '#ddd' : '#000',
                    color: timer > 0 ? '#888' : '#fff',
                    border: 'none', cursor: timer > 0 ? 'not-allowed' : 'pointer'
                }}
            >
                {timer > 0 ? "Please Wait..." : "SKIP OBTRUSION"}
            </button>
        </div>
    );
};

export default AdOverlay;
