# Phase 3: Interactivity

## Goal

Wire up all user interactions: card click opens a project modal with a grow-from-card animation, FABs open slide-in panels for About and Contact, and all overlays close via backdrop click or Escape key.

## Architecture Notes

**Overlay state lives in App.tsx** — it's the layout root and already renders ProjectsSection, FABs, and will render overlays. No new context needed; state + handlers at the App level keep things simple.

**Card click flow:**
- `ProjectCard` captures its bounding rect on click via a ref
- Callback threads up through `ParallaxCard` → `ProjectsSection` → `App`
- App stores the project + card center coordinates, renders `ProjectModal`
- Modal uses the card's center point to animate "growing from" that position

**Grow-from-card animation approach:**
- When clicked, capture card center `(x, y)` via `getBoundingClientRect()`
- Modal's `motion.div` starts with `scale: 0.8, opacity: 0` offset toward the card center (x/y translate from center of viewport to card center)
- Animates to `scale: 1, opacity: 1, x: 0, y: 0` (centered in viewport)
- Exit: `opacity: 0, scale: 0.95` (simple fade-out — animating back to card position is unreliable since the card may have moved via scroll)
- This uses only transforms + opacity for smooth 60fps animation

**Panel approach:**
- A shared `SlidePanel` component handles the overlay pattern (backdrop + slide-in + close)
- `AboutPanel` and `ContactPanel` stay as pure content components, rendered as children of `SlidePanel`
- Panels slide in from the right side

**Escape key:**
- Single `keydown` listener in `App.tsx` closes whatever overlay is open
- Priority: modal first (if open), then panel

---

## Tasks

### Task 1: Add onClick prop to Fab component

**File:** `src/components/Fab.tsx`
**Action:** Add an optional `onClick` callback to `FabProps` and wire it to the button element.

**Specific changes:**
- Add `onClick?: () => void` to `FabProps`
- Pass it to the `<button>` element

**Verify:** TypeScript compiles. Fab still renders without onClick (optional prop).
**Done when:** `<Fab onClick={handler} />` fires the callback on click.

---

### Task 2: Make ProjectCard clickable with rect capture

**File:** `src/features/projects/ProjectCard.tsx`
**Action:** Add an `onClick` callback prop that receives the project and the card's bounding rect. Attach a ref to the `<article>` to measure position on click.

**Specific changes:**
- Add `onClick?: (project: Project, rect: DOMRect) => void` to `ProjectCardProps`
- Add a `ref` on the `<article>` element
- On click, call `onClick(project, ref.current.getBoundingClientRect())`
- Add `role="button"` and `tabIndex={0}` for keyboard accessibility (article becomes interactive)
- Handle `onKeyDown` for Enter/Space to trigger the same click behavior

**Verify:** Clicking a card logs the project and rect (during development). Keyboard Enter/Space also works.
**Done when:** `ProjectCard` fires `onClick` with the project data and the card's current visual bounding rect.

---

### Task 3: Thread card click handler through ProjectsSection and ParallaxCard

**Files:** `src/features/projects/ProjectsSection.tsx`, `src/features/projects/ParallaxCard.tsx`
**Action:** Accept an `onProjectClick` callback prop in both components and forward it down to `ProjectCard`.

**Specific changes in ProjectsSection:**
- Add `onProjectClick?: (project: Project, rect: DOMRect) => void` to component props (needs a props interface now)
- Pass it to each `ParallaxCard`
- Also pass it to each `ProjectCard` in the reduced-motion fallback path

**Specific changes in ParallaxCard:**
- Add `onProjectClick?: (project: Project, rect: DOMRect) => void` to `ParallaxCardProps`
- Pass it to `ProjectCard` as `onClick`

**Verify:** TypeScript compiles. Click reaches from ProjectCard up through the component tree.
**Done when:** A click on any card inside the parallax viewport fires the `onProjectClick` callback with correct project + rect.

---

### Task 4: Create SlidePanel overlay component

**File:** `src/components/SlidePanel.tsx` (new)
**Action:** Create a reusable slide-in panel component for the About and Contact overlays. Handles backdrop, slide animation, close button, and click-outside.

**Structure:**
```
<AnimatePresence> wrapper lives in the parent (App.tsx)
  <motion.div>        ← backdrop: fixed inset-0, fades in/out, click-to-close
    <motion.div>      ← panel: slides from right, max-w-md, scrollable
      <button>        ← close button (X) top-right
      {children}      ← AboutPanel or ContactPanel content
    </motion.div>
  </motion.div>
```

**Props:**
- `children: ReactNode` — panel content
- `onClose: () => void` — close handler
- `ariaLabel: string` — accessible label for the panel region

**Animation:**
- Backdrop: `opacity 0 → 1`, exit `opacity 1 → 0`
- Panel: `x: '100%' → 0`, exit `x: 0 → '100%'`
- Transition: spring with `damping: 25, stiffness: 300` for a snappy feel
- Click on backdrop calls `onClose`; `stopPropagation` on panel prevents closing when clicking inside

**Verify:** TypeScript compiles. Component renders children inside a slide-in panel.
**Done when:** `<SlidePanel onClose={fn} ariaLabel="About">content</SlidePanel>` renders a slide-in overlay that closes on backdrop click.

---

### Task 5: Add overlay state and Escape handler to App.tsx

**File:** `src/App.tsx`
**Action:** Add state for all overlays, wire handlers, add global Escape listener, render modal and panels conditionally.

**State:**
- `selectedProject: Project | null` — currently open project (null = modal closed)
- `cardOrigin: { x: number; y: number } | null` — card center coords for grow animation
- `activePanel: 'about' | 'contact' | null` — which panel is open (null = none)

**Handlers:**
- `handleProjectClick(project, rect)` — calculate card center from rect, set `selectedProject` and `cardOrigin`
- `handleCloseModal()` — set `selectedProject` and `cardOrigin` to null
- `handleOpenAbout()` / `handleOpenContact()` — set `activePanel`, close any open modal
- `handleClosePanel()` — set `activePanel` to null

**Escape key listener:**
- `useEffect` with `keydown` listener
- If `selectedProject` is set → close modal
- Else if `activePanel` is set → close panel
- Ignore if target is input/textarea (same pattern as AnimationToggle)

**Rendering:**
```tsx
<AnimatePresence>
  {selectedProject && (
    <ProjectModal
      project={selectedProject}
      cardOrigin={cardOrigin}
      onClose={handleCloseModal}
    />
  )}
</AnimatePresence>

<AnimatePresence>
  {activePanel === 'about' && (
    <SlidePanel onClose={handleClosePanel} ariaLabel="About">
      <AboutPanel />
    </SlidePanel>
  )}
</AnimatePresence>

<AnimatePresence>
  {activePanel === 'contact' && (
    <SlidePanel onClose={handleClosePanel} ariaLabel="Contact">
      <ContactPanel />
    </SlidePanel>
  )}
</AnimatePresence>
```

Wire FABs:
```tsx
<Fab icon={<FaUser />} label="Open about panel" onClick={handleOpenAbout} />
<Fab icon={<FaEnvelope />} label="Open contact panel" onClick={handleOpenContact} />
```

Pass to ProjectsSection:
```tsx
<ProjectsSection onProjectClick={handleProjectClick} />
```

**Verify:** Clicking a FAB opens the corresponding panel. Clicking a card opens the modal. Escape closes the active overlay. Only one overlay at a time.
**Done when:** All overlay state is managed in App.tsx. FABs open panels, cards open modal, Escape closes active overlay.

---

### Task 6: Add grow-from-card animation to ProjectModal

**File:** `src/features/projects/ProjectModal.tsx`
**Action:** Add Framer Motion animations for the grow-from-card entrance, backdrop fade, click-outside close, and exit animation.

**Specific changes:**

Add `cardOrigin` prop:
- `cardOrigin?: { x: number; y: number } | null` — card center coordinates

Calculate offset from viewport center:
```ts
const viewportCenterX = window.innerWidth / 2;
const viewportCenterY = window.innerHeight / 2;
const offsetX = cardOrigin ? cardOrigin.x - viewportCenterX : 0;
const offsetY = cardOrigin ? cardOrigin.y - viewportCenterY : 0;
```

Convert outer `div` (backdrop) to `motion.div`:
- `initial={{ opacity: 0 }}`
- `animate={{ opacity: 1 }}`
- `exit={{ opacity: 0 }}`
- Add `onClick={onClose}` for click-outside

Convert inner `div` (modal content) to `motion.div`:
- `initial={{ opacity: 0, scale: 0.8, x: offsetX, y: offsetY }}`
- `animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}`
- `exit={{ opacity: 0, scale: 0.95 }}`
- `transition={{ type: 'spring', damping: 25, stiffness: 300 }}`
- Add `onClick={(e) => e.stopPropagation()}` to prevent backdrop close when clicking content

**Verify:** Click a card → modal grows from the card's position. Click backdrop → closes. Click inside modal → doesn't close. Exit animation plays on close.
**Done when:** Modal opens with a spring animation from the card's position, closes with a fade/scale-down, and backdrop click closes it.

---

## Dependencies

- Phase 1: ProjectModal, AboutPanel, ContactPanel, Fab — structural shells (complete)
- Phase 2: ParallaxCard, ProjectsSection — animation system (complete)
- Framer Motion `AnimatePresence` + `motion` — already installed

---

## Files Modified Summary

| Action | File | Scope |
|--------|------|-------|
| **Modified** | `src/components/Fab.tsx` | Add `onClick` prop |
| **Modified** | `src/features/projects/ProjectCard.tsx` | Add `onClick` prop, ref, keyboard handler |
| **Modified** | `src/features/projects/ProjectsSection.tsx` | Accept + forward `onProjectClick` prop |
| **Modified** | `src/features/projects/ParallaxCard.tsx` | Accept + forward `onProjectClick` prop |
| **Modified** | `src/features/projects/ProjectModal.tsx` | Add `cardOrigin` prop, Framer Motion animations, click-outside |
| **Modified** | `src/App.tsx` | Overlay state, handlers, Escape listener, conditional rendering |
| **New** | `src/components/SlidePanel.tsx` | Reusable slide-in overlay (backdrop + animation + close) |
| **No change** | `src/features/about/AboutPanel.tsx` | Content stays as-is, wrapped by SlidePanel |
| **No change** | `src/features/contact/ContactPanel.tsx` | Content stays as-is, wrapped by SlidePanel |
| **No change** | `src/data/animationConfig.ts` | No interactivity changes |
| **No change** | `src/context/AnimationModeContext.tsx` | No interactivity changes |
| **No change** | `src/hooks/useScrollProgress.ts` | No interactivity changes |

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. Click a project card in the parallax viewport → modal grows from the card's position
3. Modal shows project name, description, tech badges, links — all existing content works
4. Click the X button → modal closes with exit animation
5. Click the backdrop (outside modal) → modal closes
6. Press Escape while modal is open → modal closes
7. Click About FAB → About panel slides in from right
8. Click Contact FAB → Contact panel slides in from right
9. Click panel backdrop → panel closes
10. Press Escape while panel is open → panel closes
11. Open modal, then press Escape → modal closes (not the non-existent panel)
12. Open About panel, click Contact FAB → About closes, Contact opens
13. Reduced motion fallback: cards in vertical stack are still clickable → modal opens (no grow animation needed, just fade)
14. Keyboard: Tab to a project card, press Enter → modal opens
15. Animation toggle (`A` key) still works when no overlay is open

**STOP after Phase 3 — wait for user approval before proceeding to Phase 4.**
