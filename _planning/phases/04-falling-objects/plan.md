<!-- STATUS: COMPLETE -->

# Phase 4 Plan: Falling Objects

## Goal

Add 6 Alice-themed SVG silhouettes (armchair, teacup, pocket watch, skeleton key, playing card, open book) drifting in the background of the Projects section. At stop 2, objects fall with the parallax scroll. At stop 1, objects appear as static background decoration. Hidden at stop 0. Objects add atmospheric depth without competing with project cards.

## Dependencies

- Phase 1: WhimsyContext with 3-stop model and config flags
- Phase 2: Hero silhouette pattern (decorative SVG import + `aria-hidden`)
- Phase 3: Project images in cards (establishes z-index layering context)
- Existing: `animationConfig.ts` scroll window math, `ParallaxCard` transform pattern

## Decisions (Confirmed)

- **Stop 2:** Objects fall with parallax scroll, staggered separately from cards so multiple things are on screen at once (cards + objects, not one-at-a-time)
- **Stop 1:** Objects are static with a random sequential glow — one object glows faintly at a time, in random order, creating subtle background life
- **Stop 0:** Hidden

---

## Research Notes

### SVG Assets

All 6 SVGs are potrace-generated, 1024x1024pt viewBox, black fill (`#000000`), no stroke. Files:
- `src/assets/armchair.svg`, `book.svg`, `card.svg`, `cup.svg`, `key.svg`, `watch.svg`

### Colorization on Dark Background

Black silhouettes are invisible on the dark theme. Options considered:

1. **CSS `filter`** — `invert(1)` turns black to white, then `sepia` + `hue-rotate` + `saturate` can tint. Works on `<img>` elements without modifying SVG source.
2. **CSS `mask-image`** — Use SVG as mask on a colored `<div>`. More control over color but more complex markup.
3. **Edit SVG fill** — Change `#000000` to a theme color. Simple but couples asset to theme.

**Recommendation:** CSS `filter` approach. Keeps assets unmodified, color is adjustable via CSS classes, and pairs naturally with the opacity requirement (15–25%).

### Scroll-Linked Positioning (Stop 2) — Two-Track Architecture

The parallax section has two independent visual tracks sharing the same `scrollYProgress` MotionValue:

- **Foreground track:** Project cards (existing `ParallaxCard` — one at a time, center stage)
- **Background track:** Falling objects (new — continuous stream at viewport edges, behind cards)

**Slot-based approach:** Pre-generate ~15–20 object "slots" on component mount. Each slot is randomly assigned one of the 6 SVGs (objects repeat — the same teacup can appear 3 times). Each slot also gets randomized horizontal position (biased toward edges to avoid overlapping cards), base rotation, and size.

**Randomization stability:** Store the generated slot configs in a `useRef` so they're stable across re-renders. Deterministic from mount — no re-rolling per frame.

**Scroll windows:** Each slot gets a shorter window (~0.15–0.20 ratio vs cards' 0.30) so objects cycle through faster. With 15–20 slots distributed across the sticky range, ~3–5 objects are visible at any scroll position, creating a continuous "debris falling alongside you" effect.

**Sub-component pattern:** Each slot renders as its own `FallingObject` (singular) sub-component with its own `useTransform` hooks — same pattern as `ParallaxCard`. This keeps hooks unconditional and per-instance.

**Depth separation from cards:** Slower `translateY` range, no diagonal drift (pure vertical), smaller scale range, lower opacity — objects feel further away, like background debris in a deep well.

### Static Positioning + Random Glow (Stop 1)

In grid mode, objects are absolutely positioned at fixed coordinates within the section at low base opacity (15–20%). A JS timer (`useEffect` + `setInterval`) picks one object at random to "glow" — a CSS `drop-shadow` animation that fades in, holds briefly, then fades out before the next object is selected.

**Glow mechanic:**
- `setInterval` every ~3–4s picks a random index (avoiding the previous one)
- The selected object gets a CSS class that triggers a `drop-shadow` glow keyframe animation (fade in → hold → fade out, ~2.5s total)
- `drop-shadow` works on `<img>` silhouettes — it traces the alpha boundary, producing a halo effect
- Glow color: theme-consistent (purple-glow or gold at low intensity)
- Only one object glows at a time — the effect is subtle ambient life, not a light show
- Respects `prefers-reduced-motion` — glow disabled, objects remain static

### Reduced Motion

`prefers-reduced-motion`: hide all falling objects (same pattern as `ParticleField`).

### Mobile

Requirements flag mobile behavior as TBD. Options: hide entirely on small viewports, reduce count, or keep as-is. Plan includes an evaluation step — objects render at reduced count or hidden below `md` breakpoint, confirmed during UA testing.

---

## Tasks

### Task 1: Create `FallingObjects` and `FallingObject` components — DONE

**Files:** `src/components/projects/FallingObjects.tsx` (new)

**Action:**
- Import all 6 SVGs as URL imports (same pattern as `herosilhouette.svg` in Hero)
- Define `OBJECT_SOURCES` array of the 6 SVG imports
- Define `ObjectSlot` interface: `{ src: string, left: string, size: string, rotation: number, scrollOffset: number }`
- **`FallingObjects` (container):** Accepts `scrollYProgress?: MotionValue<number>`, `mode: 'falling' | 'static'`
  - On mount, generate slot configs in a `useRef`: ~15–20 slots for falling mode, 6 for static mode
  - Each slot: random SVG from `OBJECT_SOURCES`, random `left` (biased toward edges: 0–15% or 75–100%), random `size` (w-12 to w-20 range), random `rotation` (-30 to 30 deg), stagger index for scroll window
  - Renders a list of `FallingObject` sub-components with the generated configs
- **`FallingObject` (individual):** Accepts `scrollYProgress`, slot config, mode
  - In falling mode: applies `useTransform` for vertical drift, opacity fade, subtle scale
  - In static mode: renders at fixed position with base opacity
- All images: `aria-hidden="true"`, `pointer-events-none`, `select-none`, decorative `alt=""`
- Apply `.falling-object` CSS class for colorization filter
- z-index below cards, above section background

**Verify:** Component renders without errors. Objects visible on dark background with tinted color. Not interactive.

**Done when:** Multiple themed silhouettes render with correct colorization and randomized positioning. Same SVG appears more than once across slots.

**File touches:** 1 (new file)

### Task 2: Integrate into `ProjectsSection` — DONE

**Files:** `src/components/projects/ProjectsSection.tsx`

**Action:**
- Import `FallingObjects` component
- **Parallax mode (stop 2):** Add `<FallingObjects scrollYProgress={scrollYProgress} mode="falling" />` inside the sticky container, before the cards (lower in paint order = behind cards)
- **Grid mode (stop 1):** Add `<FallingObjects mode="static" />` inside the section, before the grid content
- **Stop 0 / reduced motion:** Do not render `FallingObjects`
- Use `config.particles` as visibility gate (true at stops 1–2) and `config.parallax` for animation mode (true at stop 2 only). No new WhimsyConfig flag needed.
- Wrap in `prefers-reduced-motion` check (already available as `prefersReducedMotion` in the component)

**Verify:** Objects appear in parallax mode at stop 2, static with glow in grid at stop 1, hidden at stop 0 and with reduced motion.

**Done when:** FallingObjects integrated in both render modes with correct visibility gating.

**File touches:** 1

### Task 3: Scroll-linked transforms for parallax mode — DONE

**Files:** `src/components/projects/FallingObjects.tsx`

**Action:**
- `FallingObject` sub-component uses `useTransform` with its own scroll window derived from slot's stagger index
- Window ratio ~0.15–0.20 (shorter than cards' 0.30) so objects cycle through faster
- With ~15–20 slots, expect ~3–5 objects visible at any scroll position — continuous stream effect
- Transform values (tuned during build):
  - `translateY`: range like `[600, -1200]` — covers full viewport travel
  - `opacity`: fade in/out within each slot's scroll window (same pattern as `getCardOpacityRange`)
  - `scale`: subtle range (e.g., `[0.85, 1.0]`)
  - No scroll-linked rotation — base rotation is static per slot via CSS `rotate`
- Horizontal positions biased toward edges (0–15% or 75–100%) so objects frame the cards rather than overlap them
- Mobile: hide below `md` breakpoint via Tailwind `hidden md:block` or reduce slot count. Evaluate during UA testing.

**Verify:** Continuous stream of objects drifts past at a different rate than cards. Feels like background debris in a rabbit hole. Objects don't obscure card content.

**Done when:** Two-track effect is clear — cards in foreground, objects streaming past in background.

**File touches:** 0 (same file as Task 1, refinement)

### Task 4: Random glow effect for static mode — DONE

**Files:** `src/components/projects/FallingObjects.tsx`, `src/index.css`

**Action:**
- In static mode (`mode='static'`), add a `useEffect` + `setInterval` (~3–4s) that selects a random object index to glow (avoiding repeat of the previous index)
- Track `glowIndex` in state
- The glowing object gets a CSS class (e.g., `.falling-object-glow`) that applies a `drop-shadow` filter animation
- Add `@keyframes` in `index.css` for the glow pulse:
  ```css
  @keyframes object-glow {
    0%, 100% { filter: <base-filter>; }
    40%, 60% { filter: <base-filter> drop-shadow(0 0 8px var(--color-purple-glow)); }
  }
  ```
- Animation duration ~2.5s, runs once per selection, then interval picks next
- Glow color: `--color-purple-glow` or `--color-gold` (tuned during build)
- Skip glow when `prefers-reduced-motion` is active — objects remain static with no animation

**Verify:** One object glows at a time in random order. Effect is subtle and ambient. No two objects glow simultaneously.

**Done when:** Static mode has gentle, randomized background life without being distracting.

**File touches:** 1 (index.css — component changes are in the same file as Task 1)

### Task 5: CSS filter and utility classes — DONE

**Files:** `src/index.css`

**Action:**
- Add base colorization filter class:
  ```css
  .falling-object {
    filter: invert(1) sepia(0.3) hue-rotate(220deg) saturate(0.5);
  }
  ```
- Add glow variant class (`.falling-object-glow`) with the `object-glow` keyframe animation
- Values tuned during build for best visual result against `bg-deep`
- Keep filter in CSS rather than inline styles — single source of truth

**Verify:** Black SVG silhouettes render as muted purple/blue tint. Glow class adds visible but subtle halo.

**Done when:** Filter produces theme-consistent tint; glow animation is smooth and ambient.

**File touches:** 1 (combined with Task 4 changes to index.css)

### Task 6: Update `codebase.md` — DONE

**Files:** `_planning/codebase.md`

**Action:**
- Add `FallingObjects.tsx` to file tree with description
- Add falling objects pattern to Patterns section
- List the 6 SVG assets in the assets section

**Verify:** Documentation reflects what was built.

**Done when:** New component, assets, and behavior documented.

**File touches:** 1

---

## Task Summary

| # | Task | Files | Touches |
|---|------|-------|---------|
| 1 | Create FallingObjects component | FallingObjects.tsx (new) | 1 |
| 2 | Integrate into ProjectsSection | ProjectsSection.tsx | 1 |
| 3 | Scroll-linked parallax transforms | FallingObjects.tsx (refinement) | 0 |
| 4 | Random glow effect for static mode | FallingObjects.tsx + index.css | 1 |
| 5 | CSS filter and utility classes | index.css | 0 (combined with Task 4) |
| 6 | Update codebase.md | codebase.md | 1 |

**Total file touches:** 4 (1 new + 3 modified)

---

## Verify Criteria (Phase-Level)

- [ ] Continuous stream of falling object silhouettes visible at stop 2, drifting behind cards
- [ ] Two-track effect: cards in foreground (one at a time), objects streaming in background (~3–5 visible)
- [ ] Same SVG appears more than once across the scroll — objects repeat naturally
- [ ] Objects visible as static decoration at stop 1 with random sequential glow
- [ ] Glow: one object at a time, random order, subtle ambient effect
- [ ] Objects hidden at stop 0
- [ ] Objects hidden when `prefers-reduced-motion` is active (including glow animation)
- [ ] Objects tinted to match dark theme (not black, not jarring)
- [ ] Opacity in 15–25% range — atmospheric, not distracting
- [ ] No interference with card click targets or interactive elements
- [ ] Mobile behavior evaluated and documented
- [ ] No console errors or warnings
- [ ] `codebase.md` updated
