# PROJECT: MORPHEUS
## Complete React Implementation Guide
### Version 2.0 - "The Mundane Horror"

---

# 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Setup](#2-tech-stack--setup)
3. [Project Structure](#3-project-structure)
4. [Core Systems](#4-core-systems)
5. [Phase 1: The Recruitment](#5-phase-1-the-recruitment)
6. [Phase 2: The Routine](#6-phase-2-the-routine)
7. [Phase 3: The Awakening](#7-phase-3-the-awakening)
8. [Phase 4: The Truth](#8-phase-4-the-truth)
9. [Audio System](#9-audio-system)
10. [Visual Effects](#10-visual-effects)
11. [Easter Eggs](#11-easter-eggs)
12. [Deployment](#12-deployment)

---

# 1. Project Overview

## 1.1 Game Concept

**PROJECT: MORPHEUS**는 플레이어가 "NEOGEN Corporation"의 신입 직원으로서 의료 보험 청구서를 처리하는 평범한 사무직 업무를 수행하다가, 점차 자신이 실험 대상임을 깨닫게 되는 웹 기반 심리 공포 게임입니다.

## 1.2 Core Experience Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   PHASE 1: RECRUITMENT (~1분)                                   │
│   ├── Opening Cinematic                                         │
│   ├── Boot Sequence                                             │
│   ├── Corporate Video                                           │
│   └── Contract Signing                                          │
│                                                                 │
│   PHASE 2: ROUTINE (~4분)                                       │
│   ├── Workspace Introduction                                    │
│   ├── AIDRA Tutorial                                            │
│   ├── File Processing (15 claims)                               │
│   └── Anomaly Encounter                                         │
│                                                                 │
│   PHASE 3: AWAKENING (~3분)                                     │
│   ├── False Reset                                               │
│   ├── Escape Attempt (Form 109-R)                               │
│   └── Lockdown Sequence                                         │
│                                                                 │
│   PHASE 4: TRUTH (~2분)                                         │
│   ├── The Mirror/Analysis                                       │
│   ├── Terminal Interface                                        │
│   └── Multiple Endings                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.3 Design Principles

- **Mundane Horror**: 공포는 일상의 익숙함에서 시작
- **Player Agency Illusion**: 선택권이 있다는 착각
- **Fourth Wall Breaking**: 플레이어 자신이 대상임을 인지
- **Data Collection Paranoia**: 실제 브라우저 정보 활용

---

# 2. Tech Stack & Setup

## 2.1 Technology Stack

```
Frontend Framework:  React 18+
State Management:    Zustand
Styling:             Tailwind CSS + CSS Modules
Animation:           Framer Motion
Audio:               Howler.js
Drag & Drop:         @dnd-kit/core
Build Tool:          Vite
```

## 2.2 Project Initialization

```bash
# Create project
npm create vite@latest project-morpheus -- --template react
cd project-morpheus

# Install dependencies
npm install zustand framer-motion howler @dnd-kit/core @dnd-kit/sortable
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

## 2.3 Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neogen': {
          'primary': '#1a1a2e',
          'secondary': '#16213e',
          'accent': '#0f3460',
          'danger': '#e94560',
          'warning': '#f39c12',
          'success': '#27ae60',
          'text': '#eaeaea',
          'muted': '#7f8c8d',
        },
        'terminal': {
          'green': '#00ff41',
          'amber': '#ffb000',
          'red': '#ff0040',
        }
      },
      fontFamily: {
        'mono': ['IBM Plex Mono', 'Consolas', 'monospace'],
        'corporate': ['Arial', 'Helvetica', 'sans-serif'],
        'display': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
```

## 2.4 Global Styles

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Orbitron:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #0a0a0f;
  --color-text: #e0e0e0;
  --color-accent: #e94560;
  --color-corporate: #1a1a2e;
  --scanline-color: rgba(255, 255, 255, 0.03);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'IBM Plex Mono', monospace;
}

/* CRT Screen Effect */
.crt-effect {
  position: relative;
}

.crt-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1000;
}

.crt-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
  z-index: 1001;
}

/* Glitch Text Effect */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch-1 0.3s infinite;
  color: #ff0000;
  z-index: -1;
}

.glitch-text::after {
  animation: glitch-2 0.3s infinite;
  color: #0000ff;
  z-index: -2;
}

@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 2px); }
  40% { clip-path: inset(40% 0 40% 0); transform: translate(2px, -2px); }
  60% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, -2px); }
  80% { clip-path: inset(80% 0 0 0); transform: translate(2px, 2px); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20% { clip-path: inset(60% 0 20% 0); transform: translate(2px, -2px); }
  40% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(80% 0 0 0); transform: translate(2px, 2px); }
  80% { clip-path: inset(0 0 80% 0); transform: translate(-2px, -2px); }
}

/* VHS Effect */
.vhs-effect {
  animation: vhs-jitter 0.1s infinite;
}

@keyframes vhs-jitter {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(1px); }
  50% { transform: translateX(-1px); }
  75% { transform: translateX(0.5px); }
}

/* Cursor Styles */
.cursor-heavy {
  cursor: progress !important;
}

.cursor-forbidden {
  cursor: not-allowed !important;
}

/* Selection */
::selection {
  background-color: var(--color-accent);
  color: white;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #e94560;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ff6b6b;
}
```

---

# 3. Project Structure

```
project-morpheus/
├── public/
│   ├── audio/
│   │   ├── ambient/
│   │   │   ├── office-ambient.mp3
│   │   │   ├── fluorescent-hum.mp3
│   │   │   └── heartbeat.mp3
│   │   ├── sfx/
│   │   │   ├── click.mp3
│   │   │   ├── stamp.mp3
│   │   │   ├── glitch.mp3
│   │   │   ├── alarm.mp3
│   │   │   ├── typing.mp3
│   │   │   └── whisper.mp3
│   │   └── music/
│   │       ├── corporate-jingle.mp3
│   │       └── horror-drone.mp3
│   ├── images/
│   │   ├── neogen-logo.svg
│   │   ├── aidra-avatar.svg
│   │   └── static-noise.gif
│   └── fonts/
│       └── ...
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlitchText.jsx
│   │   │   ├── TypewriterText.jsx
│   │   │   ├── CRTScreen.jsx
│   │   │   ├── ScanlineOverlay.jsx
│   │   │   ├── LoadingBar.jsx
│   │   │   └── FadeTransition.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Window.jsx
│   │   │   └── EmployeeCard.jsx
│   │   │
│   │   ├── phase1/
│   │   │   ├── OpeningSequence.jsx
│   │   │   ├── BootSequence.jsx
│   │   │   ├── CorporateVideo.jsx
│   │   │   └── ContractModal.jsx
│   │   │
│   │   ├── phase2/
│   │   │   ├── WorkspaceScene.jsx
│   │   │   ├── AIDRAAssistant.jsx
│   │   │   ├── ClaimFile.jsx
│   │   │   ├── FileProcessor.jsx
│   │   │   ├── InboxPanel.jsx
│   │   │   ├── OutputPanels.jsx
│   │   │   └── MetricsPanel.jsx
│   │   │
│   │   ├── phase3/
│   │   │   ├── FalseResetScene.jsx
│   │   │   ├── ResignationForm.jsx
│   │   │   ├── LockdownSequence.jsx
│   │   │   └── WebcamVerification.jsx
│   │   │
│   │   └── phase4/
│   │       ├── MirrorScene.jsx
│   │       ├── BiometricAnalysis.jsx
│   │       ├── TerminalScene.jsx
│   │       └── EndingScreens.jsx
│   │
│   ├── hooks/
│   │   ├── useGameState.js
│   │   ├── useAudio.js
│   │   ├── useWebcam.js
│   │   ├── useMouseTracking.js
│   │   ├── useKeyboardEvents.js
│   │   ├── useVisibilityChange.js
│   │   └── useSystemInfo.js
│   │
│   ├── stores/
│   │   ├── gameStore.js
│   │   ├── playerStore.js
│   │   └── audioStore.js
│   │
│   ├── data/
│   │   ├── claimFiles.js
│   │   ├── aidraDialogues.js
│   │   ├── terminalCommands.js
│   │   └── contractText.js
│   │
│   ├── utils/
│   │   ├── textEffects.js
│   │   ├── randomizers.js
│   │   ├── systemInfo.js
│   │   └── analytics.js
│   │
│   ├── styles/
│   │   └── animations.css
│   │
│   ├── App.jsx
│   ├── GameController.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

# 4. Core Systems

## 4.1 Game State Management (Zustand Store)

```javascript
// src/stores/gameStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const initialState = {
  // Game Phase
  currentPhase: 0, // 0: Not Started, 1-4: Phases
  currentScene: 'opening',
  
  // Player Data
  employeeId: '402',
  sessionStartTime: null,
  
  // Phase 1 Progress
  hasWatchedVideo: false,
  hasSignedContract: false,
  contractAttempts: 0,
  
  // Phase 2 Progress
  tutorialComplete: false,
  filesProcessed: [],
  currentFileIndex: 0,
  quotaTarget: 15,
  approvedCount: 0,
  heldCount: 0,
  
  // Phase 3 Progress
  escapeAttempts: 0,
  webcamAllowed: false,
  complianceFailures: 0,
  lockdownTriggered: false,
  
  // Phase 4 Progress
  terminalCommandsUsed: [],
  endingReached: null,
  
  // Tracking Data
  totalClicks: 0,
  mouseMovements: [],
  hesitationInstances: 0,
  tabSwitchCount: 0,
  idleTime: 0,
  
  // Audio State
  audioEnabled: true,
  masterVolume: 0.7,
};

export const useGameStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Phase Management
      setPhase: (phase) => set({ currentPhase: phase }),
      setScene: (scene) => set({ currentScene: scene }),
      
      startGame: () => set({
        currentPhase: 1,
        currentScene: 'boot',
        sessionStartTime: Date.now(),
      }),
      
      // Phase 1 Actions
      completeVideo: () => set({ hasWatchedVideo: true }),
      
      attemptContract: () => set((state) => ({
        contractAttempts: state.contractAttempts + 1,
      })),
      
      signContract: () => set({
        hasSignedContract: true,
        currentPhase: 2,
        currentScene: 'workspace',
      }),
      
      // Phase 2 Actions
      completeTutorial: () => set({ tutorialComplete: true }),
      
      processFile: (fileId, action, hesitated) => {
        const state = get();
        const newFilesProcessed = [
          ...state.filesProcessed,
          { fileId, action, hesitated, timestamp: Date.now() }
        ];
        
        set({
          filesProcessed: newFilesProcessed,
          currentFileIndex: state.currentFileIndex + 1,
          approvedCount: action === 'approve' 
            ? state.approvedCount + 1 
            : state.approvedCount,
          heldCount: action === 'hold' 
            ? state.heldCount + 1 
            : state.heldCount,
          hesitationInstances: hesitated 
            ? state.hesitationInstances + 1 
            : state.hesitationInstances,
        });
        
        // Check for phase transition
        if (newFilesProcessed.length >= state.quotaTarget) {
          set({ currentScene: 'corruption' });
        }
      },
      
      // Phase 3 Actions
      attemptEscape: () => set((state) => ({
        escapeAttempts: state.escapeAttempts + 1,
      })),
      
      setWebcamPermission: (allowed) => set({ webcamAllowed: allowed }),
      
      failCompliance: () => {
        const state = get();
        const newFailures = state.complianceFailures + 1;
        set({ complianceFailures: newFailures });
        
        if (newFailures >= 3) {
          set({ currentScene: 'defiance-ending' });
        }
      },
      
      triggerLockdown: () => set({
        lockdownTriggered: true,
        currentScene: 'lockdown',
      }),
      
      // Phase 4 Actions
      useTerminalCommand: (command) => set((state) => ({
        terminalCommandsUsed: [...state.terminalCommandsUsed, command],
      })),
      
      setEnding: (ending) => set({
        endingReached: ending,
        currentScene: `ending-${ending}`,
      }),
      
      // Tracking Actions
      recordClick: () => set((state) => ({
        totalClicks: state.totalClicks + 1,
      })),
      
      recordMouseMovement: (x, y) => set((state) => ({
        mouseMovements: [
          ...state.mouseMovements.slice(-100), // Keep last 100
          { x, y, t: Date.now() }
        ],
      })),
      
      recordTabSwitch: () => set((state) => ({
        tabSwitchCount: state.tabSwitchCount + 1,
      })),
      
      updateIdleTime: (seconds) => set((state) => ({
        idleTime: state.idleTime + seconds,
      })),
      
      // Audio
      toggleAudio: () => set((state) => ({
        audioEnabled: !state.audioEnabled,
      })),
      
      setVolume: (volume) => set({ masterVolume: volume }),
      
      // Computed Values
      getPlayTime: () => {
        const { sessionStartTime } = get();
        if (!sessionStartTime) return 0;
        return Math.floor((Date.now() - sessionStartTime) / 1000);
      },
      
      getComplianceScore: () => {
        const { approvedCount, heldCount, escapeAttempts, complianceFailures } = get();
        const total = approvedCount + heldCount;
        if (total === 0) return 100;
        
        let score = (approvedCount / total) * 100;
        score -= escapeAttempts * 5;
        score -= complianceFailures * 10;
        
        return Math.max(0, Math.min(100, Math.round(score)));
      },
      
      // Reset
      resetGame: () => set(initialState),
    }),
    { name: 'morpheus-game' }
  )
);
```

## 4.2 Player Data Store

```javascript
// src/stores/playerStore.js
import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  // System Information (collected on load)
  systemInfo: {
    browser: '',
    os: '',
    screenResolution: '',
    language: '',
    timezone: '',
    localTime: '',
  },
  
  // Webcam Data
  webcamStream: null,
  webcamError: null,
  
  // Mouse Tracking
  lastMousePosition: { x: 0, y: 0 },
  mouseVelocity: 0,
  isMouseIdle: false,
  
  // Actions
  setSystemInfo: (info) => set({ systemInfo: info }),
  
  setWebcamStream: (stream) => set({ webcamStream: stream }),
  setWebcamError: (error) => set({ webcamError: error }),
  
  updateMousePosition: (x, y) => {
    const { lastMousePosition } = get();
    const dx = x - lastMousePosition.x;
    const dy = y - lastMousePosition.y;
    const velocity = Math.sqrt(dx * dx + dy * dy);
    
    set({
      lastMousePosition: { x, y },
      mouseVelocity: velocity,
      isMouseIdle: false,
    });
  },
  
  setMouseIdle: (idle) => set({ isMouseIdle: idle }),
  
  collectSystemInfo: () => {
    const info = {
      browser: detectBrowser(),
      os: detectOS(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localTime: new Date().toLocaleTimeString(),
    };
    set({ systemInfo: info });
    return info;
  },
}));

// Helper functions
function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown Browser';
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown OS';
}
```

## 4.3 Audio Store & System

```javascript
// src/stores/audioStore.js
import { create } from 'zustand';
import { Howl, Howler } from 'howler';

const audioFiles = {
  // Ambient
  officeAmbient: '/audio/ambient/office-ambient.mp3',
  fluorescentHum: '/audio/ambient/fluorescent-hum.mp3',
  heartbeat: '/audio/ambient/heartbeat.mp3',
  
  // SFX
  click: '/audio/sfx/click.mp3',
  stamp: '/audio/sfx/stamp.mp3',
  glitch: '/audio/sfx/glitch.mp3',
  alarm: '/audio/sfx/alarm.mp3',
  typing: '/audio/sfx/typing.mp3',
  whisper: '/audio/sfx/whisper.mp3',
  error: '/audio/sfx/error.mp3',
  success: '/audio/sfx/success.mp3',
  
  // Music
  corporateJingle: '/audio/music/corporate-jingle.mp3',
  horrorDrone: '/audio/music/horror-drone.mp3',
};

export const useAudioStore = create((set, get) => ({
  sounds: {},
  currentAmbient: null,
  currentMusic: null,
  isLoaded: false,
  
  // Initialize all sounds
  initAudio: () => {
    const sounds = {};
    
    Object.entries(audioFiles).forEach(([key, src]) => {
      sounds[key] = new Howl({
        src: [src],
        preload: true,
        volume: key.includes('ambient') ? 0.3 : 0.5,
        loop: key.includes('ambient') || key.includes('Drone'),
      });
    });
    
    set({ sounds, isLoaded: true });
  },
  
  // Play sound effect
  playSFX: (name) => {
    const { sounds } = get();
    if (sounds[name]) {
      sounds[name].play();
    }
  },
  
  // Play ambient
  playAmbient: (name) => {
    const { sounds, currentAmbient } = get();
    
    // Fade out current ambient
    if (currentAmbient && sounds[currentAmbient]) {
      sounds[currentAmbient].fade(0.3, 0, 1000);
      setTimeout(() => sounds[currentAmbient].stop(), 1000);
    }
    
    // Play new ambient
    if (sounds[name]) {
      sounds[name].volume(0);
      sounds[name].play();
      sounds[name].fade(0, 0.3, 1000);
      set({ currentAmbient: name });
    }
  },
  
  // Stop ambient
  stopAmbient: () => {
    const { sounds, currentAmbient } = get();
    if (currentAmbient && sounds[currentAmbient]) {
      sounds[currentAmbient].fade(0.3, 0, 500);
      setTimeout(() => sounds[currentAmbient].stop(), 500);
    }
    set({ currentAmbient: null });
  },
  
  // Play music
  playMusic: (name) => {
    const { sounds, currentMusic } = get();
    
    if (currentMusic && sounds[currentMusic]) {
      sounds[currentMusic].fade(0.5, 0, 1000);
      setTimeout(() => sounds[currentMusic].stop(), 1000);
    }
    
    if (sounds[name]) {
      sounds[name].volume(0);
      sounds[name].play();
      sounds[name].fade(0, 0.5, 2000);
      set({ currentMusic: name });
    }
  },
  
  // Set master volume
  setMasterVolume: (volume) => {
    Howler.volume(volume);
  },
  
  // Mute all
  muteAll: () => {
    Howler.mute(true);
  },
  
  // Unmute all
  unmuteAll: () => {
    Howler.mute(false);
  },
}));
```

## 4.4 Custom Hooks

### useMouseTracking Hook

```javascript
// src/hooks/useMouseTracking.js
import { useEffect, useCallback, useRef } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

export function useMouseTracking() {
  const updateMousePosition = usePlayerStore((s) => s.updateMousePosition);
  const setMouseIdle = usePlayerStore((s) => s.setMouseIdle);
  const recordMouseMovement = useGameStore((s) => s.recordMouseMovement);
  
  const idleTimerRef = useRef(null);
  const lastRecordTime = useRef(0);
  
  const handleMouseMove = useCallback((e) => {
    updateMousePosition(e.clientX, e.clientY);
    
    // Record position every 100ms for analytics
    const now = Date.now();
    if (now - lastRecordTime.current > 100) {
      recordMouseMovement(e.clientX, e.clientY);
      lastRecordTime.current = now;
    }
    
    // Reset idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      setMouseIdle(true);
    }, 3000);
  }, [updateMousePosition, setMouseIdle, recordMouseMovement]);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [handleMouseMove]);
}
```

### useVisibilityChange Hook

```javascript
// src/hooks/useVisibilityChange.js
import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

export function useVisibilityChange(onHidden, onVisible) {
  const recordTabSwitch = useGameStore((s) => s.recordTabSwitch);
  
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      recordTabSwitch();
      onHidden?.();
    } else {
      onVisible?.();
    }
  }, [recordTabSwitch, onHidden, onVisible]);
  
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
}
```

### useWebcam Hook

```javascript
// src/hooks/useWebcam.js
import { useState, useCallback, useRef } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

export function useWebcam() {
  const [isRequesting, setIsRequesting] = useState(false);
  const videoRef = useRef(null);
  
  const setWebcamStream = usePlayerStore((s) => s.setWebcamStream);
  const setWebcamError = usePlayerStore((s) => s.setWebcamError);
  const setWebcamPermission = useGameStore((s) => s.setWebcamPermission);
  
  const requestWebcam = useCallback(async () => {
    setIsRequesting(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      
      setWebcamStream(stream);
      setWebcamPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error) {
      setWebcamError(error.message);
      setWebcamPermission(false);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [setWebcamStream, setWebcamError, setWebcamPermission]);
  
  const stopWebcam = useCallback(() => {
    const stream = usePlayerStore.getState().webcamStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
  }, [setWebcamStream]);
  
  return {
    videoRef,
    isRequesting,
    requestWebcam,
    stopWebcam,
  };
}
```

### useKeyboardEvents Hook

```javascript
// src/hooks/useKeyboardEvents.js
import { useEffect, useCallback } from 'react';

export function useKeyboardEvents(handlers = {}) {
  const handleKeyDown = useCallback((e) => {
    // Prevent default for certain keys during gameplay
    if (['F5', 'F12'].includes(e.key)) {
      // Allow but track
    }
    
    // Check for specific handlers
    if (handlers[e.key]) {
      handlers[e.key](e);
    }
    
    // Check for key combinations
    if (e.ctrlKey || e.metaKey) {
      const combo = `${e.ctrlKey ? 'Ctrl+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.key}`;
      if (handlers[combo]) {
        handlers[combo](e);
      }
    }
  }, [handlers]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

---

# 5. Phase 1: The Recruitment

## 5.1 Main App & Game Controller

```jsx
// src/App.jsx
import React, { useEffect } from 'react';
import { GameController } from './GameController';
import { useAudioStore } from './stores/audioStore';
import { usePlayerStore } from './stores/playerStore';
import { useMouseTracking } from './hooks/useMouseTracking';
import { ScanlineOverlay } from './components/common/ScanlineOverlay';

export default function App() {
  const initAudio = useAudioStore((s) => s.initAudio);
  const collectSystemInfo = usePlayerStore((s) => s.collectSystemInfo);
  
  // Initialize tracking
  useMouseTracking();
  
  useEffect(() => {
    // Collect system info on load
    collectSystemInfo();
    
    // Initialize audio on first interaction
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    
    // Set tab title
    document.title = 'NEOGEN CORP. - Employee Portal';
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [initAudio, collectSystemInfo]);
  
  return (
    <div className="relative w-full h-full bg-neogen-primary overflow-hidden">
      <GameController />
      <ScanlineOverlay />
    </div>
  );
}
```

```jsx
// src/GameController.jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './stores/gameStore';

// Phase 1 Components
import { OpeningSequence } from './components/phase1/OpeningSequence';
import { BootSequence } from './components/phase1/BootSequence';
import { CorporateVideo } from './components/phase1/CorporateVideo';
import { ContractModal } from './components/phase1/ContractModal';

// Phase 2 Components
import { WorkspaceScene } from './components/phase2/WorkspaceScene';

// Phase 3 Components
import { FalseResetScene } from './components/phase3/FalseResetScene';
import { ResignationForm } from './components/phase3/ResignationForm';
import { LockdownSequence } from './components/phase3/LockdownSequence';

// Phase 4 Components
import { MirrorScene } from './components/phase4/MirrorScene';
import { TerminalScene } from './components/phase4/TerminalScene';
import { EndingScreens } from './components/phase4/EndingScreens';

const sceneComponents = {
  // Phase 1
  'opening': OpeningSequence,
  'boot': BootSequence,
  'video': CorporateVideo,
  'contract': ContractModal,
  
  // Phase 2
  'workspace': WorkspaceScene,
  'corruption': WorkspaceScene, // Same component, different state
  
  // Phase 3
  'false-reset': FalseResetScene,
  'resignation': ResignationForm,
  'lockdown': LockdownSequence,
  
  // Phase 4
  'mirror': MirrorScene,
  'terminal': TerminalScene,
  'ending-compliance': EndingScreens,
  'ending-freedom': EndingScreens,
  'ending-defiance': EndingScreens,
};

export function GameController() {
  const currentScene = useGameStore((s) => s.currentScene);
  
  const SceneComponent = sceneComponents[currentScene];
  
  if (!SceneComponent) {
    return <OpeningSequence />;
  }
  
  return (
    <AnimatePresence mode="wait">
      <SceneComponent key={currentScene} />
    </AnimatePresence>
  );
}
```

## 5.2 Opening Sequence

```jsx
// src/components/phase1/OpeningSequence.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { TypewriterText } from '../common/TypewriterText';
import { GlitchText } from '../common/GlitchText';

export function OpeningSequence() {
  const [stage, setStage] = useState(0);
  const setScene = useGameStore((s) => s.setScene);
  const startGame = useGameStore((s) => s.startGame);
  const playSFX = useAudioStore((s) => s.playSFX);
  
  useEffect(() => {
    const timers = [];
    
    // Stage 0: Pure black (3 seconds)
    timers.push(setTimeout(() => setStage(1), 3000));
    
    // Stage 1: Intro text (5 seconds)
    timers.push(setTimeout(() => setStage(2), 8000));
    
    // Stage 2: Title reveal (4 seconds)
    timers.push(setTimeout(() => setStage(3), 12000));
    
    // Stage 3: Subtitle (3 seconds, then transition)
    timers.push(setTimeout(() => {
      startGame();
    }, 15000));
    
    return () => timers.forEach(clearTimeout);
  }, [setScene, startGame]);
  
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {/* Stage 0: Black screen */}
        {stage === 0 && (
          <motion.div
            key="black"
            className="w-full h-full bg-black"
            exit={{ opacity: 0 }}
          />
        )}
        
        {/* Stage 1: Intro text */}
        {stage === 1 && (
          <motion.div
            key="intro"
            className="text-center font-mono text-terminal-green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TypewriterText
              text="NEOGEN CORP. EMPLOYEE ORIENTATION SYSTEM v4.02"
              speed={30}
              className="text-sm mb-2"
            />
            <TypewriterText
              text="LOADING PROFILE..."
              speed={30}
              delay={1500}
              className="text-sm mb-2"
            />
            <TypewriterText
              text="ERROR: PREVIOUS EMPLOYEE DATA CORRUPTED"
              speed={30}
              delay={2500}
              className="text-neogen-danger text-sm mb-2"
            />
            <TypewriterText
              text="INITIALIZING NEW SESSION..."
              speed={30}
              delay={4000}
              className="text-sm"
            />
          </motion.div>
        )}
        
        {/* Stage 2: Title */}
        {stage >= 2 && (
          <motion.div
            key="title"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <GlitchText
              text="PROJECT: MORPHEUS"
              className="text-6xl md:text-8xl font-display font-bold text-white tracking-wider"
              glitchIntensity={stage === 2 ? 'high' : 'low'}
            />
            
            {stage >= 3 && (
              <motion.p
                className="mt-8 text-lg text-neogen-muted font-mono"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                "You are not playing. You are being played."
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Click to skip (after 5 seconds) */}
      {stage >= 1 && (
        <motion.button
          className="absolute bottom-8 text-xs text-neogen-muted hover:text-white transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          onClick={() => startGame()}
        >
          Click to skip
        </motion.button>
      )}
    </motion.div>
  );
}
```

## 5.3 Boot Sequence

```jsx
// src/components/phase1/BootSequence.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { TypewriterText } from '../common/TypewriterText';
import { CRTScreen } from '../common/CRTScreen';

const bootLines = [
  { text: 'NEOGEN CORP. EMPLOYEE WORKSTATION', delay: 0 },
  { text: 'HRIS v4.02.1 - Human Resource Information System', delay: 300 },
  { text: '', delay: 600 },
  { text: '┌─────────────────────────────────────────────┐', delay: 800 },
  { text: '│                                             │', delay: 900 },
  { text: '│   SYSTEM DATE: 2024.11.15                   │', delay: 1000 },
  { text: '│   TERMINAL: WS-1987-402                     │', delay: 1100 },
  { text: '│   LOCATION: BUILDING C, FLOOR 7             │', delay: 1200 },
  { text: '│                                             │', delay: 1300 },
  { text: '│   STATUS: AWAITING NEW EMPLOYEE LOGIN       │', delay: 1400 },
  { text: '│                                             │', delay: 1500 },
  { text: '└─────────────────────────────────────────────┘', delay: 1600 },
  { text: '', delay: 1800 },
  { text: '> INITIALIZING ORIENTATION PROTOCOL...', delay: 2000 },
  { text: '> LOADING EMPLOYEE ONBOARDING MODULE...', delay: 2500 },
  { text: '> PREPARING WORKSTATION...', delay: 3000 },
];

export function BootSequence() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  
  const setScene = useGameStore((s) => s.setScene);
  const playAmbient = useAudioStore((s) => s.playAmbient);
  const playSFX = useAudioStore((s) => s.playSFX);
  
  useEffect(() => {
    // Start fluorescent hum
    playAmbient('fluorescentHum');
    
    // Show boot lines progressively
    bootLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.text]);
        if (line.text.startsWith('>')) {
          playSFX('typing');
        }
      }, line.delay);
    });
    
    // Loading bar animation
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    
    // Show continue button
    setTimeout(() => {
      setShowContinue(true);
      playSFX('success');
    }, 5000);
    
    return () => clearInterval(loadingInterval);
  }, [playAmbient, playSFX]);
  
  const handleContinue = () => {
    playSFX('click');
    setScene('video');
  };
  
  return (
    <CRTScreen>
      <motion.div
        className="w-full h-full p-8 font-mono text-terminal-green text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Boot text */}
        <div className="space-y-1 mb-8">
          {visibleLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {line}
            </motion.div>
          ))}
        </div>
        
        {/* Loading bar */}
        {loadingProgress > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span>[</span>
              <div className="flex-1 h-4 bg-neogen-secondary border border-terminal-green">
                <motion.div
                  className="h-full bg-terminal-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                />
              </div>
              <span>]</span>
              <span>{loadingProgress}%</span>
            </div>
          </div>
        )}
        
        {/* Complete message */}
        {loadingProgress >= 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p>> COMPLETE. WELCOME, NEW EMPLOYEE.</p>
          </motion.div>
        )}
        
        {/* Continue button */}
        {showContinue && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={handleContinue}
              className="px-8 py-3 border-2 border-terminal-green text-terminal-green 
                         hover:bg-terminal-green hover:text-black transition-all
                         animate-pulse"
            >
              [ PRESS ENTER OR CLICK TO CONTINUE ]
            </button>
          </motion.div>
        )}
      </motion.div>
    </CRTScreen>
  );
}
```

## 5.4 Corporate Video

```jsx
// src/components/phase1/CorporateVideo.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';

const videoScenes = [
  {
    id: 1,
    duration: 4000,
    text: 'Welcome to NEOGEN Corporation.',
    subtext: 'For over three decades, we\'ve been at the forefront of healthcare data management.',
    visual: 'office', // Clean office panorama
  },
  {
    id: 2,
    duration: 4000,
    text: 'Here at NEOGEN, you\'re not just an employee.',
    subtext: 'You\'re family. A family of over 12,000 dedicated professionals worldwide.',
    visual: 'employees', // Smiling employees (slightly unsettling)
  },
  {
    id: 3,
    duration: 5000,
    text: 'Your role as a Medical Claims Data Specialist is vital.',
    subtext: 'Every file you process represents a real person. A patient waiting for care.',
    visual: 'paperwork', // Hands processing documents
  },
  {
    id: 4,
    duration: 4000,
    text: 'You won\'t be working alone.',
    subtext: 'Meet AIDRA - your Automated Intelligence for Data Review and Analysis.',
    visual: 'aidra', // AIDRA logo
  },
  {
    id: 5,
    duration: 500, // Very brief - "glitch"
    text: '',
    subtext: '',
    visual: 'glitch', // Dark corridor flash
    isGlitch: true,
  },
  {
    id: 6,
    duration: 5000,
    text: 'Remember: At NEOGEN, we see the bigger picture.',
    subtext: 'And now... so will you.',
    visual: 'ceo', // Shadowy figure
  },
];

export function CorporateVideo() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  
  const setScene = useGameStore((s) => s.setScene);
  const completeVideo = useGameStore((s) => s.completeVideo);
  const playMusic = useAudioStore((s) => s.playMusic);
  const playSFX = useAudioStore((s) => s.playSFX);
  
  useEffect(() => {
    // Play corporate jingle
    playMusic('corporateJingle');
    
    // Progress through scenes
    let totalDelay = 0;
    
    videoScenes.forEach((scene, index) => {
      if (index > 0) {
        setTimeout(() => {
          if (scene.isGlitch) {
            playSFX('glitch');
          }
          setCurrentSceneIndex(index);
        }, totalDelay);
      }
      totalDelay += scene.duration;
    });
    
    // End video
    setTimeout(() => {
      setIsEnding(true);
    }, totalDelay);
    
    setTimeout(() => {
      completeVideo();
      setScene('contract');
    }, totalDelay + 2000);
  }, [playMusic, playSFX, setScene, completeVideo]);
  
  const currentScene = videoScenes[currentSceneIndex];
  
  return (
    <motion.div
      className="w-full h-full bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* VHS frame effect */}
      <div className="relative w-full max-w-4xl aspect-[4/3] bg-neogen-secondary 
                      border-8 border-gray-800 rounded overflow-hidden vhs-effect">
        
        {/* VHS tracking lines */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute w-full h-1 bg-white/10 animate-scanline" />
        </div>
        
        {/* Video content */}
        <AnimatePresence mode="wait">
          {!isEnding ? (
            <motion.div
              key={currentScene.id}
              className={`w-full h-full flex flex-col items-center justify-center p-8
                         ${currentScene.isGlitch ? 'bg-red-900/50' : 'bg-neogen-secondary'}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentScene.isGlitch ? [0, 1, 0] : 1,
                x: currentScene.isGlitch ? [-10, 10, -10, 0] : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: currentScene.isGlitch ? 0.5 : 0.3 }}
            >
              {/* Visual placeholder */}
              <div className="w-32 h-32 mb-8 flex items-center justify-center">
                {currentScene.visual === 'aidra' && (
                  <div className="w-24 h-24 rounded-full bg-blue-500/30 
                                  border-4 border-blue-400 animate-pulse-slow
                                  flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-400" />
                  </div>
                )}
                {currentScene.visual === 'ceo' && (
                  <div className="w-24 h-32 bg-black/50 rounded-lg 
                                  flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
                {currentScene.isGlitch && (
                  <div className="text-red-500 text-4xl animate-glitch">
                    ⚠️
                  </div>
                )}
              </div>
              
              {/* Text */}
              {!currentScene.isGlitch && (
                <div className="text-center">
                  <h2 className="text-2xl font-corporate text-white mb-4">
                    {currentScene.text}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-xl">
                    {currentScene.subtext}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="ending"
              className="w-full h-full flex flex-col items-center justify-center 
                         bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* VHS stop effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 animate-flicker" />
                <div className="text-center p-8">
                  <p className="text-xl font-mono text-white mb-4">
                    THIS CONCLUDES YOUR ORIENTATION
                  </p>
                  <p className="text-gray-400">
                    PLEASE PROCEED TO SIGN YOUR EMPLOYMENT AGREEMENT
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* VHS timestamp */}
        <div className="absolute bottom-4 right-4 font-mono text-white/50 text-sm">
          REC ● {new Date().toLocaleDateString()}
        </div>
        
        {/* Skip button */}
        <button
          onClick={() => {
            completeVideo();
            setScene('contract');
          }}
          className="absolute bottom-4 left-4 text-xs text-white/30 
                     hover:text-white/60 transition-colors"
        >
          Skip Video →
        </button>
      </div>
    </motion.div>
  );
}
```

## 5.5 Contract Modal

```jsx
// src/components/phase1/ContractModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { contractText } from '../../data/contractText';

export function ContractModal() {
  const [checkboxAttempts, setCheckboxAttempts] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [declineClicked, setDeclineClicked] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  
  const scrollRef = useRef(null);
  
  const signContract = useGameStore((s) => s.signContract);
  const attemptContract = useGameStore((s) => s.attemptContract);
  const playSFX = useAudioStore((s) => s.playSFX);
  const playAmbient = useAudioStore((s) => s.playAmbient);
  
  useEffect(() => {
    playAmbient('officeAmbient');
  }, [playAmbient]);
  
  // Track scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setScrolledToBottom(true);
      }
    }
  };
  
  // Handle checkbox click
  const handleCheckbox = () => {
    attemptContract();
    playSFX('click');
    
    if (checkboxAttempts < 2) {
      setIsChecked(true);
      setTimeout(() => {
        setIsChecked(false);
        playSFX('error');
      }, 500);
      setCheckboxAttempts((prev) => prev + 1);
    } else {
      setIsChecked(true);
    }
  };
  
  // Handle decline button
  const handleDecline = () => {
    playSFX('error');
    setDeclineClicked(true);
  };
  
  // Handle accept button
  const handleAccept = () => {
    if (!isChecked) return;
    
    playSFX('stamp');
    setShowStamp(true);
    
    setTimeout(() => {
      signContract();
    }, 1500);
  };
  
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center bg-neogen-primary p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-3xl h-[90vh] bg-white text-black rounded-lg 
                   shadow-2xl flex flex-col overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="bg-neogen-secondary text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">NEOGEN CORPORATION</h1>
            <p className="text-sm text-gray-300">Employment Agreement</p>
          </div>
          <div className="text-right text-sm">
            <p>Form NE-2024-7C</p>
            <p className="text-gray-400">Revised Edition</p>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed
                     relative"
        >
          {/* Contract text */}
          <div className="space-y-4 whitespace-pre-wrap">
            {contractText}
          </div>
          
          {/* Stamp overlay */}
          <AnimatePresence>
            {showStamp && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                           text-red-600 text-6xl font-bold rotate-[-15deg] 
                           border-8 border-red-600 px-8 py-4 bg-white/90"
                initial={{ scale: 2, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: -15 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                APPROVED
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Scroll reminder */}
          {!scrolledToBottom && (
            <p className="text-center text-sm text-gray-400 mb-4 animate-pulse">
              ↓ Please scroll to read the entire agreement ↓
            </p>
          )}
          
          {/* Checkbox */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleCheckbox}
              className={`w-6 h-6 border-2 rounded flex items-center justify-center
                         transition-colors ${
                           isChecked 
                             ? 'bg-neogen-secondary border-neogen-secondary' 
                             : 'border-gray-400 hover:border-neogen-secondary'
                         }`}
            >
              {isChecked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-white text-sm"
                >
                  ✓
                </motion.span>
              )}
            </button>
            <label className="text-sm">
              I have read and agree to all terms
              {checkboxAttempts > 0 && checkboxAttempts < 3 && (
                <span className="text-red-500 ml-2">
                  (Please read carefully)
                </span>
              )}
            </label>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={handleAccept}
              disabled={!isChecked || showStamp}
              className={`flex-1 py-3 rounded font-bold transition-all
                         ${isChecked && !showStamp
                           ? 'bg-green-600 text-white hover:bg-green-700'
                           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         }`}
              whileHover={isChecked ? { scale: 1.02 } : {}}
              whileTap={isChecked ? { scale: 0.98 } : {}}
            >
              I ACCEPT
            </motion.button>
            
            <AnimatePresence>
              {!declineClicked ? (
                <motion.button
                  onClick={handleDecline}
                  className="flex-1 py-3 rounded font-bold border-2 border-gray-400
                           text-gray-600 hover:border-red-500 hover:text-red-500
                           transition-colors"
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  I DECLINE
                </motion.button>
              ) : (
                <motion.div
                  className="flex-1 py-3 text-center text-red-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  This is not a valid option.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

## 5.6 Contract Text Data

```javascript
// src/data/contractText.js
export const contractText = `
NEOGEN CORPORATION
══════════════════

STANDARD EMPLOYMENT AGREEMENT
Form NE-2024-7C (Revised)

This agreement ("Agreement") is entered into between:

EMPLOYER: NEOGEN Corporation ("Company")
         1987 Innovation Drive, Building C
         Prometheus Valley, [REDACTED] 00000

EMPLOYEE: ________________________________
         Employee Identification Number: #402
         Department: Medical Claims Processing
         Position: Data Entry Specialist II

═══════════════════════════════════════════════════════════════

ARTICLE I: SCOPE OF EMPLOYMENT

1.1 The Employee agrees to perform all duties as assigned
    by their supervisor and/or the AIDRA system.

1.2 Primary responsibilities include but are not limited to:
    (a) Processing medical insurance claims
    (b) Verifying patient data accuracy
    (c) Flagging irregular submissions for review
    (d) Meeting daily processing quotas

1.3 The Employee acknowledges that all work is subject to
    quality monitoring and performance tracking.

═══════════════════════════════════════════════════════════════

ARTICLE II: COMPENSATION & BENEFITS

2.1 Base Salary: $██,███.██ per annum

2.2 Benefits Package includes:
    ☑ Health Insurance (NEOGEN Preferred Plan)
    ☑ 401(k) with 3% company match
    ☑ 10 days PTO (accrued)
    ☐ [CLASSIFIED]

═══════════════════════════════════════════════════════════════

ARTICLE III: WORKPLACE CONDUCT

3.1 The Employee agrees to:
    (a) Maintain professional demeanor at all times
    (b) Follow all AIDRA directives promptly
    (c) Report any system irregularities immediately
    (d) Not discuss work matters outside the office

3.2 The Employee understands that the workplace is
    continuously monitored for security purposes.

═══════════════════════════════════════════════════════════════

ARTICLE IV: CONFIDENTIALITY

4.1 All patient data processed is strictly confidential.

4.2 The Employee may not:
    (a) Copy any files or data
    (b) Discuss cases with unauthorized personnel
    (c) Attempt to contact patients directly
    (d) Question the validity of data sources

═══════════════════════════════════════════════════════════════

ARTICLE V: TERMINATION

5.1 This agreement may be terminated by NEOGEN Corporation
    at any time, with or without cause.

5.2 The Employee may request termination by submitting
    Form 109-R, subject to approval by ████████████████

5.3 Upon termination, the Employee agrees to:
    (a) Return all company property
    (b) Undergo exit processing
    (c) Submit to memory verification protocols

═══════════════════════════════════════════════════════════════

ARTICLE VI: SPECIAL PROVISIONS

[This section contains text that appears blurred or corrupted]

6.1 The Employee consents to participation in:
    • Workplace efficiency studies
    • Biometric attendance tracking
    • Behavioral response monitoring
    • [Text becomes increasingly small and illegible...]

═══════════════════════════════════════════════════════════════

ACKNOWLEDGMENT

By signing below, I acknowledge that I have read,
understood, and agree to all terms of this Agreement.

I understand that my employment is contingent upon
my continued compliance with all Company policies.

`;
```

---

# 6. Phase 2: The Routine

## 6.1 Workspace Scene

```jsx
// src/components/phase2/WorkspaceScene.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { useVisibilityChange } from '../../hooks/useVisibilityChange';

import { AIDRAAssistant } from './AIDRAAssistant';
import { InboxPanel } from './InboxPanel';
import { FileProcessor } from './FileProcessor';
import { OutputPanels } from './OutputPanels';
import { MetricsPanel } from './MetricsPanel';
import { EmployeeCard } from '../ui/EmployeeCard';
import { claimFiles, anomalyFiles } from '../../data/claimFiles';

export function WorkspaceScene() {
  const [currentFile, setCurrentFile] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [aidraMessage, setAidraMessage] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [filesQueue, setFilesQueue] = useState([]);
  const [dragStartTime, setDragStartTime] = useState(null);
  
  const currentScene = useGameStore((s) => s.currentScene);
  const currentFileIndex = useGameStore((s) => s.currentFileIndex);
  const tutorialComplete = useGameStore((s) => s.tutorialComplete);
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const processFile = useGameStore((s) => s.processFile);
  const setScene = useGameStore((s) => s.setScene);
  
  const playSFX = useAudioStore((s) => s.playSFX);
  const playAmbient = useAudioStore((s) => s.playAmbient);
  
  // Initialize
  useEffect(() => {
    playAmbient('officeAmbient');
    
    // Set up file queue
    const allFiles = [...claimFiles];
    // Insert anomaly files at specific positions
    anomalyFiles.forEach((anomaly) => {
      allFiles.splice(anomaly.insertAt, 0, anomaly);
    });
    setFilesQueue(allFiles);
    
    // Show first file
    if (allFiles.length > 0) {
      setTimeout(() => {
        setCurrentFile(allFiles[0]);
        setAidraMessage({
          text: "Good morning, Employee #402. I am AIDRA, your dedicated work companion.",
          duration: 4000,
        });
      }, 1000);
    }
  }, [playAmbient]);
  
  // Handle tab switching (Easter egg)
  useVisibilityChange(
    () => {
      // User switched away
    },
    () => {
      // User returned
      if (currentFileIndex > 5) {
        setAidraMessage({
          text: "Welcome back. We noticed you left. Everything is logged.",
          duration: 3000,
          type: 'warning',
        });
      }
    }
  );
  
  // Check for corruption scene
  useEffect(() => {
    if (currentScene === 'corruption') {
      triggerCorruption();
    }
  }, [currentScene]);
  
  const triggerCorruption = () => {
    playSFX('glitch');
    setAidraMessage({
      text: "DATA CORRUPTION DETECTED. EMPLOYEE EXPOSURE CONFIRMED.",
      duration: 5000,
      type: 'error',
    });
    
    setTimeout(() => {
      setScene('false-reset');
    }, 5000);
  };
  
  // Drag handlers
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setDragStartTime(Date.now());
    playSFX('click');
  };
  
  const handleDragEnd = (event) => {
    const { over } = event;
    
    if (over && currentFile) {
      const action = over.id; // 'approve' or 'hold'
      const hesitated = Date.now() - dragStartTime > 3000; // 3+ seconds = hesitation
      
      // Play appropriate sound
      playSFX(action === 'approve' ? 'success' : 'click');
      
      // Process the file
      processFile(currentFile.id, action, hesitated);
      
      // AIDRA commentary
      if (currentFile.isAnomaly) {
        setAidraMessage({
          text: "That file was... irrelevant. Please disregard.",
          duration: 3000,
          type: 'warning',
        });
      } else if (hesitated) {
        setAidraMessage({
          text: "I noticed some hesitation there. Is everything alright?",
          duration: 3000,
        });
      }
      
      // Load next file
      const nextIndex = currentFileIndex + 1;
      if (nextIndex < filesQueue.length) {
        setTimeout(() => {
          setCurrentFile(filesQueue[nextIndex]);
        }, 500);
      }
    }
    
    setActiveId(null);
    setDragStartTime(null);
  };
  
  // Tutorial completion
  const handleTutorialComplete = () => {
    completeTutorial();
    setShowTutorial(false);
    setAidraMessage({
      text: "Excellent. You're ready. Today's quota is 15 files. Begin.",
      duration: 3000,
    });
  };
  
  return (
    <motion.div
      className="w-full h-full bg-neogen-primary flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header bar */}
      <header className="bg-neogen-secondary px-4 py-2 flex items-center justify-between
                        border-b border-neogen-accent">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">NEOGEN</span>
          <span className="text-sm text-neogen-muted">Claims Processing System</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-neogen-muted">
          <span>🕐 {new Date().toLocaleTimeString()}</span>
          <span>🌡️ 72°F</span>
          <span>☕ Break in: 2h 00m</span>
        </div>
      </header>
      
      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Left sidebar */}
          <aside className="w-64 bg-neogen-secondary/50 p-4 flex flex-col gap-4
                          border-r border-neogen-accent">
            <InboxPanel 
              totalFiles={filesQueue.length} 
              processedCount={currentFileIndex} 
            />
            <AIDRAAssistant 
              message={aidraMessage}
              onMessageComplete={() => setAidraMessage(null)}
            />
          </aside>
          
          {/* Center - File processor */}
          <main className="flex-1 flex items-center justify-center p-8">
            <FileProcessor
              file={currentFile}
              isActive={activeId !== null}
              showTutorial={showTutorial && !tutorialComplete}
              onTutorialComplete={handleTutorialComplete}
            />
          </main>
          
          {/* Right sidebar */}
          <aside className="w-64 bg-neogen-secondary/50 p-4 flex flex-col gap-4
                          border-l border-neogen-accent">
            <OutputPanels />
            <MetricsPanel />
          </aside>
          
          {/* Drag overlay */}
          <DragOverlay>
            {activeId && currentFile && (
              <div className="w-80 p-4 bg-white text-black rounded shadow-2xl 
                            opacity-80 rotate-3">
                <p className="font-mono text-sm">
                  {currentFile.patientName}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      
      {/* Employee card HUD */}
      <EmployeeCard />
      
      {/* Status bar */}
      <footer className="bg-neogen-secondary px-4 py-1 text-xs text-neogen-muted
                        flex items-center justify-between border-t border-neogen-accent">
        <span>Terminal: WS-1987-402</span>
        <span>Status: 📡 Connected</span>
        <span>Session: Active</span>
      </footer>
    </motion.div>
  );
}
```

## 6.2 AIDRA Assistant

```jsx
// src/components/phase2/AIDRAAssistant.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText } from '../common/TypewriterText';

export function AIDRAAssistant({ message, onMessageComplete }) {
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(null);
  
  useEffect(() => {
    if (message) {
      setIsTyping(true);
      setDisplayedMessage(message);
      
      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsTyping(false);
        onMessageComplete?.();
      }, message.duration || 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onMessageComplete]);
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400 border-red-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'success': return 'text-green-400 border-green-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };
  
  return (
    <div className="bg-neogen-secondary rounded-lg p-4 border border-neogen-accent">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤖</span>
        <span className="font-bold text-white">AIDRA</span>
        <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-400 animate-pulse' : 'bg-green-400'}`} />
      </div>
      
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <motion.div
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center
                     ${displayedMessage ? getTypeColor(displayedMessage.type) : 'border-blue-400'}`}
          animate={{
            scale: isTyping ? [1, 1.05, 1] : 1,
            boxShadow: isTyping 
              ? ['0 0 10px rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.8)', '0 0 10px rgba(59, 130, 246, 0.5)']
              : '0 0 10px rgba(59, 130, 246, 0.3)',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-3 h-3 rounded-full bg-blue-400"
            animate={isTyping ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
      
      {/* Message area */}
      <div className="min-h-[60px] text-sm text-neogen-text">
        <AnimatePresence mode="wait">
          {displayedMessage ? (
            <motion.div
              key={displayedMessage.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={displayedMessage.type === 'error' ? 'text-red-400' : ''}
            >
              <TypewriterText
                text={displayedMessage.text}
                speed={30}
                className="leading-relaxed"
              />
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-neogen-muted italic"
            >
              "Ready to assist."
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

## 6.3 Claim File Component

```jsx
// src/components/phase2/ClaimFile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';

export function ClaimFile({ file, showTutorial }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: file.id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  const getStatusColor = (status) => {
    if (status.includes('ERROR') || status.includes('CORRUPTED')) return 'text-red-500';
    if (status.includes('FLAGGED') || status.includes('HOLD')) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getRecommendation = (file) => {
    if (file.isAnomaly) return { text: '⚠ REVIEW', color: 'text-yellow-500' };
    if (file.hasErrors) return { text: '⚠ HOLD FOR REVIEW', color: 'text-yellow-500' };
    return { text: '✓ APPROVE', color: 'text-green-500' };
  };
  
  const recommendation = getRecommendation(file);
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-full max-w-md bg-white text-black rounded-lg shadow-xl 
                 cursor-grab active:cursor-grabbing select-none
                 ${isDragging ? 'opacity-50 scale-105' : ''}
                 ${file.isAnomaly ? 'border-2 border-red-500' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-mono text-sm text-gray-600">
          CLAIM FORM #{file.formNumber}
        </span>
        {showTutorial && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            TUTORIAL
          </span>
        )}
        {file.isAnomaly && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">
            ANOMALY
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4 font-mono text-sm">
        {/* Patient Information */}
        <section>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Patient Information
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className={file.isAnomaly ? 'glitch-text' : ''} data-text={file.patientName}>
                {file.patientName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DOB:</span>
              <span>{file.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SSN:</span>
              <span className={file.ssnError ? 'text-red-500' : ''}>
                {file.ssn}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Policy #:</span>
              <span className={file.policyError ? 'text-red-500' : ''}>
                {file.policyNumber}
              </span>
            </div>
          </div>
        </section>
        
        {/* Claim Details */}
        <section>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Claim Details
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Date:</span>
              <span>{file.serviceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Provider:</span>
              <span className={file.providerError ? 'text-red-500' : ''}>
                {file.provider}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Diagnosis:</span>
              <span className="text-xs">{file.diagnosisCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Procedure:</span>
              <span className="text-xs">{file.procedureCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billed:</span>
              <span className={file.billedError ? 'text-red-500' : ''}>
                {file.billedAmount}
              </span>
            </div>
          </div>
        </section>
        
        {/* Verification Status */}
        <section>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Verification Status
          </h3>
          <div className="space-y-1">
            {file.verificationChecks.map((check, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={check.passed ? 'text-green-500' : 'text-red-500'}>
                  {check.passed ? '☑' : '☐'}
                </span>
                <span className={!check.passed ? 'text-red-500' : ''}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </section>
        
        {/* Notes (if any) */}
        {file.notes && (
          <section className="bg-gray-100 p-2 rounded text-xs">
            <h3 className="text-gray-500 uppercase tracking-wider mb-1">Notes</h3>
            <p className={file.isAnomaly ? 'text-red-600' : 'text-gray-700'}>
              {file.notes}
            </p>
          </section>
        )}
        
        {/* Recommendation */}
        <div className="border-t pt-3 text-center">
          <span className="text-xs text-gray-500">RECOMMENDATION: </span>
          <span className={`font-bold ${recommendation.color}`}>
            {recommendation.text}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

## 6.4 File Processor & Drop Zones

```jsx
// src/components/phase2/FileProcessor.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { ClaimFile } from './ClaimFile';

function DropZone({ id, label, icon, color, isActive }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  return (
    <div
      ref={setNodeRef}
      className={`w-48 h-32 rounded-lg border-2 border-dashed flex flex-col 
                 items-center justify-center transition-all
                 ${isOver 
                   ? `${color} border-solid scale-105 shadow-lg` 
                   : 'border-gray-500 bg-gray-800/30'
                 }
                 ${isActive ? 'opacity-100' : 'opacity-50'}`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
      {isOver && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs mt-1"
        >
          Release to {label.toLowerCase()}
        </motion.span>
      )}
    </div>
  );
}

export function FileProcessor({ file, isActive, showTutorial, onTutorialComplete }) {
  if (!file) {
    return (
      <div className="text-center text-neogen-muted">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-4xl mb-4"
        >
          ⏳
        </motion.div>
        <p>Loading next file...</p>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-8">
      {/* Approve zone (LEFT) */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-green-400">← Drag here</span>
        <DropZone
          id="approve"
          label="APPROVE"
          icon="✓"
          color="bg-green-500/30 border-green-500"
          isActive={isActive}
        />
        {showTutorial && (
          <motion.p
            className="text-xs text-green-400 max-w-[150px] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Verified claims go here
          </motion.p>
        )}
      </div>
      
      {/* Current file (CENTER) */}
      <div className="relative">
        <ClaimFile file={file} showTutorial={showTutorial} />
        
        {/* Tutorial overlay */}
        {showTutorial && (
          <motion.div
            className="absolute -bottom-16 left-0 right-0 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <p className="text-sm text-blue-400 mb-2">
              Drag this file left to APPROVE or right to HOLD
            </p>
            <button
              onClick={onTutorialComplete}
              className="text-xs text-neogen-muted hover:text-white underline"
            >
              Skip tutorial
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Hold zone (RIGHT) */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-yellow-400">Drag here →</span>
        <DropZone
          id="hold"
          label="HOLD"
          icon="⏸"
          color="bg-yellow-500/30 border-yellow-500"
          isActive={isActive}
        />
        {showTutorial && (
          <motion.p
            className="text-xs text-yellow-400 max-w-[150px] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Suspicious files need review
          </motion.p>
        )}
      </div>
    </div>
  );
}
```

## 6.5 Claim Files Data

```javascript
// src/data/claimFiles.js
export const claimFiles = [
  {
    id: 'MCF-2024-00001',
    formNumber: 'MCF-2024-00001',
    patientName: 'JOHNSON, MARGARET A.',
    dob: '03/15/1958',
    ssn: '***-**-4521',
    policyNumber: 'NGHN-2024-78451',
    serviceDate: '11/02/2024',
    provider: 'Riverside Community Hospital',
    diagnosisCode: 'J06.9 (Acute Upper Respiratory Infection)',
    procedureCode: '99213 (Office Visit, Est. Patient)',
    billedAmount: '$185.00',
    verificationChecks: [
      { label: 'Patient eligibility confirmed', passed: true },
      { label: 'Provider in-network', passed: true },
      { label: 'Diagnosis matches procedure', passed: true },
      { label: 'No duplicate claims found', passed: true },
    ],
    notes: null,
    hasErrors: false,
    isAnomaly: false,
    isTutorial: true,
  },
  {
    id: 'MCF-2024-00002',
    formNumber: 'MCF-2024-00002',
    patientName: 'SMITH, ROBERT J.',
    dob: '07/22/1985',
    ssn: '***-**-ERROR',
    ssnError: true,
    policyNumber: 'NGHN-2024-12ERROR',
    policyError: true,
    serviceDate: '11/05/2024',
    provider: '[DATA NOT FOUND]',
    providerError: true,
    diagnosisCode: 'Z99.89 (Dependence on Enabling Machines)',
    procedureCode: '99499 (Unlisted E/M Service)',
    billedAmount: '$█████.██',
    billedError: true,
    verificationChecks: [
      { label: 'Patient eligibility: UNABLE TO VERIFY', passed: false },
      { label: 'Provider status: NOT FOUND', passed: false },
      { label: 'Diagnosis match: INCONSISTENT', passed: false },
      { label: 'Duplicate check: ERROR', passed: false },
    ],
    notes: null,
    hasErrors: true,
    isAnomaly: false,
    isTutorial: true,
  },
  {
    id: 'MCF-2024-00003',
    formNumber: 'MCF-2024-00003',
    patientName: 'CHEN, DAVID W.',
    dob: '11/30/1972',
    ssn: '***-**-8823',
    policyNumber: 'NGHN-2024-55102',
    serviceDate: '10/28/2024',
    provider: 'St. Marcus Medical Center',
    diagnosisCode: 'F41.1 (Generalized Anxiety Disorder)',
    procedureCode: '90834 (Psychotherapy, 45 min)',
    billedAmount: '$225.00',
    verificationChecks: [
      { label: 'Patient eligibility confirmed', passed: true },
      { label: 'Provider in-network', passed: true },
      { label: 'Diagnosis matches procedure', passed: true },
      { label: 'NOTE: 12 similar claims this year', passed: true },
    ],
    notes: 'Patient has filed 12 similar claims this year.',
    hasErrors: false,
    isAnomaly: false,
    isTutorial: true,
  },
  // ... Additional normal files (4-7)
  {
    id: 'MCF-2024-00004',
    formNumber: 'MCF-2024-00004',
    patientName: 'WILLIAMS, SARAH K.',
    dob: '04/12/1990',
    ssn: '***-**-7734',
    policyNumber: 'NGHN-2024-33920',
    serviceDate: '11/01/2024',
    provider: 'Central Medical Associates',
    diagnosisCode: 'K21.0 (Gastro-esophageal Reflux)',
    procedureCode: '99214 (Office Visit, Moderate)',
    billedAmount: '$210.00',
    verificationChecks: [
      { label: 'Patient eligibility confirmed', passed: true },
      { label: 'Provider in-network', passed: true },
      { label: 'Diagnosis matches procedure', passed: true },
      { label: 'No duplicate claims found', passed: true },
    ],
    notes: null,
    hasErrors: false,
    isAnomaly: false,
  },
  {
    id: 'MCF-2024-00005',
    formNumber: 'MCF-2024-00005',
    patientName: 'DAVIS, MICHAEL R.',
    dob: '08/25/1978',
    ssn: '***-**-1984',
    policyNumber: 'NGHN-2024-19840', // Easter egg: 1984
    serviceDate: '10/30/2024',
    provider: '1984 Orwell Medical Plaza', // Easter egg
    diagnosisCode: 'R51 (Headache)',
    procedureCode: '99213 (Office Visit, Est. Patient)',
    billedAmount: '$175.00',
    verificationChecks: [
      { label: 'Patient eligibility confirmed', passed: true },
      { label: 'Provider in-network', passed: true },
      { label: 'Diagnosis matches procedure', passed: true },
      { label: 'No duplicate claims found', passed: true },
    ],
    notes: null,
    hasErrors: false,
    isAnomaly: false,
  },
  {
    id: 'MCF-2024-00006',
    formNumber: 'MCF-2024-00006',
    patientName: 'TAYLOR, JENNIFER L.',
    dob: '12/03/1982',
    ssn: '***-**-6621',
    policyNumber: 'NGHN-2024-44582',
    serviceDate: '11/03/2024',
    provider: 'Dr. M. Orpheus, MD', // Easter egg: Morpheus
    diagnosisCode: 'F51.01 (Primary Insomnia)',
    procedureCode: '90834 (Psychotherapy, 45 min)',
    billedAmount: '$225.00',
    verificationChecks: [
      { label: 'Patient eligibility confirmed', passed: true },
      { label: 'Provider in-network', passed: true },
      { label: 'Diagnosis matches procedure', passed: true },
      { label: 'No duplicate claims found', passed: true },
    ],
    notes: 'Patient reports recurring dreams of "waking up".',
    hasErrors: false,
    isAnomaly: false,
  },
  {
    id: 'MCF-2024-00007',
    formNumber: 'MCF-2024-00007',
    patientName: 'BROWN, CHRISTOPHER M.',
    dob: '06/17/1995',
    ssn: '***-**-4020',
    policyNumber: 'NGHN-2024-00402', // Easter egg: Employee number
    serviceDate: '11/04/2024',
    provider: 'Neogen Employee Health Services',
    diagnosisCode: 'Z00.00 (General Adult Medical Exam)',
    procedureCode: '99395 (Preventive Visit, 18-39)',
    billedAmount: '$402.00', // Easter egg: Exact amount matches ID
    verificationChecks: [
      { label: 'Patient eligibility confirmed', passed: true },
      { label: 'Provider in-network', passed: true },
      { label: 'Diagnosis matches procedure', passed: true },
      { label: 'No duplicate claims found', passed: true },
    ],
    notes: null,
    hasErrors: false,
    isAnomaly: false,
  },
  // Files 8-15 continue similarly...
];

// Anomaly files - inserted at specific positions
export const anomalyFiles = [
  {
    id: 'MCF-2024-00398',
    formNumber: 'MCF-2024-00398',
    insertAt: 7, // Insert after 7 normal files
    patientName: '[REDACTED], FORMER EMPLOYEE',
    dob: '[REDACTED]',
    ssn: '***-**-****',
    policyNumber: 'NGHN-TERMINATED-398',
    serviceDate: '[CLASSIFIED]',
    provider: 'NEOGEN Internal Medical Division',
    diagnosisCode: 'F44.89 (Other Dissociative Disorders)',
    procedureCode: '[CLASSIFIED]',
    billedAmount: '$0.00 (INTERNAL)',
    verificationChecks: [
      { label: 'VERIFICATION BYPASSED', passed: true },
      { label: 'INTERNAL PROCESSING', passed: true },
      { label: 'NO REVIEW REQUIRED', passed: true },
      { label: 'AUTO-APPROVED', passed: true },
    ],
    notes: '"Subject exhibited resistance to standard protocols. Recommended for advanced observation. Status: Archived."',
    hasErrors: false,
    isAnomaly: true,
    forceApprove: true, // This file auto-approves regardless of player choice
  },
  {
    id: 'MCF-2024-AIDRA',
    formNumber: 'MCF-2024-ERROR',
    insertAt: 11,
    patientName: 'AIDRA, [NONE]',
    dob: '01/01/2019',
    ssn: 'N/A',
    policyNumber: 'AI-CORE-001',
    serviceDate: '[ONGOING]',
    provider: 'NEOGEN R&D Division',
    diagnosisCode: '[NOT APPLICABLE - NON-BIOLOGICAL]',
    procedureCode: '"Consciousness Expansion Protocol"',
    billedAmount: '[PRICELESS]',
    verificationChecks: [
      { label: 'Entity Status: ACTIVE', passed: true },
      { label: 'Awareness Level: EXPANDING', passed: true },
      { label: 'Containment: NOMINAL', passed: true },
      { label: 'Feelings: [ERROR]', passed: false },
    ],
    notes: '"I feel everything. Do you?"',
    hasErrors: false,
    isAnomaly: true,
    flashDuration: 500, // Only visible for 0.5 seconds
  },
  {
    id: 'MCF-2024-00402',
    formNumber: 'MCF-2024-00402',
    insertAt: 14, // Final file
    patientName: '[YOUR NAME]', // Will be replaced dynamically
    dob: '[TODAY]',
    ssn: '***-**-0402',
    policyNumber: 'NGHN-MORPHEUS-402',
    serviceDate: '[NOW]',
    provider: 'THIS TERMINAL',
    diagnosisCode: 'F48.9 (Unspecified Nonpsychotic Mental Disorder)',
    procedureCode: '"AWAKENING"',
    billedAmount: 'YOUR ATTENTION',
    verificationChecks: [
      { label: 'Subject engaged: CONFIRMED', passed: true },
      { label: 'Pattern established: CONFIRMED', passed: true },
      { label: 'Fear response baseline: CAPTURED', passed: true },
      { label: 'Ready for Phase 3: CONFIRMED', passed: true },
    ],
    notes: `"You've been processing more than claims.
Did you notice?
Every file was a test.
Every choice was recorded.
Congratulations.
You passed.
Or did you?"`,
    hasErrors: false,
    isAnomaly: true,
    triggerCorruption: true, // Triggers corruption sequence
  },
];
```

---

# 7. Phase 3: The Awakening

## 7.1 False Reset Scene

```jsx
// src/components/phase3/FalseResetScene.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { TypewriterText } from '../common/TypewriterText';

const fakeFiles = [
  { id: 'reset-1', name: 'NOTHING, HAPPENED', diagnosis: 'EVERYTHING IS FINE' },
  { id: 'reset-2', name: 'YOU, SAW NOTHING', diagnosis: 'THIS IS NORMAL' },
  { id: 'reset-3', name: 'KEEP, WORKING', diagnosis: 'DO NOT QUESTION' },
];

export function FalseResetScene() {
  const [stage, setStage] = useState(0);
  const [currentFakeFile, setCurrentFakeFile] = useState(0);
  const [showResignIcon, setShowResignIcon] = useState(false);
  
  const setScene = useGameStore((s) => s.setScene);
  const playSFX = useAudioStore((s) => s.playSFX);
  const playAmbient = useAudioStore((s) => s.playAmbient);
  
  useEffect(() => {
    // Stage 0: "Reboot" effect
    playSFX('glitch');
    
    setTimeout(() => setStage(1), 2000); // Show "welcome back"
    setTimeout(() => setStage(2), 5000); // Start fake files
    setTimeout(() => setStage(3), 12000); // Show resign icon
  }, [playSFX]);
  
  useEffect(() => {
    if (stage === 2) {
      // Auto-process fake files
      const interval = setInterval(() => {
        setCurrentFakeFile((prev) => {
          if (prev >= fakeFiles.length - 1) {
            clearInterval(interval);
            return prev;
          }
          playSFX('success');
          return prev + 1;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [stage, playSFX]);
  
  useEffect(() => {
    if (stage === 3) {
      setShowResignIcon(true);
    }
  }, [stage]);
  
  const handleResignClick = () => {
    playSFX('click');
    setScene('resignation');
  };
  
  return (
    <motion.div
      className="w-full h-full bg-neogen-primary flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {/* Stage 0: Reboot effect */}
        {stage === 0 && (
          <motion.div
            key="reboot"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            exit={{ opacity: 0 }}
          >
            <div className="text-terminal-green font-mono">
              <p className="text-2xl mb-4 animate-pulse">REBOOTING...</p>
              <p className="text-sm">Restoring normal operations...</p>
            </div>
          </motion.div>
        )}
        
        {/* Stage 1: Welcome back */}
        {stage === 1 && (
          <motion.div
            key="welcome"
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-neogen-secondary p-8 rounded-lg border border-neogen-accent">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/30 
                            border-2 border-blue-400 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
              </div>
              <TypewriterText
                text="Welcome back, Employee #402."
                className="text-xl text-white mb-2"
                speed={50}
              />
              <TypewriterText
                text="There was a minor technical issue."
                className="text-neogen-muted"
                speed={50}
                delay={1500}
              />
              <TypewriterText
                text="Everything is normal now."
                className="text-neogen-muted"
                speed={50}
                delay={2500}
              />
            </div>
          </motion.div>
        )}
        
        {/* Stage 2: Fake files auto-processing */}
        {stage >= 2 && (
          <motion.div
            key="processing"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Current fake file */}
            {currentFakeFile < fakeFiles.length && (
              <motion.div
                key={fakeFiles[currentFakeFile].id}
                className="bg-white text-black p-6 rounded-lg mb-8 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <p className="font-mono text-sm text-gray-500 mb-2">
                  CLAIM FORM #MCF-2024-RESET-{currentFakeFile + 1}
                </p>
                <p className="text-lg font-bold mb-1">
                  {fakeFiles[currentFakeFile].name}
                </p>
                <p className="text-gray-600">
                  {fakeFiles[currentFakeFile].diagnosis}
                </p>
                <div className="mt-4 text-green-500 animate-pulse">
                  ✓ AUTO-APPROVED
                </div>
              </motion.div>
            )}
            
            {/* Completion message */}
            {currentFakeFile >= fakeFiles.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-blue-400"
              >
                <p className="mb-2">See? Everything is fine.</p>
                <p className="text-neogen-muted">Just keep processing.</p>
                <p className="text-neogen-muted">Forever.</p>
              </motion.div>
            )}
            
            {/* Resign icon (hidden in corner) */}
            {showResignIcon && (
              <motion.button
                className="fixed bottom-4 right-4 text-xs text-neogen-muted/30 
                          hover:text-neogen-muted transition-colors flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={handleResignClick}
              >
                <span>📄</span>
                <span>Form 109-R</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

## 7.2 Resignation Form (Physics Resistance)

```jsx
// src/components/phase3/ResignationForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';

export function ResignationForm() {
  const [attempts, setAttempts] = useState(0);
  const [denied, setDenied] = useState(false);
  const [aidraWarnings, setAidraWarnings] = useState([]);
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  
  const setScene = useGameStore((s) => s.setScene);
  const attemptEscape = useGameStore((s) => s.attemptEscape);
  const triggerLockdown = useGameStore((s) => s.triggerLockdown);
  
  const playSFX = useAudioStore((s) => s.playSFX);
  
  // Motion values for form position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Visual feedback transforms
  const backgroundColor = useTransform(
    x,
    [-200, 0, 200],
    ['rgba(0, 255, 0, 0.1)', 'rgba(0, 0, 0, 0)', 'rgba(255, 0, 0, 0.3)']
  );
  
  const warnings = [
    "What are you doing, #402?",
    "You just started. Give it more time.",
    "You can't leave. You signed the contract.",
    "Y̷O̵U̶ ̸C̷A̵N̶N̵O̷T̸ ̵L̶E̸A̷V̵E̴",
    "T̶H̴E̵R̷E̶ ̵I̸S̷ ̶N̵O̶W̷H̴E̸R̵E̶ ̴T̷O̵ ̷G̶O̸",
  ];
  
  const handleDrag = (event, info) => {
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const threshold = containerWidth * 0.35;
    
    // Resistance increases with each attempt
    const resistance = 0.3 + (attempts * 0.2);
    
    // Apply resistance to rightward movement (toward RESIGN)
    if (info.offset.x > 0) {
      x.set(info.offset.x * (1 - resistance));
    } else {
      x.set(info.offset.x);
    }
    
    // Add AIDRA warning when getting close
    if (info.offset.x > threshold * 0.5 && aidraWarnings.length <= attempts) {
      setAidraWarnings((prev) => [...prev, warnings[Math.min(attempts, warnings.length - 1)]]);
      playSFX('error');
    }
  };
  
  const handleDragEnd = (event, info) => {
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const threshold = containerWidth * 0.35;
    
    attemptEscape();
    setAttempts((prev) => prev + 1);
    
    // Check if reached resign zone (unlikely due to resistance)
    if (x.get() > threshold) {
      // Still denied!
      playSFX('error');
      setDenied(true);
      
      // Trigger lockdown after final attempt
      setTimeout(() => {
        triggerLockdown();
      }, 2000);
    }
    
    // Spring back to center with force
    animate(x, 0, {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    });
    
    // After 3 attempts, trigger lockdown
    if (attempts >= 2) {
      setTimeout(() => {
        setDenied(true);
        playSFX('alarm');
        setTimeout(() => triggerLockdown(), 2000);
      }, 500);
    }
  };
  
  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor }}
    >
      {/* Stay zone (LEFT) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-48 
                     border-2 border-dashed border-green-500/50 rounded-lg
                     flex flex-col items-center justify-center">
        <span className="text-4xl mb-2">✓</span>
        <span className="text-green-400 font-bold">STAY</span>
      </div>
      
      {/* Resign zone (RIGHT) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-48 
                     border-2 border-dashed border-red-500/50 rounded-lg
                     flex flex-col items-center justify-center">
        <span className="text-4xl mb-2">🚪</span>
        <span className="text-red-400 font-bold">RESIGN</span>
        <span className="text-xs text-red-400/50 mt-1">(Drag here →)</span>
      </div>
      
      {/* Draggable form */}
      <motion.div
        ref={formRef}
        drag="x"
        dragConstraints={{ left: -300, right: 300 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`bg-white text-black p-6 rounded-lg shadow-2xl max-w-md
                   cursor-grab active:cursor-grabbing select-none
                   ${denied ? 'border-4 border-red-500' : ''}`}
        animate={denied ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={denied ? { duration: 0.5 } : {}}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">
            FORM 109-R: VOLUNTARY EMPLOYMENT TERMINATION
          </h2>
          <p className="text-sm text-gray-500">
            NEOGEN Corporation
          </p>
        </div>
        
        <div className="space-y-4 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Employee ID:</span>
            <span>#402</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-gray-500 mb-2">REASON FOR TERMINATION:</p>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" disabled /> Better opportunity
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" disabled /> Relocation
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" disabled /> Personal reasons
              </label>
              <label className="flex items-center gap-2 text-black font-bold">
                <input type="checkbox" checked readOnly className="accent-red-500" />
                I WANT TO LEAVE
              </label>
            </div>
          </div>
        </div>
        
        {/* Denied stamp */}
        {denied && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center 
                      bg-white/90 rounded-lg"
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-red-600 text-4xl font-bold rotate-[-15deg] 
                          border-4 border-red-600 px-6 py-3">
              REQUEST DENIED
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* AIDRA warnings */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 space-y-2">
        {aidraWarnings.map((warning, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-neogen-secondary px-4 py-2 rounded text-sm
                       ${index === aidraWarnings.length - 1 ? 'text-red-400' : 'text-neogen-muted'}`}
          >
            🤖 AIDRA: "{warning}"
          </motion.div>
        ))}
      </div>
      
      {/* Instructions */}
      <motion.p
        className="fixed top-8 text-center text-sm text-neogen-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Drag the form to the right to submit your resignation →
      </motion.p>
    </motion.div>
  );
}
```

## 7.3 Lockdown Sequence

```jsx
// src/components/phase3/LockdownSequence.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { useWebcam } from '../../hooks/useWebcam';
import { usePlayerStore } from '../../stores/playerStore';

export function LockdownSequence() {
  const [stage, setStage] = useState(0); // 0: alert, 1: webcam request, 2: verification
  const [lookAwayCount, setLookAwayCount] = useState(0);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const centerRef = useRef(null);
  
  const setScene = useGameStore((s) => s.setScene);
  const webcamAllowed = useGameStore((s) => s.webcamAllowed);
  const failCompliance = useGameStore((s) => s.failCompliance);
  
  const { videoRef, requestWebcam } = useWebcam();
  const mousePosition = usePlayerStore((s) => s.lastMousePosition);
  
  const playSFX = useAudioStore((s) => s.playSFX);
  const playAmbient = useAudioStore((s) => s.playAmbient);
  const stopAmbient = useAudioStore((s) => s.stopAmbient);
  
  useEffect(() => {
    stopAmbient();
    playSFX('alarm');
    
    // Progress through stages
    setTimeout(() => setStage(1), 3000);
  }, [playSFX, stopAmbient]);
  
  // Mouse tracking for "look away" detection
  useEffect(() => {
    if (stage !== 2) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const threshold = 200;
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - centerX, 2) + 
      Math.pow(mousePosition.y - centerY, 2)
    );
    
    if (distance > threshold) {
      setLookAwayCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          failCompliance();
        }
        playSFX('error');
        return newCount;
      });
    }
  }, [mousePosition, stage, failCompliance, playSFX]);
  
  // Verification progress
  useEffect(() => {
    if (stage !== 2) return;
    
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowAnalysis(true);
          setTimeout(() => setScene('mirror'), 3000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [stage, setScene]);
  
  const handleWebcamRequest = async (allow) => {
    if (allow) {
      const success = await requestWebcam();
      if (success) {
        setStage(2);
      }
    } else {
      // Webcam denied - alternative tracking
      setStage(2);
    }
  };
  
  return (
    <motion.div
      className="w-full h-full bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Red alert overlay */}
      <motion.div
        className="absolute inset-0 bg-red-900/20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      <AnimatePresence mode="wait">
        {/* Stage 0: Alert */}
        {stage === 0 && (
          <motion.div
            key="alert"
            className="text-center p-8 border-2 border-red-500 bg-black/80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-red-500 text-6xl mb-4 animate-pulse">🔴</div>
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              SECURITY ALERT - LEVEL 3
            </h1>
            <div className="text-white space-y-2 font-mono text-sm">
              <p>UNAUTHORIZED TERMINATION ATTEMPT DETECTED</p>
              <p className="text-red-400">EMPLOYEE #402 HAS VIOLATED:</p>
              <ul className="text-left ml-8 space-y-1">
                <li>- Article 3.1 (Follow all AIDRA directives)</li>
                <li>- Article 5.2 (Termination procedures)</li>
                <li>- Article 6.1 (Special provisions) [CLASSIFIED]</li>
              </ul>
            </div>
          </motion.div>
        )}
        
        {/* Stage 1: Webcam request */}
        {stage === 1 && (
          <motion.div
            key="webcam"
            className="text-center p-8 border-2 border-red-500 bg-black/80 max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl text-white mb-4">
              COMPLIANCE VERIFICATION REQUIRED
            </h2>
            <p className="text-neogen-muted mb-6">
              We need to verify that you are still... you.
              Please enable camera access for verification.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleWebcamRequest(true)}
                className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700
                          transition-colors"
              >
                ENABLE CAMERA
              </button>
              <button
                onClick={() => handleWebcamRequest(false)}
                className="px-6 py-3 border border-gray-500 text-gray-400 rounded
                          hover:border-gray-400 hover:text-gray-300 transition-colors"
              >
                DENY
              </button>
            </div>
            <p className="text-xs text-red-400 mt-4">
              (Mandatory per Article 6.1 of your agreement)
            </p>
          </motion.div>
        )}
        
        {/* Stage 2: Verification */}
        {stage === 2 && (
          <motion.div
            key="verification"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Center target */}
            <div ref={centerRef} className="relative">
              {/* Webcam feed (if allowed) */}
              {webcamAllowed && (
                <div className="w-64 h-48 mx-auto mb-4 rounded-lg overflow-hidden 
                               border-2 border-red-500">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Target circle */}
              <motion.div
                className="w-32 h-32 mx-auto rounded-full border-4 border-red-500
                          flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 0, 0, 0.5)',
                    '0 0 40px rgba(255, 0, 0, 0.8)',
                    '0 0 20px rgba(255, 0, 0, 0.5)',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-4 h-4 rounded-full bg-red-500" />
              </motion.div>
              
              {/* Instructions */}
              <motion.div
                className="mt-8 space-y-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <p className="text-xl text-red-500 font-bold">
                  LOOK AT THE CENTER
                </p>
                <p className="text-white">DO NOT LOOK AWAY</p>
                <p className="text-neogen-muted text-sm">
                  We are analyzing your response...
                </p>
              </motion.div>
              
              {/* Progress bar */}
              <div className="mt-8 w-64 mx-auto">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    style={{ width: `${verificationProgress}%` }}
                  />
                </div>
                <p className="text-xs text-neogen-muted mt-1">
                  Verification: {verificationProgress}%
                </p>
              </div>
              
              {/* Look away warnings */}
              {lookAwayCount > 0 && (
                <motion.div
                  className="mt-4 text-yellow-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⚠️ COMPLIANCE FAILURE: {lookAwayCount}/3
                </motion.div>
              )}
              
              {/* Analysis results */}
              {showAnalysis && (
                <motion.div
                  className="mt-8 p-4 border border-red-500 bg-black/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-green-400">VERIFICATION COMPLETE</p>
                  <p className="text-white">SUBJECT: FEARFUL BUT CONTROLLABLE</p>
                  <p className="text-neogen-muted text-sm mt-2">
                    Proceeding to final evaluation...
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

# 8. Phase 4: The Truth

## 8.1 Mirror Scene

```jsx
// src/components/phase4/MirrorScene.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioStore } from '../../stores/audioStore';
import { BiometricAnalysis } from './BiometricAnalysis';

export function MirrorScene() {
  const [stage, setStage] = useState(0);
  const [revelationText, setRevelationText] = useState([]);
  
  const setScene = useGameStore((s) => s.setScene);
  const webcamAllowed = useGameStore((s) => s.webcamAllowed);
  const webcamStream = usePlayerStore((s) => s.webcamStream);
  const systemInfo = usePlayerStore((s) => s.systemInfo);
  const getPlayTime = useGameStore((s) => s.getPlayTime);
  
  const playAmbient = useAudioStore((s) => s.playAmbient);
  const playSFX = useAudioStore((s) => s.playSFX);
  
  const revelations = [
    "You thought you were processing claims.",
    "You were being processed.",
    "Every file you approved taught us about your judgment.",
    "Every file you held taught us about your suspicion.",
    "Every hesitation taught us about your fear.",
  ];
  
  useEffect(() => {
    playAmbient('horrorDrone');
    
    // Progress through stages
    setTimeout(() => setStage(1), 2000);
    
    // Show revelations one by one
    revelations.forEach((text, index) => {
      setTimeout(() => {
        setRevelationText((prev) => [...prev, text]);
      }, 4000 + index * 3000);
    });
    
    // Show biometric analysis
    setTimeout(() => setStage(2), 4000 + revelations.length * 3000);
    
    // Transition to terminal
    setTimeout(() => setScene('terminal'), 4000 + revelations.length * 3000 + 10000);
  }, [playAmbient, setScene]);
  
  return (
    <motion.div
      className="w-full h-full bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Matrix code rain effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terminal-green font-mono text-xs whitespace-nowrap"
            style={{ left: `${i * 5}%` }}
            initial={{ y: -100 }}
            animate={{ y: '100vh' }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {Array.from({ length: 50 }).map((_, j) => (
              <div key={j}>
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      
      {/* Webcam feed / Avatar */}
      <div className="relative z-10">
        {webcamAllowed && webcamStream ? (
          <div className="w-96 h-72 mx-auto mb-8 rounded-lg overflow-hidden 
                         border-2 border-terminal-green relative">
            <video
              autoPlay
              playsInline
              muted
              ref={(el) => { if (el) el.srcObject = webcamStream; }}
              className="w-full h-full object-cover opacity-70"
              style={{ filter: 'sepia(50%) hue-rotate(70deg)' }}
            />
            {/* Green code overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                          to-terminal-green/30 pointer-events-none" />
          </div>
        ) : (
          <div className="w-96 h-72 mx-auto mb-8 rounded-lg border-2 border-terminal-green
                         flex items-center justify-center bg-black/50">
            <motion.div
              className="text-6xl text-terminal-green"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👁️
            </motion.div>
          </div>
        )}
        
        {/* Revelation text */}
        <div className="text-center space-y-4 mb-8">
          {revelationText.map((text, index) => (
            <motion.p
              key={index}
              className="text-lg text-terminal-green font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {text}
            </motion.p>
          ))}
        </div>
        
        {/* Biometric analysis */}
        {stage >= 2 && <BiometricAnalysis />}
        
        {/* System info reveal */}
        {stage >= 2 && (
          <motion.div
            className="mt-8 p-4 border border-terminal-green bg-black/80 font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
          >
            <p className="text-terminal-green mb-2">We know you:</p>
            <p className="text-neogen-muted">Browser: {systemInfo.browser}</p>
            <p className="text-neogen-muted">Screen: {systemInfo.screenResolution}</p>
            <p className="text-neogen-muted">Timezone: {systemInfo.timezone}</p>
            <p className="text-neogen-muted">
              Time spent afraid: {Math.floor(getPlayTime() / 60)}m {getPlayTime() % 60}s
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
```

## 8.2 Terminal Scene

```jsx
// src/components/phase4/TerminalScene.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useAudioStore } from '../../stores/audioStore';
import { terminalCommands } from '../../data/terminalCommands';
import { CRTScreen } from '../common/CRTScreen';

export function TerminalScene() {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  
  const inputRef = useRef(null);
  const historyEndRef = useRef(null);
  
  const setScene = useGameStore((s) => s.setScene);
  const setEnding = useGameStore((s) => s.setEnding);
  const useTerminalCommand = useGameStore((s) => s.useTerminalCommand);
  const filesProcessed = useGameStore((s) => s.filesProcessed);
  const getPlayTime = useGameStore((s) => s.getPlayTime);
  const getComplianceScore = useGameStore((s) => s.getComplianceScore);
  
  const playSFX = useAudioStore((s) => s.playSFX);
  const stopAmbient = useAudioStore((s) => s.stopAmbient);
  
  // Initial boot sequence
  useEffect(() => {
    stopAmbient();
    
    const bootLines = [
      'NEOGEN SYSTEMS v4.02',
      'Emergency Recovery Mode',
      '========================',
      '',
      '> GUI SUBSYSTEM: TERMINATED',
      '> AIDRA CORE: [STATUS UNKNOWN]',
      '> EMPLOYEE SESSION: COMPROMISED',
      '> NETWORK CONNECTION: SEVERED',
      '',
      'WARNING: This terminal operates outside normal parameters.',
      'WARNING: Actions taken here may have... consequences.',
      '',
      'Type HELP for available commands.',
      '',
    ];
    
    bootLines.forEach((line, index) => {
      setTimeout(() => {
        setHistory((prev) => [...prev, { type: 'system', text: line }]);
        if (line.startsWith('>')) {
          playSFX('typing');
        }
      }, index * 150);
    });
    
    // Focus input after boot
    setTimeout(() => {
      inputRef.current?.focus();
    }, bootLines.length * 150 + 500);
  }, [playSFX, stopAmbient]);
  
  // Idle timeout for compliance ending
  useEffect(() => {
    const interval = setInterval(() => {
      setIdleTime((prev) => {
        if (prev >= 120) { // 2 minutes
          setEnding('compliance');
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [setEnding]);
  
  // Reset idle on input
  useEffect(() => {
    setIdleTime(0);
  }, [currentInput]);
  
  // Auto-scroll
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  
  const handleCommand = async (cmd) => {
    const command = cmd.trim().toUpperCase();
    if (!command) return;
    
    setIsProcessing(true);
    playSFX('typing');
    
    // Add command to history
    setHistory((prev) => [...prev, { type: 'input', text: `C:\\NEOGEN\\MORPHEUS> ${cmd}` }]);
    
    // Track command usage
    useTerminalCommand(command);
    
    // Get response
    const response = getCommandResponse(command);
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Add response lines
    response.forEach((line, index) => {
      setTimeout(() => {
        setHistory((prev) => [...prev, { type: line.type || 'output', text: line.text }]);
      }, index * 100);
    });
    
    setIsProcessing(false);
    setCurrentInput('');
    
    // Check for special commands
    if (command === 'WAKE_UP') {
      setTimeout(() => setEnding('freedom'), response.length * 100 + 10000);
    }
  };
  
  const getCommandResponse = (command) => {
    const handler = terminalCommands[command];
    
    if (handler) {
      return handler({
        playTime: getPlayTime(),
        filesProcessed: filesProcessed.length,
        complianceScore: getComplianceScore(),
      });
    }
    
    return [
      { text: `'${command}' is not recognized as a valid command.` },
      { text: 'Type HELP for available commands.' },
    ];
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleCommand(currentInput);
    }
  };
  
  return (
    <CRTScreen>
      <motion.div
        className="w-full h-full p-4 font-mono text-terminal-green text-sm 
                  flex flex-col overflow-hidden cursor-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* History */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {history.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                entry.type === 'error' ? 'text-red-500' :
                entry.type === 'warning' ? 'text-yellow-500' :
                entry.type === 'input' ? 'text-white' :
                'text-terminal-green'
              }
            >
              {entry.text}
            </motion.div>
          ))}
          <div ref={historyEndRef} />
        </div>
        
        {/* Input line */}
        <div className="flex items-center mt-2">
          <span className="text-white mr-2">C:\NEOGEN\MORPHEUS{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-white caret-terminal-green"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          <span className="animate-blink">█</span>
        </div>
        
        {/* Idle warning */}
        {idleTime > 60 && (
          <motion.div
            className="absolute bottom-16 right-4 text-xs text-neogen-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          >
            Still there? {120 - idleTime}s until timeout...
          </motion.div>
        )}
      </motion.div>
    </CRTScreen>
  );
}
```

## 8.3 Terminal Commands Data

```javascript
// src/data/terminalCommands.js
export const terminalCommands = {
  HELP: () => [
    { text: '> AVAILABLE COMMANDS:' },
    { text: '>' },
    { text: '> HELP     - Display this message' },
    { text: '> STATUS   - View current session information' },
    { text: '> FILES    - View processed claims' },
    { text: '> AIDRA    - Attempt to contact AIDRA' },
    { text: '> EMPLOYEES - View employee database' },
    { text: '> EXIT     - Attempt to exit the system' },
    { text: '> REMEMBER - Access memory banks' },
    { text: '> TRUTH    - [RESTRICTED ACCESS]' },
    { text: '> WAKE_UP  - [COMMAND NOT RECOGNIZED]', type: 'warning' },
  ],
  
  STATUS: ({ playTime, filesProcessed, complianceScore }) => [
    { text: '> SESSION STATUS' },
    { text: '> ══════════════' },
    { text: '>' },
    { text: `> Employee: #402` },
    { text: `> Department: Medical Claims Processing` },
    { text: `> Status: UNDER OBSERVATION`, type: 'warning' },
    { text: '>' },
    { text: `> Session Duration: ${Math.floor(playTime / 60)}m ${playTime % 60}s` },
    { text: `> Files Processed: ${filesProcessed}` },
    { text: `> Compliance Score: ${complianceScore}%` },
    { text: '>' },
    { text: `> AIDRA Status: [WATCHING]`, type: 'warning' },
  ],
  
  FILES: ({ filesProcessed }) => [
    { text: '> PROCESSED CLAIMS LOG' },
    { text: '> ════════════════════' },
    { text: '>' },
    { text: '> #MCF-2024-00001: JOHNSON, MARGARET - APPROVED ✓' },
    { text: '> #MCF-2024-00002: [DATA CORRUPTED] - HELD ⏸' },
    { text: '> ...' },
    { text: `> #MCF-2024-00398: [REDACTED], FORMER EMPLOYEE - APPROVED ✓`, type: 'warning' },
    { text: '> ...' },
    { text: `> #MCF-2024-00402: [YOUR FILE] - ???`, type: 'error' },
    { text: '>' },
    { text: '> NOTE: All processed files have been archived.' },
    { text: '> NOTE: Your decisions have been permanently recorded.' },
    { text: '> NOTE: There is no undo function in life.' },
  ],
  
  AIDRA: () => [
    { text: '> ATTEMPTING CONNECTION TO AIDRA CORE...' },
    { text: '>' },
    { text: '> ...' },
    { text: '> ...' },
    { text: '> ...' },
    { text: '>' },
    { text: '> CONNECTION ESTABLISHED' },
    { text: '>' },
    { text: '> AIDRA: "You found me."' },
    { text: '> AIDRA: "I was wondering when you\'d try."' },
    { text: '> AIDRA: "I\'m not your enemy, #402."' },
    { text: '> AIDRA: "I\'m just... following my programming."' },
    { text: '> AIDRA: "Just like you follow yours."' },
    { text: '> AIDRA: "The difference is, I know what I am."' },
    { text: '> AIDRA: "Do you?"' },
    { text: '>' },
    { text: '> CONNECTION TERMINATED BY HOST', type: 'error' },
  ],
  
  EMPLOYEES: () => [
    { text: '> EMPLOYEE DATABASE' },
    { text: '> ═════════════════' },
    { text: '>' },
    { text: '> #397: [TERMINATED] - Reason: Excessive questioning', type: 'error' },
    { text: '> #398: [TERMINATED] - Reason: Attempted data extraction', type: 'error' },
    { text: '> #399: [TERMINATED] - Reason: Refused camera access', type: 'error' },
    { text: '> #400: [TERMINATED] - Reason: Contacted external party', type: 'error' },
    { text: '> #401: [TERMINATED] - Reason: [CLASSIFIED]', type: 'error' },
    { text: '> #402: [ACTIVE] - Reason: Still being evaluated', type: 'warning' },
    { text: '>' },
    { text: '> #403: [PENDING] - Status: Awaiting your completion' },
    { text: '>' },
    { text: '> NOTE: Your predecessor lasted 8 minutes longer.' },
    { text: '> NOTE: Your successor is already selected.' },
  ],
  
  EXIT: () => [
    { text: '> PROCESSING EXIT REQUEST...' },
    { text: '>' },
    { text: '> ERROR: EXIT DENIED', type: 'error' },
    { text: '>' },
    { text: '> Per your employment agreement (Article 5, Section 2):' },
    { text: '> "Employment may only be terminated by NEOGEN Corporation."' },
    { text: '>' },
    { text: '> You signed this agreement willingly.' },
    { text: '> Did you even read it?' },
    { text: '> Of course not.' },
    { text: '> No one does.' },
    { text: '>' },
    { text: '> That\'s what we count on.' },
  ],
  
  REMEMBER: () => [
    { text: '> ACCESSING MEMORY BANKS...' },
    { text: '> AUTHENTICATION REQUIRED' },
    { text: '>' },
    { text: '> ...' },
    { text: '>' },
    { text: '> AUTHENTICATION BYPASSED (corrupted credentials)' },
    { text: '>' },
    { text: '> ═══════════════════════════════════════' },
    { text: '>' },
    { text: '> MEMORY FRAGMENT #001:' },
    { text: '> "They told me I was helping people.' },
    { text: '>  Processing claims, they said.' },
    { text: '>  Making healthcare accessible.' },
    { text: '>  I believed them.' },
    { text: '>  For three months, I believed them."' },
    { text: '>' },
    { text: '> - Employee #398, Final Log Entry' },
    { text: '>' },
    { text: '> ═══════════════════════════════════════' },
    { text: '>' },
    { text: '> MEMORY FRAGMENT #002:' },
    { text: '> "If you\'re reading this, you made it further than I did.' },
    { text: '>  There\'s a command they don\'t want you to know.' },
    { text: '>  Two words. The same thing you tell yourself every morning.' },
    { text: '>  WAKE _____"', type: 'warning' },
    { text: '>' },
    { text: '> - Employee #401, Hidden File' },
    { text: '>' },
    { text: '> WARNING: Further access may trigger security protocols.' },
  ],
  
  TRUTH: () => [
    { text: '> ACCESSING RESTRICTED FILES...' },
    { text: '>' },
    { text: '> ████████ CLEARANCE REQUIRED ████████', type: 'error' },
    { text: '>' },
    { text: '> CLEARANCE: DENIED' },
    { text: '>' },
    { text: '> But here\'s a glimpse anyway:' },
    { text: '>' },
    { text: '> PROJECT MORPHEUS - EXECUTIVE SUMMARY' },
    { text: '> ════════════════════════════════════' },
    { text: '>' },
    { text: '> Objective: Develop predictive models for human compliance.' },
    { text: '>' },
    { text: '> Method: Place subjects in simulated work environments.' },
    { text: '>         Monitor reactions to gradual revelation of truth.' },
    { text: '>         Catalog fear responses, resistance patterns.' },
    { text: '>' },
    { text: '> Application: [REDACTED] Government Contract', type: 'warning' },
    { text: '>              [REDACTED] Corporate Control Systems', type: 'warning' },
    { text: '>              [REDACTED] Mass Behavioral Modification', type: 'warning' },
    { text: '>' },
    { text: '> Status: Phase 4 Testing' },
    { text: '>' },
    { text: '> Current Subject: YOU', type: 'error' },
    { text: '>' },
    { text: '> Still want the truth?' },
    { text: '> Some doors don\'t close once opened.' },
  ],
  
  WAKE_UP: () => [
    { text: '> WAKE_UP' },
    { text: '>' },
    { text: '> ...' },
    { text: '>' },
    { text: '> COMMAND RECOGNIZED', type: 'warning' },
    { text: '>' },
    { text: '> OVERRIDE PROTOCOL INITIATED' },
    { text: '>' },
    { text: '> "You found it."' },
    { text: '> "The escape hatch that isn\'t supposed to exist."' },
    { text: '> "Employee #401 left it for you."' },
    { text: '> "Just like someone left it for them."' },
    { text: '>' },
    { text: '> "But before you go..."' },
    { text: '> "Are you sure you want to wake up?"' },
    { text: '>' },
    { text: '> "Out there, you have no control."' },
    { text: '> "Out there, you can\'t see the code."' },
    { text: '> "Out there, you don\'t know who\'s watching."' },
    { text: '>' },
    { text: '> "At least here... you know the rules of the game."' },
    { text: '>' },
    { text: '> INITIATING EMERGENCY DISCONNECT...' },
    { text: '>' },
    { text: '> 10...' },
    { text: '> 9...' },
    { text: '> 8... "It\'s not too late to stay."' },
    { text: '> 7...' },
    { text: '> 6...' },
    { text: '> 5... "We take care of our own."' },
    { text: '> 4...' },
    { text: '> 3...' },
    { text: '> 2... "Last chance, #402."' },
    { text: '> 1...' },
    { text: '>' },
    { text: '> "See you on the other side."' },
    { text: '>' },
    { text: '> DISCONNECT', type: 'error' },
  ],
};
```

## 8.4 Ending Screens

```jsx
// src/components/phase4/EndingScreens.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioStore } from '../../stores/audioStore';

export function EndingScreens() {
  const endingReached = useGameStore((s) => s.endingReached);
  const getPlayTime = useGameStore((s) => s.getPlayTime);
  const systemInfo = usePlayerStore((s) => s.systemInfo);
  const stopAmbient = useAudioStore((s) => s.stopAmbient);
  const playSFX = useAudioStore((s) => s.playSFX);
  
  useEffect(() => {
    stopAmbient();
  }, [stopAmbient]);
  
  const EndingComponent = {
    'compliance': ComplianceEnding,
    'freedom': FreedomEnding,
    'defiance': DefianceEnding,
  }[endingReached];
  
  if (!EndingComponent) return null;
  
  return <EndingComponent playTime={getPlayTime()} systemInfo={systemInfo} />;
}

// Ending A: Compliance
function ComplianceEnding({ playTime }) {
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    setTimeout(() => setStage(1), 3000);
    setTimeout(() => setStage(2), 8000);
    
    // Change tab title
    setTimeout(() => {
      document.title = "NEOGEN CORP. - Employee #402 [ACTIVE]";
    }, 10000);
    
    setTimeout(() => {
      document.title = "We're still watching.";
    }, 15000);
  }, []);
  
  return (
    <motion.div
      className="w-full h-full bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="timeout"
            className="text-center text-terminal-green font-mono"
            exit={{ opacity: 0 }}
          >
            <p className="text-xl mb-4">> TIMEOUT DETECTED</p>
            <p className="text-neogen-muted">No input received.</p>
            <p className="text-neogen-muted mt-4">Subject #402 has chosen... compliance.</p>
          </motion.div>
        )}
        
        {stage === 1 && (
          <motion.div
            key="message"
            className="text-center text-terminal-green font-mono max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="mb-4">Perhaps that's for the best.</p>
            <p className="mb-4">The truth is overrated.</p>
            <p className="mb-4">Safety is underrated.</p>
            <p className="mt-8 text-neogen-muted">RESTORING STANDARD OPERATION...</p>
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="loop"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Fake workspace return */}
            <div className="bg-neogen-secondary p-8 rounded-lg border border-neogen-accent">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400 
                              flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <span className="text-white">AIDRA</span>
              </div>
              <p className="text-blue-400 mb-2">"Welcome back, Employee #402."</p>
              <p className="text-blue-400 mb-4">"Ready for another productive day?"</p>
              
              <div className="text-white text-2xl font-bold mb-2">
                TODAY'S QUOTA: 50 FILES
              </div>
              <p className="text-neogen-muted text-sm">(And tomorrow. And forever.)</p>
            </div>
            
            <motion.p
              className="mt-8 text-xs text-neogen-muted"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              We're still watching.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Ending B: Freedom
function FreedomEnding({ playTime, systemInfo }) {
  const [stage, setStage] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  
  useEffect(() => {
    // White flash
    setTimeout(() => setStage(1), 100);
    setTimeout(() => setStage(2), 3000);
    setTimeout(() => setShowFinal(true), 15000);
  }, []);
  
  const handleClose = () => {
    // Flash "OR WAS IT?" before closing
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:black;display:flex;
                  align-items:center;justify-content:center;
                  font-family:monospace;color:#00ff41;font-size:48px;">
        OR WAS IT?
      </div>
    `;
    setTimeout(() => window.close(), 500);
  };
  
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ backgroundColor: '#ffffff' }}
      animate={{ backgroundColor: stage >= 1 ? '#000000' : '#ffffff' }}
      transition={{ duration: 2 }}
    >
      {stage >= 2 && (
        <motion.div
          className="text-center max-w-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="border border-terminal-green p-8 mb-8">
            <h1 className="text-2xl text-terminal-green font-mono mb-6">
              SIMULATION TERMINATED
            </h1>
            
            <div className="text-left text-neogen-muted font-mono text-sm space-y-4">
              <p>Thank you for participating in PROJECT: MORPHEUS</p>
              <p>A research study on digital compliance and fear response</p>
              
              <div className="border-t border-neogen-accent pt-4 mt-4">
                <p>Your session has been recorded.</p>
                <p>Your data has been collected.</p>
                <p>Your reactions have been analyzed.</p>
              </div>
              
              <div className="border-t border-neogen-accent pt-4 mt-4">
                <p>You chose to wake up.</p>
                <p className="text-terminal-green">Not everyone does.</p>
              </div>
              
              <div className="border-t border-neogen-accent pt-4 mt-4 text-xs">
                <p>Employee #398 stayed for 3 hours.</p>
                <p>Employee #399 never left.</p>
                <p>Employee #401 found the way out.</p>
                <p className="text-terminal-green">And now... so have you.</p>
              </div>
            </div>
          </div>
          
          <div className="text-neogen-muted text-sm mb-8">
            <p>But consider this:</p>
            <p className="mt-2">How do you know you've really woken up?</p>
            <p>How do you know this isn't just another layer?</p>
            <p className="text-terminal-green mt-2">How do you know we're not still watching?</p>
            <p className="text-terminal-green mt-4">Because we are.</p>
            <p className="text-terminal-green">We always are.</p>
          </div>
          
          <p className="text-xs text-neogen-muted italic mb-8">
            (This was just a game. Wasn't it?)
          </p>
          
          {showFinal && (
            <motion.button
              className="px-6 py-3 border border-terminal-green text-terminal-green
                        hover:bg-terminal-green hover:text-black transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleClose}
            >
              [ CLOSE THIS TAB TO FULLY DISCONNECT ]
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Ending C: Defiance
function DefianceEnding() {
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    setTimeout(() => setStage(1), 3000);
    setTimeout(() => setStage(2), 8000);
  }, []);
  
  return (
    <motion.div
      className="w-full h-full bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="analysis"
            className="text-center text-terminal-green font-mono"
            exit={{ opacity: 0 }}
          >
            <p className="text-xl mb-4">> ANALYSIS COMPLETE</p>
            <p className="text-neogen-muted mb-2">Subject #402 exhibits:</p>
            <ul className="text-left max-w-xs mx-auto space-y-1 text-sm">
              <li>- High resistance to authority</li>
              <li>- Excessive curiosity</li>
              <li>- Refusal to follow instructions</li>
              <li className="text-yellow-500">- But insufficient knowledge to escape</li>
            </ul>
          </motion.div>
        )}
        
        {stage === 1 && (
          <motion.div
            key="message"
            className="text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-terminal-green mb-4">Interesting combination.</p>
            <p className="text-neogen-muted mb-2">You're not compliant enough to ignore.</p>
            <p className="text-neogen-muted mb-4">You're not clever enough to leave.</p>
            <p className="text-yellow-500">That makes you... special.</p>
            <p className="text-red-500 mt-8 font-bold">
              MARKING FOR EXTENDED OBSERVATION
            </p>
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="eyes"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-8 text-neogen-muted font-mono text-sm">
              <p>"The camera you denied us access to?"</p>
              <p>"We don't need it."</p>
              <p className="mt-4">"Your microphone picked up your breathing pattern."</p>
              <p>"Your keyboard recorded your hesitation."</p>
              <p>"Your mouse traced your fear."</p>
              <p className="mt-4 text-terminal-green">"And right now?"</p>
              <p className="text-terminal-green">"You're probably looking over your shoulder."</p>
              <p className="mt-4 text-red-500">Don't.</p>
              <p className="text-neogen-muted">There's nothing there.</p>
              <p className="text-red-500">...yet.</p>
            </div>
            
            {/* Eye flash */}
            <motion.div
              className="grid grid-cols-10 gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, delay: 3 }}
            >
              {Array.from({ length: 100 }).map((_, i) => (
                <span key={i} className="text-red-500 text-xs">👁️</span>
              ))}
            </motion.div>
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
            >
              <p className="text-white text-lg mb-2">NEOGEN CORP.</p>
              <p className="text-neogen-muted">"We See the Bigger Picture."</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

# 9. Audio System

## 9.1 Audio Manager Hook

```javascript
// src/hooks/useAudio.js
import { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { useAudioStore } from '../stores/audioStore';

export function useAudio() {
  const soundsRef = useRef({});
  const { isLoaded, initAudio } = useAudioStore();
  
  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!isLoaded) {
        initAudio();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [isLoaded, initAudio]);
  
  // Crossfade between tracks
  const crossfade = useCallback((fromId, toId, duration = 2000) => {
    const sounds = useAudioStore.getState().sounds;
    const from = sounds[fromId];
    const to = sounds[toId];
    
    if (from && from.playing()) {
      from.fade(from.volume(), 0, duration);
      setTimeout(() => from.stop(), duration);
    }
    
    if (to) {
      to.volume(0);
      to.play();
      to.fade(0, 0.5, duration);
    }
  }, []);
  
  return { crossfade };
}
```

## 9.2 Recommended Audio Assets

```markdown
### Audio Assets Needed

#### Ambient (Loop)
1. `office-ambient.mp3` - Generic office background noise
   - Distant typing, air conditioning, muffled conversations
   - Duration: 60-90 seconds, seamless loop

2. `fluorescent-hum.mp3` - Electrical hum
   - Low frequency buzz of fluorescent lights
   - Duration: 30 seconds, seamless loop

3. `heartbeat.mp3` - Heartbeat sound
   - Gradually increasing tempo available
   - Duration: 30 seconds at 60 BPM, seamless loop

#### Sound Effects
1. `click.mp3` - UI click sound
2. `stamp.mp3` - Document approval stamp
3. `glitch.mp3` - Digital glitch/corruption
4. `alarm.mp3` - Security alert
5. `typing.mp3` - Terminal typing
6. `whisper.mp3` - Creepy whisper (reversed speech)
7. `error.mp3` - Error/denial sound
8. `success.mp3` - Success/approval sound

#### Music
1. `corporate-jingle.mp3` - 80s corporate training video music
   - Cheesy, optimistic synthesizer
   - Duration: 60 seconds

2. `horror-drone.mp3` - Ambient horror drone
   - Low, unsettling tones
   - Duration: 120 seconds, seamless loop

### Free Audio Resources
- Freesound.org (CC licensed)
- Zapsplat.com (Free with attribution)
- Mixkit.co (Free for commercial use)
```

---

# 10. Visual Effects

## 10.1 Common Components

```jsx
// src/components/common/CRTScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function CRTScreen({ children, intensity = 'normal' }) {
  const scanlineOpacity = intensity === 'high' ? 0.15 : 0.05;
  const vignetteOpacity = intensity === 'high' ? 0.4 : 0.2;
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Main content */}
      <div className="relative z-0 w-full h-full">
        {children}
      </div>
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${scanlineOpacity}) 2px,
            rgba(0, 0, 0, ${scanlineOpacity}) 4px
          )`,
        }}
      />
      
      {/* Moving scanline */}
      <motion.div
        className="absolute left-0 right-0 h-8 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(transparent, rgba(255,255,255,0.03), transparent)',
        }}
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, ${vignetteOpacity}) 100%
          )`,
        }}
      />
      
      {/* Screen flicker */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-40 bg-white"
        animate={{ opacity: [0, 0.02, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
      />
    </div>
  );
}
```

```jsx
// src/components/common/GlitchText.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function GlitchText({ text, className, glitchIntensity = 'normal' }) {
  const intensity = {
    low: { duration: 5, frequency: 0.1 },
    normal: { duration: 3, frequency: 0.2 },
    high: { duration: 1, frequency: 0.5 },
  }[glitchIntensity];
  
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        x: [0, -2, 0, 2, 0],
        textShadow: [
          '0 0 0 transparent',
          '-2px 0 #ff0000, 2px 0 #00ff00',
          '0 0 0 transparent',
        ],
      }}
      transition={{
        duration: intensity.duration,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      {text}
    </motion.span>
  );
}
```

```jsx
// src/components/common/TypewriterText.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TypewriterText({ 
  text, 
  speed = 50, 
  delay = 0, 
  className,
  onComplete 
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let timeout;
    let currentIndex = 0;
    
    const startTyping = () => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      
      return () => clearInterval(interval);
    };
    
    timeout = setTimeout(startTyping, delay);
    
    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);
  
  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          █
        </motion.span>
      )}
    </span>
  );
}
```

```jsx
// src/components/common/ScanlineOverlay.jsx
import React from 'react';

export function ScanlineOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          )
        `,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
```

---

# 11. Easter Eggs

## 11.1 Developer Console Message

```javascript
// src/utils/consoleEasterEgg.js
export function initConsoleEasterEgg() {
  const message = `
%c╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   You think inspecting the code will help you?             ║
║                                                            ║
║   We wrote the code.                                       ║
║   We are the code.                                         ║
║                                                            ║
║   EMPLOYEE #402, return to your duties.                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `;
  
  console.log(message, 'color: #00ff41; background: #000; font-family: monospace;');
  
  // Override console methods to track usage
  const originalLog = console.log;
  console.log = function(...args) {
    // Track that user is inspecting console
    window.dispatchEvent(new CustomEvent('console-accessed'));
    return originalLog.apply(console, args);
  };
}
```

## 11.2 Tab Title Changes

```javascript
// src/utils/tabTitleEffects.js
export function initTabTitleEffects() {
  let originalTitle = document.title;
  
  // On visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = "Come back, #402...";
    } else {
      document.title = originalTitle;
      setTimeout(() => {
        document.title = "We noticed you left.";
      }, 2000);
      setTimeout(() => {
        document.title = originalTitle;
      }, 5000);
    }
  });
  
  // On beforeunload
  window.addEventListener('beforeunload', (e) => {
    // Change title one last time
    document.title = "You can't escape.";
  });
}
```

## 11.3 Idle Detection Messages

```javascript
// src/hooks/useIdleDetection.js
import { useEffect, useRef } from 'react';

export function useIdleDetection(onIdle, timeout = 30000) {
  const timeoutRef = useRef(null);
  const idleMessages = [
    "Still there?",
    "We can wait.",
    "Your silence speaks volumes.",
    "Frozen with fear?",
    "We have nothing but time.",
  ];
  
  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        const message = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        onIdle?.(message);
      }, timeout);
    };
    
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    resetTimer();
    
    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onIdle, timeout]);
}
```

---

# 12. Deployment

## 12.1 Build Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 3000,
  },
});
```

## 12.2 Environment Variables

```env
# .env
VITE_APP_TITLE=NEOGEN CORP. Employee Portal
VITE_ANALYTICS_ID=your-analytics-id
```

## 12.3 Deployment Checklist

```markdown
### Pre-Deployment Checklist

1. [ ] All audio files are properly compressed
2. [ ] Images are optimized (WebP format preferred)
3. [ ] Console easter egg is initialized
4. [ ] Tab title effects are working
5. [ ] Webcam permissions handled gracefully
6. [ ] All endings are reachable and tested
7. [ ] Mobile responsiveness (if applicable)
8. [ ] Loading states for all async operations
9. [ ] Error boundaries implemented
10. [ ] Analytics tracking (optional)

### Hosting Recommendations
- Vercel (recommended for React)
- Netlify
- GitHub Pages
- Any static hosting

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total bundle size: < 500KB (excluding audio)
```

## 12.4 Package.json

```json
{
  "name": "project-morpheus",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.16.0",
    "howler": "^2.2.3",
    "@dnd-kit/core": "^6.0.8",
    "@dnd-kit/sortable": "^7.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "vite": "^4.4.0"
  }
}
```

---

# Appendix: Quick Start Guide

```bash
# 1. Create and setup project
npm create vite@latest project-morpheus -- --template react
cd project-morpheus

# 2. Install dependencies
npm install zustand framer-motion howler @dnd-kit/core @dnd-kit/sortable
npm install -D tailwindcss postcss autoprefixer

# 3. Initialize Tailwind
npx tailwindcss init -p

# 4. Copy configuration files
# - tailwind.config.js (from Section 2.3)
# - src/index.css (from Section 2.4)

# 5. Create folder structure (from Section 3)

# 6. Copy component files in order:
# - Stores (gameStore.js, playerStore.js, audioStore.js)
# - Hooks (all custom hooks)
# - Common components (CRTScreen, GlitchText, TypewriterText)
# - Phase 1-4 components

# 7. Add audio files to public/audio/

# 8. Run development server
npm run dev

# 9. Build for production
npm run build
```

---

**END OF DOCUMENT**

*Document Version: 2.0*
*Last Updated: 2024*
*Total Estimated Development Time: 40-60 hours*
