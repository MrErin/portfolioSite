# Phase 2: Animation System — Revised Plan

## Problem with Current Implementation

The current build places cards in a CSS grid (`grid grid-cols-1 md:grid-cols-2 gap-8`). The parallax transforms move cards within their grid cells (translateY: 150px to -150px), but the grid layout defeats the "falling past" effect because:

1. **Cards are packed in adjacent cells** — they sit side-by-side, not floating in space
2. **All cards share the same scroll window `[0, 1]`** — they all move in lockstep, entering and exiting together
3. **TranslateY range is too small** — 150px of movement within a grid cell feels like a wobble, not a fall
4. **No sequential appearance** — the "falling past objects" sensation requires cards to enter one at a time, not all at once

## Goal

Restructure the layout so cards float up individually from below the viewport as the user scrolls, creating the "falling past objects in a deep well" sensation. Each card enters and exits at a different scroll point. Two toggleable modes (Straight Up and Diagonal Drift) control movement style.

## Architecture: Sticky Viewport Pattern

The core technique uses a tall section with a pinned inner viewport:

```
┌──────────────────────────────────────────┐
│  <section>  height: 300vh               │  ← Tall section creates scroll runway
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  <div sticky>  height: 100vh     │    │  ← Stays pinned to viewport while
│  │                                  │    │     user scrolls through the 300vh
│  │    ┌─────────┐                   │    │     section
│  │    │ Card 2  │   (exiting ↑)     │    │
│  │    └─────────┘                   │    │
│  │              ┌─────────┐         │    │  ← Cards float through this viewport
│  │              │ Card 3  │ (center)│    │     at staggered times
│  │              └─────────┘         │    │
│  │    ┌─────────┐                   │    │
│  │    │ Card 4  │   (entering ↑)    │    │
│  │    └─────────┘                   │    │
│  └──────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

**How it works:**
- The `<section>` is ~300vh tall, providing scroll distance
- Inside, a `position: sticky; top: 0; height: 100vh` container stays pinned to the viewport
- `useScroll` tracks progress through the tall section (0 → 1)
- Each card maps to its own sub-range of that progress
- Within its range, each card's `translateY` goes from +600px (below) through 0 (centered) to -600px (above)
- Cards appear to float up through the pinned viewport one after another

## Tasks

### Task 1: Add per-card scroll window calculator to animation config

**File:** `src/data/animationConfig.ts`
**Action:** Add a `getCardScrollWindow` function and a `getCardOpacityRange` function. Update translateY output range to be much larger.

**Specific changes:**

Add `getCardScrollWindow(index, totalCards)`:
- Calculates a sub-range of `[0, 1]` for each card based on its index
- `windowSize` = 0.35 (each card visible for 35% of total scroll progress)
- `stagger` = `(1 - windowSize) / (totalCards - 1)` — evenly distributes card start points
- Returns `{ start, end }` where `start = index * stagger`, `end = start + windowSize`
- For 4 cards: Card 0 → `[0.0, 0.35]`, Card 1 → `[0.217, 0.567]`, Card 2 → `[0.433, 0.783]`, Card 3 → `[0.65, 1.0]`

Add `getCardOpacityRange(index, totalCards)`:
- Returns `{ input: number[], output: number[] }` for per-card fade in/out
- Uses the card's scroll window with fade margins at edges
- `fadeMargin` = 15% of window size
- Input: `[start, start + fadeMargin, end - fadeMargin, end]`
- Output: `[0, 1, 1, 0]`

Update translateY output ranges:
- **Current:** `[150, -150]` — too small, cards barely move
- **New:** `[600, -600]` — cards travel full viewport height through the sticky container
- These values are applied within each card's scroll window, not the full `[0, 1]` range

Remove or reduce intensity multiplier:
- **Current:** `1 + index * 0.15` — was needed when all cards moved simultaneously to create depth
- **New:** Remove. Depth now comes from staggered scroll windows (cards enter at different times). Keeping the multiplier would make later cards overshoot the viewport, breaking the effect.

Remove shared opacity constants:
- **Current:** `OPACITY_INPUT` and `OPACITY_OUTPUT` shared across all cards
- **New:** Remove these. Per-card opacity is calculated by `getCardOpacityRange` instead.

**Verify:** Functions return correct ranges for 4 cards. TypeScript compiles.
**Done when:** `getCardScrollWindow(0, 4)` returns `{ start: 0, end: 0.35 }`, `getCardScrollWindow(3, 4)` returns `{ start: 0.65, end: 1.0 }`. TranslateY output is `[600, -600]`. No shared opacity constants.

---

### Task 2: Restructure ProjectsSection layout — sticky viewport pattern

**File:** `src/features/projects/ProjectsSection.tsx`
**Action:** Replace CSS grid with tall section + sticky viewport container.

**Specific changes:**

Remove the grid:
- Delete `<div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible">`

Replace the section structure:
```
<section ref={ref} aria-label="Projects" className="relative bg-deep" style={{ height: '300vh' }}>
  <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
    <h2 className="absolute top-8 z-10 ...">Projects</h2>
    {projects.map(...)}
  </div>
</section>
```

Key layout details:
- **Section:** `relative`, `height: 300vh` (provides ~400vh total scroll distance with viewport), `bg-deep` background
- **Sticky container:** `sticky top-0`, `h-screen` (100vh), `overflow-hidden` (clips cards entering/exiting), `flex items-center justify-center` (centers content area)
- **Heading:** `absolute top-8` within the sticky container, stays visible throughout the scroll, `z-10` to stay above cards
- **No grid**, no `max-w-6xl` wrapper — cards are positioned absolutely within the sticky container

Pass `totalCards={projects.length}` to each `ParallaxCard`.

Remove the `px-4 pr-20 pb-36 md:pr-4 md:pb-20` padding that was for the grid layout.

**Verify:** Section renders as a tall scroll area. Sticky container stays pinned during scroll. No grid visible.
**Done when:** Browser shows a 300vh section where the inner content stays pinned while scrolling. Cards are no longer in a grid.

---

### Task 3: Update ParallaxCard — per-card scroll windows and absolute positioning

**File:** `src/features/projects/ParallaxCard.tsx`
**Action:** Each card calculates its own scroll window, positions absolutely within the sticky container, and alternates horizontal placement.

**Specific changes:**

Add `totalCards` prop to `ParallaxCardProps` interface.

Replace shared scroll ranges with per-card ranges:
- Call `getCardScrollWindow(index, totalCards)` to get `{ start, end }`
- Call `getCardOpacityRange(index, totalCards)` to get per-card opacity input/output
- `translateY`: `useTransform(scrollYProgress, [start, end], [600, -600])` — using the card's own window
- `opacity`: `useTransform(scrollYProgress, cardOpacity.input, cardOpacity.output)` — per-card fade
- `rotate`: `useTransform(scrollYProgress, [start, end], config.rotateOutput)` — scoped to card's window
- `scale`: `useTransform(scrollYProgress, [start, end], config.scaleOutput)` — scoped to card's window
- `translateX`: `useTransform(scrollYProgress, [start, end], ...)` — scoped to card's window, with direction alternation for diagonal-drift mode

Remove the intensity multiplier:
- Delete `const intensity = getIntensityMultiplier(index)`
- Delete the `.map((v) => v * intensity)` on translateY output

Add absolute positioning and horizontal alternation:
- Each `motion.div` gets `className="absolute w-full max-w-sm md:max-w-md"`
- Even-indexed cards: positioned left — add style or class for `left: 10%` (desktop) or `left: 50%; transform: translateX(-50%)` (mobile)
- Odd-indexed cards: positioned right — add style or class for `right: 10%` (desktop) or same center (mobile)
- Responsive: On mobile (< md), all cards center horizontally. On desktop, they alternate left/right.

Reduced motion fallback:
- **Current:** Renders a plain `<div>` — but this relied on the grid for layout
- **New:** Render a plain `<div>` with `className="mb-8"` in a simple vertical stack. The parent component should also fall back to a simple stacked layout (see Task 4).

**Verify:** Each card appears at a different scroll point. Cards alternate left/right. Scrolling back reverses the effect.
**Done when:** Card 0 enters first as you scroll, card 3 enters last. Even cards on left, odd cards on right. Each card fades in, floats up through viewport, fades out.

---

### Task 4: Add reduced-motion fallback layout to ProjectsSection

**File:** `src/features/projects/ProjectsSection.tsx`
**Action:** When `prefersReducedMotion` is true, render a standard stacked layout instead of the sticky viewport pattern.

**Specific changes:**

Add conditional rendering:
- If `prefersReducedMotion` is true: render a simple `<section>` with standard padding, heading, and a vertical stack of `ProjectCard` components (no `ParallaxCard`, no sticky container, no 300vh height)
- If false: render the sticky viewport pattern from Task 2

Why this is needed:
- The sticky viewport + absolute positioning only makes sense with parallax transforms
- Without transforms, absolutely positioned cards would stack on top of each other
- The reduced-motion path should show a clean, static card list

**Verify:** Enable `prefers-reduced-motion: reduce` in browser devtools. Cards display in a simple vertical list.
**Done when:** Reduced motion shows a readable, static card layout. No sticky container, no 300vh height, no overlapping.

---

### Task 5: Update animation mode configs for new scroll window pattern

**File:** `src/data/animationConfig.ts`
**Action:** Adjust the per-mode config values to work with per-card scroll windows instead of the full `[0, 1]` range.

**Specific changes:**

The `translateYInput`/`translateYOutput` arrays in `STRAIGHT_UP_CONFIG` and `DIAGONAL_DRIFT_CONFIG` are no longer used directly — `ParallaxCard` now builds its own input range from `getCardScrollWindow`. However, the configs still define the **output values** for each transform property:

Restructure config objects to contain only output values:
```ts
STRAIGHT_UP_CONFIG = {
  translateYOutput: [600, -600],    // was [150, -150]
  rotateOutput: [-2, 2],            // unchanged
  scaleOutput: [0.95, 1.05],        // unchanged
  translateXOutput: [0, 0],          // unchanged (no horizontal movement)
}

DIAGONAL_DRIFT_CONFIG = {
  translateYOutput: [600, -600],    // was [150, -150]
  rotateOutput: [-6, 6],            // unchanged
  scaleOutput: [0.95, 1.05],        // unchanged
  translateXOutput: [-60, 60],       // was [-40, 40], slightly wider for new layout
}
```

Remove the `*Input` arrays from configs (they were all `[0, 1]`). The input range is now always `[start, end]` from `getCardScrollWindow`.

**Verify:** Config objects export clean output-only values. TypeScript compiles.
**Done when:** Configs contain only `*Output` arrays. `ParallaxCard` pairs them with per-card scroll windows as input ranges.

---

### Task 6: Verify no changes needed in supporting files

**Files:** `src/context/AnimationModeContext.tsx`, `src/components/AnimationToggle.tsx`, `src/App.tsx`, `src/hooks/useScrollProgress.ts`, `src/hooks/index.ts`, `src/components/index.ts`

**Action:** Confirm these files need no changes.

- `AnimationModeContext` — still provides mode and toggle, no changes
- `AnimationToggle` — still toggles mode, no changes
- `App.tsx` — still wraps with provider, renders ProjectsSection, no changes
- `useScrollProgress` — still tracks section scroll progress with target ref, no changes (the sticky viewport pattern doesn't change how scroll progress is tracked — the ref goes on the tall `<section>`, not the sticky container)
- `hooks/index.ts` — still exports useScrollProgress, no changes
- `components/index.ts` — still exports AnimationToggle, no changes

**Verify:** All imports resolve. No unused exports.
**Done when:** Confirmed no changes needed. Noted in this plan for completeness.

---

## Tuning Parameters

These values should be refined during implementation based on visual feel:

| Parameter | Initial Value | What It Controls | Adjust If... |
|-----------|--------------|------------------|--------------|
| Section height | `300vh` | Total scroll runway | Cards feel too slow (reduce) or too fast (increase) |
| Window size | `0.35` | How long each card is visible during scroll | Cards feel rushed (increase) or linger too long (decrease) |
| TranslateY range | `[600, -600]` | Vertical travel distance | Cards don't reach viewport edges (increase) or overshoot (decrease) |
| Horizontal offset | `10%` from edge | Left/right card placement | Cards feel too spread (increase %) or too tight (decrease %) |
| Card max-width | `max-w-sm md:max-w-md` | Card size within viewport | Cards feel too small or too large |
| Fade margin | 15% of window | Speed of fade in/out | Fade too abrupt (increase) or too slow (decrease) |

---

## Files Modified Summary

| Action | File | Scope |
|--------|------|-------|
| **Modified** | `src/data/animationConfig.ts` | Add `getCardScrollWindow`, `getCardOpacityRange`, remove shared opacity constants, remove intensity multiplier, restructure configs to output-only, increase translateY range |
| **Modified** | `src/features/projects/ProjectsSection.tsx` | Replace grid with sticky viewport pattern, add reduced-motion fallback, pass `totalCards` prop |
| **Modified** | `src/features/projects/ParallaxCard.tsx` | Per-card scroll windows, absolute positioning, horizontal alternation, `totalCards` prop, updated reduced-motion path |
| **No change** | `src/context/AnimationModeContext.tsx` | Already correct |
| **No change** | `src/components/AnimationToggle.tsx` | Already correct |
| **No change** | `src/App.tsx` | Already correct |
| **No change** | `src/hooks/useScrollProgress.ts` | Already correct |
| **No change** | `src/hooks/index.ts` | Already correct |
| **No change** | `src/components/index.ts` | Already correct |

---

## Dependencies

- Phase 1 layout (Hero, ProjectCard, FABs) — complete
- Framer Motion `useScroll` + `useTransform` — already installed
- `AnimationModeContext` — already built in current phase 2

---

## Verification

1. `npm run dev` — no errors
2. Scroll down past Hero — sticky viewport appears, stays pinned while scrolling
3. First card (Card 0) floats up from below the viewport as you begin scrolling into the section
4. As you continue scrolling, Card 0 rises through center and exits above, while Card 1 enters from below
5. Cards alternate left/right positioning (even = left, odd = right on desktop)
6. Each card fades in as it enters, stays opaque through center, fades out as it exits
7. Scrolling back up reverses everything (scroll-linked, not one-shot)
8. Press `A` or click toggle — **Straight Up**: vertical only. **Diagonal Drift**: vertical + horizontal drift + more rotation
9. `npx tsc --noEmit` — no type errors
10. Enable `prefers-reduced-motion` in devtools → static vertical card list, no parallax, no sticky container
11. Cards don't bleed outside the sticky viewport (overflow hidden clips them)
12. Mobile responsive: cards center horizontally on small screens

**STOP after Phase 2 — wait for user approval before proceeding to Phase 3.**
