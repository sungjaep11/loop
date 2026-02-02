import React, { useState, useEffect } from 'react';

const SalaryCounter = () => {
    const [salary, setSalary] = useState(1250.00);
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let idleTimer;
        let deductInterval;

        const resetIdle = () => {
            setIsIdle(false);
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setIsIdle(true), 3000);
        };

        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('keydown', resetIdle);

        // Initial start
        resetIdle();

        return () => {
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('keydown', resetIdle);
            clearTimeout(idleTimer);
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isIdle) {
            interval = setInterval(() => {
                setSalary(prev => Math.max(0, prev - 0.10));
                // Beep sound logic could go here
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isIdle]);

    return (
        <div className="glass-panel" style={{
            position: 'absolute',
            top: '20px', left: '20px',
            padding: '12px',
            display: 'flex', flexDirection: 'column'
        }}>
            <div className="mono" style={{ fontSize: '0.7rem', color: '#666' }}>ESTIMATED SALARY</div>
            <div className="mono" style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: isIdle ? 'red' : '#000',
                transition: 'color 0.2s'
            }}>
                ${salary.toFixed(2)}
            </div>
            {isIdle && (
                <div style={{ fontSize: '0.6rem', color: 'red', animation: 'flash 0.5s infinite' }}>
                    IDLE DEDUCTION ACTIVE
                </div>
            )}
            <style>{`@keyframes flash { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
        </div>
    );
};

export default SalaryCounter;
