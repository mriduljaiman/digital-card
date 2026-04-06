'use client';

import QRCodeDisplay from '@/components/invitation/QRCodeDisplay';
import { motion } from 'framer-motion';

export default function QRPage() {
  return (
    <div className="min-h-screen wedding-bg flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-2"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Wedding Invitation
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-script), cursive',
            fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
            background: 'linear-gradient(135deg, #8B6914, #C9A84C, #FFD700, #C9A84C, #8B6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          Mridul &amp; Vijaya
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37' }}>✦</span>
          <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      <QRCodeDisplay
        url="https://mridulvijaya.vercel.app/"
        initials="M&V"
      />

      <motion.p
        className="mt-8 text-xs text-center max-w-xs"
        style={{
          color: 'rgba(160,120,60,0.5)',
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Share this QR code with guests — scanning it will open the digital wedding invitation
      </motion.p>
    </div>
  );
}
