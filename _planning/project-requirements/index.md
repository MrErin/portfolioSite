# Project Requirements Index

## Core (→ core.md)
- Feature-based directory structure with barrel exports per feature
- Tailwind v4 CSS-first theme config, Framer Motion for animations, focus-trap-react for a11y
- No backend, no animation toggle, single combined panel; real images with gradient fallbacks
- All animations respect prefers-reduced-motion, all elements keyboard-accessible

## MVP — Portfolio Site (→ mvp.md)
- Dark gothic "falling down the rabbit hole" theme with purple/gold/teal palette
- Sticky viewport parallax with per-card scroll windows and diagonal drift
- Card click → grow-from-card modal, single email FAB → combined About/Contact panel
- Skip-link, ARIA labels, focus trapping, semantic HTML, reduced-motion fallback
- CSS particle effects in Hero and Projects section
- Responsive: mobile-first (375px), cards alternate left/right on desktop
- 4 Alice-themed mock projects with TypeScript Project interface

## Dewhimsifier (→ feature-dewhimsifier.md)
- Three-stop whimsy slider resets to max on every load, drives config flags via WhimsyContext
- Components branch on config flags: parallax/grid layout, particles on/off, modal animation style, thumbnail palette
- Native range input with CSS pulse animation, `prefers-reduced-motion` respected, `aria-live` stop names

## Visual Polish (→ visuals.md)
- Slider has three CSS visual states (minimal/toned/ornate), polarity left=min right=max, auto-collapses after idle
- Project images with dual URLs (boring/regular), error fallback to gradient, modal h-64 header
- Hero dynamic height (30vh/fullscreen), ground silhouette SVG, dynamic h1 title
- Cave floor SVG at stops 1–2: static below grid (stop 1), scroll-linked inside sticky (stop 2)
- 6 Alice-themed SVG falling objects behind cards: scroll-linked at stop 2, static glow at stop 1
- Demo link styled per whimsy stop, contact email hidden until clicked, flexbox centered grid
