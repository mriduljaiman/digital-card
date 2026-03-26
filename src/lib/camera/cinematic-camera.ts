import * as THREE from 'three';
import gsap from 'gsap';

export type CameraMovement =
  | 'orbit'
  | 'zoom-in'
  | 'zoom-out'
  | 'dolly'
  | 'crane-up'
  | 'crane-down'
  | 'pan-left'
  | 'pan-right'
  | 'shake'
  | 'static';

export interface CameraKeyframe {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration: number;
  ease?: string;
}

export class CinematicCamera {
  private camera: THREE.PerspectiveCamera;
  private timeline: gsap.core.Timeline | null = null;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  // Preset camera movements
  orbit(radius: number = 8, height: number = 3, speed: number = 0.2) {
    return {
      update: (time: number) => {
        const angle = time * speed;
        this.camera.position.x = Math.cos(angle) * radius;
        this.camera.position.y = height + Math.sin(time * 0.3) * 0.5;
        this.camera.position.z = Math.sin(angle) * radius;
        this.camera.lookAt(0, 1, 0);
      },
    };
  }

  zoomIn(from: [number, number, number], to: [number, number, number], duration: number = 3) {
    this.timeline = gsap.timeline();
    this.timeline.to(this.camera.position, {
      x: to[0],
      y: to[1],
      z: to[2],
      duration,
      ease: 'power2.inOut',
    });
  }

  dollyShot(
    startPos: [number, number, number],
    endPos: [number, number, number],
    lookAt: [number, number, number],
    duration: number = 5
  ) {
    this.timeline = gsap.timeline();

    this.camera.position.set(...startPos);

    this.timeline.to(this.camera.position, {
      x: endPos[0],
      y: endPos[1],
      z: endPos[2],
      duration,
      ease: 'power1.inOut',
      onUpdate: () => {
        this.camera.lookAt(...lookAt);
      },
    });
  }

  craneUp(duration: number = 3, height: number = 10) {
    const startY = this.camera.position.y;

    this.timeline = gsap.timeline();
    this.timeline.to(this.camera.position, {
      y: startY + height,
      duration,
      ease: 'power2.out',
    });
  }

  shake(intensity: number = 0.1, duration: number = 0.5) {
    const originalPos = this.camera.position.clone();

    this.timeline = gsap.timeline();

    for (let i = 0; i < 10; i++) {
      this.timeline.to(
        this.camera.position,
        {
          x: originalPos.x + (Math.random() - 0.5) * intensity,
          y: originalPos.y + (Math.random() - 0.5) * intensity,
          z: originalPos.z + (Math.random() - 0.5) * intensity,
          duration: duration / 10,
          ease: 'none',
        },
        i * (duration / 10)
      );
    }

    this.timeline.to(this.camera.position, {
      x: originalPos.x,
      y: originalPos.y,
      z: originalPos.z,
      duration: duration / 10,
      ease: 'power2.out',
    });
  }

  // Create cinematic sequence from keyframes
  createSequence(keyframes: CameraKeyframe[]) {
    this.timeline = gsap.timeline();

    keyframes.forEach((frame) => {
      this.timeline.to(
        this.camera.position,
        {
          x: frame.position[0],
          y: frame.position[1],
          z: frame.position[2],
          duration: frame.duration,
          ease: frame.ease || 'power2.inOut',
          onUpdate: () => {
            this.camera.lookAt(...frame.lookAt);
          },
        },
        '>' // Start after previous animation
      );
    });

    return this.timeline;
  }

  // Smooth camera follow target
  followTarget(target: THREE.Vector3, offset: THREE.Vector3, smoothness: number = 0.1) {
    return {
      update: () => {
        const targetPos = new THREE.Vector3().copy(target).add(offset);
        this.camera.position.lerp(targetPos, smoothness);
        this.camera.lookAt(target);
      },
    };
  }

  // Cinematic reveal (pull back)
  reveal(duration: number = 4) {
    const startZ = this.camera.position.z;

    this.timeline = gsap.timeline();
    this.timeline.to(this.camera.position, {
      z: startZ + 10,
      y: this.camera.position.y + 3,
      duration,
      ease: 'power2.out',
    });

    this.timeline.to(
      this.camera,
      {
        fov: 70,
        duration: duration / 2,
        ease: 'power1.inOut',
        onUpdate: () => {
          this.camera.updateProjectionMatrix();
        },
      },
      0
    );
  }

  // Stop all animations
  stop() {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }

  // Get current timeline for chaining
  getTimeline() {
    return this.timeline;
  }
}

// Preset camera animations for different scenes
export const cameraPresets = {
  weddingIntro: [
    {
      position: [10, 5, 10] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      duration: 0,
    },
    {
      position: [8, 3, 8] as [number, number, number],
      lookAt: [0, 1, 0] as [number, number, number],
      duration: 3,
      ease: 'power2.out',
    },
    {
      position: [6, 3, 6] as [number, number, number],
      lookAt: [0, 1, 0] as [number, number, number],
      duration: 2,
      ease: 'power1.inOut',
    },
  ],

  birthdayReveal: [
    {
      position: [0, 2, 8] as [number, number, number],
      lookAt: [0, 1, 0] as [number, number, number],
      duration: 0,
    },
    {
      position: [5, 3, 5] as [number, number, number],
      lookAt: [0, 1.5, 0] as [number, number, number],
      duration: 3,
      ease: 'power2.inOut',
    },
  ],

  engagementRomantic: [
    {
      position: [8, 4, 8] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      duration: 0,
    },
    {
      position: [4, 2, 6] as [number, number, number],
      lookAt: [0, 1, 0] as [number, number, number],
      duration: 4,
      ease: 'power1.inOut',
    },
    {
      position: [6, 3, 4] as [number, number, number],
      lookAt: [0, 1, 0] as [number, number, number],
      duration: 3,
      ease: 'power2.out',
    },
  ],
};
