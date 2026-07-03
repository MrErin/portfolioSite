# Decisions

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | 2026-07-03 | `WhimsyConfig` boolean fields use plain flag names (`parallax`, `particles`, `growFromCard`, `boringImages`) not `is/has/can` prefix | Names are defined verbatim in requirements.md and used as config keys, not instance variables. Accepted by spec. |
