# Project State

## Current Phase
**Phase 2: Animation System**

## Status
`not-started` — Plan reviewed, clarified, and approved. Ready to rebuild.

## Why Rebuild?
Initial implementation used scroll-triggered animations (IntersectionObserver). User feedback indicated this is incorrect. The desired effect is **scroll-linked parallax** — cards float past continuously as the user scrolls, creating the "falling down the rabbit hole" sensation. This requires Framer Motion's `useScroll` + `useTransform` for scroll position mapping, not viewport detection.

See `.planning/decisions.md` entry #5 for full rationale.

## Phases Complete
- Phase 0: Project Setup ✓ (commit `1f91bc2`)
- Phase 1: Layout & Structure ✓ (commit `2f46c43`)

## Blockers
None — awaiting user approval of updated plan.

## Session Log
| Date | Action |
|------|--------|
| 2026-02-10 | Initialized `.planning/` directory from existing codebase (Phases 0-1 already built) |
| 2026-02-10 | Built Phase 2 with scroll-triggered approach — incorrect implementation |
| 2026-02-10 | Updated Phase 2 plan for scroll-linked parallax approach — awaiting approval |
| 2026-02-10 | Reviewed Phase 2 plan — clarified target ref vs container ref, section height strategy, opacity ranges, overflow handling, per-card intensity, and config rewrite scope |
