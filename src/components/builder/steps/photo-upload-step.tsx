'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Camera } from 'lucide-react';
import { useBuilderStore } from '@/hooks/use-builder-store';
import { NavigationButtons } from '../navigation-buttons';
import { useRouter } from 'next/navigation';
import { PhotoType } from '@prisma/client';
import { PHOTO_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function PhotoUploadStep() {
  const router = useRouter();
  const { prevStep, nextStep, photos, setPhoto, removePhoto, eventType } = useBuilderStore();
  const [uploading, setUploading] = useState(false);

  const requiredPhotoTypes: PhotoType[] = eventType === 'WEDDING' || eventType === 'ENGAGEMENT'
    ? [PhotoType.HOST, PhotoType.COHOST]
    : [PhotoType.HOST];

  const handleFileSelect = async (type: PhotoType, file: File) => {
    if (file) {
      // Create preview
      const preview = URL.createObjectURL(file);

      setPhoto(type, {
        file,
        preview,
        uploaded: false,
      });

      // TODO: Upload to server and get fileId
      // For now, just simulate upload
      setTimeout(() => {
        setPhoto(type, {
          uploaded: true,
          fileId: `temp_${Date.now()}_${type}`,
        });
      }, 1000);
    }
  };

  const handleBack = () => {
    prevStep();
    router.push('/create/1');
  };

  const handleNext = () => {
    nextStep();
    router.push('/create/3');
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
          Upload Your Photos
        </h1>
        <p className="text-muted-foreground text-lg">
          Add beautiful photos to personalize your invitation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {requiredPhotoTypes.map((type, index) => {
          const photoData = photos.get(type);
          const hasPhoto = !!photoData?.preview || !!photoData?.file;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <Label className="text-lg font-semibold mb-4 block">
                    {PHOTO_TYPE_LABELS[type]}
                    <span className="text-destructive ml-1">*</span>
                  </Label>

                  {!hasPhoto ? (
                    <label
                      htmlFor={`photo-${type}`}
                      className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-royal-gold hover:bg-muted/50 transition-all aspect-square"
                    >
                      <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">Click to upload photo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      <input
                        id={`photo-${type}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(type, file);
                        }}
                      />
                    </label>
                  ) : (
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                      {photoData.preview && (
                        <Image
                          src={photoData.preview}
                          alt={PHOTO_TYPE_LABELS[type]}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (photoData.preview) {
                              URL.revokeObjectURL(photoData.preview);
                            }
                            removePhoto(type);
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      {!photoData.uploaded && (
                        <div className="absolute top-2 right-2 bg-royal-gold text-royal-darkBlue text-xs px-2 py-1 rounded">
                          Uploading...
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <NavigationButtons
        onBack={handleBack}
        onNext={handleNext}
        canProceed={requiredPhotoTypes.every((type) => photos.has(type))}
      />
    </div>
  );
}
