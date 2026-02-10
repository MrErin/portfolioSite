import { FaUser, FaEnvelope } from 'react-icons/fa';
import { Hero } from './features/hero';
import { ProjectsSection } from './features/projects';
import { Fab, AnimationToggle } from './components';
import { AnimationModeProvider } from './context/AnimationModeContext';

const App = () => {
  return (
    <AnimationModeProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="bg-abyss min-h-screen">
        <Hero />
        <ProjectsSection />
      </main>

      {/* Animation mode toggle */}
      <AnimationToggle />

      {/* FAB navigation */}
      <div
        className="fixed bottom-6 right-6 flex flex-col gap-3 z-40"
        role="group"
        aria-label="Quick navigation"
      >
        <Fab icon={<FaUser />} label="Open about panel" />
        <Fab icon={<FaEnvelope />} label="Open contact panel" />
      </div>
    </AnimationModeProvider>
  );
};

export default App;
