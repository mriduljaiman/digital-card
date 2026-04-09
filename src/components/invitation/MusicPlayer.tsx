'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface MusicPlayerProps {
  enabled: boolean;
  musicUrl?: string;
}

export default function MusicPlayer({ enabled, musicUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    setVisible(true);

    // Auto-start: user has already interacted (clicked envelope seal)
    // so browser allows autoplay here
    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — button still shows for manual play
      }
    };

    // Small delay so card animation completes first
    const timer = setTimeout(tryAutoPlay, 1200);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = '';
    };
  }, [enabled, musicUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        // ignore
      }
    }
  };

  if (!visible) return null;

  return createPortal(
    <motion.button
      onClick={togglePlay}
      className="fixed bottom-6 left-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative"
      style={{
        background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
        boxShadow: '0 8px 24px rgba(201,168,76,0.5)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'rgba(212,175,55,0.35)' }}
        animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <span className="text-2xl relative z-10">{playing ? '⏸' : '🎵'}</span>
    </motion.button>,
    document.body
  );
}
