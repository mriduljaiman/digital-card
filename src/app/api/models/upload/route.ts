export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_EXTENSIONS = ['.glb', '.gltf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for Premium users
const MAX_FILE_SIZE_PRO = 20 * 1024 * 1024; // 20MB for Pro users

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
        { success: false, error: 'Custom 3D models are only available for Pro and Premium users' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

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

    // Validate file size based on plan
    const maxSize = user.plan === 'PREMIUM' ? MAX_FILE_SIZE : MAX_FILE_SIZE_PRO;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB for ${user.plan} plan`,
        },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'models', session.user.id);
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

    // Create database record
    const modelPath = `/uploads/models/${session.user.id}/${fileName}`;

    // If GLTF, also save associated files
    let additionalFiles: string[] = [];
    if (fileExtension === '.gltf') {
      // Check for .bin file
      const binFile = formData.get('bin') as File;
      if (binFile) {
        const binFileName = `${fileId}.bin`;
        const binPath = path.join(uploadsDir, binFileName);
        const binBuffer = Buffer.from(await binFile.arrayBuffer());
        fs.writeFileSync(binPath, binBuffer);
        additionalFiles.push(`/uploads/models/${session.user.id}/${binFileName}`);
      }

      // Check for texture files
      const textureFiles = formData.getAll('textures') as File[];
      for (const texture of textureFiles) {
        if (texture && texture.size > 0) {
          const textureName = `${fileId}_${texture.name}`;
          const texturePath = path.join(uploadsDir, textureName);
          const textureBuffer = Buffer.from(await texture.arrayBuffer());
          fs.writeFileSync(texturePath, textureBuffer);
          additionalFiles.push(`/uploads/models/${session.user.id}/${textureName}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: fileId,
        name: name || file.name,
        description: description || '',
        path: modelPath,
        additionalFiles,
        extension: fileExtension,
        size: file.size,
        category: category || 'custom',
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Model upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload model',
      },
      { status: 500 }
    );
  }
}

// Get user's uploaded models
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
      'models',
      session.user.id
    );

    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({
        success: true,
        data: { models: [] },
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const models = files
      .filter((file) => ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .map((file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);

        return {
          id: path.basename(file, path.extname(file)),
          name: file,
          path: `/uploads/models/${session.user.id}/${file}`,
          size: stats.size,
          uploadedAt: stats.birthtime.toISOString(),
          extension: path.extname(file),
        };
      });

    return NextResponse.json({
      success: true,
      data: { models },
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch models',
      },
      { status: 500 }
    );
  }
}

// Delete a model
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
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { success: false, error: 'Model ID is required' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'models',
      session.user.id
    );

    // Find and delete all files matching the model ID
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const filesToDelete = files.filter((file) => file.startsWith(modelId));

      for (const file of filesToDelete) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Model deleted successfully',
    });
  } catch (error) {
    console.error('Model deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete model',
      },
      { status: 500 }
    );
  }
}
