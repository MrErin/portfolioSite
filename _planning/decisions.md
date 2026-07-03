# Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | 2026-07-03 | `WhimsyConfig` boolean fields use plain flag names (`parallax`, `particles`, `growFromCard`, `boringImages`) not `is/has/can` prefix | Names are defined verbatim in requirements.md and used as config keys, not instance variables. Accepted by spec. |
| 2 | 2026-07-03 | Safari `<datalist>` ticks not rendered — custom `<span>` tick marks used as cross-browser fallback | Safari silently ignores datalist linked to range inputs. Three custom spans below the track provide visual parity. Accepted per plan. |
| 3 | 2026-07-03 | `boringImages` gradient uses raw Tailwind `gray-800/700/600` classes instead of theme tokens | The "boring" state must be visually distinct from the branded palette. Using theme tokens would undermine the effect. Default Tailwind gray scale is available without config changes. Known: these classes won't follow future theme changes. |
| 4 | 2026-07-03 | Brief layout jump when dragging slider between parallax and grid mid-scroll — accepted | Sticky parallax relies on scroll position, which doesn't reset when switching layout paths. Fixing would require scroll restoration logic; not worth the complexity for a portfolio toggle. Documented in ua_testing.md known limitations. |
