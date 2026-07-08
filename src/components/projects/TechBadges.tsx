interface TechBadgesProps {
  techs: string[];
  size?: 'sm' | 'md';
}

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
} as const;

const TechBadges = ({ techs, size = 'sm' }: TechBadgesProps) => (
  <div className="flex flex-wrap gap-2">
    {techs.map((tech) => (
      <span
        key={tech}
        className={`${SIZE_CLASSES[size]} text-purple-light bg-surface-dim border border-border rounded`}
      >
        {tech}
      </span>
    ))}
  </div>
);

export { TechBadges };
