'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'petal' | 'star' | 'rect';
}

const COLORS = [
  '#FFD700', '#FFA500', '#FFB6C1', '#FF69B4',
  '#DDA0DD', '#F0E68C', '#FFDAB9', '#FFC0CB',
  '#E6E6FA', '#98FB98',
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 30 + 30,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 10 + 6,
    rotation: Math.random() * 360,
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 0.8,
    shape: (['circle', 'petal', 'star', 'rect'] as const)[
      Math.floor(Math.random() * 4)
    ],
  }));
}

function ParticleShape({ shape, color, size }: { shape: Particle['shape']; color: string; size: number }) {
  if (shape === 'petal') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <ellipse cx="10" cy="10" rx="5" ry="9" fill={color} opacity="0.85"
          transform="rotate(15 10 10)" />
      </svg>
    );
  }
  if (shape === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <polygon
          points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8"
          fill={color} opacity="0.85"
        />
      </svg>
    );
  }
  if (shape === 'rect') {
    return (
      <div
        style={{
          width: size * 0.6,
          height: size,
          background: color,
          opacity: 0.85,
          borderRadius: '2px',
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0.85,
      }}
    />
  );
}

interface ParticlesProps {
  active: boolean;
}

export default function Particles({ active }: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles(50));
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{
            y: 0,
            x: 0,
            opacity: 1,
            rotate: p.rotation,
            scale: 0,
          }}
          animate={{
            y: [0, -200 - Math.random() * 200],
            x: [(Math.random() - 0.5) * 200],
            opacity: [1, 1, 0],
            rotate: p.rotation + 360,
            scale: [0, 1, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        >
          <ParticleShape shape={p.shape} color={p.color} size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}
