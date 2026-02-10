# Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | pre-init | Tailwind v4 CSS-first config | Greenfield project in 2026, v4 is current major version |
| 2 | pre-init | Feature-based directory structure | Collocates related components, scales well |
| 3 | pre-init | Cinzel Decorative / Cinzel / Raleway font stack | Gothic serif for display/headings, clean sans-serif body — matches dark whimsical theme |
| 4 | pre-init | 6-step dark background progression | Creates depth for "falling" effect without images |
| 5 | 2026-02-10 | Scroll-linked parallax over scroll-triggered animation | Initial plan used IntersectionObserver for one-time entrance animations. User feedback indicated this is wrong — the desired effect is cards floating past continuously as the user scrolls, creating the "falling down the rabbit hole" sensation. This requires Framer Motion's `useScroll` + `useTransform` for scroll-linked transforms, not viewport detection. |
| 6 | 2026-02-10 | Sticky viewport pattern over CSS grid for parallax layout | First scroll-linked implementation used a 2-column CSS grid with shared scroll progress. Cards moved in lockstep within their grid cells — the grid defeated the floating effect. The "falling past" sensation requires: (1) a tall section (300vh) with a `position: sticky` inner viewport, (2) per-card staggered scroll windows so cards enter/exit sequentially, (3) absolute positioning with left/right alternation instead of grid cells, and (4) much larger translateY range (600px vs 150px) so cards travel the full viewport height. |
| 7 | 2026-02-10 | Defer Card 0 scroll timing fix to Phase 4 | Card 0's scroll window starts at 0.0 (section entry), so it's barely visible before fading out. Accepted as-is for Phase 2 since the core parallax pattern works. Phase 4 should adjust `getCardScrollWindow()` — options include: adding an initial buffer (~10-15% delay), increasing window size (0.40-0.45), increasing section height (300vh → 400vh+), or non-linear stagger spacing. Files: `animationConfig.ts`, `ProjectsSection.tsx`. |
