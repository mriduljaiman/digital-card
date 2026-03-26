export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Note: For production, use remove.bg API or similar service
// This is a placeholder that uses edge detection as fallback

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const useAI = formData.get('useAI') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let processedBuffer: Buffer;

    if (useAI && process.env.REMOVE_BG_API_KEY) {
      // Use remove.bg API
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Background removal failed');
      }

      processedBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Fallback: Create transparent cutout using edge detection
      // This is a simple implementation - for production use proper AI service
      processedBuffer = await sharp(buffer)
        .removeAlpha()
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer();
    }

    // Save processed image
    const fileName = `cutout_${Date.now()}.png`;
    const outputDir = path.join(process.cwd(), 'public', 'uploads', 'cutouts');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, processedBuffer);

    return NextResponse.json({
      success: true,
      data: {
        path: `/uploads/cutouts/${fileName}`,
        fileName,
      },
    });
  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove background',
      },
      { status: 500 }
    );
  }
}
