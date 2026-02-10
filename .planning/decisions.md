# Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | pre-init | Tailwind v4 CSS-first config | Greenfield project in 2026, v4 is current major version |
| 2 | pre-init | Feature-based directory structure | Collocates related components, scales well |
| 3 | pre-init | Cinzel Decorative / Cinzel / Raleway font stack | Gothic serif for display/headings, clean sans-serif body — matches dark whimsical theme |
| 4 | pre-init | 6-step dark background progression | Creates depth for "falling" effect without images |
| 5 | 2026-02-10 | Scroll-linked parallax over scroll-triggered animation | Initial plan used IntersectionObserver for one-time entrance animations. User feedback indicated this is wrong — the desired effect is cards floating past continuously as the user scrolls, creating the "falling down the rabbit hole" sensation. This requires Framer Motion's `useScroll` + `useTransform` for scroll-linked transforms, not viewport detection. |
