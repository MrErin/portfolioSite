# Phase 1: Layout & Structure — Testing Guide

**Estimated Testing Time:** 10-15 minutes

**What was built:**
- Hero section with gradient background and decorative elements
- 4 project cards in a responsive grid
- 2 floating action buttons (FABs) in bottom-right corner
- Modal, About, and Contact structures (not visible yet - Phase 3)

---

## Quick Start (2 minutes)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:5173/

3. **Quick visual check:**
   - [ ] Page loads without errors
   - [ ] Hero section has gold "Portfolio" title
   - [ ] 4 project cards visible
   - [ ] 2 circular buttons in bottom-right corner

---

## Section-by-Section Testing

### Hero Section (3 minutes)

**File:** `src/features/hero/Hero.tsx`

**What to check:**

- [ ] Background is a gradient (dark at top, darker at bottom)
- [ ] "Portfolio" text is gold color, large font
- [ ] Decorative thin gold line between title and tagline
- [ ] Tagline says "Falling down the rabbit hole..."

**Responsive check:**
- [ ] Shrink browser window - title text gets smaller
- [ ] On mobile (< 768px): title is medium size
- [ ] On desktop (> 1024px): title is very large

**Why this matters:** The gradient creates the "descent" feeling of falling down a rabbit hole. Gold accent draws attention to your name.

---

### Project Cards (4 minutes)

**File:** `src/features/projects/ProjectCard.tsx`

**What to check:**

- [ ] 4 cards visible (Cheshire Engine, Looking Glass API, Caterpillar CLI, Red Queen Dashboard)
- [ ] Each card has a gradient thumbnail placeholder (purple diagonal)
- [ ] Project name visible on each card
- [ ] Tech stack badges visible (small pills)

**Hover effect:**
- [ ] Hover over any card - border turns purple
- [ ] Background gets slightly brighter
- [ ] Project name turns gold

**Responsive check:**
- [ ] Mobile: cards stacked in single column
- [ ] Tablet/Desktop (≥ 768px): cards in 2-column grid

**Why this matters:** Hover effects hint that cards are clickable (even though they don't do anything yet - that's Phase 3).

---

### FAB Navigation (3 minutes)

**File:** `src/components/Fab.tsx`

**What to check:**

- [ ] Two circular buttons in bottom-right corner
- [ ] Top button: person icon
- [ ] Bottom button: envelope icon
- [ ] Buttons stay fixed when scrolling

**Hover effect:**
- [ ] Hover over either button - purple glow appears
- [ ] Background darkens slightly
- [ ] Icon gets brighter

**Click test:**
- [ ] Click either button - nothing happens (expected in Phase 1)

**Why this matters:** FABs will open About/Contact panels in Phase 3. The glow effect draws attention.

---

### Accessibility Check (2 minutes)

**Tab navigation:**
- [ ] Press Tab - focus appears on elements
- [ ] Focus ring is visible (purple outline)
- [ ] Tab order makes sense

**Screen reader (optional):**
- [ ] FABs announce "Open about panel" and "Open contact panel"

---

## Edge Cases to Check

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Resize window to mobile width | Cards stack vertically, FABs still visible | [ ] |
| Resize to very wide screen | Cards stay centered, max-width respected | [ ] |
| Zoom in/out (Ctrl +/-) | Text scales proportionally | [ ] |
| Click project card | Nothing happens (correct for Phase 1) | [ ] |

---

## Common Issues & Fixes

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Gold looks yellow | Browser color profile | Expected - gold varies by display |
| Cards overlap | Window too narrow | Expected - grid adapts to width |
| FABs cover content | On small screens | Expected - FABs always top-right |

---

## What's NOT Working Yet (Expected)

These will be added in later phases:

- ❌ Clicking project cards does nothing (Phase 3 adds modal)
- ❌ Clicking FABs does nothing (Phase 3 adds panels)
- ❌ No scroll animations yet (Phase 2 adds these)
- ❌ No project images (using gradient placeholders)

---

## Success Criteria

Phase 1 is complete when:

- [ ] All TypeScript checks pass (`npx tsc --noEmit`)
- [ ] Prettier passes (`npx prettier --check src/`)
- [ ] Dev server runs without errors
- [ ] Hero section looks good visually
- [ ] 4 project cards display correctly
- [ ] FABs visible with hover effects
- [ ] Responsive layout works on mobile

---

## Ready for Phase 2?

**Phase 2 will add:**
- Scroll-triggered animations for project cards
- "Falling" animation effect (straight up mode)
- Toggle to switch animation modes

**To proceed:**
1. Complete all checks above
2. Confirm everything looks right
3. Say "Proceed to Phase 2" or "Continue"

---

**Questions to ask yourself before Phase 2:**
- Do you like the color scheme? (adjust in `src/index.css`)
- Are cards too big/too small? (adjust in `ProjectCard.tsx`)
- Should FABs be in a different corner? (adjust in `App.tsx`)

**Note:** Any visual tweaks now are easier than later. Take a moment to customize!
