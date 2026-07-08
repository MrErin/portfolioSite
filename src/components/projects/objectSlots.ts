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

const pickRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

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

export { FALLING_SLOT_COUNT, STATIC_SLOT_COUNT, GLOW_INTERVAL_MS, generateSlots };
export type { ObjectSlot };
