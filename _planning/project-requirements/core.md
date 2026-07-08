# Core Requirements

## Architectural Constraints

- Feature-based directory structure — collocate related components, promote to shared only when used by 3+ features
- Tailwind v4 CSS-first `@theme` config — all theme tokens defined in `src/index.css`, no `tailwind.config.ts`
- Overlay state lives in `App.tsx` — no context needed for overlay management
- Arrow function components with explicit prop interfaces throughout

## Technology Lock-ins

- React 19 + TypeScript strict mode
- Vite 7 build toolchain (no webpack, no CRA)
- Tailwind CSS v4 — CSS-first config via `@theme`, not JavaScript config files
- Framer Motion for all animations — no CSS animation libraries, no GSAP
- `focus-trap-react` for focus trapping — no custom focus trap implementations

## Scope Exclusions

- No backend, no API calls, no server-side rendering
- No environment variables or secrets
- No images — gradient placeholders only (real assets are a future phase)  ~~Replaced by visuals feature~~
- No animation mode toggle — diagonal drift is the single permanent mode
- No About/Contact FABs — single email button only
- No separate About and Contact panels — combined into one slide-in panel
- No custom hooks for scroll progress or reduced motion — use Framer Motion built-ins or inline
- No barrel files (my-style: no barrel files rule)
- No SVG looking-glass frame overlays on thumbnails (aspect ratio incompatibility)
- No SVG ornamentation on whimsy slider (pure CSS ceiling reached; deferred to future Victorian frame asset work)
- No persistent whimsy preference (resets to max on load)
- No font or color palette changes based on whimsy level

## Non-Functional Constraints

- All animations must respect `prefers-reduced-motion`
- All interactive elements must be keyboard-accessible
- Focus must be managed on overlay open/close (trap inside, restore on close)
- Mobile-first responsive design (375px minimum)
