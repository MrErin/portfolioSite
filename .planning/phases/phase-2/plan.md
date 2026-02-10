# Phase 2: Animation System — Plan

## Context

Phase 1 delivered static layout: Hero, ProjectsSection (2-col grid of ProjectCards), FABs, modal structure, About/Contact panels. No animations or interactivity exist yet. Phase 2 is marked as **PRIORITY** in requirements — the core "falling down the rabbit hole" experience.

**Approach Change (2026-02-10):** Initial plan used scroll-triggered animations (IntersectionObserver). User feedback indicated this is incorrect. The desired effect is **scroll-linked parallax** — as the user scrolls, cards float past continuously. This creates the "falling" sensation tied to scroll position, not a one-time entrance animation.

## Goal

Implement scroll-linked parallax animations on project cards where card position is directly tied to scroll progress. Two toggleable modes (Straight Up and Diagonal Drift) and a mechanism to quickly switch between modes during development.

---

## Tasks

### 1. Rewrite animation config module
**File:** `src/data/animationConfig.ts` (full rewrite — only the `AnimationMode` type survives)

The current file exports Framer Motion `Variants` objects (`straightUpVariants`, `diagonalDriftVariants`, `getVariants`, `getStaggerDelay`, `ANIMATION_TIMING`). None of these are relevant to the scroll-linked approach. Replace entirely with:

- `AnimationMode` type: `'straight-up' | 'diagonal-drift'`
- Per-mode parallax config objects containing `useTransform` input/output range arrays:
  - **Straight Up config:**
    - `translateY`: input `[0, 1]` → output from positive to negative (e.g., `[150, -150]` pixels). Cards displaced downward at scroll start, displaced upward at scroll end.
    - `rotate`: subtle tilt range (e.g., `[-2, 2]` degrees)
    - `scale`: subtle pulse (e.g., `[0.95, 1.05]`)
  - **Diagonal Drift config:**
    - Same `translateY` range as straight-up
    - `translateX`: alternating direction based on card index. Even cards `[-40, 40]`, odd cards `[40, -40]`
    - `rotate`: wider range (e.g., `[-6, 6]` degrees)
    - `scale`: same as straight-up
- Per-card intensity multiplier: higher-index cards get slightly more displacement (e.g., `1 + index * 0.15`), creating layered depth where lower cards move faster
- `opacity` range: `[0, 1, 1, 0]` mapped to scroll input `[0, 0.15, 0.85, 1]` — cards fade in as they enter the parallax zone, stay visible through the middle, fade out as they leave. This enhances the "falling past" sensation.

### 2. Keep `AnimationModeContext` as-is
**File:** `src/context/AnimationModeContext.tsx` (no changes)

Already correctly implements:
- Provider wrapping the app
- Current `AnimationMode` state
- `toggleMode()` and `setMode()` functions
- Default: `'straight-up'`

### 3. Create `useScrollProgress` hook
**File:** `src/hooks/useScrollProgress.ts`

Custom hook using Framer Motion's `useScroll` with a **target ref** (not a container ref):

```ts
useScroll({ target: sectionRef, offset: ["start end", "end start"] })
```

- **`target` ref** tracks the projects section element's position relative to the viewport as the page scrolls. This is different from `container` ref which tracks scroll within a scrollable element.
- Returns `scrollYProgress` as a `MotionValue<number>` (0 → 1):
  - `0` = section's top edge has reached the viewport's bottom edge (just entering view)
  - `1` = section's bottom edge has reached the viewport's top edge (just leaving view)
- The hook accepts a `ref` to the section element and returns `{ scrollYProgress }`
- This single progress value feeds all per-card `useTransform` calls

### 4. Build `ParallaxCard` wrapper component
**File:** `src/features/projects/ParallaxCard.tsx`

Wraps `ProjectCard` with scroll-linked transforms using `motion.div` and `useTransform`:
- Receives `scrollYProgress` (MotionValue), `index`, `project`, and `prefersReducedMotion` as props
- Reads current mode from `AnimationModeContext`
- Uses `useTransform` to map `scrollYProgress` to individual transform properties:
  - `translateY` — primary parallax movement, multiplied by per-card intensity factor (`1 + index * 0.15`)
  - `rotate` — subtle or dramatic based on mode
  - `scale` — slight size variation through scroll
  - `opacity` — fade in/out at edges of scroll range
  - `translateX` — zero in straight-up mode; alternating left/right in diagonal-drift mode
- Applies transforms via `motion.div`'s `style` prop (not `animate`/`variants`, since these are continuous MotionValues)
- **Reduced motion:** if `prefersReducedMotion` is true, renders plain `<div>` with no transforms

### 5. Update `ProjectsSection` layout for parallax
**File:** `src/features/projects/ProjectsSection.tsx`

- Replace `AnimatedCard` import with `ParallaxCard`
- Attach a `ref` to the section element and pass it to `useScrollProgress`
- Pass `scrollYProgress` down to each `ParallaxCard`
- Pass `index` to each card for alternating direction and intensity multiplier
- **Section height:** Add generous vertical padding (`py-40` or similar) to give cards enough scroll runway for the parallax to feel substantial. With 4 cards in 2 rows, natural height is ~600-800px — padding extends the scroll range so transforms have room to play out.
- **Overflow:** Set `overflow: visible` on the grid container so displaced cards aren't clipped. The section itself should use `overflow: hidden` to prevent parallaxed cards from bleeding into the Hero above or content below. Adjacent sections (Hero) already have their own backgrounds and `z-index` layering.

### 6. Keep animation mode toggle as-is
**File:** `src/components/AnimationToggle.tsx` (no changes)

Already correctly implements:
- Floating button (top-left, `z-40`)
- Shows current mode label
- Click or `A` key to cycle modes
- Accessible button with aria-label

### 7. Keep `App.tsx` wiring as-is
**File:** `src/App.tsx` (no changes)

Already correctly wired:
- `AnimationModeProvider` wrapping all content
- `AnimationToggle` rendered
- Keyboard listener lives in `AnimationToggle` component (not App)

### 8. Add `prefers-reduced-motion` support
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` in `ProjectsSection` (same pattern as current implementation)
- Pass boolean down to `ParallaxCard`
- If active: `ParallaxCard` renders a plain `<div>` — no transforms, no motion
- Grid layout still works normally without transforms

---

## Files Created/Modified

| Action | File | Scope |
|--------|------|-------|
| **Rewrite** | `src/data/animationConfig.ts` | Full rewrite — replace Variants with useTransform ranges |
| **No change** | `src/context/AnimationModeContext.tsx` | Already correct |
| **New** | `src/hooks/useScrollProgress.ts` | New hook |
| **New** | `src/features/projects/ParallaxCard.tsx` | New component |
| **No change** | `src/components/AnimationToggle.tsx` | Already correct |
| **Modified** | `src/features/projects/ProjectsSection.tsx` | Swap AnimatedCard → ParallaxCard, add ref, adjust layout |
| **No change** | `src/App.tsx` | Already correct |
| **Modified** | `src/hooks/index.ts` | Export useScrollProgress instead of useScrollAnimation |
| **No change** | `src/components/index.ts` | Already correct |
| **Delete** | `src/hooks/useScrollAnimation.ts` | IntersectionObserver approach, no longer needed |
| **Delete** | `src/features/projects/AnimatedCard.tsx` | Replaced by ParallaxCard |

---

## Verification

1. `npm run dev` — no errors
2. Scroll down to projects section — cards move continuously as you scroll (parallax effect, not a one-time entrance)
3. Cards fade in as they enter the scroll zone, stay visible through the middle, fade out as they leave
4. Cards lower in the grid move slightly faster than upper cards (depth layering)
5. Press `A` or click toggle — animation mode switches live
6. **Straight Up mode:** cards move vertically only, subtle rotation, no lateral drift
7. **Diagonal Drift mode:** cards move vertically + alternating left/right drift, more rotation
8. Scrolling back up reverses the effect (scroll-linked, not one-shot)
9. `npx tsc --noEmit` — no type errors
10. Enable "prefers-reduced-motion" in browser devtools — parallax is disabled, cards show in static grid
11. Cards don't bleed into Hero section above (section overflow clipping)

**STOP after Phase 2 — wait for user approval before proceeding to Phase 3.**
