<!-- STATUS: COMPLETE -->

# Phase 1: Whimsy Slider Restyle

## Goal

Restyle the whimsy slider with three visual states (ornate Victorian, toned down, clean minimal) that adapt as the user changes whimsy level, while preserving all accessibility features.

## Research Notes

### Current Implementation
- **Component:** `src/components/whimsy/WhimsySlider.tsx` — native `<input type="range">` with `aria-label`, `aria-valuetext`, `aria-live` stop name
- **Styles:** `src/index.css` lines 178–252 — `.whimsy-pulse` keyframes, `.whimsy-range` with webkit/moz pseudo-element selectors
- **Layout:** Fixed `z-30` top-left with safe-area inset handling
- **Current issues:** Oversized horizontal ovoid glow, unstyled labels, tick marks look like broken dashes

### Whimsy Level Access
- Component already has `level` from `useWhimsy()` — can use it directly for conditional styling
- Levels: `0` (Curiouser and Curiouser), `1` (Sensibly Strange), `2` (Quarterly Review)

### CSS Pseudo-Element Constraints
- Slider thumb/track styling requires vendor-specific pseudos (`::-webkit-slider-thumb`, `::-moz-range-thumb`, etc.)
- Cannot use Tailwind utility classes on these pseudos — must be raw CSS in `index.css`
- Conditional styling approach: apply a data attribute or CSS class based on level, then style each state in CSS

### Available Theme Tokens
- Gold: `--color-gold`, `--color-gold-dark` (Victorian ornate feel)
- Purple: `--color-purple`, `--color-purple-light`, `--color-purple-glow`
- Surface: `--color-surface-dim`, `--color-surface`, `--color-surface-bright`
- Fonts: `--font-display` (Cinzel Decorative), `--font-heading` (Cinzel), `--font-body` (Raleway)

## Tasks

### Task 1: Add data attribute for whimsy level `PENDING`

**Files:** `src/components/whimsy/WhimsySlider.tsx`
**Action:** Add `data-whimsy={level}` to the outermost wrapper div so CSS can target each visual state. This enables the three-state styling without JavaScript-driven inline styles.
**Verify:** Inspect element in browser — `data-whimsy` attribute updates when slider moves.
**Done when:** Wrapper div has `data-whimsy="0"`, `"1"`, or `"2"` matching current level.

### Task 2: Restyle slider — Stop 0 (ornate Victorian) `PENDING`

**Files:** `src/index.css`, `src/components/whimsy/WhimsySlider.tsx`
**Action:**
- Replace `.whimsy-pulse` animation with a subtler glow that fits the thumb shape (not the oversized ovoid)
- Style thumb as a dark gold/metallic knob: gradient background using gold tokens, subtle box-shadow for depth, slightly larger than current 16px (maybe 20px)
- Style track as a decorative rail: gold-tinted, slightly thicker, inset shadow for depth
- Style labels ("Whimsy" title and stop name) with `font-heading` (Cinzel), gold-tinted text color
- Remove tick mark dashes (the three `<span>` elements)
- Ensure focus-visible outline remains visible and passes contrast
**Verify:** Visual inspection at stop 0 — slider feels like a themed artifact, not a browser default
**Done when:** Stop 0 has ornate thumb, decorative track, themed labels, no tick dashes, focus ring intact.

### Task 3: Restyle slider — Stop 1 (toned down) `PENDING`

**Files:** `src/index.css`
**Action:**
- Thumb: simpler gradient, less glow, same size
- Track: still styled but less decorative — fewer shadows, more muted color
- Labels: keep Cinzel font but more muted color (text-secondary instead of gold)
- Transition between stop 0 and stop 1 should feel like a deliberate step down, not a jarring change
**Verify:** Visual inspection at stop 1 — clearly less ornate than stop 0, but still styled
**Done when:** Stop 1 is visually distinct from stop 0, reading as "refined" rather than "ornate."

### Task 4: Restyle slider — Stop 2 (clean minimal) `PENDING`

**Files:** `src/index.css`
**Action:**
- Thumb: simple circle, surface-bright background, subtle border, no glow or gradient
- Track: thin line, muted color (surface or border token), no shadows
- Labels: body font (Raleway), text-muted color — reads as standard UI
- No animation, no decorative elements
**Verify:** Visual inspection at stop 2 — looks like a clean, professional UI control
**Done when:** Stop 2 is visually minimal and clearly distinct from stops 0 and 1.

### Task 5: CSS transitions between states `PENDING`

**Files:** `src/index.css`
**Action:** Add CSS transitions on thumb and track properties (background, box-shadow, border) so switching stops animates smoothly rather than snapping. Keep transitions short (200-300ms). Respect `prefers-reduced-motion` — disable transitions when reduced motion is on.
**Verify:** Change slider between stops — transitions are smooth, not jarring. With reduced motion on, changes are instant.
**Done when:** State changes animate smoothly, reduced-motion users see instant changes.

### Task 6: WCAG contrast verification `PENDING`

**Files:** None (verification only)
**Action:** Check contrast ratios for all three visual states:
- Thumb against track and background
- Label text against background
- Focus ring visibility at all three stops
- Use browser dev tools or contrast checker
**Verify:** All interactive elements meet WCAG AA contrast (4.5:1 for text, 3:1 for UI components)
**Done when:** All three states pass contrast requirements, any failures are fixed.

## Dependencies

None — this phase has no image asset dependencies and can start immediately.

## Security Checklist

> N/A for this phase — pure CSS/visual changes, no data flow, no user input handling changes.

## Issues Discovered During Verification Stage

_(none yet)_
