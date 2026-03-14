# Landing Cross-Platform Performance Stabilization

## Intent

- Human: the landing page is too slow on iPhone Safari over cellular, the hero video takes too long to start, and the `Presentation` CTA can feel unresponsive.
- Task: improve first paint, CTA responsiveness, hero video startup, and `/deck` loading without degrading the desktop visual experience.
- Feel: same visual language, faster and more reliable interaction, no new LP download CTA.

## Plan

- [x] Rework landing hero media into a poster-first flow with delayed video start and Safari-safe playback control.
- [x] Add optimistic navigation support to router links and apply it to landing CTAs.
- [x] Switch `/deck` to the delivery PDF, render a lightweight shell first, and lazy-load the PDF viewer.
- [x] Move service-worker cleanup off the render-critical path and stop pulling app-shell code into public boot.
- [x] Generate optimized poster/video assets, run targeted tests/build, and record the outcome.

## Review

- Added poster-first hero media to `src/pages/Landing.tsx`: the landing now renders a high-priority poster immediately, delays MP4 assignment until after first paint, chooses among new mobile/tablet/desktop MP4 variants before playback, and reuses Safari-safe autoplay handling with fallback to poster on failure.
- Extended `src/router/index.tsx` with `navigationStrategy="optimistic"` and applied it to landing CTA links so `/deck` and dashboard transitions commit immediately instead of waiting on lazy-route downloads.
- Moved `/deck` into a lightweight shell in `src/pages/DeckViewer.tsx` and lazy-loaded the pdfjs viewer from `src/components/deck/DeckPdfViewer.tsx`, while switching the inline viewer to `public/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf` rather than the 23MB master PDF.
- Deferred service-worker cleanup in `src/main.tsx` until after initial render and lazy-loaded `AuthenticatedLayout`, which moves app-shell code out of the public-route critical path.
- Added small performance mark helpers in `src/lib/performance-marks.ts` and emitted marks for poster visibility, CTA click start, deck route feedback, video first frame, and first deck page render.
- Added/updated tests in `src/router/__tests__/navigation-strategy.test.tsx` and `src/__tests__/landing-layout-freeze.test.tsx` to cover optimistic routing and the new poster-first hero contract.
- Generated optimized media assets:
  `public/videos/hero-theme-mobile-v3.mp4` (`927KB`), `public/videos/hero-theme-tablet-v3.mp4` (`2.2MB`), `public/videos/hero-theme-desktop-v3.mp4` (`4.9MB`), and `public/videos/hero-theme-poster-v3.webp` (`118KB`).
- Verification passed:
  `npm run typecheck`
  `npx vitest run src/router/__tests__/navigation-strategy.test.tsx src/__tests__/landing-layout-freeze.test.tsx src/pages/__tests__/LandingStructure.test.tsx`
  `npm run build`

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

---

# Mobile Local-Dev Load Reliability (iPhone)

## Intent

- Human: iPhone real-device local development can look black/blank, and the local dev URL is easy to invalidate when Vite silently hops ports.
- Task: make local mobile boot deterministic, fail fast on port drift, and surface a diagnostic instead of an empty screen.
- Feel: minimal, operational, no engine-page rewrites.

## Plan

- [x] Lock Vite dev to `5173` with `strictPort: true`.
- [x] Add an explicit `dev:mobile` entrypoint aligned to the same LAN-safe host/port contract.
- [x] Add a pre-mount local-dev boot overlay plus a route-resolution diagnostic card for delayed local boot.
- [x] Emit dev-only telemetry for overlay install, pre-mount resolve, first-route ready, and route-resolution timeout.
- [x] Add targeted tests and verify build plus mobile local-dev smoke behavior.

## Review

- Updated `vite.config.ts` to use `strictPort: true` and aligned `package.json` scripts so `dev`, `dev:vite`, and new `dev:mobile` all target `0.0.0.0:5173` without silent port fallback.
- Added `src/bootstrap/dev-boot-diagnostics.tsx` with LAN/local-origin detection, a lightweight pre-mount overlay for local dev, and a reusable route-timeout diagnostic card that tells the user to use the LAN IP, stay on the same Wi-Fi, and clear any process occupying `5173`.
- Wired `src/main.tsx` to install the pre-mount overlay before `ReactDOM.createRoot`, dismiss it on first mount, and log dev telemetry for pre-mount resolution and first-route readiness.
- Extended `RouteLoadingFallback` so local dev shows the diagnostic card after a shorter route-resolution timeout instead of only a generic spinner/reload state.
- Added `src/__tests__/local-dev-mobile-reliability.test.tsx` to lock the local-host detection, diagnostic copy, and strict-port script/config contract.
- Verification passed:
  `npx vitest run src/__tests__/loading-state-architecture.test.tsx src/__tests__/local-dev-mobile-reliability.test.tsx`
  `npm run build`
  `npm run dev` now fails fast with `Error: Port 5173 is already in use` when that port is occupied.
- Mobile smoke verification passed against `http://192.168.68.53:5173/protect` on a mobile-sized viewport: the pre-mount overlay appeared, logged telemetry, dismissed, and the Protect page rendered successfully.
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

---

# Settings Static Visual Alignment

## Intent

- Human: the unified Settings screen still feels like a separate admin surface instead of part of the same flagship HERO family.
- Task: align Settings typography, accent hierarchy, symbolic iconography, and glass surfaces with the Govern-led HERO visual grammar without changing layout, routing, or state behavior.
- Feel: controlled, cinematic, precise, premium, and quieter than the flagship HERO pages.

## Plan

- [x] Rework the shared Settings header and section metadata so the page reads like a Govern control surface instead of a generic admin page.
- [x] Collapse section-level dominant accents to a Govern-led system while preserving only local semantic accents where they materially aid interpretation.
- [x] Restyle Settings cards, profile details, labels, and footer terminus so they belong to the same surface family as the HERO panels.
- [x] Add a lightweight visual-contract test for the Settings header/section static grammar, then run targeted verification.
- [x] Record the final review here after verification.

## Review

- Reworked `src/components/settings/SettingsLayout.tsx` so the header now uses a shared HERO backdrop, a Govern-led eyebrow, lighter title hierarchy, and unified section metadata rather than the older admin-shell treatment.
- Collapsed `SETTINGS_SECTION_ACCENTS` to a Govern-dominant system with symbolic section icons (`User`, `Brain`, `Link2`, `Shield`) and kept the old cyan/violet/amber accents only for local detail cues such as the AI slider and integration status dots.
- Restyled `src/pages/SettingsGeneral.tsx`, `src/pages/SettingsAI.tsx`, `src/pages/SettingsIntegrations.tsx`, and `src/pages/SettingsRights.tsx` to use mono micro-labels, lighter HERO-style headings, quieter profile chrome, blue-active controls, toned-down row icons, and a footer-like audit terminus instead of the old card-grid admin tone.
- Updated shared primitives in `src/components/poseidon/hero-concept-primitives.tsx`, `src/components/poseidon/glass-slider.tsx`, and `src/styles/layers/poseidon.css` so the Settings surfaces belong to the same prism/surface family as the HERO pages without introducing new motion or heavier blur.
- Added `src/__tests__/settings-visual-contract.test.tsx` to lock the Govern-led header copy and unified section-accent contract while keeping the existing route/state tests intact.
- Verification passed:
  `npm run typecheck`
  `npx vitest run src/__tests__/settings-route-persistence.test.tsx src/__tests__/settings-visual-contract.test.tsx src/__tests__/flows/rights-exercise.test.tsx src/contracts/__tests__/screen-contracts-v4.test.tsx`
  `npm run build`
- Browser verification:
  Playwright at `1440x1100` confirmed the static hierarchy now reads as a Govern control surface with a centered identity card, quieter profile chrome, unified blue section eyebrows, and a clearer footer terminus.
  Playwright at `375x900` confirmed `window.innerWidth === scrollWidth === 375`, the main Settings grids collapse to single-column computed layouts, and the same Govern-led static tone holds on the narrow viewport.

---

# Settings Balance Pass

## Intent

- Human: the current unified Settings page still feels text-heavy and the centered profile card is too vertical for the surrounding layout.
- Task: rebalance the screen by widening the profile card, renaming it to `Profile`, and removing non-essential helper copy and permissions pills.
- Feel: wider, cleaner, more balanced, less explanatory.

## Plan

- [x] Convert the profile card into a wider landscape layout while preserving the same identity data.
- [x] Remove the requested helper text and section descriptions from AI and Rights.
- [x] Remove the permissions pill badges from Integrations and keep only the essential status information.
- [x] Update the targeted Settings tests to the new copy and run verification.

## Review

- Updated `src/pages/SettingsGeneral.tsx` so the former `Identity Surface` card now reads `Profile`, drops `Workspace owner`, and becomes a landscape card on desktop with the avatar/name block on the left and contact rows on the right.
- Removed the requested helper copy from `src/pages/SettingsAI.tsx` and `src/pages/SettingsRights.tsx`, keeping only the core control labels and action content.
- Removed the integration permissions pill badges from `src/pages/SettingsIntegrations.tsx` so the rows now show only the provider, description, status, and toggle.
- Updated `src/__tests__/settings-visual-contract.test.tsx` to reflect the new `Profile` label and the removal of the deleted copy.
- Verification passed:
  `npm run typecheck`
  `npx vitest run src/__tests__/settings-route-persistence.test.tsx src/__tests__/settings-visual-contract.test.tsx src/__tests__/flows/rights-exercise.test.tsx`
- Browser verification:
  Playwright at `http://127.0.0.1:4174/settings` confirmed the profile card is landscape on desktop (`728px` wide vs `382px` tall) and the page still has no horizontal overflow (`scrollWidth === innerWidth`).

---

# Settings Profile Width Alignment

## Intent

- Human: the `Profile` card still reads as a centered medium-width block instead of a full-width landscape panel matching the `Settings` shell above it.
- Task: remove the remaining width constraint from the profile panel and align its outer width to the header shell while keeping the same content and mobile behavior.
- Feel: full-width, flatter, more balanced against the header shell.

## Plan

- [x] Remove the `Profile` panel max-width constraint and use the section width already provided by the shared page content container.
- [x] Switch the desktop internals to a fixed 2-column grid that keeps the identity rail wide enough for `Shinji Fujiwara` to stay on one line.
- [x] Tighten the visual contract so the widened panel shape is locked, then rerun targeted verification.

## Review

- Updated `src/pages/SettingsGeneral.tsx` so the `Profile` panel no longer uses `mx-auto max-w-[52rem]`; it now fills the shared page content width and uses a desktop `lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]` layout.
- Kept the identity rail on the left and the contact rows on the right, but widened the left rail and added desktop-only `whitespace-nowrap` so `Shinji Fujiwara` stays on one line when the screen is wide enough.
- Updated `src/__tests__/settings-visual-contract.test.tsx` to assert that the profile card remains `w-full` and no longer carries the old centering and max-width classes.
- Verification passed:
  `npm run typecheck`
  `npx vitest run src/__tests__/settings-route-persistence.test.tsx src/__tests__/settings-visual-contract.test.tsx src/__tests__/flows/rights-exercise.test.tsx`
- Browser verification:
  Playwright against `http://127.0.0.1:4175/settings` measured `settings-hero-header` width `728px` and `settings-profile-card` width `728px` with `diff = 0`, and the profile card remained landscape.
  A follow-up Playwright pass confirmed the right contact rows no longer overflow the card: `maxOverflowRight = 0` and `scrollWidth === innerWidth`.

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
# HERO / Settings ページ遷移・描画性能最適化

## Intent

- Human: HERO と Settings の app-shell ページで、通常遷移時のローディング画面をなくし、クロスプラットフォームでの描画負荷も下げたい。
- Task: app-shell 内遷移を seamless 化し、Settings keep-mounted 化、hero/settings の motion / blur / canvas / rerender を整理し、in-scope regression guard を追加する。
- Feel: same visual language, less flashing, lighter idle cost, more native-feeling navigation.

## Plan

- [x] Add staged `seamless` app-shell navigation with pending-route telemetry and delayed busy state.
- [x] Replace shell `prefetch="render"` with intent prefetch plus idle warmup for flagship routes.
- [x] Introduce shared performance profiling and shared hero/settings CSS fallbacks for blur, viewport height, and continuous effects.
- [x] Convert Settings to keep-mounted route sections and remove `framer-motion` from Settings + GovernFooter.
- [x] Remove `framer-motion` from in-scope hero routes and gate heavy effects/timers/canvas by performance profile.
- [x] Split demo-state consumption into slice hooks for shell + HERO/Settings surfaces.
- [x] Add/update targeted tests, run verification, and record the outcome below.

## Review

- Added staged app-shell navigation in `src/router/index.tsx`: app routes now default to `seamless`, keep the current page visible while target modules preload, expose `pendingPath`/`showPendingIndicator`, and mark `route_intent`, `route_module_ready`, `route_commit`, `route_paint`, `module_load_ms`, `app_shell_route_switch_ms`, and `route_commit_to_paint_ms`.
- Reworked shell prefetching: engine/settings links were moved to `prefetch="intent"`, `src/hooks/useRouteWarmup.ts` now warms `/dashboard → /protect → /grow → /execute → /govern → /settings` on idle when device/network conditions allow, and `AppNavShell` / `Sidebar` / `TopBar` now surface a delayed non-blocking pending indicator instead of full-page takeover.
- Added `src/hooks/usePerformanceProfile.ts` and applied it across HERO/Settings surfaces. `HeroBackdrop`, `HeroUnifiedFooter`, `AuroraPulse`, `MatrixRain`, Execute, Govern, Protect, Grow, Dashboard, and Settings now downgrade blur, hover glow, marquee, pulse, and continuous animation based on reduced motion, pointer type, page visibility, and low-end device signals.
- Converted Settings into a keep-mounted route model in `src/pages/Settings.tsx`, moved Settings state reads to slice hooks in `src/pages/SettingsGeneral.tsx`, `src/pages/SettingsAI.tsx`, and `src/pages/SettingsRights.tsx`, and removed `framer-motion` from the Settings route family and `src/components/poseidon/govern-footer.tsx`.
- Rebuilt `src/components/poseidon/execute-hero.tsx` and `src/components/poseidon/govern-hero.tsx` onto plain DOM/CSS transitions, replaced Govern canvas scaling with `setTransform()` in `src/components/poseidon/effects/MatrixRain.tsx`, and moved shared footer/orbit animation rules into `src/styles/layers/poseidon.css` with Safari-safe viewport/backdrop fallbacks plus `100vh -> 100svh -> 100dvh` in `src/styles/layouts/hero-viewport.css`.
- Split demo-state subscriptions by slice in `src/lib/demo-state/provider.tsx`, then migrated shell, Dashboard, Execute, and Settings consumers off the monolithic `useDemoState()` read path where it mattered for HERO/Settings rerender pressure.
- Reduced shell-side motion cost by lazy-loading `CommandPalette`, mobile `SideDrawer`, and toast UI renderers in `src/components/layout/AppNavShell.tsx` and `src/components/providers/ToastProvider.tsx`; the build now emits separate `CommandPalette`, `sheet`, and `toast` chunks rather than forcing those motion surfaces into the earliest shell render path.
- Verification passed:
  `npm run typecheck`
  `npx vitest run src/router/__tests__/navigation-strategy.test.tsx src/__tests__/settings-route-persistence.test.tsx src/__tests__/govern-hero.test.tsx src/__tests__/execute-hero.test.tsx src/__tests__/loading-state-architecture.test.tsx`
  `npm run build`
# Settings Unified Focus-Center Layout

## Intent

- Human: make Settings feel like one coherent control surface instead of four split workspaces, with the user identity visually centered and the rest of the controls subordinate.
- Task: collapse Overview, AI, Integrations, and Rights into a single `/settings` page using the focus-center layout, while keeping the current controls and reducing route/UI overhead.
- Feel: Dark-Luxe, composed, premium, lighter than the current tabbed/settings-subroute experience.

## Plan

- [x] Replace the tabbed `SettingsLayout` shell with a single-page header and centered profile card layout.
- [x] Recompose `Settings.tsx` so Profile, AI, Integrations, and Rights always render on one page and keep their local state.
- [x] Normalize legacy `/settings/ai`, `/settings/integrations`, and `/settings/rights` URLs to `/settings` and update visible settings links/breadcrumbs accordingly.
- [x] Add the necessary Settings-specific performance fallbacks so the unified page stays light on mobile/Safari.
- [x] Update the targeted Settings tests and route-contract assertions, then run the relevant verification commands.

## Review

- Replaced the old tabbed Settings shell with a single `Settings` canvas that centers the profile card, places AI and Integrations in a responsive middle band, and keeps Rights full-width below with a split internal layout.
- Added `phone` to `DemoUser`, surfaced profile identity in the centered hero card, and removed the old Overview jump-card pattern so all controls stay inline on one screen.
- Added router-level `replace` support and used it to normalize `/settings/ai`, `/settings/integrations`, and `/settings/rights` back to `/settings`, while also collapsing visible Settings links and breadcrumbs onto the canonical route.
- Swapped Settings-specific visuals off the old tab/nav shell and onto lightweight CSS surfaces with single-layer glass, static accent gradients, and existing `usePerformanceProfile()` fallbacks.
- Verification passed:
  `npm run typecheck`
  `npx vitest run src/__tests__/settings-route-persistence.test.tsx src/__tests__/flows/rights-exercise.test.tsx src/contracts/__tests__/screen-contracts-v4.test.tsx src/__tests__/target-scope-contracts.test.ts`
  `npm run build`
  Browser spot check with Playwright on `http://127.0.0.1:4174/settings` at `1440x1100` and `375x900`

# Execute HERO Connector Centerline Fix

## Intent

- Human: the Execute HERO step tracker still shows connector lines above the circles instead of through their vertical centerline.
- Task: correct the step-tracker row alignment without changing copy, step state logic, or the equal-width connector model.
- Feel: precise, stable, visually centered.

## Plan

- [x] Remove the row-1 `items-start` behavior and replace it with an explicit two-row grid for the pipeline.
- [x] Make node wrappers and connector wrappers fill the first row so both center against the same 40px track.
- [x] Add regression hooks/assertions for the pipeline grid and connector wrappers.
- [x] Update the lessons log and run targeted verification.

## Review

- Updated `src/components/poseidon/execute-hero.tsx` so `StepPipeline` now uses `gridTemplateRows: "40px auto"`, no longer uses `items-start`, and gives both circle wrappers and connector wrappers `h-full` in row 1.
- Added `data-testid="execute-step-pipeline"` and per-connector test ids so the row contract is asserted directly instead of relying on text-only DOM checks.
- Extended `src/__tests__/execute-hero.test.tsx` with a regression test that verifies the two-row grid, the equal-width alternating columns, and row-1 connector placement.
- Verification:
  `npx vitest run src/__tests__/execute-hero.test.tsx`
- Browser verification:
  Playwright against `http://127.0.0.1:5173/execute` measured connector centerline deltas of `0` at both `1440x1100` and `390x844`, with all three connector wrappers rendering at `40px` row height.

# Mobile App-Shell Scroll Reset

## Intent

- Human: on mobile, switching between Protect, Grow, Execute, and Govern should always land at the top of the next screen instead of preserving the previous scroll position.
- Task: reset the actual mobile scroll owner during app-shell route changes and when the active mobile tab is tapped again.
- Feel: deterministic, native, no retained scroll carryover between flagship routes.

## Plan

- [x] Confirm whether mobile scroll ownership lives on `window` or `main#main-content`.
- [x] Reset the shell-owned scroll container on app-shell path changes.
- [x] Reuse the same scroll-to-top helper for active mobile-tab retaps.
- [x] Add regression coverage and verify with a mobile browser pass.

## Review

- Updated `src/components/layout/AppNavShell.tsx` to track `main#main-content` via ref and reset that shell-owned scroll container in a `useLayoutEffect` whenever the `path` prop changes.
- Kept the existing `window.scrollTo` fallback, but moved the source of truth to the shell viewport so mobile app-shell navigation no longer depends on the wrong scroll owner.
- Rewired the active mobile bottom-nav retap path to use the same helper, so tapping the current engine tab now scrolls the shell viewport to the top on mobile as originally intended.
- Added regression tests in `src/__tests__/mobile-scroll-contract.test.tsx` for both path-change reset and active-tab retap reset.
- Verification:
  `npx vitest run src/__tests__/mobile-scroll-contract.test.tsx`
- Browser verification:
  Playwright at `390x844` reproduced the old issue (`/protect` -> `/grow` kept `main.scrollTop = 640`) before the fix, and after the fix measured `main.scrollTop = 0` on `/grow`, `/execute`, and `/govern` immediately after each mobile nav transition.
