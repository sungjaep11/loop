import React, { useState } from 'react';

const MirrorSite = ({ onComplete }) => {
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: '#fff', color: '#000',
            zIndex: 2000, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4285f4', marginRight: '20px' }}>Noogle</div>
                <form onSubmit={handleSearch} style={{ flex: 1 }}>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ width: '80%', padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
                        placeholder="Search the web..."
                    />
                </form>
                <button onClick={onComplete} className="btn-ghost">X</button>
            </div>

            <div style={{ flex: 1, padding: '40px', maxWidth: '800px' }}>
                {showResults ? (
                    <div className="animate-fade-in">
                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '20px' }}>About 0 results (0.00 seconds)</div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: '#1a0dab', fontSize: '1.2rem', cursor: 'pointer' }}>Breaking News: Man trapped in room stares at monitor</div>
                            <div style={{ color: '#006621', fontSize: '0.9rem' }}>www.news.local/breaking</div>
                            <div style={{ color: '#545454', fontSize: '0.9rem' }}>Authorities say the subject has been sitting there for days...</div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: '#1a0dab', fontSize: '1.2rem', cursor: 'pointer' }}>Psychology: Why you can't leave your desk</div>
                            <div style={{ color: '#006621', fontSize: '0.9rem' }}>www.pysch.health/syndrome</div>
                            <div style={{ color: '#545454', fontSize: '0.9rem' }}>Stockholm syndrome in corporate environments is rising...</div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: '#1a0dab', fontSize: '1.2rem', cursor: 'pointer' }}>Neogen Corp Stock rises 500%</div>
                            <div style={{ color: '#006621', fontSize: '0.9rem' }}>www.market.watch/neogen</div>
                            <div style={{ color: '#545454', fontSize: '0.9rem' }}>Productivity updates have yielded maximum efficiency...</div>
                        </div>

                        <div style={{ marginTop: '40px', color: 'red', fontStyle: 'italic' }}>
                            VERA: "There is no 'outside'. This is your world now."
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '100px', color: '#ccc' }}>
                        Type anything to search the "Internet".
                    </div>
                )}
            </div>
        </div>
    );
};

export default MirrorSite;
