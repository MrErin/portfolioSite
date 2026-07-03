import { useRef } from 'react';
import { useWhimsy } from '@/features/whimsy';
import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project, rect: DOMRect) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const articleRef = useRef<HTMLElement>(null);
  const { config } = useWhimsy();

  const thumbnailClass = config.boringImages
    ? 'h-40 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600'
    : 'h-40 bg-gradient-to-br from-hollow via-shade to-dusk';

  const handleClick = () => {
    if (onClick && articleRef.current) {
      onClick(project, articleRef.current.getBoundingClientRect());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      ref={articleRef}
      role="button"
      tabIndex={0}
      className="group overflow-hidden rounded-lg bg-surface border border-border transition-all duration-300 hover:border-purple-dark hover:shadow-glow-purple hover:bg-surface-bright cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Gradient thumbnail placeholder */}
      <div className={thumbnailClass} aria-hidden="true" />

      {/* Card content */}
      <div className="p-6">
        <h3 className="font-heading text-text-primary text-xl mb-3 transition-colors duration-300 group-hover:text-gold">
          {project.name}
        </h3>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs text-purple-light bg-surface-dim border border-border rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export { ProjectCard };
