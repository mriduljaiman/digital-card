'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { EVENT_TYPE_LABELS, EVENT_TYPE_DESCRIPTIONS, EVENT_TYPE_ICONS } from '@/lib/constants';
import { EventType } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { NavigationButtons } from '../navigation-buttons';
import { useRouter } from 'next/navigation';

export function EventTypeStep() {
  const router = useRouter();
  const { eventType, setEventType, nextStep, canProceed } = useBuilderStore();

  const handleSelect = (type: EventType) => {
    setEventType(type);
  };

  const handleNext = () => {
    nextStep();
    router.push('/create/2');
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Choose Your Event Type
        </h1>
        <p className="text-muted-foreground text-lg">
          Select the type of celebration you're planning
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(EVENT_TYPE_LABELS).map(([type, label], index) => {
          const eventTypeValue = type as EventType;
          const isSelected = eventType === eventTypeValue;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  isSelected && 'ring-2 ring-royal-gold shadow-xl'
                )}
                onClick={() => handleSelect(eventTypeValue)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{EVENT_TYPE_ICONS[eventTypeValue]}</div>
                  <h3 className="text-xl font-semibold mb-2">{label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {EVENT_TYPE_DESCRIPTIONS[eventTypeValue]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <NavigationButtons
        onNext={handleNext}
        canProceed={canProceed(1)}
      />
    </div>
  );
}
