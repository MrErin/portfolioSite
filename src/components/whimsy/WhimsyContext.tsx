import { createContext, useContext, useState, type ReactNode } from 'react';
import { type WhimsyLevel, type WhimsyConfig, WHIMSY_LEVELS } from './whimsyTypes';

interface WhimsyContextValue {
  level: WhimsyLevel;
  config: WhimsyConfig;
  setLevel: (level: WhimsyLevel) => void;
}

const WhimsyContext = createContext<WhimsyContextValue | null>(null);

const WhimsyProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<WhimsyLevel>(2);

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
