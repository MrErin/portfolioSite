<!-- STATUS: COMPLETE -->

# Phase 5 Summary: Profile Photo, Demo Button & Cleanup

## At a Glance

Closes out the Visual Polish feature by replacing all remaining placeholders (profile photo, demo box) with real content, adding cave floor decoration to the Projects section, polishing the hero and grid layout at all stops, and removing dead code.

### Files Changed

- `src/components/about/AboutPanel.tsx` — replaced gradient placeholder with real headshot; `useState` error fallback to gradient
- `src/components/about/ContactPanel.tsx` — (out-of-plan addition) email reveal anti-scraping pattern; real GitHub/LinkedIn URLs
- `src/components/core/Hero.tsx` — dynamic height (30vh at stop 0, full-screen stops 1–2); dynamic h1 title; removed old subheading + gradient divider
- `src/components/projects/ProjectModal.tsx` — whimsy-styled conditional demo button (`DEMO_BASE` + `DEMO_STYLES` constants); removes demo placeholder div and duplicate Live Demo link
- `src/components/projects/ProjectsSection.tsx` — cave floor SVG (stop 1: static below grid; stop 2: static sibling after section); scroll bounce arrow at top of parallax section; flexbox centered grid; `mb-20` heading spacing
- `src/components/projects/animationConfig.ts` — removed unused `getObjectOpacityRange` export
- `src/App.tsx` — (out-of-plan) FAB repositioned to `md:bottom-32` on desktop to avoid cave floor overlap
- `src/data/projects.ts` — (out-of-plan) added `demoUrl` for Chattanooga Pride Food Map
- `src/index.css` — added `@keyframes scroll-bounce` and `.animate-scroll-bounce` utility; reduced-motion suppression in existing block
- `_planning/codebase.md` — updated (see Review Findings: two inaccuracies remain)

### Key Functions Added/Modified

- `AboutPanel` — renders `<img>` from `headshotUrl`; falls back to gradient div on error via `hasImageError` state
- `ProjectModal` — `DEMO_STYLES: Record<number, string>` keyed to `level` from `useWhimsy()`; demo button conditional on `project.demoUrl`
- `ProjectsSection` (grid mode) — cave floor rendered after grid when `!config.boringImages`; flexbox cards with `justify-center`
- `ProjectsSection` (parallax mode) — arrow `<img>` with `.animate-scroll-bounce` at top of tall section; cave floor as sibling `<div>` after `<section>`
- `ContactPanel.revealEmail` — sets `mailto` state on first click, converting button to `<a>` link

### Behavior Changes

- Profile photo now shows real headshot in the About panel; falls back to gradient if image fails to load
- Project modal shows a styled "View Website" link (not button) for projects with `demoUrl`; link style changes at each whimsy stop
- Chattanooga Pride Food Map now shows the "View Website" button (demoUrl added)
- Cave floor SVG appears below project grid at stop 1, and naturally after the parallax section ends at stop 2
- Hero collapses to 30vh at stop 0 ("boring"), full-screen at stops 1–2; h1 reads "Portfolio" at stop 0, "Rabbit Holes" at stops 1–2
- Scrolling down from hero at stop 2 now shows a bouncing arrow at the top of the Projects parallax section
- Odd final row of project grid is centered on medium+ screens
- Email address in Contact panel is hidden until clicked (anti-scraping)
- FAB ("email" button) sits higher on desktop (`md:bottom-32`) to avoid overlapping cave floor

---

## What Was Built

### Profile photo (Task 1)
`AboutPanel.tsx` imports `headshotUrl` as a module URL and renders it via `<img>` with `object-cover object-center rounded-full`. A `useState(false)` error flag, set by `onError`, switches back to the gradient placeholder `<div>` if the image fails. This mirrors the Phase 3 pattern used for project images.

### Whimsy demo button (Task 2)
`ProjectModal.tsx` gained two constants: `DEMO_BASE` (shared layout classes) and `DEMO_STYLES` (a `Record<number, string>` object keyed 0/1/2). The demo button is an `<a>` tag rendered only when `project.demoUrl` is set. It reads the current `level` from `useWhimsy()` and composes `DEMO_BASE + DEMO_STYLES[level]`. The three looks: neutral clean (stop 0), purple-themed (stop 1), ornate gold uppercase (stop 2).

### Cave floor (Task 3, modified)
The plan called for scroll-linked opacity inside the sticky container at stop 2. The build instead places the cave floor as a sibling `<div>` after the `<section>` element — it appears naturally in document flow once the sticky section scrolls past. This is simpler and sidesteps `useTransform` complexity. At stop 1 (grid mode), it renders as a static `<img>` below the grid, hidden at stop 0.

### Grid layout (Task 4)
Grid container changed from `grid grid-cols-1 md:grid-cols-2 gap-6` to `flex flex-wrap justify-center gap-6`. Cards wrapped in `<div className="w-full md:w-[calc(50%-0.75rem)]">`. Heading `mb-12` → `mb-20` in both grid and reduced-motion modes.

### Hero additions (Task 5, modified)
The plan called for an `<hr>` divider at stop 0 and a `FaChevronDown` arrow in Hero at stop 2. The build took a different approach:
- **Stop 0 divider:** Instead of an `<hr>`, the hero shrinks to 30vh (via dynamic `min-h-*`) and the old subheading ("Falling down the rabbit hole...") plus gradient divider were removed. The compressed section creates the same visual separation with less clutter.
- **Stop 2 arrow:** Placed at the top of `ProjectsSection`'s tall parallax `<section>` — not in Hero. Uses `arrow.svg` with `filter: invert(1)` and `.animate-scroll-bounce`. This positions it exactly where the user needs to start scrolling, making its purpose unambiguous.

### Cleanup (Task 6)
Removed `getObjectOpacityRange` from `animationConfig.ts`. Updated `codebase.md`.

### Out-of-plan additions
- **ContactPanel email reveal:** Button initially shows "Electromografied Mail"; on click sets `mailto` state, re-renders as a real `<a href="mailto:...">` link. Keeps email address out of the page source until interaction.
- **Real social links:** GitHub and LinkedIn URLs updated from placeholder values.
- **Food Map demoUrl:** Added to `projects.ts`.
- **FAB position:** `md:bottom-32` prevents overlap with cave floor on desktop.

---

## Key Decisions

1. **Cave floor at stop 2: static after section, not scroll-linked.** Simpler, no `useTransform` needed. The natural document flow means it appears at the right moment anyway. Deferred item #4 already tracks the blank scroll space before it becomes visible.

2. **Scroll arrow in ProjectsSection, not Hero.** Where it is matters more than the plan spec. At the top of the tall parallax section, it's immediately above the first card — the clearest possible signal. In Hero it would have been separated from the scrollable content.

3. **Stop 0 Hero: shrink + title change instead of hr divider.** The old subheading and gradient divider were removed as part of the same visual sweep. A shrunk hero with a clean "Portfolio" heading communicates professionalism as well as an hr, without adding new DOM elements.

4. **Email reveal pattern.** Splits the email constants into `EMAIL_USER` and `EMAIL_DOMAIN`, assembled only on first click. Client-side only, so not foolproof against determined scrapers, but eliminates casual harvesting.

---

## Major Logic Flows In This Phase

### Demo button (stop-dependent styling)
`ProjectModal` reads `level` from `useWhimsy()` → looks up `DEMO_STYLES[level]` → composes with `DEMO_BASE` → renders as `<a>` when `project.demoUrl` is truthy. The `?? DEMO_STYLES[0]` fallback guards against future level values outside 0–2.

### Cave floor visibility
- **Stop 2 (parallax):** `ProjectsSection` returns a `<>` fragment. First child is the tall `<section>` (800vh). Second child is a `<div>` with the cave floor image — always visible (document flow, no conditional).
- **Stop 1 (grid):** Cave floor `<img>` rendered inside the grid-mode `<section>`, after the card container, only when `!config.boringImages`.
- **Stop 0 and reduced motion:** Not rendered (grid mode checks `!config.boringImages`; reduced motion returns early before either branch).

### Hero height logic
`min-h-[30vh]` when `config.boringImages` (stop 0), `min-h-screen` otherwise. Hero silhouette opacity also swaps: `opacity-0` at stop 0, `opacity-100` at stops 1–2.

---

## Connection to Previous Phases

- **Phase 3 pattern reused:** `<img>` with `onError` fallback to gradient placeholder — used verbatim for profile photo in AboutPanel.
- **Phase 3 boring/regular image logic extended:** Modal demo button uses the same `config.boringImages` / `level` reads already present in the file.
- **Phase 4 `.animate-scroll-bounce`:** The CSS class added in Phase 4 (or in this phase — `scroll-bounce` keyframes are in `index.css`) drives the arrow. The reduced-motion override added in Phase 4's `@media` block already covers it.
- **Deferred item #4 context:** The cave floor blank-scroll-space issue logged in deferred.md predates this phase — Phase 5's cave floor placement (as a sibling after the section) was designed around that known tradeoff.
