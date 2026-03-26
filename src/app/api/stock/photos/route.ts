export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'wedding';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');
    const orientation = searchParams.get('orientation') || 'landscape';

    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsplash API key not configured',
        },
        { status: 500 }
      );
    }

    const url = new URL(`${UNSPLASH_API_URL}/search/photos`);
    url.searchParams.append('query', query);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());
    url.searchParams.append('orientation', orientation);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const data = await response.json();

    // Transform the data to a simpler format
    const photos = data.results.map((photo: any) => ({
      id: photo.id,
      description: photo.description || photo.alt_description,
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
      },
      user: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html,
      },
      downloadLocation: photo.links.download_location,
      width: photo.width,
      height: photo.height,
      color: photo.color,
    }));

    return NextResponse.json({
      success: true,
      data: {
        photos,
        total: data.total,
        totalPages: data.total_pages,
      },
    });
  } catch (error) {
    console.error('Stock photos error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stock photos',
      },
      { status: 500 }
    );
  }
}

// Download a photo (tracks download for Unsplash)
export async function POST(request: NextRequest) {
  try {
    const { downloadLocation } = await request.json();

    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsplash API key not configured',
        },
        { status: 500 }
      );
    }

    // Track download
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Download tracked',
    });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track download',
      },
      { status: 500 }
    );
  }
}
