# Feature Requirements — Visual Polish & Images

**Status:** Complete
**Date:** 2026-07-03

## Settled Ground

- Stack: React 19, TypeScript 5.9, Vite 7, Tailwind v4, Framer Motion 12
- Architecture: component-based dirs (`components/`), overlay state in App.tsx, no backend
- Existing features: parallax scroll, whimsy slider (3 stops), grow-from-card modal, slide panel, particles
- Constraints: no backend, no env vars

## Interview Progress

- [x] 1. Feature definition & user stories
- [x] 2. Integration points with existing codebase
- [x] 3. Data model changes (if any)
- [x] 4. Feature-specific business rules
- [x] 5. UI/UX for the feature
- [x] 6. Out of scope
- [x] 7. Coverage confirmation

---

## 1. Feature Definition & User Stories

### Scope

Visual polish pass covering three areas:
1. **Real images** — replace all gradient placeholders with actual images
2. **Whimsy slider restyle** — visual redesign of the slider control
3. **General styling/thematic adjustments** — final visual tweaks as the look is finalized

### Image Assets (detail in `_planning/image-inventory.md`)

- **Project thumbnails (x4):** Raster images (AI art, screenshots, photos). One image per project, reused in card and modal.
- **Profile photo (x1):** 256x256px square, cropped to circle.
- **Demo placeholder (x4):** Screenshots or embed area in modal.
- **Looking glass frame overlays (1-3):** Ornate Victorian frame PNGs with transparency. Overlaid on project thumbnails at whimsy stops 0-1, hidden at stop 2, always hidden in modal. Replaces the old `boringImages` grey gradient swap.
- **Hero ground silhouette (x1):** SVG of underground earth/roots anchored to bottom of hero viewport. Establishes "underground" atmosphere.
- **Falling objects (x6):** Simple SVG line drawings of Alice-themed items (armchair, teacup, pocket watch, skeleton key, playing card, open book). Drift in background behind project cards at stop 0 only. Low opacity (15-25%), 1-2 visible at a time.

### User Stories

- As a visitor, I see real project images instead of gradient placeholders, giving me a genuine preview of each project.
- As a visitor at max whimsy, I see project thumbnails framed by ornate Victorian "looking glass" frames that reinforce the rabbit hole theme; opening the modal shows the clean image.
- As a visitor at stop 2, I see clean professional project images with no thematic overlay.
- As a visitor, the hero section feels like I'm underground, with a silhouette of earth and roots along the bottom edge.
- As a visitor scrolling through projects at stop 0, I see faint sketches of Alice-themed objects (teacup, pocket watch, etc.) drifting past in the background, adding depth to the falling effect.
- As a visitor, the whimsy slider looks like a deliberate, themed UI element rather than an unstyled browser control.
- As a visitor adjusting whimsy, the slider itself transforms: ornate Victorian styling at stop 0, toned down at stop 1, clean minimal at stop 2.

### Whimsy Slider Restyle

**Keep:** Native `<input type="range">`, `aria-label`, `aria-valuetext`, `aria-live` stop name announcements, keyboard navigation, datalist snap points.

**Remove:** Oversized pulse glow, broken-looking tick mark dashes.

**Visual states by stop:**
- **Stop 0 (Curiouser and Curiouser):** Ornate Victorian styling. Gothic fonts (Cinzel) on labels. Styled thumb — dark gold/metallic gradient, subtle glow, decorative borders. Decorative track/rail with inset depth. Feels like a piece of the world.
- **Stop 1 (Sensibly Strange):** Toned-down version. Still styled but less ornate — simpler thumb, less glow, cleaner track.
- **Stop 2 (Quarterly Review):** Clean minimal. Simple thumb, plain track, straightforward labels. Standard polished UI control.

**Implementation:** Pure CSS (gradients, box-shadow, borders on `::-webkit-slider-thumb` / `::-moz-range-thumb` and track pseudos). No image assets needed. Uses existing theme tokens (gold, purple, surface colors).

**Constraints:**
- All three visual states must pass WCAG contrast requirements
- Theme colors and site fonts do NOT change with whimsy level — only the slider's own styling adapts
- Position stays fixed top-left for now, may revisit during build once images are in place

## 2. Integration Points

- **Project data model** (`types.ts`, `projects.ts`) — needs image field(s) added
- **ProjectCard.tsx** — replace gradient placeholder with `<img>`, add looking glass frame overlay layer, wire to whimsy config
- **ProjectModal.tsx** — replace gradient header placeholder with project image (no frame overlay), replace demo placeholder
- **AboutPanel.tsx** — replace gradient circle with real `<img>`
- **Hero.tsx** — add ground silhouette SVG element, position at bottom
- **ProjectsSection.tsx** — add falling object SVGs in background layer (stop 0 only), needs scroll-linked positioning
- **WhimsySlider.tsx** — full restyle, conditional CSS classes based on whimsy level
- **WhimsyContext.tsx** — `boringImages` flag repurposed: now controls frame overlay visibility (not grey gradients)
- **index.css** — new slider pseudo-element styles, possible keyframe changes

### Build Note

Phases should be organized by image class (hero, project images + frames, falling objects, slider, profile/cleanup) rather than by technical layer. Expect iterative visual tweaking within each phase.

## 3. Data Model Changes

**Project interface** — add one field:

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  imageUrl: string;      // NEW — used for both card thumbnail and modal header
  demoUrl?: string;
  repoUrl: string;
}
```

- Single `imageUrl` field for both card and modal — no separate thumbnail
- `demoUrl` already exists (optional) — modal will use this as a styled link/button instead of a demo screenshot embed
- Demo placeholder area in modal replaced with a whimsy-styled "View Demo" button (when `demoUrl` exists), which de-whimsifies along with the slider
- No new entities, no relationship changes

## 4. Business Rules

- **Image fallback:** If an image fails to load, fall back to the existing gradient placeholder. Low overhead, good contingency.
- **Looking glass frame overlay:** Visible at stops 0–1 on card thumbnails only. Always hidden in modal. Controlled by existing `boringImages` config flag (inverted — frame shows when `boringImages: false`).
- **Falling objects:** Stop 0 only. Respect `prefers-reduced-motion`. Max 1–2 visible at a time, 15–25% opacity.
- **Demo button in modal:** Only rendered when `demoUrl` is present on the project. Styled to match whimsy level (ornate at stop 0, clean at stop 2).
- **Slider visual state:** Slider styling tracks its own value — changing the level changes the slider's own appearance along with everything else.

## 5. UI/UX

Most visual details captured in image inventory and slider restyle sections above.

- **Image sizing:** Project thumbnails fill card width with fixed height (`h-40`). Modal header fills modal width with fixed height (`h-32`). Profile photo is 128x128 circle. All use `object-cover` for aspect ratio handling.
- **Looking glass frames:** Absolutely positioned over thumbnail, pointer-events none. Should not shift layout or affect card click targets.
- **Hero silhouette:** Anchored to bottom of hero viewport. Must not overlap or obscure hero text (title, subtitle, accent line are centered vertically).
- **Falling objects:** Desktop implementation first. **Mobile behavior TBD — evaluate during falling objects build phase and decide whether to hide, reduce, or keep as-is.**
- **Slider position:** Stays fixed top-left for now. Re-evaluate during build if images create conflicts.
- **Demo button:** Replaces the "Demo placeholder" text area in modal. Only shown when project has `demoUrl`.

## 6. Out of Scope

- No real project data — keep mock Alice-themed projects
- No image optimization pipeline (lazy loading, responsive `srcset`, WebP conversion)
- No animation on looking glass frame overlays (static overlay)
- No persistent whimsy preference (still resets to stop 0 on load)
- No font changes based on whimsy level
- No color palette or dark theme changes based on whimsy level
- No new sections or layout changes beyond what's described

## Open Questions

- Falling objects mobile behavior — evaluate during build phase, decide whether to hide/reduce/keep
- Slider position — re-evaluate during build if images create layout conflicts
- Number of looking glass frame variants (1 vs 2–3) — test during build for visual busyness
