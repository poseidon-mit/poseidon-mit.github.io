# Production Screen Recovery Runbook

## Purpose
Prevent and diagnose recurring blank-screen incidents on `https://poseidon-mit.com`.

## Root cause this runbook addresses
Blank screen can occur when GitHub Pages serves repository source (legacy mode) instead of built Vite artifacts. In that case, root HTML may reference `/src/main.tsx`, which browsers cannot execute as production module JS.

## Invariants (must always hold)
1. GitHub Pages `build_type` is `workflow`.
2. Deployed root HTML references hashed Vite assets (`/assets/index-*.js`).
3. Deployed root HTML does **not** reference `/src/main.tsx`.
4. Service Worker is disabled in production during stabilization (`VITE_ENABLE_SW=0`).

## Fast checks
1. Pages mode:
   - `GH_TOKEN=... GITHUB_REPOSITORY=poseidon-mit/poseidon-mit.github.io node scripts/check-pages-mode.mjs`
2. Root HTML:
   - `curl -fsSL https://poseidon-mit.com/ | grep -E '/assets/index-|/src/main.tsx'`
3. Browser console symptom:
   - Look for `Failed to load module script` and MIME mismatch errors.

## Recovery steps
1. Confirm latest deploy workflow is green (`Deploy to GitHub Pages`).
2. Confirm Pages mode is workflow.
3. Re-run deploy workflow manually (`workflow_dispatch`) if needed.
4. If users are stuck on stale cache:
   - Ask for one hard refresh first.
   - App bootstrap will run one-time SW/cache cleanup when SW is disabled.

## Re-enabling Service Worker (later)
Do not re-enable until:
1. Two consecutive production deploys complete with no blank-screen reports.
2. Cache versioning and update migration behavior are explicitly tested.
3. `VITE_ENABLE_SW` is changed with rollout notes in release PR.

