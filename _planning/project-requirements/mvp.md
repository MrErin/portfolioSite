# MVP — Permanent Requirements

## Stack & Build

- React 19 + TypeScript 5.9 + Vite 7.3 SPA
- Tailwind CSS v4 (CSS-first `@theme` config, `@tailwindcss/vite` plugin)
- Framer Motion 12 for scroll-linked parallax and overlay animations
- React Icons 5 for icon elements
- ESLint 9 + Prettier 3 enforcement
- Google Fonts loaded via CSS `@import` (Cinzel Decorative, Cinzel, Raleway)

## Visual Identity

- Dark gothic/whimsical "falling down the rabbit hole" theme
- 6-step dark background progression: abyss → void → deep → hollow → shade → dusk
- Purple range (primary atmosphere), blue range (secondary), red/gold/teal accents
- Cinzel Decorative for display, Cinzel for headings, Raleway for body
- Gold accent for primary highlights (titles, active states)
- Surface colors: rgba-based surface-dim/surface/surface-bright, border
- Text hierarchy: primary/secondary/muted/dim
- Purple glow hover effect (`shadow-glow-purple`) on cards, FAB, modal links

## Architecture

- Component-based directory structure: `src/components/{core,projects,about,whimsy}/`, `src/data/`
- Overlay state managed in `App.tsx` (selectedProject, cardOrigin, panelOpen)
- Arrow function components with explicit prop interfaces
- Single animation config file collocated with its consumer: `components/projects/animationConfig.ts`

## Animation System

- Sticky viewport pattern: tall section (`SECTION_HEIGHT_VH`, currently 400vh) with pinned 100vh inner container
- Scroll-linked parallax via Framer Motion `useScroll` + `useTransform` — scroll position maps to card transforms, not one-shot triggers
- Single mode: Diagonal Drift (rotate ±20°, translateX ±120px, translateY 1000→-2000px, scale 0.9→1.1)
- Per-card scroll windows with staggered start points, restricted to sticky-pinned range (~0.20→0.80)
- `WINDOW_RATIO` (0.5) and `INNER_PAD_RATIO` control window sizing and padding
- Cards alternate left/right positioning on desktop, centered on mobile
- `prefers-reduced-motion` fallback: static vertical card list, no parallax, no particles
- Cards start with `initial={{ opacity: 0 }}` to prevent one-frame flash before scroll computation

## Overlay Behavior

- Card click → modal with grow-from-card spring animation (captures card center via `getBoundingClientRect()`)
- Modal exit: simple fade/scale-down (not reverse grow — card may have moved via scroll)
- Single email FAB opens combined About + Contact slide-in panel from right
- Panel uses `SlidePanel` component (backdrop + slide animation + focus trap)
- Only one overlay open at a time
- Escape key closes modal first, then panel
- Click outside closes overlay

## Accessibility

- Skip-link to `#main-content`
- All interactive elements have `aria-label` attributes
- Semantic HTML: `<section>`, `<article>`, `<nav>`
- Cards: `role="button"`, `tabIndex={0}`, Enter/Space keyboard handlers
- Focus trapping: `focus-trap-react` in modal and panel (escapeDeactivates: false, allowOutsideClick: true)
- Focus returned to trigger element on overlay close
- `prefers-reduced-motion` respected for all animations and particles
- Purple focus-visible outlines on all interactive elements

## Particles

- CSS `@keyframes float` animation, no canvas
- 60 particles per instance, 2-8px size, 50-60% opacity
- Rendered in Hero and ProjectsSection (sticky viewport)
- Decorative only (`aria-hidden`), disabled with `prefers-reduced-motion`

## Responsive

- Mobile-first with Tailwind breakpoints (sm, md, lg)
- Mobile (< md): centered cards, shorter section height (200vh), reduced typography
- Tablet/Desktop: 2-col grid cards, alternating left/right in parallax, full typography
- Modal: responsive padding (p-6 md:p-8)
- FAB: fixed bottom-right, single button

## Data Model

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl: string;
}
```

- 4 mock projects with Alice-themed names (Cheshire Engine, Looking Glass API, Caterpillar CLI, Red Queen Dashboard)
- Data file: `src/data/projects.ts`
