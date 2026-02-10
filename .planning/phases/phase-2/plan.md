# Phase 2: Animation System — Plan

## Context

Phase 1 delivered static layout: Hero, ProjectsSection (2-col grid of ProjectCards), FABs, modal structure, About/Contact panels. No animations or interactivity exist yet. Phase 2 is marked as **PRIORITY** in requirements — the core "falling down the rabbit hole" experience.

## Goal

Implement scroll-triggered animations on project cards with two toggleable modes (Straight Up and Diagonal Drift), staggered timing, and a mechanism to quickly switch between modes during development.

---

## Tasks

### 1. Create `useScrollAnimation` hook
**File:** `src/hooks/useScrollAnimation.ts`

Custom hook wrapping Framer Motion's `useInView` (or Intersection Observer) to detect when a card enters the viewport.

- Trigger at 20-30% visibility threshold
- Returns `inView` boolean and a `ref` to attach to elements
- Keeps hook reusable across any element

### 2. Create animation config module
**File:** `src/data/animationConfig.ts`

Central config for animation parameters:
- `AnimationMode` enum/type: `'straight-up' | 'diagonal-drift'`
- Shared timing: duration ~800ms, ease-out easing, stagger ~200ms
- Mode-specific variants:
  - **Straight Up:** `translateY(80px) → 0`, `opacity 0 → 1`, subtle `scale(0.95 → 1)`, minor `rotate(-2deg → 0)`
  - **Diagonal Drift:** Same as above + alternating `translateX(±40px) → 0`, slightly more rotation `(±5deg → 0)`
- Export Framer Motion `Variants` objects for each mode

### 3. Create `AnimationModeContext`
**File:** `src/context/AnimationModeContext.tsx`

React context to share animation mode across components:
- Provider wraps the app
- Stores current `AnimationMode`
- Exposes `toggleMode()` function
- Default: `'straight-up'`

### 4. Build `AnimatedCard` wrapper component
**File:** `src/features/projects/AnimatedCard.tsx`

Wraps `ProjectCard` with Framer Motion:
- `<motion.div>` using variants from animation config
- Uses `useScrollAnimation` hook for viewport detection
- Accepts `index` prop for stagger delay calculation (`index * 200ms`)
- Reads current mode from `AnimationModeContext`
- Applies the correct variant set based on mode
- `initial="hidden"`, `animate={inView ? "visible" : "hidden"}`

### 5. Update `ProjectsSection` to use `AnimatedCard`
**File:** `src/features/projects/ProjectsSection.tsx`

- Replace direct `<ProjectCard>` render with `<AnimatedCard>` wrapper
- Pass `index` to each card for stagger calculation

### 6. Add animation mode toggle
**File:** `src/components/AnimationToggle.tsx`

Dev-friendly toggle for rapid A/B testing:
- Small floating button (top-left or a keyboard shortcut)
- Shows current mode label
- Click or press `A` key to cycle between modes
- Subtle styling that doesn't distract from the portfolio itself
- Accessible: proper button with aria-label

### 7. Wire everything in `App.tsx`
- Wrap app content with `AnimationModeProvider`
- Add `AnimationToggle` component
- Register keyboard listener for `A` key toggle

### 8. Add `prefers-reduced-motion` support
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')`
- If active, skip animations (instant reveal, no transform/opacity transitions)
- Respects accessibility preference

---

## Files Created/Modified

| Action | File |
|--------|------|
| **New** | `src/hooks/useScrollAnimation.ts` |
| **New** | `src/data/animationConfig.ts` |
| **New** | `src/context/AnimationModeContext.tsx` |
| **New** | `src/features/projects/AnimatedCard.tsx` |
| **New** | `src/components/AnimationToggle.tsx` |
| **Modified** | `src/features/projects/ProjectsSection.tsx` |
| **Modified** | `src/App.tsx` |
| **Modified** | `src/hooks/index.ts` |
| **Modified** | `src/components/index.ts` |

---

## Verification

1. `npm run dev` — no errors
2. Scroll down to projects section — cards animate in from below with stagger
3. Press `A` or click toggle — animation mode switches
4. Scroll back up and down — cards re-animate with the new mode
5. Straight Up mode: cards rise vertically only
6. Diagonal Drift mode: cards rise with alternating left/right drift
7. Stagger is visible (~200ms gap between each card appearing)
8. `npx tsc --noEmit` — no type errors
9. Enable "prefers-reduced-motion" in browser devtools — animations are skipped

**STOP after Phase 2 — wait for user approval before proceeding to Phase 3.**
