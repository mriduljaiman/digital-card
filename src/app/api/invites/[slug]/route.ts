export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
        theme: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { views: { increment: 1 } },
    });

    // Format theme data
    const formattedInvitation = {
      ...invitation,
      theme: {
        ...invitation.theme,
        texturePaths: invitation.theme.texturePaths
          ? JSON.parse(invitation.theme.texturePaths)
          : [],
        cameraPath: invitation.theme.cameraPath
          ? JSON.parse(invitation.theme.cameraPath)
          : null,
        particleConfig: invitation.theme.particleConfig
          ? JSON.parse(invitation.theme.particleConfig)
          : null,
        colors: {
          primary: invitation.theme.primaryColor,
          secondary: invitation.theme.secondaryColor,
          accent: invitation.theme.accentColor,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: formattedInvitation,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}
