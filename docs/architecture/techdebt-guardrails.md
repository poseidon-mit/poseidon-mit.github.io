# Tech Debt Guardrails

This document defines the enforcement contract for visual-system debt prevention.

## 1) Inline Style Contract

### Rules
1. Active route pages are tracked from `src/router/lazyRoutes.ts`.
2. Visual-lock routes (defined in `spec/ux-visual-baseline.json`) must not exceed the per-route cap declared in:
   - `docs/baselines/inline-style-exceptions.json`
3. All route pages must not increase inline-style count above:
   - `docs/baselines/inline-style-route-baseline.json`

### Enforcement
- `scripts/check-inline-style-contract.mjs`
- Included in `npm run check:design-system:strict`

## 2) Token SSoT Contract

### Rules
1. `src/styles/system/tokens.css` is the source of truth for shared system variables.
2. `src/styles/layers/poseidon.css` must not redefine variables already present in `tokens.css`.
3. Layer files may define only extension variables not part of system SSoT.

### Enforcement
- `scripts/check-token-ssot.mjs`
- Included in `npm run check:design-system:strict`

## 3) Legacy Glass Contract

### Rules
1. Route/runtime card glass must use `Surface` primitive, not legacy CSS utility classes.
2. Forbidden runtime classes:
   - `surface-glass`
   - `glass-surface`
   - `glass-surface-card`
3. Forbidden legacy component:
   - `GlassCard`

### Enforcement
- `scripts/check-design-system-usage.mjs --strict`

## 4) Baseline Update Procedure

Only update baselines when there is an intentional, reviewed visual-system change.

### Required steps
1. Capture reason in PR description:
   - why baseline changed,
   - impacted routes,
   - rollback strategy.
2. Update baseline files explicitly in the same PR.
3. Re-run strict gates:
   - `npm run check:design-system:strict`
   - `npm run ux:visual:capture:strict`
   - `npm run ux:visual:diff:strict`
4. Require reviewer approval from frontend-platform owner.

## 5) CI Binding

`check:design-system:strict` is the canonical local/CI gate for this contract.
If new guardrails are added, they must be wired into this script chain in `package.json`.
