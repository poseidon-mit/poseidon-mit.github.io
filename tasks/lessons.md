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

## 2026-03-14

- When the user narrows public-route optimization scope, keep LP CTA changes strictly within that route. Do not reintroduce removed actions, such as download affordances, on the landing surface or as a substitute requirement elsewhere.
- When the user collapses a multi-route settings area into one canonical screen, remove the internal pseudo-navigation and normalize legacy URLs immediately; keeping both models alive at once just preserves the old complexity.
- When a settings screen feels visually detached from the flagship HERO routes, do not solve it with more badges or local accent colors. Reuse the HERO typography rhythm, Govern-led accent hierarchy, symbolic section icons, and shared surface treatment first.
- When the user asks for better balance on a settings surface, widen the dominant center card and remove explanatory helper copy and scope pills before introducing any new decoration.
- When the user says a widened settings card still does not read full-width, remove route-local max-width constraints entirely and align it to the same shell width as the page header rather than just making it somewhat larger.
- When a widened settings card overflows on the right, treat it as a grid shrink/min-width bug first: add `min-w-0` to the right rail and row containers before changing the overall width again.
- When iPhone local-dev looks black or blank across every route, verify Vite host/port stability and the exact LAN URL before touching route or page code; silent dev-port hopping is a more likely cause than a cross-app render failure.
- When a HERO step tracker looks visually uneven, do not stretch connector lines inside per-step cells; separate steps and connectors into distinct layout columns so line lengths stay uniform regardless of label wrapping.
- When a HERO step tracker requires the connector to align with the center of the circles, pin step nodes and connectors to the same explicit grid row and move labels to a separate row; otherwise the line will drift downward with text flow.
- When a shared HERO step-tracker grid row must center circles and connectors together, never leave `items-start` on the grid container; it collapses connector cells to line height and pins them to the top of the row.
- When mobile app-shell routes scroll inside `main#main-content`, router-level `window.scrollTo` is not enough; reset the shell-owned scroll container itself on route changes and same-tab retaps.
