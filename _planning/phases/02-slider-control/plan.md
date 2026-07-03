<!-- STATUS: DONE -->

# Phase 2 Plan: Slider Control

**Goal:** Build the `WhimsySlider` component — fixed top-left, native range input, stop-name label, tick marks, and a subtle CSS pulse animation respecting `prefers-reduced-motion`. Wire it into `App.tsx` so it reads and writes the whimsy level. Done when the slider is visible, functional, and animated.

**Depends on:** Phase 1 (WhimsyContext & Config) — complete.

---

## Research Notes

### Native `<input type="range">` styling

Cross-browser range styling requires vendor-prefixed pseudo-elements:
- **Track:** `::-webkit-slider-runnable-track` (Chrome/Safari), `::-moz-range-track` (Firefox)
- **Thumb:** `::-webkit-slider-thumb` (Chrome/Safari), `::-moz-range-thumb` (Firefox)

Firefox does not require `-webkit-appearance: none` on the input itself; Chrome/Safari do. Firefox also auto-sizes the thumb; Chrome/Safari need explicit sizing.

**Touch target:** CSS `min-height: 44px` on the `<input>` element satisfies the touch target requirement natively — the browser extends the hit area.

### Tick marks via `<datalist>`

`<datalist id="...">` linked via `<input list="...">` renders tick marks on the track. Browser support is:
- Chrome/Edge: renders dots on the track, positioned at each option value
- Firefox: renders small lines
- Safari: **not supported** — datalist linked to range input is ignored

Since Safari does not render the ticks, a fallback set of visual tick marks (3 positioned divs below the input) is needed for full cross-browser consistency. Plan: render custom tick divs alongside the input; `<datalist>` still included for native support where available.

### Pulse animation

CSS `@keyframes` is preferred over Framer Motion here because:
1. Pure CSS animations are more performant (GPU composited)
2. `@media (prefers-reduced-motion: reduce)` handles the a11y requirement without JS
3. Consistent with the existing `animate-float` pattern in `index.css`

A box-shadow glow breath (opacity 30% → 60% → 30%) on a 3s ease-in-out infinite loop is subtle enough not to distract.

### z-index

- `z-50`: ProjectModal, SlidePanel (overlays)
- `z-40`: FAB (bottom-right)
- Slider: `z-30` — stays below overlays and FAB, above page content

### Stop names

`WHIMSY_LEVELS` in `WhimsyContext.tsx` holds only feature flags. Stop names are display-only metadata. Define `STOP_NAMES: Record<WhimsyLevel, string>` locally in `WhimsySlider.tsx` — no change to `WhimsyContext.tsx` needed.

---

## Tasks

### Task 1 — Add pulse keyframe + range input base styles to `src/index.css`

**File:** `src/index.css`

**Action:**
- Add `@keyframes whimsy-pulse`: animates `box-shadow` from faint to brighter purple glow and back, 3s ease-in-out infinite
- Add `.whimsy-pulse` utility class that applies the animation
- Add `@media (prefers-reduced-motion: reduce)` block setting `.whimsy-pulse { animation: none }`
- Add base range input styles scoped to `.whimsy-range`:
  - `appearance: none; -webkit-appearance: none` on the input
  - Track styles: `height: 4px`, purple-themed background, rounded ends
  - Thumb styles: `16px × 16px` circle, `background: var(--color-purple-light)`, subtle border, no default OS styling
  - `min-height: 44px` on the input for touch target

**Verify:** Copy the class onto a div in DevTools — confirm glow pulses and stops when `prefers-reduced-motion` is forced on. Range input renders with themed track/thumb.

**Done when:** `.whimsy-pulse` and `.whimsy-range` classes exist in `index.css` and produce the expected visual output.

---

### Task 2 — Create `src/features/whimsy/WhimsySlider.tsx`

**File:** `src/features/whimsy/WhimsySlider.tsx` (new)

**Action:** Build the complete slider component.

Structure:
```
<div>                          fixed z-30, top-left, safe-area padding
  <p>Whimsy</p>                small label, text-muted, font-body
  <div class="whimsy-pulse">   pulse wrapper
    <input type="range">       .whimsy-range, min=0 max=2 step=1
                               aria-label="Whimsy level"
                               aria-valuetext={STOP_NAMES[level]}
                               value={level}
                               onChange -> setLevel(Number(e.target.value) as WhimsyLevel)
    <datalist id="whimsy-ticks"> (for browsers that support it)
      <option value="0" /><option value="1" /><option value="2" />
    </datalist>
    <div>                      custom tick row — 3 evenly-spaced marks
      <span /><span /><span />
    </div>
  </div>
  <p aria-live="polite">       stop name label, updates on change
    {STOP_NAMES[level]}
  </p>
</div>
```

Key details:
- `STOP_NAMES`: `{ 0: 'Curiouser and Curiouser', 1: 'Sensibly Strange', 2: 'Quarterly Review' }`
- `onChange` coerces `e.target.value` to `WhimsyLevel` via `Number()` cast
- `aria-live="polite"` on the stop name label so screen readers announce changes
- Fixed position: `fixed top-4 left-4` + `env(safe-area-inset-top/left)` via inline style for notch handling
- Tailwind classes for text sizing, color, spacing

**Verify:** Component renders without TypeScript errors. Slider moves between stops, label updates, pulse animation visible.

**Done when:** `WhimsySlider.tsx` exists, compiles, renders the slider, and all a11y attributes are present.

---

### Task 3 — Export `WhimsySlider` from `src/features/whimsy/index.ts`

**File:** `src/features/whimsy/index.ts`

**Action:** Add one line:
```ts
export { WhimsySlider } from './WhimsySlider';
```

**Done when:** `import { WhimsySlider } from '@/features/whimsy'` resolves without error.

---

### Task 4 — Wire `WhimsySlider` into `src/App.tsx`

**File:** `src/App.tsx`

**Action:**
- Add `WhimsySlider` to the existing `import { WhimsyProvider }` line (or add a separate import)
- Render `<WhimsySlider />` inside `<WhimsyProvider>`, after the skip-link and before `<main>` — fixed positioning means DOM placement doesn't affect layout

**Done when:** Running `npm run dev` shows the slider in the top-left corner of the page.

---

## File Touch Summary

| File | Change |
|------|--------|
| `src/index.css` | Add `@keyframes whimsy-pulse`, `.whimsy-pulse`, `.whimsy-range` styles |
| `src/features/whimsy/WhimsySlider.tsx` | New file |
| `src/features/whimsy/index.ts` | +1 export line |
| `src/App.tsx` | +1 import, +1 JSX element |

**Total: 4 files — well below the 7-file friction threshold.**

---

## Open Questions

None — all design decisions are resolved in requirements.md. Safari tick mark gap is accepted (custom ticks cover it).
