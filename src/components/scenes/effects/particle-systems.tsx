import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fire Particles
export function FireParticles({ position = [0, 0, 0], count = 100 }) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;

      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Fire colors (orange to yellow)
      colors[i * 3] = 1; // R
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
      colors[i * 3 + 2] = 0; // B
    }

    return [positions, colors];
  }, [count]);

  useFrame(() => {
    if (!points.current) return;

    const posArray = points.current.geometry.attributes.position.array as Float32Array;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;

      posArray[i * 3] = (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
      posArray[i * 3 + 1] = (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
      posArray[i * 3 + 2] = (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;
    });

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} position={position as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Petal Particles (for weddings)
export function PetalParticles({ position = [0, 5, 0], count = 50 }) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 10,
        z: (Math.random() - 0.5) * 10,
        speedY: 0.01 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    }
    return temp;
  }, [count]);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      // Pink/rose colors
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
    });

    return [positions, colors];
  }, [count, particles]);

  useFrame(() => {
    if (!points.current) return;

    const posArray = points.current.geometry.attributes.position.array as Float32Array;

    particles.forEach((particle, i) => {
      particle.y -= particle.speedY;
      particle.rotation += particle.rotationSpeed;

      if (particle.y < -2) {
        particle.y = 8;
        particle.x = (Math.random() - 0.5) * 10;
        particle.z = (Math.random() - 0.5) * 10;
      }

      posArray[i * 3] = particle.x + Math.sin(particle.rotation) * 0.3;
      posArray[i * 3 + 1] = particle.y;
      posArray[i * 3 + 2] = particle.z + Math.cos(particle.rotation) * 0.3;
    });

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} position={position as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

// Confetti Particles (for birthdays)
export function ConfettiParticles({ position = [0, 8, 0], count = 100, burst = false }) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * 5,
        z: (Math.random() - 0.5) * 5,
        velocityX: (Math.random() - 0.5) * 0.1,
        velocityY: burst ? 0.1 + Math.random() * 0.2 : -(0.02 + Math.random() * 0.05),
        velocityZ: (Math.random() - 0.5) * 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    return temp;
  }, [count, burst]);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      // Random bright colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 1; // Red
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.5;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0; // Blue
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1; // Yellow
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      }
    });

    return [positions, colors];
  }, [count, particles]);

  useFrame(() => {
    if (!points.current) return;

    const posArray = points.current.geometry.attributes.position.array as Float32Array;

    particles.forEach((particle, i) => {
      particle.velocityY -= 0.005; // Gravity
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.z += particle.velocityZ;
      particle.rotation += particle.rotationSpeed;

      if (particle.y < -5) {
        particle.y = 8;
        particle.x = (Math.random() - 0.5) * 5;
        particle.z = (Math.random() - 0.5) * 5;
        particle.velocityY = burst ? 0.1 + Math.random() * 0.2 : -(0.02 + Math.random() * 0.05);
      }

      posArray[i * 3] = particle.x;
      posArray[i * 3 + 1] = particle.y;
      posArray[i * 3 + 2] = particle.z;
    });

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} position={position as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
      />
    </points>
  );
}

// Sparkles
export function Sparkles({ position = [0, 0, 0], count = 50, scale = 1 }) {
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * scale;
      positions[i * 3 + 1] = (Math.random() - 0.5) * scale;
      positions[i * 3 + 2] = (Math.random() - 0.5) * scale;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    return [positions, colors];
  }, [count, scale]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const material = points.current.material as THREE.PointsMaterial;
    material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
  });

  return (
    <points ref={points} position={position as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Golden dust particles
export function GoldenDust({ position = [0, 0, 0], count = 200 }) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 15,
        speed: 0.001 + Math.random() * 0.003,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      // Gold color
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0;
    });

    return [positions, colors];
  }, [count, particles]);

  useFrame(({ clock }) => {
    if (!points.current) return;

    const posArray = points.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();

    particles.forEach((particle, i) => {
      posArray[i * 3] = particle.x + Math.sin(time * particle.speed + particle.offset) * 2;
      posArray[i * 3 + 1] = particle.y + Math.cos(time * particle.speed + particle.offset) * 1;
      posArray[i * 3 + 2] = particle.z + Math.sin(time * particle.speed * 0.5 + particle.offset) * 2;
    });

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} position={position as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
