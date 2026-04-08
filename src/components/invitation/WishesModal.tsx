'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Wish {
  id: string;
  name: string;
  message: string;
  emoji: string;
  createdAt: string;
}

const WISHES_KEY = 'wedding_wishes_mv';

const EMOJI_OPTIONS = [
  '❤️','💛','💚','💙','💜','🤍','🧡',
  '💖','💗','💓','💞','💝','💘','💟',
  '🌸','🌺','💐','🌹','🌼','🌻',
  '🎊','🎉','🥂','✨','🌟','⭐','🙏',
  '😊','🥰','😍','🤗','🎁','🎀',
];

async function fetchWishes(): Promise<Wish[]> {
  try {
    const res = await fetch('/api/wishes');
    if (res.ok) return res.json();
  } catch {}
  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(WISHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function postWish(wish: { name: string; message: string; emoji: string }): Promise<Wish | null> {
  try {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wish),
    });
    if (res.ok) return res.json();
  } catch {}
  // Fallback: save to localStorage
  const local: Wish = { id: `l_${Date.now()}`, ...wish, createdAt: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(WISHES_KEY);
    const arr: Wish[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(WISHES_KEY, JSON.stringify([...arr, local]));
  } catch {}
  return local;
}

interface WishesModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WishesModal({ open, onClose }: WishesModalProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [tab, setTab] = useState<'list' | 'add'>('list');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setTab('list');
      fetchWishes().then(setWishes);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    const saved = await postWish({ name: name.trim(), message: message.trim(), emoji: selectedEmoji });
    if (saved) {
      const updated = await fetchWishes();
      setWishes(updated);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTab('list');
      setName('');
      setMessage('');
      setSelectedEmoji('❤️');
    }, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-[8%] bottom-[6%] z-50 mx-auto max-w-md flex flex-col rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #FFF9EE 0%, #FFF0D0 100%)',
              border: '1.5px solid rgba(212,175,55,0.45)',
              boxShadow: '0 24px 64px rgba(100,60,10,0.35)',
            }}
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Gold top bar */}
            <div style={{ height: 5, flexShrink: 0, background: 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)' }} />

            {/* Header */}
            <div className="px-6 pt-5 pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-xs uppercase tracking-[4px]" style={{ color: 'rgba(90,50,5,0.9)', fontFamily: 'var(--font-cinzel)' }}>
                    Shubhkaamnaayen
                  </p>
                  <h2 className="text-2xl" style={{ fontFamily: 'var(--font-script), cursive', color: '#8B6914' }}>
                    Best Wishes
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#8B6914', border: '1px solid rgba(212,175,55,0.3)' }}
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl overflow-hidden mt-3" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                {(['list', 'add'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-1 py-2 text-xs font-bold"
                    style={{
                      fontFamily: 'var(--font-cinzel)',
                      letterSpacing: '1px',
                      background: tab === t ? 'linear-gradient(135deg, #C9A84C, #FFD700)' : 'transparent',
                      color: tab === t ? '#3d2000' : 'rgba(90,55,5,0.85)',
                    }}
                  >
                    {t === 'list' ? `💌 Wishes (${wishes.length})` : '✍️ Add Mine'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {tab === 'list' ? (
                  <motion.div
                    key="list"
                    className="h-full overflow-y-auto px-4 pb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-3 pt-1">
                      {wishes.map((wish, i) => (
                        <motion.div
                          key={wish.id}
                          className="rounded-2xl p-4"
                          style={{
                            background: 'rgba(255,248,225,0.85)',
                            border: '1px solid rgba(212,175,55,0.25)',
                            boxShadow: '0 2px 12px rgba(180,130,40,0.08)',
                          }}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 mt-0.5">{wish.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm mb-1" style={{ color: '#3d2800', fontFamily: 'var(--font-playfair)' }}>
                                {wish.name}
                              </p>
                              <p className="text-sm leading-relaxed" style={{ color: '#4a2e00', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
                                "{wish.message}"
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    className="h-full overflow-y-auto px-4 pb-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence>
                      {submitted ? (
                        <motion.div
                          className="flex flex-col items-center justify-center h-full gap-4 py-16"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="text-6xl">🎊</div>
                          <p className="text-xl" style={{ fontFamily: 'var(--font-script), cursive', color: '#8B6914' }}>
                            Shukriya!
                          </p>
                          <p className="text-sm text-center" style={{ color: '#4a2e00', fontFamily: 'var(--font-playfair)' }}>
                            Aapki wishes add ho gayi ✨
                          </p>
                        </motion.div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          {/* Name */}
                          <div>
                            <label className="block text-xs uppercase tracking-[2px] mb-1.5" style={{ color: 'rgba(90,55,5,0.9)', fontFamily: 'var(--font-cinzel)' }}>
                              Aapka Naam
                            </label>
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name..."
                              maxLength={40}
                              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                              style={{
                                background: 'rgba(255,248,225,0.9)',
                                border: '1.5px solid rgba(212,175,55,0.35)',
                                color: '#5a3e10',
                                fontFamily: 'var(--font-playfair)',
                              }}
                            />
                          </div>

                          {/* Message */}
                          <div>
                            <label className="block text-xs uppercase tracking-[2px] mb-1.5" style={{ color: 'rgba(90,55,5,0.9)', fontFamily: 'var(--font-cinzel)' }}>
                              Aapki Wishes
                            </label>
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Write your heartfelt wishes..."
                              maxLength={200}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                              style={{
                                background: 'rgba(255,248,225,0.9)',
                                border: '1.5px solid rgba(212,175,55,0.35)',
                                color: '#5a3e10',
                                fontFamily: 'var(--font-playfair)',
                              }}
                            />
                            <p className="text-right text-xs mt-1" style={{ color: 'rgba(90,55,5,0.55)' }}>{message.length}/200</p>
                          </div>

                          {/* Emoji picker */}
                          <div>
                            <label className="block text-xs uppercase tracking-[2px] mb-2" style={{ color: 'rgba(90,55,5,0.9)', fontFamily: 'var(--font-cinzel)' }}>
                              Emoji Chuno
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {EMOJI_OPTIONS.map((em) => (
                                <button
                                  key={em}
                                  onClick={() => setSelectedEmoji(em)}
                                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                                  style={{
                                    background: selectedEmoji === em
                                      ? 'linear-gradient(135deg, #C9A84C, #FFD700)'
                                      : 'rgba(255,248,225,0.8)',
                                    border: selectedEmoji === em
                                      ? '2px solid #FFD700'
                                      : '1px solid rgba(212,175,55,0.25)',
                                    transform: selectedEmoji === em ? 'scale(1.15)' : 'scale(1)',
                                  }}
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Submit */}
                          <button
                            onClick={handleSubmit}
                            disabled={!name.trim() || !message.trim()}
                            className="w-full py-4 rounded-xl font-bold text-sm mt-2"
                            style={{
                              background: name.trim() && message.trim()
                                ? 'linear-gradient(135deg, #C9A84C, #FFD700)'
                                : 'rgba(212,175,55,0.25)',
                              color: name.trim() && message.trim() ? '#3d2000' : 'rgba(90,55,5,0.55)',
                              fontFamily: 'var(--font-cinzel)',
                              letterSpacing: '1px',
                              boxShadow: name.trim() && message.trim() ? '0 4px 16px rgba(180,130,40,0.3)' : 'none',
                            }}
                          >
                            {selectedEmoji} Wish Bhejo
                          </button>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
