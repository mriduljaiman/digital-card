'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { EventTypeStep } from '@/components/builder/steps/event-type-step';
import { PhotoUploadStep } from '@/components/builder/steps/photo-upload-step';
import { ThemeSelectionStep } from '@/components/builder/steps/theme-selection-step';
import { EventDetailsStep } from '@/components/builder/steps/event-details-step';
import { PreviewStep } from '@/components/builder/steps/preview-step';

export default function CreateStepPage() {
  const params = useParams();
  const router = useRouter();
  const { setStep } = useBuilderStore();

  const stepNumber = parseInt(params.step as string);

  useEffect(() => {
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 5) {
      router.push('/create/1');
      return;
    }
    setStep(stepNumber);
  }, [stepNumber, setStep, router]);

  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 5) {
    return null;
  }

  return (
    <>
      {stepNumber === 1 && <EventTypeStep />}
      {stepNumber === 2 && <PhotoUploadStep />}
      {stepNumber === 3 && <ThemeSelectionStep />}
      {stepNumber === 4 && <EventDetailsStep />}
      {stepNumber === 5 && <PreviewStep />}
    </>
  );
}
