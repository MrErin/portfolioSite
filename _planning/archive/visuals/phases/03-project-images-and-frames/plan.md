<!-- STATUS: COMPLETE -->

# Phase 3: Project Images & Looking Glass Frames

## Goal

Replace gradient placeholders in ProjectCard and ProjectModal with real project images. Add ornate Victorian SVG frame overlays on thumbnails and modal headers at whimsical stops (1–2). Add image error fallback to gradient. Update the Project data model with optional `imageUrl`. Project images served from `public/` for a data-only update workflow.

**Depends on:** Phase 2 (hero silhouette established the whimsy-driven visibility pattern via `boringImages`, renamed to `decorativeOverlays` in this phase)

---

## Resolved Clarifications

1. **Frame overlay stops:** Visible at stops 1–2 (`config.decorativeOverlays`), hidden at stop 0. Confirmed by user.
2. **Frame in modal:** Yes — frame overlays visible in modal at stops 1–2. Same behavior as cards.
3. **Frame format:** SVG frames (`frame1.svg`, `frame2.svg`) — not PNG.
4. **Project images workflow:** Images in `public/projectImages/`, `imageUrl` is a plain string path (e.g., `'/projectImages/unfamiliar.png'`). Adding a project = edit `projects.ts` + optionally drop an image file. No imports needed.
5. **`imageUrl` optional:** Gradient fallback when absent or on load error.
6. **Rename `boringImages` → `decorativeOverlays`:** Positive-sense flag replaces negated checks. All consumers switch from `!config.boringImages` to `config.decorativeOverlays`.

---

## Research Notes

### Project images in `public/`

Vite serves files from `public/` as-is at the root path. `public/projectImages/unfamiliar.png` → `'/projectImages/unfamiliar.png'`. No import statements, no content hashing. Tradeoff (no cache busting) is acceptable for a portfolio with infrequent image changes. This enables the desired "data-only update" workflow.

### SVG frame overlay

2 SVG frames available (`frame1.svg`, `frame2.svg`). Imported statically in component code (these are theme assets, not user-managed). Assigned to projects by index (`index % 2`). Absolutely positioned over the thumbnail/header container with `pointer-events-none`, full dimensions, and opacity transition.

### Frame index consistency (card ↔ modal)

ProjectCard receives `index` from parent. ProjectModal doesn't have the index — it derives it via `projects.findIndex(p => p.id === project.id)`. Both use the same modulo logic, so the same project always gets the same frame.

### Image error fallback

React `onError` handler on `<img>` sets local `hasImageError` state → hides image, shows gradient. Lightweight — no retry logic.

### Accessibility

- Project images: `alt={project.name}` (meaningful)
- Frame overlays: `aria-hidden="true"`, `alt=""` (decorative)
- Gradient fallback: `aria-hidden="true"` (decorative)

---

## Tasks

### Task 0: Rename `boringImages` → `decorativeOverlays` in WhimsyConfig

**Files:** `src/components/whimsy/WhimsyContext.tsx`, `src/components/core/Hero.tsx`, `src/components/projects/ProjectCard.tsx`

**Action:**
- In `WhimsyContext.tsx`:
  - Rename `boringImages: boolean` to `decorativeOverlays: boolean` in `WhimsyConfig` interface
  - Flip values in `WHIMSY_LEVELS`: stop 0 → `decorativeOverlays: false`, stops 1–2 → `decorativeOverlays: true`
- In `Hero.tsx`:
  - Replace `config.boringImages ? 'opacity-0' : 'opacity-100'` with `config.decorativeOverlays ? 'opacity-100' : 'opacity-0'`
- In `ProjectCard.tsx`:
  - Replace `config.boringImages` gradient ternary with `config.decorativeOverlays` (flip logic)

**Verify:** TypeScript compiles with no errors. No `boringImages` references remain in codebase. Hero silhouette still visible at stops 1–2, hidden at stop 0. Card gradient colors unchanged.

**Done when:** All consumers use the positive-sense `decorativeOverlays` flag. Zero negated checks for this feature flag.

---

### Task 1: Update data model

**Files:** `src/components/projects/types.ts`, `src/data/projects.ts`

**Action:**
- Add `imageUrl?: string` to the `Project` interface
- Add `imageUrl` values to matching projects in `projects.ts`:
  - `unfamiliar` → `'/projectImages/unfamiliar.png'`
  - `singlePlayerCoOp` → `'/projectImages/singlePlayerCoOp.png'`
  - Other projects: no `imageUrl` (gradient fallback)

**Verify:** TypeScript compiles. Images accessible at their public paths in dev server.

**Done when:** `Project` interface has optional `imageUrl`, matching projects have URLs, images served from `public/`.

---

### Task 2: Replace gradient placeholder in ProjectCard with image support

**Files:** `src/components/projects/ProjectCard.tsx`

**Action:**
- Replace the gradient `<div>` with a thumbnail container (`<div>`, `relative`, `overflow-hidden`, `h-40`)
- Inside: conditional `<img>` when `project.imageUrl` is present and no error
  - `object-cover`, `w-full`, `h-full`
  - `alt={project.name}`
  - `onError` handler sets `hasImageError` state → falls back to gradient
- When no `imageUrl` or error: show gradient `<div>` (use `config.decorativeOverlays` for purple vs grey, preserving current behavior)
- Add `useState` import for `hasImageError`

**Verify:** Card renders gradient when no `imageUrl`. Card renders image when `imageUrl` is present. Broken image URL falls back to gradient (no broken icon).

**Done when:** ProjectCard shows project image or gradient fallback.

---

### Task 3: Add looking glass frame overlay to ProjectCard

**Files:** `src/components/projects/ProjectCard.tsx`

**Action:**
- Import SVG frames: `import frame1 from '@/assets/frame1.svg'` and `frame2`
- Define `FRAME_IMAGES = [frame1, frame2]`
- Accept `index` prop (added in Task 4)
- Add absolutely-positioned `<img>` overlay inside the thumbnail container:
  - `src={FRAME_IMAGES[index % FRAME_IMAGES.length]}`
  - `absolute inset-0 w-full h-full object-cover pointer-events-none`
  - `aria-hidden="true"`, `alt=""`
  - Visible when `config.decorativeOverlays` (stops 1–2), hidden via `opacity-0` when `!config.decorativeOverlays` (stop 0)
  - `transition-opacity duration-300` for smooth show/hide

**Verify:** Frame visible at stops 1–2 over thumbnail. Frame hidden at stop 0. Frame doesn't intercept clicks. Smooth transition on slider change.

**Done when:** Looking glass frames appear on card thumbnails at stops 1–2 and hide at stop 0.

---

### Task 4: Pass project index to ProjectCard

**Files:** `src/components/projects/ProjectsSection.tsx`, `src/components/projects/ProjectCard.tsx`

**Action:**
- Add `index: number` to `ProjectCardProps`
- Pass array index from each `.map()` render path in ProjectsSection (parallax, grid, reduced-motion)

**Verify:** Each card receives its correct index. No visual changes — plumbing for Task 3's frame assignment.

**Done when:** `ProjectCard` receives `index` prop in all render paths.

---

### Task 5: Replace gradient header in ProjectModal with image + frame overlay

**Files:** `src/components/projects/ProjectModal.tsx`

**Action:**
- Import SVG frames: same `frame1.svg`, `frame2.svg` + `FRAME_IMAGES` array
- Import `projects` array from `@/data/projects` to derive index: `projects.findIndex(p => p.id === project.id)`
- Replace gradient header `<div>` with a container (`relative`, `overflow-hidden`):
  - Conditional `<img>` when `project.imageUrl` present and no error:
    - `object-cover`, `w-full`, `h-32`, `rounded-t-lg`
    - `alt={project.name}`
    - `onError` → `hasImageError` state → gradient fallback
  - When no `imageUrl` or error: existing gradient `<div>`
- Add frame overlay `<img>` (same pattern as card):
  - Visible at stops 1–2 (`config.decorativeOverlays`), hidden at stop 0
  - `pointer-events-none`, `aria-hidden="true"`, opacity transition
  - `rounded-t-lg` to match container rounding
- Add `useState` import for `hasImageError`

**Verify:** Modal shows project image with frame at stops 1–2. Modal shows clean image at stop 0. Gradient fallback works. Frame and image match the card's project.

**Done when:** ProjectModal header shows project image with frame overlay, respecting whimsy stops.

---

### Task 6: Update codebase.md

**Files:** `_planning/codebase.md`

**Action:**
- Update `types.ts` description: note `imageUrl` optional field
- Update `ProjectCard.tsx` description: image support, SVG frame overlay (stops 1–2), error fallback
- Update `ProjectModal.tsx` description: image support, SVG frame overlay (stops 1–2), error fallback
- Add `public/projectImages/` to the file tree
- Add frame SVG assets (`frame1.svg`, `frame2.svg`) to assets listing
- Update Patterns section: note frame overlay behavior, image fallback, `public/` serving

**Verify:** Documentation matches actual code changes.

**Done when:** `codebase.md` accurately reflects all Phase 3 changes.

---

## File Touch Summary

| File | Tasks |
|------|-------|
| `src/components/whimsy/WhimsyContext.tsx` | 0 |
| `src/components/core/Hero.tsx` | 0 |
| `src/components/projects/types.ts` | 1 |
| `src/data/projects.ts` | 1 |
| `src/components/projects/ProjectCard.tsx` | 0, 2, 3, 4 |
| `src/components/projects/ProjectsSection.tsx` | 4 |
| `src/components/projects/ProjectModal.tsx` | 5 |
| `_planning/codebase.md` | 6 |

**Total: 8 files** (7 source + 1 doc). Task 0 adds 2 files (`WhimsyContext.tsx`, `Hero.tsx`) but both are small, targeted renames.

**Filesystem operation:** Move `src/assets/projectImages/*` → `public/projectImages/` (Task 1)

---

## Interface Contracts

### ProjectCard (modified)

```typescript
interface ProjectCardProps {
  project: Project;
  index: number; // NEW — frame variant selection via index % FRAME_IMAGES.length
  onClick?: (project: Project, rect: DOMRect) => void;
}
```

**Purpose:** Renders a project card with image (or gradient fallback) and looking glass frame overlay.

**Invariants:**
- Frame overlay visible only when `config.decorativeOverlays` (stops 1–2)
- Frame variant deterministic: `FRAME_IMAGES[index % FRAME_IMAGES.length]`
- Image error always falls back to gradient — never broken image icon
- `alt` text on project image is `project.name`
- Frame overlay always `aria-hidden="true"` and `pointer-events-none`

**Edge cases:**
- `project.imageUrl` undefined → gradient shown, frame still overlays gradient at stops 1–2
- `project.imageUrl` present but load fails → `hasImageError` flips to true, gradient shown
- `index` >= frame count → wraps via modulo (index 3 with 2 frames → frame index 1)

### ProjectModal (modified)

**Purpose:** Project detail modal with image header, frame overlay, and content.

**Invariants:**
- Frame index derived from `projects.findIndex(p => p.id === project.id)` — matches card's frame
- Frame overlay visible at stops 1–2 (`config.decorativeOverlays`), hidden at stop 0 — same logic as card
- Image error falls back to gradient header
- No `index` prop needed — derives from data

**Edge cases:**
- Project not found in array (shouldn't happen) → `findIndex` returns -1, `(-1) % 2` = -1 in JS → guard with `Math.abs()` or fallback to 0
- `project.imageUrl` undefined → gradient header, frame still overlays

### Project (modified interface)

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  imageUrl?: string;  // NEW — optional path to image in public/projectImages/
  demoUrl?: string;
  repoUrl: string;
}
```

**Purpose:** Data model for a portfolio project.

**Invariants:**
- `imageUrl` when present is a path relative to `public/` (e.g., `'/projectImages/unfamiliar.webp'`)
- `imageUrl` when absent → consumers show gradient fallback
- Adding a project with an image = add data entry + drop image file in `public/projectImages/`

---

## Deviations from Plan

### Frame overlays scrapped
SVG looking glass frame overlays (Tasks 3–5 plan sections) were attempted in multiple approaches (thumbnail overlay, full-card wrapper with object-cover, full-card wrapper with object-contain). The frame SVGs' aspect ratio (~2.5:1 landscape) was fundamentally incompatible with card dimensions (~1.2:1). After several iterations, the feature was removed entirely. Frame SVGs remain in `src/assets/` in case of future reuse with redesigned frames.

### `decorativeOverlays` reverted to `boringImages`
The positive-sense rename (Task 0) was reverted during the boring image feature work. The flag name `boringImages` better describes its actual purpose in the updated system: controlling which image variant displays (boring vs regular), not just decorative overlays.

### `boringImageUrl` added (not in original plan)
A second optional image field `boringImageUrl` was added to the Project interface. At stop 0, `boringImageUrl` is shown (falling back to grey gradient). At stops 1–2, `imageUrl` is shown (falling back to purple gradient). This replaces the frame overlay as the visual differentiator between whimsy levels.

### Modal header height increased
Changed from `h-32` (128px) to `h-64` (256px) to reduce image cropping in the modal.

### React 19 `useRef` fix
`useRef()` in WhimsySlider.tsx required an explicit initial value for React 19 compatibility. Changed to `useRef<ReturnType<typeof setTimeout>>(undefined)`.
