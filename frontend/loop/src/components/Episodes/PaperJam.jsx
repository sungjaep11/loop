import React, { useState } from 'react';

const PaperJam = ({ onComplete }) => {
    const [cancelPos, setCancelPos] = useState({ x: 0, y: 0 });

    const runAway = () => {
        setCancelPos({
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100
        });
    };

    const handlePrint = () => {
        // Play grind sound
        alert("*GRINDING NOISES*");
        onComplete();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{ width: '600px', height: '400px', background: '#ccc', display: 'flex', boxShadow: '5px 5px 10px #000' }}>
                <div style={{ width: '200px', background: '#fff', padding: '20px', borderRight: '1px solid #999' }}>
                    <h4>Print</h4>
                    <div style={{ marginBottom: '10px' }}>Printer: <b>Tray 2 (Jam)</b></div>
                    <div style={{ marginBottom: '10px' }}>Copies: 1</div>
                    <div style={{ marginBottom: '10px' }}>Pages: All</div>

                    <button className="btn" onClick={handlePrint} style={{ marginTop: '200px', width: '100%' }}>Print</button>
                    <button
                        className="btn"
                        onMouseEnter={runAway}
                        style={{
                            marginTop: '10px',
                            width: '100%',
                            transform: `translate(${cancelPos.x}px, ${cancelPos.y}px)`,
                            transition: 'transform 0.1s'
                        }}
                    >
                        Cancel
                    </button>
                </div>
                <div style={{ flex: 1, background: '#888', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '210mm', height: '297mm', background: '#fff', boxShadow: '0 0 5px #000', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333', fontSize: '2rem', fontWeight: 'bold' }}>
                            ROOM VIEW
                        </div>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            color: 'rgba(255,255,255,0.1)', fontSize: '5rem', fontWeight: 'bold'
                        }}>
                            BEHIND YOU
                        </div>
                        <div style={{
                            position: 'absolute', bottom: '10px', left: '10px',
                            background: 'red', color: '#fff', padding: '5px'
                        }}>
                            ERROR: TRAY 2 JAM. CHECK DOOR.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaperJam;
