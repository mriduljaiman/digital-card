'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Phone, Share2, Volume2, VolumeX } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { InviteDisplayData } from '@/types';

// Dynamically import 3D components to avoid SSR issues
const SceneCanvas = dynamic(
  () => import('@/components/scenes/base/scene-canvas').then((mod) => mod.SceneCanvas),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[400px] md:min-h-[600px] bg-gradient-to-br from-royal-darkBlue/50 to-royal-purple/50 animate-pulse" /> }
);

// Cinematic scenes
const WeddingFeraCinematic = dynamic(
  () => import('@/components/scenes/wedding/wedding-fera-cinematic').then((mod) => mod.WeddingFeraCinematic),
  { ssr: false }
);

const BirthdayCakeCinematic = dynamic(
  () => import('@/components/scenes/birthday/birthday-cake-cinematic').then((mod) => mod.BirthdayCakeCinematic),
  { ssr: false }
);

const RoyalMandapScene = dynamic(
  () => import('@/components/scenes/wedding/royal-mandap-scene').then((mod) => mod.RoyalMandapScene),
  { ssr: false }
);

export default function InvitePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [invite, setInvite] = useState<InviteDisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/invites/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvite(data.data);
        } else {
          setError(data.error || 'Failed to load invitation');
        }
      })
      .catch(() => setError('Failed to load invitation'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (!invite?.eventDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const eventTime = new Date(invite.eventDate).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [invite?.eventDate]);

  // Music playback
  useEffect(() => {
    if (!invite?.musicEnabled || !invite?.musicUrl) return;

    const audio = new Audio(invite.musicUrl);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Auto-play with user interaction fallback
    const playAudio = () => {
      audio.play().then(() => {
        setMusicPlaying(true);
      }).catch(() => {
        // Auto-play blocked, require user interaction
        const handleFirstInteraction = () => {
          audio.play();
          setMusicPlaying(true);
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
      });
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [invite?.musicEnabled, invite?.musicUrl]);

  // Helper to get photo by type
  const getPhotoByType = (type: string) => {
    return invite?.photos?.find(photo => photo.type === type)?.processedPath;
  };

  // Render appropriate scene based on event type
  const renderScene = () => {
    if (!invite) return null;

    switch (invite.eventType) {
      case 'WEDDING':
        return (
          <WeddingFeraCinematic
            couplePath={getPhotoByType('COUPLE') || getPhotoByType('HOST') || '/uploads/default-couple.png'}
            hostName={invite.hostName || 'Guest'}
            coHostName={invite.coHostName}
            eventDate={invite.eventDate.toString()}
            theme={invite.theme}
          />
        );

      case 'BIRTHDAY':
        return (
          <BirthdayCakeCinematic
            photoPath={getPhotoByType('HOST') || '/uploads/default-person.png'}
            hostName={invite.hostName || 'Guest'}
            age={invite.eventDate ? new Date().getFullYear() - new Date(invite.eventDate).getFullYear() : undefined}
            theme={invite.theme}
          />
        );

      case 'ENGAGEMENT':
        return (
          <WeddingFeraCinematic
            couplePath={getPhotoByType('COUPLE') || getPhotoByType('HOST') || '/uploads/default-couple.png'}
            hostName={invite.hostName || 'Guest'}
            coHostName={invite.coHostName}
            eventDate={invite.eventDate.toString()}
            theme={invite.theme}
          />
        );

      default:
        // Fallback to old scene
        return (
          <RoyalMandapScene
            hostName={invite.hostName}
            coHostName={invite.coHostName}
            eventDate={invite.eventDate.toString()}
            theme={invite.theme}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-royal-gold border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Invitation Not Found</h1>
            <p className="text-muted-foreground">{error || 'This invitation does not exist.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-darkBlue via-royal-purple to-royal-darkBlue">
      {/* 3D Scene Section */}
      <div className="relative h-screen">
        {/* Music Toggle Button */}
        {invite?.musicEnabled && invite?.musicUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute top-4 right-4 z-20"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
              onClick={() => {
                if (audioRef.current) {
                  if (musicPlaying) {
                    audioRef.current.pause();
                    setMusicPlaying(false);
                  } else {
                    audioRef.current.play().catch(() => {});
                    setMusicPlaying(true);
                  }
                }
              }}
            >
              {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </motion.div>
        )}

        <SceneCanvas>
          {renderScene()}
        </SceneCanvas>

        {/* Overlay Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4"
        >
          <Card className="glass backdrop-blur-xl border-white/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  {invite.hostName}
                  {invite.coHostName && ` & ${invite.coHostName}`}
                </h1>
                <p className="text-white/80 text-lg">
                  {invite.customMessage || 'You are invited to celebrate with us!'}
                </p>
              </div>

              {/* Countdown */}
              {timeLeft && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="text-3xl font-bold text-royal-gold">{value}</div>
                      <div className="text-xs text-white/60 uppercase">{unit}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3 text-white/90 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-royal-gold" />
                  <span>
                    {formatDate(new Date(invite.eventDate))}
                    {invite.eventTime && ` at ${invite.eventTime}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-royal-gold" />
                  <span>{invite.venue}</span>
                </div>
                {invite.rsvpWhatsApp && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-royal-gold" />
                    <span>RSVP: {invite.rsvpWhatsApp}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {invite.mapLink && (
                  <Button
                    asChild
                    variant="gold"
                    className="flex-1"
                  >
                    <a href={invite.mapLink} target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-4 h-4 mr-2" />
                      Directions
                    </a>
                  </Button>
                )}
                {invite.rsvpWhatsApp && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <a
                      href={`https://wa.me/${invite.rsvpWhatsApp.replace(/\D/g, '')}?text=I'd like to RSVP for the event`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      RSVP
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Invitation from ${invite.hostName}`,
                        text: 'You are invited!',
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
