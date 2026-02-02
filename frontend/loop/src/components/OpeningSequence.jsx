import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useAudioStore } from '../stores/audioStore';
import { TypewriterText } from './common/TypewriterText';
import { GlitchText } from './common/GlitchText';

const OpeningSequence = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const playSFX = useAudioStore((s) => s.playSFX);

  useEffect(() => {
    const timers = [];

    // Stage 0: Pure black (1 seconds)
    timers.push(setTimeout(() => setStage(1), 1000));

    // Stage 1: Intro text (5 seconds)
    timers.push(setTimeout(() => {
      playSFX('type');
      setStage(2);
    }, 6000));

    // Stage 2: Title reveal (4 seconds)
    timers.push(setTimeout(() => {
      playSFX('glitch');
      setStage(3);
    }, 10000));

    // Stage 3: Subtitle (3 seconds, then transition)
    timers.push(setTimeout(() => {
      console.log('OpeningSequence: Calling onComplete');
      onComplete();
    }, 14000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, playSFX]);

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, background: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <AnimatePresence mode="wait">
        {/* Stage 1: Intro text */}
        {stage === 1 && (
          <motion.div
            key="intro"
            className="text-center font-mono text-terminal-green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: "'Space Mono', monospace", color: '#00ff41', textAlign: 'center' }}
          >
            <TypewriterText
              text="S.A.V.E. EMPLOYEE ORIENTATION SYSTEM v4.02"
              speed={30}
              onComplete={() => playSFX('type')}
              className="text-sm mb-2"
            />
            <br />
            <TypewriterText
              text="LOADING PROFILE..."
              speed={30}
              delay={1500}
            />
            <br />
            <div style={{ color: 'red', marginTop: '10px' }}>
              <TypewriterText
                text="ERROR: PREVIOUS EMPLOYEE DATA CORRUPTED"
                speed={30}
                delay={2500}
                onComplete={() => playSFX('error')}
              />
            </div>
            <br />
            <TypewriterText
              text="INITIALIZING NEW SESSION..."
              speed={30}
              delay={4000}
            />
          </motion.div>
        )}

        {/* Stage 2 & 3: Title */}
        {stage >= 2 && (
          <motion.div
            key="title"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ textAlign: 'center' }}
          >
            <GlitchText
              text="S.A.V.E."
              className="text-6xl md:text-8xl font-display font-bold text-white tracking-wider"
              intensity={stage === 2 ? 'high' : 'low'}
              style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold', fontFamily: "'Arial', sans-serif", letterSpacing: '0.5em' }}
            />

            {stage >= 3 && (
              <motion.p
                style={{ marginTop: '2rem', fontSize: '1.2rem', color: '#888', fontFamily: "'Space Mono', monospace" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                "Secure Archive for Valuable Emotions"
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to skip (after 5 seconds) */}
      {stage >= 1 && (
        <motion.button
          style={{ position: 'absolute', bottom: '30px', background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontFamily: "'Space Mono', monospace" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          onClick={onComplete}
        >
          [ CLICK TO SKIP ]
        </motion.button>
      )}
    </motion.div>
  );
};

export default OpeningSequence;
