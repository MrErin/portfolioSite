<!-- STATUS: COMPLETE -->

# Phase 3: Component Integration

## Goal

Wire four existing components to `useWhimsy()` so that moving the slider produces visually distinct experiences at all three stops end-to-end.

## Dependencies

- Phase 1: `WhimsyContext`, `WhimsyProvider`, `useWhimsy`, `WhimsyConfig` flags — all live in `src/features/whimsy/WhimsyContext.tsx`
- Phase 2: `WhimsySlider` wired into `App.tsx`; slider already reads/writes `level` via context. Components can now consume the same context.

## Research Notes

### Hook ordering in ProjectsSection

`useWhimsy()` must be added at the top of the component alongside existing hooks — React rules prohibit conditional hook calls. The existing early return for `prefersReducedMotion` is fine because all hooks are called before it. Add `useWhimsy()` at the same level, before any returns.

### Grid layout with particles

When `config.parallax` is false, `ParticleField` moves from the sticky inner container to the section itself. The section needs `relative` positioning so `ParticleField`'s `absolute inset-0` is scoped correctly. Card content sits in a `relative z-10` wrapper to appear above the particles.

Since `ParticleField` will check `config.particles` itself (Task 1), Stop 1 (parallax off, particles on) gets particles; Stop 2 (parallax off, particles off) does not — no extra logic in `ProjectsSection`.

### ProjectModal animation variants

Framer Motion accepts plain objects for `initial`/`animate`/`exit`/`transition`. Conditional variants are straightforward: compute four objects before the return, pass them as props. The `offsetX`/`offsetY` calculation is harmless when `growFromCard` is false — just arithmetic, used in the ignored branch.

### Grey gradient for boringImages

The theme tokens (hollow, shade, dusk) carry a purple tint. For "desaturated/boring", Tailwind's default `gray-*` scale (`from-gray-800 via-gray-700 to-gray-600`) gives a neutral charcoal-to-medium-grey gradient that reads as corporate without needing new theme tokens.

### Tailwind v4 default colors

The `@theme` block in `index.css` adds custom tokens but does not reset the default Tailwind color scale. `gray-*` classes are available without any config changes.

## Tasks

> Task status is marked in the heading: `PENDING` → `IN_PROGRESS` → `DONE` or `BLOCKED`. When resuming a phase, scan for the first non-DONE task.

### Task 1: ParticleField — particles flag `DONE`

**Files:** `src/components/ParticleField.tsx`

**Action:** Import `useWhimsy` from `@/features/whimsy`. Call `const { config } = useWhimsy()` at the top of `ParticleField`. Change the early return guard to `if (prefersReducedMotion || !config.particles) return null;`.

**Verify:** Run dev server. At Stop 0 and 1, particles float in both Hero and Projects section. Slide to Stop 2 — particles vanish immediately from both. Slide back to Stop 1 — particles return.

**Done when:** `ParticleField` returns null at Stop 2, renders at Stops 0 and 1.

---

### Task 2: ProjectCard — boringImages flag `DONE`

**Files:** `src/features/projects/ProjectCard.tsx`

**Action:** Import `useWhimsy`. Call `const { config } = useWhimsy()`. Derive thumbnail class:

```ts
const thumbnailClass = config.boringImages
  ? 'h-40 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600'
  : 'h-40 bg-gradient-to-br from-hollow via-shade to-dusk';
```

Replace the hardcoded className on the placeholder `<div>` with `{thumbnailClass}`.

**Verify:** At Stops 0 and 1, card thumbnails show the purple-toned dark gradient. At Stop 2, thumbnails show a neutral grey gradient. Check the parallax path and the grid path (after Task 4).

**Done when:** Grey gradient appears at Stop 2; original gradient appears at Stops 0 and 1.

---

### Task 3: ProjectModal — growFromCard flag `DONE`

**Files:** `src/features/projects/ProjectModal.tsx`

**Action:** Import `useWhimsy`. Call `const { config } = useWhimsy()` inside `ProjectModal`. Compute animation variant objects before the return:

```ts
const modalInitial = config.growFromCard
  ? { opacity: 0, scale: 0.8, x: offsetX, y: offsetY }
  : { opacity: 0, y: 20 };

const modalAnimate = config.growFromCard
  ? { opacity: 1, scale: 1, x: 0, y: 0 }
  : { opacity: 1, y: 0 };

const modalExit = config.growFromCard
  ? { opacity: 0, scale: 0.95 }
  : { opacity: 0, y: -10 };

const modalTransition = config.growFromCard
  ? { type: 'spring' as const, damping: 25, stiffness: 300 }
  : { duration: 0.25 };
```

Replace the hardcoded `initial`, `animate`, `exit`, `transition` props on the inner `motion.div` with `{modalInitial}`, `{modalAnimate}`, `{modalExit}`, `{modalTransition}`.

**Verify:** At Stops 0 and 1, clicking a card opens the modal growing from the card's center. At Stop 2, modal fades up from center of viewport. Close behavior (X button, Escape, backdrop click) is unchanged in both paths.

**Done when:** Both animation paths render correctly; close mechanics are unaffected.

---

### Task 4: ProjectsSection — parallax flag `DONE`

**Files:** `src/features/projects/ProjectsSection.tsx`

**Action:** Import `useWhimsy`. Add `const { config } = useWhimsy()` as the first hook call in `ProjectsSection` (before `useReducedMotion`, `useRef`, `useScroll`). After the `prefersReducedMotion` early return, insert a second early return for the grid path:

```tsx
if (!config.parallax) {
  return (
    <section aria-label="Projects" className="relative min-h-screen bg-deep py-20 px-4">
      <ParticleField />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="font-heading text-purple-light text-4xl mb-12 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={onProjectClick} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

The existing sticky parallax path is the final return (no changes needed).

**Verify:**
- Stop 0: sticky parallax with diagonal drift, particles present
- Stop 1: responsive grid (1 col mobile, 2 col desktop), particles present
- Stop 2: responsive grid, no particles
- Clicking cards in the grid path opens the modal (existing `onProjectClick` wiring)
- `prefersReducedMotion` path (plain stack) is unchanged

**Done when:** All three stops produce distinct layouts in the projects section; card click still works in the grid path.

## Security Checklist

- [ ] Input validation: N/A — no user input processed in this phase
- [ ] SQL injection prevention: N/A — no queries
- [ ] Auth protection: N/A — no routes
- [ ] Secrets handling: N/A — no credentials
- [ ] Destructive actions: N/A
- [ ] Dependency review: N/A — no new dependencies

**Notes:** No security surface changes in this phase. All changes are read-only consumers of existing context state.

## Issues Discovered During Verification Stage

_None yet._
