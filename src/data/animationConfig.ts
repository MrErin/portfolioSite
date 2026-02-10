/**
 * Animation modes for scroll-linked parallax card animations.
 */
export type AnimationMode = 'straight-up' | 'diagonal-drift';

/**
 * Scroll window size for each card.
 * Each card is visible for 35% of total scroll progress.
 * Larger values = cards overlap more, smaller = cards appear more sequentially.
 */
const WINDOW_SIZE = 0.35;

/**
 * Get the scroll window (start/end range) for a specific card.
 * Cards are evenly distributed across the total scroll progress [0, 1].
 *
 * @param index - The card's index (0-based)
 * @param totalCards - Total number of cards
 * @returns Object with start and end values in [0, 1] range
 *
 * Example for 4 cards:
 * - Card 0: [0.0, 0.35]
 * - Card 1: [0.217, 0.567]
 * - Card 2: [0.433, 0.783]
 * - Card 3: [0.65, 1.0]
 */
export const getCardScrollWindow = (
  index: number,
  totalCards: number
): { start: number; end: number } => {
  // Calculate spacing between card start points
  const stagger = totalCards > 1 ? (1 - WINDOW_SIZE) / (totalCards - 1) : 0;
  const start = index * stagger;
  const end = start + WINDOW_SIZE;

  return { start, end };
};

/**
 * Get the opacity fade range for a specific card.
 * Cards fade in at the start of their window and fade out at the end.
 *
 * @param index - The card's index (0-based)
 * @param totalCards - Total number of cards
 * @returns Object with input and output arrays for useTransform
 *
 * Uses a fade margin (15% of window size) to create smooth fade in/out.
 */
export const getCardOpacityRange = (
  index: number,
  totalCards: number
): { input: number[]; output: number[] } => {
  const { start, end } = getCardScrollWindow(index, totalCards);
  const windowLength = end - start;
  const fadeMargin = windowLength * 0.15; // 15% fade margin

  return {
    input: [start, start + fadeMargin, end - fadeMargin, end],
    output: [0, 1, 1, 0],
  };
};

/**
 * Parallax configuration for "Straight Up" animation mode.
 * Cards move vertically with subtle rotation and scale changes.
 */
export const STRAIGHT_UP_CONFIG = {
  /** Vertical displacement: cards start below, end above (in pixels) */
  translateYOutput: [600, -600],
  /** Subtle tilt rotation */
  rotateOutput: [-2, 2],
  /** Subtle size pulse */
  scaleOutput: [0.95, 1.05],
  /** No horizontal movement in straight-up mode */
  translateXOutput: [0, 0],
};

/**
 * Parallax configuration for "Diagonal Drift" animation mode.
 * Cards move vertically with alternating left/right drift and more rotation.
 */
export const DIAGONAL_DRIFT_CONFIG = {
  /** Vertical displacement: same as straight-up (in pixels) */
  translateYOutput: [600, -600],
  /** More dramatic rotation */
  rotateOutput: [-6, 6],
  /** Same size pulse as straight-up */
  scaleOutput: [0.95, 1.05],
  /**
   * Horizontal drift - direction alternates based on card index.
   * Callers should negate output for odd-indexed cards.
   */
  translateXOutput: [-60, 60],
};

/**
 * Get the appropriate config object for a given animation mode.
 *
 * @param mode - The animation mode to use
 * @returns Config object with transform output ranges
 */
export const getParallaxConfig = (mode: AnimationMode) => {
  return mode === 'diagonal-drift' ? DIAGONAL_DRIFT_CONFIG : STRAIGHT_UP_CONFIG;
};
