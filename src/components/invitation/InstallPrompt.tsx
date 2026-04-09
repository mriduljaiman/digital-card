'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;
    setIsIOS(ios);

    // Android/Chrome: capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setInstalled(true); setShow(false); });

    // Show after 5s — works for both iOS and Android
    const timer = setTimeout(() => setShow(true), 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
      setShow(false);
    }
  };

  return (
    <AnimatePresence>
      {show && !installed && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              <div style={{ height: 5, background: 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)' }} />

              <div className="px-7 py-8 text-center">
                <div className="text-5xl mb-4">{isIOS ? '📲' : '💌'}</div>

                <p className="text-xs uppercase tracking-[4px] mb-2"
                  style={{ color: 'rgba(90,50,5,0.8)', fontFamily: 'var(--font-cinzel)' }}>
                  Save this Invitation
                </p>

                <h2 className="text-2xl mb-3"
                  style={{ fontFamily: 'var(--font-script), cursive', color: '#8B6914' }}>
                  Add to Home Screen
                </h2>

                {isIOS ? (
                  /* iOS instructions */
                  <div className="text-left space-y-3 mb-6 px-2">
                    <p className="text-sm font-bold text-center mb-4"
                      style={{ color: '#4a2e00', fontFamily: 'var(--font-playfair)' }}>
                      iPhone pe install karne ke liye:
                    </p>
                    {[
                      { step: '1', icon: '⬆️', text: 'Safari mein neeche Share button tap karo' },
                      { step: '2', icon: '➕', text: '"Add to Home Screen" select karo' },
                      { step: '3', icon: '✅', text: '"Add" tap karo — ho gaya!' },
                    ].map(({ step, icon, text }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #C9A84C, #FFD700)', color: '#3d2000' }}>
                          {step}
                        </div>
                        <p className="text-sm" style={{ color: '#4a2e00', fontFamily: 'var(--font-playfair)' }}>
                          <span className="mr-1">{icon}</span>{text}
                        </p>
                      </div>
                    ))}
                    {/* Arrow pointing down to Safari bar */}
                    <div className="text-center mt-2">
                      <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ color: '#C9A84C', fontSize: '28px' }}
                      >
                        ↓
                      </motion.div>
                      <p className="text-xs" style={{ color: 'rgba(90,50,5,0.55)', fontFamily: 'var(--font-cinzel)', letterSpacing: '1px' }}>
                        SAFARI SHARE BUTTON
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Android — always show manual Chrome instructions */
                  <div className="text-left space-y-3 mb-6 px-2">
                    <p className="text-sm font-bold text-center mb-4"
                      style={{ color: '#4a2e00', fontFamily: 'var(--font-playfair)' }}>
                      Chrome mein install karne ke liye:
                    </p>
                    {[
                      { step: '1', icon: '⋮', text: 'Chrome mein upar 3 dots (menu) tap karo' },
                      { step: '2', icon: '📲', text: '"Add to Home screen" select karo' },
                      { step: '3', icon: '✅', text: '"Add" tap karo — ho gaya!' },
                    ].map(({ step, icon, text }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #C9A84C, #FFD700)', color: '#3d2000' }}>
                          {step}
                        </div>
                        <p className="text-sm" style={{ color: '#4a2e00', fontFamily: 'var(--font-playfair)' }}>
                          <span className="mr-1 font-bold">{icon}</span>{text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {!isIOS && deferredPrompt && (
                    <button onClick={handleInstall}
                      className="w-full py-3.5 rounded-xl font-bold text-sm"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
                        color: '#3d2000',
                        fontFamily: 'var(--font-cinzel)',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 16px rgba(180,130,40,0.35)',
                      }}>
                      Quick Install ✨
                    </button>
                  )}
                  <button onClick={() => setShow(false)}
                    className="w-full py-2.5 rounded-xl text-sm"
                    style={{
                      border: '1px solid rgba(180,130,40,0.3)',
                      color: 'rgba(90,50,5,0.6)',
                      fontFamily: 'var(--font-cinzel)',
                      letterSpacing: '0.5px',
                    }}>
                    Samajh Gaya
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
