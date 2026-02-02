import React from 'react';
import { motion } from 'framer-motion';

export const GlitchText = ({ text, as: Component = 'h1', className = '', intensity = 'medium' }) => {
  const glitchVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 0 },
    glitch: {
      x: [0, -2, 2, -1, 1, 0, -3, 3, 0],
      textShadow: [
        '0 0 0 transparent',
        '-2px 0 red, 2px 0 blue',
        '2px 0 red, -2px 0 blue',
        '0 0 0 transparent',
      ],
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: intensity === 'high' ? 0.2 : (intensity === 'low' ? 2 : 0.5),
        ease: "easeInOut",
        repeatDelay: intensity === 'high' ? 0.1 : (intensity === 'low' ? 3 : 1)
      }
    }
  };

  return (
    <Component className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <motion.span
        variants={glitchVariants}
        initial="hidden"
        animate="glitch"
      >
        {text}
      </motion.span>
    </Component>
  );
};
