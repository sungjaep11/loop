import React, { useState, useEffect } from 'react';

const SystemUpdate = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [updating, setUpdating] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUpdating(false);
                    applyFleshTheme();
                    setTimeout(onComplete, 2000);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const applyFleshTheme = () => {
        const style = document.createElement('style');
        style.id = 'flesh-theme';
        style.innerHTML = `
      body {
        background-color: #f9e4b7 !important;
        background-image: ur("data:image/svg+xml;utf8,<svg ...>") !important; /* texture? */
        font-family: 'Courier New', cursive !important;
      }
      .btn, button {
        border-radius: 50% !important;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.2) !important;
        background: #e8c4a0 !important;
        color: #500 !important;
        border: 1px solid #dba !important;
      }
      .glass-panel {
        background: rgba(255, 240, 220, 0.8) !important;
        border: 1px solid #e8c4a0 !important;
      }
      /* More gross details could go here */
    `;
        document.head.appendChild(style);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: '#000', color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000
        }}>
            <h2 style={{ fontFamily: 'monospace' }}>SYSTEM UPDATE 2.0</h2>
            <div style={{ width: '300px', height: '20px', border: '1px solid #fff', marginTop: '20px' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#fff' }}></div>
            </div>
            <div className="mono" style={{ marginTop: '10px' }}>{progress}% - Installing Organic Drivers...</div>
        </div>
    );
};

export default SystemUpdate;
