'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  canProceed = true,
  isLastStep = false,
  isLoading = false,
  nextLabel,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-8">
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      ) : (
        <div />
      )}

      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isLoading}
          variant="gold"
          className="gap-2"
        >
          {nextLabel || (isLastStep ? 'Generate Invite' : 'Continue')}
          {!isLastStep && <ArrowRight className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
}
