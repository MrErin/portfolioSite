<!-- STATUS: COMPLETE -->

# Phase 2 Summary: Hero Ground Silhouette

## At a Glance

**Adds a decorative underground earth/roots SVG silhouette to the bottom of the hero section, visible when whimsy is active (stops 1–2) and hidden in professional mode (stop 0).**

### Files Changed
- `src/components/core/Hero.tsx` — Added silhouette `<img>` with absolute positioning, whimsy-driven opacity toggle, and overflow containment
- `src/assets/herosilhouette.svg` — New Potrace-traced underground earth/roots/grass silhouette (2064x437 viewBox)
- `src/components/projects/ProjectsSection.tsx` — Added `relative` to reduced-motion section for positioning consistency
- `_planning/codebase.md` — Updated Hero.tsx description and added assets directory entry

### Key Functions Added/Modified
- `Hero` component — Now imports `useWhimsy` to read `config.boringImages`, conditionally hides the silhouette via opacity transition

### Behavior Changes
- Hero section now displays a dark silhouette of underground earth/roots at its bottom edge (stops 1–2)
- At stop 0 (professional/boring mode), the silhouette fades out with a 300ms opacity transition
- Hero section has `overflow-hidden` to contain the silhouette edges

---

## What Was Built

A single `<img>` element was added to `Hero.tsx`, positioned absolutely at the bottom of the hero section. The SVG asset (`herosilhouette.svg`) is a Potrace-traced vector of underground earth, roots, and grass — black fill on transparent background. It scales naturally via `width: 100%` with the SVG's native aspect ratio (~4.7:1) governing height.

The silhouette is purely decorative: `aria-hidden="true"`, `pointer-events-none`, `select-none`, `draggable="false"`. It sits below the ParticleField and text content in the stacking order.

Whimsy behavior uses `config.boringImages` — when `true` (stop 0), the image fades to `opacity-0` via a `transition-opacity duration-300` class toggle. When `false` (stops 1–2), it's fully visible.

## Key Decisions

- **Whimsy visibility correction:** The original plan specified "visible stops 0–1, hidden at stop 2," but after discussion the decision was reversed — the silhouette is decorative/whimsical and should be hidden in professional mode (stop 0). `config.boringImages` is the semantically correct flag for this.
- **Opacity transition over conditional render:** Using CSS opacity keeps the DOM element stable, avoiding layout shifts and re-mount artifacts.
- **overflow-hidden on hero section:** Added to contain any SVG edge overflow at extreme viewport sizes.

## Major Logic Flows In This Phase

Minimal logic — the only runtime decision is the opacity class toggle:

1. `Hero` calls `useWhimsy()` to get `config`
2. `config.boringImages` is `true` at stop 0, `false` at stops 1–2
3. Ternary in className: `config.boringImages ? 'opacity-0' : 'opacity-100'`
4. CSS `transition-opacity duration-300` handles the animation

No state, no effects, no event handlers.

## Connection to Previous Phases

- **Phase 1 (Slider Restyle):** Established the 3-stop whimsy model and the `boringImages` config flag. This phase is the first consumer of `boringImages` beyond the project cards' gradient color swap.
- **Future phases:** The silhouette establishes the "underground" visual language. Phase 4 (falling objects) and Phase 3 (looking glass frames) will build on this atmospheric foundation.
