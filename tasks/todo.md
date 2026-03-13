# Landing Section 3 Shell Baseline Lock

## Intent

- Human: fix the visual mismatch in the landing trust/explainability scene where the right glass shell sits higher than the left `Perfect Memory` card.
- Task: lock the right-side outer shell baseline in `src/pages/Landing.tsx` so its bottom edge aligns with the left column on desktop without changing copy or section structure.
- Feel: minimal, precise, no layout drift.

## Plan

- [x] Remove the outer shell vertical translate/parallax from Landing Section 3.
- [x] Anchor any remaining shell motion to the bottom edge so the shell reads as grounded.
- [x] Preserve existing responsive behavior and avoid resizing the left trust cards.
- [x] Run targeted landing tests and a browser-level visual check, then record the outcome.

## Review

- Removed the Section 3 shell `y` transform in `src/pages/Landing.tsx` and set the shell to `origin-bottom`, so the desktop glass shell now stays visually grounded against the left-column baseline.
- Fixed a pre-existing responsive hook-order bug in `SpotlightVault` by hoisting `useMotionTemplate` out of a conditional branch; this was necessary to verify 375px behavior without tripping React's hook invariant.
- Browser verification on desktop at `1600x1200` confirmed the bottom delta between the right outer shell and the left `Perfect Memory` card is now `0px` after Section 3 enters view.
- Browser verification at `375x900` confirmed the section still stacks and does not introduce horizontal overflow (`scrollWidth === clientWidth === 375`).
- `npx vitest run src/__tests__/landing-trust-bar.test.tsx` and `npx vitest run src/pages/__tests__/LandingStructure.test.tsx` pass.
- `npx vitest run src/__tests__/landing-layout-freeze.test.tsx` still fails on pre-existing landing copy drift (`Open Prototype`, `Cinematic HUD`, footer `Trust` link) unrelated to this layout change.

# Engine List Screens Repo-Aware Prompt

## Intent

- Human: hand a separate AI a single, copy-paste-ready implementation prompt for the four Poseidon list screens.
- Task: merge the visual master prompt with this repo's routing, layout, motion, data, and test contracts so the implementation compiles cleanly.
- Feel: precise, repo-aware, zero ambiguity.

## Plan

- [x] Audit the current four list pages, shared wrappers, route metadata, and tests.
- [x] Write a finished implementation prompt that preserves the desired visual direction while respecting repo contracts.
- [x] Save the prompt as a reusable artifact under `tasks/`.
- [x] Record a short review note in this file after finalizing the artifact.

## Review

- Saved the finished prompt to `tasks/engine-list-screens-implementation-prompt.md`.
- The prompt now folds in repo-specific guardrails for route ownership, layout-owned `AuroraPulse` / `GovernFooter`, internal router links, reduced-motion handling, engine-token color usage, canonical data sourcing, and the existing accessibility/test contracts for spotlight links and CTA labels.

# Govern Ledger Terminal Refresh

## Intent

- Human: demo viewer evaluating whether Govern feels trustworthy and alive.
- Task: scan the immutable ledger panel and immediately understand what is being disclosed.
- Feel: precise, cinematic, terminal-like, but still readable.

## Plan

- [x] Replace the current fade-only ledger lines with a smooth sequential typewriter reveal.
- [x] Derive the top ledger disclosure lines from real Govern data instead of generic filler copy.
- [x] Keep reduced-motion behavior accessible by rendering the full content immediately.
- [x] Update tests so the new ledger disclosure contract is covered.
- [x] Run targeted verification for the Govern hero and record the outcome.

## Review

- `src/__tests__/govern-hero.test.tsx` passes with the new reduced-motion disclosure assertions and fake-timer typewriter coverage.
- `npm run typecheck` still fails on pre-existing errors in `src/components/poseidon/dashboard-hero.tsx`, `src/domain/poseidon-universe/selectors.ts`, and `src/pages/ExecuteApproval.tsx`; the Govern ledger change did not introduce the reported failures.
- Playwright browser verification could not run because the local Chrome profile was already held by an existing browser session.

---

# Engine Hero Companion Prompt

## Intent

- Human: a designer or implementation AI generating a more cinematic flagship hero without breaking repo contracts.
- Task: produce a companion prompt that preserves architectural, responsive, and semantic constraints across `dashboard`, `protect`, `grow`, `execute`, and `govern`.
- Feel: precise, implementation-oriented, zero ambiguity.

## Plan

- [x] Inspect flagship hero components, page wiring, and existing tests for hard constraints.
- [x] Extract the mobile, badge-color, motion, export-compatibility, and layout ownership rules the AI must obey.
- [x] Draft a repo-aware multi-engine companion prompt that can be appended to master prompts.
- [x] Final-read the prompt against current component/test contracts before handing it off.

## Review

- Saved the reusable multi-engine companion prompt to `tasks/engine-hero-design-caution-prompt.md`.
- The prompt now explicitly protects mobile 375px layout, engine-token color discipline, `useReducedMotionSafe`, Layout-owned `AuroraPulse`/`GovernFooter`, export aliases, and the copy/accessibility contracts asserted by the current hero tests.

---

# Landing Copy Audit And Rewrite Prompt

## Intent

- Human: review every visible string on the current `/` landing route, assess what is weak or inconsistent, and hand another AI a prompt that can rewrite the copy without changing the page structure.
- Task: audit the live landing copy source of truth, summarize current wording by section/component, review positioning and CTA clarity, then save a reusable rewrite prompt under `tasks/`.
- Feel: precise, editorial, repo-aware, zero ambiguity.

## Plan

- [x] Inspect the current `/` landing route and all visible copy sources that it renders.
- [x] Produce a section-by-section inventory of the current landing wording.
- [x] Review the copy for positioning, clarity, trust language, CTA strength, and consistency.
- [x] Write a reusable prompt that can generate improved landing copy while preserving the existing information architecture.
- [x] Record the final review and artifact paths in this file.

## Review

- Saved the current-copy inventory and critique to `tasks/landing-copy-audit.md`.
- Saved the copy-paste-ready rewrite prompt to `tasks/landing-copy-rewrite-prompt.md`.
- The audit surfaced the main structural issue: landing copy is split across inline JSX, `LANDING_COPY`, trust constants, and nav/footer components, so the page currently has no single live copy source of truth.
- The review also identified the main editorial issue: the page over-indexes on cinematic metaphors (`Cinematic HUD`, `The Glass Vault`) while under-explaining the user outcome and CTA hierarchy.

---

# AppShell UI Consistency Pass

## Intent

- Human: review the flagship app shell routes as one coherent product instead of a set of visually drifting pages.
- Task: unify hero motion, semantic surfaces, engine-token usage, and numeric typography without flattening the per-engine character of the experience.
- Feel: controlled, cinematic, precise, consistent.

## Plan

- [x] Add shared hero motion presets and semantic surface utilities for hero/detail/list/settings canvases.
- [x] Refactor Dashboard, Protect, Grow, Execute, and Govern hero components onto the shared hero motion contract.
- [x] Replace remaining `bg-card` / `border-border` list-detail surfaces on ExecuteHistory, Notifications, GrowGoalDetail, and GrowScenarios.
- [x] Align Settings and Chat with the shared surface/token system and add missing numeric typography on detail pages.
- [x] Run targeted verification and record the outcome here.

## Review

- Added shared `heroFadeUp`, `heroStaggerContainer`, and `dashboardHeroStaggerContainer` presets in `src/lib/motion-presets.ts`, then moved Dashboard, Protect, Grow, Execute, and Govern heroes onto the same reduced-motion-aware entry contract.
- Added semantic canvas and surface utilities in `src/styles/layers/poseidon.css` and applied them across AppShell hero, detail, list, settings, and chat surfaces to remove the remaining `bg-card` / `border-border` drift in the scoped pages.
- Normalized primary numeric readouts with `font-mono tabular-nums` on the touched detail and scenario pages, while keeping hover lift limited to selectable list cards instead of detail surfaces.
- Verified with `npm run typecheck` and `npx vitest run src/__tests__/protect-hero.test.tsx src/__tests__/grow-hero.test.tsx src/__tests__/execute-hero.test.tsx src/__tests__/govern-hero.test.tsx src/__tests__/infra-integrity.test.ts src/__tests__/flows/rights-exercise.test.tsx src/__tests__/target-scope-contracts.test.ts src/__tests__/demo-coherence.test.ts`; all targeted suites now pass.
- Manual desktop and 375px QA was not run in this pass, so visual acceptance for glass-border clipping and small-screen spacing still needs an explicit browser check.

---

# Grow / Protect Blink Investigation

## Intent

- Human: when opening Grow and Protect, the screen blinks for a moment.
- Task: identify whether the blink comes from duplicated motion, route-level remount/fade, or a loading fallback, then remove the unnecessary flash without changing the hero layouts.
- Feel: precise, minimal, no broader route-motion regressions.

## Plan

- [x] Reproduce the blink on `/grow` and `/protect`, then compare against `/dashboard`, `/execute`, and `/govern`.
- [x] Trace route-level animation, suspense fallback, and page-level hero motion to isolate the duplicate or conflicting transition.
- [x] Apply the smallest fix that removes the flash while preserving reduced-motion behavior and existing hero choreography.
- [x] Run targeted verification and record the outcome here.

## Review

- Headless Playwright reproduction showed two separate causes: `AppNavShell` was fading the entire route wrapper to near-zero opacity, and the app-router was still dropping into `PageSkeleton` because `prefetchRoute()` and `React.lazy()` were not sharing loaded module state.
- Removed the shell-level `AnimatePresence` opacity transition from `src/components/layout/AppNavShell.tsx` so route changes stay visually stable and page-owned hero motion remains the only entry choreography.
- Reworked `src/router/lazyRoutes.ts` to cache resolved route modules and expose loaded components synchronously, then updated `src/router/index.tsx` so navigation waits for the target route module before committing `path`.
- Updated `src/main.tsx` to render cached route components directly when available, which prevents warm app-route navigation from re-entering `Suspense` fallback.
- Kept render-prefetch on engine navigation links, but removed it from Settings links because `/settings` currently has a separate pre-existing import failure and should not poison unrelated route transitions.
- Verification: `npm run typecheck` is still blocked by the pre-existing missing import in `src/pages/Settings.tsx` (`@/components/settings/SettingsLayout`), not by this fix.
- Verification: headless Playwright against `http://127.0.0.1:4174/dashboard` now shows `Dashboard -> Protect` at `clickMs=97` and `Dashboard -> Grow` at `clickMs=50`, with `hasPageSkeleton: false` and no `vite-error-overlay` throughout the sampled transition window.

---

# Settings Density Reduction

## Intent

- Human: the Settings experience feels over-written and too dense to be user-friendly.
- Task: reduce copy volume and repeated explanatory text across the Settings overview and subpages without rewriting the structure.
- Feel: simpler, lighter, easier to scan.

## Plan

- [x] Fix the Settings route wiring so the workspace loads cleanly while editing the content.
- [x] Shorten the shared Settings header, nav summaries, and secondary helper text.
- [x] Trim repeated panel descriptions and row-level copy on AI, Integrations, and Rights.
- [x] Verify Settings loads without overlay and record the result.

## Review

- Routed `/settings/*` back through `src/pages/Settings.tsx` in `src/router/lazyRoutes.ts`, which matches the actual workspace-shell design and removes the broken route-to-content-file mapping.
- Removed the accidental circular default-export pattern from `src/pages/SettingsGeneral.tsx`, `src/pages/SettingsAI.tsx`, `src/pages/SettingsIntegrations.tsx`, and `src/pages/SettingsRights.tsx`.
- Compressed the shared Settings shell copy in `src/components/settings/SettingsLayout.tsx`: shorter workspace titles, shorter summaries, lighter helper text, and tighter secondary text styles.
- Trimmed repeated descriptions inside Settings Overview, AI, Integrations, and Rights so cards no longer explain the same concept twice.
- Verification: `npm run typecheck` passes.
- Verification: headless Playwright against `http://127.0.0.1:4175/settings` reports `hasOverlay: false`, and the page now renders the shortened Settings copy without a Vite error overlay.

---

# Settings Hub Re-architecture

## Intent

- Human: the current settings area feels structurally wrong and should read as a real settings workspace with clear `/settings`, `/settings/ai`, `/settings/integrations`, and `/settings/rights` destinations.
- Task: redesign the settings route cluster into a route-aware hub plus three dedicated workspaces without breaking current demo-state behavior or route contracts.
- Feel: controlled, product-grade, clear navigation hierarchy, no generic form-wall.

## Plan

- [x] Audit the current settings route cluster, contracts, and reusable primitives.
- [x] Rebuild the shared settings shell so overview and subpages have a clear local navigation model.
- [x] Redesign `/settings` into a hub that points cleanly into AI, integrations, and rights.
- [x] Recompose `/settings/ai`, `/settings/integrations`, and `/settings/rights` around dedicated content instead of one-tab-page behavior.
- [x] Run targeted settings verification and capture the results here.

## Review

- Rebuilt `src/components/settings/SettingsLayout.tsx` into a route-aware settings shell with a persistent local workspace nav, route-specific hero copy, a shared posture rail, and reusable settings surface primitives (`SettingsPanel`, `SettingsMetric`, `SettingsWorkspaceCard`).
- Reworked `src/pages/Settings.tsx` so the route switch now renders inside the new shared shell instead of presenting the settings cluster as one tabbed container.
- Redesigned `src/pages/SettingsGeneral.tsx` into an actual hub: overview metrics, explicit workspace cards for AI / Integrations / Rights, identity and security controls, and system-wide defaults/alert routing.
- Rebuilt `src/pages/SettingsAI.tsx` around AI-specific controls: global autonomy threshold, persona selection, and per-engine delegation/risk/toggle controls backed by demo state.
- Rebuilt `src/pages/SettingsIntegrations.tsx` into a connections workspace with lane-style integration cards, sync/scope posture, and an explicit handoff into Rights for governance controls.
- Rebuilt `src/pages/SettingsRights.tsx` into a sovereignty workspace with training opt-out, retention, export actions, consent scope disclosure, and the existing DELETE confirmation guard plus governance badge.
- Verification:
  `npm run typecheck`
  `npx vitest run src/__tests__/flows/rights-exercise.test.tsx src/pages/__tests__/visual-system-all-pages.test.tsx src/__tests__/target-scope-contracts.test.ts src/__tests__/infra-integrity.test.ts`
- Browser verification:
  Desktop at `1440x1100` confirmed `/settings` now renders as a hub with visible route segmentation and no horizontal overflow.
  Mobile at `375x900` confirmed `/settings` and `/settings/ai` keep the local nav usable and `scrollWidth === clientWidth === 375`.

---

# Settings Much Simpler Pass

## Intent

- Human: the Settings area is still too dense even after route separation.
- Task: remove secondary information and leave only the primary controls each Settings page actually needs.
- Feel: minimal, calm, obvious.

## Plan

- [x] Strip the shared Settings shell down to title plus compact local navigation.
- [x] Reduce `/settings` to a simple hub with the operator name and the three workspace entry cards.
- [x] Reduce `/settings/ai`, `/settings/integrations`, and `/settings/rights` to their core controls only.
- [x] Run targeted Settings verification and record the outcome.

## Review

- Simplified `src/components/settings/SettingsLayout.tsx` into a single-column header with compact nav pills; removed the posture rail, next-workspace card, and summary-heavy nav cards.
- Reduced `src/pages/Settings.tsx` to direct route rendering and removed the extra route-level transition wrapper.
- Reduced `src/pages/SettingsGeneral.tsx` to one name card plus the three workspace entry cards; removed metrics, defaults, alert routing, and the longer profile/security sections.
- Reduced `src/pages/SettingsAI.tsx` to two controls only: the global approval ceiling and default AI voice.
- Reduced `src/pages/SettingsIntegrations.tsx` to a single connected-systems panel; removed the metric row, posture sidebar, and extra action buttons.
- Reduced `src/pages/SettingsRights.tsx` to one privacy panel plus one export/delete panel while keeping the consent-scope heading, export actions, delete confirmation, and governance badge required by current tests.
- Verification:
  `npm run typecheck`
  `npx vitest run src/__tests__/flows/rights-exercise.test.tsx src/pages/__tests__/visual-system-all-pages.test.tsx src/__tests__/target-scope-contracts.test.ts src/__tests__/infra-integrity.test.ts`
- Browser verification:
  Desktop at `1440x1100` confirmed `/settings`, `/settings/ai`, `/settings/integrations`, and `/settings/rights` load without overlay and now present materially fewer sections than before.

---

# Settings Hero Parity Pass

## Intent

- Human: remove all Settings chips/badges and make the whole Settings family look like the other flagship hero screens.
- Task: align Settings with the shared hero visual language while keeping the Settings content simple.
- Feel: minimal, flagship-consistent, no extra ornament.

## Plan

- [x] Replace the Settings-local header shell with the shared hero-canvas/backdrop rhythm.
- [x] Remove chip/badge treatments from Settings nav, workspace cards, connection rows, and rights rows.
- [x] Align Settings typography, icon usage, and card surfaces with the rest of the hero family.
- [x] Run targeted verification and record the outcome.

## Review

- Rebuilt the Settings family shell around the same `hero-viewport` / `hero-canvas` rhythm used by the flagship routes and replaced the local radial-header treatment with `HeroBackdrop`-based composition.
- Removed Settings-specific pill navigation, workspace metadata chips, integration status badges, permission chips, and rights `Active` badges so the family no longer carries its own visual language.
- Simplified icon usage to match the hero family better: no boxed header icons, no decorative workspace icons, and only lightweight inline integration icons where they help scanning.
- Tightened typography to the same pattern used elsewhere: mono overlines, large low-noise headings, muted supporting copy, and simple glass panels instead of card-within-card ornament.
- Verification:
  `npm run typecheck`
  `npx vitest run src/__tests__/flows/rights-exercise.test.tsx src/pages/__tests__/visual-system-all-pages.test.tsx src/__tests__/target-scope-contracts.test.ts src/__tests__/infra-integrity.test.ts`
- Browser verification:
  Desktop at `1440x1100` confirmed `/settings`, `/settings/integrations`, and `/settings/rights` render with the simplified hero-style header and without the removed pill/badge treatments.
