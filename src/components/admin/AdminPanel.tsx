'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { WeddingData, WeddingEvent, FamilyMember } from '@/types/wedding';
import {
  getWeddingData,
  saveWeddingData,
  clearWeddingData,
  compressImage,
  defaultWeddingData,
} from '@/lib/wedding-store';

const EVENT_ICONS = ['🎵', '🌼', '🌸', '💍', '💒', '🔥', '🎊', '🎶', '🥁', '🌺', '🕯️', '🎉'];

export default function AdminPanel() {
  const [data, setData] = useState<WeddingData>(defaultWeddingData);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'family' | 'photos' | 'settings'>('couple');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(getWeddingData());
  }, []);

  const handleSave = () => {
    saveWeddingData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      clearWeddingData();
      setData(defaultWeddingData);
    }
  };

  // ── Events ──────────────────────────────────────────────────────────────────
  const addEvent = () => {
    const newEvent: WeddingEvent = {
      id: Date.now().toString(),
      name: 'New Event',
      venue: '',
      date: data.weddingDate,
      time: '6:00 PM',
      icon: '🎉',
    };
    setData((d) => ({ ...d, events: [...d.events, newEvent] }));
  };

  const updateEvent = (id: string, field: keyof WeddingEvent, value: string) => {
    setData((d) => ({
      ...d,
      events: d.events.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const removeEvent = (id: string) => {
    setData((d) => ({ ...d, events: d.events.filter((e) => e.id !== id) }));
  };

  // ── Family ──────────────────────────────────────────────────────────────────
  const addFamilyMember = (side: 'groom' | 'bride') => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: '',
      relation: '',
      side,
    };
    setData((d) => ({ ...d, familyMembers: [...d.familyMembers, newMember] }));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setData((d) => ({
      ...d,
      familyMembers: d.familyMembers.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  };

  const removeFamilyMember = (id: string) => {
    setData((d) => ({ ...d, familyMembers: d.familyMembers.filter((m) => m.id !== id) }));
  };

  // ── Photos ──────────────────────────────────────────────────────────────────
  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const compressed = await Promise.all(
        Array.from(files).map((f) => compressImage(f)),
      );
      setData((d) => ({ ...d, photos: [...d.photos, ...compressed] }));
    } catch (err) {
      alert('Error uploading photos. Please try smaller images.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setData((d) => ({ ...d, photos: d.photos.filter((_, i) => i !== index) }));
  };

  const TABS = [
    { id: 'couple', label: 'Couple', icon: '💑' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
    { id: 'photos', label: 'Photos', icon: '📸' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: '#0f0a00' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #1a0f00, #261500)',
          borderBottom: '1px solid rgba(212,175,55,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div>
          <h1
            className="text-xl font-bold"
            style={{
              fontFamily: 'var(--font-cinzel)',
              background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Wedding Admin Panel
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(212,175,55,0.5)' }}>
            Manage your invitation data
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#C9A84C',
              fontFamily: 'var(--font-cinzel)',
              fontSize: '12px',
            }}
          >
            Preview →
          </a>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: saved
                ? 'linear-gradient(135deg, #2a7a2a, #48b848)'
                : 'linear-gradient(135deg, #C9A84C, #FFD700)',
              color: '#1a0f00',
              fontFamily: 'var(--font-cinzel)',
              fontSize: '12px',
              letterSpacing: '0.5px',
            }}
          >
            {saved ? '✓ Saved!' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className="sticky top-16 z-20 px-6 py-3 flex gap-2 overflow-x-auto"
        style={{
          background: 'rgba(15,10,0,0.95)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 whitespace-nowrap transition-all"
            style={
              activeTab === tab.id
                ? {
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(255,213,79,0.15))',
                    border: '1px solid rgba(212,175,55,0.5)',
                    color: '#FFD700',
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '12px',
                  }
                : {
                    border: '1px solid rgba(212,175,55,0.15)',
                    color: 'rgba(212,175,55,0.5)',
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '12px',
                  }
            }
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* ── Couple Tab ── */}
        {activeTab === 'couple' && (
          <motion.div
            key="couple"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SectionTitle title="Couple Details" icon="💑" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Groom Name" value={data.groomName}
                onChange={(v) => setData((d) => ({ ...d, groomName: v }))} />
              <FormField label="Bride Name" value={data.brideName}
                onChange={(v) => setData((d) => ({ ...d, brideName: v }))} />
              <FormField label="Groom Father's Name" value={data.groomFatherName}
                onChange={(v) => setData((d) => ({ ...d, groomFatherName: v }))} />
              <FormField label="Bride Father's Name" value={data.brideFatherName}
                onChange={(v) => setData((d) => ({ ...d, brideFatherName: v }))} />
              <FormField
                label="Wax Seal Initials"
                value={data.initials}
                onChange={(v) => setData((d) => ({ ...d, initials: v }))}
                placeholder="e.g. M & V"
              />
              <FormField
                label="Wedding Date"
                type="date"
                value={data.weddingDate}
                onChange={(v) => setData((d) => ({ ...d, weddingDate: v }))}
              />
              <FormField
                label="Main Venue Name"
                value={data.mainVenue}
                onChange={(v) => setData((d) => ({ ...d, mainVenue: v }))}
                className="md:col-span-2"
              />
              <FormField
                label="Venue Address"
                value={data.mainVenueAddress}
                onChange={(v) => setData((d) => ({ ...d, mainVenueAddress: v }))}
                className="md:col-span-2"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: 'rgba(212,175,55,0.6)', fontFamily: 'var(--font-cinzel)' }}>
                Invitation Message
              </label>
              <textarea
                value={data.invitationMessage}
                onChange={(e) => setData((d) => ({ ...d, invitationMessage: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl resize-none text-sm"
                style={{
                  background: 'rgba(255,248,225,0.07)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: '#FFF8E7',
                  fontFamily: 'var(--font-playfair)',
                  outline: 'none',
                }}
              />
            </div>
          </motion.div>
        )}

        {/* ── Events Tab ── */}
        {activeTab === 'events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <SectionTitle title="Wedding Events" icon="📅" />
              <button
                onClick={addEvent}
                className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(255,213,79,0.15))',
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: '#FFD700',
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '12px',
                }}
              >
                + Add Event
              </button>
            </div>

            {data.events.map((event, index) => (
              <EventEditor
                key={event.id}
                event={event}
                index={index}
                onChange={updateEvent}
                onRemove={removeEvent}
              />
            ))}
          </motion.div>
        )}

        {/* ── Family Tab ── */}
        {activeTab === 'family' && (
          <motion.div
            key="family"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SectionTitle title="Family Members" icon="👨‍👩‍👧" />

            {(['groom', 'bride'] as const).map((side) => (
              <div key={side}>
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="text-sm uppercase tracking-widest"
                    style={{
                      color: side === 'groom' ? '#C9A84C' : '#E88FAA',
                      fontFamily: 'var(--font-cinzel)',
                    }}
                  >
                    {side === 'groom' ? "🤵 Groom's Family" : "👰 Bride's Family"}
                  </h3>
                  <button
                    onClick={() => addFamilyMember(side)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      border: `1px solid ${side === 'groom' ? 'rgba(212,175,55,0.4)' : 'rgba(232,143,170,0.4)'}`,
                      color: side === 'groom' ? '#C9A84C' : '#E88FAA',
                    }}
                  >
                    + Add Member
                  </button>
                </div>

                <div className="space-y-2">
                  {data.familyMembers
                    .filter((m) => m.side === side)
                    .map((member) => (
                      <FamilyMemberEditor
                        key={member.id}
                        member={member}
                        side={side}
                        onChange={updateFamilyMember}
                        onRemove={removeFamilyMember}
                      />
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Photos Tab ── */}
        {activeTab === 'photos' && (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SectionTitle title="Photo Gallery" icon="📸" />

            {/* Upload area */}
            <div
              className="rounded-2xl p-8 text-center cursor-pointer transition-colors"
              style={{
                border: '2px dashed rgba(212,175,55,0.3)',
                background: 'rgba(212,175,55,0.03)',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handlePhotoUpload(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="text-4xl mb-3">📷</div>
              <p
                className="text-sm"
                style={{ color: 'rgba(212,175,55,0.7)', fontFamily: 'var(--font-playfair)' }}
              >
                {uploading ? 'Uploading...' : 'Click or drag photos here'}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: 'rgba(212,175,55,0.4)', fontFamily: 'var(--font-cinzel)' }}
              >
                Images will be compressed automatically
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handlePhotoUpload(e.target.files)}
              />
            </div>

            {/* Photo grid */}
            {data.photos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {data.photos.map((photo, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(200,0,0,0.8)', color: 'white' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {data.photos.length === 0 && (
              <p className="text-center text-sm" style={{ color: 'rgba(212,175,55,0.3)', fontFamily: 'var(--font-playfair)' }}>
                No photos uploaded yet
              </p>
            )}
          </motion.div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SectionTitle title="Settings" icon="⚙️" />

            {/* Music settings */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(255,248,225,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#C9A84C', fontFamily: 'var(--font-cinzel)' }}>
                    Background Music
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(212,175,55,0.4)', fontFamily: 'var(--font-playfair)' }}>
                    Auto-plays when invitation opens
                  </p>
                </div>
                <button
                  onClick={() => setData((d) => ({ ...d, musicEnabled: !d.musicEnabled }))}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{
                    background: data.musicEnabled
                      ? 'linear-gradient(135deg, #C9A84C, #FFD700)'
                      : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: data.musicEnabled ? '26px' : '4px' }}
                  />
                </button>
              </div>

              {data.musicEnabled && (
                <FormField
                  label="Music URL (MP3 link)"
                  value={data.musicUrl || ''}
                  onChange={(v) => setData((d) => ({ ...d, musicUrl: v }))}
                  placeholder="https://example.com/music.mp3"
                />
              )}
            </div>

            {/* Danger zone */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(200,0,0,0.05)',
                border: '1px solid rgba(200,0,0,0.2)',
              }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: '#FF6B6B', fontFamily: 'var(--font-cinzel)' }}>
                Danger Zone
              </p>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,107,107,0.6)', fontFamily: 'var(--font-playfair)' }}>
                This will reset all invitation data to defaults.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  border: '1px solid rgba(200,0,0,0.4)',
                  color: '#FF6B6B',
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '12px',
                }}
              >
                Reset All Data
              </button>
            </div>
          </motion.div>
        )}

        {/* Save button (bottom) */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: saved
                ? 'linear-gradient(135deg, #2a7a2a, #48b848)'
                : 'linear-gradient(135deg, #C9A84C, #FFD700)',
              color: '#1a0f00',
              fontFamily: 'var(--font-cinzel)',
              letterSpacing: '1px',
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
            }}
          >
            {saved ? '✓ Changes Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reusable sub-components ───────────────────────────────────────────────────

function SectionTitle({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xl">{icon}</span>
      <h2
        className="text-base font-bold"
        style={{
          fontFamily: 'var(--font-cinzel)',
          background: 'linear-gradient(135deg, #C9A84C, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px',
        }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.15)' }} />
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        className="block text-xs uppercase tracking-widest mb-1.5"
        style={{ color: 'rgba(212,175,55,0.6)', fontFamily: 'var(--font-cinzel)' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm"
        style={{
          background: 'rgba(255,248,225,0.07)',
          border: '1px solid rgba(212,175,55,0.25)',
          color: '#FFF8E7',
          fontFamily: 'var(--font-playfair)',
          outline: 'none',
        }}
      />
    </div>
  );
}

function EventEditor({
  event,
  index,
  onChange,
  onRemove,
}: {
  event: WeddingEvent;
  index: number;
  onChange: (id: string, field: keyof WeddingEvent, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: '1px solid rgba(212,175,55,0.2)',
        background: 'rgba(255,248,225,0.04)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{event.icon}</span>
          <span
            className="text-sm font-medium"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-playfair)' }}
          >
            {event.name || `Event ${index + 1}`}
          </span>
          {event.date && (
            <span className="text-xs" style={{ color: 'rgba(212,175,55,0.5)' }}>
              {event.date} · {event.time}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(event.id); }}
            className="text-xs px-2 py-1 rounded"
            style={{ color: 'rgba(255,100,100,0.7)', border: '1px solid rgba(255,100,100,0.2)' }}
          >
            Remove
          </button>
          <span style={{ color: 'rgba(212,175,55,0.5)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded form */}
      {open && (
        <div
          className="px-4 pb-4 space-y-3"
          style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}
        >
          <div className="grid grid-cols-2 gap-3 mt-3">
            <FormField
              label="Event Name"
              value={event.name}
              onChange={(v) => onChange(event.id, 'name', v)}
            />
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5"
                style={{ color: 'rgba(212,175,55,0.6)', fontFamily: 'var(--font-cinzel)' }}>
                Icon
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => onChange(event.id, 'icon', icon)}
                    className="w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-colors"
                    style={{
                      background: event.icon === icon
                        ? 'rgba(212,175,55,0.3)'
                        : 'rgba(255,255,255,0.05)',
                      border: event.icon === icon
                        ? '1px solid rgba(212,175,55,0.5)'
                        : '1px solid transparent',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FormField
            label="Venue"
            value={event.venue}
            onChange={(v) => onChange(event.id, 'venue', v)}
            placeholder="Venue name and hall"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Date"
              type="date"
              value={event.date}
              onChange={(v) => onChange(event.id, 'date', v)}
            />
            <FormField
              label="Time"
              value={event.time}
              onChange={(v) => onChange(event.id, 'time', v)}
              placeholder="e.g. 6:00 PM"
            />
          </div>
          <FormField
            label="Description (optional)"
            value={event.description || ''}
            onChange={(v) => onChange(event.id, 'description', v)}
            placeholder="Brief description..."
          />
        </div>
      )}
    </div>
  );
}

function FamilyMemberEditor({
  member,
  side,
  onChange,
  onRemove,
}: {
  member: FamilyMember;
  side: 'groom' | 'bride';
  onChange: (id: string, field: keyof FamilyMember, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const color = side === 'groom' ? '#C9A84C' : '#E88FAA';

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        background: 'rgba(255,248,225,0.04)',
        border: `1px solid ${side === 'groom' ? 'rgba(212,175,55,0.15)' : 'rgba(232,143,170,0.15)'}`,
      }}
    >
      <input
        type="text"
        value={member.name}
        onChange={(e) => onChange(member.id, 'name', e.target.value)}
        placeholder="Full Name"
        className="flex-1 px-3 py-2 rounded-lg text-sm"
        style={{
          background: 'rgba(255,248,225,0.07)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#FFF8E7',
          outline: 'none',
          fontFamily: 'var(--font-playfair)',
        }}
      />
      <input
        type="text"
        value={member.relation}
        onChange={(e) => onChange(member.id, 'relation', e.target.value)}
        placeholder="Relation"
        className="w-28 px-3 py-2 rounded-lg text-sm"
        style={{
          background: 'rgba(255,248,225,0.07)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#FFF8E7',
          outline: 'none',
          fontFamily: 'var(--font-playfair)',
        }}
      />
      <button
        onClick={() => onRemove(member.id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: 'rgba(200,0,0,0.2)', color: '#FF6B6B' }}
      >
        ×
      </button>
    </div>
  );
}
