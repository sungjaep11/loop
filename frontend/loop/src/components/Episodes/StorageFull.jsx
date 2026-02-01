import React, { useState } from 'react';

const StorageFull = ({ onComplete }) => {
    const [files, setFiles] = useState([
        { id: 1, name: "First_Love.jpg", type: "img" },
        { id: 2, name: "Mom_Voice.mp3", type: "audio" },
        { id: 3, name: "Dreams.txt", type: "txt" }
    ]);
    const [guiltText, setGuiltText] = useState("");

    const handleDragStart = (e, file) => {
        e.dataTransfer.setData("fileId", file.id);

        // Guilt trip text
        if (file.name.includes("Mom")) setGuiltText("Don't do this!");
        else if (file.name.includes("Love")) setGuiltText("Please no...");
        else setGuiltText("I'm scared!");
    };

    const handleDragEnd = () => {
        setGuiltText("");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const fileId = parseInt(e.dataTransfer.getData("fileId"));
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setGuiltText(""); // Clear guilt text

        // Play "trash" sound (reused)
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 100;
            osc.type = 'sawtooth';
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) { }

        if (files.length === 1) { // Last file just deleted
            setTimeout(onComplete, 1000);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000
        }}>
            <div className="glass-panel" style={{ width: '500px', padding: '30px', background: '#333', color: '#fff' }}>
                <div style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>
                    WARNING: STORAGE CRITICAL
                </div>
                <div style={{ marginBottom: '20px' }}>
                    Immediate optimization required. Delete personal data to free up space for Corporate Assets.
                </div>

                <div style={{
                    display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px',
                    minHeight: '100px'
                }}>
                    {files.map(f => (
                        <div
                            key={f.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, f)}
                            onDragEnd={handleDragEnd}
                            style={{
                                width: '80px', height: '100px',
                                background: '#eee', color: '#000',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'grab',
                                borderRadius: '8px',
                                animation: 'shake 0.5s infinite'
                            }}
                        >
                            <div style={{ fontSize: '2rem' }}>📄</div>
                            <div style={{ fontSize: '0.6rem', padding: '4px', textAlign: 'center' }}>{f.name}</div>
                        </div>
                    ))}
                </div>

                {guiltText && (
                    <div style={{
                        position: 'absolute', top: '40%', width: '100%',
                        textAlign: 'center', color: 'red', fontSize: '1.5rem', fontWeight: 'bold',
                        textShadow: '0 0 10px red', pointerEvents: 'none'
                    }}>
                        {guiltText}
                    </div>
                )}

                {/* Trash Zone */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    style={{
                        height: '100px',
                        border: '2px dashed #ff4444',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: '#ff4444',
                        background: 'rgba(50,0,0,0.5)'
                    }}
                >
                    DRAG HERE TO DELETE PERMANENTLY
                </div>
            </div>
            <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
        </div>
    );
};

export default StorageFull;
