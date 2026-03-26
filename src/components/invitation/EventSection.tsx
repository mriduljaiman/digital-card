'use client';

import { motion } from 'framer-motion';
import { WeddingEvent } from '@/types/wedding';

interface EventSectionProps {
  events: WeddingEvent[];
}

function formatDate(dateStr: string): string {
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

export default function EventSection({ events }: EventSectionProps) {
  return (
    <section className="py-12 px-4">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-3"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Wedding Celebrations
        </p>
        <h2
          className="text-4xl mb-4"
          style={{
            fontFamily: 'var(--font-script), cursive',
            background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Events & Schedule
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37' }}>✦</span>
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      {/* Events Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 h-full"
        style={{
          background: 'linear-gradient(145deg, rgba(255,248,225,0.95), rgba(255,240,195,0.9))',
          border: '1.5px solid rgba(212,175,55,0.4)',
          boxShadow: '0 8px 32px rgba(180,130,40,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Top gold accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)' }}
        />

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(255,213,79,0.15))',
            border: '1.5px solid rgba(212,175,55,0.4)',
          }}
        >
          {event.icon}
        </div>

        {/* Event name */}
        <h3
          className="text-center text-xl font-bold mb-3"
          style={{
            fontFamily: 'var(--font-playfair)',
            background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {event.name}
        </h3>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8" style={{ background: 'rgba(212,175,55,0.5)' }} />
          <span style={{ color: 'rgba(212,175,55,0.6)', fontSize: '8px' }}>◆</span>
          <div className="h-px w-8" style={{ background: 'rgba(212,175,55,0.5)' }} />
        </div>

        {/* Details */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-sm"
            style={{ color: 'rgba(100,70,20,0.8)' }}>
            <span>📅</span>
            <span style={{ fontFamily: 'var(--font-playfair)' }}>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm"
            style={{ color: 'rgba(100,70,20,0.8)' }}>
            <span>🕐</span>
            <span style={{ fontFamily: 'var(--font-playfair)' }}>{event.time}</span>
          </div>
          <div className="flex items-start justify-center gap-2 text-sm mt-2"
            style={{ color: 'rgba(100,70,20,0.7)' }}>
            <span className="mt-0.5">📍</span>
            <span style={{ fontFamily: 'var(--font-playfair)' }}>{event.venue}</span>
          </div>
          {event.description && (
            <p
              className="text-xs mt-2 italic"
              style={{ color: 'rgba(100,70,20,0.6)', fontFamily: 'var(--font-playfair)' }}
            >
              {event.description}
            </p>
          )}
        </div>

        {/* Corner flourish */}
        <div
          className="absolute bottom-3 right-3 text-xs opacity-30"
          style={{ color: '#D4AF37' }}
        >
          ✦
        </div>
      </div>
    </motion.div>
  );
}
