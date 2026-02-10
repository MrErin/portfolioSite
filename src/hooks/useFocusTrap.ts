import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  isActive: boolean;
}

/**
 * Hook to trap focus within a container element.
 *
 * On mount: saves the previously focused element and focuses the container
 * On unmount: restores focus to the previously focused element
 * During use: Tab/Shift+Tab cycles within focusable elements inside the container
 *
 * @param options - Configuration options
 */
export const useFocusTrap = ({ isActive }: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Save the currently focused element so we can restore it later
    previousActiveElementRef.current = document.activeElement;

    // Focus the container or first focusable element within it
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      container.focus();
    }

    // Handle Tab key to trap focus within the container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // Shift+Tab on first element -> wrap to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> wrap to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Cleanup: restore focus to previous element
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      const previousElement = previousActiveElementRef.current as HTMLElement;
      if (previousElement && document.contains(previousElement)) {
        previousElement.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};
