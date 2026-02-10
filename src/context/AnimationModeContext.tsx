import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnimationMode } from '../data/animationConfig';

interface AnimationModeContextValue {
  mode: AnimationMode;
  toggleMode: () => void;
  setMode: (mode: AnimationMode) => void;
}

const AnimationModeContext = createContext<AnimationModeContextValue | undefined>(undefined);

interface AnimationModeProviderProps {
  children: ReactNode;
  initialMode?: AnimationMode;
}

/**
 * Provider for animation mode state management.
 * Allows components to access and change the current animation mode.
 */
export const AnimationModeProvider = ({
  children,
  initialMode = 'straight-up',
}: AnimationModeProviderProps) => {
  const [mode, setModeState] = useState<AnimationMode>(initialMode);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'straight-up' ? 'diagonal-drift' : 'straight-up'));
  }, []);

  const setMode = useCallback((newMode: AnimationMode) => {
    setModeState(newMode);
  }, []);

  return (
    <AnimationModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </AnimationModeContext.Provider>
  );
};

/**
 * Hook to access animation mode context.
 * Throws error if used outside of AnimationModeProvider.
 */
export const useAnimationMode = (): AnimationModeContextValue => {
  const context = useContext(AnimationModeContext);
  if (!context) {
    throw new Error('useAnimationMode must be used within AnimationModeProvider');
  }
  return context;
};
