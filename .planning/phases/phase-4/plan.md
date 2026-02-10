# Phase 4: Polish

## Goal

Strip out the dev-only animation toggle system, lock in a more pronounced diagonal drift effect, fix Card 0's scroll timing, consolidate FABs into a single email button with a combined About + Contact panel, add focus trapping, responsive breakpoints, and finish the visual/accessibility polish.

## Dependencies

- Phase 3: Interactivity (accepted)
- Decision #7: Card 0 scroll timing fix
- Decision #8: Remove animation toggle, hardcode diagonal drift (more pronounced)
- Decision #9: Single FAB with combined About + Contact panel

---

## Tasks

### Task 1: Remove animation mode system and hardcode diagonal drift

**Files:**
- `src/components/AnimationToggle.tsx` — **DELETE**
- `src/context/AnimationModeContext.tsx` — **DELETE**
- `src/components/index.ts` — Remove `AnimationToggle` export
- `src/App.tsx` — Remove `AnimationModeProvider` wrapper, `AnimationToggle` render, and import
- `src/data/animationConfig.ts` — Remove `AnimationMode` type, `STRAIGHT_UP_CONFIG`, `getParallaxConfig`. Rename `DIAGONAL_DRIFT_CONFIG` → `PARALLAX_CONFIG`
- `src/features/projects/ParallaxCard.tsx` — Remove `useAnimationMode` import/call. Use `PARALLAX_CONFIG` directly instead of `getParallaxConfig(mode)`

**Action:**
1. Delete `AnimationToggle.tsx` and `AnimationModeContext.tsx`
2. In `animationConfig.ts`:
   - Remove `AnimationMode` type
   - Remove `STRAIGHT_UP_CONFIG`
   - Rename `DIAGONAL_DRIFT_CONFIG` → `PARALLAX_CONFIG`
   - Remove `getParallaxConfig` function
3. In `ParallaxCard.tsx`:
   - Remove `import { useAnimationMode }` and `const { mode } = useAnimationMode()`
   - Replace `const config = getParallaxConfig(mode)` with `import { PARALLAX_CONFIG } from ...` used directly
   - The horizontal direction flip for odd cards stays — just reference `PARALLAX_CONFIG` instead
   - Remove the `mode === 'diagonal-drift'` guard on translateX — it's always diagonal now
4. In `App.tsx`:
   - Remove `AnimationModeProvider` import and wrapper
   - Remove `AnimationToggle` import and `<AnimationToggle />` render
5. In `components/index.ts`:
   - Remove `AnimationToggle` export line

**Verify:** `npx tsc --noEmit` passes. No references to `AnimationMode`, `useAnimationMode`, `AnimationToggle`, or `AnimationModeProvider` remain in the codebase. Scrolling shows only diagonal drift behavior.
**Done when:** All animation mode code is removed. `PARALLAX_CONFIG` is the single source of truth.

---

### Task 2: Make diagonal drift more pronounced

**File:** `src/data/animationConfig.ts`

**Action:** Increase the transform values in `PARALLAX_CONFIG` to make the effect more dramatic:
- `rotateOutput`: `[-6, 6]` → `[-10, 10]` (more tilt)
- `translateXOutput`: `[-60, 60]` → `[-120, 120]` (wider drift)
- Consider `scaleOutput`: `[0.95, 1.05]` → `[0.9, 1.1]` (more size variation)

**Verify:** Scroll through projects section. Cards should swing wider and tilt more noticeably.
**Done when:** The diagonal drift feels intentional and dramatic, not subtle.

---

### Task 3: Fix Card 0 scroll timing

**File:** `src/data/animationConfig.ts`

**Action:** Card 0's scroll window currently starts at `0.0`, meaning it's already mid-animation when the user reaches the section. Fix by adding an initial buffer to `getCardScrollWindow()`.

Approach — add initial delay buffer:
```ts
const INITIAL_DELAY = 0.10; // 10% buffer before first card starts
const stagger = totalCards > 1 ? (1 - WINDOW_SIZE - INITIAL_DELAY) / (totalCards - 1) : 0;
const start = INITIAL_DELAY + index * stagger;
```

This shifts all cards later by 10% of the scroll range, giving Card 0 a visible entrance. Verify that the last card (Card 3) still fully completes — `start + WINDOW_SIZE` should be `<= 1.0`.

**Verify:** Scroll into the projects section. Card 0 should enter visibly from below (not already partially faded). All 4 cards still complete their animations within the section.
**Done when:** Card 0 has a clear entrance animation visible to the user.

---

### Task 4: Consolidate FABs to single email button

**Files:**
- `src/App.tsx` — Remove `FaUser` import, remove About FAB, keep only email FAB

**Action:**
1. Remove the About FAB (`<Fab icon={<FaUser />} .../>`)
2. Remove `FaUser` import from `react-icons/fa`
3. The single remaining FAB opens the combined panel (see Task 5)
4. Remove the `role="group"` wrapper `<div>` since there's only one button — simplify to just the FAB
5. Update the FAB label to something like "Open about & contact"

**Verify:** Only one FAB visible in bottom-right. Clicking it opens the panel.
**Done when:** Single email FAB, no user icon FAB.

---

### Task 5: Combine About + Contact into single panel

**Files:**
- `src/App.tsx` — Simplify panel state: remove `'about' | 'contact'` union, use boolean `panelOpen`
- `src/App.tsx` — Single `<SlidePanel>` renders both `<AboutPanel />` and `<ContactPanel />` stacked
- `src/features/about/AboutPanel.tsx` — Remove `<aside>` wrapper (panel provides the container), keep inner content
- `src/features/contact/ContactPanel.tsx` — Remove `<aside>` wrapper, keep inner content

**Action:**
1. In `App.tsx`:
   - Replace `activePanel: 'about' | 'contact' | null` with `panelOpen: boolean` (or just `isPanelOpen`)
   - Single `handleOpenPanel` / `handleClosePanel` pair
   - Single `<AnimatePresence>` block for the panel
   - Inside `<SlidePanel>`, render `<AboutPanel />` then a visual divider then `<ContactPanel />`
   - Update Escape handler: `if (panelOpen) handleClosePanel()`
2. In `AboutPanel.tsx`:
   - Change outer `<aside>` to `<section>` or `<div>` since SlidePanel is the dialog
   - Remove `aria-label="About"` (or keep as section label)
3. In `ContactPanel.tsx`:
   - Same — change `<aside>` to `<section>` or `<div>`

**Verify:** FAB opens one panel. Panel shows About content at top, divider, Contact content below. Scrollable if content overflows. Close works (X, backdrop, Escape).
**Done when:** Single unified panel with both sections.

---

### Task 6: Focus trapping in modal and panel

**Files:**
- `src/features/projects/ProjectModal.tsx` — Add focus trap
- `src/components/SlidePanel.tsx` — Add focus trap

**Action:** Implement a lightweight focus trap for both overlay components:
1. On mount: save `document.activeElement`, focus the dialog container (or the close button)
2. On unmount: restore focus to the previously focused element
3. Trap Tab key: query all focusable elements inside the dialog, wrap Tab/Shift+Tab to cycle within them
4. Use a shared `useFocusTrap` hook in `src/hooks/` to avoid duplication

**Verify:** Open modal → Tab cycles only within modal content (close button, links). Open panel → Tab cycles within panel. Closing overlay returns focus to the element that triggered it.
**Done when:** Focus never escapes to content behind the overlay.

---

### Task 7: Responsive breakpoints

**Files:**
- `src/features/projects/ProjectsSection.tsx` — Mobile section height adjustment
- `src/features/projects/ParallaxCard.tsx` — Mobile card sizing and positioning
- `src/features/projects/ProjectModal.tsx` — Mobile modal sizing
- `src/features/hero/Hero.tsx` — Mobile typography scaling

**Action:**
1. **ProjectsSection**: On mobile, reduce section height (`200vh` instead of `300vh`) or use media-based values
2. **ParallaxCard**: On mobile (`< md`), center cards instead of left/right alternation. Already has `left-[5%]` / `right-[5%]` for small screens — verify this works. May need `w-[90%]` or similar
3. **ProjectModal**: Already has `max-w-2xl w-full` and `p-4` — verify on small viewports. Consider smaller padding on mobile
4. **Hero**: Check font sizes scale down — `text-5xl md:text-7xl` patterns

**Verify:** Resize browser to 375px width. All content readable, no horizontal overflow, cards centered, modal fits.
**Done when:** Site is usable and readable from 375px to 1920px+.

---

### Task 8: Hover states and dark mood styling

**Files:**
- `src/features/projects/ProjectCard.tsx` — Enhance card hover (glow, border color shift)
- `src/components/Fab.tsx` — Already has hover states — verify and refine
- `src/features/projects/ProjectModal.tsx` — Link hover states
- `src/index.css` — Any global dark mood tweaks

**Action:**
1. **ProjectCard hover**: Add a subtle purple glow on hover (`shadow-glow-purple` or custom), smooth border color transition
2. **Fab hover**: Already styled — verify glow is visible
3. **Modal links**: Verify hover states on repo/demo links
4. **Global**: Check that all text hierarchy (primary → secondary → muted → dim) reads well against backgrounds

**Verify:** Hover over cards, FAB, modal links. Transitions are smooth, glow is visible, nothing looks jarring.
**Done when:** Hover interactions feel polished and consistent.

---

### Task 9: Final accessibility audit

**Files:** Multiple — depends on findings

**Action:**
1. Run `npx tsc --noEmit` — clean type check
2. Verify skip-link works (Tab on page load → Enter → jumps to `#main-content`)
3. Verify all interactive elements have visible focus indicators (`:focus-visible`)
4. Verify `prefers-reduced-motion` fallback still works after all changes
5. Verify `aria-label` values are accurate after panel consolidation
6. Verify all links have accessible names
7. Check color contrast of text against dark backgrounds (at minimum: text-primary on void, text-secondary on void, badges text on surface-dim)
8. Verify the combined panel has correct ARIA structure

**Verify:** Tab through entire page. Every interactive element is reachable and visually indicated. Screen reader testing if possible.
**Done when:** All accessibility basics pass manual audit.

---

### Task 10: Particle effects

**File:** `src/components/ParticleField.tsx` — **NEW**

**Action:** Add subtle floating dots/particles in the background of the projects section for atmosphere. Use CSS animations or a lightweight canvas approach. Keep it purely decorative (`aria-hidden`).

**Verify:** Particles visible but subtle. No performance issues. `prefers-reduced-motion` disables them.
**Done when:** Visual atmosphere enhanced without distraction.

---

## Files Modified Summary

| Action | File | Scope |
|--------|------|-------|
| **DELETE** | `src/components/AnimationToggle.tsx` | Remove entirely |
| **DELETE** | `src/context/AnimationModeContext.tsx` | Remove entirely |
| **Modified** | `src/components/index.ts` | Remove AnimationToggle export |
| **Modified** | `src/data/animationConfig.ts` | Remove mode system, rename config, increase values, fix Card 0 |
| **Modified** | `src/features/projects/ParallaxCard.tsx` | Remove mode context, use PARALLAX_CONFIG directly |
| **Modified** | `src/App.tsx` | Remove provider/toggle, consolidate FABs, simplify panel state |
| **Modified** | `src/features/about/AboutPanel.tsx` | Change wrapper element for combined panel |
| **Modified** | `src/features/contact/ContactPanel.tsx` | Change wrapper element for combined panel |
| **Modified** | `src/features/projects/ProjectModal.tsx` | Focus trap, responsive tweaks |
| **Modified** | `src/components/SlidePanel.tsx` | Focus trap |
| **Modified** | `src/features/projects/ProjectsSection.tsx` | Responsive height |
| **Modified** | `src/features/projects/ProjectCard.tsx` | Hover state polish |
| **Modified** | `src/features/hero/Hero.tsx` | Responsive typography check |
| **New** | `src/hooks/useFocusTrap.ts` | Shared focus trap hook |
| **New (optional)** | `src/components/ParticleField.tsx` | Decorative particle effect |

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. No references to `AnimationMode`, `AnimationToggle`, `AnimationModeContext`, or `useAnimationMode` in codebase
3. Cards show pronounced diagonal drift (wider swing, more tilt)
4. Card 0 enters visibly from below — not mid-fade on section entry
5. Single email FAB in bottom-right
6. FAB opens combined panel: About at top, Contact below, scrollable
7. Panel closes via X, backdrop, Escape
8. Modal focus trapped — Tab cycles within
9. Panel focus trapped — Tab cycles within
10. Site usable at 375px width — no overflow, readable text
11. Hover states smooth and visible on cards, FAB, modal links
12. Skip-link works
13. `prefers-reduced-motion` shows static card stack (no parallax, no particles)
14. All ARIA labels accurate

**STOP after Phase 4 — wait for user approval before any further work.**
