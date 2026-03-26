'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Zap, Download, Share2, Music, Calendar } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: '3D Animated Scenes',
    description: 'Stunning 3D environments with your photos beautifully integrated',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Ready in Minutes',
    description: 'Create professional invitations in just 5-10 minutes',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Multiple Formats',
    description: 'Download as PDF, image, or get a shareable web link',
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'QR Code Sharing',
    description: 'Generate QR codes for easy sharing and RSVP tracking',
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: 'Background Music',
    description: 'Add beautiful music to set the perfect mood',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Live Countdown',
    description: 'Animated countdown timer to your special day',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional features that make your invitations stand out
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-gradient rounded-lg mb-4 text-royal-darkBlue">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
