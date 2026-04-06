'use client';

import { motion } from 'framer-motion';

interface SelectionScreenProps {
  groomName: string;
  brideName: string;
  onSelectInvitation: () => void;
  onSelectLocation: () => void;
}

export default function SelectionScreen({
  groomName,
  brideName,
  onSelectInvitation,
  onSelectLocation,
}: SelectionScreenProps) {
  return (
    <div className="min-h-screen wedding-bg flex flex-col items-center justify-center px-5 py-10">

      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-3"
          style={{ color: 'rgba(160,120,60,0.75)', fontFamily: 'var(--font-cinzel)' }}
        >
          Shubh Vivah
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-script), cursive',
            fontSize: 'clamp(2.4rem, 9vw, 4rem)',
            background: 'linear-gradient(135deg, #8B6914, #C9A84C, #FFD700, #C9A84C, #8B6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            filter: 'drop-shadow(0 2px 4px rgba(180,130,40,0.25))',
            lineHeight: 1.15,
          }}
        >
          {groomName} &amp; {brideName}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37', fontSize: '18px' }}>✦</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      {/* Two Cards */}
      <div className="w-full max-w-sm flex flex-col gap-5">

        {/* Card 1 — Invitation */}
        <motion.button
          className="w-full text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSelectInvitation}
        >
          <div
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFF8E7, #FFF0D0)',
              border: '1.5px solid rgba(212,175,55,0.45)',
              boxShadow: '0 8px 32px rgba(180,130,40,0.15)',
            }}
          >
            {/* Gold top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)' }} />

            <div className="flex items-center gap-5">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(255,213,79,0.15))',
                  border: '1.5px solid rgba(212,175,55,0.4)',
                }}
              >
                💌
              </div>

              <div className="flex-1">
                <p
                  className="text-xs uppercase tracking-[3px] mb-1"
                  style={{ color: 'rgba(160,120,60,0.65)', fontFamily: 'var(--font-cinzel)' }}
                >
                  Open
                </p>
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: '#6B5010',
                  }}
                >
                  Invitation Card
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'rgba(107,80,16,0.6)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                >
                  Events, family & gallery
                </p>
              </div>

              {/* Arrow */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #FFD700)' }}
              >
                <span style={{ color: '#3d2000', fontSize: '16px', fontWeight: 'bold' }}>›</span>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Card 2 — Location */}
        <motion.button
          className="w-full text-left"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSelectLocation}
        >
          <div
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFF0F5, #FFE4EC)',
              border: '1.5px solid rgba(220,140,165,0.45)',
              boxShadow: '0 8px 32px rgba(180,80,100,0.1)',
            }}
          >
            {/* Pink top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #E88FAA, #FFB6C1, #E88FAA)' }} />

            <div className="flex items-center gap-5">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(220,140,165,0.2), rgba(255,182,193,0.15))',
                  border: '1.5px solid rgba(220,140,165,0.4)',
                }}
              >
                📍
              </div>

              <div className="flex-1">
                <p
                  className="text-xs uppercase tracking-[3px] mb-1"
                  style={{ color: 'rgba(160,80,100,0.65)', fontFamily: 'var(--font-cinzel)' }}
                >
                  View
                </p>
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: '#6B2040',
                  }}
                >
                  Location
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'rgba(107,32,64,0.6)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                >
                  Sangeet, Wedding &amp; Haldi venues
                </p>
              </div>

              {/* Arrow */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E88FAA, #FFB6C1)' }}
              >
                <span style={{ color: '#3d0020', fontSize: '16px', fontWeight: 'bold' }}>›</span>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bottom ornament */}
      <motion.div
        className="mt-10 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
        <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '20px' }}>✿</span>
        <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
      </motion.div>
    </div>
  );
}
