import { Hero } from './features/hero';
import { ProjectsSection } from './features/projects';

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="bg-abyss min-h-screen">
        <Hero />
        <ProjectsSection />
      </main>
    </>
  );
}

export default App;
