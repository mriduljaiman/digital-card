import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_SIZE_PREMIUM = 20 * 1024 * 1024; // 20MB for Premium

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (!user || user.plan === 'FREE') {
      return NextResponse.json(
        { success: false, error: 'Music upload is only available for Pro and Premium users' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const mood = formData.get('mood') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = user.plan === 'PREMIUM' ? MAX_FILE_SIZE_PREMIUM : MAX_FILE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'music', session.user.id);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileId = uuidv4();
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const musicPath = `/uploads/music/${session.user.id}/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        id: fileId,
        title: title || file.name,
        artist: artist || 'Unknown',
        mood: mood || 'general',
        path: musicPath,
        duration: 0, // Would need audio analysis to get actual duration
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Music upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload music',
      },
      { status: 500 }
    );
  }
}

// Get user's uploaded music
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const uploadsDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'music',
      session.user.id
    );

    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({
        success: true,
        data: { tracks: [] },
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const tracks = files
      .filter((file) => ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .map((file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);

        return {
          id: path.basename(file, path.extname(file)),
          title: file,
          path: `/uploads/music/${session.user.id}/${file}`,
          size: stats.size,
          uploadedAt: stats.birthtime.toISOString(),
        };
      });

    return NextResponse.json({
      success: true,
      data: { tracks },
    });
  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch music',
      },
      { status: 500 }
    );
  }
}

// Delete music
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');

    if (!trackId) {
      return NextResponse.json(
        { success: false, error: 'Track ID is required' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'music',
      session.user.id
    );

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const fileToDelete = files.find((file) => file.startsWith(trackId));

      if (fileToDelete) {
        const filePath = path.join(uploadsDir, fileToDelete);
        fs.unlinkSync(filePath);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Track deleted successfully',
    });
  } catch (error) {
    console.error('Music deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete track',
      },
      { status: 500 }
    );
  }
}
