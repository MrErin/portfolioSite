import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';
import { useWhimsy } from '@/components/whimsy/WhimsyContext';
import { CloseButton } from '@/components/core/CloseButton';
import type { Project } from './types';

const LINK_CLASS =
  'inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded hover:border-purple-dark hover:text-purple-glow hover:shadow-glow-purple transition-all duration-300';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  cardOrigin?: { x: number; y: number } | null;
}

const ProjectModal = ({ project, onClose, cardOrigin }: ProjectModalProps) => {
  const { config } = useWhimsy();

  // Calculate offset from viewport center for grow-from-card animation
  const viewportCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const viewportCenterY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const offsetX = cardOrigin ? cardOrigin.x - viewportCenterX : 0;
  const offsetY = cardOrigin ? cardOrigin.y - viewportCenterY : 0;

  const modalInitial = config.growFromCard
    ? { opacity: 0, scale: 0.8, x: offsetX, y: offsetY }
    : { opacity: 0, y: 20 };

  const modalAnimate = config.growFromCard
    ? { opacity: 1, scale: 1, x: 0, y: 0 }
    : { opacity: 1, y: 0 };

  const modalExit = config.growFromCard ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: -10 };

  const modalTransition = config.growFromCard
    ? { type: 'spring' as const, damping: 25, stiffness: 300 }
    : { duration: 0.25 };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-abyss/80 flex items-center justify-center p-4"
    >
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          allowOutsideClick: true,
        }}
      >
        <motion.div
          initial={modalInitial}
          animate={modalAnimate}
          exit={modalExit}
          transition={modalTransition}
          onClick={(e) => e.stopPropagation()}
          className="bg-void border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          <CloseButton onClick={onClose} ariaLabel="Close modal" />

          <div
            className="h-32 bg-gradient-to-br from-hollow via-shade to-dusk rounded-t-lg"
            aria-hidden="true"
          />

          <div className="p-6 md:p-8">
            <h2 className="font-display text-gold text-3xl mb-4">{project.name}</h2>

            <p className="font-body text-text-secondary leading-relaxed mb-6">
              {project.description}
            </p>

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

            <div className="bg-surface border border-border rounded p-8 mb-6 text-center">
              <p className="text-text-muted">Demo placeholder</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                <FaGithub />
                <span>View Repository</span>
              </a>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  <FaExternalLinkAlt />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </FocusTrap>
    </motion.div>
  );
};

export { ProjectModal };
