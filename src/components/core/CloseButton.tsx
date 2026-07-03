import { FaTimes } from 'react-icons/fa';

interface CloseButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

const CloseButton = ({ onClick, ariaLabel }: CloseButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border text-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-purple-light transition-colors duration-300 flex items-center justify-center z-10"
    >
      <FaTimes />
    </button>
  );
};

export { CloseButton };
