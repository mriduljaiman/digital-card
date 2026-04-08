'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { WeddingData } from '@/types/wedding';
import EventSection from './EventSection';
import FamilySection from './FamilySection';
import PhotoGallery from './PhotoGallery';
import MusicPlayer from './MusicPlayer';
import InstallPrompt from './InstallPrompt';
import ScrollHint from './ScrollHint';
import WishesModal from './WishesModal';
import WishesButton from './WishesButton';

interface InvitationCardProps {
  data: WeddingData;
  onBack?: () => void;
  onLocation?: () => void;
}

function formatMainDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function InvitationCard({ data, onBack, onLocation }: InvitationCardProps) {
  const [showWishes, setShowWishes] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    fetch('/api/wishes')
      .then((r) => r.json())
      .then((data: unknown[]) => setWishCount(data.length))
      .catch(() => setWishCount(5));

    // Auto-peek: scroll down after 3.5s to show there's more, then back
    const peek = setTimeout(() => {
      if (window.scrollY > 40) return; // user already scrolling
      window.scrollTo({ top: 220, behavior: 'smooth' });
      setTimeout(() => {
        if (window.scrollY < 260) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 1200);
    }, 3500);

    // Auto-show wishes popup after 25s
    const wishes = setTimeout(() => setShowWishes(true), 25000);

    return () => { clearTimeout(peek); clearTimeout(wishes); };
  }, []);

  return (
    <motion.div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFF9EE 0%, #FFF5E0 30%, #FFF0D6 60%, #FFF9EE 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Decorative background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30 10 L35 25 L30 20 L25 25 Z'/%3E%3Cpath d='M30 50 L35 35 L30 40 L25 35 Z'/%3E%3Cpath d='M10 30 L25 35 L20 30 L25 25 Z'/%3E%3Cpath d='M50 30 L35 35 L40 30 L35 25 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2"
          style={{ minHeight: '44px' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,248,225,0.85)',
              border: '1px solid rgba(212,175,55,0.4)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ color: '#8B6914', fontSize: '18px', fontWeight: 'bold' }}>‹</span>
          </div>
          <span className="text-sm font-bold" style={{ color: '#8B6914', fontFamily: 'var(--font-cinzel)', letterSpacing: '1px' }}>
            Back
          </span>
        </button>
      )}

      {/* Hero Section */}
      <HeroSection data={data} onLocation={onLocation} />

      {/* Ornamental divider */}
      <OrnamentDivider />

      {/* Events */}
      <EventSection events={data.events} />
      <ScrollHint label="See our family" />

      {/* Ornamental divider */}
      <OrnamentDivider />

      {/* Family Section */}
      <FamilySection
        familyMembers={data.familyMembers}
        groomName={data.groomName}
        brideName={data.brideName}
        groomFatherName={data.groomFatherName}
        brideFatherName={data.brideFatherName}
      />

      {/* Photo Gallery */}
      {data.photos.length > 0 && (
        <>
          <ScrollHint label="See our photos" />
          <OrnamentDivider />
          <PhotoGallery photos={data.photos} />
        </>
      )}

      <ScrollHint label="Wishes & blessings" />

      {/* Footer */}
      <InvitationFooter data={data} />

      {/* Music Player */}
      {data.musicEnabled && (
        <MusicPlayer enabled={data.musicEnabled} musicUrl={data.musicUrl} />
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Floating Wishes Button */}
      <WishesButton onClick={() => setShowWishes(true)} count={wishCount} />

      {/* Wishes Modal */}
      <WishesModal open={showWishes} onClose={() => setShowWishes(false)} />

    </motion.div>
  );
}

function HeroSection({ data, onLocation }: { data: WeddingData; onLocation?: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 60) setScrolled(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: '92vh', paddingTop: '5rem', paddingBottom: '4rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Top ornament */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="text-5xl mb-3" style={{ color: 'rgba(212,175,55,0.7)' }}>☸</div>
        <p
          className="text-xs uppercase tracking-[6px]"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Shubh Vivah
        </p>
      </motion.div>

      {/* Invitation message */}
      <motion.p
        className="max-w-lg text-base mb-8 leading-relaxed"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: 'rgba(100,70,20,0.75)',
          fontStyle: 'italic',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {data.invitationMessage}
      </motion.p>

      {/* Names - The hero element */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.9, type: 'spring', stiffness: 100 }}
      >
        <h1
          className="leading-tight"
          style={{
            fontFamily: 'var(--font-script), cursive',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            background: 'linear-gradient(135deg, #8B6914 0%, #C9A84C 30%, #FFD700 50%, #C9A84C 70%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            lineHeight: 1.1,
          }}
        >
          {data.groomName}
        </h1>
        <div className="flex items-center justify-center gap-4 my-3">
          <div
            className="h-px flex-1 max-w-24"
            style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }}
          />
          <span
            className="text-2xl"
            style={{
              fontFamily: 'var(--font-script), cursive',
              color: '#D4AF37',
            }}
          >
            &amp;
          </span>
          <div
            className="h-px flex-1 max-w-24"
            style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }}
          />
        </div>
        <h1
          className="leading-tight"
          style={{
            fontFamily: 'var(--font-script), cursive',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            background: 'linear-gradient(135deg, #8B2252 0%, #C9527C 30%, #FF6B9D 50%, #C9527C 70%, #8B2252 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
          }}
        >
          {data.brideName}
        </h1>
      </motion.div>

      {/* Wedding date */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        <div
          className="inline-flex items-center gap-4 px-8 py-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,213,79,0.1))',
            border: '1.5px solid rgba(212,175,55,0.4)',
          }}
        >
          <span style={{ color: '#D4AF37' }}>💍</span>
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: '#8B6914',
              letterSpacing: '1px',
            }}
          >
            {formatMainDate(data.weddingDate)}
          </span>
          <span style={{ color: '#D4AF37' }}>💍</span>
        </div>
      </motion.div>

      {/* Venue */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-[3px] mb-1"
          style={{ color: 'rgba(160,120,60,0.6)', fontFamily: 'var(--font-cinzel)' }}
        >
          Venue
        </p>
        <p
          className="text-xl font-semibold"
          style={{ fontFamily: 'var(--font-playfair)', color: '#6B5010' }}
        >
          {data.mainVenue}
        </p>
        <p
          className="text-sm mt-1"
          style={{ fontFamily: 'var(--font-playfair)', color: 'rgba(100,70,20,0.65)' }}
        >
          📍 {data.mainVenueAddress}
        </p>

        {onLocation && (
          <button
            onClick={onLocation}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(255,213,79,0.12))',
              border: '1.5px solid rgba(212,175,55,0.45)',
              color: '#8B6914',
              fontFamily: 'var(--font-cinzel)',
              fontSize: '11px',
              fontWeight: 'bold',
              letterSpacing: '1.5px',
            }}
          >
            <span>🗺️</span>
            <span>VIEW ALL VENUES</span>
          </button>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <motion.p
              className="text-xs uppercase tracking-[3px] mb-1"
              style={{ color: 'rgba(160,120,60,0.75)', fontFamily: 'var(--font-cinzel)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Scroll to explore
            </motion.p>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 6, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              >
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                  <path d="M1 1L11 10L21 1" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-4 px-8">
      <div className="flex-1 h-px max-w-xs" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4))' }} />
      <span className="text-2xl" style={{ color: 'rgba(212,175,55,0.5)' }}>✿</span>
      <span className="text-3xl" style={{ color: 'rgba(212,175,55,0.6)' }}>❧</span>
      <span className="text-2xl" style={{ color: 'rgba(212,175,55,0.5)' }}>✿</span>
      <div className="flex-1 h-px max-w-xs" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.4))' }} />
    </div>
  );
}

function InvitationFooter({ data }: { data: WeddingData }) {
  return (
    <footer className="py-16 px-6 text-center relative">
      {/* Top border */}
      <div
        className="w-32 h-px mx-auto mb-8"
        style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Auspicious symbol */}
        <div className="text-5xl mb-4" style={{ color: 'rgba(212,175,55,0.6)' }}>☸</div>

        <h2
          className="text-3xl mb-3"
          style={{
            fontFamily: 'var(--font-script), cursive',
            background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          We look forward to your presence
        </h2>

        <p
          className="text-sm mb-6 italic"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: 'rgba(100,70,20,0.7)',
          }}
        >
          Your blessings mean the world to us
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37' }}>✦</span>
          <span
            className="text-lg"
            style={{
              fontFamily: 'var(--font-script), cursive',
              color: '#C9A84C',
            }}
          >
            {data.groomName} &amp; {data.brideName}
          </span>
          <span style={{ color: '#D4AF37' }}>✦</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>

        <p
          className="text-xs mt-6 uppercase tracking-[3px]"
          style={{ color: 'rgba(160,120,60,0.4)', fontFamily: 'var(--font-cinzel)' }}
        >
          Made with ❤️ for a Special Day
        </p>
      </motion.div>
    </footer>
  );
}
