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
├── App.tsx                    # Root: skip-link, <main>, AnimationToggle, FABs
├── main.tsx                   # Entry point
├── index.css                  # Tailwind v4 @theme + global styles
├── components/
│   ├── AnimationToggle.tsx    # Dev toggle for animation modes (A key + button)
│   ├── Fab.tsx                # Floating action button (generic)
│   └── index.ts
├── context/
│   └── AnimationModeContext.tsx # Context for current animation mode state
├── features/
│   ├── hero/
│   │   ├── Hero.tsx           # Full-viewport hero with gradient bg
│   │   └── index.ts
│   ├── projects/
│   │   ├── ProjectCard.tsx    # Card with gradient placeholder + tech badges
│   │   ├── ParallaxCard.tsx   # Wrapper with scroll-linked parallax transforms
│   │   ├── ProjectModal.tsx   # Dialog with close btn, links, demo placeholder
│   │   ├── ProjectsSection.tsx# Sticky viewport pattern (300vh + pinned 100vh)
│   │   └── index.ts
│   ├── about/
│   │   ├── AboutPanel.tsx     # Bio, skills badges, photo placeholder
│   │   └── index.ts
│   └── contact/
│       ├── ContactPanel.tsx   # Email/GitHub/LinkedIn links
│       └── index.ts
├── hooks/
│   ├── useScrollProgress.ts   # Framer Motion useScroll wrapper
│   └── index.ts
├── types/
│   ├── project.ts             # Project interface
│   └── index.ts
└── data/
    ├── animationConfig.ts     # Parallax configs, scroll window calculators
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
- Semantic HTML (`<section>`, `<article>`, `<aside>`, `<nav>`)
- ARIA labels on all interactive elements and landmarks
- Skip-link for keyboard navigation
- Barrel exports from feature directories (`index.ts`)
- Animation mode state managed via React Context (`AnimationModeContext`)
- Scroll-linked animations via Framer Motion's `useScroll` + `useTransform`
- Sticky viewport pattern: tall section (300vh) with pinned inner container (100vh)
- Per-card scroll windows for staggered entry/exit timing
- FABs rendered in `App.tsx`, not wired to any handlers yet
- ProjectModal exists structurally but is not rendered anywhere yet

## External Integrations

- Google Fonts (loaded via CSS `@import` in index.css)
- No backend, no env vars, no API calls
