<!-- STATUS: COMPLETE -->

# Phase 4 Testing: Falling Objects

## At a Glance

Verify that SVG silhouettes appear at stops 1 and 2, scroll correctly behind cards, glow in static mode, and are hidden where expected.

### What To Verify
- [x] Objects visible and tinted (not black) at stops 1 and 2
- [x] Objects scroll behind project cards at stop 2 (not on top)
- [x] Random glow cycles through objects at stop 1
- [x] Objects hidden at stop 0
- [x] Objects hidden with prefers-reduced-motion
- [x] No console errors

---

## Automated Tests

No automated tests for this phase. The feature is purely decorative animation — correctness is visual-only and tested manually.

---

## Manual Testing Steps

### Quick Smoke Test (2–5 min)

1. Open the app at stop 2 (slider fully right — max whimsy)
2. Scroll slowly through the Projects section
   - **Expected:** Multiple SVG silhouettes drift behind the project cards. Silhouettes are tinted muted purple/blue — not black, not white. Cards remain in front.
3. Move slider to stop 1
   - **Expected:** 6 silhouettes appear at fixed positions on the left and right edges. One silhouette glows faintly every few seconds in random order.
4. Move slider to stop 0
   - **Expected:** No silhouettes visible anywhere in the Projects section.

---

### Priority 1 — Parallax falling mode (stop 2) (10 min)

1. Set slider to stop 2. Scroll to the Projects section.
2. Scroll through slowly from top to bottom of the section.
   - **Expected:** Silhouettes stream past continuously. Multiple objects visible at once (~7–8 based on 36 slots). Cards remain in foreground throughout.
   - **If fails:** Check `FallingObjects` renders before `ParallaxCard` in JSX (paint-order z-stacking).
3. Check that the same silhouette shape appears more than once (objects repeat — pool of 6 across 36 slots).
4. Check that objects don't intercept clicks on cards.
   - **Expected:** Container has `pointer-events: none`, so clicks on the card area work normally.

### Priority 1 — Static glow mode (stop 1) (5 min)

1. Set slider to stop 1. Scroll to the Projects section.
2. Wait 10–15 seconds, observing the background silhouettes.
   - **Expected:** One silhouette glows faintly at a time. Each glow lasts ~2.5s. A different object glows each time (no immediate repeat). Glow color is gold/amber with a soft halo.
3. Verify objects are on the left and right edges, not overlapping the card grid.

### Priority 1 — Hidden states (3 min)

1. Set slider to stop 0.
   - **Expected:** No silhouettes visible in the Projects section (neither static nor falling).
2. In browser DevTools, enable `prefers-reduced-motion: reduce`.
   - **Expected:** No silhouettes visible. The reduced-motion fallback renders a plain vertical stack with no FallingObjects.
3. Resize browser to < 768px (below `md` breakpoint) at stop 2.
   - **Expected:** No silhouettes visible (hidden by `hidden md:block`).

---

## Edge Cases to Check

### Priority 1 (Test First)
- [x] No console errors or React warnings during any scroll position at stop 2
- [x] Glow interval clears cleanly on slider change (switch stop 1 → stop 0 → stop 1 rapidly; no multiple glows firing simultaneously)
- [x] Objects tint looks correct — muted purple/blue, not harsh white or invisible black

### Priority 2
- [x] Visual density at stop 2: ~7–8 objects visible at once feels atmospheric, not cluttered
- [x] Objects at stop 2 feel distinctly "behind" the cards (lower opacity, no diagonal drift)
- [x] Wide horizontal distribution (5–85%) — verify objects don't feel edge-crowded or center-crowded

---

## Phase Completion Checklist

### Must Pass
- [x] All manual tests pass
- [x] Edge cases checked
- [x] No regressions in existing features (cards, slider, modal, hero silhouette)

### Nice to Have
- [x] Visual density of falling mode feels right (can adjust `FALLING_SLOT_COUNT` if too many/few)
- [x] Glow interval timing feels natural (can adjust `GLOW_INTERVAL_MS` if too fast/slow)

### Known Limitations
- Falling mode uses wide horizontal distribution (5–85%) rather than strict edge-biasing. Objects may appear behind card content area, but at 20% opacity they don't obscure anything. This was an intentional build-time decision.
- `FALLING_SLOT_COUNT = 36` (vs planned 15–20) results in slightly higher density than originally spec'd. Adjust if visually too busy.
- `getObjectOpacityRange` is exported from `animationConfig.ts` but not currently used anywhere (the opacity calculation is done inline in `FallingObject`). Dead export — no functional impact.

---

## Review Findings

### MEDIUM — Falling mode horizontal distribution is not edge-biased

**File:** `src/components/projects/FallingObjects.tsx:51`

The plan specified objects should be biased toward viewport edges (0–15% or 75–100%) to frame the cards rather than overlap them. The actual implementation uses `Math.random() * 80 + 5` (5–85% range) — wide distribution across the full viewport width.

**Impact:** Objects can appear directly behind card content at center. Cards render on top (z-index paint order), so click targets are unaffected. Visual impact is low given 20% opacity.

**Recommended action during UA testing:** Observe whether the center-spread looks intentional or cluttered. If objects feel like they're competing with cards rather than framing them, the fix is to change the `generateSlots` fallback to use the same edge-biased logic as static mode.

### LOW — Slot count documentation mismatch

`state.md` records the build as "18 scroll-linked slots" but `FALLING_SLOT_COUNT = 36` in code. No functional issue — just stale documentation. Correct by checking the actual visual result.

### LOW — Unused export

`animationConfig.ts:127` — `getObjectOpacityRange` is exported but not imported anywhere. Not a bug; the opacity is computed inline in `FallingObject`. Clean up opportunistically.

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

All three review findings (wide horizontal distribution, slot count of 36, unused `getObjectOpacityRange` export) confirmed as intentional decisions made during the build phase. No changes needed.

### Deferred this session

None.

### Result

<!-- ⚠️ USER ONLY — Agents must never check these boxes. Only the user marks acceptance. -->
- [x] All good — ready to proceed
- [ ] Issues found — see above
