# Feature Requirements — Dewhimsifier

**Status:** Complete
**Date:** 2026-07-03

---

## Feature Definition

A persistent, always-visible slider that lets visitors reduce the site's "whimsy level" from maximum (current portfolio experience) down to a professional/corporate presentation. Resets to maximum whimsy on every page load. Intended to demonstrate range — visitors can see the creative version first, then dial it back to confirm the developer can do buttoned-up work too.

---

## User Stories

- As a visitor, I see the site at full whimsy on load so my first impression is the creative experience.
- As a visitor, I notice a subtle slider control and can move it to reduce visual complexity.
- As a hiring manager, I can set the slider to minimum whimsy and see a clean, professional grid layout.

---

## Whimsy Stops

Three discrete stops. Color palette, gothic typography, and dark theme survive all three.

| Stop | Name | What's active |
|------|------|----------------|
| 0 | *Curiouser and Curiouser* | Parallax diagonal drift · particles · grow-from-card modal · gradient image placeholders |
| 1 | *Sensibly Strange* | Grid layout · particles · grow-from-card modal · gradient image placeholders |
| 2 | *Quarterly Review* | Grid layout · no particles · simpler modal transition · grey/desaturated image placeholders |

---

## Architecture

### WhimsyConfig (single source of truth)

One config object maps each stop to feature flags. Changing what a stop includes = editing one line.

```ts
type WhimsyLevel = 0 | 1 | 2;

interface WhimsyConfig {
  parallax: boolean;
  particles: boolean;
  growFromCard: boolean;
  boringImages: boolean;
}

const WHIMSY_LEVELS: Record<WhimsyLevel, WhimsyConfig> = {
  0: { parallax: true,  particles: true,  growFromCard: true,  boringImages: false },
  1: { parallax: false, particles: true,  growFromCard: true,  boringImages: false },
  2: { parallax: false, particles: false, growFromCard: false, boringImages: true  },
};
```

### WhimsyContext

React context providing `level` (current stop) and `config` (resolved flags) to all components. Provider wraps the root in `App.tsx`. No localStorage — initialises to `0` on every load.

### Components affected

| Component | Change |
|-----------|--------|
| `ProjectsSection.tsx` | Conditionally renders sticky parallax vs standard grid based on `config.parallax` |
| `ParticleField.tsx` | Renders `null` when `config.particles` is false |
| `ProjectModal.tsx` | Conditionally uses grow-from-card animation vs simpler slide/fade when `config.growFromCard` is false |
| `ProjectCard.tsx` | Swaps gradient placeholder for grey gradient box when `config.boringImages` is true |
| `App.tsx` | Wraps tree with `WhimsyProvider` |

### New components

| Component | Description |
|-----------|-------------|
| `WhimsyContext.tsx` | Context, provider, config object, `useWhimsy` hook |
| `WhimsySlider.tsx` | Fixed top-left slider control with attention animation |

---

## UI/UX

### Slider control

- **Position:** Fixed, top-left corner, with `safe-area-inset` padding for mobile notch handling
- **Element:** Native `<input type="range" min="0" max="2" step="1">` — keyboard-accessible out of the box (arrow keys), touch-friendly when sized correctly (min 44px touch target)
- **Labels:** Current stop name displayed beneath or beside the slider (e.g. *Curiouser and Curiouser*). Tick marks on the track for the three positions.
- **Control label:** Small "Whimsy" label or wand icon above/beside the control so its purpose is clear.

### Attention animation

- **Type:** Slow, subtle pulse — likely a gentle glow or opacity breath on the slider track or thumb
- **Behaviour:** Continuous, indefinite loop
- **Constraint:** Must not be distracting; amplitude/intensity should be low. Respects `prefers-reduced-motion` (stops animating if motion is reduced).

### Accessibility

- Native range input provides keyboard navigation, ARIA role, and value announcement for free
- Stop name label updates on change (visible + `aria-live` region or `aria-valuetext`)
- Touch target minimum 44px height
- Fixed position does not obscure content scroll (stays in corner)

---

## Integration Points

- `App.tsx` — add `WhimsyProvider` wrapper; no other changes to overlay/modal state
- `ProjectsSection.tsx` — largest change; sticky parallax pattern replaced by grid when `parallax: false`. Grid should match the responsive card layout (mobile-first, alternating left/right on desktop).
- `ParticleField.tsx` — minimal change; conditional render on `particles` flag
- `ProjectModal.tsx` — conditional animation; simpler transition when `growFromCard: false`
- `ProjectCard.tsx` — conditional image placeholder style on `boringImages` flag

---

## Data Model Changes

None. No new types beyond `WhimsyLevel` and `WhimsyConfig` (both local to `WhimsyContext.tsx`). No backend, no persistence.

---

## Business Rules

- Resets to Stop 0 (*Curiouser*) on every page load — no persistence
- All three stops retain the full color palette, gothic typography, and dark theme
- `prefers-reduced-motion` behaviour is unchanged and layered on top of whimsy (motion-sensitive users get reduced motion at any stop)
- Image placeholder at Stop 2 is a stub — grey/desaturated gradient box. Final image treatment deferred.

---

## Out of Scope

- Persistent whimsy preference (localStorage / cookies)
- More than 3 stops
- Real images or AI-generated "strangeified" corporate stock photos
- Changes to color palette, typography, or dark theme at any stop
- New visual elements planned for future (not yet defined)

---

## Open Questions

None — all decisions made.

---

## Deferred

- Final image treatment for Stop 2 (*Quarterly Review*) — what the "boring corporate" image looks like beyond the grey gradient stub.
