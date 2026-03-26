'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { NavigationButtons } from '../navigation-buttons';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Phone, Mail, Music } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { EVENT_TYPE_LABELS } from '@/lib/constants';

export function PreviewStep() {
  const router = useRouter();
  const {
    prevStep,
    eventType,
    eventDetails,
    selectedThemeId,
    photos,
    musicEnabled,
    animationSpeed,
    getSubmissionData,
  } = useBuilderStore();

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    prevStep();
    router.push('/create/4');
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const data = getSubmissionData();

      const response = await fetch('/api/invites/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create invitation');
      }

      const result = await response.json();

      if (result.success) {
        // Redirect to the generated invite
        router.push(`/invite/${result.data.slug}`);
      } else {
        throw new Error(result.error || 'Failed to create invitation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Preview Your Invitation
        </h1>
        <p className="text-muted-foreground text-lg">
          Review all the details before generating your invite
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">
        {/* Event Type */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Event Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Event Type:</span>
                <span className="font-medium">{eventType && EVENT_TYPE_LABELS[eventType]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Theme:</span>
                <span className="font-medium">{selectedThemeId ? 'Selected' : 'Not selected'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Photos:</span>
                <span className="font-medium">{photos.size} uploaded</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Event Details</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Host(s)</div>
                <div className="font-medium">
                  {eventDetails.hostName}
                  {eventDetails.coHostName && ` & ${eventDetails.coHostName}`}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-royal-gold mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Date & Time</div>
                  <div className="font-medium">
                    {eventDetails.eventDate ? formatDate(eventDetails.eventDate) : 'Not set'}
                    {eventDetails.eventTime && ` at ${eventDetails.eventTime}`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-royal-gold mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Venue</div>
                  <div className="font-medium">{eventDetails.venue || 'Not set'}</div>
                  {eventDetails.venueAddress && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {eventDetails.venueAddress}
                    </div>
                  )}
                </div>
              </div>

              {eventDetails.rsvpWhatsApp && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-royal-gold mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">RSVP WhatsApp</div>
                    <div className="font-medium">{eventDetails.rsvpWhatsApp}</div>
                  </div>
                </div>
              )}

              {eventDetails.contactEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-royal-gold mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Contact Email</div>
                    <div className="font-medium">{eventDetails.contactEmail}</div>
                  </div>
                </div>
              )}

              {eventDetails.customMessage && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Personal Message</div>
                  <div className="text-sm bg-muted p-3 rounded-lg">{eventDetails.customMessage}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-royal-gold" />
                  <span className="text-muted-foreground">Background Music:</span>
                </div>
                <span className="font-medium">{musicEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Animation Speed:</span>
                <span className="font-medium capitalize">{animationSpeed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <NavigationButtons
        onBack={handleBack}
        onNext={handleGenerate}
        isLastStep
        isLoading={generating}
        nextLabel={generating ? 'Generating...' : 'Generate Invite'}
        canProceed={!generating}
      />
    </div>
  );
}
