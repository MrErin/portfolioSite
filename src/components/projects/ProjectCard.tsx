import { useRef } from 'react';
import { useProjectImage } from './useProjectImage';
import { TechBadges } from './TechBadges';
import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project, rect: DOMRect) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { showImage, activeUrl, gradientClass, onError } = useProjectImage(project);

  const handleClick = () => {
    if (onClick && cardRef.current) {
      onClick(project, cardRef.current.getBoundingClientRect());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      className="group overflow-hidden rounded-lg bg-surface border border-border transition-all duration-300 hover:border-purple-dark hover:shadow-glow-purple hover:bg-surface-bright cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="relative h-40 overflow-hidden">
        {showImage && (
          <img
            src={activeUrl}
            alt={project.name}
            className="object-cover object-center w-full h-full"
            onError={onError}
          />
        )}
        {!showImage && <div className={`absolute inset-0 ${gradientClass}`} aria-hidden="true" />}
      </div>

      <div className="p-6">
        <h3 className="font-heading text-text-primary text-xl mb-3 transition-colors duration-300 group-hover:text-gold">
          {project.name}
        </h3>

        <TechBadges techs={project.techStack} />
      </div>
    </div>
  );
};

export { ProjectCard };
