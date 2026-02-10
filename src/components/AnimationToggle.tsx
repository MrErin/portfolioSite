import { useEffect } from 'react';
import { useAnimationMode } from '../context/AnimationModeContext';

/**
 * Dev-friendly toggle component for switching between animation modes.
 * Supports both button click and keyboard shortcut (A key) for rapid testing.
 */
const AnimationToggle = () => {
  const { mode, toggleMode } = useAnimationMode();

  // Register keyboard shortcut for mode toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on 'A' key press (unless focused on an input)
      if (e.key === 'a' || e.key === 'A') {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' ||
                        target.tagName === 'TEXTAREA' ||
                        target.isContentEditable;
        if (!isInput) {
          e.preventDefault();
          toggleMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMode]);

  const modeLabel = mode === 'straight-up'
    ? 'Straight Up'
    : 'Diagonal Drift';

  return (
    <button
      onClick={toggleMode}
      className="fixed top-6 left-6 z-40 px-3 py-2 text-sm font-body text-purple-light bg-surface border border-border rounded-lg shadow-glow-purple hover:border-[#3d2b5a] hover:bg-surface-bright transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-light"
      aria-label={`Switch animation mode. Current: ${modeLabel}. Press A key to toggle.`}
      type="button"
    >
      <span className="text-xs text-text-dim mr-2">Animation:</span>
      <span className="font-semibold">{modeLabel}</span>
      <span className="text-xs text-text-dim ml-2">(A)</span>
    </button>
  );
};

export default AnimationToggle;
