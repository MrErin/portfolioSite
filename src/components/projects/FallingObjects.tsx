import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { getObjectScrollWindow } from './animationConfig';
import armchairUrl from '@/assets/armchair.svg';
import bookUrl from '@/assets/book.svg';
import cardUrl from '@/assets/card.svg';
import cupUrl from '@/assets/cup.svg';
import keyUrl from '@/assets/key.svg';
import watchUrl from '@/assets/watch.svg';

const OBJECT_SOURCES = [armchairUrl, bookUrl, cardUrl, cupUrl, keyUrl, watchUrl] as const;

const FALLING_SLOT_COUNT = 24;
const STATIC_SLOT_COUNT = 6;
const GLOW_INTERVAL_MS = 3500;
const BASE_SIZES = ['w-48', 'w-56', 'w-64', 'w-80'] as const;

interface ObjectSlot {
  src: string;
  left: string;
  top: string;
  size: string;
  rotation: number;
}

const pickRandom = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Generate randomized object slots, biased toward viewport edges. */
const generateSlots = (count: number, useUniqueSources: boolean): ObjectSlot[] => {
  if (useUniqueSources) {
    // Static mode: distribute evenly on left/right sides, no overlap
    const sources = [...OBJECT_SOURCES].sort(() => Math.random() - 0.5);
    const perSide = Math.ceil(count / 2);
    const bandHeight = 55 / perSide;

    return Array.from({ length: count }, (_, i) => {
      const isLeft = i % 2 === 0;
      const bandIndex = Math.floor(i / 2);
      return {
        src: sources[i % sources.length],
        left: isLeft ? `${Math.random() * 12 + 2}%` : `${Math.random() * 12 + 85}%`,
        top: `${bandIndex * bandHeight + Math.random() * bandHeight * 0.5 + 5}%`,
        size: pickRandom(BASE_SIZES),
        rotation: Math.random() * 80 - 60,
      };
    });
  }

  return Array.from({ length: count }, () => ({
    src: pickRandom(OBJECT_SOURCES),
    left: `${Math.random() * 80 + 5}%`,
    top: `${Math.random() * 85 + 5}%`,
    size: pickRandom(BASE_SIZES),
    rotation: Math.random() * 80 - 60,
  }));
};

interface FallingObjectProps {
  scrollYProgress: MotionValue<number>;
  slot: ObjectSlot;
  totalSlots: number;
  index: number;
  isGlowing: boolean;
  mode: 'falling' | 'static';
}

/**
 * Single falling object with its own scroll-linked transforms.
 * Hooks are unconditional per-instance (same pattern as ParallaxCard).
 * In static mode, transforms are computed but not applied to the style.
 */
const FallingObject = ({
  scrollYProgress,
  slot,
  totalSlots,
  index,
  isGlowing,
  mode,
}: FallingObjectProps) => {
  const { start: scrollStart, end: scrollEnd } = getObjectScrollWindow(index, totalSlots);
  const windowLength = scrollEnd - scrollStart;
  const fadeMargin = windowLength * 0.15;

  const scrollOpacity = useTransform(
    scrollYProgress,
    [scrollStart, scrollStart + fadeMargin, scrollEnd - fadeMargin, scrollEnd],
    [0, 0.2, 0.2, 0]
  );
  const translateY = useTransform(scrollYProgress, [scrollStart, scrollEnd], [1200, -1200]);
  const scale = useTransform(scrollYProgress, [scrollStart, scrollEnd], [0.85, 1.0]);

  return (
    <motion.img
      src={slot.src}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`absolute ${slot.size} h-auto falling-object ${
        isGlowing ? 'falling-object-glow' : ''
      } select-none`}
      style={
        mode === 'falling'
          ? {
              left: slot.left,
              top: slot.top,
              rotate: slot.rotation,
              y: translateY,
              scale,
              opacity: scrollOpacity,
              pointerEvents: 'none' as const,
            }
          : {
              left: slot.left,
              top: slot.top,
              rotate: slot.rotation,
              opacity: 0.2,
              pointerEvents: 'none' as const,
            }
      }
    />
  );
};

interface FallingObjectsProps {
  scrollYProgress?: MotionValue<number>;
  mode: 'falling' | 'static';
}

/**
 * Container for Alice-themed SVG silhouettes in the Projects section.
 * Falling mode (stop 2): objects drift past with parallax scroll behind cards.
 * Static mode (stop 1): objects are fixed decoration with a random sequential glow.
 */
const FallingObjects = ({ scrollYProgress: externalProgress, mode }: FallingObjectsProps) => {
  // Always create a MotionValue so FallingObject hooks are unconditional
  const internalProgress = useMotionValue(0.5);
  const progress = externalProgress ?? internalProgress;

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
      {slots.map((slot, index) => (
        <FallingObject
          key={index}
          scrollYProgress={progress}
          slot={slot}
          totalSlots={slotCount}
          index={index}
          isGlowing={mode === 'static' && index === glowIndex}
          mode={mode}
        />
      ))}
    </div>
  );
};

export { FallingObjects };
