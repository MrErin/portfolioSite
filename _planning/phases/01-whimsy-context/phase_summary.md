<!-- STATUS: COMPLETE -->

# Phase 1 Summary: WhimsyContext & Config

## At a Glance

Establishes the whimsy data layer — types, config object, context, provider, and hook — and wires the provider into `App.tsx` so any child component can read and set the whimsy level.

### Files Changed
- `src/features/whimsy/WhimsyContext.tsx` — new file: `WhimsyLevel` type, `WhimsyConfig` interface, `WHIMSY_LEVELS` config object, `WhimsyContext`, `WhimsyProvider`, and `useWhimsy` hook
- `src/features/whimsy/index.ts` — new file: barrel re-exports all public symbols from WhimsyContext
- `src/App.tsx` — wrapped entire JSX tree in `<WhimsyProvider>` as outermost element
- `eslint.config.js` — added `allowConstantExport: true` to `react-refresh/only-export-components` rule to allow the standard context co-location pattern

### Key Functions Added/Modified
- `WhimsyProvider({ children })` — stateful provider; initialises `level` to `0` (max whimsy) on every load, derives `config` from `WHIMSY_LEVELS[level]`, and provides `{ level, config, setLevel }` to the tree
- `useWhimsy()` — consumer hook with runtime guard; throws a descriptive error if called outside `WhimsyProvider`

### Behavior Changes
- No user-visible changes — this phase is infrastructure only
- Any child component can now call `useWhimsy()` to read the current level/config or call `setLevel` to change it
- App always starts at `level: 0` (no localStorage) — first impression is always max whimsy

---

## What Was Built

Two new files and one App.tsx change:

**`WhimsyContext.tsx`** contains the complete whimsy data layer in a single file following React context co-location convention:
- `WhimsyLevel = 0 | 1 | 2` — union type constraining the slider to three discrete stops
- `WhimsyConfig` — interface defining the four feature flags (`parallax`, `particles`, `growFromCard`, `boringImages`)
- `WHIMSY_LEVELS` — the single source of truth mapping each stop to its flags; changing a feature for a stop is a one-line edit
- `WhimsyContext` — React context typed as `WhimsyContextValue | null`; `null` allows `useWhimsy` to detect missing provider at runtime
- `WhimsyProvider` — thin stateful wrapper; uses `useState<WhimsyLevel>(0)` (no localStorage per spec), derives `config` synchronously from the level
- `useWhimsy` — consumer hook with null-check guard

**`index.ts`** re-exports all public symbols following the established feature barrel pattern.

**`App.tsx`** — added `<WhimsyProvider>` as the outermost element in the return statement, wrapping the skip-link, main content, FAB, and all overlay/panel `AnimatePresence` blocks.

**`eslint.config.js`** — the `react-refresh/only-export-components` rule would flag `WhimsyContext.tsx` because it exports both a component (`WhimsyProvider`) and non-component values. `allowConstantExport: true` suppresses this for the standard co-location pattern. (The agent could not apply this during the build due to a fish tank permission issue; the user applied it manually.)

## Key Decisions

- **No localStorage:** Level resets to 0 on every load per requirements — first impression is always the creative version.
- **`null` initial context value:** Using `createContext<WhimsyContextValue | null>(null)` (not a dummy default) allows `useWhimsy` to throw a meaningful error when used outside the provider, rather than silently returning stale data.
- **Single-file co-location:** Types, config, context, provider, and hook all live in `WhimsyContext.tsx`. There is no business logic to separate — this is pure config + React state plumbing.

## Major Logic Flows In This Phase

**Level change:** Consumer calls `setLevel(1)` → React re-renders `WhimsyProvider` → `config = WHIMSY_LEVELS[1]` computed inline → new context value propagates to all `useWhimsy` consumers → UI reacts.

**Runtime guard:** Consumer calls `useWhimsy()` outside provider → `useContext(WhimsyContext)` returns `null` → hook throws `"useWhimsy must be used within a WhimsyProvider"` → developer gets an actionable error immediately.

## Connection to Previous Phases

This is Phase 1 of the Dewhimsifier feature — the foundation all other phases build on. Phase 2 (WhimsySlider) will call `setLevel` to change the stop. Phase 3 (Component Integration) will call `useWhimsy()` in `ProjectsSection`, `ParticleField`, `ProjectModal`, and `ProjectCard` to read `config` flags and branch on them.
