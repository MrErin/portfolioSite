import { useScroll } from 'framer-motion';
import { useRef, type RefObject } from 'react';

interface UseScrollProgressOptions {
  /** Optional ref to track. If not provided, hook creates its own ref. */
  targetRef?: RefObject<HTMLElement>;
}

/**
 * Custom hook for scroll-linked animations.
 * Uses Framer Motion's useScroll with a target ref to track
 * a section's position relative to the viewport.
 *
 * @param options - Configuration options
 * @returns Object with scrollYProgress MotionValue and ref
 *
 * The scrollYProgress value goes from 0 to 1:
 * - 0 = section's top edge reaches viewport's bottom edge (just entering view)
 * - 1 = section's bottom edge reaches viewport's top edge (just leaving view)
 *
 * This single progress value feeds all per-card useTransform calls for
 * scroll-linked parallax effects.
 */
export const useScrollProgress = (options: UseScrollProgressOptions = {}) => {
  const { targetRef } = options;
  const internalRef = useRef<HTMLElement>(null);

  // Use provided ref or fall back to internally created ref
  const ref = targetRef || internalRef;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return { scrollYProgress, ref };
};
