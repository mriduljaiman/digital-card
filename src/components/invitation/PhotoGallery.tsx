'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoGalleryProps {
  photos: string[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-[5px] mb-3"
          style={{ color: 'rgba(160,120,60,0.7)', fontFamily: 'var(--font-cinzel)' }}
        >
          Moments Together
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
          Our Gallery
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37' }}>✦</span>
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      {/* Masonry-style grid */}
      <div className="max-w-5xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            className="break-inside-avoid cursor-pointer relative group overflow-hidden rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelected(photo)}
          >
            {/* Gold frame */}
            <div
              className="absolute inset-0 rounded-xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ border: '2px solid rgba(212,175,55,0.6)', boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`Wedding photo ${index + 1}`}
              className="w-full h-auto object-cover rounded-xl"
              style={{ display: 'block' }}
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{ background: 'rgba(180,130,40,0.15)' }}
            >
              <div
                className="text-white text-sm px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              >
                View
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold frame */}
              <div
                className="p-2 rounded-2xl relative"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #FFD700, #C9A84C)',
                  padding: '3px',
                }}
              >
                <div className="rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected}
                    alt="Wedding photo"
                    className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                  />
                </div>
              </div>
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
