'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { NavigationButtons } from '../navigation-buttons';
import { useRouter } from 'next/navigation';
import { eventDetailsSchema, EventDetailsFormData } from '@/lib/validations';

export function EventDetailsStep() {
  const router = useRouter();
  const { prevStep, nextStep, eventDetails, setEventDetails } = useBuilderStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventDetailsFormData>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: eventDetails as any,
  });

  const onSubmit = (data: EventDetailsFormData) => {
    setEventDetails(data);
    nextStep();
    router.push('/create/5');
  };

  const handleBack = () => {
    prevStep();
    router.push('/create/3');
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Event Details
        </h1>
        <p className="text-muted-foreground text-lg">
          Add all the important information for your guests
        </p>
      </motion.div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Host Name */}
            <div>
              <Label htmlFor="hostName">
                Host Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hostName"
                placeholder="e.g., Priya"
                {...register('hostName')}
                className="mt-2"
              />
              {errors.hostName && (
                <p className="text-sm text-destructive mt-1">{errors.hostName.message}</p>
              )}
            </div>

            {/* Co-Host Name */}
            <div>
              <Label htmlFor="coHostName">Co-Host Name (Optional)</Label>
              <Input
                id="coHostName"
                placeholder="e.g., Rahul"
                {...register('coHostName')}
                className="mt-2"
              />
              {errors.coHostName && (
                <p className="text-sm text-destructive mt-1">{errors.coHostName.message}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">
                  Event Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  {...register('eventDate', { valueAsDate: true })}
                  className="mt-2"
                />
                {errors.eventDate && (
                  <p className="text-sm text-destructive mt-1">{errors.eventDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="eventTime">
                  Event Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="eventTime"
                  type="time"
                  {...register('eventTime')}
                  className="mt-2"
                />
                {errors.eventTime && (
                  <p className="text-sm text-destructive mt-1">{errors.eventTime.message}</p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div>
              <Label htmlFor="venue">
                Venue <span className="text-destructive">*</span>
              </Label>
              <Input
                id="venue"
                placeholder="e.g., Grand Palace Hotel"
                {...register('venue')}
                className="mt-2"
              />
              {errors.venue && (
                <p className="text-sm text-destructive mt-1">{errors.venue.message}</p>
              )}
            </div>

            {/* Venue Address */}
            <div>
              <Label htmlFor="venueAddress">Venue Address (Optional)</Label>
              <Input
                id="venueAddress"
                placeholder="123 Main St, City, State"
                {...register('venueAddress')}
                className="mt-2"
              />
            </div>

            {/* Map Link */}
            <div>
              <Label htmlFor="mapLink">Google Maps Link (Optional)</Label>
              <Input
                id="mapLink"
                placeholder="https://maps.google.com/..."
                {...register('mapLink')}
                className="mt-2"
              />
              {errors.mapLink && (
                <p className="text-sm text-destructive mt-1">{errors.mapLink.message}</p>
              )}
            </div>

            {/* RSVP WhatsApp */}
            <div>
              <Label htmlFor="rsvpWhatsApp">WhatsApp Number for RSVP (Optional)</Label>
              <Input
                id="rsvpWhatsApp"
                placeholder="+1234567890"
                {...register('rsvpWhatsApp')}
                className="mt-2"
              />
              {errors.rsvpWhatsApp && (
                <p className="text-sm text-destructive mt-1">{errors.rsvpWhatsApp.message}</p>
              )}
            </div>

            {/* Contact Email */}
            <div>
              <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="email@example.com"
                {...register('contactEmail')}
                className="mt-2"
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>
              )}
            </div>

            {/* Custom Message */}
            <div>
              <Label htmlFor="customMessage">Personal Message (Optional)</Label>
              <textarea
                id="customMessage"
                placeholder="Add a personal message to your guests..."
                {...register('customMessage')}
                className="mt-2 w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.customMessage && (
                <p className="text-sm text-destructive mt-1">{errors.customMessage.message}</p>
              )}
            </div>

            <NavigationButtons
              onBack={handleBack}
              onNext={handleSubmit(onSubmit)}
              canProceed={true}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
