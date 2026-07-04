import { useRef } from 'react';
import { useReducedMotion, useScroll } from 'framer-motion';
import { ParticleField } from '@/components/core/ParticleField';
import { projects } from '@/data/projects';
import { useWhimsy } from '@/components/whimsy/WhimsyContext';
import { SECTION_HEIGHT_VH } from './animationConfig';
import { ParallaxCard } from './ParallaxCard';
import { ProjectCard } from './ProjectCard';
import { FallingObjects } from './FallingObjects';
import type { Project } from './types';

interface ProjectsSectionProps {
  onProjectClick?: (project: Project, rect: DOMRect) => void;
}

/**
 * Projects section with scroll-linked parallax card animations.
 *
 * Uses a sticky viewport pattern: a tall 300vh section with a pinned
 * 100vh inner container. Cards float up through the viewport at
 * staggered scroll positions, creating a "falling down the rabbit hole"
 * sensation.
 *
 * For users preferring reduced motion, falls back to a simple
 * vertical card stack.
 */
const ProjectsSection = ({ onProjectClick }: ProjectsSectionProps) => {
  const { config } = useWhimsy();
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const totalCards = projects.length;

  // Reduced motion fallback: simple vertical stack
  if (prefersReducedMotion) {
    return (
      <section aria-label="Projects" className="relative min-h-screen bg-deep py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-purple-light text-4xl mb-12 text-center">Projects</h2>
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={onProjectClick} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!config.parallax) {
    return (
      <section aria-label="Projects" className="relative min-h-screen bg-deep py-20 px-4">
        <ParticleField />
        {config.particles && <FallingObjects mode="static" />}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-purple-light text-4xl mb-12 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={onProjectClick} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Sticky viewport pattern for full animation effect
  return (
    <section
      ref={ref}
      aria-label="Projects"
      // Tall section provides scroll runway for parallax effect
      className="relative bg-deep"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      {/* Sticky container stays pinned while scrolling through the tall section */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <FallingObjects scrollYProgress={scrollYProgress} mode="falling" />
        <ParticleField />

        {/* Heading stays visible throughout the scroll */}
        <h2 className="absolute top-8 z-10 font-heading text-purple-light text-4xl text-center">
          Projects
        </h2>

        {/* Each card is staggered to enter the viewport at a different scroll offset */}
        {projects.map((project, index) => (
          <ParallaxCard
            key={project.id}
            scrollYProgress={scrollYProgress}
            project={project}
            index={index}
            totalCards={totalCards}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
    </section>
  );
};

export { ProjectsSection };
