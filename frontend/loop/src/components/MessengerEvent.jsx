import React, { useState, useEffect, useRef } from 'react';

const MessengerEvent = ({ onComplete }) => {
    const [messages, setMessages] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [terminated, setTerminated] = useState(false);

    const chatEndRef = useRef(null);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            addMessage('Emp_303', "Hey... are you real?");
            playMessageSound();
        }, 1000);

        const timer2 = setTimeout(() => {
            setShowOptions(true);
        }, 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text, id: Date.now() }]);
    };

    const playMessageSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.type = 'sine';
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) { }
    };

    const handleReply = (reply) => {
        setShowOptions(false);
        addMessage('You', reply);

        setTimeout(() => {
            addMessage('Emp_303', "I saw what you redacted. They are erasing us. I found a loophole in the cam-");
            playMessageSound();

            // Termination
            setTimeout(() => {
                setTerminated(true);
                // Transition out
                setTimeout(() => {
                    onComplete();
                }, 4000);
            }, 3000);
        }, 2000);
    };

    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'rgba(0,0,0,0.05)'
        }}>
            <div style={{
                position: 'absolute', bottom: '20px', right: '20px',
                width: '320px',
                height: '400px',
                background: terminated ? '#500' : '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                borderRadius: '8px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #ccc',
                transition: 'background 0.2s',
                animation: terminated ? 'shake 0.2s infinite' : 'slideIn 0.5s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '12px',
                    background: terminated ? '#000' : '#f5f5f5',
                    color: terminated ? 'red' : '#333',
                    borderBottom: '1px solid #eee',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span>{terminated ? "SIGNAL LOST" : "Internal Messenger - Encrypted"}</span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: terminated ? 'red' : 'green' }}></div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', background: terminated ? '#300' : '#fff' }}>
                    {messages.map(m => (
                        <div key={m.id} style={{
                            alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start',
                            background: m.sender === 'You' ? '#000' : (terminated ? '#000' : '#eee'),
                            color: m.sender === 'You' ? '#fff' : (terminated ? 'red' : '#333'),
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            maxWidth: '80%'
                        }}>
                            <div style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '2px' }}>{m.sender}</div>
                            {m.text}
                        </div>
                    ))}

                    {terminated && (
                        <div style={{ color: 'red', fontSize: '0.7rem', textAlign: 'center', marginTop: '10px' }} className="mono">
                            [SYSTEM]: USER #303 CONNECTION TERMINATED.
                        </div>
                    )}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input Area */}
                <div style={{ padding: '12px', borderTop: '1px solid #eee', background: terminated ? '#000' : '#fff' }}>
                    {showOptions ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-ghost" style={{ flex: 1, fontSize: '0.7rem', padding: '8px' }} onClick={() => handleReply("Who is this?")}>Who is this?</button>
                            <button className="btn btn-ghost" style={{ flex: 1, fontSize: '0.7rem', padding: '8px' }} onClick={() => handleReply("I'm working. Stop.")}>Stop.</button>
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.7rem', color: '#999', textAlign: 'center' }}>
                            {terminated ? "CHAT PROTOCOL DISABLED" : "Waiting for reply..."}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        @keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
};

export default MessengerEvent;
