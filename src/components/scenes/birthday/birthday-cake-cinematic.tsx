import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float, Text3D, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ConfettiParticles, Sparkles } from '../effects/particle-systems';
import { PhotoCutout3D } from '../effects/photo-cutout-3d';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

interface BirthdayCakeCinematicProps {
  photoPath?: string;
  hostName: string;
  age?: number;
  theme?: any;
}

export function BirthdayCakeCinematic({
  photoPath = '/uploads/birthday-person.png',
  hostName,
  age,
  theme,
}: BirthdayCakeCinematicProps) {
  const cakeRef = useRef<THREE.Group>(null);
  const [confettiBurst, setConfettiBurst] = useState(false);

  // Trigger confetti burst after 2 seconds
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Rotate cake
    if (cakeRef.current) {
      cakeRef.current.rotation.y = time * 0.5;
    }

    // Burst confetti at intervals
    if (Math.floor(time) % 5 === 0 && Math.floor(time * 10) % 10 === 0) {
      setConfettiBurst(true);
    }
  });

  // Camera zoom and orbit
  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime();

    camera.position.x = Math.sin(time * 0.2) * 6;
    camera.position.y = 3 + Math.sin(time * 0.3) * 0.5;
    camera.position.z = Math.cos(time * 0.2) * 6;
    camera.lookAt(0, 1, 0);
  });

  return (
    <group>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={60} />

      {/* Lighting setup */}
      <ambientLight intensity={0.4} />

      <spotLight
        position={[5, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        castShadow
        color="#FFB6C1"
      />

      <spotLight
        position={[-5, 8, -3]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#87CEEB"
      />

      {/* Birthday cake */}
      <group ref={cakeRef} position={[0, 0, 0]}>
        {/* Bottom layer */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.8, 32]} />
          <meshStandardMaterial
            color={theme?.colors?.primary || '#FF69B4'}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Middle layer */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.7, 32]} />
          <meshStandardMaterial
            color="#FFB6C1"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Top layer */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.6, 32]} />
          <meshStandardMaterial
            color="#FFC0CB"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Frosting waves */}
        {[0, 0.9, 1.7].map((y, layerIndex) => (
          <group key={layerIndex} position={[0, y + 0.4, 0]}>
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const radius = [1.5, 1.2, 0.9][layerIndex];
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius,
                  ]}
                >
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial
                    color="#FFFFFF"
                    emissive="#FFFFFF"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Candles */}
        {age ? (
          // Show number of candles based on age (max 10 for visual)
          Array.from({ length: Math.min(age, 10) }).map((_, i) => {
            const angle = (i / Math.min(age, 10)) * Math.PI * 2;
            const radius = 0.6;
            return (
              <group
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  2.3,
                  Math.sin(angle) * radius,
                ]}
              >
                {/* Candle stick */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
                  <meshStandardMaterial color="#FFD700" />
                </mesh>

                {/* Flame */}
                <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                  <mesh position={[0, 0.5, 0]}>
                    <coneGeometry args={[0.08, 0.2, 8]} />
                    <meshBasicMaterial
                      color="#FF6600"
                      emissive="#FF6600"
                      emissiveIntensity={2}
                    />
                  </mesh>
                </Float>

                {/* Candle light */}
                <pointLight
                  position={[0, 0.6, 0]}
                  intensity={0.5}
                  distance={2}
                  color="#FF6600"
                />
              </group>
            );
          })
        ) : (
          // Single center candle if age not specified
          <group position={[0, 2.3, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
            <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
              <mesh position={[0, 0.6, 0]}>
                <coneGeometry args={[0.12, 0.25, 8]} />
                <meshBasicMaterial
                  color="#FF6600"
                  emissive="#FF6600"
                  emissiveIntensity={2}
                />
              </mesh>
            </Float>
            <pointLight
              position={[0, 0.8, 0]}
              intensity={1}
              distance={3}
              color="#FF6600"
            />
          </group>
        )}
      </group>

      {/* Birthday person photo popup */}
      {photoPath && (
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <PhotoCutout3D
              imagePath={photoPath}
              position={[3, 2, 0]}
              scale={0.8}
              animate="float"
            />
          </Float>
        </Suspense>
      )}

      {/* Floor with party pattern */}
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#E6F3FF"
          roughness={0.8}
        />
      </mesh>

      {/* Colorful circular pattern on floor */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, -0.48, 0]}
          rotation={[-Math.PI / 2, 0, (i * Math.PI) / 4]}
        >
          <ringGeometry args={[1 + i, 1.5 + i, 32]} />
          <meshStandardMaterial
            color={['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'][i]}
            emissive={['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'][i]}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Confetti burst */}
      <ConfettiParticles
        position={[0, 5, 0]}
        count={confettiBurst ? 200 : 100}
        burst={confettiBurst}
      />

      {/* Sparkles around cake */}
      <Sparkles position={[0, 2, 0]} count={150} scale={5} />

      {/* Balloons */}
      {[-3, -2, 2, 3].map((x, i) => (
        <Float
          key={i}
          speed={1 + i * 0.2}
          rotationIntensity={0.1}
          floatIntensity={1}
        >
          <group position={[x, 4 + i * 0.5, -3]}>
            {/* Balloon */}
            <mesh castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color={['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'][i]}
                metalness={0.3}
                roughness={0.3}
              />
            </mesh>

            {/* String */}
            <mesh position={[0, -2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 3.5, 8]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </group>
        </Float>
      ))}

      {/* Name display with neon effect */}
      <Html position={[0, 4, 0]} center>
        <div
          style={{
            color: theme?.colors?.primary || '#FF69B4',
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: `
              0 0 10px ${theme?.colors?.primary || '#FF69B4'},
              0 0 20px ${theme?.colors?.primary || '#FF69B4'},
              0 0 30px ${theme?.colors?.primary || '#FF69B4'}
            `,
            animation: 'flicker 2s infinite',
            whiteSpace: 'nowrap',
          }}
        >
          Happy Birthday {hostName}!
          {age && <div style={{ fontSize: '2rem', marginTop: '10px' }}>{age}</div>}
        </div>
      </Html>

      {/* Environment */}
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </group>
  );
}
