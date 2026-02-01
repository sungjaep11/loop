import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';

// Phase 1 Components
import OpeningSequence from './OpeningSequence';
import BootSequence from './BootSequence';
import CorporateVideo from './CorporateVideo';
import ContractModal from './ContractModal';

// Phase 2 Components
import WorkspaceScene from './phase2/WorkspaceScene';

// Phase 3 Components
import { ResignationForm } from './phase3/ResignationForm';
import { LockdownSequence } from './phase3/LockdownSequence';

// Phase 4 Components
import { MirrorScene } from './phase4/MirrorScene';
import { TerminalScene } from './phase4/TerminalScene';
import { EndingScreens } from './phase4/EndingScreens';


export function GameController() {
    const currentScene = useGameStore((state) => state.currentScene);
    const setScene = useGameStore((state) => state.setScene);
    const endingReached = useGameStore((state) => state.endingReached);

    const renderScene = () => {
        switch (currentScene) {
            case 'opening':
                return <OpeningSequence onComplete={() => setScene('boot')} />;
            case 'boot':
                return <BootSequence onComplete={() => setScene('video')} />;
            case 'video':
                return <CorporateVideo onComplete={() => setScene('contract')} />;
            case 'contract':
                return <ContractModal onAgree={() => setScene('workspace')} />;
            case 'workspace':
                // Phase 2 Normal -> (implied glitch) -> Phase 3 False Normalcy
                return <WorkspaceScene mode="normal" onComplete={() => setScene('false_normalcy')} />;
            case 'false_normalcy':
                // Phase 3.1
                return <WorkspaceScene mode="recovery" onComplete={() => setScene('resignation')} />;
            case 'resignation':
                // Phase 3.2
                return <ResignationForm />;
            case 'lockdown':
                // Phase 3.3
                return <LockdownSequence />;
            case 'mirror':
                return <MirrorScene />;
            case 'terminal':
                return <TerminalScene />;
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
            {/* Always render EndingScreens if an ending is reached? No, that would overlay. */}
            {/* Better: Check ending state in renderScene or have the store trigger a scene change. */}
        </AnimatePresence>
    );
}

// Note: We need to ensure TerminalScene triggers a scene change to 'ending' 
// OR we check endingReached state globally.
// A cleaner way is to have TerminalScene call setScene('ending') AFTER setting the ending type.

