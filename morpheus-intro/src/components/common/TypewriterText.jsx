import React, { useState, useEffect } from 'react';

export const TypewriterText = ({ text, speed = 50, delay = 0, className = '', onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout;
    let interval;

    if (text) {
      setDisplayedText('');

      timeout = setTimeout(() => {
        setIsTyping(true);
        let currentIndex = 0;

        interval = setInterval(() => {
          if (currentIndex < text.length) {
            setDisplayedText(prev => prev + text[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            if (onComplete) onComplete();
          }
        }, speed);
      }, delay);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="cursor-blink">_</span>}
      <style>{`
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};
