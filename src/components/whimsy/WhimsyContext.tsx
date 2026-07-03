import { createContext, useContext, useState, type ReactNode } from 'react';

/** Discrete whimsy stops: 0 = max whimsy, 2 = min whimsy. */
type WhimsyLevel = 0 | 1 | 2;

/** Feature flags resolved from the current whimsy level. */
interface WhimsyConfig {
  parallax: boolean;
  particles: boolean;
  growFromCard: boolean;
  boringImages: boolean;
}

/** Maps each whimsy stop to its feature flags — single source of truth. */
const WHIMSY_LEVELS: Record<WhimsyLevel, WhimsyConfig> = {
  0: { parallax: true, particles: true, growFromCard: true, boringImages: false },
  1: { parallax: false, particles: true, growFromCard: true, boringImages: false },
  2: { parallax: false, particles: false, growFromCard: false, boringImages: true },
};

interface WhimsyContextValue {
  level: WhimsyLevel;
  config: WhimsyConfig;
  setLevel: (level: WhimsyLevel) => void;
}

const WhimsyContext = createContext<WhimsyContextValue | null>(null);

const WhimsyProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<WhimsyLevel>(0);

  const config = WHIMSY_LEVELS[level];

  return (
    <WhimsyContext.Provider value={{ level, config, setLevel }}>{children}</WhimsyContext.Provider>
  );
};

const useWhimsy = (): WhimsyContextValue => {
  const context = useContext(WhimsyContext);
  if (!context) {
    throw new Error('useWhimsy must be used within a WhimsyProvider');
  }
  return context;
};

export { WhimsyProvider, useWhimsy };
export type { WhimsyLevel, WhimsyConfig };
export { WHIMSY_LEVELS };
