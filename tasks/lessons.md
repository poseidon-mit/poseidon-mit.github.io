# Lessons

## 2026-03-06

- When Safari desktop scroll performance regresses on a marketing page, check offscreen video playback, fixed `backdrop-filter` layers, and `whileInView` reveal density before changing layout/content.

## 2026-03-08

- When the user upgrades the request from incremental UX refinement to a from-scratch redesign, replace obsolete assumptions in `tasks/todo.md` immediately instead of layering the new direction on top of the old plan.
- When reviewing a strategy against the current repo, separate "blocked by current canonical/contracts" from "acceptable if canonical/contracts are intentionally being rewritten"; otherwise the review overstates implementation risk.
- When the user explicitly requires English-only output, switch all subsequent responses to English immediately and keep them there for the rest of the thread.
- When the user narrows a UI audit to a specific component state, verify that exact live state on both desktop and mobile before drafting remediation guidance.

## 2026-03-12

- When a flagship-route redesign changes both the visuals and the demo narrative, update canonical data, page wiring, and route-level tests together; otherwise the app keeps drifting between facade contracts and live pages.
- When a contract test only passes because of unused selector imports or AST-visible strings, the fix is wrong. Rewire the page to canonical data for real before touching the test.
- When a render-smoke test targets a redirect-only page or a query-driven detail screen, set the route state in the test rather than adding fake placeholder UI to production code.
- When a route or footer deep-links into Govern, verify the `auditId` against canonical relations (`alertToAction`, `recommendationToAction`, `actionToDecision`) instead of trusting page-local constants.
- When the user expands a prompt artifact from one engine to all flagship engines, replace engine-specific guardrails with shared hero/layout contracts first; otherwise the new prompt keeps accidental assumptions from the original engine.
- When the user says a visual bug still reproduces, do not stop after removing one animation layer; verify the live route pipeline end-to-end, including `Suspense` fallbacks, lazy-module caching, and unrelated overlays triggered by route prefetch.
- When the user says a settings surface is still too dense, do not respond by only shortening copy or splitting routes. Remove whole panels, summaries, and secondary controls until the screen has one obvious purpose.
- When a route family should visually match the flagship hero pages, do not polish it with route-local badges, pill navigation, or custom icon boxes. Reuse the shared hero canvas, backdrop, typography rhythm, and glass surfaces first.
