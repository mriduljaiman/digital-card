'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SceneProps } from '@/types';

export function RoyalMandapScene({ hostName, coHostName, eventDate, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      <spotLight position={[0, 15, 0]} angle={0.3} intensity={1} castShadow />

      {/* Gold mandap structure (simplified) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial
          color={theme?.colors.primary || '#FFD700'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Pillars */}
      {[-2, 2].map((x, i) =>
        [-2, 2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 2, z]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 4]} />
            <meshStandardMaterial
              color={theme?.colors.primary || '#FFD700'}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))
      )}

      {/* Floating text using HTML */}
      {hostName && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Html position={[0, 4, 0]} center>
            <div
              style={{
                color: theme?.colors.primary || '#FFD700',
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 0 10px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
              }}
            >
              {hostName}
              {coHostName && ` & ${coHostName}`}
            </div>
          </Html>
        </Float>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={theme?.colors.secondary || '#1A1A2E'}
          roughness={0.8}
        />
      </mesh>

      {/* Particles (simplified) */}
      <ParticleSystem count={100} color={theme?.colors.accent || '#FFFFFF'} />
    </group>
  );
}

function ParticleSystem({ count, color }: { count: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
    </points>
  );
}
