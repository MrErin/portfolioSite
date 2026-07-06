<!-- STATUS: DRAFT -->

# Phase 3 Testing: Project Images & Looking Glass Frames

## At a Glance

Verify that project cards and modals show the correct image (or fallback gradient) at each whimsy stop.

### What To Verify

- [x] Cards show grey gradient at stop 0 when no `boringImageUrl` is defined
- [x] Cards show `boringImageUrl` at stop 0 when defined (Unfamiliar project)
- [x] Cards show `imageUrl` at stops 1–2 (four projects have images)
- [x] Cards show purple gradient at stops 1–2 when no `imageUrl`
- [x] Modal shows correct image or gradient for same logic
- [x] Broken image URL falls back to gradient (no broken image icon)

---

## Review Findings

The following issues were found during code review. Review before testing and decide which are blockers.

### BUG — Missing leading slash in `boringImageUrl` (projects.ts:10) — **FIXED**

Leading `/` added. Path now consistent with all other image URLs.

---

### INCONSISTENCY — Modal gradient fallback always purple — **FIXED**

`ProjectModal` now mirrors `ProjectCard`'s gradient logic: grey (`boring-*` tokens) at stop 0, purple (`hollow → shade → dusk`) at stops 1–2.

---

### DOCUMENTATION — `codebase.md` file listing is stale — **FIXED**

File listing updated to reflect actual `.webp` filenames including `unfamiliarBoring.webp`.

---

### UI ANTIPATTERN (HIGH) — Hardcoded Tailwind grey classes — **FIXED**

Added semantic tokens `--color-boring-dark`, `--color-boring`, `--color-boring-light` to `@theme` in `index.css`. Replaced `from-gray-800 via-gray-700 to-gray-600` with `from-boring-dark via-boring to-boring-light` in both `ProjectCard` and `ProjectModal`.

---

## Automated Tests

No automated tests for this phase. This is a pure visual/UI phase — image rendering and fallback behavior require manual verification.

---

## Manual Testing Steps

### Quick Smoke Test (2-5 min)

1. Open the app at stop 2 (default). Scroll to the Projects section.
2. Verify four cards show project images (Unfamiliar, Single Player Co-Op, Food Map, Annotation Extractor).
3. Click a card with an image — verify the modal header shows the same image at h-64 height.
4. Move slider to stop 0.
5. Verify Unfamiliar card shows a different (boring) image.
6. Verify other cards show a grey gradient (no image).

- **Expected:** Images load cleanly, no broken image icons anywhere.

### Priority 1 — Whimsy-Driven Image Switching (10-15 min)

1. At stop 2, open the Unfamiliar project modal.
   - **Expected:** Regular project image fills the 256px header.
2. Close modal. Move slider to stop 0.
3. Open the Unfamiliar project modal again.
   - **Expected:** Boring image shows in header (dark/neutral variant).
4. At stop 0, open Single Player Co-Op modal.
   - **Expected:** Grey gradient header (no image defined for boring state).
5. Move slider to stop 1. Open any card.
   - **Expected:** Regular image shown (same as stop 2).

### Priority 2 — Fallback Behavior

1. In `projects.ts`, temporarily change an `imageUrl` to a broken path (e.g., `/projectImages/doesnotexist.webp`).
2. Load the app at stops 1–2.
   - **Expected:** Card and modal show purple gradient, no broken image icon.
3. Revert the change.

---

## Edge Cases to Check

### Priority 1 (Test First)

- [x] Red Queen Dashboard (no imageUrl) — shows purple gradient at stops 1–2, grey gradient at stop 0
- [x] Moving slider while modal is open — verify image/gradient switches correctly without error
- [x] Unfamiliar `boringImageUrl` actually loads at stop 0 (potential bug — see Review Findings: missing leading slash)

### Priority 2

- [x] Verify modal header image doesn't overflow or distort on mobile viewport
- [x] Verify `object-cover object-center` crops images cleanly at different aspect ratios

---

## Phase Completion Checklist

### Must Pass

- [x] All smoke test steps pass
- [x] Priority 1 manual tests pass
- [x] No broken image icons visible at any stop
- [x] BUG (missing leading slash in `boringImageUrl`) resolved or explicitly accepted

### Nice to Have

- [x] Modal gradient fallback matches card grey/purple distinction at each stop
- [x] `codebase.md` file listing updated to reflect actual `.webp` filenames

### Known Limitations

- Frame overlays (Victorian looking-glass SVGs) were scrapped due to aspect ratio mismatch. Frame SVGs are kept in `src/assets/` but unused.
- Only `unfamiliar` has a `boringImageUrl` defined. Other projects show grey gradient at stop 0.

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

<!-- ⚠️ USER ONLY — Agents must never check these boxes. Only the user marks acceptance. -->
- [x] All good — ready to proceed
- [ ] Issues found — see above

<!-- STATUS: COMPLETE -->
