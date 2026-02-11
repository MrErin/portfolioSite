# Portfolio Site - Review Guide

## Quick Start (5 minutes)

### Prerequisites

- [ ] Node.js 20+ installed
- [ ] npm or pnpm available
- [ ] Modern browser (Chrome/Firefox/Safari)

### Setup

1. Install dependencies
   ```bash
   npm install
   ```
   **Expected:** No errors. Warnings about peer deps are OK.

2. Start dev server
   ```bash
   npm run dev
   ```
   **Expected:** Terminal shows `Local: http://localhost:5173/` (or similar port)

3. Open in browser
   - [x] Dark page loads with "Portfolio" heading in gold serif font
   - [x] Floating dots (particles) drift upward in the background
   - [x] Scrolling reveals project cards with parallax animation

**If all three work, proceed to Feature Testing. If not, see Troubleshooting at the bottom.**

---

## Feature Testing (15-20 minutes)

### 1. Hero Section (~2 min)

**What it does:** Full-viewport landing with gradient background, gold display title, and floating particle effects.

- [x] "Portfolio" in large gold serif font, centered
- [x] Subtitle "Falling down the rabbit hole..." below it
- [x] Floating dots (particles) drift upward behind the text
- [x] Background gradient transitions from near-black to dark purple-blue

---

### 2. Parallax Card Scroll (~5 min)

**What it does:** Project cards animate through a pinned viewport as you scroll, creating a "falling past objects" sensation. This is the centerpiece feature.

- [x] Scroll down past the hero section
- [x] "Projects" heading appears and stays pinned at the top
- [x] Cards animate through the viewport one at a time
- [x] Even-indexed cards (0, 2) are positioned left; odd cards (1, 3) are positioned right
- [x] Cards have diagonal drift (horizontal movement + rotation + scale change)
- [x] Cards fade in and fade out at the edges of their scroll window
- [x] Floating particles are visible in the projects section background

**Known issue:** Card 0 may still appear briefly before its intended scroll window begins (the cards may be visible in a pile at the bottom before their individual animations trigger). This is a scroll timing issue documented in Known Issues below.

**Reduced motion check:**
- [ ] Open browser DevTools → Rendering → check "Emulate prefers-reduced-motion: reduce"
- [ ] Projects section switches to a simple vertical card stack (no parallax)
- [ ] Particles disappear in both Hero and Projects sections

---

### 3. Project Modal (~3 min)

**What it does:** Clicking a project card opens a detailed modal that grows from the card's position.

- [x] Click any project card → modal opens with a "grow from card" animation
- [x] Modal shows: gradient header, project name in gold, description, tech badges, demo placeholder, action links
- [x] Close modal: click the X button
- [x] Close modal: click the dark backdrop behind it
- [x] Close modal: press Escape key
- [x] After closing, focus returns to the card you clicked

---

### 4. About & Contact Panel (~3 min)

**What it does:** A single FAB (email icon, bottom-right) opens a slide-in panel with About and Contact content stacked together.

- [x] Email FAB visible in bottom-right corner
- [x] Click FAB → panel slides in from the right
- [x] Panel shows "About" section at top (photo placeholder, bio, skills badges)
- [x] Divider line separates sections
- [x] "Contact" section below (email, GitHub, LinkedIn links)
- [x] Close panel: click X button
- [x] Close panel: click dark backdrop
- [x] Close panel: press Escape key

---

### 5. Focus Trapping (~3 min)

**What it does:** When a modal or panel is open, Tab key cycles only within that overlay, preventing focus from escaping to content behind.

**Modal:**
- [x] Click a card to open modal
- [x] Press Tab — focus moves between close button and links inside the modal
- [x] Press Shift+Tab — cycles in reverse
- [x] Focus never reaches the FAB or cards behind the modal

**Panel:**
- [x] Click FAB to open panel
- [x] Press Tab — focus cycles within panel content (close button, links)
- [x] Focus never escapes to page content behind

---

### 6. Keyboard & Accessibility (~2 min)

- [x] Press Tab on page load → skip-link appears ("Skip to main content")
- [x] Press Enter on skip-link → focus jumps to `<main>`
- [x] All interactive elements have visible purple focus ring when focused via keyboard
- [x] Project cards are keyboard-accessible: Tab to card, Enter, or Space to open modal

---

### 7. Hover Effects (~1 min)

- [x] Hover project card → purple glow border + background brightens
- [x] Hover card title → text turns gold
- [x] Hover FAB → purple glow + color shift
- [x] Hover modal links (View Repository, Live Demo) → purple glow

---

## Code Understanding Guide (30-45 minutes)

Read in this order. Each level builds on the previous.

### Level 1: Data & Types (5 min)

#### 1. `src/types/project.ts` — Read time: 1 min
- **What:** TypeScript interface for a project (id, name, description, techStack, demoUrl?, repoUrl)
- **Look for:** `demoUrl` is optional — some cards won't show a "Live Demo" link
- **You can skip:** Nothing, it's 8 lines

#### 2. `src/data/projects.ts` — Read time: 2 min
- **What:** Array of 4 mock projects with Wonderland-themed names (Cheshire Engine, Looking Glass API, etc.)
- **Look for:** Each has a `techStack` array that drives the badge rendering. `demoUrl` is present on some but not all.
- **Try it:** Add a 5th project to this array. The parallax system will auto-adjust scroll windows.

#### 3. `src/index.css` — Read time: 5 min
- **What:** Tailwind v4 theme configuration via `@theme {}` block, plus global styles and the particle float animation
- **Key concepts:**
  - **Color palette:** 6-step dark background progression (abyss → void → deep → hollow → shade → dusk), plus purple/blue/red/gold/teal accent ranges
  - **Surface colors:** Semi-transparent rgba overlays for card/panel backgrounds
  - **Text hierarchy:** primary → secondary → muted → dim
  - **`@keyframes float`:** Drives the particle animation (translateY upward + opacity fade)
- **Look for:** The `@theme` block is the single source of truth for all design tokens. Tailwind v4 reads these directly — no `tailwind.config.js` needed.

---

### Level 2: Shared Hooks (5 min)

#### 4. `src/hooks/useReducedMotion.ts` — Read time: 2 min
- **What:** Reactively tracks `prefers-reduced-motion` OS setting
- **Key concept:** Uses `matchMedia` with a `change` listener, so the UI updates live if the user toggles the setting in DevTools during development
- **Look for:** Returns a boolean. Components use this to switch between animated and static rendering.

#### 5. `src/hooks/useFocusTrap.ts` — Read time: 3 min
- **What:** Traps Tab/Shift+Tab focus within a container element (used by modal and panel)
- **Key concepts:**
  - On mount: saves `document.activeElement`, focuses first focusable child
  - On unmount: restores focus to the previously focused element
  - Intercepts Tab key to wrap focus at the boundaries
- **Look for:** The `querySelectorAll` selector string that finds focusable elements. The ref is passed to the overlay container.

#### 6. `src/hooks/useScrollProgress.ts` — Read time: 2 min
- **What:** Wraps Framer Motion's `useScroll` to track a section's scroll position
- **Key concept:** Returns a `scrollYProgress` MotionValue (0→1) that feeds all per-card transforms
- **Critical detail — the offset:**
  ```ts
  offset: ['start end', 'end start']
  ```
  This means progress 0 = section top enters viewport bottom, progress 1 = section bottom exits viewport top. The total tracked scroll distance = section height + viewport height. See the Deep Dive on scroll math below.

---

### Level 3: Animation Config — Deep Dive (10 min)

This is the most complex file in the project and the one most likely to need tuning.

#### 7. `src/data/animationConfig.ts` — Read time: 10 min

**What:** All scroll-linked animation math lives here. Defines section height, calculates per-card scroll windows, and configures parallax transforms.

**The scroll system has 5 layers of configuration:**

##### Layer 1: Section Height
```ts
export const SECTION_HEIGHT_VH = 400;
```
The projects section is 400vh tall. Only 100vh is the sticky viewport — the rest is scroll runway. A taller section = slower card animations = more time to see each card. Imported by `ProjectsSection.tsx`.

##### Layer 2: Sticky Range Calculation
```
VIEWPORT_VH = 100
TOTAL_SCROLL_VH = SECTION_HEIGHT_VH + VIEWPORT_VH = 500
STICKY_START = 100 / 500 = 0.20
STICKY_END   = 400 / 500 = 0.80
```

**Why this matters:** The `useScroll` offset `['start end', 'end start']` tracks the ENTIRE journey from "section enters viewport" to "section leaves viewport" — that's 500vh of scroll mapped to progress 0→1. But the sticky container is only pinned from progress ~0.20 to ~0.80. Before 0.20, the section is still scrolling into view. After 0.80, it's scrolling out. Cards must animate ONLY within the 0.20→0.80 range, or they'll be invisible when the user can't see the sticky viewport.

**Visual timeline of scroll progress:**
```
Progress:  0.0 ──── 0.20 ════════════════ 0.80 ──── 1.0
                     │                      │
           Section   │  STICKY IS PINNED    │  Section
           entering  │  Cards animate here  │  leaving
           viewport  │                      │  viewport
```

##### Layer 3: Card Window Sizing
```ts
WINDOW_RATIO = 0.3    // Each card is visible for 30% of the sticky range
INNER_PAD_RATIO = 0.05 // 5% buffer at edges of sticky range
```

`WINDOW_RATIO` controls how long each card stays on screen. Lower = more sequential (less overlap between cards). Higher = more overlap (multiple cards visible at once).

With 4 cards and current values:
- Sticky range = 0.60 (from 0.20 to 0.80)
- Window size = 0.60 * 0.30 = 0.18 per card
- Inner pad = 0.60 * 0.05 = 0.03
- Usable range: 0.23 to 0.77
- Stagger between cards: (0.54 - 0.18) / 3 = 0.12

```
Card 0: ████████████████████ [0.23 ─── 0.41]
Card 1:          ████████████████████ [0.35 ─── 0.53]
Card 2:                   ████████████████████ [0.47 ─── 0.65]
Card 3:                            ████████████████████ [0.59 ─── 0.77]
         |         |         |         |         |
        0.20      0.35      0.50      0.65      0.80
                    STICKY RANGE
```

Overlap between adjacent cards = 0.18 - 0.12 = 0.06 (33% of window). This is where one card is fading out near the top while the next is fading in near the bottom.

##### Layer 4: Opacity Fade
`getCardOpacityRange()` creates a trapezoidal opacity curve for each card:
```
Opacity:  0 ── fade in ── 1 ══════════ 1 ── fade out ── 0
          |    15%    |      70%       |     15%     |
        start                                       end
```
The 15% fade margin at each edge creates smooth entry/exit.

##### Layer 5: Transform Config
```ts
PARALLAX_CONFIG = {
  translateYOutput: [600, -600],   // 1200px vertical travel
  rotateOutput: [-10, 10],         // ±10° tilt
  scaleOutput: [0.9, 1.1],        // 90%→110% size
  translateXOutput: [-120, 120],   // ±120px horizontal drift
}
```
Each card's transforms are driven by `useTransform(scrollYProgress, [scrollStart, scrollEnd], outputRange)` in `ParallaxCard.tsx`. Odd-indexed cards get negated `translateX` for alternating drift direction.

##### Tuning Guide

| Want to... | Change | File |
|------------|--------|------|
| Slow down card animations | Increase `SECTION_HEIGHT_VH` (more scroll runway) | `animationConfig.ts` |
| Make cards more sequential (less overlap) | Decrease `WINDOW_RATIO` (e.g., 0.2) | `animationConfig.ts` |
| Make cards overlap more | Increase `WINDOW_RATIO` (e.g., 0.5) | `animationConfig.ts` |
| Cards enter/exit further off-screen | Increase `translateYOutput` values | `animationConfig.ts` |
| Reduce diagonal movement | Decrease `translateXOutput` and `rotateOutput` | `animationConfig.ts` |
| Change when cards start relative to sticky pin | Adjust `INNER_PAD_RATIO` | `animationConfig.ts` |
| Change how the scroll progress is tracked | Modify `offset` in `useScrollProgress.ts` | `useScrollProgress.ts` |

---

### Level 4: Components (10 min)

#### 8. `src/components/ParticleField.tsx` — Read time: 2 min
- **What:** Renders 60 tiny `<div>` elements with randomized positions, sizes, colors, and animation timing
- **Key concepts:** All animation is CSS (`@keyframes float`), zero JS per frame. GPU-composited via `transform` + `opacity`. `pointer-events-none` + `aria-hidden` = purely decorative.
- **Look for:** Returns `null` when `useReducedMotion()` is true. Color palette uses Tailwind tokens at 50-60% opacity.

#### 9. `src/components/Fab.tsx` — Read time: 1 min
- **What:** Floating action button. Takes an icon, label, and click handler.
- **Look for:** `aria-label` for accessibility. Purple glow hover via `hover:shadow-glow-purple`.

#### 10. `src/components/SlidePanel.tsx` — Read time: 3 min
- **What:** Slide-in panel overlay. Backdrop + panel slide from right.
- **Key concepts:** Uses `framer-motion` for enter/exit animations, `useFocusTrap` for accessibility. Parent (`App.tsx`) handles Escape key.
- **Look for:** `e.stopPropagation()` on panel click prevents backdrop click-to-close from firing when clicking inside the panel.

---

### Level 5: Features (10 min)

#### 11. `src/features/hero/Hero.tsx` — Read time: 1 min
- **What:** Landing section with gradient background, title, divider, subtitle, and ParticleField
- **You can skip:** It's straightforward JSX.

#### 12. `src/features/projects/ProjectCard.tsx` — Read time: 3 min
- **What:** Individual project card with gradient placeholder, title, tech badges
- **Key concepts:** `role="button"` + `tabIndex={0}` + `onKeyDown` makes it keyboard accessible. Captures `getBoundingClientRect()` on click and passes it up — this is how the modal knows where to animate from.
- **Look for:** The `useRef` + `getBoundingClientRect()` pattern for modal origin calculation.

#### 13. `src/features/projects/ParallaxCard.tsx` — Read time: 5 min
- **What:** Wrapper that applies scroll-linked transforms to a ProjectCard
- **Key concepts:** Calls `getCardScrollWindow()` and `getCardOpacityRange()` to get its specific scroll range, then creates `useTransform` hooks for Y, X, rotation, scale, and opacity. Each transform maps the shared `scrollYProgress` through the card's individual window.
- **Look for:** How odd-indexed cards get negated `translateX` for the alternating drift. The `horizontalClass` switches between `left-[5%]` and `right-[5%]` for alternating screen position.

#### 14. `src/features/projects/ProjectsSection.tsx` — Read time: 3 min
- **What:** Orchestrates the parallax scroll experience. Contains the tall section, sticky viewport, heading, particles, and maps projects to ParallaxCards.
- **Key concepts:** Two code paths — `prefersReducedMotion` returns a simple card stack, otherwise renders the sticky viewport pattern. Section height comes from `SECTION_HEIGHT_VH` in animationConfig.
- **Look for:** The `ref={ref}` on the section element — this is what `useScrollProgress` tracks.

#### 15. `src/features/projects/ProjectModal.tsx` — Read time: 3 min
- **What:** Fullscreen overlay with grow-from-card animation
- **Key concepts:** Receives `cardOrigin` (the clicked card's center coordinates), calculates offset from viewport center, and uses that as the initial `x`/`y` for a spring animation. Focus trap via `useFocusTrap`.
- **Look for:** The offset calculation that makes the modal appear to grow from the card.

#### 16. `src/App.tsx` — Read time: 5 min
- **What:** Root component. Manages all overlay state and wires everything together.
- **Key concepts:**
  - Three state values: `selectedProject`, `cardOrigin`, `panelOpen`
  - `handleProjectClick` captures the card's bounding rect for modal animation
  - `handleOpenPanel` also closes any open modal (mutual exclusion)
  - Escape key listener with priority: modal first, then panel
  - Skip-link for keyboard accessibility
- **Look for:** The `AnimatePresence` wrappers around modal and panel enable exit animations.

---

## Testing Guide

### Automated Checks

```bash
# Type check (catches interface mismatches, missing props, etc.)
npx tsc --noEmit

# Lint
npm run lint

# Production build (verifies tree-shaking and bundle)
npm run build
```

No unit test framework is currently set up. See Next Steps for adding Vitest.

### Manual Testing Checklist

See the Feature Testing section above. Key flows to verify after any change:

1. Scroll through the full page — hero → parallax cards → past the section
2. Click a card → modal opens → close it (all 3 methods)
3. Click FAB → panel opens → close it (all 3 methods)
4. Tab through the entire page with keyboard only
5. Toggle prefers-reduced-motion in DevTools → verify fallback
6. Resize to 375px width → verify no horizontal overflow

---

## Known Issues

### Active Bug: Card 0 Scroll Timing

**Status:** Unresolved. Cards appear visible in a "pile" at the bottom of the viewport before their individual scroll windows begin, then animate one at a time. The intended behavior is for each card to start fully off-screen and enter only when its scroll window begins.

**Root cause analysis:**

The `useTransform` hooks in `ParallaxCard.tsx` control each card's opacity and position based on scroll progress. Before a card's scroll window starts, `useTransform` should clamp the opacity to 0 (invisible). However, cards appear visible at their initial `translateY: 600px` position (bottom of viewport). This suggests either:

1. Framer Motion's `useTransform` may not clamp at the initial render before scroll values are computed
2. There may be a brief frame where the motion values haven't initialized but the DOM elements are rendered with default opacity (1)
3. The `translateY: 600px` starting position may not push cards fully below the `overflow-hidden` container on all viewport sizes

**Files involved:**
- `src/data/animationConfig.ts` — scroll window calculation (`getCardScrollWindow`, `getCardOpacityRange`)
- `src/features/projects/ParallaxCard.tsx` — `useTransform` calls that consume the scroll windows
- `src/hooks/useScrollProgress.ts` — the `offset` parameter that defines when progress 0 and 1 occur
- `src/features/projects/ProjectsSection.tsx` — section height and sticky container

**Attempted fixes (in this session):**
- Added scroll padding (BASE_PAD) to shift Card 0's window later — helped slightly but didn't solve the pile
- Changed scroll offset to `['start start', 'end end']` — broke animations entirely (cards bunched and disappeared)
- Calculated sticky-pinned range and restricted card windows to that range — correct math, but pile persists
- Reduced WINDOW_RATIO from 0.5 to 0.3 to reduce card overlap — reduced pile size but cards still visible before their window

**Potential approaches to investigate:**
- Set explicit `initial={{ opacity: 0 }}` on the `motion.div` in `ParallaxCard.tsx` to ensure cards are invisible before Framer Motion computes scroll values
- Use `useMotionValueEvent` to debug the actual scrollYProgress values at key scroll positions
- Increase `translateYOutput[0]` well beyond the viewport height (e.g., 1200px+) so cards start fully below `overflow-hidden`
- Add a `visibility: hidden` CSS class that gets removed only when the card enters its scroll window
- Consider using Framer Motion's `useTransform` with explicit `clamp: true` option if default behavior differs across versions

### Placeholder Content

- [ ] Project images use gradient placeholders (no actual screenshots)
- [ ] Profile photo is a gradient circle placeholder
- [ ] Email/GitHub/LinkedIn URLs are placeholder values
- [ ] Demo URLs point to example.com domains

### Not Yet Implemented

- [ ] No automated tests (no Vitest/Jest setup)
- [ ] No CI/CD pipeline
- [ ] No contact form (just mailto link)
- [ ] No project filtering or search
- [ ] No page transitions between sections
- [ ] No analytics or error tracking

### Browser Considerations

- Tested in modern Chromium browsers
- CSS `@keyframes` particle animation may vary slightly across browsers
- `position: sticky` is well-supported but can behave unexpectedly inside flex/grid containers
- Framer Motion v12 requires React 19

---

## Next Steps

### Easy (1-2 hours)

1. **Replace placeholder content**
   - Swap project data in `src/data/projects.ts` with real projects
   - Add real profile photo (replace gradient circle in `AboutPanel.tsx`)
   - Update contact links in `ContactPanel.tsx`
   - **Files:** `projects.ts`, `AboutPanel.tsx`, `ContactPanel.tsx`

2. **Add project images**
   - Replace gradient placeholder in `ProjectCard.tsx` and `ProjectModal.tsx` with actual screenshots
   - Add an `imageUrl` field to the `Project` interface
   - **Files:** `project.ts`, `projects.ts`, `ProjectCard.tsx`, `ProjectModal.tsx`

3. **Tune parallax feel**
   - Adjust `SECTION_HEIGHT_VH`, `WINDOW_RATIO`, `INNER_PAD_RATIO`, and `PARALLAX_CONFIG` values in `animationConfig.ts`
   - See the Tuning Guide in the Code Understanding section above
   - **Files:** `animationConfig.ts`

### Medium (3-5 hours)

4. **Add Vitest for unit testing**
   - Install `vitest` and `@testing-library/react`
   - Write tests for pure functions: `getCardScrollWindow`, `getCardOpacityRange` (these are ideal test candidates — pure math, no DOM)
   - Write component tests for `ProjectCard` click behavior
   - **Files:** New `src/__tests__/` directory, `package.json`, `vite.config.ts`

5. **Fix Card 0 scroll timing**
   - Investigate the root cause of cards being visible before their scroll window
   - See detailed analysis in Known Issues above
   - **Files:** `animationConfig.ts`, `ParallaxCard.tsx`, `useScrollProgress.ts`

6. **Add project detail pages or expanded modal**
   - Replace the "Demo placeholder" in `ProjectModal.tsx` with rich content (screenshots, feature lists, architecture notes)
   - **Files:** `ProjectModal.tsx`, `project.ts` (expand interface)

### Larger Features (8+ hours)

7. **Blog or writing section**
   - New feature directory `src/features/blog/`
   - Markdown rendering (add `react-markdown` dependency)
   - Route-based navigation (add `react-router`)
   - **Complexity:** High — introduces routing, new data layer, content management

8. **Contact form with backend**
   - Replace mailto with a working form
   - Options: Formspree (no backend), Netlify Forms, or custom API
   - Add form validation and success/error states
   - **Complexity:** Medium-High — requires form state management and external service

9. **Performance optimization**
   - Lazy-load the projects section and modal
   - Add `Suspense` boundaries
   - Optimize particle count on mobile (detect viewport size)
   - Consider `will-change` hints for parallax transforms
   - **Complexity:** Medium — mostly configuration, requires performance profiling

---

## Troubleshooting

### Dev server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules && npm install
```

### TypeScript errors
```bash
# Check for type errors without building
npx tsc --noEmit
```

### Styles not applying
- Tailwind v4 uses `@theme {}` in CSS, not `tailwind.config.js`
- Check that `@import 'tailwindcss'` is present in `index.css`
- Custom tokens must be inside the `@theme {}` block

### Animations not working
- Check browser DevTools → Rendering → "Emulate prefers-reduced-motion" is NOT checked
- Verify the section has proper height (`SECTION_HEIGHT_VH` in `animationConfig.ts`)
- Open React DevTools → check that `scrollYProgress` MotionValue updates as you scroll

### Modal/Panel won't close
- Check browser console for JS errors
- Verify `AnimatePresence` wraps the conditional render in `App.tsx`
- Check that `onClose` prop is wired correctly
