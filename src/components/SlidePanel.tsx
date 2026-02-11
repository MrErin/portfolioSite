import type { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';

interface SlidePanelProps {
  children: ReactNode;
  onClose: () => void;
  ariaLabel: string;
}

/**
 * Reusable slide-in panel component for overlay content.
 *
 * Features:
 * - Backdrop that fades in/out
 * - Panel slides in from the right side
 * - Click outside to close
 * - Close button (X) in top-right
 * - Escape key handling is managed by parent (App.tsx)
 */
const SlidePanel = ({ children, onClose, ariaLabel }: SlidePanelProps) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-abyss/80"
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          allowOutsideClick: true,
        }}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-void border-l border-border shadow-2xl overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-border text-muted hover:text-text-primary transition-colors duration-300 flex items-center justify-center z-10"
          >
            <FaTimes />
          </button>

          {/* Panel content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </FocusTrap>
    </>
  );
};

export { SlidePanel };
