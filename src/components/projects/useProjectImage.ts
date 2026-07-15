import { useState } from 'react';
import { useWhimsy } from '@/components/whimsy/WhimsyContext';
import type { Project } from './types';

const BORING_GRADIENT = 'bg-gradient-to-br from-boring-dark via-boring to-boring-light';
const REGULAR_GRADIENT = 'bg-gradient-to-br from-hollow via-shade to-dusk';

/**
 * Manages whimsy-aware project image selection with error fallback.
 * Selects the appropriate image URL based on the current whimsy stop
 * and provides a gradient fallback class when the image fails or is absent.
 *
 * @param project - Project with optional imageUrl and boringImageUrl
 * @returns showImage, activeUrl, gradientClass, and onError handler
 */
const useProjectImage = (project: Pick<Project, 'imageUrl' | 'boringImageUrl'>) => {
  const { config } = useWhimsy();
  const [hasImageError, setHasImageError] = useState(false);

  const rawUrl = config.boringImages ? project.boringImageUrl : project.imageUrl;
  const activeUrl = rawUrl ? `${import.meta.env.BASE_URL}${rawUrl.replace(/^\//, '')}` : rawUrl;
  const showImage = activeUrl && !hasImageError;
  const gradientClass = config.boringImages ? BORING_GRADIENT : REGULAR_GRADIENT;

  return { showImage, activeUrl, gradientClass, onError: () => setHasImageError(true) };
};

export { useProjectImage };
