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

    // Phase 2 Progress - Emotion Classification
    currentFileIndex: 0,
    classificationPhase: 1, // 1-4 for emotion classification phases
    tutorialComplete: false,
    filesProcessed: 0,
    veraOverrideCount: 0, // How many times V.E.R.A. overrode player's choice
    playerResistanceCount: 0, // How many times player resisted V.E.R.A.

    // Player Data
    sessionStartTime: null,

    // Webcam (Lockdown / Mirror scenes)
    webcamAllowed: false,

    // Ending (TerminalScene -> EndingScreens)
    endingReached: null, // 'compliance' | 'freedom' | 'defiance'
    terminalCommandsUsed: [],
    complianceScore: 0,
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

            setSessionStartTime: (time) => set({
                sessionStartTime: time ?? Date.now(),
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

            setClassificationPhase: (phase) => set({ classificationPhase: phase }),
            
            recordVeraOverride: () => set((state) => ({
                veraOverrideCount: state.veraOverrideCount + 1,
                complianceScore: Math.min(100, state.complianceScore + 5),
            })),
            
            recordPlayerResistance: () => set((state) => ({
                playerResistanceCount: state.playerResistanceCount + 1,
                complianceScore: Math.max(0, state.complianceScore - 10),
            })),

            setWebcamPermission: (allowed) => set({ webcamAllowed: allowed }),

            getPlayTime: () => {
                const start = get().sessionStartTime;
                return start ? Math.floor((Date.now() - start) / 1000) : 0;
            },

            setEnding: (ending) => set({ endingReached: ending, currentScene: 'ending' }),
            useTerminalCommand: (command) => set((state) => ({
                terminalCommandsUsed: [...(state.terminalCommandsUsed || []), command],
            })),
            getComplianceScore: () => get().complianceScore ?? 0,
            setComplianceScore: (score) => set({ complianceScore: score }),

            // Reset
            resetGame: () => set(initialState),
        }),
        { name: 'morpheus-game' }
    )
);
