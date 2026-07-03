# Deferred Items

| # | Phase | Item | Priority | Notes |
|---|-------|------|----------|-------|
| 1 | 2 | ~~Safe-area inset applied as padding on fixed wrapper — non-notched devices get ~2rem offset~~ | LOW | **Fixed 2026-07-03** — moved safe-area logic from `padding` to `top`/`left` inline styles on the fixed element. No more double-offset on non-notched devices. |
| 2 | 3 | ~~Duplicated link className in ProjectModal~~ | LOW | **Fixed 2026-07-03** — extracted `LINK_CLASS` private constant. Both links now reference it. |
| 3 | 3 | ~~Close button in ProjectModal has `hover:` state but no `focus:` or `focus-visible:` style~~ | LOW | **Fixed 2026-07-03** — resolved via QUALITY-001. Shared `CloseButton` component now includes `focus-visible:ring-2 focus-visible:ring-purple-light`. Both ProjectModal and SlidePanel use it. |
