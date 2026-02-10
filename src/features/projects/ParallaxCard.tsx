import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { Project } from '../../types/project';
import { useAnimationMode } from '../../context/AnimationModeContext';
import {
  getParallaxConfig,
  getCardScrollWindow,
  getCardOpacityRange,
} from '../../data/animationConfig';
import ProjectCard from './ProjectCard';

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
 * Supports two animation modes:
 * - Straight Up: vertical movement only, subtle rotation
 * - Diagonal Drift: vertical + alternating horizontal drift, more rotation
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
  const { mode } = useAnimationMode();
  const config = getParallaxConfig(mode);

  // Each card gets its own scroll window for staggered entry/exit
  const { start: scrollStart, end: scrollEnd } = getCardScrollWindow(index, totalCards);

  // Per-card opacity fade in/out using the card's scroll window
  const { input: opacityInput, output: opacityOutput } = getCardOpacityRange(index, totalCards);
  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);

  // Vertical travel: card moves from +600px (below viewport) to -600px (above)
  const translateY = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    config.translateYOutput
  );

  // Rotation applied within the card's scroll window
  const rotate = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    config.rotateOutput
  );

  // Scale pulse applied within the card's scroll window
  const scale = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    config.scaleOutput
  );

  // Horizontal movement - depends on mode and card index
  // In diagonal-drift mode, odd cards get opposite direction
  const translateXOutput = mode === 'diagonal-drift' && index % 2 === 1
    ? config.translateXOutput.map((v) => -v)
    : config.translateXOutput;

  const translateX = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    translateXOutput
  );

  // Horizontal positioning: even cards on left, odd cards on right (desktop only)
  const isEven = index % 2 === 0;
  const horizontalClass = isEven
    ? 'left-[5%] md:left-[10%] lg:left-[15%]'
    : 'right-[5%] md:right-[10%] lg:right-[15%]';

  return (
    <motion.div
      className={`absolute w-full max-w-sm md:max-w-md ${horizontalClass}`}
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

export default ParallaxCard;
