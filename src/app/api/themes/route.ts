import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { EventType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventTypeParam = searchParams.get('eventType');

    // Validate eventType is a valid enum value
    const validEventTypes = Object.values(EventType);
    const eventType = eventTypeParam && validEventTypes.includes(eventTypeParam as EventType)
      ? (eventTypeParam as EventType)
      : null;

    const where = eventType
      ? { category: eventType, isActive: true }
      : { isActive: true };

    const themes = await prisma.theme.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    // Parse JSON fields and format response
    const formattedThemes = themes.map((theme) => ({
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      description: theme.description,
      category: theme.category,
      sceneComponent: theme.sceneComponent,
      modelPath: theme.modelPath,
      texturePaths: theme.texturePaths ? JSON.parse(theme.texturePaths) : [],
      colors: {
        primary: theme.primaryColor,
        secondary: theme.secondaryColor,
        accent: theme.accentColor,
      },
      cameraPath: theme.cameraPath ? JSON.parse(theme.cameraPath) : null,
      particleConfig: theme.particleConfig ? JSON.parse(theme.particleConfig) : null,
      defaultMusicUrl: theme.defaultMusicUrl,
      thumbnail: theme.thumbnail,
      isPremium: theme.isPremium,
    }));

    return NextResponse.json({
      success: true,
      themes: formattedThemes,
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}
