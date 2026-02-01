import React, { useEffect } from 'react';
import { GameController } from './components/GameController';
import { useGameStore } from './stores/gameStore';

function App() {
  const startGame = useGameStore((state) => state.startGame);

  // Initialize game state on mount if needed, or rely on OpeningSequence to trigger start
  useEffect(() => {
    // Optional: Preload assets or handle global events here
    document.title = 'NEOGEN CORP. - Employee Portal';

    // Prevent default context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      <GameController />

      {/* Global CSS Scanline Overlay */}
      <div className="scan-line"></div>
    </div>
  );
}

export default App;
