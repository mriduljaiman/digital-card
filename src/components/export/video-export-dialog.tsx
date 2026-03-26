'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VideoExportDialogProps {
  slug: string;
  userPlan?: 'FREE' | 'PRO' | 'PREMIUM';
}

export function VideoExportDialog({ slug, userPlan = 'FREE' }: VideoExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  // Settings
  const [duration, setDuration] = useState('15');
  const [quality, setQuality] = useState('medium');
  const [resolution, setResolution] = useState('1080p');
  const [includeMusic, setIncludeMusic] = useState(true);

  const handleExport = async () => {
    setLoading(true);
    setProgress(0);
    setStatus('Preparing video export...');
    setVideoUrl(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);

      const response = await fetch('/api/export/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          settings: {
            duration: parseInt(duration),
            quality,
            resolution,
            includeMusic,
          },
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export video');
      }

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        setStatus('Video ready!');
        setVideoUrl(data.data.video);
        setFileName(data.data.fileName);
      } else {
        throw new Error(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      setStatus(error instanceof Error ? error.message : 'Export failed');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getQualityOptions = () => {
    if (userPlan === 'FREE') {
      return [{ value: 'low', label: 'Low (Free Plan)' }];
    }
    if (userPlan === 'PRO') {
      return [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ];
    }
    return [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'ultra', label: 'Ultra (Premium)' },
    ];
  };

  const getResolutionOptions = () => {
    if (userPlan === 'FREE') {
      return [{ value: '720p', label: '720p (Free Plan)' }];
    }
    if (userPlan === 'PRO') {
      return [
        { value: '720p', label: '720p' },
        { value: '1080p', label: '1080p (Full HD)' },
      ];
    }
    return [
      { value: '720p', label: '720p' },
      { value: '1080p', label: '1080p (Full HD)' },
      { value: '4k', label: '4K (Ultra HD)' },
    ];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Video className="w-4 h-4 mr-2" />
          Export Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export as Video</DialogTitle>
          <DialogDescription>
            Create a video version of your invitation with customizable settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Select value={duration} onValueChange={setDuration} disabled={loading}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="20">20 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <Label htmlFor="quality">Quality</Label>
            <Select value={quality} onValueChange={setQuality} disabled={loading}>
              <SelectTrigger id="quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getQualityOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Select value={resolution} onValueChange={setResolution} disabled={loading}>
              <SelectTrigger id="resolution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getResolutionOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Include Music */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="music"
              checked={includeMusic}
              onChange={(e) => setIncludeMusic(e.target.checked)}
              disabled={loading}
              className="w-4 h-4"
            />
            <Label htmlFor="music" className="cursor-pointer">
              Include background music
            </Label>
          </div>

          {/* Progress */}
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{status}</p>
            </div>
          )}

          {/* Success */}
          {videoUrl && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">{status}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {!videoUrl ? (
              <Button
                onClick={handleExport}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    setVideoUrl(null);
                    setProgress(0);
                    setStatus('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Export Again
                </Button>
              </>
            )}
          </div>

          {/* Plan Notice */}
          {userPlan === 'FREE' && (
            <p className="text-xs text-muted-foreground text-center">
              Upgrade to Pro for higher quality and resolution options
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
