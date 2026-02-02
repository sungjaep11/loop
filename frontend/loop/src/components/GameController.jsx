import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';

// Phase 0: Prologue Components
import { PrologueScene } from './phase0/PrologueScene';
import { VirtualDesktop } from './phase0/VirtualDesktop';

// Phase 1 Components
import OpeningSequence from './OpeningSequence';
import BootSequence from './BootSequence';
import CorporateVideo from './CorporateVideo';
import ContractModal from './ContractModal';

// Phase 2 Components
import WorkspaceScene from './phase2/WorkspaceScene';

// Phase 3 Components (Awakening)
import { ResignationForm } from './phase3/ResignationForm';
import { LockdownSequence } from './phase3/LockdownSequence';
import { GlitchScene } from './GlitchScene';

// Phase 4 Components (Truth)
import { InvestigationDesktop } from './phase4/InvestigationDesktop';
import { MirrorScene } from './phase4/MirrorScene';
import { TerminalScene } from './phase4/TerminalScene';
import { EndingScreens } from './phase4/EndingScreens';
import { DebugSceneSwitcher } from './DebugSceneSwitcher';

export function GameController() {
    const currentScene = useGameStore((state) => state.currentScene);
    const setScene = useGameStore((state) => state.setScene);
    const endingReached = useGameStore((state) => state.endingReached);

    const renderScene = () => {
        switch (currentScene) {
            // === PROLOGUE & SETUP ===
            case 'opening':
                // Brand intro -> Email notification
                return <OpeningSequence onComplete={() => setScene('prologue')} />;
            case 'prologue':
                // Job Offer Email
                return <PrologueScene onComplete={() => setScene('boot')} />;
            case 'boot':
                // System Boot -> Virtual OS
                return <BootSequence onComplete={() => setScene('desktop')} />;
            case 'desktop':
                // Registration & Install
                return <VirtualDesktop onComplete={() => setScene('video')} />;

            // === ONBOARDING ===
            case 'video':
                // Corporate Indoctrination
                return <CorporateVideo onComplete={() => setScene('contract')} />;
            case 'contract':
                // Employment Contract
                return <ContractModal onAgree={() => setScene('workspace')} />;

            // === PHASE 2: WORK ===
            case 'workspace':
                // Main Game Loop (Phase 1-3)
                // Passing onComplete for when the "game" breaks or ends
                return <WorkspaceScene onComplete={() => setScene('investigation')} />;

            // === PHASE 3: AWAKENING ===
            case 'glitch':
                // System crash / VERA encounter
                return <GlitchScene onComplete={() => setScene('false_normalcy')} />;

            case 'false_normalcy':
                // "False Normalcy" (Recovery Mode)
                return <WorkspaceScene mode="recovery" onComplete={() => setScene('resignation')} />;

            case 'resignation':
                // Attempt to leave
                return <ResignationForm />;

            case 'lockdown':
                // Verification checkpoint
                return <LockdownSequence />;

            // === PHASE 4: TRUTH ===
            case 'investigation':
                // Hidden Desktop containing puzzles
                return <InvestigationDesktop onComplete={() => setScene('terminal')} />;

            case 'mirror':
                return <MirrorScene />;
            case 'terminal':
                // Final interaction
                return <TerminalScene />;

            case 'ending':
                return <EndingScreens />;

            default:
                if (endingReached) {
                    return <EndingScreens />;
                }
                console.warn('Unknown scene:', currentScene);
                return (
                    <div className="text-white bg-red-900 p-4">
                        Error: Unknown scene "{currentScene}"
                        <button className="block mt-4 border p-2" onClick={() => setScene('boot')}>Return to Boot</button>
                    </div>
                );
        }
    };

    console.log('GameController render:', currentScene);

    return (
        <>
            <DebugSceneSwitcher />
            <AnimatePresence mode="wait">
                {renderScene()}
            </AnimatePresence>
        </>
    );
}
