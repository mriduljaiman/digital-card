import { EventType, PhotoType } from '@prisma/client';
import { BuilderStep } from '@/types';

export const APP_NAME = 'Digital Invite';
export const APP_DESCRIPTION =
  'Create stunning 3D animated invitations for weddings, birthdays, and special events in minutes.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Builder Steps
export const BUILDER_STEPS: BuilderStep[] = [
  { id: 1, name: 'Event Type', path: '/create/1' },
  { id: 2, name: 'Photos', path: '/create/2' },
  { id: 3, name: 'Theme', path: '/create/3' },
  { id: 4, name: 'Details', path: '/create/4' },
  { id: 5, name: 'Preview', path: '/create/5' },
];

// Event Types
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  [EventType.WEDDING]: 'Wedding',
  [EventType.BIRTHDAY]: 'Birthday',
  [EventType.ENGAGEMENT]: 'Engagement',
  [EventType.ANNIVERSARY]: 'Anniversary',
  [EventType.BABY_SHOWER]: 'Baby Shower',
  [EventType.OTHER]: 'Other',
};

export const EVENT_TYPE_DESCRIPTIONS: Record<EventType, string> = {
  [EventType.WEDDING]:
    'Create a beautiful wedding invitation with mandap scenes and traditional themes',
  [EventType.BIRTHDAY]:
    'Celebrate with colorful birthday themes featuring cakes and balloons',
  [EventType.ENGAGEMENT]:
    'Announce your engagement with elegant ring ceremony themes',
  [EventType.ANNIVERSARY]:
    'Commemorate your special day with romantic anniversary designs',
  [EventType.BABY_SHOWER]:
    'Welcome a new arrival with adorable baby shower themes',
  [EventType.OTHER]: 'Custom event invitation for any special occasion',
};

export const EVENT_TYPE_ICONS: Record<EventType, string> = {
  [EventType.WEDDING]: '💍',
  [EventType.BIRTHDAY]: '🎂',
  [EventType.ENGAGEMENT]: '💎',
  [EventType.ANNIVERSARY]: '❤️',
  [EventType.BABY_SHOWER]: '🍼',
  [EventType.OTHER]: '🎉',
};

// Photo Types
export const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  [PhotoType.HOST]: 'Primary Person',
  [PhotoType.COHOST]: 'Co-Host',
  [PhotoType.COUPLE]: 'Together',
  [PhotoType.BABY]: 'Baby',
  [PhotoType.FAMILY]: 'Family',
  [PhotoType.CUSTOM]: 'Custom',
};

// Photo Requirements by Event Type
export const PHOTO_REQUIREMENTS: Record<EventType, { types: PhotoType[]; required: boolean }> = {
  [EventType.WEDDING]: {
    types: [PhotoType.HOST, PhotoType.COHOST, PhotoType.COUPLE],
    required: true,
  },
  [EventType.BIRTHDAY]: {
    types: [PhotoType.HOST, PhotoType.FAMILY],
    required: true,
  },
  [EventType.ENGAGEMENT]: {
    types: [PhotoType.HOST, PhotoType.COHOST, PhotoType.COUPLE],
    required: true,
  },
  [EventType.ANNIVERSARY]: {
    types: [PhotoType.COUPLE, PhotoType.HOST, PhotoType.COHOST],
    required: true,
  },
  [EventType.BABY_SHOWER]: {
    types: [PhotoType.BABY, PhotoType.HOST],
    required: false,
  },
  [EventType.OTHER]: {
    types: [PhotoType.HOST, PhotoType.CUSTOM],
    required: false,
  },
};

// Animation Speeds
export const ANIMATION_SPEEDS = {
  slow: { label: 'Slow', value: 'slow', multiplier: 0.5 },
  normal: { label: 'Normal', value: 'normal', multiplier: 1 },
  fast: { label: 'Fast', value: 'fast', multiplier: 1.5 },
};

// WhatsApp API
export const WHATSAPP_BASE_URL = 'https://wa.me';

// Routes
export const ROUTES = {
  HOME: '/',
  CREATE: '/create',
  INVITE: (slug: string) => `/invite/${slug}`,
  API: {
    UPLOAD: '/api/upload',
    THEMES: '/api/themes',
    INVITES: {
      CREATE: '/api/invites/create',
      GET: (id: string) => `/api/invites/${id}`,
    },
    EXPORT: {
      PDF: '/api/export/pdf',
      IMAGE: '/api/export/image',
      QR: '/api/export/qr',
    },
  },
};

// Default Values
export const DEFAULT_EVENT_TIME = '7:00 PM';
export const DEFAULT_ANIMATION_SPEED = 'normal';
export const DEFAULT_MUSIC_ENABLED = true;

// SEO
export const SEO_DEFAULTS = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: [
    'digital invitation',
    '3D invitation',
    'wedding invitation',
    'birthday invitation',
    'animated invitation',
    'online invitation',
    'invitation maker',
  ],
  ogImage: '/og-image.jpg',
};
