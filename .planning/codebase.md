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

Feature-based structure with barrel exports.

```
src/
├── App.tsx                    # Root: skip-link, <main>, FAB, overlay state (selectedProject, cardOrigin, panelOpen), Escape listener
├── main.tsx                   # Entry point
├── index.css                  # Tailwind v4 @theme + global styles + @keyframes float
├── components/
│   ├── Fab.tsx                # Floating action button (email icon, opens combined panel)
│   ├── SlidePanel.tsx         # Reusable slide-in overlay with focus trap (backdrop + animation + close)
│   ├── ParticleField.tsx      # Decorative floating dots (respects prefers-reduced-motion)
│   └── index.ts
├── features/
│   ├── hero/
│   │   ├── Hero.tsx           # Full-viewport hero with gradient bg + ParticleField
│   │   └── index.ts
│   ├── projects/
│   │   ├── ProjectCard.tsx    # Card with gradient placeholder + tech badges, purple glow on hover, clickable with rect capture
│   │   ├── ParallaxCard.tsx   # Wrapper with scroll-linked parallax transforms (PARALLAX_CONFIG), forwards onProjectClick
│   │   ├── ProjectModal.tsx   # Dialog with grow-from-card animation, focus trap, close btn, links, demo placeholder
│   │   ├── ProjectsSection.tsx# Sticky viewport pattern (SECTION_HEIGHT_VH + pinned 100vh), forwards onProjectClick
│   │   └── index.ts
│   ├── about/
│   │   ├── AboutPanel.tsx     # Bio, skills badges, photo placeholder (section for combined panel)
│   │   └── index.ts
│   └── contact/
│       ├── ContactPanel.tsx   # Email/GitHub/LinkedIn links (section for combined panel)
│       └── index.ts
├── hooks/
│   ├── useReducedMotion.ts    # Reactive prefers-reduced-motion listener
│   ├── useScrollProgress.ts   # Framer Motion useScroll wrapper
│   ├── useFocusTrap.ts        # Focus trap for overlays (save/restore focus, Tab cycle)
│   └── index.ts
├── types/
│   ├── project.ts             # Project interface
│   └── index.ts
└── data/
    ├── animationConfig.ts     # PARALLAX_CONFIG, SECTION_HEIGHT_VH, sticky-range-aware scroll window calculators
    └── projects.ts            # 4 mock projects (themed names)
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
- Barrel exports from feature directories (`index.ts`)
- **Single animation mode:** Diagonal Drift hardcoded (PARALLAX_CONFIG)
- Scroll-linked animations via Framer Motion's `useScroll` + `useTransform`
- Sticky viewport pattern: tall section (SECTION_HEIGHT_VH, currently 400vh) with pinned inner container (100vh)
- Per-card scroll windows restricted to the sticky-pinned range (progress ~0.20→0.80), with WINDOW_RATIO and INNER_PAD_RATIO controls
- Overlay state managed in App.tsx (selectedProject, cardOrigin, panelOpen boolean)
- **Focus trapping:** useFocusTrap hook on ProjectModal and SlidePanel
- Grow-from-card modal animation: captures card center on click, animates from that position
- Slide-in panel: SlidePanel component with backdrop, slide animation, focus trap, and click-outside
- Escape key listener in App.tsx: prioritizes modal close, then panel
- Single email FAB opens combined About & Contact panel with visual divider
- Interactive cards: role="button", tabIndex=0, Enter/Space keyboard handlers
- **Purple glow hover:** shadow-glow-purple on cards, FAB, and modal links
- **Responsive:** Mobile-first with Tailwind breakpoints (sm, md, lg)
- **Particles:** CSS float animation in Hero and ProjectsSection, 60 particles per instance, disabled with prefers-reduced-motion

## External Integrations

- Google Fonts (loaded via CSS `@import` in index.css)
- No backend, no env vars, no API calls
