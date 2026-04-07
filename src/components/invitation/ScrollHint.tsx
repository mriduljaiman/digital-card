'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollHint({ label = 'Scroll to continue' }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !scrolledPast) setVisible(true);
        else setVisible(false);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrolledPast]);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < 0) setScrolledPast(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-end pb-8 pt-4">
      <AnimatePresence>
        {visible && !scrolledPast && (
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            style={{ perspective: '400px' }}
          >
            {/* Label */}
            <motion.p
              className="text-xs uppercase tracking-[3px] mb-2"
              style={{ color: 'rgba(160,120,60,0.6)', fontFamily: 'var(--font-cinzel)' }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {label}
            </motion.p>

            {/* 3D chevron stack */}
            <div className="relative flex flex-col items-center" style={{ perspective: '300px' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    marginTop: i === 0 ? 0 : -4,
                    opacity: 1 - i * 0.25,
                    filter: `drop-shadow(0 ${2 + i * 3}px ${4 + i * 4}px rgba(212,175,55,${0.6 - i * 0.15}))`,
                  }}
                  animate={{
                    y: [0, 5, 0],
                    rotateX: [0, 8, 0],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: 'easeInOut',
                  }}
                >
                  <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                    <path
                      d="M2 2L16 13L30 2"
                      stroke="url(#gold)"
                      strokeWidth={3 - i * 0.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="gold" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#C9A84C" />
                        <stop offset="0.5" stopColor="#FFD700" />
                        <stop offset="1" stopColor="#C9A84C" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
