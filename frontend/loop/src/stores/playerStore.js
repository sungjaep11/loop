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

    // Captured photo for Employee ID (from IdentityVerification)
    capturedPhoto: null,

    // Mouse Tracking
    lastMousePosition: { x: 0, y: 0 },
    mouseVelocity: 0,
    isMouseIdle: false,

    // Actions
    setSystemInfo: (info) => set({ systemInfo: info }),

    setWebcamStream: (stream) => set({ webcamStream: stream }),
    setWebcamError: (error) => set({ webcamError: error }),
    setCapturedPhoto: (dataUrl) => set({ capturedPhoto: dataUrl }),

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
