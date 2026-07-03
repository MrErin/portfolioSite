<!-- STATUS: COMPLETE -->

# Phase 3 Testing: Component Integration

## At a Glance

Verify that moving the whimsy slider produces three visually distinct experiences in the projects section and modal.

### What To Verify
- [x] Stop 0: sticky parallax with particles, grow-from-card modal, branded thumbnails
- [x] Stop 1: responsive grid with particles, grow-from-card modal, branded thumbnails
- [x] Stop 2: responsive grid, no particles, fade-up modal, grey thumbnails
- [x] Card click works in both grid path (Stop 1 & 2) and parallax path (Stop 0)
- [x] `prefers-reduced-motion` path (plain stack) is unaffected

---

## Automated Tests

No automated tests exist for this project. All verification is manual.

---

## Manual Testing Steps

### Quick Smoke Test (2-5 min)

1. Open the dev server (`npm run dev`) in a browser.
2. The slider should be visible top-left. Note the default position (Stop 0 — max whimsy).
3. Scroll down to the projects section — should show sticky parallax cards floating up with a particle field.
4. Drag the slider to the far right (Stop 2).
5. Projects section should switch to a 2-column grid, particles should disappear.
6. Click a project card — modal should appear with a fade-up animation (not grow-from-card).
7. Close the modal.

- **Expected:** The switch from parallax to grid and the animation change happen without page reload.
- **If fails:** Check that `WhimsyProvider` still wraps `App.tsx` and that no component is outside the provider tree.

---

### Priority 1 — All Three Stops (15-20 min)

**Stop 0 — Max Whimsy**

1. Slider at leftmost position.
2. Scroll through the projects section.
   - **Expected:** Sticky parallax effect — cards appear to fall through the viewport as you scroll. Particle field visible (floating colored dots).
3. Click a card.
   - **Expected:** Modal grows from the card's position toward center. Spring animation (bouncy feel).
4. Check card thumbnails.
   - **Expected:** Purple-toned dark gradient (`hollow → shade → dusk`).
5. Close modal.

**Stop 1 — Mid**

1. Drag slider to center position.
2. Scroll to the projects section.
   - **Expected:** Responsive grid (1 col on mobile, 2 col on desktop). Particle field still visible.
3. Click a card.
   - **Expected:** Modal grows from the card's position (same grow-from-card animation as Stop 0).
4. Check card thumbnails.
   - **Expected:** Same purple-toned gradient as Stop 0 (boringImages is still false at Stop 1).
5. Close modal.

**Stop 2 — Min Whimsy**

1. Drag slider to rightmost position.
2. Scroll to the projects section.
   - **Expected:** Responsive grid. Particle field gone.
3. Click a card.
   - **Expected:** Modal fades up from viewport center (no grow-from-card). Smooth linear feel.
4. Check card thumbnails.
   - **Expected:** Neutral grey gradient (`gray-800 → gray-700 → gray-600`).
5. Close modal.

**Hero section particles**

1. At Stop 1: scroll back to the hero section.
   - **Expected:** Particles still visible in the hero.
2. At Stop 2: scroll back to the hero section.
   - **Expected:** Particles gone from the hero too (ParticleField self-disables everywhere).

---

### Priority 2 — Edge Cases (5-10 min)

**Card click in grid path**

1. At Stop 1 or Stop 2, click several project cards in the grid.
   - **Expected:** Each card opens its modal correctly. `onClick` prop is wired through `ProjectCard`.

**Close mechanics unchanged**

1. Open any modal at any stop.
2. Close via the X button, Escape key, and backdrop click — each should close.
   - **Expected:** All three close paths work at all whimsy levels.

**Modal aria-label**

1. Open a modal, inspect with DevTools.
   - **Expected:** `role="dialog"`, `aria-modal="true"`, `aria-label="Project details"` present.

**Slider transition live-updates**

1. With the projects section in view (Stop 0 — parallax), drag to Stop 1.
   - **Expected:** Immediate switch to grid layout. No reload required.
2. Drag back to Stop 0.
   - **Expected:** Returns to parallax. (Note: the sticky parallax pattern uses scroll position, so you may need to scroll up and back to see the full parallax effect re-engage.)

**prefers-reduced-motion path**

1. In browser DevTools, enable "Emulate CSS prefers-reduced-motion: reduce".
2. Reload the page.
   - **Expected:** Projects section shows the plain vertical stack (not parallax, not grid). Slider still visible and functional. Changing the slider stop has no visible effect on the reduced-motion fallback — this is expected behaviour (reduced-motion takes priority).

---

## Edge Cases to Check

### Priority 1
- [x] Slider at Stop 2 while hero is in view — particles gone from hero too
- [x] Card click at Stop 1 (grid path) — modal opens with grow-from-card
- [x] Card click at Stop 2 (grid path) — modal opens with fade-up
- [x] All three close methods work (X, Escape, backdrop) at each stop

### Priority 2
- [x] Rapidly sliding between stops — no jank or broken layout
- [x] Modal opened at Stop 0, then slider moved to Stop 2 while modal is open — check for any visual glitch (this is edge-case behaviour, not a blocker)

---

## Phase Completion Checklist

### Must Pass
- [x] All three stops render the correct layout in the projects section
- [x] Particles appear/disappear correctly at the right stops (both hero and projects)
- [x] Modal animation switches correctly between grow-from-card and fade-up
- [x] Card thumbnails show the correct gradient at each stop
- [x] Card click works in grid path
- [x] No regressions in parallax path

### Nice to Have
- [x] Reduced-motion path confirmed unaffected

### Known Limitations
- Quickly toggling between parallax and grid while mid-scroll may produce a brief layout jump — the sticky parallax relies on scroll position, which doesn't reset when the layout switches.
- Grey gradient in ProjectCard uses raw Tailwind `gray-*` classes (not theme tokens). This is intentional for the "boring" contrast effect, but means the grey shade won't respond to future theme changes without an explicit update. Tracked as a known trade-off (see plan.md research notes).
- Close button in ProjectModal has `hover:` state but no `focus:` or `focus-visible:` styling — keyboard users won't see a focus ring. This is **pre-existing** (not introduced in Phase 3) and tracked in `_planning/deferred.md`.

---

## Review Findings

*Issues found during code review that need user awareness.*

**MEDIUM — Hardcoded grey gradient in ProjectCard.tsx:15**
`from-gray-800 via-gray-700 to-gray-600` uses Tailwind's default color scale rather than theme tokens. This is intentional (the "boring" gradient must look visually distinct from the theme), documented in the plan's research notes. No code change needed, but the decision should be added to `_planning/decisions.md` for future reference.

**LOW — Global component imports from feature context**
`ParticleField` lives in `src/components/` (shared global layer) but now imports `useWhimsy` from `@/features/whimsy`. This is an architectural smell — shared components ideally don't depend on feature-specific contexts. Acceptable at this portfolio scale since `WhimsyProvider` wraps the entire app, but worth noting if the project grows. No action required now.

**LOW (pre-existing) — Duplicated link className in ProjectModal**
The "View Repository" and "Live Demo" `<a>` tags share an identical long className string. Already logged in `_planning/deferred.md` (item #2). No action required in this phase.

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
| Grey gradient decision not in decisions.md | Documentation gap, no functional impact | No — add manually if desired |
| Close button missing focus: state | Pre-existing, not introduced in Phase 3 | Already tracked (pre-existing) |

### Result

<!-- WARNING: USER ONLY — Agents must never check these boxes. Only the user marks acceptance. -->
- [x] All good — ready to proceed
- [ ] Issues found — see above
