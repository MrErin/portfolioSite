# Deferred Items

| # | Phase | Item | Priority | Notes |
|---|-------|------|----------|-------|
| 1 | 2 | Safe-area inset applied as padding on fixed wrapper — non-notched devices get ~2rem offset instead of the 1rem `top-4 left-4` implies | LOW | Cosmetic only. Fix: use `top: max(1rem, env(safe-area-inset-top))` on the fixed element instead of padding on the wrapper. Post-feature cleanup. |
