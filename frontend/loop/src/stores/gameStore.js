import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
    // Game Phase
    currentPhase: 0, // 0: Not Started, 1: Recruitment, 2: Routine, 3: Awakening, 4: Truth
    currentScene: 'opening',

    // Phase 1 Progress
    hasWatchedVideo: false,
    hasSignedContract: false,
    contractAttempts: 0,

    // Phase 2 Progress
    currentFileIndex: 0,
    tutorialComplete: false,
    filesProcessed: 0,

    // Player Data
    sessionStartTime: null,
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

            completeBoot: () => set({ currentScene: 'video' }),

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

            processFile: (fileId, action, hesitated) => set((state) => ({
                currentFileIndex: state.currentFileIndex + 1,
                filesProcessed: state.filesProcessed + 1,
            })),

            incrementProcessed: () => set((state) => ({
                currentFileIndex: state.currentFileIndex + 1,
                filesProcessed: state.filesProcessed + 1
            })),

            // Reset
            resetGame: () => set(initialState),
        }),
        { name: 'morpheus-game' }
    )
);
