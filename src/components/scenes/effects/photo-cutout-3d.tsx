import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PhotoCutout3DProps {
  imagePath: string;
  position?: [number, number, number];
  scale?: number;
  animate?: 'orbit' | 'float' | 'bounce' | 'none';
  castShadow?: boolean;
}

export function PhotoCutout3D({
  imagePath,
  position = [0, 0, 0],
  scale = 1,
  animate = 'orbit',
  castShadow = true,
}: PhotoCutout3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Load texture (will be transparent PNG cutout)
  const texture = useLoader(TextureLoader, imagePath);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    switch (animate) {
      case 'orbit':
        // Slow circular orbit
        groupRef.current.rotation.y = time * 0.2;
        groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
        break;

      case 'float':
        // Gentle floating
        groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.3;
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
        break;

      case 'bounce':
        // Bouncy effect
        const bounceY = Math.abs(Math.sin(time * 2)) * 0.5;
        groupRef.current.position.y = position[1] + bounceY;
        break;

      case 'none':
      default:
        break;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main photo cutout plane */}
      <mesh ref={meshRef} castShadow={castShadow}>
        <planeGeometry args={[2 * scale, 3 * scale]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>

      {/* Subtle depth layer behind for 3D effect */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <planeGeometry args={[2 * scale, 3 * scale]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Rim light effect */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={0.5}
        distance={3}
        color="#ffffff"
      />
    </group>
  );
}

// Enhanced photo cutout with depth layers (2.5D effect)
export function PhotoCutoutLayered({
  imagePath,
  position = [0, 0, 0],
  scale = 1,
}: {
  imagePath: string;
  position?: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, imagePath);

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;

    // Parallax effect with mouse
    groupRef.current.rotation.y = mouse.x * 0.3;
    groupRef.current.rotation.x = -mouse.y * 0.2;

    // Gentle breathing animation
    const breathe = 1 + Math.sin(clock.getElapsedTime()) * 0.02;
    groupRef.current.scale.setScalar(breathe);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Front layer - main image */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[2 * scale, 3 * scale]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>

      {/* Mid layer - slight offset */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2 * scale, 3 * scale]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>

      {/* Back layer - shadow */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2.1 * scale, 3.1 * scale]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={1}
        distance={4}
        color="#FFD700"
      />
    </group>
  );
}

// Couple cutout with fera animation
export function CoupleFeraIllusion({
  couplePath,
  position = [0, 0, 0],
  scale = 1,
}: {
  couplePath: string;
  position?: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, couplePath);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    // Circular orbit around fire (fera)
    const radius = 2;
    const speed = 0.3;
    const angle = time * speed;

    groupRef.current.position.x = position[0] + Math.cos(angle) * radius;
    groupRef.current.position.z = position[2] + Math.sin(angle) * radius;
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;

    // Face towards center
    groupRef.current.rotation.y = -angle + Math.PI / 2;
  });

  return (
    <group ref={groupRef}>
      {/* Couple cutout */}
      <mesh castShadow>
        <planeGeometry args={[1.5 * scale, 2.5 * scale]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>

      {/* Shadow underneath */}
      <mesh position={[0, -1.25 * scale, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8 * scale, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Subtle glow */}
      <pointLight
        position={[0, 0, 0.3]}
        intensity={0.8}
        distance={2}
        color="#FFD700"
      />
    </group>
  );
}
