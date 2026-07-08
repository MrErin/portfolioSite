# Visual Polish & Images — Permanent Requirements

## Whimsy Slider Visual States

- Slider has three distinct visual states driven by `data-whimsy` attribute: minimal (stop 0), toned-down (stop 1), ornate Victorian (stop 2)
- Slider polarity: left (0) = minimal, right (2) = max whimsy
- Pure CSS styling on vendor-specific slider pseudo-elements (gradients, box-shadows, borders)
- All slider states pass WCAG contrast requirements
- `prefers-reduced-motion` disables all slider animations and transitions
- Slider auto-collapses after 3s idle, re-collapses 2s after interaction, keyboard focus re-expands

## Image System

- Project interface has `imageUrl?: string` and `boringImageUrl?: string` optional fields
- At stop 0: ProjectCard and ProjectModal show `boringImageUrl` (or grey gradient fallback)
- At stops 1–2: show `imageUrl` (or purple gradient fallback)
- Broken images silently fall back to stop-appropriate gradient via `onError` state
- Modal header is h-64 (256px) for image display
- Profile photo in AboutPanel uses `<img>` with error fallback to gradient placeholder
- `boringImages` config flag drives image variant selection (not frame overlay visibility)

## Hero Section

- Hero has dynamic height: 30vh at stop 0, full-screen at stops 1–2
- Hero h1 reads "Portfolio" at stop 0, "Rabbit Holes" at stops 1–2
- Ground silhouette SVG at hero bottom: visible stops 1–2, hidden (opacity-0) at stop 0 with 300ms transition
- Hero has `overflow-hidden` to contain silhouette edges

## Cave Floor

- Cave floor SVG renders at stops 1 and 2, hidden at stop 0 and reduced motion
- Stop 1 (grid): static image below card grid, edge-to-edge via `-mx-4`, h-64 with `object-cover object-bottom`
- Stop 2 (parallax): inside sticky container with `useTransform([0.78, 0.95])` scroll-linked translateY reveal
- Both stops use shared CSS constants for height, crop, and `mask-image` top-edge fade
- Cave floor is `aria-hidden`, `pointer-events-none`, `select-none`, `draggable="false"`

## Falling Objects

- 6 Alice-themed SVG silhouettes (armchair, book, card, cup, key, watch) as background decoration
- Stop 2 (parallax): 24 slots with scroll-linked positioning behind cards, colorized via CSS filter
- Stop 1 (grid): 6 fixed slots with sequential glow animation (~3.5s interval)
- Stop 0, reduced motion, below md breakpoint: hidden entirely
- Static mode vertical range capped at 55% to avoid cave floor overlap
- Scroll window ratio: 0.18 (objects cycle faster than cards at 0.50)

## Demo Button & Contact

- Project modal shows "View Website" link only when `demoUrl` is present
- Link styling changes per whimsy stop (clean at 0, purple at 1, ornate gold at 2)
- Contact panel email is hidden until clicked (anti-scraping split-constant pattern)

## Project Grid Layout

- Grid uses flexbox (`flex flex-wrap justify-center`) for centered odd last row on medium+ screens
- Card width: `w-full md:w-[calc(50%-0.75rem)]`
- Heading spacing: `mb-20` above card container

## Scroll Arrow

- Bouncing scroll arrow at top of Projects parallax section (stop 2 only)
- Uses `arrow.svg` with `filter: invert(1)` and `.animate-scroll-bounce` CSS class
- Respects reduced motion

## Out of Scope (Permanent Exclusions)

- No SVG looking-glass frame overlays on project thumbnails (aspect ratio incompatibility confirmed)
- No image optimization pipeline (lazy loading, srcset, WebP conversion)
- No animation on frame overlays (static only — and frames are not implemented)
- No persistent whimsy preference (resets to max on load)
- No font or color palette changes based on whimsy level
