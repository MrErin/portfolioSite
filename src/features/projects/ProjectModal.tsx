import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import type { Project } from '../../types/project';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
      className="fixed inset-0 z-50 bg-abyss/80 flex items-center justify-center p-4"
    >
      <div className="bg-void border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border text-muted hover:text-text-primary transition-colors duration-300 flex items-center justify-center z-10"
        >
          <FaTimes />
        </button>

        {/* Gradient header */}
        <div
          className="h-32 bg-gradient-to-br from-hollow via-shade to-dusk rounded-t-lg"
          aria-hidden="true"
        />

        {/* Content area */}
        <div className="p-8">
          <h2 className="font-display text-gold text-3xl mb-4">{project.name}</h2>

          <p className="font-body text-text-secondary leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm text-purple-light bg-surface-dim border border-border rounded"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Demo placeholder */}
          <div className="bg-surface border border-border rounded p-8 mb-6 text-center">
            <p className="text-text-muted">Demo placeholder</p>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap gap-4">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded hover:border-purple hover:text-purple-glow transition-all duration-300"
            >
              <FaGithub />
              <span>View Repository</span>
            </a>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded hover:border-purple hover:text-purple-glow transition-all duration-300"
              >
                <FaExternalLinkAlt />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
