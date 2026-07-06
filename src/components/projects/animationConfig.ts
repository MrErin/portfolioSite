/**
 * Section height in vh units. Exported so ProjectsSection stays in sync.
 * A taller section = more scroll runway for the parallax effect.
 */
export const SECTION_HEIGHT_VH = 400;

/**
 * With offset ['start end', 'end start'], scroll progress 0→1 spans
 * the entire journey from "section enters viewport" to "section leaves."
 * But the sticky container is only pinned during the middle portion.
 *
 * These constants define that pinned range so cards animate only
 * while the user can actually see the sticky viewport.
 */
const VIEWPORT_VH = 100;
const TOTAL_SCROLL_VH = SECTION_HEIGHT_VH + VIEWPORT_VH;
const STICKY_START = VIEWPORT_VH / TOTAL_SCROLL_VH; // ~0.143
const STICKY_END = SECTION_HEIGHT_VH / TOTAL_SCROLL_VH; // ~0.857

/**
 * Scroll window size for each card, as a fraction of the sticky range.
 * 0.3 gives each card ~90vh of scroll with brief crossfade overlap,
 * so cards appear one at a time rather than piling up.
 */
const WINDOW_RATIO = 0.5;

/**
 * Small buffer inside the sticky range so cards don't start/end
 * at the exact moment the sticky pins/releases.
 */
const INNER_PAD_RATIO = 0.01;

/**
 * Shared scroll window calculator. Parameterized by window ratio
 * so cards and objects can use the same math at different speeds.
 */
const getScrollWindowForRatio = (
  index: number,
  total: number,
  ratio: number,
  customRange?: { start: number; end: number }
): { start: number; end: number } => {
  const stickyRange = STICKY_END - STICKY_START;
  const windowSize = stickyRange * ratio;

  let rangeStart: number, rangeEnd: number;
  if (customRange) {
    rangeStart = customRange.start;
    rangeEnd = customRange.end;
  } else {
    const innerPad = stickyRange * INNER_PAD_RATIO;
    rangeStart = STICKY_START + innerPad;
    rangeEnd = STICKY_END - innerPad;
  }

  if (total <= 1) {
    return { start: rangeStart, end: rangeEnd };
  }

  const stagger = (rangeEnd - rangeStart - windowSize) / (total - 1);
  const start = rangeStart + index * stagger;
  const end = start + windowSize;

  return { start, end };
};

/**
 * Get the scroll window (start/end range) for a specific card.
 * Cards are distributed only within the sticky-pinned portion of
 * the scroll progress, so they're visible when the user can see them.
 *
 * @param index - The card's index (0-based)
 * @param totalCards - Total number of cards
 * @returns Object with start and end values in [0, 1] range
 */
export const getCardScrollWindow = (index: number, totalCards: number) =>
  getScrollWindowForRatio(index, totalCards, WINDOW_RATIO);

/** Shared opacity fade calculator from scroll window bounds. */
const getOpacityRange = (start: number, end: number): { input: number[]; output: number[] } => {
  const windowLength = end - start;
  const fadeMargin = windowLength * 0.15;

  return {
    input: [start, start + fadeMargin, end - fadeMargin, end],
    output: [0, 1, 1, 0],
  };
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
export const getCardOpacityRange = (index: number, totalCards: number) => {
  const { start, end } = getCardScrollWindow(index, totalCards);
  return getOpacityRange(start, end);
};

/**
 * Parallax configuration for scroll-linked card animations.
 * Cards move vertically with alternating left/right drift and rotation.
 */
export const PARALLAX_CONFIG = {
  /** Vertical displacement: cards start below, end above (in pixels) */
  translateYOutput: [1000, -2000],
  /** More dramatic rotation for dynamic movement */
  rotateOutput: [-20, 20],
  /** More size variation for depth */
  scaleOutput: [0.9, 1.1],
  /**
   * Horizontal drift - wider range for more pronounced effect.
   * Direction alternates based on card index.
   * Callers should negate output for odd-indexed cards.
   */
  translateXOutput: [-120, 120],
};

/**
 * Scroll window size for falling objects — shorter than cards so objects
 * cycle through faster, keeping 3–5 visible at any scroll position.
 */
const OBJECT_WINDOW_RATIO = 0.18;

/**
 * Get the scroll window for a falling object slot.
 * Objects are constrained to the visual card range — they finish when the
 * last card scrolls off-screen (its window midpoint), not when the sticky
 * section ends.
 */
export const getObjectScrollWindow = (index: number, totalObjects: number, totalCards: number) => {
  const firstCard = getCardScrollWindow(0, totalCards);
  const lastCard = getCardScrollWindow(totalCards - 1, totalCards);
  const range = {
    start: firstCard.start,
    end: (lastCard.start + lastCard.end) / 2,
  };
  return getScrollWindowForRatio(index, totalObjects, OBJECT_WINDOW_RATIO, range);
};
