import { useState } from 'react';
import headshotUrl from '@/assets/headshot.jpeg';

const FALLBACK_GRADIENT =
  'w-32 h-32 rounded-full bg-gradient-to-br from-purple-dark to-shade border-2 border-border mx-auto mb-6';

const AboutPanel = () => {
  const [hasImageError, setHasImageError] = useState(false);
  const skills = ['React', 'TypeScript', 'Python', 'SQL', 'GIS', 'Data Analysis', 'AI Tooling'];

  return (
    <section aria-label="About">
      <h2 className="font-heading text-gold text-2xl mb-6">About</h2>

      {hasImageError ? (
        <div className={FALLBACK_GRADIENT} role="img" aria-label="Profile photo unavailable" />
      ) : (
        <img
          src={headshotUrl}
          alt="Developer profile photo"
          className="w-32 h-32 rounded-full object-cover object-center border-2 border-border mx-auto mb-6"
          onError={() => setHasImageError(true)}
        />
      )}

      <p className="font-body text-text-secondary mb-6">
        Full-stack developer who especially enjoys working with maps and data. Currently exploring
        AI-assisted development. Generally up for a weird conversation. Cares a <em>lot</em> about helping people.
      </p>
      <p className="font-body text-text-secondary text-center mb-6">
        Kind of bonkers, but professional about it.
      </p>

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
    </section>
  );
};

export { AboutPanel };
