import React, { useEffect } from 'react';
import { GameController } from './components/GameController';
import { useGameStore } from './stores/gameStore';
import { usePlayerStore } from './stores/playerStore';

function App() {
  const setSessionStartTime = useGameStore((state) => state.setSessionStartTime);
  const collectSystemInfo = usePlayerStore((state) => state.collectSystemInfo);

  // Initialize game state on mount
  useEffect(() => {
    document.title = 'S.A.V.E. - Employee Portal';
    setSessionStartTime(); // Start play-time tracking
    collectSystemInfo(); // For MirrorScene "We know you" reveal

    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [setSessionStartTime, collectSystemInfo]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      <GameController />

      {/* Global CSS Scanline Overlay */}
      <div className="scan-line"></div>
    </div>
  );
}

export default App;
