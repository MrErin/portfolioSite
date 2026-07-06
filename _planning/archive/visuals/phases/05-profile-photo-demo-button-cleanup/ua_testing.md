<!-- STATUS: COMPLETE -->

# Phase 5 Testing: Profile Photo, Demo Button & Cleanup

## At a Glance

Verify all placeholders are replaced and decorative additions (cave floor, scroll arrow, hero polish) look correct and behave consistently across all three whimsy stops.

### What To Verify

- [x] Profile photo renders as a circular crop in the About panel
- [x] Demo button appears for projects with demoUrl (Unfamiliar, Food Map), absent for others
- [x] Demo button has three distinct visual styles across stops 0/1/2
- [x] Cave floor appears below grid at stop 1, after parallax section at stop 2, hidden at stop 0
- [x] Hero is full-screen at stops 1–2, compact (30vh) at stop 0
- [x] Scroll bounce arrow visible at stop 2 (top of Projects section), not at stops 0/1
- [x] Odd last project card (5th) is centered at md+ viewport
- [x] Email reveal works (click shows mailto link)

---

## Automated Tests

No automated tests exist for this project. All verification is manual.

---

## Manual Testing Steps

### Quick Smoke Test (2–5 min)

1. Open the app. Default loads at **stop 2**.
2. Scroll down past the hero — confirm bouncing arrow is visible at the top of the Projects section.
3. Click any project card — confirm no demo placeholder div (grey "Demo placeholder" box should be gone).
4. Click the envelope FAB — confirm profile photo loads in the About panel.

- **Expected:** Bouncing arrow visible, demo placeholder gone, profile photo shows.

---

### Priority 1: Profile Photo (5 min)

**At stop 2 (default):**
1. Open About panel (envelope FAB).
2. Confirm headshot displays as a circular crop with `border-2 border-border` styling.
3. Confirm no gradient placeholder is visible.

**Error fallback:**
4. Temporarily rename `src/assets/headshot.jpeg` to break the import path, rebuild, and reload.
5. Confirm a dark purple gradient circle appears in place of the photo with correct sizing.
6. Restore the file.

- **Expected:** Real photo at normal load; gradient fallback on error. Same size/shape either way.

---

### Priority 1: Demo Button (10 min)

**Projects with demoUrl:** Unfamiliar, Chattanooga Pride Food Map
**Projects without demoUrl:** Single Player Co-Op, Kobo Annotation Extractor, Red Queen Dashboard

**At stop 0 (clean):**
1. Open Unfamiliar modal — confirm demo button is visible with `font-body`, neutral border, no glow. Text reads "View Website".
2. Open Single Player Co-Op modal — confirm NO demo button.
3. Open Red Queen Dashboard modal — confirm demo button is present (has demoUrl).

**At stop 1 (toned down):**
4. Move slider to stop 1. Open Unfamiliar modal.
5. Confirm button uses `font-heading`, purple border/tint, visible distinction from stop 0.

**At stop 2 (ornate):**
6. Move slider to stop 2. Open Unfamiliar modal.
7. Confirm button is gold, uppercase, letter-spaced, with gold glow on hover.
8. Confirm clicking "View Website" opens a new tab.

**Food Map:**
9. Open Chattanooga Pride Food Map modal — confirm demo button present.

- **Expected:** Button present for exactly 3 projects (Unfamiliar, Food Map, Red Queen). Three distinct visual states. External link opens new tab.
- **If fails:** Check `project.demoUrl` in `src/data/projects.ts`; check `DEMO_STYLES` keys in `ProjectModal.tsx`.

---

### Priority 1: Cave Floor (5 min)

**Stop 1:**
1. Set slider to stop 1. Scroll to the Projects section.
2. Confirm cave floor SVG appears below the 5-card grid at the bottom.
3. Confirm it is NOT visible at stop 0.

**Stop 2:**
4. Set slider to stop 2. Scroll through all parallax cards until the sticky section exits.
5. Confirm cave floor appears naturally after the last card scrolls away.

- **Expected:** Cave floor at stop 1 (below grid), cave floor at stop 2 (after parallax), hidden at stop 0.
- **Note:** At stop 2 there may be some blank scroll space before the cave floor comes into view — this is a known tradeoff (deferred item #4 in `_planning/deferred.md`).

---

### Priority 1: Hero Polish (5 min)

**Stop 0:**
1. Confirm hero is compact (~30vh height, not full-screen).
2. Confirm h1 reads "Portfolio".
3. Confirm hero silhouette is NOT visible.
4. Confirm NO scroll arrow visible in the hero area.

**Stops 1–2:**
5. Set slider to stop 1 — hero should be full-screen, silhouette visible, h1 "Rabbit Holes".
6. Set slider to stop 2 — same as stop 1.
7. At stop 2, scroll down to Projects section — confirm bouncing arrow at the top.

- **Expected:** Hero shrinks to compact at stop 0 only. Title toggles. Arrow only at stop 2 Projects section.

---

### Priority 1: Centered Grid (3 min)

1. Set slider to stop 0 or 1 (grid mode). Use a medium+ width viewport (>768px).
2. Confirm the 5th project card is centered below the 2×2 grid.
3. On mobile width (<768px), confirm all cards stack full-width.

- **Expected:** Centered last row on md+. Full-width stack on mobile.

---

### Priority 2: Contact Panel (5 min)

1. Open About panel, scroll to Contact section.
2. Confirm email item shows "Electromografied Mail" (not a real email address) initially.
3. Click it — confirm it switches to the real email address as a `mailto:` link.
4. Confirm GitHub link opens `https://github.com/mrerin`.
5. Confirm LinkedIn link opens `https://linkedin.com/in/erin-meaker`.

- **Expected:** Email revealed on first click. Real links on GitHub/LinkedIn.

---

## Edge Cases to Check

### Priority 1 (Test First)

- [x] **Reduced motion:** Enable `prefers-reduced-motion` in OS/browser settings. Scroll arrow should appear without animation (or not appear at all if parallax mode is hidden). Cave floor should still appear statically. No other regressions.
- [x] **Modal image + demo button:** Open a project with both an image and a demoUrl (Unfamiliar). Confirm the image header renders at h-92 (tall), followed by title, description, tech stack, then demo button, then repo link — in that order.
- [x] **Modal without demoUrl:** Open Single Player Co-Op. Confirm layout flows cleanly from tech stack directly to repo link — no blank space where demo button was.

### Priority 2

- [x] **FAB overlap:** Check FAB position on desktop — should sit at `md:bottom-32` (higher up), not overlapping the cave floor.
- [x] **Stop transitions:** Quickly toggle slider between all stops while project modal is open — confirm demo button style updates without flicker.

---

## Phase Completion Checklist

### Must Pass

- [x] Profile photo renders correctly; error fallback works
- [x] Demo button present for exactly the right projects; three visual states confirmed
- [x] Cave floor visible at stop 1 and stop 2; hidden at stop 0
- [x] Hero compact at stop 0, full-screen at stops 1–2
- [x] Odd grid row centered on md+
- [x] No visual regressions on existing features (slider, falling objects, parallax cards, modal open/close)

### Nice to Have

- [x] Cave floor blank scroll gap at stop 2 (deferred item #4) — no action needed now, just note if noticeable

### Known Limitations

- Cave floor at stop 2 has blank scroll space before it appears (post-card exit gap). See `_planning/deferred.md` item #4 for diagnosis and fix approach.
- Email reveal is client-side only — sophisticated scrapers with JS execution can still harvest the address.

---

## Review Findings

*Issues found during code review — requires attention before or during UA testing.*

### MEDIUM — codebase.md documents Hero.tsx incorrectly

`_planning/codebase.md` states:
> `Hero.tsx` — "...stop 0 divider, stop 2 scroll arrow with bounce..."

Neither feature is in `Hero.tsx`. The scroll arrow is in `ProjectsSection.tsx`; there is no hr divider anywhere (the hero shrinks instead). This will mislead future work. Fix before closing the phase:

**In `_planning/codebase.md`, `Hero.tsx` entry, change:**
> `stop 0 divider, stop 2 scroll arrow with bounce`

**To:**
> `compact 30vh at stop 0 (boringImages), full-screen stops 1–2; dynamic h1 title; ground silhouette visible stops 1–2`

Also fix ProjectsSection.tsx description: it says "cave floor **fade-in**" but the stop-2 cave floor has no animation — it's a static sibling element.

---

### MEDIUM — Duplicate import in ContactPanel.tsx

`src/components/about/ContactPanel.tsx` lines 2–3:
```tsx
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
```

Two imports from the same module. Should be one:
```tsx
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
```

---

### MEDIUM — Inline `style` for arrow filter in ProjectsSection.tsx

`ProjectsSection.tsx` line 103:
```tsx
style={{ filter: 'invert(1)' }}
```

This is an inline style used to invert the black SVG arrow to white. Inconsistent with the codebase pattern of using CSS classes (`.falling-object` uses a CSS class for filtering). Should be a named CSS class in `index.css`, e.g., `.svg-invert { filter: invert(1); }`.

---

### LOW — Double heading spacing in grid mode

`ProjectsSection.tsx` grid mode: heading has `mb-20` AND the card container has `mt-12`, creating 128px total gap vs the intended 80px. Likely unintentional double-spacing. Minor visual issue.

---

## Required Manual Renames

*No naming consistency issues found — this section is deleted per template instructions.*

---

## User Testing Notes

*Fill in this section after completing the testing steps above. Then run `/plan:review` to record your results and close the phase.*

### Issues Found

1.

### Error Messages / Logs

```
[paste error output here]
```

### Questions

1.

### General Feedback

[long-form notes, observations, or concerns]

### Deferred this session

| Item | Reason deferred | Added to deferred.md? |
|------|-----------------|-----------------------|
| | | |

### Result

<!-- WARNING: USER ONLY — Agents must never check these boxes. Only the user marks acceptance. -->
- [x] All good — ready to proceed
- [ ] Issues found — see above
