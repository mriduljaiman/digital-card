'use client';

import { motion } from 'framer-motion';
import { WeddingData } from '@/types/wedding';
import EventSection from './EventSection';
import FamilySection from './FamilySection';
import PhotoGallery from './PhotoGallery';
import MusicPlayer from './MusicPlayer';
import InstallPrompt from './InstallPrompt';

interface InvitationCardProps {
  data: WeddingData;
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

export default function InvitationCard({ data }: InvitationCardProps) {
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

      {/* Hero Section */}
      <HeroSection data={data} />

      {/* Ornamental divider */}
      <OrnamentDivider />

      {/* Events */}
      <EventSection events={data.events} />

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
          <OrnamentDivider />
          <PhotoGallery photos={data.photos} />
        </>
      )}

      {/* Footer */}
      <InvitationFooter data={data} />

      {/* Music Player */}
      {data.musicEnabled && (
        <MusicPlayer enabled={data.musicEnabled} musicUrl={data.musicUrl} />
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />

    </motion.div>
  );
}

function HeroSection({ data }: { data: WeddingData }) {
  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div style={{ color: 'rgba(212,175,55,0.5)', fontSize: '24px' }}>⌄</div>
      </motion.div>
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
