<!-- STATUS: COMPLETE -->

# Phase 4 Summary: Falling Objects

## At a Glance

Adds 6 Alice-themed SVG silhouettes (armchair, book, card, cup, key, watch) as background decoration in the Projects section — scrolling past in parallax at stop 2, glowing gently in fixed positions at stop 1, hidden at stop 0.

### Files Changed
- `src/components/projects/FallingObjects.tsx` (new) — container + per-object components for the falling silhouettes
- `src/components/projects/ProjectsSection.tsx` — integrated FallingObjects into both render modes
- `src/components/projects/animationConfig.ts` — refactored to share scroll-window math between cards and objects via `getScrollWindowForRatio`
- `src/index.css` — added `.falling-object` colorization filter and `.falling-object-glow` keyframe animation
- `_planning/codebase.md` — documented FallingObjects, assets, and the two-track parallax pattern

### Key Functions Added/Modified
- `generateSlots()` — generates randomized `ObjectSlot` configs on mount; static mode uses edge-biased unique sources, falling mode uses wide distribution
- `FallingObject` — per-object component with unconditional `useTransform` hooks; applies scroll transforms in falling mode, fixed position in static mode
- `FallingObjects` — container managing slot generation, glow cycling (`setInterval`), and rendering
- `getScrollWindowForRatio()` — shared parameterized scroll-window calculator (replaces duplicated math)
- `getObjectScrollWindow()` — object-specific scroll windows using `OBJECT_WINDOW_RATIO = 0.18`

### Behavior Changes
- Stop 2 (parallax): 36 SVG silhouettes stream continuously behind the project cards as user scrolls
- Stop 1 (grid): 6 silhouettes sit at fixed positions; one glows at a time in random sequential order (~3.5s interval)
- Stop 0, reduced motion, and below `md` breakpoint: silhouettes hidden entirely

---

## What Was Built

`FallingObjects.tsx` introduces two visual modes behind the project cards.

**Falling mode (stop 2):** 36 object slots are generated on mount with randomized SVG source (any of 6 assets), horizontal position (5–85% of width), rotation, and size. Each slot is an independent `FallingObject` sub-component with its own `useTransform` hooks for `translateY`, `scale`, and opacity — same pattern as `ParallaxCard`. Each object's scroll window is shorter than a card's (ratio 0.18 vs 0.50), so objects cycle through faster. Since `FallingObject` hooks are always called (including in static mode where transforms aren't applied to style), the hook rules are never violated.

**Static mode (stop 1):** 6 slots are generated with unique SVGs distributed evenly between left and right edges. A `setInterval` picks a new random `glowIndex` every 3.5s (never repeating the previous). The glowing object receives the `.falling-object-glow` class which triggers a 2.5s CSS keyframe animation.

**Colorization:** All SVG silhouettes are black fills on transparent backgrounds. The `.falling-object` CSS class applies `filter: invert(1) sepia(0.3) hue-rotate(220deg) saturate(0.5)` to turn them into a muted purple-blue that fits the dark theme. The glow keyframe appends `drop-shadow` to the same filter chain so the base tint is preserved during animation.

**animationConfig.ts refactor:** The private `getScrollWindowForRatio(index, total, ratio)` function was extracted so both `getCardScrollWindow` (ratio 0.50) and `getObjectScrollWindow` (ratio 0.18) use identical math. No duplicate logic.

---

## Key Decisions

- **`useState` over `useRef` for slots:** Lazy initializer (`useState(() => generateSlots(...))`) runs once and is read-only thereafter — correct pattern for computed initial values. `useRef` would work but requires a null check on every access.
- **36 slots for falling mode (vs plan's 15–20):** Tuned upward during build for visual density. Results in ~7–8 objects visible at any scroll position rather than the planned 3–5.
- **Wide horizontal distribution for falling mode (5–85%):** The final build uses wide distribution rather than edge-biasing. Objects at low opacity behind cards don't obscure card content, and wide distribution fills the viewport more evenly during the scroll.
- **Paint-order z-stacking:** No explicit z-index on `FallingObjects` or `ParallaxCard`. `FallingObjects` renders first in JSX, placing it behind `ParallaxCard` naturally.

---

## Major Logic Flows In This Phase

**Falling mode scroll flow:**
1. `ProjectsSection` passes `scrollYProgress` (from `useScroll`) to `<FallingObjects mode="falling">`
2. `FallingObjects` renders 36 `FallingObject` sub-components, each receiving its slot index and `scrollYProgress`
3. Each `FallingObject` calls `getObjectScrollWindow(index, 36)` → gets its `[start, end]` range
4. `useTransform` maps the live scroll value to `translateY`, `scale`, and `opacity` for that slot
5. Framer Motion applies these as animated style values — no re-renders on scroll

**Static glow flow:**
1. `FallingObjects` in static mode initializes `glowIndex = -1`
2. `useEffect` runs immediately (`pickNext()`) and sets up `setInterval(pickNext, 3500)`
3. `pickNext` uses `setGlowIndex` functional updater to avoid stale closure on `prev`
4. Each `FallingObject` receives `isGlowing = (mode === 'static' && index === glowIndex)`
5. Glow is applied as a CSS class — `.falling-object-glow` — triggering the `object-glow` keyframe

---

## Connection to Previous Phases

- **Phase 1 (slider):** WhimsyContext's `config.particles` flag gates the falling objects — same flag as `ParticleField`. No new config flag was needed.
- **Phase 2 (hero silhouette):** The SVG-as-URL-import pattern (`import armchairUrl from '@/assets/armchair.svg'`) was established by the hero silhouette. FallingObjects follows the same import approach.
- **Phase 3 (project images):** Established z-index layering and the sticky container structure that FallingObjects slots into. The `absolute inset-0` container pattern mirrors the existing sticky viewport.
- **animationConfig.ts:** FallingObjects consumed and extended the existing scroll-window math, adding `getObjectScrollWindow` and `getObjectOpacityRange` alongside the card equivalents.
