import { create } from 'zustand';

// Simple Synth Engine for fallback audio
class SynthEngine {
    constructor() {
        this.ctx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;
        this.masterGain = null;
        if (this.ctx) {
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.5; // Default volume
        }
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playNoise(duration, vol = 0.1) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
    }
}

const synth = new SynthEngine();

export const useAudioStore = create((set, get) => ({
    audioEnabled: true,
    masterVolume: 0.5,
    isInitialized: false,

    initAudio: () => {
        if (synth.ctx && synth.ctx.state === 'suspended') {
            synth.ctx.resume();
        }
        set({ isInitialized: true });
    },

    playSFX: (name) => {
        if (!get().audioEnabled) return;

        // Resume context if needed
        if (synth.ctx && synth.ctx.state === 'suspended') {
            synth.ctx.resume();
        }

        switch (name) {
            case 'click':
                synth.playTone(800, 'sine', 0.1, 0.1);
                break;
            case 'type':
                synth.playTone(1200, 'square', 0.05, 0.05);
                break;
            case 'error':
                synth.playTone(150, 'sawtooth', 0.3, 0.2);
                synth.playTone(100, 'sawtooth', 0.3, 0.2);
                break;
            case 'success':
                synth.playTone(440, 'sine', 0.1, 0.1);
                setTimeout(() => synth.playTone(880, 'sine', 0.2, 0.1), 100);
                break;
            case 'glitch':
                synth.playNoise(0.2, 0.15);
                synth.playTone(50, 'sawtooth', 0.1, 0.2);
                break;
            case 'stamp':
                synth.playNoise(0.1, 0.3);
                synth.playTone(100, 'square', 0.05, 0.2);
                break;
            case 'alarm':
                const now = synth.ctx.currentTime;
                const osc = synth.ctx.createOscillator();
                const gain = synth.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(400, now + 0.5);
                gain.gain.value = 0.1;
                osc.connect(gain);
                gain.connect(synth.masterGain);
                osc.start();
                osc.stop(now + 0.5);
                break;
            default:
                console.warn(`Unknown SFX: ${name}`);
        }
    },

    playAmbient: (name) => {
        // Placeholder for ambient loops
        if (!get().audioEnabled) return;
        console.log(`Playing ambient: ${name}`);
    },

    stopAmbient: () => {
        // Stop logic
    },

    toggleAudio: () => set(state => ({ audioEnabled: !state.audioEnabled })),
}));
