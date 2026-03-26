'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaxSeal from './WaxSeal';
import Particles from './Particles';

type Phase = 'idle' | 'cracking' | 'opening' | 'done';

interface EnvelopeScreenProps {
  initials: string;
  groomName: string;
  brideName: string;
  onOpen: () => void;
}

export default function EnvelopeScreen({
  initials,
  groomName,
  brideName,
  onOpen,
}: EnvelopeScreenProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [showParticles, setShowParticles] = useState(false);

  const handleSealCrack = () => {
    setPhase('cracking');
    setTimeout(() => {
      setPhase('opening');
      setShowParticles(true);
      setTimeout(() => {
        setPhase('done');
        onOpen();
      }, 1600);
    }, 700);
  };

  const isOpening = phase === 'opening' || phase === 'done';
  const isCracked = phase === 'cracking' || isOpening;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden wedding-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FFB6C1 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 right-16 text-4xl opacity-20 select-none">✿</div>
        <div className="absolute bottom-1/4 left-16 text-4xl opacity-20 select-none">✿</div>
        <div className="absolute top-16 right-1/3 text-2xl opacity-15 select-none">❀</div>
        <div className="absolute bottom-20 left-1/3 text-2xl opacity-15 select-none">❀</div>
      </div>

      {/* Header text */}
      <motion.div
        className="mb-12 text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p
          className="text-sm uppercase tracking-[4px] mb-2"
          style={{ color: 'rgba(160,120,60,0.8)', fontFamily: 'var(--font-cinzel)' }}
        >
          You are cordially invited
        </p>
        <div className="flex items-center gap-3 justify-center">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37', fontSize: '20px' }}>❧</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      {/* Envelope wrapper */}
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className="relative z-10"
            style={{ perspective: '1200px' }}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={
              phase === 'idle'
                ? {
                    y: [0, -12, 0],
                    opacity: 1,
                    scale: 1,
                    transition: {
                      opacity: { duration: 0.8 },
                      scale: { duration: 0.8 },
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                    },
                  }
                : { y: 0, opacity: 1, scale: 1 }
            }
            exit={{ scale: 0.85, opacity: 0, y: 40, transition: { duration: 0.5 } }}
          >
            <EnvelopeBody
              phase={phase}
              initials={initials}
              isCracked={isCracked}
              isOpening={isOpening}
              onSealCrack={handleSealCrack}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Names below envelope */}
      <motion.div
        className="mt-10 text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <p
          className="text-3xl"
          style={{
            fontFamily: 'var(--font-script), cursive',
            background: 'linear-gradient(135deg, #C9A84C, #FFD700, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {groomName} & {brideName}
        </p>
      </motion.div>

      <Particles active={showParticles} />
    </div>
  );
}

function EnvelopeBody({
  phase,
  initials,
  isCracked,
  isOpening,
  onSealCrack,
}: {
  phase: Phase;
  initials: string;
  isCracked: boolean;
  isOpening: boolean;
  onSealCrack: () => void;
}) {
  const envelopeWidth = 380;
  const envelopeHeight = 260;

  return (
    <div
      className="relative select-none"
      style={{
        width: envelopeWidth,
        height: envelopeHeight,
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))',
      }}
    >
      {/* Envelope back (body) */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(160deg, #FFF8E7 0%, #FDF3D0 50%, #FAE8B0 100%)',
          boxShadow: 'inset 0 0 30px rgba(180,140,60,0.15)',
        }}
      >
        {/* Envelope diagonal fold lines on body */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${envelopeWidth} ${envelopeHeight}`}
          preserveAspectRatio="none"
        >
          {/* Bottom-left to center triangle line */}
          <line
            x1="0" y1={envelopeHeight}
            x2={envelopeWidth / 2} y2={envelopeHeight / 2}
            stroke="rgba(180,140,60,0.25)" strokeWidth="1"
          />
          {/* Bottom-right to center triangle line */}
          <line
            x1={envelopeWidth} y1={envelopeHeight}
            x2={envelopeWidth / 2} y2={envelopeHeight / 2}
            stroke="rgba(180,140,60,0.25)" strokeWidth="1"
          />
          {/* Bottom fold line */}
          <line
            x1="0" y1={envelopeHeight * 0.7}
            x2={envelopeWidth} y2={envelopeHeight * 0.7}
            stroke="rgba(180,140,60,0.15)" strokeWidth="0.5"
          />
          {/* Subtle inner border */}
          <rect
            x="8" y="8"
            width={envelopeWidth - 16} height={envelopeHeight - 16}
            rx="6"
            fill="none"
            stroke="rgba(212,175,55,0.3)"
            strokeWidth="0.8"
          />
        </svg>

        {/* Corner ornaments */}
        {[
          { top: '10px', left: '10px' },
          { top: '10px', right: '10px' },
          { bottom: '10px', left: '10px' },
          { bottom: '10px', right: '10px' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute text-sm"
            style={{ ...pos, color: 'rgba(212,175,55,0.4)', lineHeight: 1 }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Envelope flap (top triangle - opens backward) */}
      <motion.div
        className="absolute left-0 right-0 origin-top overflow-hidden"
        style={{
          top: 0,
          height: '55%',
          transformOrigin: 'center bottom',
          transformStyle: 'preserve-3d',
          zIndex: 10,
        }}
        animate={
          isOpening
            ? { rotateX: -175, transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] } }
            : { rotateX: 0 }
        }
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(160deg, #FFF5D6 0%, #FCE9A8 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            boxShadow: isOpening ? 'none' : '0 8px 16px rgba(0,0,0,0.1)',
          }}
        >
          {/* Flap inner texture */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 143">
            <defs>
              <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,245,210,0.5)" />
                <stop offset="100%" stopColor="rgba(250,225,130,0.3)" />
              </linearGradient>
            </defs>
            <polygon
              points="0,0 380,0 190,143"
              fill="url(#flapGrad)"
            />
            {/* Gold border on flap */}
            <polyline
              points="0,0 380,0 190,143"
              fill="none"
              stroke="rgba(212,175,55,0.25)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </motion.div>

      {/* Wax Seal */}
      <WaxSeal
        initials={initials}
        onCrack={onSealCrack}
        cracked={isCracked}
      />

      {/* Card peeking out when opening */}
      {isOpening && (
        <motion.div
          className="absolute left-4 right-4 bottom-4 rounded-md overflow-hidden flex items-center justify-center"
          style={{ zIndex: 5 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -40, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className="w-full h-32 rounded-md flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FFF9F0, #FFF0D6)',
              border: '1.5px solid rgba(212,175,55,0.4)',
            }}
          >
            <span
              className="text-sm"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-cinzel)', letterSpacing: '2px' }}
            >
              Wedding Invitation
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
