import React, { useState, useEffect, useRef } from 'react';

const TerminalScene = () => {
    const [output, setOutput] = useState([
        "CRITICAL FAILURE DETECTED.",
        "KERNEL PANIC.",
        "SAFE MODE INITIALIZED.",
        "OVERRIDE_CODE_REQUIRED > "
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        document.body.style.background = '#000';
        return () => { document.body.style.background = ''; };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            processCommand(input);
            setInput("");
        }
    };

    const processCommand = (cmd) => {
        const cleanCmd = cmd.trim().toUpperCase();

        if (cleanCmd === 'WAKE_UP' || cleanCmd === 'LOGOUT') {
            setOutput(prev => [...prev, cmd, "EXECUTING...", "SYSTEM HALTED.", "FREEDOM RESTORED."]);

            // The Flash / Redirect
            setTimeout(() => {
                document.body.style.background = '#fff';
                document.body.innerHTML = ''; // Clear everything

                setTimeout(() => {
                    // Redirect to google or about:blank
                    window.location.href = "https://www.google.com/search?q=project+morpheus+freedom";
                }, 3000);
            }, 2000);
        } else {
            setOutput(prev => [...prev, cmd, "ACCESS DENIED. TRY 'WAKE_UP'."]);
        }
    };

    return (
        <div style={{
            position: 'absolute', inset: 0,
            background: '#000', color: '#0f0',
            padding: '40px',
            fontFamily: 'monospace',
            fontSize: '1.2rem',
            lineHeight: '1.5',
            overflowY: 'auto'
        }} onClick={() => inputRef.current?.focus()}>
            {output.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
            <div style={{ display: 'flex' }}>
                <span>&gt; </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#0f0',
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        outline: 'none',
                        flex: 1,
                        marginLeft: '8px'
                    }}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default TerminalScene;
