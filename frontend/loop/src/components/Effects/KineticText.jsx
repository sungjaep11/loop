import React, { useEffect, useState } from 'react';

/**
 * Parses text with tags like [Angry]Hello[/Angry] or simple [Angry] tags.
 * For simplicity, we will assume the input text might contain tags like [Angry]... text
 * or we can wrap specific parts.
 * 
 * Simple implementation: 
 * - [Angry]: Shake, Red
 * - [Whisper]: Small, Gray, Fade In
 * - [Glitch]: Random chars replacement
 */
const KineticText = ({ text }) => {
  // We'll split by tags if they wrap, or just apply to the whole block if it starts with a tag for now?
  // User spec: "If text is tagged [Angry], apply..."
  // Let's support regex parsing for simple tags at the start of the string or wrapping.
  
  // Let's implement a simple parser that splits string by tags.
  // Example: "Normal text. [Angry]I am mad![/Angry] Normal again."
  // Or just "[Angry] Whole message [/Angry]" as requested often.
  
  // Let's try basic regex splitting.
  const parts = text.split(/(\[(?:Angry|Whisper|Glitch)\][^\[]+\[\/(?:Angry|Whisper|Glitch)\])/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('[Angry]')) {
            const content = part.replace(/\[\/?Angry\]/g, '');
            return <span key={i} className="kinetic-angry">{content}</span>;
        } else if (part.startsWith('[Whisper]')) {
            const content = part.replace(/\[\/?Whisper\]/g, '');
            return <span key={i} className="kinetic-whisper">{content}</span>;
        } else if (part.startsWith('[Glitch]')) {
            const content = part.replace(/\[\/?Glitch\]/g, '');
            return <GlitchSpan key={i} text={content} />;
        } else {
            return <span key={i}>{part}</span>;
        }
      })}
      <style>{`
        .kinetic-angry {
            color: #ff3333;
            display: inline-block;
            animation: shakeText 0.1s infinite;
            font-weight: bold;
        }
        .kinetic-whisper {
            color: #888;
            font-size: 0.8em;
            opacity: 0;
            animation: fadeInSlow 2s forwards;
        }
        @keyframes shakeText {
            0% { transform: translate(0, 0); }
            25% { transform: translate(1px, 1px); }
            50% { transform: translate(-1px, -1px); }
            75% { transform: translate(1px, -1px); }
            100% { transform: translate(-1px, 1px); }
        }
        @keyframes fadeInSlow {
            to { opacity: 1; }
        }
      `}</style>
    </span>
  );
};

const GlitchSpan = ({ text }) => {
    const [display, setDisplay] = useState(text);
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                const chars = text.split('');
                const glitchIndex = Math.floor(Math.random() * chars.length);
                chars[glitchIndex] = "#?@!&"[Math.floor(Math.random() * 5)];
                setDisplay(chars.join(''));
                setTimeout(() => setDisplay(text), 100);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [text]);

    return <span style={{ fontFamily: 'monospace', color: '#0f0' }}>{display}</span>;
};

export default KineticText;
