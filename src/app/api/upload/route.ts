import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist (in public folder)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${fileId}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image with Sharp (resize if too large, optimize)
    const processedImage = await sharp(buffer)
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Get metadata
    const metadata = await sharp(processedImage).metadata();

    // Save file
    await writeFile(filepath, processedImage);

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        tempUrl: `/uploads/temp/${filename}`,
        width: metadata.width,
        height: metadata.height,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Delete temporary uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID required' },
        { status: 400 }
      );
    }

    // Find and delete file
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
    const files = require('fs').readdirSync(uploadsDir);
    const fileToDelete = files.find((f: string) => f.startsWith(fileId));

    if (fileToDelete) {
      const filePath = path.join(uploadsDir, fileToDelete);
      await unlink(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
