import type { ReactNode } from 'react';

interface FabProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

const Fab = ({ icon, label, onClick }: FabProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-bright border border-border text-text-primary transition-all duration-300 hover:bg-dusk hover:text-purple-glow hover:border-purple-dark hover:shadow-glow-purple focus-visible:ring-2 focus-visible:ring-purple-light"
    >
      {icon}
    </button>
  );
};

export default Fab;
