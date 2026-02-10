import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import type { Project } from './types/project';
import { Hero } from './features/hero';
import { ProjectsSection, ProjectModal } from './features/projects';
import { AboutPanel } from './features/about';
import { ContactPanel } from './features/contact';
import { Fab, AnimationToggle, SlidePanel } from './components';
import { AnimationModeProvider } from './context/AnimationModeContext';

const App = () => {
  // Overlay state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cardOrigin, setCardOrigin] = useState<{ x: number; y: number } | null>(null);
  const [activePanel, setActivePanel] = useState<'about' | 'contact' | null>(null);

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

  const handleOpenAbout = () => {
    setActivePanel('about');
    handleCloseModal(); // Close modal if open
  };

  const handleOpenContact = () => {
    setActivePanel('contact');
    handleCloseModal(); // Close modal if open
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Ignore if typing in an input/textarea
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        // Priority: close modal first, then panel
        if (selectedProject) {
          handleCloseModal();
        } else if (activePanel) {
          handleClosePanel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, activePanel]);

  return (
    <AnimationModeProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="bg-abyss min-h-screen">
        <Hero />
        <ProjectsSection onProjectClick={handleProjectClick} />
      </main>

      {/* Animation mode toggle */}
      <AnimationToggle />

      {/* FAB navigation */}
      <div
        className="fixed bottom-6 right-6 flex flex-col gap-3 z-40"
        role="group"
        aria-label="Quick navigation"
      >
        <Fab icon={<FaUser />} label="Open about panel" onClick={handleOpenAbout} />
        <Fab icon={<FaEnvelope />} label="Open contact panel" onClick={handleOpenContact} />
      </div>

      {/* Project modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            cardOrigin={cardOrigin}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* About panel */}
      <AnimatePresence>
        {activePanel === 'about' && (
          <SlidePanel onClose={handleClosePanel} ariaLabel="About">
            <AboutPanel />
          </SlidePanel>
        )}
      </AnimatePresence>

      {/* Contact panel */}
      <AnimatePresence>
        {activePanel === 'contact' && (
          <SlidePanel onClose={handleClosePanel} ariaLabel="Contact">
            <ContactPanel />
          </SlidePanel>
        )}
      </AnimatePresence>
    </AnimationModeProvider>
  );
};

export default App;
