'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    audio.volume = 0.4;
    audioRef.current = audio;
    setVisible(true);

    return () => {
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
        // Autoplay blocked by browser
      }
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative group"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
            boxShadow: '0 8px 24px rgba(201,168,76,0.5)',
          }}
          title={playing ? 'Pause music' : 'Play music'}
        >
          {/* Pulse ring when playing */}
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(212,175,55,0.4)' }}
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <span className="text-2xl relative z-10">{playing ? '⏸' : '🎵'}</span>
        </button>

        {/* Tooltip */}
        <div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: '#FFD700',
            fontFamily: 'var(--font-cinzel)',
          }}
        >
          {playing ? 'Pause' : 'Play'} Music
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
