'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Download,
  RefreshCw,
} from 'lucide-react';

interface RenderJob {
  id: string;
  invitationSlug: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  settings: {
    duration: number;
    quality: string;
    resolution: string;
  };
  outputPath?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export function RenderQueueMonitor() {
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchJobs();
      fetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/render/queue');
      const data = await response.json();

      if (data.success) {
        setJobs(data.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/render/queue?stats=true');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCancel = async (jobId: string) => {
    try {
      const response = await fetch(`/api/render/queue?jobId=${jobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchJobs();
      } else {
        alert(data.error || 'Failed to cancel job');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel job');
    }
  };

  const handleDownload = (job: RenderJob) => {
    if (!job.outputPath) return;

    const link = document.createElement('a');
    link.href = job.outputPath;
    link.download = `invitation-${job.invitationSlug}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: RenderJob['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'PROCESSING':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: RenderJob['status']) => {
    switch (status) {
      case 'PENDING':
        return 'In Queue';
      case 'PROCESSING':
        return 'Rendering';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Render Queue
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={fetchJobs}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Queue Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-muted">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No render jobs yet</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(job.status)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">
                          {job.invitationSlug}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {getStatusText(job.status)}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {job.settings.resolution} • {job.settings.quality} quality
                        {' • '}
                        {job.settings.duration}s
                      </p>

                      {/* Progress Bar */}
                      {(job.status === 'PROCESSING' || job.status === 'PENDING') && (
                        <div className="space-y-1">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {job.progress}% complete
                          </p>
                        </div>
                      )}

                      {/* Error Message */}
                      {job.status === 'FAILED' && job.error && (
                        <p className="text-sm text-red-600">{job.error}</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        {job.status === 'COMPLETED' && job.outputPath && (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(job)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        )}

                        {job.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(job.id)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        )}

                        <span className="text-xs text-muted-foreground self-center ml-auto">
                          {new Date(job.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
