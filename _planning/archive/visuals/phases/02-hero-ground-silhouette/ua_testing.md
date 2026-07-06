<!-- STATUS: COMPLETE -->

# Phase 2 Testing: Hero Ground Silhouette

## At a Glance

**Verify the underground silhouette image renders correctly at the bottom of the hero, responds to whimsy slider changes, and scales across viewport sizes.**

### What To Verify
- [x] Silhouette visible at the bottom of the hero section (stops 1–2)
- [x] Silhouette hidden at stop 0 (professional mode) with smooth fade
- [x] No horizontal scrollbar or layout overflow at any viewport width
- [x] Text and particles remain unobstructed

---

## Automated Tests

No automated tests for this phase — purely visual/decorative changes with no business logic. All verification is manual.

---

## Manual Testing Steps

### Quick Smoke Test (2-5 min)
1. Load the site in your browser
2. Confirm a dark silhouette (earth/roots) is visible at the bottom of the hero viewport
3. Move the whimsy slider to stop 0 (leftmost) — silhouette should fade out
4. Move the slider to stop 1 or 2 — silhouette should fade back in
- **Expected:** Smooth 300ms fade transition, no layout shift
- **If fails:** Check browser console for SVG load errors; verify `herosilhouette.svg` exists in `src/assets/`

### Silhouette Positioning (5 min)

1. At stop 2 (max whimsy), scroll the hero into full view
2. Confirm the silhouette is anchored to the bottom edge of the hero section
3. Confirm text ("Portfolio" heading, subtitle) remains centered and unobscured
4. Confirm floating particles render above the silhouette (particles visible on top)
- **Expected:** Clear visual layering — gradient bg < silhouette < particles < text
- **If fails:** Z-index stacking issue; check DOM order in Hero.tsx

### Responsive Scaling (5-10 min)

1. Open browser DevTools and test these viewport widths:
   - **Mobile narrow** (~375px): Silhouette should be proportionally short but still visible
   - **Mobile** (~414px): Same — short but readable organic shapes
   - **Tablet** (~768px): Silhouette taller, more detail visible
   - **Desktop** (~1440px): Full-width silhouette at comfortable height
   - **Ultrawide** (~2560px): Check that silhouette height doesn't overwhelm the hero
2. At each size, confirm no horizontal scrollbar appears
- **Expected:** Silhouette scales naturally via aspect ratio; no overflow
- **If fails:** Check for missing `overflow-hidden` on the hero section

---

## Edge Cases to Check

### Priority 1 (Test First)
- [x] Whimsy slider at stop 0 — silhouette fully hidden (opacity 0)
- [x] Whimsy slider at stop 1 — silhouette visible
- [x] Whimsy slider at stop 2 — silhouette visible
- [x] Rapid slider toggling between stops — no flash/glitch during transitions
- [x] Page load at default (stop 2) — silhouette visible immediately, no flash of hidden state

### Priority 2
- [x] Ultrawide viewport (>2000px) — silhouette height check (may need `max-h` if it looks too tall)
- [x] Very short viewport (~500px height) — silhouette doesn't overlap hero text
- [x] Reduced motion preference — silhouette should still appear/disappear (transition may be suppressed by `prefers-reduced-motion` media query, but opacity toggle should still work)
- [x] Right-click on silhouette — should NOT show image context menu (pointer-events-none)

---

## Phase Completion Checklist

### Must Pass
- [x] Silhouette visible at stops 1–2, hidden at stop 0
- [x] Smooth opacity transition on whimsy change
- [x] No layout overflow at any tested viewport
- [x] Text and particles unobstructed

### Nice to Have
- [x] Silhouette proportions feel right on ultrawide (>2000px)

### Known Limitations
- On ultrawide viewports (>2000px), the silhouette's natural aspect ratio may produce a height >400px. If this looks overwhelming, a `max-h` constraint can be added in a follow-up.

---

## Review Findings

1. **codebase.md tree description had wrong stop numbers** (line 32): Said "visible stops 0–1, hidden at stop 2" but actual behavior is visible stops 1–2, hidden at stop 0. Fixed during review — the Patterns section (line 84) was already correct.

2. **Minor scope creep:** `ProjectsSection.tsx` received a `relative` class addition on the reduced-motion section. Not in the plan. Impact is trivial (consistency with other render paths that already have `relative`), but worth noting.

---

## User Testing Notes

*Fill in this section after completing the testing steps above. Then run `/plan:review` to record your results and close the phase.*

### Issues Found

None.

### Error Messages / Logs

None.

### Questions

None.

### General Feedback

All checks passed — silhouette renders correctly across viewports, whimsy toggle works smoothly, no overflow issues.

### Deferred this session

*Agents: fill this out as you work — do not wait for /plan:review. Each item deferred (not fixed now) must be listed here AND added to `_planning/deferred.md` before the conversation ends.*

| Item | Reason deferred | Added to deferred.md? |
|------|-----------------|-----------------------|
| | | |

### Result

<!-- ⚠️ USER ONLY — Agents must never check these boxes. Only the user marks acceptance. -->
- [x] All good — ready to proceed
- [ ] Issues found — see above
