import React, { useState, useEffect } from 'react';

const TimeDisplay = () => {
    const [timeStr, setTimeStr] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString());

            const hour = now.getHours();
            // Late night: 00 - 05
            if (hour >= 0 && hour < 5) {
                setComment(`It is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. You should be sleeping. Why are you here?`);
            } else if (hour >= 9 && hour < 18) {
                setComment(`Productivity is peak at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
            } else {
                setComment("");
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9000,
            textAlign: 'right',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            <div className="mono" style={{ fontSize: '0.9rem', color: '#666' }}>{timeStr}</div>
            {comment && (
                <div style={{
                    fontSize: '0.7rem',
                    color: '#00af00',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '4px 8px',
                    marginTop: '4px',
                    borderRadius: '4px'
                }} className="animate-fade-in mono">
                    AIDRA: {comment}
                </div>
            )}
        </div>
    );
};

export default TimeDisplay;
