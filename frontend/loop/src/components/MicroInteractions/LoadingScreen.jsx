import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ text }) => {
    const [displayText, setDisplayText] = useState("Loading...");

    const snarkyTexts = [
        "Measuring your patience...",
        "Suppressing your resistance...",
        "Deleting hope...",
        "Calculating escape probability: 0%...",
        "Syncing with Neural Link...",
        "Purging free will..."
    ];

    useEffect(() => {
        setDisplayText(snarkyTexts[Math.floor(Math.random() * snarkyTexts.length)]);
    }, []);

    return (
        <div className="fullscreen-center" style={{ background: '#000', color: '#fff', zIndex: 9999 }}>
            <div className="mono" style={{ fontSize: '1.2rem', animation: 'pulse 1s infinite' }}>
                {displayText}
            </div>
        </div>
    );
};

export default LoadingScreen;
