'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Glasses, Smartphone, Info } from 'lucide-react';

export function XRFeatureCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          AR/VR Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Glasses className="w-5 h-5 text-royal-gold mt-1" />
            <div>
              <h4 className="font-semibold">Virtual Reality (VR)</h4>
              <p className="text-sm text-muted-foreground">
                Experience your invitation in immersive 3D using VR headsets like Meta Quest,
                Valve Index, or any WebXR-compatible device.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-royal-gold mt-1" />
            <div>
              <h4 className="font-semibold">Augmented Reality (AR)</h4>
              <p className="text-sm text-muted-foreground">
                View your invitation in your real-world space using your phone's camera.
                Works on iOS (Safari) and Android (Chrome).
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• VR: WebXR-compatible browser and VR headset</li>
            <li>• AR: Modern smartphone with ARCore (Android) or ARKit (iOS)</li>
            <li>• Secure context (HTTPS) required for WebXR</li>
          </ul>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> AR/VR features are available for Premium users.
            These features work best on supported devices and browsers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
