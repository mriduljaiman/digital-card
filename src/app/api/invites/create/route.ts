export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createInvitationSchema } from '@/lib/validations';
import { generateSlug, generateUniqueSlug } from '@/lib/utils';
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createInvitationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate slug
    const baseSlug = generateSlug(
      `${data.hostName} ${data.coHostName || ''} ${data.eventType.toLowerCase()}`
    );

    // Check for existing slugs
    const existingSlugs = await prisma.invitation
      .findMany({ select: { slug: true } })
      .then((invites) => invites.map((i) => i.slug));

    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    // Create permanent upload directories
    const permanentDir = path.join(process.cwd(), 'uploads', 'invitations', uniqueSlug);
    if (!existsSync(permanentDir)) {
      await mkdir(permanentDir, { recursive: true });
    }

    // Move photos from temp to permanent storage
    const photoRecords = await Promise.all(
      data.photos.map(async (photo, index) => {
        const tempPath = path.join(process.cwd(), 'uploads', 'temp', `${photo.fileId}.jpg`);
        const permanentFilename = `${photo.type.toLowerCase()}_${index}.jpg`;
        const permanentPath = path.join(permanentDir, permanentFilename);

        try {
          if (existsSync(tempPath)) {
            await copyFile(tempPath, permanentPath);
          }
        } catch (err) {
          console.error('Error moving photo:', err);
        }

        return {
          type: photo.type,
          label: photo.label,
          originalPath: `/uploads/invitations/${uniqueSlug}/${permanentFilename}`,
          processedPath: `/uploads/invitations/${uniqueSlug}/${permanentFilename}`,
          fileName: permanentFilename,
          fileSize: 0,
          mimeType: 'image/jpeg',
          sortOrder: index,
        };
      })
    );

    // Create invitation in database
    const invitation = await prisma.invitation.create({
      data: {
        slug: uniqueSlug,
        eventType: data.eventType,
        eventName: data.eventName,
        hostName: data.hostName,
        coHostName: data.coHostName,
        hostRelation: data.hostRelation,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        venue: data.venue,
        venueAddress: data.venueAddress,
        mapLink: data.mapLink,
        rsvpWhatsApp: data.rsvpWhatsApp,
        contactEmail: data.contactEmail,
        themeId: data.themeId,
        customMessage: data.customMessage,
        musicEnabled: data.musicEnabled,
        animationSpeed: data.animationSpeed,
        isPublished: true,
        photos: {
          create: photoRecords,
        },
      },
      include: {
        photos: true,
        theme: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        inviteId: invitation.id,
        slug: invitation.slug,
        url: `/invite/${invitation.slug}`,
      },
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create invitation';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
