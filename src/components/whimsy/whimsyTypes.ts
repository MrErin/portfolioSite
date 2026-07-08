/** Discrete whimsy stops: 0 = min whimsy, 2 = max whimsy. */
type WhimsyLevel = 0 | 1 | 2;

/** Feature flags resolved from the current whimsy level. */
interface WhimsyConfig {
  parallax: boolean;
  particles: boolean;
  growFromCard: boolean;
  boringImages: boolean;
}

/** Maps each whimsy stop to its feature flags — single source of truth. */
const WHIMSY_LEVELS: Record<WhimsyLevel, WhimsyConfig> = {
  0: { parallax: false, particles: false, growFromCard: false, boringImages: true },
  1: { parallax: false, particles: true, growFromCard: true, boringImages: false },
  2: { parallax: true, particles: true, growFromCard: true, boringImages: false },
};

export type { WhimsyLevel, WhimsyConfig };
export { WHIMSY_LEVELS };
