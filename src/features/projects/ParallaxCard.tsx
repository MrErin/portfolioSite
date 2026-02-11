import { motion, useTransform, type MotionValue } from 'framer-motion';
import { PARALLAX_CONFIG, getCardScrollWindow, getCardOpacityRange } from '@/data/animationConfig';
import { ProjectCard } from './ProjectCard';
import type { Project } from './types';

interface ParallaxCardProps {
  /** Scroll progress MotionValue from useScrollProgress hook */
  scrollYProgress: MotionValue<number>;
  /** Card index for alternating direction and scroll window calculation */
  index: number;
  /** Total number of cards (needed for scroll window calculation) */
  totalCards: number;
  /** Project data to display */
  project: Project;
  /** Click handler for project card */
  onProjectClick?: (project: Project, rect: DOMRect) => void;
}

/**
 * Wrapper component that applies scroll-linked parallax transforms to ProjectCard.
 *
 * Cards float up individually through a pinned sticky viewport, each with its
 * own scroll window. This creates the "falling past objects in a deep well"
 * sensation where cards enter and exit sequentially.
 *
 * Cards move with diagonal drift: vertical travel plus alternating left/right drift.
 *
 * Cards alternate left/right positioning on desktop, centered on mobile.
 */
const ParallaxCard = ({
  scrollYProgress,
  index,
  totalCards,
  project,
  onProjectClick,
}: ParallaxCardProps) => {
  // Each card gets its own scroll window for staggered entry/exit
  const { start: scrollStart, end: scrollEnd } = getCardScrollWindow(index, totalCards);

  // Per-card opacity fade in/out using the card's scroll window
  const { input: opacityInput, output: opacityOutput } = getCardOpacityRange(index, totalCards);
  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);

  // Vertical travel: card moves from +600px (below viewport) to -600px (above)
  const translateY = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    PARALLAX_CONFIG.translateYOutput
  );

  // Rotation applied within the card's scroll window
  const rotate = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    PARALLAX_CONFIG.rotateOutput
  );

  // Scale pulse applied within the card's scroll window
  const scale = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    PARALLAX_CONFIG.scaleOutput
  );

  // Horizontal movement - odd cards get opposite direction for alternating drift
  const translateXOutput =
    index % 2 === 1
      ? PARALLAX_CONFIG.translateXOutput.map((v) => -v)
      : PARALLAX_CONFIG.translateXOutput;

  const translateX = useTransform(scrollYProgress, [scrollStart, scrollEnd], translateXOutput);

  // Horizontal positioning: even cards on left, odd cards on right (desktop only)
  // Positioned closer to center on larger screens
  const isEven = index % 2 === 0;
  const horizontalClass = isEven
    ? 'left-[5%] md:left-[25%] lg:left-[35%]'
    : 'right-[5%] md:right-[25%] lg:right-[35%]';

  return (
    <motion.div
      className={`absolute w-[90%] max-w-sm md:max-w-md ${horizontalClass}`}
      style={{
        y: translateY,
        x: translateX,
        rotate,
        scale,
        opacity,
      }}
    >
      <ProjectCard project={project} onClick={onProjectClick} />
    </motion.div>
  );
};

export { ParallaxCard };
