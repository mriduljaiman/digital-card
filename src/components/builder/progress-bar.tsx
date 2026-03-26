'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUILDER_STEPS } from '@/lib/constants';

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        {BUILDER_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all',
                    isCompleted && 'bg-royal-gold text-royal-darkBlue',
                    isCurrent && 'bg-royal-gold text-royal-darkBlue ring-4 ring-royal-gold/30',
                    isUpcoming && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <span className="text-sm md:text-base">{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs md:text-sm mt-2 font-medium text-center',
                    (isCompleted || isCurrent) && 'text-foreground',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Connector Line */}
              {index < BUILDER_STEPS.length - 1 && (
                <div className="flex-1 h-1 mx-2 md:mx-4">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      isCompleted && 'bg-royal-gold',
                      !isCompleted && 'bg-muted'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
