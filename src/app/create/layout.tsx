'use client';

import { useBuilderStore } from '@/hooks/use-builder-store';
import { ProgressBar } from '@/components/builder/progress-bar';

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentStep = useBuilderStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto">
        <ProgressBar currentStep={currentStep} />
        <div className="pb-16">{children}</div>
      </div>
    </div>
  );
}
