'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EnvelopeScreen from '@/components/invitation/EnvelopeScreen';
import InvitationCard from '@/components/invitation/InvitationCard';
import { getWeddingData } from '@/lib/wedding-store';
import { WeddingData } from '@/types/wedding';

export default function HomePage() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setData(getWeddingData());
  }, []);

  const handleEnvelopeOpen = () => {
    setTimeout(() => setShowCard(true), 800);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center wedding-bg">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(212,175,55,0.4)', borderTopColor: '#FFD700' }}
          />
          <p
            className="text-sm"
            style={{ color: 'rgba(212,175,55,0.6)', fontFamily: 'var(--font-cinzel)', letterSpacing: '3px' }}
          >
            Loading...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <main>
      <AnimatePresence mode="wait">
        {!showCard ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.6 } }}
          >
            <EnvelopeScreen
              initials={data.initials}
              groomName={data.groomName}
              brideName={data.brideName}
              onOpen={handleEnvelopeOpen}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <InvitationCard data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
