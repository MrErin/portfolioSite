import { useEffect, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import {
  generateSlots,
  FALLING_SLOT_COUNT,
  STATIC_SLOT_COUNT,
  GLOW_INTERVAL_MS,
} from './objectSlots';
import type { ObjectSlot } from './objectSlots';
import { FallingObject } from './FallingObject';
import { StaticObject } from './StaticObject';

interface FallingObjectsProps {
  scrollYProgress?: MotionValue<number>;
  mode: 'falling' | 'static';
}

/**
 * Container for Alice-themed SVG silhouettes in the Projects section.
 * Falling mode (stop 2): objects drift past with parallax scroll behind cards.
 * Static mode (stop 1): objects are fixed decoration with a random sequential glow.
 */
const FallingObjects = ({ scrollYProgress, mode }: FallingObjectsProps) => {
  const slotCount = mode === 'falling' ? FALLING_SLOT_COUNT : STATIC_SLOT_COUNT;
  const [slots] = useState<ObjectSlot[]>(() => generateSlots(slotCount, mode === 'static'));

  const [glowIndex, setGlowIndex] = useState(-1);

  // Random glow cycling for static mode
  useEffect(() => {
    if (mode !== 'static') return;

    const pickNext = () => {
      setGlowIndex((prev) => {
        if (slotCount <= 1) return 0;
        let next: number;
        do {
          next = Math.floor(Math.random() * slotCount);
        } while (next === prev);
        return next;
      });
    };

    pickNext();
    const interval = setInterval(pickNext, GLOW_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [mode, slotCount]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      {mode === 'falling' && scrollYProgress
        ? slots.map((slot, index) => (
            <FallingObject
              key={index}
              scrollYProgress={scrollYProgress}
              slot={slot}
              totalSlots={slotCount}
              index={index}
            />
          ))
        : slots.map((slot, index) => (
            <StaticObject key={index} slot={slot} isGlowing={index === glowIndex} />
          ))}
    </div>
  );
};

export { FallingObjects };
