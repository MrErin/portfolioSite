# Roadmap

## Phase 0: Project Setup
- [x] Scaffold Vite + React + TypeScript
- [x] Install dependencies (Tailwind v4, Framer Motion, React Icons)
- [x] Configure Tailwind dark theme with gothic color palette
- [x] Set up typography (Cinzel Decorative, Cinzel, Raleway)
- [x] Create feature-based directory structure
- [x] Accessibility baseline (skip-link, focus-visible, semantic HTML)

## Phase 1: Layout & Structure
- [x] Hero section (full-viewport, gradient bg, display font)
- [x] Projects section with 2-col grid
- [x] Project cards (gradient placeholder, tech badges, hover effects)
- [x] Project modal component (structure only, not wired)
- [x] FAB navigation buttons (structure only, not wired)
- [x] About panel component
- [x] Contact panel component

## Phase 2: Animation System — Sticky Viewport Pattern
- [x] Scroll-linked parallax (Framer Motion useScroll + useTransform)
- [x] Animation Mode context + toggle mechanism
- [x] Sticky viewport layout (300vh section + pinned 100vh container)
- [x] Per-card scroll windows (staggered entry/exit)
- [x] Absolute card positioning with left/right alternation
- [x] Cards float up individually from below viewport as user scrolls
- [x] Animation Mode 1: Straight Up (vertical movement only)
- [x] Animation Mode 2: Diagonal Drift (vertical + horizontal drift + more rotation)
- [x] prefers-reduced-motion fallback (static vertical card list)

## Phase 3: Interactivity
- [x] Card click → modal open (grow-from-card transition)
- [x] Modal state management (selected project)
- [x] Close modal (X button + click outside + Escape key)
- [x] FAB click → About panel reveal (slide-in or overlay)
- [x] FAB click → Contact panel reveal
- [x] Background dim when modal/panel open

## Phase 4: Polish
- [x] Remove AnimationToggle component and all related code (AnimationModeContext, A key handler, mode state)
- [x] Set scroll effect to Diagonal Drift only (remove mode switching)
- [x] Make diagonal drift effect more pronounced (increase horizontal drift and/or rotation)
- [x] Condense FABs to single email button
- [x] Combine About + Contact into single panel (About at top, Contact beneath)
- [x] Fix Card 0 scroll timing (barely visible before fading out — see Decision #7)
- [x] Hover states refinement
- [x] Focus management (focus trapping in modal)
- [x] Keyboard navigation (Tab, Escape, Enter)
- [x] Responsive breakpoints (mobile stack, tablet 2-col, desktop full)
- [x] Dark mood styling refinement
- [x] Subtle particle effects or floating dots (optional)
- [x] Final accessibility audit
