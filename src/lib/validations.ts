import { z } from 'zod';
import { EventType, PhotoType } from '@prisma/client';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from './constants';

// Event Type Selection Schema
export const eventTypeSchema = z.object({
  eventType: z.nativeEnum(EventType, {
    errorMap: () => ({ message: 'Please select an event type' }),
  }),
});

// Photo Upload Schema
export const photoUploadSchema = z.object({
  type: z.nativeEnum(PhotoType),
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 10MB')
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      'Only JPG, PNG, and WebP images are allowed'
    ),
  cropData: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      scale: z.number().optional(),
    })
    .optional(),
});

// Theme Selection Schema
export const themeSelectionSchema = z.object({
  themeId: z.string().min(1, 'Please select a theme'),
});

// Event Details Schema
export const eventDetailsSchema = z.object({
  hostName: z.string().min(1, 'Host name is required').max(100, 'Name is too long'),
  coHostName: z.string().max(100, 'Name is too long').optional(),
  eventDate: z.date({
    required_error: 'Event date is required',
    invalid_type_error: 'Please select a valid date',
  }),
  eventTime: z.string().min(1, 'Event time is required'),
  venue: z.string().min(1, 'Venue is required').max(200, 'Venue name is too long'),
  venueAddress: z.string().max(500, 'Address is too long').optional(),
  mapLink: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  rsvpWhatsApp: z
    .string()
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, {
      message: 'Please enter a valid phone number',
    })
    .optional()
    .or(z.literal('')),
  contactEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  customMessage: z.string().max(1000, 'Message is too long').optional(),
});

// Create Invitation API Schema
export const createInvitationSchema = z.object({
  eventType: z.nativeEnum(EventType),
  eventName: z.string().optional(),
  hostName: z.string().min(1, 'Host name is required'),
  coHostName: z.string().optional(),
  hostRelation: z.string().optional(),
  eventDate: z.coerce.date(),
  eventTime: z.string().optional(),
  venue: z.string().min(1, 'Venue is required'),
  venueAddress: z.string().optional(),
  mapLink: z.string().optional(),
  rsvpWhatsApp: z.string().optional(),
  contactEmail: z.string().optional(),
  themeId: z.string().min(1, 'Theme ID is required'),
  customMessage: z.string().optional(),
  photos: z
    .array(
      z.object({
        type: z.nativeEnum(PhotoType),
        fileId: z.string(), // Temporary file ID from upload endpoint
        label: z.string().optional(),
      })
    )
    .default([]),
  musicEnabled: z.boolean().default(true),
  animationSpeed: z.enum(['slow', 'normal', 'fast']).default('normal'),
});

// Update Stats Schema
export const updateStatsSchema = z.object({
  views: z.number().optional(),
  downloads: z.number().optional(),
  shares: z.number().optional(),
});

// Export Request Schema
export const exportRequestSchema = z.object({
  inviteId: z.string().min(1, 'Invite ID is required'),
  format: z.enum(['pdf', 'image', 'qr']).default('pdf'),
  size: z.number().optional(),
});

// Slug Validation
export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// Validation Helper Types
export type EventTypeFormData = z.infer<typeof eventTypeSchema>;
export type PhotoUploadFormData = z.infer<typeof photoUploadSchema>;
export type ThemeSelectionFormData = z.infer<typeof themeSelectionSchema>;
export type EventDetailsFormData = z.infer<typeof eventDetailsSchema>;
export type CreateInvitationData = z.infer<typeof createInvitationSchema>;
export type ExportRequestData = z.infer<typeof exportRequestSchema>;
