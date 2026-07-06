<!-- STATUS: COMPLETE -->

# Phase 6 Summary: Cave Floor Fixes

## At a Glance

Eliminated blank dead scroll space at stop 2 by moving the cave floor inside the sticky container with scroll-linked reveal, added edge-to-edge width coverage at stop 1, constrained static falling objects above the floor, reduced floor height by ~50% with CSS cropping, and added a soft top-edge fade.

### Files Changed
- `src/components/projects/ProjectsSection.tsx` — shared CSS constants (`CAVE_FLOOR_DECORATIVE`, `CAVE_FLOOR_MASK`); h-64 with object-cover/object-bottom; stop 1 edge-to-edge via `-mx-4`; stop 2 moved inside sticky container with `useTransform([0.78, 0.95])`; removed fragment wrapper
- `src/components/projects/FallingObjects.tsx` — static vertical range reduced from 80% to 55%
- `_planning/codebase.md` — updated cave floor documentation
- `_planning/decisions.md` — reversed decision #4

### Key Functions Added/Modified
- `CAVE_FLOOR_DECORATIVE` / `CAVE_FLOOR_MASK` — shared CSS class constants for cave floor styling (h-64, object-cover, mask-image fade)
- Stop 2 cave floor scroll-in — `useTransform(scrollYProgress, [0.78, 0.95], [100, 0])` maps scroll progress to translateY percentage, sliding the floor up from below the viewport

### Behavior Changes
- Stop 2: cave floor now scrolls in inside the sticky container as the last card exits, eliminating ~160vh of dead blank scroll space
- Stop 1: cave floor is edge-to-edge with no width gaps at any viewport size
- Stop 1: static falling objects constrained to upper ~60% of section, no longer overlap cave floor area
- Cave floor height reduced by ~50% with stalagmite detail preserved via `object-position: bottom`
- Top edge of cave floor has a soft gradient fade instead of a harsh straight line

---

## What Was Built

### Shared cave floor styles (Task 1)
Extracted `CAVE_FLOOR_DECORATIVE` and `CAVE_FLOOR_MASK` as private constants in `ProjectsSection.tsx`. Both stops now use identical base styling: `h-64 object-cover object-bottom` for height reduction with bottom-anchored cropping, plus `mask-image` for the soft top-edge fade. The mask uses `linear-gradient(to bottom, transparent 0%, black 15%)`.

### Stop 1 full-width (Task 2)
Applied `-mx-4` to break out of the section's horizontal padding, ensuring the floor stretches edge-to-edge at all viewport widths. The `object-cover` from Task 1 handles aspect ratio — no `preserveAspectRatio` conflicts.

### Stop 1 object containment (Task 3)
In `FallingObjects.tsx`, reduced the static mode's total vertical range from 80% to 55% of the container height. The 5% top start is preserved, capping the bottom at ~60% — well above the cave floor area. Slot count stays at 6.

### Stop 2 scroll-in (Task 4)
Removed the separate cave floor `<div>` that followed the parallax `<section>`. Moved the floor inside the sticky container as an absolutely-positioned element at the bottom. Added `useTransform(scrollYProgress, [0.78, 0.95], [100, 0])` — at scrollYProgress 0.78 the floor is 100% below the viewport, sliding to its resting position (translateY 0) by 0.95. This reclaims the dead scroll space as purposeful content. The fragment wrapper was removed since the floor is now a direct child of the sticky container.

---

## Key Decisions

1. **Reversed decision #4:** The cave floor at stop 2 is now inside the sticky container with scroll-linked translateY, not a static sibling after the section. This directly fixes the dead scroll space that decision #4 accepted as a tradeoff.

2. **Scroll range [0.78, 0.95]:** Tuned so the floor begins appearing as the last card exits (~0.80) and reaches its resting position before the section exits (~0.95). The range overlaps slightly with the tail end of the last card for a natural handoff.

3. **h-64 (256px) for floor height:** ~50% reduction from the SVG's natural rendering height while preserving stalagmite detail via `object-position: bottom`.

---

## Major Logic Flows In This Phase

**Stop 2 cave floor scroll-in:**
1. `ProjectsSection` passes `scrollYProgress` (from `useScroll`) to the cave floor element inside the sticky container
2. `useTransform(scrollYProgress, [0.78, 0.95], [100, 0])` maps scroll progress to a translateY percentage
3. At 0.78 progress, floor is `translateY(100%)` — fully below viewport
4. At 0.95 progress, floor is `translateY(0%)` — resting at bottom of sticky container
5. Framer Motion interpolates smoothly between these values during scroll

---

## Connection to Previous Phases

- **Phase 5:** Created the cave floor rendering at both stops. Phase 6 refines the visual treatment and fixes the dead scroll space tradeoff that Phase 5 accepted.
- **Phase 4:** FallingObjects static mode vertical range reduced to avoid overlapping the now-shorter cave floor.
- **Decision #4 (Phase 5):** Explicitly reversed in this phase — the cave floor is no longer a static sibling after the parallax section.
