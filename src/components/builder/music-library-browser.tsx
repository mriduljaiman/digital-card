'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Music,
  Check,
  Lock,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  MUSIC_LIBRARY,
  getMusicByEventType,
  getMusicByMood,
  getAvailableMoods,
  formatDuration,
  MusicTrack,
} from '@/lib/music-library';

interface MusicLibraryBrowserProps {
  eventType?: string;
  userPlan?: 'FREE' | 'PRO' | 'PREMIUM';
  onSelectTrack?: (track: MusicTrack | { path: string; title: string }) => void;
  selectedTrackPath?: string;
}

export function MusicLibraryBrowser({
  eventType = 'wedding',
  userPlan = 'FREE',
  onSelectTrack,
  selectedTrackPath,
}: MusicLibraryBrowserProps) {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [userTracks, setUserTracks] = useState<any[]>([]);
  const [loadingUserTracks, setLoadingUserTracks] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const libraryTracks = getMusicByEventType(eventType, userPlan);
  const moods = getAvailableMoods();

  useEffect(() => {
    if (userPlan !== 'FREE') {
      fetchUserTracks();
    }
  }, [userPlan]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setPlayingTrack(null);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const fetchUserTracks = async () => {
    setLoadingUserTracks(true);
    try {
      const response = await fetch('/api/music/upload');
      const data = await response.json();
      if (data.success) {
        setUserTracks(data.data.tracks);
      }
    } catch (error) {
      console.error('Error fetching user tracks:', error);
    } finally {
      setLoadingUserTracks(false);
    }
  };

  const handlePlayPause = (trackPath: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingTrack === trackPath) {
      audio.pause();
      setPlayingTrack(null);
    } else {
      audio.src = trackPath;
      audio.play();
      setPlayingTrack(trackPath);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const response = await fetch('/api/music/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await fetchUserTracks();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload music');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;

    try {
      const response = await fetch(`/api/music/upload?trackId=${trackId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchUserTracks();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const renderTrackItem = (track: MusicTrack, isUserTrack = false) => {
    const isPlaying = playingTrack === track.path;
    const isSelected = selectedTrackPath === track.path;
    const isLocked = track.isPremium && userPlan === 'FREE';

    return (
      <div
        key={track.id}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
          isSelected
            ? 'border-royal-gold bg-royal-gold/10'
            : 'border-transparent hover:bg-muted'
        }`}
      >
        <Button
          size="sm"
          variant="ghost"
          className="h-10 w-10 rounded-full"
          onClick={() => !isLocked && handlePlayPause(track.path)}
          disabled={isLocked}
        >
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{track.title}</p>
            {track.isPremium && (
              <span className="text-xs bg-royal-gold/20 text-royal-gold px-2 py-0.5 rounded">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {track.artist} • {formatDuration(track.duration)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSelected && <Check className="w-5 h-5 text-royal-gold" />}
          {!isLocked && onSelectTrack && (
            <Button
              size="sm"
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onSelectTrack(track)}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          )}
          {isUserTrack && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => handleDeleteTrack(track.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Music Library</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Player */}
        <audio ref={audioRef} />

        {/* Now Playing */}
        {playingTrack && (
          <Card className="bg-muted">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Now Playing</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={(v) => setVolume(v[0])}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{formatDuration(Math.floor(duration))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="library">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="mood">By Mood</TabsTrigger>
            <TabsTrigger value="uploads" disabled={userPlan === 'FREE'}>
              My Uploads {userPlan === 'FREE' && '🔒'}
            </TabsTrigger>
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-2 max-h-96 overflow-y-auto">
            {libraryTracks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No tracks available for this event type
              </p>
            ) : (
              libraryTracks.map((track) => renderTrackItem(track))
            )}
          </TabsContent>

          {/* Mood Tab */}
          <TabsContent value="mood" className="space-y-4">
            {moods.map((mood) => {
              const moodTracks = getMusicByMood(mood, userPlan);
              if (moodTracks.length === 0) return null;

              return (
                <div key={mood} className="space-y-2">
                  <h4 className="font-medium capitalize">{mood}</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {moodTracks.map((track) => renderTrackItem(track))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* User Uploads Tab */}
          <TabsContent value="uploads" className="space-y-4">
            {userPlan !== 'FREE' && (
              <>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="flex-1"
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Music
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp3,.wav,.ogg,.m4a"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {loadingUserTracks ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : userTracks.length === 0 ? (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No uploads yet. Upload your custom music tracks!
                      </p>
                    </div>
                  ) : (
                    userTracks.map((track) =>
                      renderTrackItem(
                        {
                          id: track.id,
                          title: track.title,
                          artist: 'Custom Upload',
                          mood: 'romantic',
                          duration: 0,
                          path: track.path,
                          eventTypes: [],
                        },
                        true
                      )
                    )
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {userPlan === 'FREE' && (
          <p className="text-xs text-muted-foreground text-center">
            Upgrade to Pro or Premium to upload custom music and access premium tracks
          </p>
        )}
      </CardContent>
    </Card>
  );
}
