# Phase 1: Layout & Structure — Implementation Plan

## Context

Phase 0 is complete: Vite scaffolding, Tailwind v4 dark theme, typography, file structure, and 4 mock projects are in place. All components exist as bare placeholders with minimal markup. Phase 1 builds out the static visual layout — no Framer Motion animations (Phase 2) and no interactivity/state management (Phase 3).

Skills applied: **iterative-build**, **my-style**, **frontend-design**.

---

## What Gets Built

| Component | Visible on Page? | Notes |
|-----------|:-:|-------|
| Hero section | Yes | Gradient background, gold title, decorative divider, tagline |
| ProjectCard | Yes | Accepts `Project` prop, gradient thumbnail, name, tech badges, CSS hover |
| ProjectsSection | Yes | Data-driven grid rendering all 4 projects via ProjectCard |
| FAB buttons | Yes | New shared `Fab` component, two fixed-position buttons in bottom-right |
| ProjectModal | No | Full structure with props — not rendered until Phase 3 |
| AboutPanel | No | Bio, skills, photo placeholder — not rendered until Phase 3 |
| ContactPanel | No | Email/GitHub/LinkedIn links — not rendered until Phase 3 |

---

## Steps

### Step 1: Add custom shadow to Tailwind theme

**File:** `src/index.css` (MODIFY)

Add a single line to the `@theme` block to define a reusable glow shadow. This avoids arbitrary Tailwind values in the FAB component.

```css
--shadow-glow-purple: 0 0 12px rgba(155, 126, 180, 0.3);
```

---

### Step 2: Create FAB component

**File:** `src/components/Fab.tsx` (NEW)

A shared floating action button component. This is a new file — no FAB component exists yet.

**Props:**
```typescript
interface FabProps {
  icon: ReactNode;   // A React Icons element (e.g., <FaUser />)
  label: string;     // Accessible label for aria-label
}
```

**Visual design:**
- 48px circle (`w-12 h-12 rounded-full`)
- `bg-surface-bright` with `border-border` — matches existing card aesthetic
- Hover: background shifts to `bg-dusk`, text glows to `purple-glow`, border becomes `purple`, purple box-shadow glow appears
- `transition-all duration-300` for smooth feel
- No `onClick` handler — button is structurally complete but inert (Phase 3 adds handlers)

---

### Step 3: Update components barrel export

**File:** `src/components/index.ts` (MODIFY)

Export the new Fab component from the barrel:
```typescript
export { default as Fab } from './Fab';
```

---

### Step 4: Build out Hero section

**File:** `src/features/hero/Hero.tsx` (MODIFY)

Replace the bare placeholder with a fully styled hero.

**Changes:**
- Add gradient background: `bg-gradient-to-b from-abyss via-void to-deep` — vertical gradient through three dark levels, creating a sense of depth/descent
- Fix hardcoded `text-[#c9a84c]` to `text-gold` (use theme class instead of arbitrary value)
- Add decorative horizontal gradient line (`h-px w-24 bg-gradient-to-r from-transparent via-gold-dark to-transparent`) between heading and tagline, marked `aria-hidden="true"`
- Add responsive text sizing: `text-5xl md:text-7xl lg:text-8xl`
- Add `tracking-wide` on tagline for elegant letter spacing
- Add `relative` on section — future-proofing for Phase 2 decorative elements

---

### Step 5: Build out ProjectCard

**File:** `src/features/projects/ProjectCard.tsx` (MODIFY)

Replace the bare placeholder with a data-driven card.

**Props:**
```typescript
interface ProjectCardProps {
  project: Project;  // from src/types/project.ts
}
```

**Layout (top to bottom):**
1. **Gradient thumbnail placeholder** — `h-40 bg-gradient-to-br from-hollow via-shade to-dusk`, `aria-hidden="true"`. Provides visual weight until real images are added.
2. **Card content area** (`p-6`):
   - Project name as `<h3>` in `font-heading text-text-primary text-xl`
   - Tech stack badges: `flex flex-wrap gap-2`, each badge is a small pill (`px-2 py-1 text-xs`) with `text-purple-light bg-surface-dim border-border`

**Hover effect (CSS only, Tailwind `group`):**
- Border shifts to `purple-dark`
- Background brightens to `surface-bright`
- Project name transitions to `text-gold`
- All transitions 300ms
- `cursor-pointer` — hints at future clickability

**Other:**
- `overflow-hidden` clips gradient thumbnail corners to `rounded-lg`
- No description on card — the full description lives in the modal

---

### Step 6: Wire up ProjectsSection

**File:** `src/features/projects/ProjectsSection.tsx` (MODIFY)

Replace hardcoded divs with actual data-driven rendering.

**Changes:**
- Import `projects` from `../../data/projects`
- Import `ProjectCard` from `./ProjectCard`
- Map over `projects` array to render `<ProjectCard>` for each
- Background changed from `bg-void` to `bg-deep` — creates visual step down from hero gradient (which ends at `deep`), continuity in the "descent"
- Grid gap increased from `gap-6` to `gap-8` — more breathing room
- Responsive: 1 column mobile, 2 columns at `md` (768px) — 4 projects make a balanced 2x2 grid

---

### Step 7: Build out ProjectModal (structure only)

**File:** `src/features/projects/ProjectModal.tsx` (MODIFY)

Build the complete modal layout. This component is NOT imported or rendered in App.tsx — it exists as a standalone structure ready for Phase 3 integration.

**Props:**
```typescript
interface ProjectModalProps {
  project: Project;      // Project data to display
  onClose: () => void;   // Close callback (Phase 3 wires this up)
}
```

**Layout (top to bottom):**
1. **Backdrop** — `fixed inset-0 z-50 bg-abyss/80` (darker/more atmospheric than generic `bg-black/50`)
2. **Close button** — 32px circle in top-right, `FaTimes` icon, `text-muted` → `text-primary` on hover
3. **Gradient header** — matches card thumbnail pattern (`from-hollow via-shade to-dusk`)
4. **Content area** (`p-8`):
   - Project name as `<h2>` in `font-heading text-gold text-3xl`
   - Description in `text-text-secondary leading-relaxed`
   - Tech stack badges (slightly larger than card badges: `px-3 text-sm`)
   - Demo placeholder — bordered box with centered placeholder text
   - Action links — styled as button-like links:
     - "View Repository" with `FaGithub` icon (always shown)
     - "Live Demo" with `FaExternalLinkAlt` icon (conditional on `project.demoUrl`)
5. **Scrollable** — `max-h-[90vh] overflow-y-auto` for small screens

**Icons used:** `FaGithub`, `FaExternalLinkAlt`, `FaTimes` from `react-icons/fa`

---

### Step 8: Build out AboutPanel

**File:** `src/features/about/AboutPanel.tsx` (MODIFY)

Build the panel structure with placeholder content. NOT rendered in App.tsx in Phase 1.

**Layout:**
1. **Heading** — "About" in `font-heading text-gold text-2xl`
2. **Photo placeholder** — 128px circle with `bg-gradient-to-br from-purple-dark to-shade`, `border-2 border-border`, `role="img"` with `aria-label`
3. **Bio** — 2-sentence on-theme placeholder text, centered
4. **Skills section** — heading + flex-wrapped badges. Uses `text-teal-light` (not purple) to differentiate personal skills from project tech stacks

**Skills list:** React, TypeScript, Node.js, Rust, Go, Tailwind CSS, Framer Motion

---

### Step 9: Build out ContactPanel

**File:** `src/features/contact/ContactPanel.tsx` (MODIFY)

Build with semantic icon links. NOT rendered in App.tsx in Phase 1.

**Layout:**
- Heading "Contact" in `font-heading text-teal-light text-2xl`
- `<nav aria-label="Contact links">` wrapping a `<ul>`
- Three list items with icon + text links:
  - Email (`FaEnvelope`) — `mailto:hello@example.com`
  - GitHub (`FaGithub`) — `https://github.com/user`
  - LinkedIn (`FaLinkedin`) — `https://linkedin.com/in/user`
- Icons colored `text-gold`, link text `text-text-secondary` → `text-text-primary` on hover
- External links have `target="_blank" rel="noopener noreferrer"`

---

### Step 10: Update App.tsx with FAB navigation

**File:** `src/App.tsx` (MODIFY)

Add FAB buttons as fixed-position elements. Do NOT add ProjectModal, AboutPanel, or ContactPanel to the render tree.

**Changes:**
- Import `{ FaUser, FaEnvelope }` from `react-icons/fa`
- Import `{ Fab }` from `./components`
- Convert `function App()` to `const App = () =>` (match project arrow function convention)
- Add FAB group after `</main>`:
  - Wrapper: `fixed bottom-6 right-6 flex flex-col gap-3 z-40`
  - `role="group" aria-label="Quick navigation"`
  - About FAB: `<Fab icon={<FaUser />} label="Open about panel" />`
  - Contact FAB: `<Fab icon={<FaEnvelope />} label="Open contact panel" />`

**Position rationale:** Bottom-right is the standard FAB convention (Material Design), doesn't compete with hero text, thumb-reachable on mobile. `z-40` keeps FABs below the modal's `z-50`.

---

## Summary of All File Changes

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `src/index.css` | MODIFY | Add `--shadow-glow-purple` to `@theme` (1 line) |
| 2 | `src/components/Fab.tsx` | CREATE | Shared FAB button component |
| 3 | `src/components/index.ts` | MODIFY | Export Fab from barrel |
| 4 | `src/features/hero/Hero.tsx` | MODIFY | Gradient bg, fix color class, decorative divider, responsive sizing |
| 5 | `src/features/projects/ProjectCard.tsx` | MODIFY | Accept Project prop, gradient thumbnail, name, tech badges, group-hover |
| 6 | `src/features/projects/ProjectsSection.tsx` | MODIFY | Import data + ProjectCard, render grid, bg change |
| 7 | `src/features/projects/ProjectModal.tsx` | MODIFY | Full modal layout: close button, header, badges, demo placeholder, links |
| 8 | `src/features/about/AboutPanel.tsx` | MODIFY | Photo placeholder, bio, skills badges |
| 9 | `src/features/contact/ContactPanel.tsx` | MODIFY | Semantic nav with icon links |
| 10 | `src/App.tsx` | MODIFY | Add FAB navigation, convert to arrow function |

**Files NOT modified:** `src/main.tsx`, `src/data/projects.ts`, `src/types/project.ts`, `src/types/index.ts`, all feature barrel `index.ts` files.

---

## Verification

### Build
```bash
npx tsc --noEmit          # Zero type errors
npx prettier --check src/ # Passes
npm run dev               # Dev server starts clean
```

### Visual (browser at localhost:5173)

1. **Hero** — full-viewport gradient background (dark→darker), gold "Portfolio" title in Cinzel Decorative, decorative gold line, tagline below
2. **Projects** — `bg-deep` background, "Projects" heading, 4 cards in 2x2 grid (desktop) / single column (mobile). Each card: gradient thumbnail, project name, tech badges. Hover: border shifts purple, name turns gold
3. **FABs** — two circular buttons bottom-right, person + envelope icons. Hover: purple glow. Click: nothing (expected)
4. **NOT visible** — no modal, no about panel, no contact panel (correct)

### Accessibility

1. Tab through page — focus outlines on all interactive elements
2. FABs announce "Open about panel" / "Open contact panel" to screen readers
3. Skip link still works
4. Sections have proper `aria-label` attributes

### Responsive

- **Mobile (< 768px):** Cards single column, hero `text-5xl`, FABs bottom-right
- **Tablet/Desktop (≥ 768px):** Cards 2-column grid, hero `text-7xl`
- **Large desktop (≥ 1024px):** Hero scales to `text-8xl`

---

**STOP after Phase 1 — wait for user approval before proceeding to Phase 2.**
