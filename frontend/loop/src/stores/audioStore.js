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

// Ambient audio element for background music
let ambientAudio = null;
// External CDN URLs (e.g. Pixabay) often return 403 when embedded. Use relative path to self-hosted file or skip.
const AMBIENT_URL = null; // e.g. '/loop/audio/ambient.mp3' if you add a file to public

/** Get the shared AudioContext for TTS playback. Resumes if suspended. Call after user gesture (initAudio) so TTS can play without another click. */
export function getTtsAudioContext() {
    if (typeof window === 'undefined' || !synth.ctx) return null;
    if (synth.ctx.state === 'suspended') synth.ctx.resume();
    return synth.ctx;
}

export const useAudioStore = create((set, get) => ({
    audioEnabled: true,
    masterVolume: 0.5,
    isInitialized: false,
    currentAmbient: null,
    ttsUnlocked: false,

    initAudio: () => {
        if (synth.ctx && synth.ctx.state === 'suspended') {
            synth.ctx.resume();
        }
        // Unlock HTML Audio (for TTS) – one play() from user gesture allows later TTS in the session
        if (typeof window !== 'undefined' && !get().ttsUnlocked) {
            set({ ttsUnlocked: true });
            try {
                const silent = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
                silent.volume = 0;
                silent.play().catch(() => {});
            } catch (_) {}
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
        if (!get().audioEnabled) return;
        const currentAmbient = get().currentAmbient;

        // Don't restart if already playing same ambient
        if (currentAmbient === name && ambientAudio && !ambientAudio.paused) {
            return;
        }

        // Stop existing ambient
        if (ambientAudio) {
            ambientAudio.pause();
            ambientAudio = null;
        }

        console.log(`Playing ambient: ${name}`);

        // Use lo-fi music for workspace/office ambient (only if we have a valid source to avoid 403/CORS)
        if (name === 'officeAmbient' || name === 'lofi' || name === 'workspace') {
            if (AMBIENT_URL) {
                ambientAudio = new Audio(AMBIENT_URL);
                ambientAudio.loop = true;
                ambientAudio.volume = 0.3;
                ambientAudio.play().catch(() => {});
            }
            set({ currentAmbient: name });
        } else if (name === 'fluorescentHum') {
            // Silent for now - could add hum sound later
            set({ currentAmbient: name });
        }
    },

    stopAmbient: () => {
        if (ambientAudio) {
            ambientAudio.pause();
            ambientAudio.currentTime = 0;
            ambientAudio = null;
        }
        set({ currentAmbient: null });
    },

    toggleAudio: () => {
        const newState = !get().audioEnabled;
        if (!newState && ambientAudio) {
            ambientAudio.pause();
        } else if (newState && get().currentAmbient) {
            // Resume ambient if was playing
            get().playAmbient(get().currentAmbient);
        }
        set({ audioEnabled: newState });
    },
}));
