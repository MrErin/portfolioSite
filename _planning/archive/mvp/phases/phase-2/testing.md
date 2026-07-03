# Phase 2 Testing: Animation System (Sticky Viewport Pattern)

## Summary

Phase 2 implements a scroll-linked parallax animation system using a sticky viewport pattern. Cards float up individually through a pinned container as the user scrolls, creating a "falling down the rabbit hole" sensation.

**Key Changes:**
- Replaced CSS grid layout with 300vh tall section + 100vh sticky inner container
- Each card has its own staggered scroll window (35% of total scroll progress)
- Per-card opacity fade in/out with 15% fade margins
- Absolute positioning with left/right horizontal alternation (responsive: centered on mobile, alternating on desktop)
- Increased translateY range from 150px to 600px for full viewport travel
- Two toggleable animation modes: Straight Up and Diagonal Drift
- Reduced motion fallback shows simple vertical card stack

---

## Running the Application

```bash
npm run dev
```

Open browser to `http://localhost:5173`

---

## Manual Testing Steps

### 1. Initial Load and Layout
- [ ] Page loads without errors
- [ ] Hero section appears first
- [ ] Scroll down to reach Projects section
- [ ] "Projects" heading stays visible at top while scrolling through the section
- [ ] The section feels tall (approximately 3x viewport height)

### 2. Scroll-Linked Parallax Effect
- [ ] As you begin scrolling into the Projects section, Card 0 fades in from below the viewport
- [ ] Card 0 floats upward through the center of the viewport
- [ ] Card 0 fades out as it exits above the viewport
- [ ] As Card 0 exits, Card 1 fades in from below (sequential appearance)
- [ ] Cards continue appearing one at a time: Card 2, then Card 3
- [ ] Each card travels the full height of the viewport
- [ ] Scrolling **back up** reverses everything smoothly (scroll-linked, not one-shot)

### 3. Horizontal Positioning
- [ ] On desktop (> md breakpoint): even-indexed cards (0, 2) appear on the LEFT
- [ ] On desktop: odd-indexed cards (1, 3) appear on the RIGHT
- [ ] On mobile (< md breakpoint): all cards are centered horizontally

### 4. Animation Mode: Straight Up (Default)
- [ ] Press `A` key or click the toggle button in top-left
- [ ] Current mode shows "Straight Up"
- [ ] Cards move **vertically only** (upward)
- [ ] Subtle rotation is visible (-2° to +2°)
- [ ] Subtle scale pulse is visible (0.95 to 1.05)
- [ ] No horizontal drift

### 5. Animation Mode: Diagonal Drift
- [ ] Press `A` key or click toggle button
- [ ] Current mode shows "Diagonal Drift"
- [ ] Cards move vertically AND horizontally
- [ ] More dramatic rotation (-6° to +6°)
- [ ] Odd cards drift in opposite horizontal direction from even cards
- [ ] Scale pulse still active (0.95 to 1.05)

### 6. Reduced Motion Fallback
- [ ] Open browser DevTools
- [ ] Enable "prefers-reduced-motion: reduce" emulation
- [ ] Refresh the page
- [ ] Projects section shows a **simple vertical card stack**
- [ ] No sticky container, no 300vh height
- [ ] Cards are static (no parallax, no transforms)
- [ ] Layout is readable and accessible

### 7. Edge Cases

#### Scroll Speed
- [ ] Scroll slowly — animation is smooth
- [ ] Scroll quickly — animation is smooth
- [ ] Scroll rapidly back and forth — no jank, follows scroll position

#### Browser Resize
- [ ] Start on desktop, scroll to middle of animation
- [ ] Resize browser to mobile width
- [ ] Cards recenter horizontally
- [ ] Animation continues smoothly

#### Keyboard Navigation
- [ ] Press `A` key — mode toggles
- [ ] Press `A` in input field — mode does NOT toggle (correctly ignored)
- [ ] Tab to Animation Toggle button — visible focus ring
- [ ] Press Enter/Space on toggle button — mode toggles

---

## Expected Behaviors

| Scroll Position | Expected Visual State |
|----------------|----------------------|
| Just entering Projects section | Card 0 fades in from below viewport |
| 25% through Projects section | Card 0 near center, Card 1 beginning to appear |
| 50% through Projects section | Card 1 near center, Cards 0 and 2 visible |
| 75% through Projects section | Card 2 near center, Card 3 beginning to appear |
| Near end of Projects section | Card 3 fading out above viewport |

| Mode | Vertical | Horizontal | Rotation |
|------|----------|------------|----------|
| Straight Up | 600px travel | 0px | ±2° |
| Diagonal Drift | 600px travel | ±60px (alternating) | ±6° |

---

## Tuning Parameters

If the animation feels off, adjust these values in `src/data/animationConfig.ts`:

| Parameter | Current Value | File Location | Effect |
|-----------|--------------|---------------|--------|
| Section height | `300vh` | `ProjectsSection.tsx:58` | Total scroll runway |
| Window size | `0.35` | `animationConfig.ts:11` | How long each card is visible (0-1) |
| TranslateY range | `[600, -600]` | `animationConfig.ts:69,84` | Vertical travel distance |
| Fade margin | `15%` | `animationConfig.ts:55` | Speed of fade in/out |
| Horizontal offset | `5%-15%` | `ParallaxCard.tsx:89-91` | Left/right card placement |

---

## Phase Completion Checklist

- [x] `src/data/animationConfig.ts` — per-card scroll window functions added
- [x] `src/features/projects/ProjectsSection.tsx` — sticky viewport pattern implemented
- [x] `src/features/projects/ParallaxCard.tsx` — per-card transforms + absolute positioning
- [x] Reduced motion fallback renders simple vertical stack
- [x] Animation modes toggle via button and `A` key
- [x] TypeScript compiles without errors
- [x] Cards enter/exit sequentially at staggered scroll positions
- [x] Cards alternate left/right on desktop, centered on mobile
- [x] Scrolling back reverses the effect (scroll-linked, not one-shot)

---

## Known Behaviors (Not Bugs)

1. **Cards appear to "fall" upward** — This is the intended effect. Cards start at +600px (below viewport) and move to -600px (above viewport), creating the sensation of objects falling past you as you descend.

2. **Cards fade at edges** — Each card fades in as it enters the viewport and fades out as it exits. This prevents cards from "popping" into existence and creates smoother transitions.

3. **Horizontal offset varies by breakpoint** — On mobile, cards center at 5% offset. On md screens, 10%. On lg screens, 15%. This ensures cards stay within viewport bounds while creating visual spread.

4. **Last card may fade out before section ends** — With 4 cards at 35% window size, the last card's scroll window ends at 1.0 (exactly). This is by design; the section height can be adjusted if more scroll runway is needed.

---

## Polish Phase Adjustments

### Card 0 Visibility Issue

**Problem:** The first card (Card 0) is not visible for very long before it hits the top of the scroll window and fades out. This is because Card 0's scroll window starts at 0.0 (as soon as the section enters the viewport), so users barely see it before it begins exiting.

**Potential Solutions (to explore in Phase 4):**
1. **Delay first card's start** — Add an initial "buffer" so Card 0 doesn't begin its upward journey until the user has scrolled ~10-15% into the section
2. **Increase window size** — Make each card's scroll window larger (e.g., 0.40-0.45) so cards are visible longer
3. **Adjust section height** — Increase from 300vh to 400vh+ to give more scroll runway for the same number of cards
4. **Non-linear stagger** — Use tighter spacing for early cards and looser spacing for later cards

**Files to adjust:**
- `src/data/animationConfig.ts` — `getCardScrollWindow()` function (WINDOW_SIZE constant, stagger calculation)
- `src/features/projects/ProjectsSection.tsx` — Section height (currently `300vh`)

---

## Next Steps

After Phase 2 is approved:
- **Phase 3:** Add interactivity (card click → modal, FAB click → About/Contact panels)
- **Phase 4:** Polish (hover states, focus management, responsive refinement, accessibility audit)
