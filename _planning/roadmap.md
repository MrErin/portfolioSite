# Roadmap

## Project: Visual Polish & Images

Requirements: `_planning/requirements.md`
Created: 2026-07-03

## Phases

- [ ] Phase 1: Whimsy slider restyle
- [ ] Phase 2: Hero ground silhouette
- [ ] Phase 3: Project images & looking glass frames
- [ ] Phase 4: Falling objects
- [ ] Phase 5: Profile photo, demo button & cleanup

## Phase intent notes (written at init)

**Phase 1 (Whimsy slider restyle):** Restyle the slider with three visual states (ornate Victorian at stop 0, toned down at stop 1, clean minimal at stop 2). Remove pulse glow and broken tick marks. Pure CSS, no image assets needed. Done = slider looks intentionally themed at all three stops and passes WCAG contrast.

**Phase 2 (Hero ground silhouette):** Integrate the underground earth/roots SVG silhouette at the bottom of the hero viewport. Position and scale responsively. Evaluate whimsy behavior (visible at all stops vs stops 0-1 only). Done = hero establishes "underground" atmosphere, silhouette scales cleanly across viewports.

**Phase 3 (Project images & looking glass frames):** Add `imageUrl` to Project interface. Replace gradient placeholders in ProjectCard and ProjectModal with real images. Add looking glass frame overlay on thumbnails (stops 0-1), hidden at stop 2 and in modal. Repurpose `boringImages` flag. Add image fallback to gradient. Done = project cards show real images with themed frames, modal shows clean images.

**Phase 4 (Falling objects):** Add 6 Alice-themed SVG line drawings drifting in the background behind project cards at stop 0. Implement scroll-linked positioning, random selection, opacity/scale rules. Evaluate mobile behavior during this phase. Done = falling objects add depth to parallax scroll without competing with content.

**Phase 5 (Profile photo, demo button & cleanup):** Replace profile photo placeholder with real image. Replace demo placeholder with whimsy-styled "View Demo" button (when demoUrl exists). Final visual pass for consistency. Done = all placeholders replaced, visual polish complete.

## Notes

Phases organized by image class to support iterative visual feedback. Expect more back-and-forth than usual within each phase as visual tweaks are evaluated.

User is creating image assets externally (AI art generators, photographs) — phases may need to wait on asset delivery. Phase 1 (slider) has no image dependency and can start immediately.

## Audit Checkpoints

> **User-initiated audits** — run `/plan:audit` at these optimal points. Not automated, just guidance.

| Checkpoint | Trigger | Why |
|------------|---------|-----|
| **Mid-Project** | After Phase 3 (project images + frames) | Most complex integration point — validate before adding more visual layers |
| **Pre-Polish** | Before Phase 5 (cleanup) | Clean slate for final pass |
