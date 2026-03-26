import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configure FFmpeg paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export const maxDuration = 300; // 5 minutes for video processing

interface VideoSettings {
  duration?: number; // Duration in seconds
  fps?: number; // Frames per second
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  resolution?: '720p' | '1080p' | '4k';
  includeMusic?: boolean;
}

const QUALITY_PRESETS = {
  low: { bitrate: '1000k', crf: 28 },
  medium: { bitrate: '2500k', crf: 23 },
  high: { bitrate: '5000k', crf: 18 },
  ultra: { bitrate: '8000k', crf: 15 },
};

const RESOLUTION_PRESETS = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, settings = {} as VideoSettings } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Fetch invitation details
    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        theme: true,
        photos: true,
        user: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check user plan for quality restrictions
    const userPlan = invitation.user?.plan || 'FREE';
    let allowedQuality = settings.quality || 'medium';
    let allowedResolution = settings.resolution || '1080p';

    if (userPlan === 'FREE') {
      allowedQuality = 'low';
      allowedResolution = '720p';
    } else if (userPlan === 'PRO') {
      if (allowedQuality === 'ultra') allowedQuality = 'high';
      if (allowedResolution === '4k') allowedResolution = '1080p';
    }
    // PREMIUM users get full access

    // Set video parameters
    const duration = settings.duration || 15; // 15 seconds default
    const fps = settings.fps || 30;
    const totalFrames = duration * fps;
    const resolution = RESOLUTION_PRESETS[allowedResolution];
    const qualityPreset = QUALITY_PRESETS[allowedQuality];

    // Create temporary directories
    const tempId = uuidv4();
    const tempDir = path.join(process.cwd(), 'public', 'temp', tempId);
    const framesDir = path.join(tempDir, 'frames');
    const outputPath = path.join(tempDir, `invite-${slug}.mp4`);

    fs.mkdirSync(framesDir, { recursive: true });

    // Launch Puppeteer
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        `--window-size=${resolution.width},${resolution.height}`,
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: resolution.width,
      height: resolution.height,
      deviceScaleFactor: 1,
    });

    // Navigate to invitation with export flag
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite/${slug}?export=true&autoplay=true`;

    console.log(`Navigating to ${inviteUrl}...`);
    await page.goto(inviteUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for 3D scene to load
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2000); // Extra time for scene initialization

    // Capture frames
    console.log(`Capturing ${totalFrames} frames...`);
    const frameInterval = 1000 / fps;

    for (let i = 0; i < totalFrames; i++) {
      const framePath = path.join(framesDir, `frame-${String(i).padStart(5, '0')}.png`);

      await page.screenshot({
        path: framePath,
        type: 'png',
        omitBackground: false,
      });

      // Wait for next frame
      if (i < totalFrames - 1) {
        await page.waitForTimeout(frameInterval);
      }

      // Log progress every 30 frames
      if ((i + 1) % 30 === 0) {
        console.log(`Progress: ${i + 1}/${totalFrames} frames captured`);
      }
    }

    await browser.close();
    console.log('Frame capture complete');

    // Create video from frames using FFmpeg
    console.log('Creating video...');
    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg()
        .input(path.join(framesDir, 'frame-%05d.png'))
        .inputFPS(fps)
        .videoCodec('libx264')
        .outputOptions([
          '-pix_fmt yuv420p',
          `-crf ${qualityPreset.crf}`,
          `-b:v ${qualityPreset.bitrate}`,
          '-preset medium',
          '-movflags +faststart', // Enable streaming
        ])
        .fps(fps);

      // Add background music if enabled and available
      if (settings.includeMusic && invitation.musicUrl) {
        const musicPath = path.join(process.cwd(), 'public', invitation.musicUrl);
        if (fs.existsSync(musicPath)) {
          command = command
            .input(musicPath)
            .audioCodec('aac')
            .audioBitrate('128k')
            .outputOptions(['-shortest']); // Match video duration
        }
      } else {
        // No audio
        command = command.noAudio();
      }

      command
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Encoding: ${Math.round(progress.percent)}%`);
          }
        })
        .on('end', () => {
          console.log('Video encoding complete');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    // Clean up frames directory
    console.log('Cleaning up frames...');
    fs.rmSync(framesDir, { recursive: true, force: true });

    // Update invitation stats
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { downloads: { increment: 1 } },
    });

    // Read video file
    const videoBuffer = fs.readFileSync(outputPath);
    const videoBase64 = videoBuffer.toString('base64');

    // Clean up video file after a delay (give time for response)
    setTimeout(() => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    }, 5000);

    return NextResponse.json({
      success: true,
      data: {
        video: `data:video/mp4;base64,${videoBase64}`,
        fileName: `invite-${slug}.mp4`,
        size: videoBuffer.length,
        duration,
        resolution: allowedResolution,
        quality: allowedQuality,
      },
    });
  } catch (error) {
    console.error('Video export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate video',
      },
      { status: 500 }
    );
  }
}
