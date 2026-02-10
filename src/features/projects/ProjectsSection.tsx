const ProjectsSection = () => {
  return (
    <section aria-label="Projects" className="min-h-screen bg-void py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-purple-light text-4xl mb-12 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-heading text-text-primary text-xl">Project 1</h3>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-heading text-text-primary text-xl">Project 2</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
