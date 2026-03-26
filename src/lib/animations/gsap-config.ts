import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// Animation presets for different event types
export const ANIMATION_PRESETS = {
  // Wedding animations
  wedding: {
    entrance: {
      duration: 2,
      ease: 'power2.out',
      y: -100,
      opacity: 0,
    },
    float: {
      duration: 3,
      ease: 'power1.inOut',
      y: '+=20',
      yoyo: true,
      repeat: -1,
    },
    sparkle: {
      duration: 0.5,
      scale: 1.2,
      opacity: 0,
      stagger: 0.1,
    },
    fadeIn: {
      duration: 1.5,
      opacity: 0,
      y: 30,
      stagger: 0.2,
    },
  },

  // Birthday animations
  birthday: {
    bounce: {
      duration: 1,
      ease: 'bounce.out',
      y: -50,
      stagger: 0.15,
    },
    confetti: {
      duration: 2,
      y: 300,
      rotation: 360,
      opacity: 0,
      stagger: {
        amount: 1,
        from: 'random',
      },
    },
    celebration: {
      duration: 0.8,
      scale: 1.3,
      ease: 'elastic.out(1, 0.5)',
      yoyo: true,
      repeat: 2,
    },
  },

  // Engagement animations
  engagement: {
    heartbeat: {
      duration: 0.6,
      scale: 1.1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    },
    slideIn: {
      duration: 1.5,
      x: -100,
      opacity: 0,
      stagger: 0.3,
    },
    glow: {
      duration: 2,
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    },
  },

  // Generic animations
  generic: {
    fadeIn: {
      duration: 1,
      opacity: 0,
    },
    slideUp: {
      duration: 1,
      y: 50,
      opacity: 0,
    },
    scale: {
      duration: 0.5,
      scale: 0,
      ease: 'back.out(1.7)',
    },
    rotate: {
      duration: 1,
      rotation: 360,
      ease: 'power2.inOut',
    },
  },
};

// Timeline builder for complex animation sequences
export class AnimationTimeline {
  private timeline: gsap.core.Timeline;

  constructor(config?: gsap.TimelineVars) {
    this.timeline = gsap.timeline(config);
  }

  addEntrance(element: string | Element, preset: keyof typeof ANIMATION_PRESETS.generic = 'fadeIn') {
    const animation = ANIMATION_PRESETS.generic[preset];
    this.timeline.from(element, animation);
    return this;
  }

  addFloat(element: string | Element) {
    this.timeline.to(element, ANIMATION_PRESETS.wedding.float);
    return this;
  }

  addBounce(element: string | Element) {
    this.timeline.from(element, ANIMATION_PRESETS.birthday.bounce);
    return this;
  }

  addCustom(element: string | Element, animation: gsap.TweenVars, position?: string | number) {
    this.timeline.to(element, animation, position);
    return this;
  }

  addLabel(label: string) {
    this.timeline.addLabel(label);
    return this;
  }

  addPause() {
    this.timeline.addPause();
    return this;
  }

  play() {
    this.timeline.play();
    return this;
  }

  pause() {
    this.timeline.pause();
    return this;
  }

  restart() {
    this.timeline.restart();
    return this;
  }

  getTimeline() {
    return this.timeline;
  }
}

// Utility functions for common animations
export const animationUtils = {
  // Entrance animations
  fadeIn: (element: string | Element, duration = 1) => {
    return gsap.from(element, {
      duration,
      opacity: 0,
      ease: 'power2.out',
    });
  },

  slideIn: (element: string | Element, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom', duration = 1) => {
    const directions = {
      left: { x: -100 },
      right: { x: 100 },
      top: { y: -100 },
      bottom: { y: 100 },
    };

    return gsap.from(element, {
      ...directions[direction],
      duration,
      opacity: 0,
      ease: 'power2.out',
    });
  },

  // Interactive animations
  hover: (element: string | Element) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    el.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  },

  // Scroll-based animations
  scrollReveal: (element: string | Element, options?: gsap.TweenVars) => {
    return gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
      ...options,
    });
  },

  // Text animations
  typewriter: (element: string | Element, text: string, duration = 2) => {
    return gsap.to(element, {
      duration,
      text: text,
      ease: 'none',
    });
  },

  // 3D animations (for Three.js integration)
  animate3D: (object: any, properties: any, duration = 1) => {
    return gsap.to(object, {
      duration,
      ...properties,
      ease: 'power2.inOut',
    });
  },

  // Camera animations for 3D scenes
  animateCamera: (camera: any, target: { x: number; y: number; z: number }, duration = 2) => {
    return gsap.to(camera.position, {
      duration,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: 'power2.inOut',
    });
  },
};

// Create a timeline from a configuration object
export function createTimelineFromConfig(config: {
  animations: Array<{
    element: string;
    type: string;
    properties: gsap.TweenVars;
    position?: string | number;
  }>;
  timelineOptions?: gsap.TimelineVars;
}) {
  const tl = gsap.timeline(config.timelineOptions);

  config.animations.forEach((anim) => {
    tl.to(anim.element, anim.properties, anim.position);
  });

  return tl;
}

// Export GSAP for direct use
export { gsap };
export default gsap;
