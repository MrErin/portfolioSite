<!-- STATUS: COMPLETE -->

# Phase 2: Hero Ground Silhouette

## Goal

Integrate the underground earth/roots silhouette image at the bottom of the hero viewport. Position and scale responsively. Decide whimsy behavior (visible at all stops vs. hidden at max whimsy).

**Depends on:** Phase 1 (slider restyle) — complete.

## Research Notes

### Asset Status

The silhouette SVG exists at `src/assets/herosilhouette.svg` — a Potrace-traced vector (2064x437pt viewBox) of underground earth/roots/grass. Black fill on transparent background. SVG scales perfectly at all viewport widths with zero softening.

### Positioning Strategy

The hero section uses `min-h-screen flex items-center justify-center` with a gradient background. The silhouette should be:
- **Absolutely positioned** at the bottom of the hero section
- **Full width**, height auto-scaled to maintain aspect ratio
- **Below the text content** in z-order (behind particles, behind text)
- `pointer-events: none` and `aria-hidden="true"` (decorative)

The hero text is vertically centered via flexbox, so the silhouette at the bottom edge won't overlap unless the viewport is very short. The roots dangle downward from the ground line, which aligns perfectly with "peering underground." The SVG's wide aspect ratio (~4.7:1) means it will be relatively shallow on most viewports.

### Whimsy Behavior Decision Point

The requirements flag this as a build-time decision:
- **Option A:** Visible at all stops — the silhouette is subtle enough (dark on dark) to survive professional mode
- **Option B:** Visible at stops 0–1 only, hidden at stop 2

**Decision:** Visible at stops 1–2, hidden at stop 0 (boringImages mode).

### Responsive Considerations

- The SVG has a ~4.7:1 aspect ratio (2064x437). Using `width: 100%` lets it scale naturally at all viewport widths.
- On very narrow mobile viewports, the silhouette gets proportionally shorter — acceptable since organic shapes still read well.
- On very tall viewports (desktop), the silhouette stays anchored at the bottom without stretching vertically.

### Layer Order (bottom to top)

1. Gradient background (CSS on `<section>`)
2. **Silhouette image** (new — `absolute bottom-0`, low z-index)
3. ParticleField (`absolute inset-0`, `pointer-events-none`)
4. Text content (centered via flex, natural z-index above absolute elements)

Particles floating above the silhouette creates the layered depth called for in the image inventory.

## Tasks

### Task 1: Add silhouette image to Hero component — DONE

**Files:** `src/components/core/Hero.tsx`
**Action:**
- Import the silhouette SVG (`herosilhouette.svg`) as a static asset
- Add an `<img>` element positioned absolutely at the bottom of the hero section
- Apply: `absolute bottom-0 left-0 w-full pointer-events-none select-none` and `aria-hidden="true"`
- SVG scales naturally via `width: 100%` with `preserveAspectRatio` — no `object-fit` needed
- Set a reasonable max-height or let aspect ratio govern height — evaluate visually
- Ensure the image renders below ParticleField and text in the stacking order

**Verify:** Image appears at the bottom of the hero viewport. Text remains centered and unobscured. Particles float above the silhouette. Image scales across viewport widths without distortion.

**Done when:** Silhouette is visible at the bottom of the hero section on desktop and mobile viewports, text is unobstructed, and the element is decorative-only (aria-hidden, no pointer events).

### Task 2: Evaluate and finalize whimsy behavior — DONE

**Files:** `src/components/core/Hero.tsx`
**Action:**
- Import `useWhimsy` and read `config.boringImages` (which is `true` at stop 2)
- When `boringImages` is `true`, hide the silhouette — use opacity transition for a smooth fade rather than conditional render (avoids DOM pop-in)
- Transition: `opacity 300ms ease` (or match existing transition durations in the project)

**Verify:** Silhouette visible at stops 0–1, fades out at stop 2. Transition feels smooth.

**Done when:** Silhouette is hidden at stop 2 with a smooth opacity transition.

### Task 3: Responsive fine-tuning — DONE

**Files:** `src/components/core/Hero.tsx`, possibly `src/index.css`
**Action:**
- Test across breakpoints: mobile (< 640px), tablet (640–1024px), desktop (> 1024px)
- Adjust height/positioning if the silhouette overwhelms the hero on small viewports or looks too small on large ones
- Verify the silhouette doesn't create unwanted scroll overflow (no horizontal scrollbar)
- Ensure `overflow-hidden` is on the hero section if needed to contain the image edges

**Verify:** No layout breakage at any viewport size. No horizontal scroll. Silhouette proportions feel right across breakpoints.

**Done when:** Silhouette scales cleanly from mobile to ultrawide without layout issues.

### Task 4: Update codebase documentation — DONE

**Files:** `_planning/codebase.md`
**Action:**
- Update the Hero.tsx entry in the codebase map to reflect the new silhouette element
- Add the asset file to the architecture description if a dedicated assets section exists

**Verify:** `codebase.md` accurately describes the Hero component's new structure.

**Done when:** Documentation reflects current state.

## Phase Size Check

4 tasks, all scoped to 1–2 files. Well within the ~10 task limit.

## Security Checklist

- No user inputs in this phase — decorative image with static SVG asset
- No API calls, no secrets, no external resources beyond the committed SVG
- `aria-hidden="true"` correctly marks decorative content
- No security concerns

## Issues Discovered During Implementation

### Issue 1: Plan had whimsy stops backwards

**Description:** Plan recorded "visible at stops 0–1, hidden at stop 2" but user wanted the opposite: visible at stops 1–2 (when whimsy is active), hidden at stop 0 (boring/professional mode). Initial implementation used `config.parallax` as a workaround. Corrected to use `config.boringImages` which is semantically correct — at stop 0, boring images mode hides decorative visuals.

## Issues for UA Testing

1. **Ultrawide viewport height:** On viewports wider than ~2000px, the silhouette's natural aspect ratio produces a height exceeding 400px. Verify this doesn't overwhelm the hero visually. A `max-h` can be added if needed.
