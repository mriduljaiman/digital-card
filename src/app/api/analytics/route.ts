import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

// Track analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationSlug, eventType, eventData, source } = body;

    if (!invitationSlug || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug: invitationSlug },
      select: { id: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Get user agent and IP from headers
    const userAgent = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;

    // Parse device info
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    if (userAgent) {
      // Simple device detection
      if (/mobile/i.test(userAgent)) deviceType = 'mobile';
      else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet';

      // Simple browser detection
      if (/chrome/i.test(userAgent)) browser = 'Chrome';
      else if (/safari/i.test(userAgent)) browser = 'Safari';
      else if (/firefox/i.test(userAgent)) browser = 'Firefox';
      else if (/edge/i.test(userAgent)) browser = 'Edge';

      // Simple OS detection
      if (/windows/i.test(userAgent)) os = 'Windows';
      else if (/mac/i.test(userAgent)) os = 'macOS';
      else if (/linux/i.test(userAgent)) os = 'Linux';
      else if (/android/i.test(userAgent)) os = 'Android';
      else if (/ios|iphone|ipad/i.test(userAgent)) os = 'iOS';
    }

    // Create analytics record
    await prisma.analytics.create({
      data: {
        invitationId: invitation.id,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
        ipAddress: ip,
        userAgent,
        source,
        deviceType,
        browser,
        os,
      },
    });

    // Update invitation counters
    if (eventType === 'PAGE_VIEW' || eventType === 'INVITE_OPEN') {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { views: { increment: 1 } },
      });
    } else if (eventType === 'DOWNLOAD_CLICK') {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { downloads: { increment: 1 } },
      });
    } else if (eventType === 'SHARE_CLICK') {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { shares: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics tracked',
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track analytics',
      },
      { status: 500 }
    );
  }
}

// Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');
    const slug = searchParams.get('slug');
    const timeRange = searchParams.get('timeRange') || '7d'; // 7d, 30d, 90d, all

    if (!invitationId && !slug) {
      return NextResponse.json(
        { success: false, error: 'Invitation ID or slug is required' },
        { status: 400 }
      );
    }

    // Verify invitation ownership
    const invitation = await prisma.invitation.findFirst({
      where: invitationId
        ? { id: invitationId, userId: session.user.id }
        : { slug: slug!, userId: session.user.id },
      select: { id: true, views: true, downloads: true, shares: true, createdAt: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date(invitation.createdAt);

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    // Get analytics events
    const events = await prisma.analytics.findMany({
      where: {
        invitationId: invitation.id,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Aggregate data
    const eventsByType = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByDevice = events.reduce((acc, event) => {
      const device = event.deviceType || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByBrowser = events.reduce((acc, event) => {
      const browser = event.browser || 'unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySource = events.reduce((acc, event) => {
      const source = event.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily views for chart
    const dailyViews: Record<string, number> = {};
    events.forEach((event) => {
      if (event.eventType === 'PAGE_VIEW' || event.eventType === 'INVITE_OPEN') {
        const date = event.timestamp.toISOString().split('T')[0];
        dailyViews[date] = (dailyViews[date] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalViews: invitation.views,
          totalDownloads: invitation.downloads,
          totalShares: invitation.shares,
          totalEvents: events.length,
          uniqueVisitors: new Set(events.map((e) => e.ipAddress).filter(Boolean)).size,
        },
        eventsByType,
        eventsByDevice,
        eventsByBrowser,
        eventsBySource,
        dailyViews: Object.entries(dailyViews).map(([date, count]) => ({
          date,
          count,
        })),
        recentEvents: events.slice(0, 50),
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get analytics',
      },
      { status: 500 }
    );
  }
}
