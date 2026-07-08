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
| Path aliases | vite-tsconfig-paths | 6.1 |

## Architecture

Component-based structure. Direct imports from source files — no barrel files.

```
src/
├── App.tsx                    # Root: WhimsyProvider wraps all, skip-link, WhimsySlider, <main>, FAB, overlay state, Escape listener
├── main.tsx                   # Entry point
├── index.css                  # Tailwind v4 @theme + global styles + @keyframes float/thumb-glow/object-glow/scroll-bounce + .whimsy-slider + .whimsy-range slider styles + .falling-object filter + .animate-scroll-bounce
├── components/
│   ├── about/
│   │   ├── AboutPanel.tsx     # Bio, skills badges, profile photo with error fallback (section for combined panel)
│   │   └── ContactPanel.tsx   # Email/GitHub/LinkedIn links (section for combined panel)
│   ├── core/
│   │   ├── CloseButton.tsx    # Shared close button (X icon, focus-visible ring)
│   │   ├── Fab.tsx            # Generic floating action button (icon, label, onClick props)
│   │   ├── Hero.tsx           # Full-viewport hero with gradient bg, ground silhouette (visible stops 1–2, hidden at stop 0), compact 30vh at stop 0 / full-screen stops 1–2, dynamic h1 title ('Portfolio' at stop 0, 'Rabbit Holes' at stops 1–2), + ParticleField
│   │   ├── ParticleField.tsx  # Decorative floating dots (hidden by prefers-reduced-motion or config.particles)
│   │   └── SlidePanel.tsx     # Reusable slide-in overlay with focus-trap-react (backdrop + animation + close)
│   ├── projects/
│   │   ├── animationConfig.ts # PARALLAX_CONFIG, SECTION_HEIGHT_VH, scroll window calculators (cards + falling objects)
│   │   ├── FallingObjects.tsx # Background silhouettes: falling mode (stop 2, scroll-linked), static mode (stop 1, random glow, vertical range capped at ~55% to avoid cave floor overlap). 6 Alice SVGs, slot-based, hidden below md
│   │   ├── ParallaxCard.tsx   # Wrapper with scroll-linked parallax transforms (PARALLAX_CONFIG), forwards onProjectClick
│   │   ├── ProjectCard.tsx    # Card with project image (or boring image at stop 0) or gradient fallback, tech badges, purple glow on hover, clickable with rect capture
│   │   ├── ProjectModal.tsx   # Dialog with grow-from-card animation, focus-trap-react, close btn, image header (h-64, or boring image at stop 0) or gradient fallback, whimsy-styled demo button (conditional on demoUrl), repo link
│   │   ├── ProjectsSection.tsx# 3 render modes: sticky parallax (Stop 2) + FallingObjects falling + scroll bounce arrow + cave floor scroll-in inside sticky container, flexbox grid+particles (Stops 0–1) + FallingObjects static + cave floor below grid (edge-to-edge), vertical stack (reduced motion); inline useScroll + useTransform
│   │   └── types.ts          # Project interface (with optional imageUrl, optional boringImageUrl)
│   └── whimsy/
│       ├── WhimsyContext.tsx  # Context + provider, 3-stop level model
│       ├── WhimsySlider.tsx   # Fixed native range input, 3 stops, safe-area-aware positioning
│       └── whimsyTypes.ts     # WhimsyLevel type, WhimsyConfig interface, WHIMSY_LEVELS constant
└── data/
    └── projects.ts            # 5 projects
└── assets/
    ├── caveFloor.svg          # Cave floor decoration (Projects section, stops 1–2)
    ├── headshot.jpeg          # Profile photo (About panel)
    ├── armchair.svg           # Potrace-traced armchair silhouette (1024×1024 viewBox) — falling object
    ├── arrow.svg              # Scroll bounce arrow (Projects section, stop 2)
    ├── book.svg               # Potrace-traced open book silhouette (1024×1024 viewBox) — falling object
    ├── card.svg               # Potrace-traced playing card silhouette (1024×1024 viewBox) — falling object
    ├── cup.svg                # Potrace-traced teacup silhouette (1024×1024 viewBox) — falling object
    ├── herosilhouette.svg     # Potrace-traced underground earth/roots/grass silhouette (2064×437 viewBox)
    ├── key.svg                # Potrace-traced skeleton key silhouette (1024×1024 viewBox) — falling object
    ├── watch.svg              # Potrace-traced pocket watch silhouette (1024×1024 viewBox) — falling object
public/
└── projectImages/            # Project thumbnail images served at root path (Vite public/)
    ├── unfamiliar.webp
    ├── unfamiliarBoring.webp
    ├── singlePlayerCoOp.webp
    ├── singlePlayerCoOpBoring.webp
    ├── foodMap.webp
    ├── foodMapBoring.webp
    ├── annotationExtractor.webp
    ├── annotationExtractorBoring.webp
    └── watch.svg
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
- **Hero stop 0 compact:** Hero shrinks to 30vh at stop 0 (boringImages); silhouette opacity-0; h1 reads "Portfolio" instead of "Rabbit Holes"
- **Projects scroll bounce arrow:** Bouncing arrow SVG at the top of the Projects parallax section (stop 2 only, inside the tall section before the sticky pin). CSS `@keyframes scroll-bounce`, suppressed by reduced-motion via CSS (parallax mode also early-returns for reduced motion)
- **Project images:** Optional `imageUrl` and `boringImageUrl` fields on Project. Served from `public/projectImages/` via Vite public/. At stop 0, boring image (or grey gradient fallback) shows. At stops 1–2, regular image (or purple gradient fallback) shows. `object-cover object-center` for responsive cropping.
- **Modal image header:** h-64 (256px) with object-cover. Same boring/regular image logic as cards.
- **Profile photo:** `headshot.jpeg` with `object-cover object-center`, circular crop. Error fallback to gradient placeholder.
- **Whimsy demo button:** Conditional `<a>` in ProjectModal (only when `project.demoUrl`). Three visual states keyed to whimsy level: stop 0 (clean, font-body, neutral), stop 1 (purple-themed, font-heading), stop 2 (ornate Victorian, gold, uppercase). `target="_blank" rel="noopener noreferrer"`.
- **Cave floor SVG:** Decorative image at bottom of Projects section. Stop 1 (grid): static below grid with edge-to-edge coverage (`-mx-4`), reduced height (`h-64`, ~50% of natural via `object-cover object-bottom`), soft top fade (`mask-image` gradient). Stop 2 (parallax): scroll-linked `useTransform([0.78, 0.95])` slides floor up from below inside sticky container, eliminating dead scroll space. Hidden at stop 0 and reduced motion. Shared CSS constants: `CAVE_FLOOR_DECORATIVE` (height/crop/accessibility), `CAVE_FLOOR_MASK` (top edge fade).
- **Grid layout:** Flexbox with `flex-wrap justify-center` for centered odd last row. Cards `w-full md:w-[calc(50%-0.75rem)]`. Heading spacing `mb-20`.

## External Integrations

- Google Fonts (loaded via CSS `@import` in index.css)
- No backend, no env vars, no API calls
