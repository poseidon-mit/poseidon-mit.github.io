# Grow Hero Redesign Ideation

## Cross-Engine Hero Look & Feel Alignment

### Plan

- [x] Inspect `Dashboard`, `Protect`, `Grow`, `Execute`, and `Govern` hero implementations plus shared page wrappers
- [x] Compare typography, neon/glow usage, aurora intensity, CTA hierarchy, and proof-card composition
- [x] Draft 3 adjustment options from distinct viewpoints so the five heroes feel system-level consistent without flattening engine identity
- [x] Recommend one direction with concrete normalization rules and architecture implications

### Working Findings

- Typography grammar is inconsistent: `Dashboard`, `Execute`, and `Govern` use display-face editorial headlines, while `Protect` leans on denser operational type and `Grow` promotes a mono numeric hero as the primary visual anchor.
- Glow strategy is inconsistent: `Grow` uses the strongest visible neon in the hero (`AuroraPulse intensity="normal"` plus numeric drop-shadow), while `Dashboard`, `Execute`, and `Govern` use subtler aurora backgrounds, and `Protect` switches to critical-red aurora instead of engine-green when a critical threat exists.
- Hero entry framing is inconsistent at the page level: `Protect` and `Grow` begin with `Engine status: Good`, `Execute` uses `Execute Engine` plus a system-status line, `Dashboard` has no pre-hero badge, and `Govern` starts directly with the hero.
- CTA hierarchy is inconsistent: some heroes lead with a filled gradient button (`Protect`, `Execute`, `Govern`), `Grow` ends with a tertiary text CTA, and `Dashboard` distributes micro-CTAs across three cards instead of one dominant action.
- The codebase already hints at a systematic hero taxonomy in [`src/styles/pages/engine-page.css`](/Users/shinjifujiwara/code/poseidon-mit.github.io/src/styles/pages/engine-page.css), but the current hero facades are largely custom and do not share one common hero grammar.

### Review

- Direction A: normalize hero grammar structurally. Keep each engine’s proof artifact, but give all five heroes one shared skeleton: status/kicker row, display headline, proof zone, primary CTA zone, supporting metric zone.
- Direction B: normalize luminous language. Restrict neon/glow to one semantic role per hero: either primary metric emphasis or live-state emphasis, not both. Default `AuroraPulse` to `subtle`; reserve `normal` for the one hero meant to feel predictive/optimistic.
- Direction C: normalize typography roles. Use `var(--font-display)` only for the editorial statement, `var(--font-mono)` only for money/confidence/IDs, and stop using mono numeric figures as the first visual headline unless all five heroes adopt the same rule.
- Recommended path: Direction A first, then B. Structural consistency will make the five heroes feel related without flattening the engine personalities. Glow and font tuning should sit on top of that shared grammar, not replace it.

## Plan

- [x] Inspect current Grow page structure and existing hero facade
- [x] Review supporting recommendation data and engine-token constraints
- [x] Compare Grow hero treatment with other engine heroes for consistency
- [x] Produce concise redesign concepts focused on visual impact and clean architecture

## Review

- Current Grow hero is structurally sound but visually flatter than Protect and Execute.
- The strongest realistic proof points are `+$24,437` projected gain, `$612/mo` identified capacity, `23rd -> 67th percentile` cohort lift, and the top recommendation.
- The redesign should keep a single primary narrative above the fold and avoid adding more cards than the user can parse in 3-5 seconds.
- Best direction: lead with a "future delta" story, then support it with one chart, one cohort proof, and one next-action card.

---

## Landing Safari Performance

### Plan

- [x] Inspect Landing hotspots tied to Safari scroll jank
- [x] Reduce offscreen media/compositing work on Landing
- [x] Reduce scroll-triggered animation work around the architecture section
- [x] Run focused landing/coherence verification

### Review

- Paused the hero video whenever the hero is offscreen or the tab is hidden so Safari is not decoding/compositing it while the user is in lower sections.
- Switched Landing to calm/static section reveals on Safari while preserving the shared motion preset path for other browsers and reduced-motion users.
- Removed the extra top-bar `backdrop-blur-3xl` layer and stripped blur from the Platform Intelligence stat cards to reduce scroll-time compositing cost.
- Focused tests passed. Full `npm run typecheck` still fails on pre-existing missing dashboard imports in `src/components/blocks/dashboard.tsx`.

---

# Landing To Dashboard UX Optimization Ideation

## Plan

- [x] Inspect current Landing, auth, onboarding, and dashboard route behavior
- [x] Identify the true friction points for MIT QR visitors versus exploratory visitors
- [x] Define optimization ideas for fast-path, guided-path, and detail-path UX
- [x] Capture implementation considerations and architecture guardrails

## Review

- The current product already has a technical fast path because Landing CTAs and direct `/dashboard` access both reach the dashboard immediately.
- The main UX issue is not missing routing, but that the non-fast paths still behave like a full setup wizard even though the prototype is a QR-driven demo.
- Signup, login, and onboarding are not yet role-separated. They mix demo access, account framing, trust explanation, consent, and connection simulation in a way that adds avoidable friction.
- The strongest optimization direction is a dual-track model: instant dashboard entry by default for QR/demo visitors, with optional progressive setup and deep-dive explanations available without blocking entry.
- Connection setup and engine setup should feel transparent and credible, but should run as an asynchronous guided reveal from the dashboard rather than a mandatory pre-dashboard gate.

---

# Cross-Engine Non-Hero Content + UX Refinement Plan

## Objective

- Keep the current heroes for `Dashboard`, `Protect`, `Grow`, `Execute`, and `Govern` unchanged.
- Rework only non-hero content and the downstream screens reached from those engine pages.
- Use the current `BottomSheet` interaction quality as the benchmark for mobile-first polish.
- Reduce over-bright hover glow and move the product toward a calmer, more premium trust signal.
- Strengthen realism and cross-screen consistency so the prototype feels like one coherent financial story.

## Scope

- Tier 1 engine surfaces: `Dashboard`, `Protect`, `Grow`, `Execute`, `Govern`, `Settings` non-hero regions.
- Tier 2 downstream surfaces: `/dashboard/notifications`, `/protect/alert-detail`, `/grow/recommendations`, `/grow/recommendation`, `/grow/scenarios`, `/grow/goal`, `/execute/approval`, `/execute/history`, `/govern/audit`, `/govern/audit-detail`.
- Shared content and data sources: `src/domain/poseidon-universe/canonical.ts`, `src/lib/demo-thread.ts`, `src/pages/protect/protect-data.ts`, `src/pages/grow/recommendation-detail-data.ts`.

## Plan

- [ ] Freeze hero boundaries and define no-touch zones for the 5 engine pages.
- [ ] Audit all non-hero regions by page intent: monitor, investigate, approve, audit, configure.
- [ ] Create a shared interaction grammar from `BottomSheet`.
- [ ] Normalize motion, hover, shadow, blur, and border emphasis tokens across engine pages.
- [ ] Build a single "content truth map" tying Protect alerts, Grow recommendations, Execute actions, Govern decisions, and Notifications to the same narrative thread.
- [ ] Replace or reframe low-trust data points that imply capabilities Poseidon does not have.
- [ ] Re-rank content blocks so each page has one dominant action area, one proof area, and one supporting context area.
- [ ] Simplify mobile layouts to a stacked decision flow modeled after `BottomSheet` pacing.
- [ ] Add verification tests for cross-screen data consistency and route-level rendering.
- [ ] Run visual and mobile checks at `375px` before any redesign is considered complete.

## Phase Breakdown

- [ ] Phase 0: UX benchmark extraction
  Capture why `BottomSheet` feels better: single focal task, short visual depth, clear close affordance, restrained backdrop, tactile drag gesture, low copy volume, obvious primary CTA.

- [ ] Phase 1: Content realism cleanup
  Reframe `THR-004` so severity, confidence, and evidence are aligned.
  Reframe `THR-005` from "crypto is suspicious" to "first-time high-risk transfer requiring review".
  Remove direct usage-based subscription claims if they imply app telemetry Poseidon cannot access.
  Replace or downgrade insurance optimization unless the data basis and coverage-comparison framing are explicit.
  Remove trivial Execute queue items that do not deserve approval-screen real estate.

- [ ] Phase 2: Cross-engine narrative cleanup
  Ensure every high-priority Grow recommendation has an optional or queued Execute counterpart only when the action is credible.
  Ensure Protect detail -> Execute approval -> Govern audit trail reads as one continuous story.
  Ensure Dashboard top cards mirror the same IDs, dollar amounts, confidence bands, and timing shown downstream.
  Ensure Notifications reflect actual states already visible in Protect, Grow, Execute, and Govern.

- [ ] Phase 3: Visual system refinement
  Reduce hover glow intensity globally, especially on cards and primary CTAs.
  Shift emphasis from glow to hierarchy: contrast, spacing, card layering, and motion timing.
  Reuse `BottomSheet` principles for mobile surfaces: tighter sections, fewer simultaneous decisions, clearer thumb-zone CTAs.
  Standardize list rows, chips, KPI strips, table density, and empty states.

- [ ] Phase 4: Information architecture refinement
  Dashboard becomes the orchestration layer, not a second hero gallery.
  Protect emphasizes threat triage and evidence review.
  Grow emphasizes prioritized value and feasibility.
  Execute emphasizes approval confidence and reversibility.
  Govern emphasizes proof, traceability, and audit navigation.
  Settings emphasizes trust controls, thresholds, and permissions rather than generic preferences.

- [ ] Phase 5: Verification
  Extend rendering coverage beyond top-level pages.
  Add tests for canonical universe consistency across alerts, recommendations, actions, notifications, and audit entries.
  Add focused assertions for "no forbidden capability copy" on key recommendations and actions.
  Do a manual mobile pass on iOS-like and Android-like widths.

## Current Findings

- `BottomSheet` is currently the strongest interaction reference in the product because it is focused, tactile, low-noise, and mobile-native.
- The engine pages are directionally strong, but many non-hero surfaces feel visually louder and less disciplined than the sheet UI.
- Glow and hover treatments are currently doing too much work; they call attention without always increasing clarity.
- The strongest single-source-of-truth structure already exists in `canonical.ts`, `demo-thread.ts`, `protect-data.ts`, and `recommendation-detail-data.ts`, but downstream pages still contain duplicated framing and uneven realism.
- `mockExecute.ts` contains older content patterns that should not be used as the design benchmark for the current prototype direction.

## Recommended Direction

- [ ] Direction 1: "Calm Command Center"
  Keep the current architecture, reduce visual noise, and make each page feel more mature, quieter, and more premium.

- [ ] Direction 2: "Approval-First Narrative" (recommended)
  Rebuild all non-hero content around one story: Detect -> Explain -> Approve -> Audit. This best matches the MIT capstone story and Poseidon's trust thesis.

- [ ] Direction 3: "Mobile Decision Sheet System"
  Use the `BottomSheet` as the dominant interaction model for mobile and small-tablet surfaces, with stacked cards and focused approval modules instead of desktop-like dashboards squeezed into one column.

## Review

- Best next move: start with content realism and cross-engine SSOT cleanup before visual polish, because polishing inconsistent data makes the prototype look less credible, not more premium.
- Best design principle: hero stays cinematic, everything below hero becomes calmer, denser, and more decision-oriented.
- Best architecture principle: one narrative thread, one data source, one interaction grammar.
