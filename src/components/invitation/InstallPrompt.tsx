'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 4 seconds
      setTimeout(() => setShow(true), 4000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShow(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {show && !installed && (
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255,248,225,0.97), rgba(255,240,195,0.97))',
              border: '1.5px solid rgba(212,175,55,0.5)',
              boxShadow: '0 12px 40px rgba(180,130,40,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #FFD700)' }}
            >
              💌
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-sm leading-tight"
                style={{ color: '#6B5010', fontFamily: 'var(--font-cinzel)', letterSpacing: '0.5px' }}
              >
                Save to Home Screen
              </p>
              <p
                className="text-xs mt-0.5 opacity-70"
                style={{ color: '#6B5010', fontFamily: 'var(--font-playfair)' }}
              >
                Open the invitation anytime
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
                  color: '#3d2000',
                  fontFamily: 'var(--font-cinzel)',
                  letterSpacing: '0.5px',
                }}
              >
                Install
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-3 py-1.5 rounded-lg text-xs"
                style={{
                  border: '1px solid rgba(180,130,40,0.3)',
                  color: 'rgba(107,80,16,0.6)',
                  fontFamily: 'var(--font-cinzel)',
                }}
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
