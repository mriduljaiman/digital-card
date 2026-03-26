'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ModelUploadProps {
  userPlan?: 'FREE' | 'PRO' | 'PREMIUM';
  onUploadComplete?: (modelData: any) => void;
}

export function ModelUpload({ userPlan = 'FREE', onUploadComplete }: ModelUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = userPlan === 'PREMIUM' ? 50 : userPlan === 'PRO' ? 20 : 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Validate file extension
    const validExtensions = ['.glb', '.gltf'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setError(`Invalid file type. Please upload ${validExtensions.join(' or ')} files.`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setError(`File too large. Maximum size: ${maxFileSize}MB for ${userPlan} plan.`);
      return;
    }

    setSelectedFile(file);
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleAdditionalFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);

      // Add additional files (for GLTF)
      if (selectedFile.name.endsWith('.gltf')) {
        additionalFiles.forEach((file) => {
          if (file.name.endsWith('.bin')) {
            formData.append('bin', file);
          } else {
            formData.append('textures', file);
          }
        });
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/models/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        setSuccess(true);

        if (onUploadComplete) {
          onUploadComplete(data.data);
        }

        // Reset form after 2 seconds
        setTimeout(() => {
          setSelectedFile(null);
          setAdditionalFiles([]);
          setName('');
          setDescription('');
          setCategory('custom');
          setProgress(0);
          setSuccess(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          if (additionalFilesInputRef.current) additionalFilesInputRef.current.value = '';
        }, 2000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload model');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (userPlan === 'FREE') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Custom 3D Models</h3>
          <p className="text-muted-foreground mb-4">
            Upload your own 3D models to create truly unique invitations
          </p>
          <Button disabled className="mb-2">
            Upgrade to Pro or Premium
          </Button>
          <p className="text-xs text-muted-foreground">
            Available for Pro (20MB) and Premium (50MB) users
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload 3D Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            selectedFile
              ? 'border-royal-gold bg-royal-gold/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <File className="w-8 h-8 text-royal-gold" />
              <div className="text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium mb-1">Click to upload 3D model</p>
              <p className="text-sm text-muted-foreground">
                GLB or GLTF format (max {maxFileSize}MB)
              </p>
            </div>
          )}
        </div>

        {/* Additional Files for GLTF */}
        {selectedFile?.name.endsWith('.gltf') && (
          <div className="space-y-2">
            <Label>Additional Files (textures, .bin)</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => additionalFilesInputRef.current?.click()}
            >
              <input
                ref={additionalFilesInputRef}
                type="file"
                multiple
                onChange={handleAdditionalFilesSelect}
                className="hidden"
              />
              {additionalFiles.length > 0 ? (
                <div className="space-y-1">
                  {additionalFiles.map((file, index) => (
                    <p key={index} className="text-sm">
                      {file.name}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to add textures and .bin files
                </p>
              )}
            </div>
          </div>
        )}

        {/* Model Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Model Name</Label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter model name"
              className="w-full px-3 py-2 rounded-md border bg-background"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your model"
              className="w-full px-3 py-2 rounded-md border bg-background min-h-20"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={uploading}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="decorations">Decorations</SelectItem>
                <SelectItem value="characters">Characters</SelectItem>
                <SelectItem value="props">Props</SelectItem>
                <SelectItem value="environments">Environments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Model uploaded successfully!</span>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !name}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Model'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Supported formats: GLB (recommended), GLTF
          <br />
          Maximum file size: {maxFileSize}MB for {userPlan} plan
        </p>
      </CardContent>
    </Card>
  );
}
