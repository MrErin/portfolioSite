import { projects } from '../../data/projects';
import ProjectCard from './ProjectCard';

const ProjectsSection = () => {
  return (
    <section aria-label="Projects" className="min-h-screen bg-deep py-20 px-4 pr-20 pb-36 md:pr-4 md:pb-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-purple-light text-4xl mb-12 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
