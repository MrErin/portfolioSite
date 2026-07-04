<!-- STATUS: REVIEW -->

# Phase 5: Profile Photo, Demo Button & Cleanup

## Goal

Replace remaining placeholders (profile photo, demo box), add cave floor SVG, hero section stop-dependent elements (divider at stop 0, scroll arrow at stop 2), polish grid layout, and do a final consistency pass to close out the Visual Polish feature.

## Dependencies

- Phase 3 (project images) — image loading pattern with `object-cover`, error fallback, boring/regular switching
- Phase 4 (falling objects) — scroll-linked animation pattern in sticky container, `animationConfig.ts` math
- `src/assets/headshot.jpeg` — profile photo asset (untracked, in repo)
- `src/assets/caveFloor.svg` — cave floor asset (untracked, in repo)

## Research Notes

### Profile Photo

- `src/assets/headshot.jpeg` exists in the repo
- Current placeholder in `AboutPanel.tsx`: gradient div with `role="img"`, `w-32 h-32 rounded-full`
- Pattern from Phase 3: import URL, `<img>` with `object-cover object-center`, `onError` fallback to gradient
- Import as module: `import headshotUrl from '@/assets/headshot.jpeg'`

### Demo Button

- Current `ProjectModal.tsx`:
  - Lines 112-114: "Demo placeholder" div — **always rendered** regardless of `demoUrl`
  - Lines 127-137: Conditional "Live Demo" `<a>` link — duplicates the new button's purpose
- New button replaces both. Conditional on `project.demoUrl`. Absent = cleaner modal layout.
- Whimsy-styled via `level` from `useWhimsy()` (already available in modal):
  - **Stop 0:** Clean — `font-body`, neutral border/surface, no glow
  - **Stop 1:** Purple-themed — `font-heading`, purple border, subtle glow
  - **Stop 2:** Ornate Victorian — `font-heading`, gold text/border, uppercase, letter-spacing, gold glow
- `<a>` tag (external link), not `<button>` — same pattern as existing links

### Cave Floor SVG

- `src/assets/caveFloor.svg` exists (untracked). Import as module URL.
- **Stop 2 (parallax):** Inside the sticky container, positioned at bottom. Scroll-linked opacity via `useTransform` — fade in after last card exits. Last card (index 4 of 5) exits at scrollYProgress ~0.88 (WINDOW_RATIO=0.5, rangeEnd~0.881). Cave floor fades in ~0.85→0.93 so it's fully visible by end of scroll.
- **Stop 1 (grid):** Rendered below the grid at the bottom of the section. Static, no scroll animation. Must not cut off any grid items — natural document flow with spacing.
- **Stop 0:** Hidden.
- **Reduced motion:** Hidden (decorative element).
- Decorative: `aria-hidden="true"`, `pointer-events-none`, same pattern as hero silhouette.

### Hero Additions

- **Stop 0 divider:** A styled `<hr>` at the bottom of Hero, visible only at stop 0. CSS-styled — clean, professional, not ornate. Think subtle gradient line or bordered separator. Positioned where the hero silhouette would be on other stops.
- **Stop 2 scroll arrow:** Ornate downward chevron with gentle bounce animation, positioned above the hero silhouette. Scrolls off with content (not fixed). Only at stop 2. Gold-colored to match Victorian aesthetic. CSS `@keyframes` bounce. Use `FaChevronDown` from react-icons or a styled Unicode arrow.

### Grid Layout (Stops 0 & 1)

- Current grid: `grid grid-cols-1 md:grid-cols-2 gap-6` — 5 projects. On md+: 2+2+1, last card left-aligned.
- Fix: Switch to flexbox with `flex-wrap justify-center` and fixed card widths, or use CSS grid with auto-fit centering. Flexbox is simpler for centering an odd last row.
- Heading spacing: currently `mb-12`, increase to `mb-20`.

### Cleanup

- `getObjectOpacityRange` in `animationConfig.ts:127` — exported but never imported anywhere. Remove.
- Update `codebase.md` with all changes.

## Tasks

### Task 1: Profile photo in AboutPanel `DONE`

**Files:** `src/components/about/AboutPanel.tsx`
**Action:**
- Import `headshotUrl` from `@/assets/headshot.jpeg`
- Add `useState` for image error fallback
- Replace the gradient placeholder `<div>` with an `<img>` element
- Keep `w-32 h-32 rounded-full mx-auto mb-6 border-2 border-border`
- Add `object-cover object-center`
- Set `alt` to a meaningful description
- `onError` handler falls back to the gradient div
**Verify:** Image renders as circular crop. Break the import path temporarily to confirm gradient fallback.
**Done when:** Profile photo shows in About panel with working error fallback.

### Task 2: Whimsy-styled demo button in ProjectModal `DONE`

**Files:** `src/components/projects/ProjectModal.tsx`
**Action:**
- Destructure `level` from `useWhimsy()` alongside `config`
- Remove the "Demo placeholder" div (lines 112-114)
- Remove the "Live Demo" `<a>` link from the links area (lines 127-137)
- In the placeholder's former location, add a conditional `{project.demoUrl && ...}` block with a whimsy-styled `<a>`:
  - All stops: `inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded transition-all duration-300`, `target="_blank" rel="noopener noreferrer"`, `FaExternalLinkAlt` icon
  - Stop 0: `font-body text-text-primary bg-surface border border-border hover:border-text-muted`
  - Stop 1: `font-heading text-purple-light bg-surface-dim border border-purple-dark hover:shadow-glow-purple`
  - Stop 2: `font-heading text-gold bg-surface-dim border border-gold-dark uppercase tracking-wider hover:shadow-[0_0_12px_rgba(201,168,76,0.4)]`
- Add `focus-visible:ring-2 focus-visible:ring-focus-ring`
**Verify:** Button appears for Unfamiliar and Red Queen Dashboard. Absent for others. Style changes per stop.
**Done when:** Demo placeholder gone, whimsy button renders conditionally with three distinct visual states.

### Task 3: Cave floor SVG in ProjectsSection `DONE`

**Files:** `src/components/projects/ProjectsSection.tsx`
**Action:**
- Import `caveFloorUrl` from `@/assets/caveFloor.svg`
- **Stop 2 (parallax mode):** Inside the sticky container, add an `<img>` for the cave floor positioned at the bottom (`absolute bottom-0 left-0 w-full h-auto`). Use `useTransform` on `scrollYProgress` to control opacity: fade in from 0→1 over the range ~[0.85, 0.93]. Add `aria-hidden="true"`, `pointer-events-none`, `select-none`.
- **Stop 1 (grid mode):** After the grid div, render the cave floor `<img>` with `w-full h-auto mt-12` (or appropriate spacing). Same decorative attributes.
- **Stop 0 and reduced motion:** Do not render the cave floor.
**Verify:** At stop 2, cave floor fades in after the last card exits. At stop 1, cave floor sits below the grid. At stop 0, not visible.
**Done when:** Cave floor renders correctly at stops 1 and 2 with appropriate positioning and hiding.

### Task 4: Grid layout tweaks (stops 0 & 1) `DONE`

**Files:** `src/components/projects/ProjectsSection.tsx`
**Action:**
- In the grid mode (`!config.parallax`) and reduced motion mode: change the card container from `grid grid-cols-1 md:grid-cols-2 gap-6` to a flexbox layout that centers the last row. Use `flex flex-wrap justify-center gap-6` with cards sized to `w-full md:w-[calc(50%-0.75rem)]` (half width minus half gap).
- Change `mb-12` on the "Projects" heading to `mb-20` in both grid mode and reduced motion mode.
**Verify:** With 5 projects, the 5th card centers below the 2x2 grid on md+ screens. Mobile still stacks full-width. Heading has more space above the grid.
**Done when:** Odd final row is centered, heading spacing increased.

### Task 5: Hero section additions (stop 0 divider + stop 2 arrow) `DONE`

**Files:** `src/components/core/Hero.tsx`, `src/index.css`
**Action:**
- **Stop 0 divider:** Add an `<hr>` element at the bottom of the hero section, visible only when `config.boringImages` is true (stop 0). Style it with CSS — a subtle horizontal line, possibly a gradient fade from transparent edges to a muted center color (`text-dim` or `border`). Use `absolute bottom-8 left-1/2 -translate-x-1/2 w-1/3` or similar for centered positioning. Add `aria-hidden="true"`.
- **Stop 2 scroll arrow:** Add a downward-pointing chevron/arrow, visible only at stop 2 (when `config.parallax` is true). Position it above the hero silhouette (`absolute bottom-16` or similar, above the silhouette's position). Gold-colored (`text-gold`), with a gentle CSS bounce animation. Use `FaChevronDown` from react-icons, sized appropriately (text-2xl or similar). Add bounce `@keyframes` in `index.css` with `prefers-reduced-motion: reduce` override. `aria-hidden="true"` (decorative).
**Verify:** Stop 0 shows a clean divider line, no hero silhouette. Stop 2 shows bouncing gold arrow above the silhouette. Stop 1 shows neither (silhouette is the visual anchor). Reduced motion disables bounce.
**Done when:** Both elements render at their correct stops, divider looks professional, arrow bounces gently.

### Task 6: Cleanup & final consistency `DONE`

**Files:** `src/components/projects/animationConfig.ts`, `_planning/codebase.md`
**Action:**
- Remove the unused `getObjectOpacityRange` export from `animationConfig.ts` (lines 126-130)
- Update `_planning/codebase.md` to reflect all Phase 5 changes:
  - AboutPanel: real profile photo with error fallback
  - ProjectModal: whimsy-styled demo button replaces placeholder + duplicate link
  - ProjectsSection: cave floor SVG (stop 1 static, stop 2 scroll-linked), centered grid, increased heading spacing
  - Hero: stop 0 divider, stop 2 scroll arrow
  - animationConfig: removed unused `getObjectOpacityRange`
- Final visual scan across all stops for consistency
**Verify:** No unused exports in animationConfig. Codebase.md is accurate. No visual regressions.
**Done when:** Dead code removed, documentation current, visual polish complete.

## Security Checklist

- [N/A] Input validation: no user input involved
- [N/A] SQL injection prevention: no database
- [N/A] Auth protection: no authentication
- [N/A] Secrets handling: no secrets
- [N/A] Destructive actions: no destructive operations
- [N/A] Dependency review: no new dependencies

**Notes:** Phase is purely visual — images, styled links, decorative elements. All external links use `target="_blank" rel="noopener noreferrer"` (existing pattern). No new attack surface.

## Issues Discovered During Verification Stage

*None yet.*
