import { useReducedMotion } from '@/hooks';

interface Particle {
  id: number;
  left: number;
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
 * Decorative particle field with floating dots.
 * Purely decorative - disabled for prefers-reduced-motion.
 */
const ParticleField = () => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  // Generate random particles with assorted colors
  // 60 particles at 2-8px keeps GPU cost low (CSS transform + opacity are composited)
  const particles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full animate-float ${particle.color}`}
          style={{
            left: `${particle.left}%`,
            top: `${Math.random() * 100}%`,
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
