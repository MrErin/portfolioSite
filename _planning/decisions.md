# Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | 2026-07-03 | Reversed whimsy slider polarity: 0=min whimsy (left), 2=max whimsy (right) | Standard UX convention is left-to-right = less-to-more. All consumers use config flags, not raw level numbers, so the change was contained to 3 files. |
| 2 | 2026-07-03 | Deferred SVG ornamentation for slider (filigree thumb, decorative rail arrows) | Pure CSS hit its ceiling for ornate detail. SVG assets should be created alongside Victorian frame overlays (Phase 3) for visual consistency. |
| 3 | 2026-07-04 | Added collapse/expand behavior to WhimsySlider (auto-collapse after 3s, re-collapse 2s after interaction, keyboard focus re-expands) | Slider occupies fixed screen space and competes with content. Collapsing to a small pill keeps it accessible without visual clutter. Keyboard users can still reach it via Tab (onFocus re-expands). |
