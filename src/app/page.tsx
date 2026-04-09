'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EnvelopeScreen from '@/components/invitation/EnvelopeScreen';
import SelectionScreen from '@/components/invitation/SelectionScreen';
import InvitationCard from '@/components/invitation/InvitationCard';
import LocationSection from '@/components/invitation/LocationSection';
import MusicPlayer from '@/components/invitation/MusicPlayer';
import { getWeddingData } from '@/lib/wedding-store';
import { WeddingData } from '@/types/wedding';

type View = 'envelope' | 'selection' | 'invitation' | 'location';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.35 } },
};

export default function HomePage() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [view, setView] = useState<View>('envelope');

  useEffect(() => {
    setData(getWeddingData());
  }, []);

  // Browser back button support
  useEffect(() => {
    window.history.replaceState({ view: 'envelope' }, '');
    const onPopState = (e: PopStateEvent) => {
      setView((e.state?.view as View) || 'envelope');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (newView: View) => {
    window.history.pushState({ view: newView }, '');
    setView(newView);
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
    <>
      <main>
        <AnimatePresence mode="wait">

          {view === 'envelope' && (
            <motion.div key="envelope" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <EnvelopeScreen
                initials={data.initials}
                groomName={data.groomName}
                brideName={data.brideName}
                onOpen={() => setTimeout(() => navigate('selection'), 700)}
              />
            </motion.div>
          )}

          {view === 'selection' && (
            <motion.div key="selection" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <SelectionScreen
                groomName={data.groomName}
                brideName={data.brideName}
                onSelectInvitation={() => navigate('invitation')}
                onSelectLocation={() => navigate('location')}
              />
            </motion.div>
          )}

          {view === 'invitation' && (
            <motion.div key="invitation" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <InvitationCard
                data={data}
                onBack={() => window.history.back()}
                onLocation={() => navigate('location')}
              />
            </motion.div>
          )}

          {view === 'location' && (
            <motion.div key="location" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <LocationSection
                mainVenue={data.mainVenue}
                homeAddress={data.homeAddress}
                onBack={() => window.history.back()}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Music player — outside <main> (which has overflow-x:hidden) so fixed works */}
      {view === 'invitation' && data?.musicEnabled && (
        <MusicPlayer enabled={data.musicEnabled} musicUrl={data.musicUrl} />
      )}
    </>
  );
}
