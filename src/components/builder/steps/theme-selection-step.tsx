'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { NavigationButtons } from '../navigation-buttons';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, Crown } from 'lucide-react';
import { ThemeConfig } from '@/types';

export function ThemeSelectionStep() {
  const router = useRouter();
  const { prevStep, nextStep, selectedThemeId, setTheme, eventType } = useBuilderStore();
  const [themes, setThemes] = useState<ThemeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch themes for the selected event type
    fetch(`/api/themes?eventType=${eventType}`)
      .then((res) => res.json())
      .then((data) => {
        setThemes(data.themes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventType]);

  const handleBack = () => {
    prevStep();
    router.push('/create/2');
  };

  const handleNext = () => {
    nextStep();
    router.push('/create/4');
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Choose Your Theme
        </h1>
        <p className="text-muted-foreground text-lg">
          Select a stunning 3D theme for your invitation
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-royal-gold border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading themes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {themes.map((theme, index) => {
            const isSelected = selectedThemeId === theme.id;

            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-xl overflow-hidden group',
                    isSelected && 'ring-2 ring-royal-gold shadow-2xl'
                  )}
                  onClick={() => setTheme(theme.id)}
                >
                  {/* Placeholder thumbnail */}
                  <div
                    className="h-48 bg-gradient-to-br from-royal-gold/20 to-royal-purple/20 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.secondary}40 100%)`,
                    }}
                  >
                    <Sparkles className="w-16 h-16 text-royal-gold/50" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-royal-gold/20 flex items-center justify-center">
                        <div className="bg-royal-gold text-royal-darkBlue px-4 py-2 rounded-full font-semibold">
                          Selected
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{theme.name}</h3>
                      {theme.isPremium && (
                        <Badge variant="secondary" className="bg-gold-gradient text-royal-darkBlue">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {theme.description}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary color"
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary color"
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent color"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <NavigationButtons
        onBack={handleBack}
        onNext={handleNext}
        canProceed={!!selectedThemeId}
      />
    </div>
  );
}
