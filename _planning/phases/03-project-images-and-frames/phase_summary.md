<!-- STATUS: DRAFT -->

# Phase 3 Summary: Project Images & Looking Glass Frames

## At a Glance

Replaced gradient placeholders in ProjectCard and ProjectModal with real project images, with a boring-image-or-grey-gradient fallback at whimsy stop 0 and regular-image-or-purple-gradient at stops 1–2.

### Files Changed

- `src/components/projects/types.ts` — Added `imageUrl?: string` and `boringImageUrl?: string` optional fields to the `Project` interface
- `src/data/projects.ts` — Populated `imageUrl` (and `boringImageUrl` for Unfamiliar) on four of five projects; images served from `public/projectImages/` as `.webp`
- `src/components/projects/ProjectCard.tsx` — Replaced static gradient with conditional image or gradient fallback, grey at stop 0 / purple at stops 1–2
- `src/components/projects/ProjectModal.tsx` — Replaced static gradient header with conditional image or gradient fallback; header height increased to h-64
- `src/components/whimsy/WhimsySlider.tsx` — React 19 `useRef` compatibility fix (`useRef<ReturnType<typeof setTimeout>>(undefined)`)
- `_planning/codebase.md` — Updated component descriptions, added `public/projectImages/` to file tree, updated Patterns section

### Key Functions Added/Modified

- `ProjectCard` — `activeImageUrl` derived from `config.boringImages` flag; `hasImageError` state triggers gradient fallback on `onError`; `thumbnailClass` picks grey vs purple gradient
- `ProjectModal` — Same `activeImageUrl` / `hasImageError` / `showImage` pattern; `headerGradientClass` mirrors card logic (grey at stop 0, purple at stops 1–2)

### Behavior Changes

- At stop 0: ProjectCard and ProjectModal show `boringImageUrl` (or grey gradient if absent)
- At stops 1–2: ProjectCard and ProjectModal show `imageUrl` (or purple gradient if absent)
- Broken image URL silently falls back to gradient — no broken image icon shown
- Modal header is now 256px tall (was 128px)
- `boringImageUrl` added to the `Project` data model as an optional second image slot

---

## What Was Built

The plan called for real project images with SVG looking-glass frame overlays. The frame overlays were attempted but abandoned — the Victorian frame SVGs (~2.5:1 landscape aspect ratio) were fundamentally incompatible with the card thumbnail dimensions (~1.2:1). No approach to framing worked without grotesque distortion.

The feature pivot was: instead of decorative frame overlays to distinguish whimsy levels, use two different images per project. At stop 0 (boring), show a plain/neutral image. At stops 1–2 (whimsical), show the regular project screenshot. If no image is available for the current stop, fall back to the stop-appropriate gradient (grey for boring, purple for whimsical).

Only the Unfamiliar project has a `boringImageUrl` defined. The other three real projects have only `imageUrl`, so they show a regular image at stops 1–2 and grey gradient at stop 0.

The planned Task 0 rename (`boringImages` → `decorativeOverlays`) was reverted. The `boringImages` flag name is a better description of its current purpose: controlling which image variant to show, not just toggling decorative overlays.

## Key Decisions

- **Frame overlays scrapped:** Aspect ratio mismatch couldn't be resolved. Frame SVGs kept in `src/assets/` for possible future use with better-fitted assets.
- **`boringImages` rename reverted:** Positive-sense `decorativeOverlays` flag was tried but reverted — `boringImages` more accurately describes the system (boring vs regular image selection).
- **`boringImageUrl` added:** Not in original plan; emerged naturally from the image-switching approach. Second optional image field in the data model.
- **Modal header h-64 (256px):** Increased from planned h-32 (128px) to reduce image cropping.
- **React 19 `useRef` fix:** `useRef()` without initial value is not valid in React 19; changed to `useRef<...>(undefined)`.

## Major Logic Flows In This Phase

**Image selection in ProjectCard / ProjectModal:**

1. Read `config.boringImages` from `WhimsyContext`
2. Derive `activeImageUrl`: `boringImages ? project.boringImageUrl : project.imageUrl`
3. `showImage = activeImageUrl && !hasImageError`
4. If `showImage`: render `<img>` with `onError={() => setHasImageError(true)}`
5. If not `showImage`: render gradient `<div>` (grey at stop 0, purple at stops 1–2, using semantic `boring-*` tokens)

**WhimysSlider React 19 fix:**
- `useRef()` without a type argument implies `MutableRefObject<undefined>`, which React 19 rejects for timer refs. Explicit `useRef<ReturnType<typeof setTimeout>>(undefined)` satisfies the type system.

## Connection to Previous Phases

- Phase 1 established the WhimsySlider and 3-stop model with `boringImages` flag
- Phase 2 established the `boringImages`-driven visibility pattern (hero silhouette)
- Phase 3 applies the same flag to project image selection — consistent with the established pattern

<!-- STATUS: COMPLETE -->
