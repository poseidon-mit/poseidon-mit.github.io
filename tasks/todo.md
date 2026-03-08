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

# Claude Neon -> Precision Plan Review

## Plan

- [x] Inspect the proposed Claude implementation plan against current shared layout, CSS, and facade architecture
- [x] Inspect the updated `Comprehensive_UIUX_Redesign_Plan.md` for improvements and remaining gaps
- [x] Identify blocker-level assumptions, especially around `AuroraPulse`, `glass-card`, `Surface`, motion presets, and verification scope
- [x] Save a long-form review document in `docs/reviews/`

## Review

- The proposed Claude plan is useful as a shared visual weight-reduction pass, but not sufficient as a full redesign plan.
- The largest incorrect assumption is `zero page files touched`; several engine heroes and trust surfaces are controlled by route-specific facades and hero primitives, not just `glass-card`.
- `AuroraPulse` should not be nulled globally; it needs a route-aware precision mode because it is used by layout, hero primitives, and orchestrator surfaces.
- `Surface` cannot be ignored in the migration. Leaving it unchanged while rewriting `glass-card` will create a split visual system.
- The updated comprehensive redesign document is safer than the original plan, but still needs a more explicit component ownership map and risk-tiered Execute friction rules.
- Saved full review: `docs/reviews/claude-neon-precision-plan-review-2026-03-08.md`

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

# Glass-Box From-Scratch WebUI Redesign Plan

## Objective

- Supersede the previous incremental refinement plan and redesign the existing Poseidon WebUI from scratch.
- Rebuild the product as a coherent "Financial AI Operating System", not a dashboard with cards.
- Preserve Poseidon's core architecture thesis: deterministic models compute, GenAI explains, humans approve, Govern proves.
- Optimize for first-sight investor impact, MIT-capstone narrative clarity, and real cross-screen trust.
- Treat development cost as a secondary concern; prioritize systemic clarity, wow factor, and architectural cleanliness.

## Non-Negotiables

- Use a single canonical consumer-finance persona and one living financial narrative across `Dashboard`, `Protect`, `Grow`, `Execute`, `Govern`, and `Settings`.
- Keep all displayed data realistic for Poseidon's actual read-only capabilities.
- Make mobile support and older-device performance first-class constraints, not polish work.
- Keep dark theme only, engine color identity, `GovernFooter`, and clean architecture boundaries.
- Do not create wow through noise. Use precision, coherence, prioritization, and interaction quality.

## Design Philosophy Shift

- Replace "many cards + much copy" with "one dominant decision + visible proof + clear next step".
- Replace static flat lists with "Priority Spotlight" triage architecture.
- Replace ambiguous percentile language with outcome-first, cohort-backed guidance.
- Replace screen-local mock data with a canonical persona engine that updates all engines together.
- Replace route-like panel changes with instant, OS-level workspace transitions.

## Scope

- Full redesign of Tier 1 engine surfaces: `Dashboard`, `Protect`, `Grow`, `Execute`, `Govern`, `Settings`.
- Full redesign of Tier 2 decision/detail surfaces: `/dashboard/notifications`, `/protect/alert-detail`, `/protect/threats`, `/grow/recommendations`, `/grow/recommendation`, `/grow/scenarios`, `/grow/goal`, `/execute/queue`, `/execute/approval`, `/execute/history`, `/govern/audit`, `/govern/audit-detail`.
- App-shell and navigation behavior: engine transitions, drawer/panel strategy, settings tab strategy, route prefetch, motion, perceived performance.
- Shared truth and orchestration layers: `src/lib/demo-thread.ts`, `src/domain/poseidon-universe/canonical.ts`, route meta, engine hero facades, queue/audit/recommendation derivation logic.

## Master Plan

- [ ] Replace the old partial-refinement strategy with a full architecture-first redesign brief shared across product, UX, and engineering.
- [ ] Define the canonical demo persona engine in `demo-thread.ts` and eliminate screen-specific story drift.
- [ ] Re-architect navigation and routing so the app shell persists and engine/workspace transitions feel instant.
- [ ] Redesign the dashboard into "Command Pulse" with fixed priority surfaces instead of hidden horizontal discovery.
- [ ] Redesign every engine page with a `Priority Spotlight` hero and a stricter decision hierarchy.
- [ ] Rebuild Execute around agentic intent previews and approval-first orchestration.
- [ ] Rebuild Govern as an interactive autopsy/timeline proving cross-engine traceability.
- [ ] Unify visual language around Apple-like precision, low-noise surfaces, and disciplined motion.
- [ ] Enforce performance budgets, mobile ergonomics, and cross-browser quality during implementation rather than after.
- [ ] Extend test coverage for narrative coherence, forbidden capability copy, route stability, and key mobile layouts.

## Phase Breakdown

- [ ] Phase 0: Architecture reset and product truth map
  Replace the assumption that existing heroes/layouts are preserved.
  Define a single consumer persona, financial baseline, and event timeline.
  Map how one Protect event mutates Grow value, Execute queue state, and Govern ledger output.
  Decide the golden-path demo narrative: Landing -> Dashboard -> Protect -> Execute -> Govern.

- [ ] Phase 1: Canonical Persona Engine
  Refactor `src/lib/demo-thread.ts` into the authoritative state/story layer.
  Derive alerts, recommendations, approvals, notifications, and audit entries from one shared source of truth.
  Remove or rewrite all enterprise-banking or impossible-data copy that breaks the personal-finance demo persona.
  Create explicit derivation rules for priority, confidence, reversibility, urgency, and projected value.

- [ ] Phase 2: Zero-Latency App Shell and routing overhaul
  Keep the app shell mounted across engine transitions.
  Move settings and similar workspaces to instant panel transitions with `Suspense`, prefetch on `mouseenter`, and no visible reload behavior.
  Normalize route-level vs workspace-level transition rules so the UI does not over-transition.
  Target a calm `~150ms` cross-fade/slide grammar using shared motion presets only.

- [ ] Phase 3: GPU budget and rendering discipline
  Limit heavy `backdrop-filter` usage to a maximum of 5 elements per page.
  Use simulated-glass surfaces for dense cards, tables, and long lists.
  Define explicit budgets for blur, shadows, animated gradients, and concurrently active motion layers.
  Verify smooth scrolling and interaction on mid-tier iOS/Android and older desktop GPUs.

- [ ] Phase 4: Dashboard redesign -> "Command Pulse"
  Remove the horizontal hero carousel/discovery model entirely.
  Build the primary hero around a large "Financial Health Pulse" ring showing optimization score and immediate yearly value.
  Add a permanently anchored row of engine badges for `Protect`, `Grow`, and `Execute` with compact live counts/value.
  Use progressive disclosure drawers/side panels for dense explanation so the dashboard remains calm.
  Ensure the first 3 seconds communicate one message: top risk, top upside, next approval.

- [ ] Phase 5: Protect redesign -> "Security Radar"
  Give only the single most critical threat hero priority.
  Replace cluttered hero messaging with: threat severity bar, human-readable incident summary, evidence chain, confidence meter, primary CTA, secondary audit CTA.
  Rename technical/jargony microcopy into plain-English action language.
  Rebuild `/protect/threats` around a ranked spotlight model rather than a flat list of equal-looking rows.

- [ ] Phase 6: Grow redesign -> "Trajectory Canvas"
  Rebuild the hero as an edge-to-edge trajectory comparison chart where the value gap is visually dominant.
  Replace percentile-heavy language with cohort-backed, aspirational, outcome-first framing.
  Make the top recommendation and the "why now" logic immediately legible.
  Re-rank the recommendations page by projected impact, feasibility, and time-to-value instead of generic list order.

- [ ] Phase 7: Execute redesign -> "Agentic Copilot Queue"
  Split the queue into `Immediate Attention Required` and `Background Optimizations`.
  Remove trivial actions from the approval-first queue.
  Build an `Intent Preview` modal/surface for each action showing exactly what Poseidon will prepare, what the human approves, and what remains reversible.
  Use a high-trust approval mechanic such as slide-to-approve or biometric-style confirmation language for the demo.

- [ ] Phase 8: Govern redesign -> "Autopsy Engine"
  Turn governance from a static ledger into an interactive timeline and trace view.
  Make every audit detail page visually reconstruct the full thread: identified in Protect -> valued in Grow -> approved in Execute -> logged in Govern.
  Separate deterministic evidence from GenAI explanation clearly in the UI.
  Make Govern the place where Poseidon proves its architecture claim, not just states it.

- [ ] Phase 9: Settings redesign -> "Instant Control Workspace"
  Treat `General`, `AI`, `Integrations`, and `Rights` as one persistent control workspace.
  Remove visible reload sensation when switching tabs.
  Reframe settings around trust controls, permissions, thresholds, visibility, and explainability instead of generic preference buckets.
  Make Settings feel like high-end system controls, not a leftover admin page.

- [ ] Phase 10: Visual system rewrite
  Move the entire product toward Apple-like precision and away from effect-heavy fintech tropes.
  Reduce glow, over-bright hover states, and decorative contrast spikes.
  Increase reliance on hierarchy, proportion, typography, spacing, and evidence framing.
  Keep engine colors semantically strong, but make the overall product calmer and more exact.

- [ ] Phase 11: Content realism and microcopy rewrite
  Rewrite all impossible or weak claims: app-usage inference, unsupported insurance intelligence, unclear fee-avoidance logic, trivial interest actions in premium queues.
  Standardize plain-English headlines, evidence cues, cohort proof, confidence explanations, and CTA language.
  Make every page understandable to a beginner without flattening its sophistication.

- [ ] Phase 12: Verification and proof
  Add tests for canonical persona coherence across alerts, recommendations, actions, notifications, and audit logs.
  Add assertions for prohibited capability language and unsupported data assumptions.
  Add focused route/render tests for shell persistence and settings workspace transitions.
  Run manual and automated checks for `375px`, Safari, Chrome, Edge, iOS, and Android-like conditions.

## Current Findings Driving This Reset

- The old plan assumed current heroes could remain. That is no longer valid.
- The current dashboard still hides important value behind horizontal discovery, which weakens the product thesis.
- The current prototype has narrative drift between consumer-finance positioning and institutional-finance mock content.
- Some recommendation and approval copy still implies capabilities Poseidon does not actually have.
- The strongest wow opportunity is not more effect layering; it is a visibly coherent cross-engine operating model.

## Recommended Direction

- [ ] Direction A: "Glass-Box OS" (definitive)
  Rebuild the product as a transparent financial operating system: prioritized, explainable, approval-first, and traceable end-to-end.

- [ ] Direction B: "Command Pulse + Triage Standard"
  Use a fixed dashboard command center plus priority spotlight engine pages to eliminate cognitive overload.

- [ ] Direction C: "Agentic Trust Layer"
  Make intent previews, reversible approvals, and autopsy-style governance the signature experience that investors remember.

## Review

- This redesign plan intentionally replaces the previous "non-hero refinement" program.
- The first implementation milestone should prove the new architecture with one canonical persona and one flawless golden path, not a shallow multi-screen facelift.
- The most important principle is now: one persona, one story, one shell, one priority model, one auditable system.

---

# Synthesis Review + Claude Execution Handoff

## Review of the 3 Proposals

### 1. Gemini Plan

**What to keep**

- Zero-base mindset at the UX layer: stop preserving weak patterns just because they already exist.
- Canonical persona/data engine as the first real dependency, not a later content cleanup.
- Strong interaction concepts: `Financial Health Pulse`, `Trajectory Canvas`, `Intent Preview`.
- GPU-budget language and explicit mobile/performance discipline.

**What to reject**

- Do NOT wipe the repo or initialize a new Vite project.
- Do NOT throw away the current router, app shell, CSS entry, or route contracts.
- Do NOT treat build success as sufficient verification.

**Why rejected in part**

- Repo constraints explicitly require preserving the existing Vite/Tailwind/router foundation and route registry.
- A new app bootstrap would create unnecessary migration risk and break current infrastructure guards.

### 2. ChatGPT Plan

**What to keep**

- Best high-level product architecture: one persona, one shell, one priority model, one auditable system.
- Correct framing of the redesign as a true from-scratch UX reset rather than a polish pass.
- Strong sequencing: narrative/data truth first, then routing/shell, then dashboard and engine pages.
- Correct emphasis on Govern as proof rather than compliance wallpaper.

**What to improve**

- Add explicit file/module ownership and phase deliverables.
- Add a stronger kill-list so Claude knows what to remove rather than only what to build.
- Add verification gates beyond general statements.

### 3. Claude Plan

**What to keep**

- Strongest implementation mechanics: file-level scope, phase order, reusable component strategy, route-aware changes, and concrete cleanup targets.
- Good instincts on settings tab unification, dead-code removal, spotlight patterns, and mobile checks.
- Useful caution about infra-integrity tests and route compatibility.

**What to reject or correct**

- Reject the B2B institutional-banking premise. The redesign must align to the consumer-finance Poseidon narrative, not the legacy institutional mock layer.
- Do not preserve current architecture patterns merely because they exist if they block the new operating-system experience.
- `HeroBento` and current facades may be reused selectively, but they are not sacred.

## Final Synthesis Decision

- **Adopt ChatGPT's architecture direction**
  One persona, one shell, one priority model, one traceable system.

- **Adopt Claude's implementation discipline**
  File-by-file planning, phased rollout, reusable spotlight primitives, explicit route/test handling.

- **Adopt Gemini's cinematic concepts only at the interaction layer**
  `Financial Health Pulse`, `Trajectory Canvas`, `Intent Preview`, and stronger visual dominance where it improves comprehension.

- **Reject Gemini's repo-reset proposal**
  This is a UI/system rebuild in-place, not a greenfield repo rewrite.

- **Reject Claude's domain assumption**
  The rebuilt product is consumer/personal finance, and any institutional data/copy still in the repo must be rewritten or retired.

## Hard Decisions Claude Should Not Re-open

- The app stays in the current repo and current Vite/Tailwind/router stack.
- `src/main.tsx`, `src/styles/tailwind.css`, and `src/router/lazyRoutes.ts` stay intact in role, even if internals are refined.
- The canonical persona/data thread is the first real build step.
- Settings becomes one persistent workspace with instant panel switching.
- Dashboard loses the horizontal/swipe-discovery model completely.
- All engine list pages use a spotlight-first ranking model.
- Execute approvals use an intent-preview pattern for high-trust confirmation.
- Govern becomes the visual proof engine tying the full cross-engine chain together.

## Kill List

- [ ] Kill horizontal hero discovery on Dashboard.
- [ ] Kill unsupported capability copy: app-usage inference, invisible write access, unsupported insurance intelligence, vague percentile bragging.
- [ ] Kill route-flash behavior for Settings and similar workspace-local switches.
- [ ] Kill dead/commented-out UI blocks that keep obsolete interaction models around.
- [ ] Kill over-bright hover glow, excessive blur, and dense multi-card hero rhetoric.
- [ ] Kill screen-specific narrative drift and duplicate mock-data logic.

## Claude Execution Plan

### Phase A: Guardrails and truth-model reset

- [ ] Confirm the redesign will be done in-place, not by bootstrapping a new project.
- [ ] Audit and list all current personal-finance vs institutional-finance contradictions.
- [ ] Refactor the canonical persona in `src/lib/demo-thread.ts` and ensure downstream selectors derive from it.
- [ ] Define the golden path with explicit IDs and values:
  `Dashboard spotlight -> Protect threat -> Execute approval -> Govern audit detail`

**Acceptance criteria**

- One written persona and one consistent data story exist.
- No high-priority screen depends on isolated hardcoded story fragments.

### Phase B: Shell and routing behavior

- [ ] Keep the app shell mounted for engine/page transitions.
- [ ] Add inner Suspense/skeleton handling at the content region only.
- [ ] Convert Settings to a persistent workspace with URL-synced local tab state.
- [ ] Add route prefetch where interaction intent is predictable.

**Acceptance criteria**

- Sidebar/header do not flash on page changes.
- Settings feels like one workspace, not four pages.

### Phase C: New dashboard -> Command Pulse

- [ ] Rebuild the hero around a dominant `Financial Health Pulse`.
- [ ] Add fixed engine badges/snapshots for Protect, Grow, Execute.
- [ ] Move dense explanation into drawers or tightly scoped side panels.
- [ ] Keep the first-3-seconds message brutally simple:
  top risk, top upside, next approval.

**Acceptance criteria**

- No horizontal swipe/scroll is required to discover core value.
- Desktop mouse-only and mobile users see the same top-level story.

### Phase D: Protect -> Security Radar

- [ ] Promote only the single most critical threat into the hero.
- [ ] Show evidence chain and confidence in plain English.
- [ ] Equalize CTA sizing and simplify microcopy.
- [ ] Rebuild `/protect/threats` into spotlight + ranked remainder.

**Acceptance criteria**

- A user can tell what to investigate first within 2-3 seconds.
- Protect no longer reads like a dense model-dump.

### Phase E: Grow -> Trajectory Canvas

- [ ] Give the chart dominant real estate above the fold.
- [ ] Replace visible percentile-led copy with outcome-first cohort language.
- [ ] Spotlight the single best next action and why it matters now.
- [ ] Re-rank recommendations by impact, feasibility, and time-to-value.

**Acceptance criteria**

- A beginner can explain Grow's value in one sentence after a 5-second glance.
- The chart looks like the product, not like supporting decoration.

### Phase F: Execute -> Agentic Copilot Queue

- [ ] Split the queue into immediate approvals vs background optimizations.
- [ ] Remove trivial items from the main approval lane.
- [ ] Build/upgrade the `Intent Preview` approval surface.
- [ ] Ensure approval language emphasizes human control and reversibility.

**Acceptance criteria**

- The queue feels curated, not busy.
- Every approval-worthy item visibly earns its place.

### Phase G: Govern -> Autopsy Engine

- [ ] Redesign Govern as a visible cross-engine timeline and trace surface.
- [ ] Make audit detail pages reconstruct the full chain from signal to human approval.
- [ ] Separate deterministic facts from GenAI explanation in the layout.

**Acceptance criteria**

- Govern becomes one of the most impressive surfaces in the product, not a necessary appendix.

### Phase H: Visual system and performance pass

- [ ] Reduce glow and blur intensity globally.
- [ ] Use simulated glass for list density; reserve true blur for a few premium surfaces only.
- [ ] Normalize touch target, spacing, type scale, and badge grammar.
- [ ] Run mobile and older-device checks before calling any page "done".

**Acceptance criteria**

- `375px` is a first-class layout, not a squeezed desktop.
- Scrolling and panel transitions remain smooth on mid-tier hardware.

### Phase I: Verification and cleanup

- [ ] Extend route/render tests where shell behavior and spotlight logic matter.
- [ ] Add content assertions for unsupported capability language.
- [ ] Verify the golden path thread across Dashboard, Protect, Execute, and Govern.
- [ ] Remove obsolete components/patterns after the new path is stable.

**Acceptance criteria**

- Build passes.
- Infra-integrity tests pass.
- Golden path data is consistent end-to-end.

## File Strategy for Claude

### High-priority infrastructure files

- `src/lib/demo-thread.ts`
- `src/domain/poseidon-universe/canonical.ts`
- `src/router/lazyRoutes.ts`
- `src/main.tsx`
- `src/components/layout/AuthenticatedLayout.tsx`
- `src/components/settings/SettingsLayout.tsx`

### Primary redesign surfaces

- `src/components/poseidon/dashboard-hero.tsx`
- `src/components/poseidon/protect-hero.tsx`
- `src/components/poseidon/grow-hero.tsx`
- `src/components/poseidon/execute-hero.tsx`
- `src/components/poseidon/govern-hero.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/protect/Protect.tsx`
- `src/pages/protect/ProtectThreats.tsx`
- `src/pages/Grow.tsx`
- `src/pages/GrowRecommendations.tsx`
- `src/pages/Execute.tsx`
- `src/pages/ExecuteQueue.tsx`
- `src/pages/Govern.tsx`
- `src/pages/GovernAuditLedger.tsx`
- `src/pages/Settings.tsx`

### Reusable components likely needed

- `src/components/poseidon/priority-spotlight.tsx`
- `src/components/poseidon/page-skeleton.tsx`
- Drawer/panel helpers only if they simplify the new dashboard explanation model

## Verification Gates Claude Must Run

- [ ] `npm run build`
- [ ] `npm run test -- --run src/__tests__/infra-integrity.test.ts`
- [ ] Focused render or route tests for Settings and the golden path if added/changed
- [ ] Manual checks at `375px`, `768px`, and desktop
- [ ] Manual check of Dashboard -> Protect -> Execute -> Govern cross-engine continuity

## Definition of Done

- The rebuilt prototype feels like one coherent financial AI operating system.
- The first 30 seconds are more impressive than the current prototype.
- The cross-engine story is obvious without explanation.
- The user never has to infer priority from a flat list.
- The UI says only what Poseidon can realistically know and do.
