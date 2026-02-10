# Phase 3: Interactivity - Testing

## What Was Built

Phase 3 wired up all user interactions for the portfolio site:

- **Card click → modal open**: Project cards are now clickable with a grow-from-card animation
- **Modal state management**: Selected project and card origin tracked in App.tsx
- **Modal close**: X button, backdrop click, and Escape key all close the modal
- **FAB → panel open**: About and Contact FABs open slide-in panels
- **Panel close**: Backdrop click and Escape key close panels
- **Escape priority**: Modal closes first, then panel (only one overlay at a time)
- **Keyboard accessibility**: Tab to cards, Enter/Space opens modal

## Files Modified

| File | Changes |
|------|---------|
| `src/components/Fab.tsx` | Added `onClick?: () => void` prop |
| `src/components/SlidePanel.tsx` | **NEW** - Reusable slide-in overlay with backdrop, close button, and click-outside |
| `src/components/index.ts` | Exported `SlidePanel` |
| `src/features/projects/ProjectCard.tsx` | Added `onClick` prop, ref for rect capture, keyboard handler (Enter/Space) |
| `src/features/projects/ParallaxCard.tsx` | Added `onProjectClick` prop, forwards to ProjectCard |
| `src/features/projects/ProjectsSection.tsx` | Added `onProjectClick` prop, forwards to ParallaxCard and reduced-motion fallback |
| `src/features/projects/ProjectModal.tsx` | Added `cardOrigin` prop, Framer Motion animations (grow-from-card entrance, exit) |
| `src/App.tsx` | Added overlay state, handlers, Escape listener, conditional rendering |

## Manual Testing Steps

### 1. Project Card Click → Modal

1. Scroll to the Projects section
2. Click on any project card in the parallax viewport
3. **Verify**: Modal grows from the clicked card's position with spring animation
4. **Verify**: Modal shows project name, description, tech badges, and links
5. **Verify**: Backdrop dims the background

### 2. Modal Close - X Button

1. With modal open, click the X button in the top-right
2. **Verify**: Modal closes with fade/scale-down exit animation

### 3. Modal Close - Backdrop Click

1. Open a project modal
2. Click on the dimmed backdrop (outside the modal content)
3. **Verify**: Modal closes with exit animation

### 4. Modal Close - Escape Key

1. Open a project modal
2. Press Escape
3. **Verify**: Modal closes with exit animation

### 5. About FAB → Panel

1. Click the "Open about panel" FAB (user icon)
2. **Verify**: About panel slides in from the right
3. **Verify**: Panel shows profile photo placeholder, bio, and skills badges

### 6. Contact FAB → Panel

1. Click the "Open contact panel" FAB (envelope icon)
2. **Verify**: Contact panel slides in from the right
3. **Verify**: Panel shows email, GitHub, and LinkedIn links

### 7. Panel Close - Backdrop Click

1. Open About or Contact panel
2. Click on the dimmed backdrop
3. **Verify**: Panel slides out to the right and closes

### 8. Panel Close - Escape Key

1. Open About or Contact panel
2. Press Escape
3. **Verify**: Panel closes with slide-out animation

### 9. Panel Close - X Button

1. Open About or Contact panel
2. Click the X button in the top-right
3. **Verify**: Panel closes with slide-out animation

### 10. Only One Overlay at a Time

1. Open a project modal
2. Click the About FAB
3. **Verify**: Modal closes, About panel opens
4. Click Contact FAB
5. **Verify**: About panel closes, Contact panel opens

### 11. Escape Priority - Modal First

1. Open both a modal and a panel (not possible directly, but test Escape priority)
2. **Note**: The implementation prioritizes closing modal first if both somehow were open

### 12. Keyboard Accessibility - Tab Navigation

1. Press Tab to navigate to a project card
2. **Verify**: Card receives focus visible indicator
3. Press Enter or Space
4. **Verify**: Modal opens

### 13. Reduced Motion Fallback

1. Enable prefers-reduced-motion in your OS/browser settings
2. Refresh the page
3. **Verify**: Cards appear in a simple vertical stack
4. Click any card
5. **Verify**: Modal still opens (animations may be reduced depending on implementation)

### 14. Animation Toggle Still Works

1. With no overlay open, press `A` key
2. **Verify**: Animation mode switches between "Straight Up" and "Diagonal Drift"
3. **Verify**: Cards animate differently based on mode

## Expected Behaviors

| Interaction | Expected Result |
|-------------|-----------------|
| Click card | Modal grows from card position |
| Click modal backdrop | Modal closes with exit animation |
| Click X button | Modal/panel closes |
| Press Escape | Closes modal first, then panel |
| Click About FAB | About panel slides in from right |
| Click Contact FAB | Contact panel slides in from right |
| Click panel backdrop | Panel slides out |
| Tab + Enter on card | Modal opens |
| Click FAB while modal open | Modal closes, panel opens |

## Edge Cases to Check

1. **Card at edge of viewport**: Click a card near the viewport edge — animation should still work correctly
2. **Scroll while modal open**: Modal stays fixed, backdrop stays in place
3. **Resize window**: Modal remains centered
4. **Rapid clicking**: Multiple rapid clicks shouldn't cause state issues
5. **Tab order**: When modal opens, focus should be manageable (focus trapping comes in Phase 4)

## Phase Completion Checklist

- [ ] Card click opens modal with grow-from-card animation
- [ ] Modal closes via X button, backdrop click, and Escape
- [ ] About FAB opens slide-in panel
- [ ] Contact FAB opens slide-in panel
- [ ] Panels close via X button, backdrop click, and Escape
- [ ] Only one overlay open at a time (panel replaces modal, modal replaces panel)
- [ ] Tab navigation works on cards (Enter/Space opens modal)
- [ ] Reduced motion fallback still allows card clicks
- [ ] Animation toggle (A key) still works when no overlay is open
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)

## Notes for Phase 4

- Focus trapping in modal needs to be implemented
- Card 0 scroll timing fix is still pending (Decision #7)
- Focus management when opening/closing overlays needs polish
- Responsive breakpoints for panel behavior on mobile

---

**Build Status**: Complete - Ready for user testing and approval
