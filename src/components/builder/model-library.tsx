'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Download, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';

// Dynamically import 3D components
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
);

const useGLTF = dynamic(
  () => import('@react-three/drei').then((mod) => mod.useGLTF),
  { ssr: false }
);

const Environment = dynamic(
  () => import('@react-three/drei').then((mod) => mod.Environment),
  { ssr: false }
);

interface Model {
  id: string;
  name: string;
  path: string;
  size: number;
  uploadedAt: string;
  extension: string;
}

interface ModelLibraryProps {
  onSelectModel?: (model: Model) => void;
}

export function ModelLibrary({ onSelectModel }: ModelLibraryProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewModel, setPreviewModel] = useState<Model | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models/upload');
      const data = await response.json();

      if (data.success) {
        setModels(data.data.models);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model?')) {
      return;
    }

    setDeleting(modelId);

    try {
      const response = await fetch(`/api/models/upload?modelId=${modelId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setModels(models.filter((m) => m.id !== modelId));
      } else {
        alert(data.error || 'Failed to delete model');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete model');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (model: Model) => {
    const link = document.createElement('a');
    link.href = model.path;
    link.download = model.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (models.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No models uploaded yet. Upload your first 3D model to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My 3D Models ({models.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-royal-darkBlue to-royal-purple flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">🎨</div>
                    <p className="text-sm uppercase tracking-wider">
                      {model.extension}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate mb-1">{model.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {(model.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                    {new Date(model.uploadedAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPreviewModel(model)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(model)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => handleDelete(model.id)}
                      disabled={deleting === model.id}
                    >
                      {deleting === model.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>

                  {onSelectModel && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => onSelectModel(model)}
                    >
                      Use This Model
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewModel} onOpenChange={() => setPreviewModel(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewModel?.name}</DialogTitle>
            <DialogDescription>3D Model Preview</DialogDescription>
          </DialogHeader>
          {previewModel && (
            <div className="w-full h-96 bg-gradient-to-br from-royal-darkBlue to-royal-purple rounded-lg overflow-hidden">
              <ModelPreview modelPath={previewModel.path} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// 3D Model Preview Component
function ModelPreview({ modelPath }: { modelPath: string }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      }
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Suspense fallback={null}>
          <Model3D url={modelPath} />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
        />

        <Environment preset="sunset" />
      </Canvas>
    </Suspense>
  );
}

// Model loader component
function Model3D({ url }: { url: string }) {
  // This is a placeholder - in a real implementation, you'd use useGLTF
  // For now, we'll just show a placeholder since we can't actually load the model
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
  );
}
