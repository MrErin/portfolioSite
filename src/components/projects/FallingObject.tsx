import { motion, useMotionValue, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { projects } from '@/data/projects';
import { getObjectScrollWindow, FADE_MARGIN, lerp } from './animationConfig';
import type { ObjectSlot } from './objectSlots';

/** 4-keyframe interpolation for opacity fade in/out. */
const computeOpacity = (t: number, peak: number): number => {
  const fadeIn = FADE_MARGIN;
  const fadeOut = 1 - FADE_MARGIN;
  if (t <= 0 || t >= 1) return 0;
  if (t < fadeIn) return (t / fadeIn) * peak;
  if (t > fadeOut) return ((1 - t) / (1 - fadeOut)) * peak;
  return peak;
};

interface FallingObjectProps {
  scrollYProgress: MotionValue<number>;
  slot: ObjectSlot;
  totalSlots: number;
  index: number;
}

/**
 * Single falling object with scroll-driven transforms.
 *
 * Uses useMotionValueEvent + useMotionValue instead of useTransform to work
 * around a Framer Motion v12 bug where many concurrent useTransform subscribers
 * (72 = 24 objects × 3 transforms) to the same MotionValue partially fail to
 * connect. useMotionValueEvent reliably fires for all instances.
 */
const FallingObject = ({ scrollYProgress, slot, totalSlots, index }: FallingObjectProps) => {
  const { start: scrollStart, end: scrollEnd } = getObjectScrollWindow(
    index,
    totalSlots,
    projects.length
  );

  const translateY = useMotionValue(1200);
  const scrollOpacity = useMotionValue(0);
  const scale = useMotionValue(0.85);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = Math.max(0, Math.min(1, (v - scrollStart) / (scrollEnd - scrollStart)));
    translateY.set(lerp(1200, -1200, t));
    scale.set(lerp(0.85, 1.0, t));
    scrollOpacity.set(computeOpacity(t, 0.2));
  });

  return (
    <div
      className="absolute"
      style={{ left: slot.left, top: slot.top, pointerEvents: 'none' as const }}
    >
      <motion.img
        src={slot.src}
        alt=""
        aria-hidden="true"
        draggable="false"
        className={`${slot.size} h-auto falling-object select-none`}
        style={{
          rotate: slot.rotation,
          y: translateY,
          scale,
          opacity: scrollOpacity,
        }}
      />
    </div>
  );
};

export { FallingObject };
