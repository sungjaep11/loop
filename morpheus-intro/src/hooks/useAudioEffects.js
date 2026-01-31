import { useRef, useEffect, useCallback } from 'react';

const useAudioEffects = () => {
    const audioCtx = useRef(null);
    const gainNode = useRef(null);
    const filterNode = useRef(null);

    useEffect(() => {
        // Init context on first user interaction usually, but let's try to set it up.
        // For a real game loop we'd route all audio through this context.
        // For now, we will just create independent oscillators for the "Tinnitus" sound.
        // The "Muffling" part is tricky without routing existing DOM Audio elements into Web Audio.
        // We'll simulate Tinnitus by playing the sound overlay.
        return () => {
            if (audioCtx.current) audioCtx.current.close();
        };
    }, []);

    const triggerTinnitus = useCallback(() => {
        try {
            if (!audioCtx.current) {
                audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioCtx.current;
            
            // 1. High pitched sine wave
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(8000, ctx.currentTime); // 8kHz beep
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1); // Fade in
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5); // Fade out over 5s
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 5);

            // 2. Muffle Effect Sim (Low Pass) - This would need a source node. 
            // Since we can't easily hijack all DOM audio without CORS or refactoring,
            // we will simulate the "silence" by just playing the tinnitus 
            // and maybe overlaying a low-pass noise if possible.
            // For now, the tinnitus beep is the key indicator for "Shell Shock".
            
        } catch(e) {
            console.error("Audio API error", e);
        }
    }, []);

    return { triggerTinnitus };
};

export default useAudioEffects;
