import { useEffect } from 'react';
import { useAudioStore } from '../stores/audioStore';

export function useAudio() {
  const playSFX = useAudioStore(state => state.playSFX);
  const initAudio = useAudioStore(state => state.initAudio);

  // Auto-init on click
  useEffect(() => {
    const handleInteract = () => {
      initAudio();
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };

    window.addEventListener('click', handleInteract);
    window.addEventListener('keydown', handleInteract);

    return () => {
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };
  }, [initAudio]);

  return { playSFX };
}
