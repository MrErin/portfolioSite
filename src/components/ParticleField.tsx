import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useWhimsy } from '@/features/whimsy/WhimsyContext';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

// Particle color palette — brighter opacity for visibility across dark backgrounds
const PARTICLE_COLORS = [
  'bg-gold/55',
  'bg-teal-light/50',
  'bg-purple-light/55',
  'bg-purple-dark/60',
];

/**
 * Moved out of render to satisfy React purity rules (Math.random is impure).
 */
const generateParticles = (): Particle[] =>
  Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }));

/**
 * Decorative particle field with floating dots.
 * Hidden when prefers-reduced-motion is active or whimsy particles are disabled.
 */
const ParticleField = () => {
  const prefersReducedMotion = useReducedMotion();
  const { config } = useWhimsy();

  // 60 particles at 2-8px keeps GPU cost low (CSS transform + opacity are composited)
  const particles = useMemo(() => generateParticles(), []);

  if (prefersReducedMotion || !config.particles) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full animate-float ${particle.color}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export { ParticleField };
