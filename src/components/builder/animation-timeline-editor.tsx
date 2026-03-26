'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
} from 'lucide-react';
import { gsap, AnimationTimeline, ANIMATION_PRESETS } from '@/lib/animations/gsap-config';

interface AnimationLayer {
  id: string;
  name: string;
  element: string;
  animationType: string;
  duration: number;
  delay: number;
  ease: string;
  properties: Record<string, any>;
  startTime: number;
}

interface AnimationTimelineEditorProps {
  eventType?: 'wedding' | 'birthday' | 'engagement' | 'anniversary';
  onSave?: (timeline: AnimationLayer[]) => void;
}

const EASE_OPTIONS = [
  { value: 'power1.out', label: 'Power 1 Out' },
  { value: 'power2.out', label: 'Power 2 Out' },
  { value: 'power3.out', label: 'Power 3 Out' },
  { value: 'back.out(1.7)', label: 'Back Out' },
  { value: 'elastic.out(1, 0.5)', label: 'Elastic Out' },
  { value: 'bounce.out', label: 'Bounce Out' },
  { value: 'power1.inOut', label: 'Power 1 InOut' },
  { value: 'power2.inOut', label: 'Power 2 InOut' },
];

const ANIMATION_TYPES = {
  entrance: [
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'slideUp', label: 'Slide Up' },
    { value: 'slideDown', label: 'Slide Down' },
    { value: 'slideLeft', label: 'Slide Left' },
    { value: 'slideRight', label: 'Slide Right' },
    { value: 'scale', label: 'Scale In' },
    { value: 'rotate', label: 'Rotate In' },
  ],
  loop: [
    { value: 'float', label: 'Float' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'glow', label: 'Glow' },
  ],
  effect: [
    { value: 'bounce', label: 'Bounce' },
    { value: 'shake', label: 'Shake' },
    { value: 'wiggle', label: 'Wiggle' },
    { value: 'sparkle', label: 'Sparkle' },
  ],
};

export function AnimationTimelineEditor({
  eventType = 'wedding',
  onSave,
}: AnimationTimelineEditorProps) {
  const [layers, setLayers] = useState<AnimationLayer[]>([
    {
      id: '1',
      name: 'Title Entrance',
      element: '.title',
      animationType: 'fadeIn',
      duration: 1.5,
      delay: 0,
      ease: 'power2.out',
      properties: { opacity: 0, y: -50 },
      startTime: 0,
    },
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(5);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate total duration
    const maxTime = layers.reduce((max, layer) => {
      const endTime = layer.startTime + layer.delay + layer.duration;
      return Math.max(max, endTime);
    }, 0);
    setTotalDuration(Math.max(maxTime, 5));
  }, [layers]);

  const buildTimeline = () => {
    if (!previewRef.current) return null;

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        setCurrentTime(tl.time());
      },
      onComplete: () => {
        setIsPlaying(false);
      },
    });

    // Sort layers by start time
    const sortedLayers = [...layers].sort((a, b) => a.startTime - b.startTime);

    sortedLayers.forEach((layer) => {
      const element = previewRef.current?.querySelector(layer.element);
      if (!element) return;

      const animation = {
        ...layer.properties,
        duration: layer.duration,
        ease: layer.ease,
      };

      tl.from(element, animation, layer.startTime + layer.delay);
    });

    return tl;
  };

  const handlePlay = () => {
    if (!timelineRef.current) {
      timelineRef.current = buildTimeline();
    }

    if (timelineRef.current) {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
      setIsPlaying(true);
    } else {
      handlePlay();
    }
  };

  const handleAddLayer = () => {
    const newLayer: AnimationLayer = {
      id: Date.now().toString(),
      name: `Layer ${layers.length + 1}`,
      element: '.element',
      animationType: 'fadeIn',
      duration: 1,
      delay: 0,
      ease: 'power2.out',
      properties: { opacity: 0, y: 50 },
      startTime: currentTime,
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const handleDeleteLayer = (id: string) => {
    setLayers(layers.filter((layer) => layer.id !== id));
    if (selectedLayer === id) {
      setSelectedLayer(layers[0]?.id || '');
    }
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex((layer) => layer.id === id);
    if (index === -1) return;

    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= layers.length) return;

    [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];
    setLayers(newLayers);
  };

  const handleUpdateLayer = (id: string, updates: Partial<AnimationLayer>) => {
    setLayers(
      layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );

    // Rebuild timeline
    timelineRef.current = null;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(layers);
    }
  };

  const selectedLayerData = layers.find((layer) => layer.id === selectedLayer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Preview Panel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Animation Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Preview Area */}
          <div
            ref={previewRef}
            className="relative w-full h-96 bg-gradient-to-br from-royal-darkBlue to-royal-purple rounded-lg overflow-hidden mb-4"
          >
            {/* Sample elements for preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="title text-4xl font-bold text-white">
                Your Event Title
              </div>
            </div>
            <div className="element absolute top-20 left-20 w-16 h-16 bg-royal-gold rounded-full" />
            <div className="element absolute bottom-20 right-20 w-12 h-12 bg-accent-rose rounded-lg" />
          </div>

          {/* Playback Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRestart}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={isPlaying ? 'secondary' : 'default'}
                onClick={isPlaying ? handlePause : handlePlay}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1 mx-4">
                <Slider
                  value={[currentTime]}
                  max={totalDuration}
                  step={0.1}
                  onValueChange={(value) => {
                    setCurrentTime(value[0]);
                    if (timelineRef.current) {
                      timelineRef.current.time(value[0]);
                    }
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground min-w-20">
                {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
              </span>
            </div>

            {/* Timeline */}
            <div className="relative h-24 bg-muted rounded-lg p-2">
              <div className="relative h-full">
                {layers.map((layer) => {
                  const left = (layer.startTime / totalDuration) * 100;
                  const width = (layer.duration / totalDuration) * 100;

                  return (
                    <div
                      key={layer.id}
                      className={`absolute h-8 rounded cursor-pointer transition-all ${
                        selectedLayer === layer.id
                          ? 'bg-royal-gold ring-2 ring-royal-gold/50'
                          : 'bg-royal-purple/60'
                      }`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        top: `${(layers.indexOf(layer) % 3) * 30}px`,
                      }}
                      onClick={() => setSelectedLayer(layer.id)}
                    >
                      <div className="px-2 py-1 text-xs text-white truncate">
                        {layer.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Animation Layers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Layer List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  selectedLayer === layer.id
                    ? 'bg-royal-gold/20 border border-royal-gold'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setSelectedLayer(layer.id)}
              >
                <div className="flex-1 text-sm truncate">{layer.name}</div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLayer(layer.id, 'up');
                    }}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLayer(layer.id, 'down');
                    }}
                    disabled={index === layers.length - 1}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayer(layer.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleAddLayer} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Layer
          </Button>

          {/* Layer Properties */}
          {selectedLayerData && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label>Layer Name</Label>
                  <input
                    type="text"
                    value={selectedLayerData.name}
                    onChange={(e) =>
                      handleUpdateLayer(selectedLayer, { name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Animation Type</Label>
                  <Select
                    value={selectedLayerData.animationType}
                    onValueChange={(value) =>
                      handleUpdateLayer(selectedLayer, { animationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ANIMATION_TYPES).map(([category, types]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground capitalize">
                            {category}
                          </div>
                          {types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration: {selectedLayerData.duration}s</Label>
                  <Slider
                    value={[selectedLayerData.duration]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onValueChange={(value) =>
                      handleUpdateLayer(selectedLayer, { duration: value[0] })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Time: {selectedLayerData.startTime}s</Label>
                  <Slider
                    value={[selectedLayerData.startTime]}
                    min={0}
                    max={totalDuration}
                    step={0.1}
                    onValueChange={(value) =>
                      handleUpdateLayer(selectedLayer, { startTime: value[0] })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <Label>Delay: {selectedLayerData.delay}s</Label>
                  <Slider
                    value={[selectedLayerData.delay]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(value) =>
                      handleUpdateLayer(selectedLayer, { delay: value[0] })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Easing</Label>
                  <Select
                    value={selectedLayerData.ease}
                    onValueChange={(value) =>
                      handleUpdateLayer(selectedLayer, { ease: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EASE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Element</Label>
                  <input
                    type="text"
                    value={selectedLayerData.element}
                    onChange={(e) =>
                      handleUpdateLayer(selectedLayer, { element: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border bg-background font-mono text-sm"
                    placeholder=".element-class"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Timeline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
