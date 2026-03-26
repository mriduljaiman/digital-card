'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SceneProps } from '@/types';

export function ModernWeddingScene({ hostName, coHostName, eventDate, theme }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting - minimalist white light */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 8, 0]} intensity={0.8} color="#FFFFFF" />

      {/* Modern arch structure */}
      <group position={[0, 0, 0]}>
        {/* Vertical pillars */}
        {[-3, 3].map((x, i) => (
          <mesh key={i} position={[x, 2.5, 0]} castShadow>
            <boxGeometry args={[0.3, 5, 0.3]} />
            <meshStandardMaterial
              color={theme?.colors.secondary || '#FFFFFF'}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Top horizontal beam */}
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[6.6, 0.3, 0.3]} />
          <meshStandardMaterial
            color={theme?.colors.secondary || '#FFFFFF'}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Decorative elements */}
        {[-2, 0, 2].map((x, i) => (
          <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh position={[x, 6, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color={theme?.colors.accent || '#BDC3C7'}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Floating text */}
      {(hostName || coHostName) && (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
          <Html position={[0, 4, 0]} center>
            <div
              style={{
                color: theme?.colors.secondary || '#2C3E50',
                fontSize: '2rem',
                fontWeight: '300',
                textAlign: 'center',
                letterSpacing: '0.2em',
                whiteSpace: 'nowrap',
                fontFamily: 'serif',
              }}
            >
              {hostName}
              {coHostName && (
                <>
                  <span style={{ margin: '0 15px', fontSize: '1.5rem' }}>&</span>
                  {coHostName}
                </>
              )}
            </div>
          </Html>
        </Float>
      )}

      {/* Minimalist platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.2, 32]} />
        <meshStandardMaterial
          color={theme?.colors.primary || '#FFFFFF'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Sparkle particles */}
      <SparkleSystem count={100} color={theme?.colors.accent || '#FFFFFF'} />

      {/* Ground - marble */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#F8F8F8"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

function SparkleSystem({ count, color }: { count: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = Math.random() * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const y = positions[i * 3 + 1];
        positions[i * 3 + 1] = y + Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
      <pointsMaterial size={0.03} color={color} transparent opacity={0.7} />
    </points>
  );
}
