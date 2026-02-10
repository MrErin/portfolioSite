const AboutPanel = () => {
  const skills = ['React', 'TypeScript', 'Node.js', 'Rust', 'Go', 'Tailwind CSS', 'Framer Motion'];

  return (
    <aside aria-label="About" className="bg-void border border-border rounded-lg p-6">
      <h2 className="font-heading text-gold text-2xl mb-6">About</h2>

      {/* Photo placeholder */}
      <div
        className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-dark to-shade border-2 border-border mx-auto mb-6"
        role="img"
        aria-label="Profile photo placeholder"
      />

      {/* Bio */}
      <p className="font-body text-text-secondary text-center mb-6">
        A curious developer exploring the depths of modern web development. Building tools that
        bridge the gap between imagination and reality.
      </p>

      {/* Skills section */}
      <div>
        <h3 className="font-heading text-text-primary text-lg mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs text-teal-light bg-surface-dim border border-border rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AboutPanel;
