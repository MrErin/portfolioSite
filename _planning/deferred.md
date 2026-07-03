# Deferred Items

| # | Phase | Item | Priority | Notes |
|---|-------|------|----------|-------|
| 1 | 2 | Safe-area inset applied as padding on fixed wrapper — non-notched devices get ~2rem offset instead of the 1rem `top-4 left-4` implies | LOW | Cosmetic only. Fix: use `top: max(1rem, env(safe-area-inset-top))` on the fixed element instead of padding on the wrapper. Post-feature cleanup. |
| 2 | 3 | Duplicated link className in ProjectModal — "View Repository" and "Live Demo" `<a>` tags share identical long className string | LOW | Extract to a private constant. Code-fixer flagged but didn't change (borderline over-decomposition for 2 uses). |
| 3 | 3 | Close button in ProjectModal has `hover:` state but no `focus:` or `focus-visible:` style | LOW | Pre-existing (predates Phase 3). Keyboard users won't see a focus ring on the X button. Fix: add `focus-visible:ring-2 focus-visible:ring-purple-light` to the button className. |
