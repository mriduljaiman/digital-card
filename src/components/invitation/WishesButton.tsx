'use client';

import { motion } from 'framer-motion';

interface WishesButtonProps {
  onClick: () => void;
  count: number;
}

export default function WishesButton({ onClick, count }: WishesButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed right-4 z-40 flex flex-col items-center justify-center"
      style={{
        top: 'calc(50% - 28px)',
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
        boxShadow: '0 6px 24px rgba(180,130,40,0.45), 0 2px 8px rgba(0,0,0,0.15)',
        border: '2px solid rgba(255,255,255,0.5)',
        willChange: 'transform',
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      whileTap={{ scale: 0.92 }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>💌</span>

      {/* Count badge */}
      {count > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
          style={{
            background: '#C0392B',
            fontSize: 9,
            fontWeight: 'bold',
            fontFamily: 'var(--font-cinzel)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </motion.button>
  );
}
