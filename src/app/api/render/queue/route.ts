import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  addToRenderQueue,
  getJobStatus,
  getUserJobs,
  cancelJob,
  getQueueStats,
} from '@/lib/video-queue';

// Create a new render job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { invitationSlug, settings } = body;

    if (!invitationSlug || !settings) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add to queue
    const job = await addToRenderQueue(
      session.user.id,
      invitationSlug,
      settings
    );

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
      },
    });
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to queue render job',
      },
      { status: 500 }
    );
  }
}

// Get job status or user's jobs
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
    const jobId = searchParams.get('jobId');
    const stats = searchParams.get('stats') === 'true';

    // Get queue stats
    if (stats) {
      const queueStats = getQueueStats();
      return NextResponse.json({
        success: true,
        data: queueStats,
      });
    }

    // Get specific job
    if (jobId) {
      const job = getJobStatus(jobId);

      if (!job) {
        return NextResponse.json(
          { success: false, error: 'Job not found' },
          { status: 404 }
        );
      }

      // Verify ownership
      if (job.userId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: job,
      });
    }

    // Get all user's jobs
    const jobs = getUserJobs(session.user.id);

    return NextResponse.json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get job status',
      },
      { status: 500 }
    );
  }
}

// Cancel a job
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
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const job = getJobStatus(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const cancelled = cancelJob(jobId);

    if (!cancelled) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot cancel job (may already be processing)',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel job',
      },
      { status: 500 }
    );
  }
}
