import React, { useState } from 'react';

const ReviewPopup = ({ onClose }) => {
    const [rating, setRating] = useState(0);

    const handleStarHover = (idx) => {
        if (idx < 4) {
            // Logic handled in CSS/Render or simple state
            // For simplicity, we just make them unclickable or red in render
        }
    };

    const handleRate = (idx) => {
        if (idx === 4) { // 5th star (0-indexed logic or 1-indexed? let's use 1-idx for loop)
            alert("Thank you. Your loyalty is noted.");
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px',
            background: '#fff', padding: '20px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            borderRadius: '8px', zIndex: 10000,
            width: '300px',
            animation: 'slideUp 0.5s ease-out'
        }}>
            <div style={{ fontWeight: 600, marginBottom: '10px' }}>How do you like working with VERA?</div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '1.5rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star, i) => (
                    <span
                        key={i}
                        onMouseEnter={() => handleStarHover(i)}
                        onClick={() => handleRate(i)}
                        style={{
                            color: i === 4 ? '#ffd700' : '#ddd',
                            transform: i < 4 ? 'rotate(180deg)' : 'none', // Broken stars
                            opacity: i < 4 ? 0.3 : 1
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
    );
};

export default ReviewPopup;
