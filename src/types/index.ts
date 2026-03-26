import { EventType, PhotoType } from '@prisma/client';

export type { EventType, PhotoType };

// Re-export Prisma types
export type { Invitation, Theme, InvitePhoto } from '@prisma/client';

// Builder Types
export interface BuilderStep {
  id: number;
  name: string;
  path: string;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
}

export interface PhotoUpload {
  file?: File | string;
  preview?: string;
  cropData?: CropData;
  type: PhotoType;
}

export interface EventDetails {
  hostName: string;
  coHostName?: string;
  eventDate: Date | null;
  eventTime: string;
  venue: string;
  venueAddress: string;
  mapLink: string;
  rsvpWhatsApp: string;
  contactEmail?: string;
  customMessage: string;
}

// 3D Scene Types
export interface SceneProps {
  hostPhoto?: string;
  coHostPhoto?: string;
  couplePhoto?: string;
  hostName?: string;
  coHostName?: string;
  eventDate?: string;
  customMessage?: string;
  theme: ThemeConfig;
}

export interface ThemeConfig {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: EventType;
  sceneComponent: string;
  modelPath?: string;
  texturePaths: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  cameraPath?: CameraKeyframe[];
  particleConfig?: ParticleConfig;
  defaultMusicUrl?: string;
  thumbnail?: string;
  isPremium: boolean;
}

export interface CameraKeyframe {
  position: [number, number, number];
  rotation: [number, number, number];
  duration: number;
}

export interface ParticleConfig {
  type: 'rose-petals' | 'confetti' | 'sparkles' | 'hearts' | 'bubbles';
  count: number;
  speed: number;
  colors: string[];
}

// Invite Display Types
export interface InviteDisplayData {
  id: string;
  slug: string;
  eventType: EventType;
  hostName?: string;
  coHostName?: string;
  eventDate: Date;
  eventTime?: string;
  venue: string;
  venueAddress?: string;
  mapLink?: string;
  rsvpWhatsApp?: string;
  customMessage?: string;
  theme: ThemeConfig;
  photos: {
    type: PhotoType;
    processedPath: string;
    label?: string;
  }[];
  musicEnabled: boolean;
  musicUrl?: string;
  animationSpeed: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateInviteResponse {
  inviteId: string;
  slug: string;
  url: string;
}

export interface UploadResponse {
  fileId: string;
  tempUrl: string;
  width?: number;
  height?: number;
}
