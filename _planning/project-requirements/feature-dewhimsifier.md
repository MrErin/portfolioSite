# Feature Requirements — Dewhimsifier

## Whimsy System

- Three-stop whimsy slider (0: Curiouser and Curiouser, 1: Sensibly Strange, 2: Quarterly Review) fixed top-left, always visible
- Resets to stop 0 (max whimsy) on every page load — no persistence
- `WhimsyContext` provides `level`, `config`, and `setLevel` to all components via `useWhimsy()` hook
- `WHIMSY_LEVELS` config object maps each stop to four boolean feature flags: `parallax`, `particles`, `growFromCard`, `boringImages`
- Color palette, gothic typography, and dark theme survive all three stops unchanged

## Component Behavior by Stop

- Stop 0: sticky parallax layout, particles (hero + projects), grow-from-card modal animation, branded gradient thumbnails
- Stop 1: responsive grid layout (1-col mobile / 2-col desktop), particles, grow-from-card modal, branded thumbnails
- Stop 2: responsive grid, no particles, fade-up modal animation, grey/desaturated gradient thumbnails

## WhimsySlider

- Native `<input type="range">` — keyboard-accessible, touch-friendly, ARIA semantics browser-managed
- Stop name label with `aria-live="polite"` announces changes to screen readers
- Slow purple glow pulse animation (CSS `@keyframes`), suppressed by `prefers-reduced-motion`
- z-index 30 (below overlays z-50 and FAB z-40)

## Scope Exclusions (Dewhimsifier)

- No persistent whimsy preference (localStorage / cookies)
- No more than 3 stops
- No real images or AI-generated stock photos at stop 2 (grey gradient stub only)
- No changes to color palette, typography, or dark theme at any stop
