import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import type { Project } from '@/features/projects/types';
import { Hero } from '@/features/hero';
import { ProjectsSection, ProjectModal } from '@/features/projects';
import { AboutPanel } from '@/features/about';
import { ContactPanel } from '@/features/contact';
import { Fab, SlidePanel } from '@/components';

const App = () => {
  // Overlay state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardOrigin, setCardOrigin] = useState<{ x: number; y: number } | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Handlers
  const handleProjectClick = (project: Project, rect: DOMRect) => {
    // Calculate card center from bounding rect
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    setCardOrigin({ x: cardCenterX, y: cardCenterY });
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setCardOrigin(null);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const handleOpenPanel = () => {
    setPanelOpen(true);
    handleCloseModal(); // Close modal if open
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Ignore if typing in an input/textarea
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }

        // Priority: close modal first, then panel
        if (selectedProject) {
          handleCloseModal();
        } else if (panelOpen) {
          handleClosePanel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, panelOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="bg-abyss min-h-screen">
        <Hero />
        <ProjectsSection onProjectClick={handleProjectClick} />
      </main>

      <div className="fixed bottom-6 right-6 z-40">
        <Fab icon={<FaEnvelope />} label="Open about & contact" onClick={handleOpenPanel} />
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            cardOrigin={cardOrigin}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <SlidePanel onClose={handleClosePanel} ariaLabel="About and Contact">
            <AboutPanel />
            <div className="border-t border-border my-6" aria-hidden="true" />
            <ContactPanel />
          </SlidePanel>
        )}
      </AnimatePresence>
    </>
  );
};

export { App };
