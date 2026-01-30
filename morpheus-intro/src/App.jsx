import React, { useState, useEffect } from 'react';
import OpeningSequence from './components/OpeningSequence';
import ContractModal from './components/ContractModal';
import IdentityVerification from './components/IdentityVerification';
import WorkplaceScene from './components/WorkplaceScene';
import GlitchProfile from './components/GlitchProfile';
import ResistanceScene from './components/ResistanceScene';
import LockdownScene from './components/LockdownScene';
import ChaosScene from './components/ChaosScene';
import TerminalScene from './components/TerminalScene';

import CensorTask from './components/CensorTask';
import MessengerEvent from './components/MessengerEvent';
import NightShiftTask from './components/NightShiftTask';

import ClingyTab from './components/MicroInteractions/ClingyTab';
import CookieTrap from './components/MicroInteractions/CookieTrap';
import TimeDisplay from './components/MicroInteractions/TimeDisplay';
import BiometricCursor from './components/MicroInteractions/BiometricCursor';
import GaslightingCaptcha from './components/MicroInteractions/GaslightingCaptcha';
import ReviewPopup from './components/MicroInteractions/ReviewPopup';
import StorageFull from './components/Episodes/StorageFull';
import DigitalLunch from './components/Episodes/DigitalLunch';
import PasswordReset from './components/Episodes/PasswordReset';
import PeerReview from './components/Episodes/PeerReview';
import SystemUpdate from './components/Episodes/SystemUpdate';
import AdOverlay from './components/Episodes/AdOverlay';
import EmailTrap from './components/Episodes/EmailTrap';
import MirrorSite from './components/Episodes/MirrorSite';
import PaperJam from './components/Episodes/PaperJam';
import Impossible2FA from './components/Episodes/Impossible2FA';

function App() {
  const [phase, setPhase] = useState('opening');
  // Random event states
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showStorageFull, setShowStorageFull] = useState(false); // Episode 4 (Priority)
  const [showAd, setShowAd] = useState(false); // Episode 6
  const [showEmail, setShowEmail] = useState(false); // Episode 7
  const [showMirror, setShowMirror] = useState(false); // Episode 8 (triggered by icon?)

  // High stress phases
  const isHighStress = ['resistance', 'lockdown', 'chaos', 'nightshift', 'glitch'].includes(phase);
  const stressLevel = isHighStress ? 2 : (['messenger'].includes(phase) ? 1 : 0);

  // Expanded Phase Chain:
  // opening -> contract -> verification -> workplace ->
  // (Episodes: DigitalLunch -> PasswordReset -> PeerReview) ->
  // censor -> messenger -> (Episodes: StorageFull -> SystemUpdate) -> 
  // nightshift -> glitch -> (Episodes: PaperJam) ->
  // resistance -> lockdown -> chaos -> terminal

  useEffect(() => {
    // Random triggers for episodes that are overlay-based or time-based
    // But for the structured flow, we'll chain them via onComplete.

    // Trigger "Storage Full" specifically during Messenger or Nightshift?
    // User asked for Priority on Storage Full. Let's slot it early or trigger it.
    // Let's make StorageFull happen RIGHT AFTER Censor, before Messenger.
  }, [phase]);

  return (
    <>
      <ClingyTab />
      <CookieTrap />
      <TimeDisplay />
      <BiometricCursor stressLevel={stressLevel} />

      {showCaptcha && <GaslightingCaptcha onComplete={() => setShowCaptcha(false)} />}
      {showReview && <ReviewPopup onClose={() => setShowReview(false)} />}
      {showAd && <AdOverlay onComplete={() => setShowAd(false)} />}

      {/* Episodes Triggers could be manual for now, or chained */}

      <div className="scan-line"></div>

      {phase === 'opening' && (
        <OpeningSequence onComplete={() => setPhase('contract')} />
      )}

      {phase === 'contract' && (
        <ContractModal onAgree={() => setPhase('verification')} />
      )}

      {phase === 'verification' && (
        <IdentityVerification onComplete={() => setPhase('workplace')} />
      )}

      {phase === 'workplace' && (
        <WorkplaceScene onComplete={() => setPhase('digital_lunch')} />
      )}

      {/* --- Phase 1: Adaptation --- */}
      {phase === 'digital_lunch' && (
        <DigitalLunch onComplete={() => setPhase('password_reset')} />
      )}

      {phase === 'password_reset' && (
        <PasswordReset onComplete={() => setPhase('peer_review')} />
      )}

      {phase === 'peer_review' && (
        <PeerReview onComplete={() => setPhase('censor')} />
      )}

      {/* --- Routine Continued --- */}
      {phase === 'censor' && (
        <CensorTask onComplete={() => setPhase('storage_full')} />
      )}

      {/* --- Phase 2: Erosion (Priority) --- */}
      {phase === 'storage_full' && (
        <StorageFull onComplete={() => setPhase('messenger')} />
      )}

      {phase === 'messenger' && (
        <MessengerEvent onComplete={() => setPhase('system_update')} />
      )}

      {phase === 'system_update' && (
        <SystemUpdate onComplete={() => setPhase('email_trap')} />
      )}

      {phase === 'email_trap' && (
        <EmailTrap onComplete={() => setPhase('nightshift')} />
      )}

      {/* --- Phase 3 --- */}
      {phase === 'nightshift' && (
        <NightShiftTask onComplete={() => setPhase('paper_jam')} />
      )}

      {phase === 'paper_jam' && (
        <PaperJam onComplete={() => setPhase('mirror_site')} />
      )}

      {phase === 'mirror_site' && (
        <MirrorSite onComplete={() => setPhase('glitch')} />
      )}

      {/* --- Climax --- */}
      {phase === 'glitch' && (
        <GlitchProfile onComplete={() => setPhase('resistance')} />
      )}

      {phase === 'resistance' && (
        <ResistanceScene onComplete={() => setPhase('lockdown')} />
      )}

      {phase === 'lockdown' && (
        <LockdownScene onComplete={() => setPhase('chaos')} />
      )}

      {phase === 'chaos' && (
        <ChaosScene onComplete={() => setPhase('terminal')} />
      )}

      {phase === 'terminal' && (
        <TerminalScene />
      )}

      {/* Global Trap: Impossible 2FA (Logout Button usually triggers this, but we'll add a hidden trigger or random) */}
      {/* For demo, we can just trigger it if someone clicks a fake logout */}
    </>
  );
}

export default App;
