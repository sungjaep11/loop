import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';

// Phase 0: Prologue Components
import OpeningSequence from './OpeningSequence';
import BootSequence from './BootSequence';
import CorporateVideo from './CorporateVideo';
import ContractModal from './ContractModal';
import IdentityVerification from './IdentityVerification';

// Phase 1-4: Classification Workspace
import WorkspaceScene from './phase2/WorkspaceScene';

// Phase 5: Discovery & Confrontation
import { LockdownSequence } from './phase3/LockdownSequence';
import { ResignationForm } from './phase3/ResignationForm';

// Phase 6: Truth & Ending
import { MirrorScene } from './phase4/MirrorScene';
import { TerminalScene } from './phase4/TerminalScene';
import { EndingScreens } from './phase4/EndingScreens';

// New: Glitch/Error Scene (Critical Error after Phase 4)
import { GlitchScene } from './GlitchScene';


export function GameController() {
    const currentScene = useGameStore((state) => state.currentScene);
    const setScene = useGameStore((state) => state.setScene);
    const endingReached = useGameStore((state) => state.endingReached);

    const renderScene = () => {
        switch (currentScene) {
            // === PROLOGUE (Scene 0) ===
            case 'opening':
                return <OpeningSequence onComplete={() => setScene('boot')} />;
            case 'boot':
                return <BootSequence onComplete={() => setScene('video')} />;
            case 'video':
                return <CorporateVideo onComplete={() => setScene('contract')} />;
            case 'contract':
                return <ContractModal onAgree={() => setScene('identity')} />;
            case 'identity':
                return <IdentityVerification onComplete={() => setScene('workspace')} />;
            
            // === SCENE 1: Classification Work (Phase 1-4) ===
            case 'workspace':
                // After Phase 4 elimination trigger -> glitch scene
                return <WorkspaceScene mode="normal" onComplete={() => setScene('glitch')} />;
            
            // === SCENE 2: Critical Error / V.E.R.A. Surveillance ===
            case 'glitch':
                return <GlitchScene onComplete={() => setScene('lockdown')} />;
            
            // === SCENE 3: Lockdown & Verification ===
            case 'lockdown':
                return <LockdownSequence />;
            
            // === SCENE 4: Mirror / Terminal ===
            case 'mirror':
                return <MirrorScene />;
            case 'terminal':
                return <TerminalScene />;
            
            // === False Normalcy (optional loop) ===
            case 'false_normalcy':
                return <WorkspaceScene mode="recovery" onComplete={() => setScene('resignation')} />;
            case 'resignation':
                return <ResignationForm />;
            
            // === ENDING ===
            case 'ending':
                return <EndingScreens />;
            
            default:
                if (endingReached) {
                    return <EndingScreens />;
                }
                return <OpeningSequence onComplete={() => setScene('boot')} />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            {renderScene()}
        </AnimatePresence>
    );
}

// Note: We need to ensure TerminalScene triggers a scene change to 'ending' 
// OR we check endingReached state globally.
// A cleaner way is to have TerminalScene call setScene('ending') AFTER setting the ending type.

