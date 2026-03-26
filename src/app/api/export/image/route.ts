export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const body = await request.json();
    const { slug, width = 1920, height = 1080 } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite/${slug}?export=true`;

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });

    await page.goto(inviteUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.waitForTimeout(3000);

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
    });

    await browser.close();

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="invitation-${slug}.png"`,
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    
    if (browser) {
      await browser.close().catch(console.error);
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
