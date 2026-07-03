# Roadmap

## Feature: Dewhimsifier

Requirements: `_planning/requirements.md`
Created: 2026-07-03

## Phases

- [x] Phase 1: WhimsyContext & Config
- [ ] Phase 2: Slider Control
- [ ] Phase 3: Component Integration

## Phase Intent Notes

**Phase 1 (WhimsyContext & Config):** Establishes the data layer for the whimsy system — `WhimsyLevel` type, `WhimsyConfig` interface, `WHIMSY_LEVELS` config object, `WhimsyContext`, `WhimsyProvider`, and `useWhimsy` hook. Wires the provider into `App.tsx`. No visual changes ship in this phase; done when context is consumable by any child component.

**Phase 2 (Slider Control):** Builds the `WhimsySlider` component — fixed top-left position, native `<input type="range">`, stop-name label, tick marks, and a slow subtle pulse animation that respects `prefers-reduced-motion`. Wires the slider into `App.tsx` so it reads and writes the whimsy level. Done when the slider is visible, functional, and animated.

**Phase 3 (Component Integration):** Updates four existing components to consume `useWhimsy` and respond to the active config flags: `ProjectsSection` (parallax → grid), `ParticleField` (conditional render), `ProjectModal` (conditional grow-from-card vs simpler transition), `ProjectCard` (grey gradient placeholder swap). Done when all three stops produce visually distinct experiences end-to-end.

## Notes

This is a feature addition on an archived MVP. All phases are scoped to the dewhimsifier only.

## Audit Checkpoints

> **User-initiated audits** — run `/plan:audit` at these optimal points. Not automated, just guidance.

| Checkpoint | Trigger | Why |
|------------|---------|-----|
| **Post-integration** | After Phase 3 | Validate no drift before archive |
