'use client';

import { motion } from 'framer-motion';

interface LocationCard {
  title: string;
  subtitle: string;
  icon: string;
  venue: string;
  address: string;
  date: string;
  mapQuery: string;
  color: 'gold' | 'pink' | 'green';
}

interface LocationSectionProps {
  mainVenue: string;
  homeAddress: string;
  onBack: () => void;
}

export default function LocationSection({ mainVenue, homeAddress, onBack }: LocationSectionProps) {
  const locations: LocationCard[] = [
    {
      title: 'Mahila Sangeet',
      subtitle: 'Saturday, 18 April 2026 · 6:00 PM',
      icon: '🎵',
      venue: 'Chanda Marriage Garden',
      address: 'Chanda Marriage Garden, Viratnagar',
      date: 'Sat, 18 April 2026',
      mapQuery: 'Chanda Marriage Garden Viratnagar',
      color: 'gold',
    },
    {
      title: 'Wedding',
      subtitle: 'Monday, 20 April 2026',
      icon: '💒',
      venue: 'Dayal Garden',
      address: mainVenue,
      date: 'Mon, 20 April 2026',
      mapQuery: 'Dayal Garden Viratnagar',
      color: 'pink',
    },
    {
      title: 'Haldi · Mehndi · Chak Bhat',
      subtitle: 'Sunday, 19 April 2026',
      icon: '🌼',
      venue: 'Ghar',
      address: homeAddress,
      date: 'Sun, 19 April 2026',
      mapQuery: homeAddress,
      color: 'green',
    },
  ];

  const colorStyles = {
    gold: {
      bg: 'linear-gradient(135deg, #FFF8E7, #FFF0D0)',
      border: 'rgba(212,175,55,0.45)',
      bar: 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)',
      icon: 'rgba(212,175,55,0.18)',
      iconBorder: 'rgba(212,175,55,0.4)',
      title: '#6B5010',
      sub: 'rgba(107,80,16,0.6)',
      btn: 'linear-gradient(135deg, #C9A84C, #FFD700)',
      btnText: '#3d2000',
      shadow: 'rgba(180,130,40,0.13)',
    },
    pink: {
      bg: 'linear-gradient(135deg, #FFF0F5, #FFE4EC)',
      border: 'rgba(220,140,165,0.45)',
      bar: 'linear-gradient(90deg, #E88FAA, #FFB6C1, #E88FAA)',
      icon: 'rgba(220,140,165,0.18)',
      iconBorder: 'rgba(220,140,165,0.4)',
      title: '#6B2040',
      sub: 'rgba(107,32,64,0.6)',
      btn: 'linear-gradient(135deg, #E88FAA, #FFB6C1)',
      btnText: '#3d0020',
      shadow: 'rgba(180,80,100,0.1)',
    },
    green: {
      bg: 'linear-gradient(135deg, #F0FFF4, #E0F5E8)',
      border: 'rgba(100,160,120,0.45)',
      bar: 'linear-gradient(90deg, #6aab83, #a8d5b5, #6aab83)',
      icon: 'rgba(100,160,120,0.18)',
      iconBorder: 'rgba(100,160,120,0.4)',
      title: '#2d5a3d',
      sub: 'rgba(45,90,61,0.6)',
      btn: 'linear-gradient(135deg, #6aab83, #a8d5b5)',
      btnText: '#1a3a28',
      shadow: 'rgba(80,140,100,0.1)',
    },
  };

  const openMaps = (query: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen wedding-bg flex flex-col px-5 py-8">

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 self-start"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{ minHeight: '44px' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}
        >
          <span style={{ color: '#C9A84C', fontSize: '18px' }}>‹</span>
        </div>
        <span
          className="text-sm"
          style={{ color: 'rgba(160,120,60,0.8)', fontFamily: 'var(--font-cinzel)', letterSpacing: '1px' }}
        >
          Back
        </span>
      </motion.button>

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-2"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Venue Details
        </p>
        <h1
          className="text-3xl"
          style={{
            fontFamily: 'var(--font-script), cursive',
            background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          Location
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37' }}>✦</span>
          <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      {/* Location Cards */}
      <div className="flex flex-col gap-5 max-w-sm mx-auto w-full">
        {locations.map((loc, index) => {
          const s = colorStyles[loc.color];
          return (
            <motion.div
              key={loc.title}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: s.bg,
                border: `1.5px solid ${s.border}`,
                boxShadow: `0 8px 28px ${s.shadow}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
            >
              {/* Color bar top */}
              <div className="h-1" style={{ background: s.bar }} />

              <div className="p-5">
                {/* Title row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: s.icon, border: `1.5px solid ${s.iconBorder}` }}
                  >
                    {loc.icon}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-base leading-tight"
                      style={{ fontFamily: 'var(--font-playfair)', color: s.title }}
                    >
                      {loc.title}
                    </h3>
                    <p
                      className="text-xs mt-0.5"
                      style={{ fontFamily: 'var(--font-cinzel)', color: s.sub, letterSpacing: '0.5px' }}
                    >
                      {loc.subtitle}
                    </p>
                  </div>
                </div>

                {/* Venue info */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">🏛️</span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'var(--font-playfair)', color: s.title }}
                    >
                      {loc.venue}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">📍</span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-playfair)', color: s.sub }}
                    >
                      {loc.address}
                    </span>
                  </div>
                </div>

                {/* Maps button */}
                <button
                  onClick={() => openMaps(loc.mapQuery)}
                  className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity active:opacity-80"
                  style={{
                    background: s.btn,
                    color: s.btnText,
                    fontFamily: 'var(--font-cinzel)',
                    letterSpacing: '1px',
                    fontSize: '12px',
                  }}
                >
                  <span>🗺️</span>
                  Open in Google Maps
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '18px' }}>✿</span>
          <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>
    </div>
  );
}
