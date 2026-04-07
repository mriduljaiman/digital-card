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
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 5000);
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
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              style={{
                background: 'linear-gradient(160deg, #FFF9EE 0%, #FFF0D0 100%)',
                border: '1.5px solid rgba(212,175,55,0.5)',
                boxShadow: '0 24px 60px rgba(120,80,20,0.35)',
              }}
            >
              {/* Gold top bar */}
              <div style={{ height: 5, background: 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)' }} />

              <div className="px-7 py-8 text-center">
                {/* Icon */}
                <div className="text-5xl mb-4">💌</div>

                <p
                  className="text-xs uppercase tracking-[4px] mb-2"
                  style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
                >
                  Save this Invitation
                </p>

                <h2
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: 'var(--font-script), cursive',
                    background: 'linear-gradient(135deg, #8B6914, #C9A84C, #FFD700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Add to Home Screen
                </h2>

                <p
                  className="text-sm mb-7"
                  style={{
                    color: 'rgba(100,70,20,0.65)',
                    fontFamily: 'var(--font-playfair)',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                  }}
                >
                  Install the invitation on your phone to open it anytime, even without internet.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleInstall}
                    className="w-full py-3.5 rounded-xl font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
                      color: '#3d2000',
                      fontFamily: 'var(--font-cinzel)',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 16px rgba(180,130,40,0.35)',
                    }}
                  >
                    Install Now
                  </button>
                  <button
                    onClick={() => setShow(false)}
                    className="w-full py-2.5 rounded-xl text-sm"
                    style={{
                      border: '1px solid rgba(180,130,40,0.3)',
                      color: 'rgba(107,80,16,0.55)',
                      fontFamily: 'var(--font-cinzel)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
