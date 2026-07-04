# Codebase Map

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Language | TypeScript | ~5.9 |
| Build | Vite | 7.3 |
| Styling | Tailwind CSS v4 | 4.1 |
| Animation | Framer Motion | 12.34 |
| Icons | React Icons | 5.5 |
| Linting | ESLint 9 + TypeScript ESLint | 9.39 / 8.48 |
| Formatting | Prettier | 3.8 |

## Architecture

Component-based structure. Direct imports from source files — no barrel files.

```
src/
├── App.tsx                    # Root: WhimsyProvider wraps all, skip-link, WhimsySlider, <main>, FAB, overlay state, Escape listener
├── main.tsx                   # Entry point
├── index.css                  # Tailwind v4 @theme + global styles + @keyframes float/thumb-glow/object-glow + .whimsy-slider + .whimsy-range slider styles + .falling-object filter
├── components/
│   ├── about/
│   │   ├── AboutPanel.tsx     # Bio, skills badges, photo placeholder (section for combined panel)
│   │   └── ContactPanel.tsx   # Email/GitHub/LinkedIn links (section for combined panel)
│   ├── core/
│   │   ├── CloseButton.tsx    # Shared close button (X icon, focus-visible ring)
│   │   ├── Fab.tsx            # Generic floating action button (icon, label, onClick props)
│   │   ├── Hero.tsx           # Full-viewport hero with gradient bg, ground silhouette (visible stops 1–2, hidden at stop 0), + ParticleField
│   │   ├── ParticleField.tsx  # Decorative floating dots (hidden by prefers-reduced-motion or config.particles)
│   │   └── SlidePanel.tsx     # Reusable slide-in overlay with focus-trap-react (backdrop + animation + close)
│   ├── projects/
│   │   ├── animationConfig.ts # PARALLAX_CONFIG, SECTION_HEIGHT_VH, scroll window calculators (cards + falling objects)
│   │   ├── FallingObjects.tsx # Background silhouettes: falling mode (stop 2, scroll-linked), static mode (stop 1, random glow). 6 Alice SVGs, slot-based, hidden below md
│   │   ├── ParallaxCard.tsx   # Wrapper with scroll-linked parallax transforms (PARALLAX_CONFIG), forwards onProjectClick
│   │   ├── ProjectCard.tsx    # Card with project image (or boring image at stop 0) or gradient fallback, tech badges, purple glow on hover, clickable with rect capture
│   │   ├── ProjectModal.tsx   # Dialog with grow-from-card animation, focus-trap-react, close btn, image header (h-64, or boring image at stop 0) or gradient fallback, links, demo placeholder
│   │   ├── ProjectsSection.tsx# 3 render modes: sticky parallax (Stop 2) + FallingObjects falling, grid+particles (Stops 0–1) + FallingObjects static, vertical stack (reduced motion); inline useScroll
│   │   └── types.ts          # Project interface (with optional imageUrl, optional boringImageUrl)
│   └── whimsy/
│       ├── WhimsyContext.tsx  # Context + provider, 3-stop level model (WhimsyLevel → WhimsyConfig flags)
│       └── WhimsySlider.tsx   # Fixed native range input, 3 stops, safe-area-aware positioning
└── data/
    └── projects.ts            # 5 mock projects (themed names)
└── assets/
    ├── armchair.svg           # Potrace-traced armchair silhouette (1024×1024 viewBox) — falling object
    ├── book.svg               # Potrace-traced open book silhouette (1024×1024 viewBox) — falling object
    ├── card.svg               # Potrace-traced playing card silhouette (1024×1024 viewBox) — falling object
    ├── cup.svg                # Potrace-traced teacup silhouette (1024×1024 viewBox) — falling object
    ├── herosilhouette.svg     # Potrace-traced underground earth/roots/grass silhouette (2064×437 viewBox)
    ├── key.svg                # Potrace-traced skeleton key silhouette (1024×1024 viewBox) — falling object
    ├── watch.svg              # Potrace-traced pocket watch silhouette (1024×1024 viewBox) — falling object
    ├── frame1.svg             # (Unused) Victorian looking glass frame — scrapped, kept in case of future reuse
    └── frame2.svg             # (Unused) Victorian looking glass frame — scrapped, kept in case of future reuse
public/
└── projectImages/            # Project thumbnail images served at root path (Vite public/)
    ├── unfamiliar.webp
    ├── unfamiliarBoring.webp
    ├── singlePlayerCoOp.webp
    ├── foodMap.webp
    └── annotationExtractor.webp
```

## Tailwind Theme

CSS-first config via `@theme` block in `src/index.css`. Key tokens:

- **Fonts:** `--font-display` (Cinzel Decorative), `--font-heading` (Cinzel), `--font-body` (Raleway)
- **Backgrounds:** 6-step dark progression: abyss → void → deep → hollow → shade → dusk
- **Colors:** Purple range (primary), blue range, red/gold/teal accents
- **Surfaces:** rgba-based surface-dim/surface/surface-bright, border
- **Text:** primary/secondary/muted/dim hierarchy
- **Semantic:** focus-ring, link, link-hover, shadow-glow-purple

## Patterns

- Arrow function components with explicit prop interfaces
- Semantic HTML (`<section>`, `<article>`, `<nav>`, `<dialog>`)
- ARIA labels on all interactive elements and landmarks
- Skip-link for keyboard navigation
- Direct imports from source files — no barrel files, no features/ directory
- **Whimsy system:** 3-stop model (`WHIMSY_LEVELS`) with feature flags (`parallax`, `particles`, `growFromCard`, `boringImages`), defaults to max whimsy (Stop 2) on every load, no persistence
- **Parallax animation (Stop 2 only):** Diagonal Drift hardcoded (PARALLAX_CONFIG), disabled at Stops 0–1
- Scroll-linked animations via Framer Motion's `useScroll` + `useTransform`
- Sticky viewport pattern: tall section (SECTION_HEIGHT_VH, currently 800vh) with pinned inner container (100vh)
- Per-card scroll windows restricted to the sticky-pinned range (progress ~0.20→0.80), with WINDOW_RATIO and INNER_PAD_RATIO controls
- **Per-object scroll windows:** Same math as cards but with OBJECT_WINDOW_RATIO (0.18 vs 0.30), so objects cycle faster — ~3–5 visible at any scroll position
- **Two-track parallax (Stop 2):** Cards (foreground, one at a time) + falling objects (background, continuous stream) share the same scrollYProgress but use different scroll windows
- **Falling objects (Stops 1–2):** 6 Alice-themed SVG silhouettes (armchair, book, card, cup, key, watch) as background decoration. CSS filter colorizes black silhouettes to muted purple/blue. Falling mode (stop 2): scroll-linked parallax drift behind cards. Static mode (stop 1): fixed positions with random sequential glow (one object at a time). Hidden at stop 0, reduced motion, and below md breakpoint. Slot-based architecture with stable random configs in useRef.
- Overlay state managed in App.tsx (selectedProject, cardOrigin, panelOpen boolean)
- **Focus trapping:** focus-trap-react component wrapping ProjectModal and SlidePanel (escapeDeactivates: false, allowOutsideClick: true)
- Grow-from-card modal animation (Stops 1–2 only): captures card center on click, animates from that position
- Slide-in panel: SlidePanel component with backdrop, slide animation, focus trap, and click-outside
- Escape key listener in App.tsx: prioritizes modal close, then panel
- Single email FAB opens combined About & Contact panel with visual divider
- Interactive cards: role="button", tabIndex=0, Enter/Space keyboard handlers
- **Purple glow hover:** shadow-glow-purple on cards, FAB, and modal links
- **Responsive:** Mobile-first with Tailwind breakpoints (sm, md, lg)
- **Particles (Stops 1–2):** CSS float animation in Hero and ProjectsSection, 60 particles per instance, disabled by prefers-reduced-motion or config.particles
- **Hero ground silhouette (Stops 1–2):** SVG silhouette at the bottom of the hero viewport, hidden at stop 0 (boringImages true), decorative-only (aria-hidden, pointer-events-none)
- **Project images:** Optional `imageUrl` and `boringImageUrl` fields on Project. Served from `public/projectImages/` via Vite public/. At stop 0, boring image (or grey gradient fallback) shows. At stops 1–2, regular image (or purple gradient fallback) shows. `object-cover object-center` for responsive cropping.
- **Modal image header:** h-64 (256px) with object-cover. Same boring/regular image logic as cards.

## External Integrations

- Google Fonts (loaded via CSS `@import` in index.css)
- No backend, no env vars, no API calls
