'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface WaxSealProps {
  initials: string;
  onCrack: () => void;
  cracked: boolean;
}

export default function WaxSeal({ initials, onCrack, cracked }: WaxSealProps) {
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = () => {
    if (cracked) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      onCrack();
    }, 400);
  };

  return (
    <AnimatePresence>
      {!cracked && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
          style={{ top: '42%' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isShaking
              ? {
                  scale: [1, 1.15, 0.95, 1.1, 0.98, 1],
                  rotate: [-3, 3, -3, 3, 0],
                  opacity: 1,
                }
              : { scale: 1, opacity: 1, rotate: 0 }
          }
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.4 }}
          onClick={handleClick}
          whileHover={!cracked && !isShaking ? { scale: 1.08 } : {}}
        >
          {/* Outer glow ring */}
          <div className="absolute w-24 h-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />

          {/* Wax seal body */}
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center select-none"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #b22222, #6B0000)',
              boxShadow: `
                0 4px 12px rgba(107,0,0,0.6),
                inset 0 2px 4px rgba(255,255,255,0.15),
                inset 0 -2px 6px rgba(0,0,0,0.4)
              `,
              border: '2px solid rgba(212,175,55,0.6)',
            }}
          >
            {/* Gold border ring */}
            <div
              className="absolute inset-1 rounded-full"
              style={{
                border: '1.5px solid rgba(212,175,55,0.5)',
              }}
            />

            {/* Decorative dots */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: 'rgba(212,175,55,0.7)',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateY(-36px) translate(-50%, -50%)`,
                }}
              />
            ))}

            {/* Initials */}
            <span
              className="text-xs font-bold text-center leading-tight z-10 relative"
              style={{
                fontFamily: 'var(--font-cinzel), Cinzel, serif',
                color: '#FFD700',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                fontSize: '11px',
                letterSpacing: '0.5px',
              }}
            >
              {initials}
            </span>

            {/* Crack overlay (shown when cracked) */}
            <AnimatePresence>
              {isShaking && (
                <motion.svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 80 80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <line x1="40" y1="40" x2="20" y2="10" stroke="#FFD700" strokeWidth="1" opacity="0.8" />
                  <line x1="40" y1="40" x2="65" y2="15" stroke="#FFD700" strokeWidth="1" opacity="0.8" />
                  <line x1="40" y1="40" x2="70" y2="55" stroke="#FFD700" strokeWidth="1" opacity="0.8" />
                  <line x1="40" y1="40" x2="15" y2="60" stroke="#FFD700" strokeWidth="1" opacity="0.8" />
                  <line x1="40" y1="40" x2="30" y2="70" stroke="#FFD700" strokeWidth="0.8" opacity="0.6" />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>

          {/* Click hint */}
          <motion.div
            className="absolute -bottom-8 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span
              className="text-xs"
              style={{ color: 'rgba(212,175,55,0.8)', fontFamily: 'var(--font-playfair)', letterSpacing: '1px' }}
            >
              tap to open
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
