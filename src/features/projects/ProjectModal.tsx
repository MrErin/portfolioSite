const ProjectModal = () => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-void border border-border rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="font-display text-gold text-3xl mb-4">Modal Placeholder</h2>
        <p className="font-body text-text-secondary">Modal content goes here</p>
      </div>
    </div>
  );
};

export default ProjectModal;
