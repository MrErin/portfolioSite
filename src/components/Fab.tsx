import type { ReactNode } from 'react';

interface FabProps {
  icon: ReactNode;
  label: string;
}

const Fab = ({ icon, label }: FabProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-bright border border-border text-text-primary transition-all duration-300 hover:bg-dusk hover:text-purple-glow hover:border-[#3d2b5a] hover:shadow-[0_0_12px_rgba(155,126,180,0.3)]"
    >
      {icon}
    </button>
  );
};

export default Fab;
