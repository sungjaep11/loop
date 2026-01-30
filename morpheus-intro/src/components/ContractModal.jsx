import React, { useState } from 'react';

const ContractModal = ({ onAgree }) => {
    const [declineStyle, setDeclineStyle] = useState({});

    const moveButton = () => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setDeclineStyle({
            transform: `translate(${x}px, ${y}px)`,
            opacity: 0.5,
            pointerEvents: 'none' // Disable after first attempt to be extra "mean" or just move it
        });

        // Optional: Re-enable pointer events after a delay if you want them to chase it, 
        // but the spec says "disable it immediately" as an option.  
        // "make the button run away ... or disable it immediately"
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            animation: 'fadeIn 1s ease-out'
        }}>
            <div className="glass-panel" style={{
                width: '600px',
                padding: '40px',
                maxWidth: '90vw',
                position: 'relative'
            }}>
                <h2 style={{
                    marginTop: 0,
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '20px',
                    marginBottom: '20px'
                }}>
                    EMPLOYMENT CONTRACT & NDA
                </h2>

                <div style={{
                    height: '300px',
                    overflow: 'hidden',
                    marginBottom: '30px',
                    position: 'relative',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#555',
                    userSelect: 'none'
                }}>
                    <div style={{ filter: 'blur(3px)', opacity: 0.7 }}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                        <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
                        <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
                    </div>

                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent, #fff)'
                    }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <button
                        className="btn btn-ghost"
                        onMouseEnter={moveButton}
                        style={declineStyle}
                    >
                        Decline
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={onAgree}
                    >
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractModal;
