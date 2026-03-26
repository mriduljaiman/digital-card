import { prisma } from './db';

export enum RenderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface RenderJob {
  id: string;
  userId: string;
  invitationSlug: string;
  status: RenderStatus;
  settings: {
    duration: number;
    fps: number;
    quality: string;
    resolution: string;
    includeMusic: boolean;
  };
  progress: number;
  outputPath?: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// In-memory queue for active jobs
const activeJobs = new Map<string, RenderJob>();
const jobQueue: string[] = [];
let isProcessing = false;

// Maximum concurrent renders
const MAX_CONCURRENT_RENDERS = 2;

// Add job to queue
export async function addToRenderQueue(
  userId: string,
  invitationSlug: string,
  settings: RenderJob['settings']
): Promise<RenderJob> {
  const job: RenderJob = {
    id: `render_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    invitationSlug,
    status: RenderStatus.PENDING,
    settings,
    progress: 0,
    createdAt: new Date(),
  };

  activeJobs.set(job.id, job);
  jobQueue.push(job.id);

  // Start processing if not already running
  if (!isProcessing) {
    processQueue();
  }

  return job;
}

// Get job status
export function getJobStatus(jobId: string): RenderJob | undefined {
  return activeJobs.get(jobId);
}

// Get user's jobs
export function getUserJobs(userId: string): RenderJob[] {
  const jobs: RenderJob[] = [];
  activeJobs.forEach((job) => {
    if (job.userId === userId) {
      jobs.push(job);
    }
  });
  return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Update job progress
export function updateJobProgress(jobId: string, progress: number) {
  const job = activeJobs.get(jobId);
  if (job) {
    job.progress = Math.min(100, Math.max(0, progress));
    activeJobs.set(jobId, job);
  }
}

// Mark job as processing
export function startJob(jobId: string) {
  const job = activeJobs.get(jobId);
  if (job) {
    job.status = RenderStatus.PROCESSING;
    job.startedAt = new Date();
    activeJobs.set(jobId, job);
  }
}

// Complete job
export function completeJob(jobId: string, outputPath: string) {
  const job = activeJobs.get(jobId);
  if (job) {
    job.status = RenderStatus.COMPLETED;
    job.progress = 100;
    job.outputPath = outputPath;
    job.completedAt = new Date();
    activeJobs.set(jobId, job);

    // Clean up after 1 hour
    setTimeout(() => {
      activeJobs.delete(jobId);
    }, 60 * 60 * 1000);
  }
}

// Fail job
export function failJob(jobId: string, error: string) {
  const job = activeJobs.get(jobId);
  if (job) {
    job.status = RenderStatus.FAILED;
    job.error = error;
    job.completedAt = new Date();
    activeJobs.set(jobId, job);

    // Clean up after 30 minutes
    setTimeout(() => {
      activeJobs.delete(jobId);
    }, 30 * 60 * 1000);
  }
}

// Cancel job
export function cancelJob(jobId: string): boolean {
  const job = activeJobs.get(jobId);
  if (job && job.status === RenderStatus.PENDING) {
    activeJobs.delete(jobId);
    const index = jobQueue.indexOf(jobId);
    if (index > -1) {
      jobQueue.splice(index, 1);
    }
    return true;
  }
  return false;
}

// Process queue
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (jobQueue.length > 0) {
    const jobId = jobQueue.shift();
    if (!jobId) continue;

    const job = activeJobs.get(jobId);
    if (!job || job.status !== RenderStatus.PENDING) continue;

    try {
      startJob(jobId);

      // Here we would actually call the video rendering function
      // For now, we'll simulate the process
      console.log(`Processing render job: ${jobId}`);

      // The actual rendering would be done by calling the video export API
      // and updating progress as it goes
      // This is a placeholder - the real implementation would integrate
      // with the video export route we created earlier

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        updateJobProgress(jobId, i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      completeJob(jobId, `/renders/${jobId}.mp4`);
    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      failJob(jobId, error instanceof Error ? error.message : 'Unknown error');
    }

    // Check if we should continue processing
    const currentlyProcessing = Array.from(activeJobs.values()).filter(
      (j) => j.status === RenderStatus.PROCESSING
    ).length;

    if (currentlyProcessing >= MAX_CONCURRENT_RENDERS) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  isProcessing = false;
}

// Get queue stats
export function getQueueStats() {
  const stats = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    total: activeJobs.size,
  };

  activeJobs.forEach((job) => {
    switch (job.status) {
      case RenderStatus.PENDING:
        stats.pending++;
        break;
      case RenderStatus.PROCESSING:
        stats.processing++;
        break;
      case RenderStatus.COMPLETED:
        stats.completed++;
        break;
      case RenderStatus.FAILED:
        stats.failed++;
        break;
    }
  });

  return stats;
}

// Clean up old jobs (run periodically)
export function cleanupOldJobs() {
  const now = new Date().getTime();
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours

  activeJobs.forEach((job, id) => {
    const jobAge = now - job.createdAt.getTime();
    if (
      jobAge > maxAge &&
      (job.status === RenderStatus.COMPLETED || job.status === RenderStatus.FAILED)
    ) {
      activeJobs.delete(id);
    }
  });
}

// Run cleanup every 30 minutes
setInterval(cleanupOldJobs, 30 * 60 * 1000);
