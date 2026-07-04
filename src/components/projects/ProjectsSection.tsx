import { useRef } from 'react';
import { useReducedMotion, useScroll } from 'framer-motion';
import arrowUrl from '@/assets/arrow.svg';
import caveFloorUrl from '@/assets/caveFloor.svg';
import { ParticleField } from '@/components/core/ParticleField';
import { useWhimsy } from '@/components/whimsy/WhimsyContext';
import { projects } from '@/data/projects';
import { SECTION_HEIGHT_VH } from './animationConfig';
import { FallingObjects } from './FallingObjects';
import { ParallaxCard } from './ParallaxCard';
import { ProjectCard } from './ProjectCard';
import type { Project } from './types';

const CAVE_FLOOR_DECORATIVE = 'pointer-events-none select-none';

interface ProjectsSectionProps {
  onProjectClick?: (project: Project, rect: DOMRect) => void;
}

/**
 * Projects section with scroll-linked parallax card animations.
 *
 * Uses a sticky viewport pattern: a tall section with a pinned
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
          <h2 className="font-heading text-purple-light text-4xl mb-20 text-center">Projects</h2>
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={onProjectClick} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Grid mode: cards in a 2-column layout with optional static falling objects
  if (!config.parallax) {
    return (
      <section aria-label="Projects" className="relative min-h-screen bg-deep py-20 px-4">
        <ParticleField />
        {config.particles && <FallingObjects mode="static" />}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-purple-light text-4xl mb-20 text-center">Projects</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {projects.map((project) => (
              <div key={project.id} className="w-full md:w-[calc(50%-0.75rem)]">
                <ProjectCard project={project} onClick={onProjectClick} />
              </div>
            ))}
          </div>
        </div>
        {!config.boringImages && (
          <img
            src={caveFloorUrl}
            alt=""
            aria-hidden="true"
            className={`w-full h-auto mt-12 ${CAVE_FLOOR_DECORATIVE}`}
            draggable="false"
          />
        )}
      </section>
    );
  }

  // Sticky viewport pattern for full animation effect (stop 2)
  return (
    <>
      <section
        ref={ref}
        aria-label="Projects"
        className="relative bg-deep"
        style={{ height: `${SECTION_HEIGHT_VH}vh` }}
      >
        {/* Arrow at the top of the scroll area — scrolls away naturally */}
        <div className="flex flex-col items-center pt-4 pb-16 pointer-events-none">
          <img
            src={arrowUrl}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="w-48 sm:w-64 h-auto select-none animate-scroll-bounce"
            style={{ filter: 'invert(1)' }}
          />
        </div>

        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          <FallingObjects scrollYProgress={scrollYProgress} mode="falling" />
          <ParticleField />

          <h2 className="absolute top-8 z-10 font-heading text-purple-light text-4xl text-center">
            Projects
          </h2>

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

      {/* Cave floor: separate from parallax, appears naturally after all cards scroll through */}
      <div className="bg-deep" aria-hidden="true">
        <img
          src={caveFloorUrl}
          alt=""
          draggable="false"
          className={`w-full h-auto ${CAVE_FLOOR_DECORATIVE}`}
        />
      </div>
    </>
  );
};

export { ProjectsSection };
