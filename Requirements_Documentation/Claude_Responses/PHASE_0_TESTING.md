# Phase 0 Testing Checklist

## Environment Verification

- [ ] Node.js version matches project requirements
- [ ] `npm install` completed without errors
- [ ] All dependencies installed: framer-motion, react-icons, tailwindcss, @tailwindcss/vite, prettier

## Tailwind Theme Verification

- [ ] `@import "tailwindcss"` is present in `src/index.css`
- [ ] `tailwindcss()` plugin is added to `vite.config.ts`
- [ ] All custom theme colors are defined in `@theme` block
- [ ] Background renders as dark purple/near-black (not white)

## Typography Verification

Open browser DevTools → Elements → Computed styles and verify:

- [ ] **Hero heading (h1)** uses "Cinzel Decorative" font
- [ ] **Section headings (h2-h6)** use "Cinzel" font
- [ ] **Body text** uses "Raleway" font
- [ ] All fonts loaded from Google Fonts successfully

## File Structure Verification

Verify these directories and files exist:

```
src/
├── components/index.ts
├── features/
│   ├── hero/Hero.tsx + index.ts
│   ├── projects/ProjectCard.tsx + ProjectModal.tsx + ProjectsSection.tsx + index.ts
│   ├── about/AboutPanel.tsx + index.ts
│   └── contact/ContactPanel.tsx + index.ts
├── hooks/index.ts
├── types/project.ts + index.ts
├── data/projects.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Config Verification

- [ ] `.prettierrc` exists with correct settings:
  - [ ] `semi: true`
  - [ ] `singleQuote: true`
  - [ ] `tabWidth: 2`
  - [ ] `printWidth: 100`
  - [ ] `trailingComma: "es5"`
  - [ ] `arrowParens: "always"`

- [ ] `.gitignore` includes: node_modules, dist, *.local, .env, .idea

- [ ] `index.html` has:
  - [ ] `lang="en"`
  - [ ] `theme-color="#0d0b1a"` (matches abyss)
  - [ ] Meta description
  - [ ] Title is "Portfolio"

## Accessibility Baseline

- [ ] Skip link present in App.tsx
- [ ] Skip link has `.skip-link` class with proper CSS
- [ ] Skip link appears on Tab focus (top: 16px when focused)
- [ ] Main landmark (`<main id="main-content">`) present
- [ ] All placeholder components have `aria-label` attributes
- [ ] Tab navigation shows purple focus outlines (`*:focus-visible` CSS)

## Build Verification

Run these commands and verify results:

```bash
# Type check (should pass with no errors)
npx tsc --noEmit

# Style check (should pass)
npx prettier --check src/

# Dev server (should start and show page)
npm run dev
```

- [ ] `npx tsc --noEmit` passes without type errors
- [ ] `npx prettier --check src/` passes
- [ ] `npm run dev` starts successfully
- [ ] Browser at http://localhost:5173 shows dark-themed page
- [ ] "Hero Section" text visible in Cinzel Decorative
- [ ] "Projects" heading visible in Cinzel
- [ ] Body text visible in Raleway

## Visual Verification Checklist

When viewing the rendered page:

- [ ] Background is dark (near-black/purple), NOT white
- [ ] "Portfolio" heading is gold color (#c9a84c)
- [ ] "Falling down the rabbit hole..." text is lavender
- [ ] "Projects" heading is purple-light (#9b7eb4)
- [ ] Focus outlines are purple when tabbing through elements
- [ ] No console errors in browser DevTools

---

## Phase 0 Complete When:

All checkboxes above are checked AND the following work:

1. Dev server runs: `npm run dev`
2. Page renders dark-themed (not broken white Vite default)
3. All TypeScript types valid
4. All Prettier formatting valid
5. All files in correct locations

**STOP after Phase 0 — wait for user approval before proceeding to Phase 1.**
