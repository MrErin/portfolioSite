# Phase 0: Project Setup Plan

## Context

This is a greenfield portfolio site with a dark gothic/whimsical "falling down the rabbit hole" theme. The repo currently contains only `Requirements_Documentation/` and `.claude/` — no source code exists yet. Phase 0 establishes the foundation: Vite scaffolding, dependencies, Tailwind v4 dark theme, typography, file structure, and coding standards config.

Skills applied: **iterative-build**, **my-style**, **frontend-design**.

---

## Steps

### 1. Scaffold Vite + React + TypeScript

```bash
npm create vite@latest . -- --template react-ts
npm install
```

Vite will detect existing files and prompt — choose to proceed/ignore existing files.

### 2. Install dependencies

```bash
npm install framer-motion react-icons
npm install -D tailwindcss @tailwindcss/vite prettier
```

### 3. Update `.gitignore`

Merge existing `.idea/` entry with standard Node/Vite ignores: `node_modules`, `dist`, `dist-ssr`, `*.local`, `.env`, logs, IDE files.

### 4. Configure Vite with Tailwind v4 plugin

**File:** `vite.config.ts` — add `tailwindcss()` from `@tailwindcss/vite` alongside `react()`.

Using Tailwind v4 (CSS-first `@theme` config) — it's the current major version and the right choice for a greenfield project in 2026.

### 5. Create `.prettierrc`

Matches my-style standards:
- 2-space indent, single quotes, semicolons always
- 100 char line width, ES5 trailing commas
- Arrow parens always

### 6. Set up Tailwind theme + global CSS in `src/index.css`

This is the heart of the visual identity. Replaces Vite boilerplate with:

**Fonts (Google Fonts):**
| Role | Font | Rationale |
|------|------|-----------|
| Hero/display | Cinzel Decorative | Ornamental serif — dramatic, distinctive hero moment |
| Section headings | Cinzel | Classical serif — elegant, readable headers |
| Body text | Raleway | Geometric sans-serif — clean, pairs well with Cinzel |

**Color palette (defined via `@theme` block):**
- **Backgrounds:** 6-step void→dusk progression (near-black to dark gray-purple)
- **Purple range:** Primary atmospheric color (deep→glow), evokes the "rabbit hole" descent
- **Blue range:** Secondary atmosphere, mixes with purple for gradient variety
- **Accent: Red** — blood/wine tones
- **Accent: Gold** — gilded warmth (recommended primary accent for text highlights)
- **Accent: Teal** — mysterious, cool contrast
- **Surface colors:** For cards, modal overlays, borders — keyed to purple-dark family
- **Text colors:** Light lavender tones on dark backgrounds
- **Semantic:** Focus ring (purple-light), link colors

**Base styles:** Dark background on `html`, font-smoothing, focus-visible outlines (accessibility), selection color, skip-link styles.

### 7. Clean Vite boilerplate

- **Delete:** `src/App.css`, `src/assets/react.svg`, `public/vite.svg`
- **Replace:** `src/App.tsx`, `src/main.tsx` with project-specific versions

### 8. Create feature-based directory structure

```
src/
├── components/
│   └── index.ts                  # Shared component barrel export
├── features/
│   ├── hero/
│   │   ├── Hero.tsx              # Hero section placeholder
│   │   └── index.ts
│   ├── projects/
│   │   ├── ProjectCard.tsx       # Individual project card placeholder
│   │   ├── ProjectModal.tsx      # Modal placeholder (with a11y: role="dialog")
│   │   ├── ProjectsSection.tsx   # Projects container placeholder
│   │   └── index.ts
│   ├── about/
│   │   ├── AboutPanel.tsx        # About panel placeholder
│   │   └── index.ts
│   └── contact/
│       ├── ContactPanel.tsx      # Contact panel placeholder
│       └── index.ts
├── hooks/
│   └── index.ts
├── types/
│   ├── project.ts               # Project interface (from Requirements.md)
│   └── index.ts
├── data/
│   └── projects.ts              # 4 mock projects with thematic names
├── App.tsx                       # Root: dark bg, skip-link, <main>
├── main.tsx                      # Entry point
├── index.css                     # Tailwind theme + global styles
└── vite-env.d.ts                 # Kept from Vite
```

All placeholder components use:
- Arrow function syntax (my-style)
- Semantic HTML (`<section>`, `<article>`, `<aside>`)
- `aria-label` attributes
- Theme font/color classes to verify Tailwind works

### 9. Create `Project` TypeScript interface

From Requirements.md: `id`, `name`, `description`, `techStack`, `demoUrl?`, `repoUrl`.

### 10. Create mock project data

4 projects with thematic names (Cheshire Engine, Looking Glass API, Caterpillar CLI, Red Queen Dashboard) — realistic tech stacks, descriptions.

### 11. Update `App.tsx`

Root component with:
- Skip link (accessibility — visible on focus)
- `<main id="main-content">` landmark
- Dark background (`bg-abyss`)
- Imports Hero and ProjectsSection placeholders

### 12. Update `index.html`

- Set `lang="en"`, proper meta description
- `theme-color` meta tag matching `--color-abyss` (#0d0b1a)
- Update `<title>` to "Portfolio"

### 13. Replace `README.md`

Project-specific README with: tech stack, setup instructions (`npm install && npm run dev`), project structure diagram, development phases overview.

### 14. Create testing doc

**File:** `Requirements_Documentation/Claude_Responses/PHASE_0_TESTING.md`

Checklist covering: environment verification, Tailwind theme verification, typography verification, file structure verification, config verification, accessibility baseline.

### 15. Verify the build

```bash
npx tsc --noEmit          # Type check
npx prettier --check src/ # Style check
npm run dev               # Dev server — should show dark-themed page
```

---

## Files Created/Modified

| Action | File |
|--------|------|
| **New** | `.prettierrc` |
| **New** | `src/components/index.ts` |
| **New** | `src/features/hero/Hero.tsx`, `index.ts` |
| **New** | `src/features/projects/ProjectCard.tsx`, `ProjectModal.tsx`, `ProjectsSection.tsx`, `index.ts` |
| **New** | `src/features/about/AboutPanel.tsx`, `index.ts` |
| **New** | `src/features/contact/ContactPanel.tsx`, `index.ts` |
| **New** | `src/hooks/index.ts` |
| **New** | `src/types/project.ts`, `index.ts` |
| **New** | `src/data/projects.ts` |
| **New** | `Requirements_Documentation/Claude_Responses/PHASE_0_TESTING.md` |
| **Modified** | `.gitignore` (merge Node/Vite entries) |
| **Modified** | `vite.config.ts` (add Tailwind plugin) |
| **Modified** | `src/index.css` (replace with theme) |
| **Modified** | `src/App.tsx` (replace with skeleton) |
| **Modified** | `src/main.tsx` (cleanup) |
| **Modified** | `index.html` (metadata) |
| **Modified** | `README.md` (replace) |
| **Deleted** | `src/App.css`, `src/assets/react.svg`, `public/vite.svg` |

---

## Verification

After completing all steps:

1. `npm run dev` starts successfully — no errors
2. Browser shows dark purple/near-black background (not white)
3. "Hero Section" text displays in Cinzel Decorative font
4. "Projects" heading displays in Cinzel font
5. Body text displays in Raleway font
6. Tab navigation shows purple focus outlines
7. `npx tsc --noEmit` passes with no type errors
8. `npx prettier --check src/` passes

**STOP after Phase 0 — wait for user approval before proceeding to Phase 1.**
