'use client';

import { motion } from 'framer-motion';
import { FamilyMember } from '@/types/wedding';

interface FamilySectionProps {
  familyMembers: FamilyMember[];
  groomName: string;
  brideName: string;
  groomFatherName: string;
  brideFatherName: string;
}

export default function FamilySection({
  familyMembers,
  groomName,
  brideName,
  groomFatherName,
  brideFatherName,
}: FamilySectionProps) {
  const groomFamily = familyMembers.filter((m) => m.side === 'groom');
  const brideFamily = familyMembers.filter((m) => m.side === 'bride');

  return (
    <section className="py-12 px-4">
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
          With the Blessings of
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
          Our Families
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37' }}>✦</span>
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Groom's Family */}
        <FamilyCard
          side="groom"
          mainName={groomName}
          fatherName={groomFatherName}
          members={groomFamily}
          index={0}
        />

        {/* Bride's Family */}
        <FamilyCard
          side="bride"
          mainName={brideName}
          fatherName={brideFatherName}
          members={brideFamily}
          index={1}
        />
      </div>
    </section>
  );
}

function FamilyCard({
  side,
  mainName,
  fatherName,
  members,
  index,
}: {
  side: 'groom' | 'bride';
  mainName: string;
  fatherName: string;
  members: FamilyMember[];
  index: number;
}) {
  const isGroom = side === 'groom';

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: isGroom ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
    >
      <div
        className="rounded-2xl p-8 text-center h-full"
        style={{
          background: isGroom
            ? 'linear-gradient(145deg, rgba(255,248,225,0.9), rgba(255,240,180,0.85))'
            : 'linear-gradient(145deg, rgba(255,240,245,0.9), rgba(255,218,228,0.85))',
          border: `1.5px solid ${isGroom ? 'rgba(212,175,55,0.4)' : 'rgba(220,150,170,0.4)'}`,
          boxShadow: isGroom
            ? '0 8px 32px rgba(180,130,40,0.1)'
            : '0 8px 32px rgba(180,80,100,0.1)',
        }}
      >
        {/* Header accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background: isGroom
              ? 'linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)'
              : 'linear-gradient(90deg, #E88FAA, #FFB6C1, #E88FAA)',
          }}
        />

        {/* Symbol */}
        <div className="text-4xl mb-3">{isGroom ? '🤵' : '👰'}</div>

        {/* Family side label */}
        <p
          className="text-xs uppercase tracking-[3px] mb-2"
          style={{
            color: isGroom ? 'rgba(160,120,60,0.7)' : 'rgba(160,80,100,0.7)',
            fontFamily: 'var(--font-cinzel)',
          }}
        >
          {isGroom ? "Groom's Family" : "Bride's Family"}
        </p>

        {/* Main name */}
        <h3
          className="text-2xl mb-1"
          style={{
            fontFamily: 'var(--font-script), cursive',
            color: isGroom ? '#8B6914' : '#8B3A52',
          }}
        >
          {mainName}
        </h3>

        {/* Father's name */}
        <p
          className="text-sm mb-6 italic"
          style={{
            color: isGroom ? 'rgba(120,90,30,0.7)' : 'rgba(140,60,80,0.7)',
            fontFamily: 'var(--font-playfair)',
          }}
        >
          S/o {fatherName}
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className="flex-1 h-px"
            style={{ background: isGroom ? 'rgba(212,175,55,0.4)' : 'rgba(200,120,150,0.4)' }}
          />
          <span style={{ color: isGroom ? 'rgba(212,175,55,0.6)' : 'rgba(200,120,150,0.6)', fontSize: '10px' }}>◆</span>
          <div
            className="flex-1 h-px"
            style={{ background: isGroom ? 'rgba(212,175,55,0.4)' : 'rgba(200,120,150,0.4)' }}
          />
        </div>

        {/* Family members */}
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-2">
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: isGroom ? '#6B5010' : '#6B2040',
                }}
              >
                {member.name}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: isGroom
                    ? 'rgba(212,175,55,0.15)'
                    : 'rgba(200,120,150,0.15)',
                  color: isGroom ? '#9A7620' : '#9A4060',
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '10px',
                  letterSpacing: '0.5px',
                }}
              >
                {member.relation}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
