'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Glasses, Smartphone, AlertCircle } from 'lucide-react';

// Dynamically import XR components to avoid SSR issues
const XRCanvas = dynamic(
  () => import('./xr-canvas-wrapper').then((mod) => mod.XRCanvasWrapper),
  { ssr: false }
);

interface WebXRPreviewProps {
  invitationSlug?: string;
  sceneComponent: React.ComponentType<any>;
  sceneProps: any;
}

export function WebXRPreview({
  invitationSlug,
  sceneComponent,
  sceneProps,
}: WebXRPreviewProps) {
  const [mode, setMode] = useState<'vr' | 'ar' | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const checkXRSupport = async (mode: 'vr' | 'ar') => {
    if (!navigator.xr) {
      setIsSupported(false);
      return false;
    }

    try {
      const supported = await navigator.xr.isSessionSupported(
        mode === 'vr' ? 'immersive-vr' : 'immersive-ar'
      );
      if (!supported) {
        setIsSupported(false);
      }
      return supported;
    } catch (error) {
      console.error('XR support check failed:', error);
      setIsSupported(false);
      return false;
    }
  };

  const handleVRClick = async () => {
    const supported = await checkXRSupport('vr');
    if (supported) {
      setMode('vr');
    } else {
      alert(
        'VR is not supported on this device. Please use a VR-capable browser or device.'
      );
    }
  };

  const handleARClick = async () => {
    const supported = await checkXRSupport('ar');
    if (supported) {
      setMode('ar');
    } else {
      alert(
        'AR is not supported on this device. Please use an AR-capable mobile browser (Chrome/Safari on iOS/Android).'
      );
    }
  };

  return (
    <div className="flex gap-2">
      {/* VR Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleVRClick}>
            <Glasses className="w-4 h-4 mr-2" />
            View in VR
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>VR Preview</DialogTitle>
            <DialogDescription>
              Put on your VR headset and click "Enter VR" to experience the invitation in virtual reality
            </DialogDescription>
          </DialogHeader>
          {mode === 'vr' && isSupported && (
            <div className="w-full h-full">
              <XRCanvas
                mode="vr"
                sceneComponent={sceneComponent}
                sceneProps={sceneProps}
              />
            </div>
          )}
          {!isSupported && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                VR is not supported on this device
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please use a VR headset with a compatible browser
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AR Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleARClick}>
            <Smartphone className="w-4 h-4 mr-2" />
            View in AR
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>AR Preview</DialogTitle>
            <DialogDescription>
              Point your device camera to view the invitation in your space
            </DialogDescription>
          </DialogHeader>
          {mode === 'ar' && isSupported && (
            <div className="w-full h-full">
              <XRCanvas
                mode="ar"
                sceneComponent={sceneComponent}
                sceneProps={sceneProps}
              />
            </div>
          )}
          {!isSupported && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                AR is not supported on this device
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please use Chrome on Android or Safari on iOS
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
