'use client';

import QRCodeDisplay from '@/components/invitation/QRCodeDisplay';
import { motion } from 'framer-motion';

const INVITE_URL = 'https://mridulvijaya.vercel.app/';

export default function QRPage() {
  return (
    <div
      className="min-h-screen wedding-bg flex flex-col items-center justify-center"
      style={{ padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 40px)' }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-6 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-3"
          style={{ color: 'rgba(90,50,5,0.85)', fontFamily: 'var(--font-cinzel)' }}
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

      {/* BIG TAP BUTTON — most prominent */}
      <motion.a
        href={INVITE_URL}
        className="w-full flex items-center justify-center gap-3 rounded-2xl mb-6"
        style={{
          maxWidth: '340px',
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #C9A84C, #FFD700, #C9A84C)',
          boxShadow: '0 8px 32px rgba(180,130,40,0.45)',
          textDecoration: 'none',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
        whileTap={{ scale: 0.96 }}
      >
        <span style={{ fontSize: '28px' }}>💌</span>
        <div className="text-left">
          <p
            className="font-bold text-base leading-tight"
            style={{ color: '#3d1800', fontFamily: 'var(--font-cinzel)', letterSpacing: '1px' }}
          >
            Open Invitation
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'rgba(61,24,0,0.65)', fontFamily: 'var(--font-playfair)' }}
          >
            Tap here to view full invitation
          </p>
        </div>
        <span style={{ color: '#3d1800', fontSize: '22px', marginLeft: 'auto' }}>›</span>
      </motion.a>

      {/* OR divider */}
      <motion.div
        className="flex items-center gap-3 w-full mb-5"
        style={{ maxWidth: '340px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.35)' }} />
        <span style={{ color: 'rgba(90,50,5,0.5)', fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '2px' }}>
          OR SCAN
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.35)' }} />
      </motion.div>

      {/* QR Code */}
      <motion.div
        className="w-full"
        style={{ maxWidth: '300px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <QRCodeDisplay url={INVITE_URL} initials="M&V" />
      </motion.div>

      <motion.p
        className="mt-4 text-xs text-center"
        style={{
          color: 'rgba(90,50,5,0.55)',
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          maxWidth: '240px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Camera se QR scan karein ya upar wala button tap karein
      </motion.p>
    </div>
  );
}
