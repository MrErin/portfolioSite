import { projects } from '../../data/projects';
import { SECTION_HEIGHT_VH } from '../../data/animationConfig';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ParticleField } from '../../components';
import type { Project } from '../../types/project';
import ParallaxCard from './ParallaxCard';
import ProjectCard from './ProjectCard';

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
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress, ref } = useScrollProgress();
  const totalCards = projects.length;

  // Reduced motion fallback: simple vertical stack
  if (prefersReducedMotion) {
    return (
      <section
        aria-label="Projects"
        className="min-h-screen bg-deep py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-purple-light text-4xl mb-12 text-center">
            Projects
          </h2>
          <div className="flex flex-col gap-6">
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
      // Reduced height on mobile for shorter scroll distance
      className="relative bg-deep"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      {/* Sticky container stays pinned while scrolling through the tall section */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <ParticleField />

        {/* Heading stays visible throughout the scroll */}
        <h2 className="absolute top-8 z-10 font-heading text-purple-light text-4xl text-center">
          Projects
        </h2>

        {/* Cards positioned absolutely within the sticky viewport */}
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

export default ProjectsSection;
