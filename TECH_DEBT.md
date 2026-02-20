# TECH_DEBT

Last updated: 2026-02-20

## Closed

### TD-2026-02-20-A
- status: `CLOSED`
- title: `surface-glass` class usage in active routes
- summary:
  - All active route pages and shared route-level components moved away from `.surface-glass`.
  - Runtime usage is now blocked by strict checks.
- evidence:
  - `rg -n "surface-glass" src/pages src/components/layout src/components/landing` => `0`

## Open

### TD-2026-02-20-B
- status: `OPEN`
- owner: `frontend-platform`
- risk: `MEDIUM`
- title: Route page inline-style debt (legacy presentation blocks)
- scope:
  - Active `lazyRoutes` pages still contain inline `style={{...}}` in legacy sections.
  - New debt is blocked, but existing debt remains until route-by-route refactor.
- acceptance:
  1. `style={{...}}` count in `src/pages` reaches 0 for active routes, or is reduced to approved exception set.
  2. `npm run check:design-system:strict` stays green.

### TD-2026-02-20-C
- status: `OPEN`
- owner: `frontend-platform`
- risk: `LOW`
- title: Legacy reference stylesheet retained for historical debugging
- scope:
  - `src/styles/legacy/glass-utilities.legacy.css` intentionally remains as non-imported reference.
- acceptance:
  1. Remove file once migration period closes and no rollback need remains.
  2. Keep it non-imported in runtime entrypoints.
