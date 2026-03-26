'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, ARButton, XR, Controllers, Hands } from '@react-three/xr';
import { Environment, OrbitControls } from '@react-three/drei';

interface XRCanvasWrapperProps {
  mode: 'vr' | 'ar';
  sceneComponent: React.ComponentType<any>;
  sceneProps: any;
}

export function XRCanvasWrapper({
  mode,
  sceneComponent: SceneComponent,
  sceneProps,
}: XRCanvasWrapperProps) {
  return (
    <div className="relative w-full h-full">
      {/* XR Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        {mode === 'vr' ? <VRButton /> : <ARButton />}
      </div>

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 50 }}
        gl={{ alpha: mode === 'ar' }}
        style={{ background: mode === 'ar' ? 'transparent' : undefined }}
      >
        <XR>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Environment */}
          {mode === 'vr' && (
            <Suspense fallback={null}>
              <Environment preset="sunset" />
            </Suspense>
          )}

          {/* Scene */}
          <Suspense fallback={null}>
            <SceneComponent {...sceneProps} />
          </Suspense>

          {/* XR Controllers */}
          <Controllers />
          <Hands />

          {/* Fallback controls for non-XR mode */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />

          {/* Ground plane for AR */}
          {mode === 'ar' && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial opacity={0.5} />
            </mesh>
          )}
        </XR>
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg text-sm">
        {mode === 'vr' ? (
          <div>
            <p className="font-semibold mb-2">VR Controls:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use VR controllers to point and interact</li>
              <li>• Move your head to look around</li>
              <li>• Click "Enter VR" button above to start</li>
            </ul>
          </div>
        ) : (
          <div>
            <p className="font-semibold mb-2">AR Controls:</p>
            <ul className="space-y-1 text-xs">
              <li>• Point your camera at a flat surface</li>
              <li>• Tap to place the invitation in your space</li>
              <li>• Pinch to zoom, drag to rotate</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
