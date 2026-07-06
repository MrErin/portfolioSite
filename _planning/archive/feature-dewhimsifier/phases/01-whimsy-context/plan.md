<!-- STATUS: COMPLETE -->

# Phase 1: WhimsyContext & Config

## Goal

Create the whimsy data layer — types, config object, context, provider, and hook — and wire the provider into `App.tsx`. No visual changes.

## Tasks

### Task 1: Create `WhimsyContext.tsx` `DONE`

**Files:** `src/features/whimsy/WhimsyContext.tsx`, `src/features/whimsy/index.ts`

**Action:**
- Define `WhimsyLevel = 0 | 1 | 2`
- Define `WhimsyConfig` interface: `{ parallax: boolean; particles: boolean; growFromCard: boolean; boringImages: boolean }`
- Define `WHIMSY_LEVELS: Record<WhimsyLevel, WhimsyConfig>` mapping each stop to its flags
- Create `WhimsyContext` with `{ level, config, setLevel }` shape
- Create `WhimsyProvider` component — initialises to `0` (no localStorage), provides context
- Export `useWhimsy` hook with runtime guard (throws if used outside provider)
- Create barrel export in `index.ts`

**Verify:** No TypeScript errors. `useWhimsy` is importable.

**Done when:** Context file compiles cleanly and exports `WhimsyProvider`, `useWhimsy`, `WhimsyLevel`, `WhimsyConfig`, `WHIMSY_LEVELS`.

---

### Task 2: Wire `WhimsyProvider` into `App.tsx` `DONE`

**Files:** `src/App.tsx`

**Action:** Wrap the existing JSX tree with `<WhimsyProvider>`. Provider is the outermost wrapper (outside skip-link, main, FAB, overlays).

**Verify:** App compiles and runs. No visual change to the site.

**Done when:** App renders normally with provider in place.

---

## Dependencies

None — this is the foundation for Phases 2 and 3.

## Security Checklist

- [x] Input validation: no user input in this phase
- [x] SQL injection prevention: N/A
- [x] Auth protection: N/A
- [x] Secrets handling: N/A — no secrets
- [x] Destructive actions: N/A
- [x] Dependency review: no new dependencies

## Issues Discovered During Verification Stage

### Issue 1: ESLint `react-refresh/only-export-components` error on WhimsyContext.tsx

**Description:** `WhimsyContext.tsx` exports `WhimsyProvider` (component) alongside `useWhimsy` (hook), `WhimsyLevel`/`WhimsyConfig` (types), and `WHIMSY_LEVELS` (constant). The `react-refresh/only-export-components` rule flags this as an error. This is a standard React context co-location pattern — the hook, types, and config are meaningless without the provider.

**Fix:** Add `allowConstantExport: true` to the rule in `eslint.config.js`:
```js
rules: {
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
},
```
Could not apply from fish tank (permission denied on `eslint.config.js`).

**Fix Requires User Input:** YES
**Resolution:** [EMPTY — awaiting user]
