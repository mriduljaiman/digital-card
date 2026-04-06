'use client';

import QRCodeDisplay from '@/components/invitation/QRCodeDisplay';
import { motion } from 'framer-motion';

export default function QRPage() {
  return (
    <div
      className="min-h-screen wedding-bg flex flex-col items-center justify-center"
      style={{ padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 40px)' }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-3"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Wedding Invitation
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-script), cursive',
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            background: 'linear-gradient(135deg, #8B6914, #C9A84C, #FFD700, #C9A84C, #8B6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            lineHeight: 1.2,
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

      {/* QR Code — max width so it fits any screen */}
      <div className="w-full" style={{ maxWidth: '340px' }}>
        <QRCodeDisplay
          url="https://mridulvijaya.vercel.app/"
          initials="M&V"
        />
      </div>

      {/* Footer note */}
      <motion.p
        className="mt-6 text-xs text-center"
        style={{
          color: 'rgba(160,120,60,0.5)',
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          lineHeight: 1.7,
          maxWidth: '260px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Scan this QR code to open the digital wedding invitation
      </motion.p>

      {/* Back to invitation link */}
      <motion.a
        href="/"
        className="mt-5 text-xs uppercase tracking-[3px]"
        style={{ color: 'rgba(160,120,60,0.5)', fontFamily: 'var(--font-cinzel)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ← Back to Invitation
      </motion.a>
    </div>
  );
}
