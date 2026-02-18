# Poseidon.AI v0 Screen Prompts — MIT Final Demo Master Spec (2026-02-18)

## 0. Scope
This document is the single prompt spec for the current rebuild scope.

- Functional scope: 16 units
- Implemented route scope: 19 pages + `/onboarding` entry alias + `/404`
- Target routes:
  - `/`, `/pricing`, `/signup`, `/login`
  - `/onboarding`, `/onboarding/connect`, `/onboarding/goals`, `/onboarding/consent`, `/onboarding/complete`
  - `/dashboard`, `/protect`, `/protect/alert-detail`
  - `/grow`, `/grow/goal`, `/grow/scenarios`
  - `/execute`, `/execute/history`
  - `/govern`, `/govern/audit`
  - `/settings`

Out of scope routes remain `ComingSoon`.

---

## 1. Mission and MIT Evaluation Rubric
The generated screens must prove all points below inside the first 120 seconds.

1. Real product quality, not prototype fragments
2. 4-engine integration (Protect, Grow, Execute, Govern)
3. Governance-by-design (traceability and evidence)
4. Calm, credible visual polish suitable for MIT final review

---

## 2. Audience Profiles
1. `mit-faculty`
- Checks integration depth, governance rigor, and maturity
2. `cto-peer`
- Checks technical coherence, explainability quality, and consistency
3. `industry-evaluator`
- Checks clarity, conversion flow, and practical value

---

## 3. Scenario Playbooks
1. `wow-30s`
- `/` -> `/dashboard`
- Goal: immediate confidence that this is production-grade
2. `engine-proof-120s`
- `/dashboard` -> `/protect` -> `/protect/alert-detail` -> `/execute` -> `/govern` -> `/govern/audit`
- Goal: continuous explainability and auditability proof
3. `activation-90s`
- `/pricing` -> `/signup` -> `/onboarding/*` -> `/dashboard`
- Goal: frictionless activation without confusion

---

## 4. Global Prompt Policies (MUST)

### 4.1 Technical constraints
1. Use shared imports:
- `@/components/poseidon`: `GovernFooter`, `AuroraPulse` (+ route-specific facades)
- `@/lib/governance-meta`
- `@/lib/motion-presets`
2. No single-file self-contained implementation pattern
3. No `style={{ ... }}`
4. No hardcoded hex colors
5. No large per-page inline mock arrays when cross-thread keys exist

### 4.2 Accessibility baseline
1. Skip link text: `Skip to main content`
2. `id="main-content"`
3. Main landmark (`<main>` or `role="main"`)
4. Primary interactive elements must have explicit labels

### 4.3 Density and disclosure rules
1. Tier A: initial max 3 blocks (P1-P3 only)
2. Tier B: initial max 4 blocks
3. Tier C: initial max 3 blocks
4. Lists/tables: show max 5 rows initially, then `See more`
5. Default disclosure: `summary-first`

### 4.4 CTA rules
1. Exactly one primary CTA
2. At most one secondary CTA
3. Primary CTA must stay within target-ready route scope

---

## 5. Cross-screen Data Thread
All route prompts must preserve these canonical values.

| Key | Value | Owner Routes |
|---|---|---|
| `system_confidence` | `0.92` | `/`, `/dashboard` |
| `decisions_audited` | `1,247` | `/`, `/govern`, `/govern/audit` |
| `critical_alert_thr001` | `THR-001 · $2,847 · TechElectro Store · 0.94` | `/dashboard`, `/protect`, `/protect/alert-detail`, `/execute` |
| `compliance_score` | `96/100` | `/dashboard`, `/govern`, `/govern/audit` |
| `pending_actions` | `5 pending actions` | `/dashboard`, `/execute` |
| `monthly_savings` | `$847/month` | `/dashboard`, `/execute`, `/execute/history` |
| `emergency_fund_progress` | `73% · $7,300 / $10,000` | `/dashboard`, `/grow`, `/grow/goal`, `/grow/scenarios` |

---

## 6. Route Priority Matrix
1. Tier A (`Compelling core`)
- `/`, `/dashboard`, `/protect`, `/protect/alert-detail`, `/execute`, `/govern`, `/govern/audit`
2. Tier B (`Explorer proof`)
- `/pricing`, `/signup`, `/login`, `/onboarding/connect`, `/onboarding/consent`, `/grow/scenarios`, `/execute/history`
3. Tier C (`Completeness`)
- `/onboarding`, `/onboarding/goals`, `/onboarding/complete`, `/grow`, `/grow/goal`, `/settings`, `/404`

---

## 7. Enhanced Route Cards

### Route `/`
#### Context
- Intent: establish immediate product credibility
- Previous: QR entry
- Next: `/dashboard`
#### Section Map
- [P1] Hero with first-5s statement + primary CTA (`full`)
- [P2] Live metrics strip (`grid`)
- [P3] Four-engine overview (`grid`)
#### Representative Data
- `system_confidence=0.92`
- `decisions_audited=1,247`
#### Signature Visual
- Hero + four compact sparklines in one strip
#### Must-build components
- `PublicTopBar`, `First5sMessageBlock`, `MetricsStrip`, `PrimaryActionBar`
#### Should-build components
- `EngineCards`, `GovernanceProofBar`
#### Decision Point
- Enter command center now or leave
#### CTA budget
- Primary: `Open dashboard`
- Secondary: `Watch demo`
#### Collapse policy
- Tier A: only P1-P3 visible on initial load
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/pricing`
#### Context
- Intent: conversion clarity
- Previous: `/`
- Next: `/signup`
#### Section Map
- [P1] Pricing hero and trust statement (`full`)
- [P2] 3-plan pricing cards (`grid`)
- [P3] Feature comparison table (`full`)
#### Representative Data
- Starter / Pro / Enterprise plans with annual toggle
#### Signature Visual
- Clean plan comparison with clear highlight state
#### Must-build components
- `PublicTopBar`, `PricingCards`, `PrimaryActionBar`
#### Should-build components
- `FaqAccordion`, `ProofLine`
#### Decision Point
- Start account creation now or defer
#### CTA budget
- Primary: `Create account`
- Secondary: `Contact sales`
#### Collapse policy
- Tier B: P1-P4 max, table rows capped at 5 before `See more`
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/signup`
#### Context
- Intent: complete signup with confidence
- Previous: `/pricing` or `/`
- Next: `/onboarding/connect`
#### Section Map
- [P1] Value + trust summary (`full`)
- [P2] Editable form + SSO options (`two-col`)
- [P3] Continue action bar (`full`)
#### Representative Data
- Email/password fields must be editable
#### Signature Visual
- Dual-panel trust + form composition
#### Must-build components
- `PublicTopBar`, `AuthForm`, `PrimaryActionBar`
#### Should-build components
- `TrustBadges`, `SecondaryCtaLink`
#### Decision Point
- Submit account and proceed
#### CTA budget
- Primary: `Continue onboarding`
- Secondary: `Sign in`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/login`
#### Context
- Intent: quick re-entry to command center
- Previous: `/` or `/pricing`
- Next: `/dashboard`
#### Section Map
- [P1] First-5s resume message (`full`)
- [P2] Editable login form (`full`)
- [P3] Sign-in action bar (`full`)
#### Representative Data
- Include remember me and recovery hint
#### Signature Visual
- Focused single-panel login hierarchy
#### Must-build components
- `PublicTopBar`, `AuthForm`, `PrimaryActionBar`
#### Should-build components
- `SsoOptions`, `ForgotPasswordLink`
#### Decision Point
- Authenticate now or recover account
#### CTA budget
- Primary: `Sign in`
- Secondary: `Forgot password`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/onboarding`
#### Context
- Intent: orient user before step flow
- Previous: `/signup`
- Next: `/onboarding/connect`
#### Section Map
- [P1] Flow overview (`full`)
- [P2] Step progress map (`full`)
- [P3] Continue action (`full`)
#### Representative Data
- 4-step flow summary with expected completion time
#### Signature Visual
- Minimal progress-first onboarding intro
#### Must-build components
- `OnboardingFrame`, `ProgressIndicator`, `PrimaryActionBar`
#### Should-build components
- `TrustCopy`
#### Decision Point
- Start guided onboarding now
#### CTA budget
- Primary: `Continue setup`
- Secondary: `Back`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/onboarding/connect`
#### Context
- Intent: connect data safely
- Previous: `/onboarding`
- Next: `/onboarding/goals`
#### Section Map
- [P1] Progress indicator 1/4 (`full`)
- [P2] Connection options (`grid`)
- [P3] Continue/skip action bar (`full`)
#### Representative Data
- Account connectors with clear read-only trust labels
#### Signature Visual
- Connection cards with trust states
#### Must-build components
- `OnboardingFrame`, `ProgressIndicator`, `PrimaryActionBar`
#### Should-build components
- `TrustCopy`, `ConnectionStatusBadges`
#### Decision Point
- Connect at least one source or skip safely
#### CTA budget
- Primary: `Continue to goals`
- Secondary: `Skip for now`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/onboarding/goals`
#### Context
- Intent: define growth priorities
- Previous: `/onboarding/connect`
- Next: `/onboarding/consent`
#### Section Map
- [P1] Progress indicator 2/4 (`full`)
- [P2] Goal selection grid (`grid`)
- [P3] Continue/back action bar (`full`)
#### Representative Data
- Goal cards with selected state and concise descriptions
#### Signature Visual
- Compact selectable goal matrix
#### Must-build components
- `OnboardingFrame`, `ProgressIndicator`, `PrimaryActionBar`
#### Should-build components
- `TrustCopy`
#### Decision Point
- Confirm goal set before consent step
#### CTA budget
- Primary: `Continue to consent`
- Secondary: `Back`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/onboarding/consent`
#### Context
- Intent: set explicit boundaries
- Previous: `/onboarding/goals`
- Next: `/onboarding/complete`
#### Section Map
- [P1] Progress indicator 3/4 (`full`)
- [P2] Consent boundary controls (`full`)
- [P3] Activate/back action bar (`full`)
#### Representative Data
- Explicit toggles for analyze/recommend/approve-before-act
#### Signature Visual
- High-clarity consent boundary panel
#### Must-build components
- `OnboardingFrame`, `ConsentBoundaryPanel`, `PrimaryActionBar`
#### Should-build components
- `TrustCopy`, `PolicyReference`
#### Decision Point
- Approve boundaries before activation
#### CTA budget
- Primary: `Activate Poseidon`
- Secondary: `Back`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/onboarding/complete`
#### Context
- Intent: confirm setup completion
- Previous: `/onboarding/consent`
- Next: `/dashboard`
#### Section Map
- [P1] Completion summary (`full`)
- [P2] Readiness checklist (`grid`)
- [P3] Enter-dashboard action (`full`)
#### Representative Data
- Connected accounts, selected goals, consent states
#### Signature Visual
- Compact completion confirmation with confidence cue
#### Must-build components
- `OnboardingFrame`, `CompletionSummary`, `PrimaryActionBar`
#### Should-build components
- `TrustCopy`
#### Decision Point
- Enter command center now
#### CTA budget
- Primary: `Enter dashboard`
- Secondary: `Back to goals`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/dashboard`
#### Context
- Intent: identify first high-impact action
- Previous: `/` or `/login` or onboarding
- Next: `/protect` (default critical path)
#### Section Map
- [P1] Command summary + primary CTA (`full`)
- [P2] KPI + engine health (`grid`)
- [P3] Feed + decision rail (`two-col`)
#### Representative Data
- `system_confidence=0.92`
- `pending_actions=5`
- `monthly_savings=$847/month`
- `compliance_score=96/100`
#### Signature Visual
- Bento summary + engine health strip
#### Must-build components
- `EnginePageFrame`, `BentoGrid`, `EngineHealthStrip`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ProofLine`, `AuroraPulse`
#### Decision Point
- Choose first critical path to inspect
#### CTA budget
- Primary: `Review plan`
- Secondary: `Open protect`
#### Collapse policy
- Tier A: only P1-P3 initially
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/protect`
#### Context
- Intent: triage active threats
- Previous: `/dashboard`
- Next: `/protect/alert-detail`
#### Section Map
- [P1] Threat posture summary (`full`)
- [P2] Threat table (`two-col`)
- [P3] Risk/evidence rail (`two-col`)
#### Representative Data
- `critical_alert_thr001` consistent with dashboard and detail route
#### Signature Visual
- Critical threat emphasis + risk ring
#### Must-build components
- `EnginePageFrame`, `ThreatTable`, `RiskScoreRing`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ConfidenceIndicator`, `ProofLine`
#### Decision Point
- Open top alert for explainability review
#### CTA budget
- Primary: `Open top alert`
- Secondary: `View all alerts`
#### Collapse policy
- Tier A: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/protect/alert-detail`
#### Context
- Intent: verify model reasoning before escalation
- Previous: `/protect`
- Next: `/execute`
#### Section Map
- [P1] Alert summary (`full`)
- [P2] SHAP waterfall evidence (`full`)
- [P3] Escalate/mark-safe actions (`full`)
#### Representative Data
- `critical_alert_thr001`
- `compliance_score=96/100`
#### Signature Visual
- Mandatory `ShapWaterfall`
#### Must-build components
- `EnginePageFrame`, `ShapWaterfall`, `ConfidenceIndicator`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `EvidenceTimeline`, `SimilarIncidentsPanel`
#### Decision Point
- Escalate to execution path or mark safe
#### CTA budget
- Primary: `Open execute queue`
- Secondary: `Back to protect`
#### Collapse policy
- Tier A: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/grow`
#### Context
- Intent: assess growth status quickly
- Previous: `/dashboard`
- Next: `/grow/scenarios`
#### Section Map
- [P1] Growth summary + CTA (`full`)
- [P2] Goal/forecast KPI strip (`grid`)
- [P3] Top recommendation panel (`two-col`)
#### Representative Data
- `emergency_fund_progress=73% · $7,300 / $10,000`
#### Signature Visual
- Forecast-aware goal summary layout
#### Must-build components
- `EnginePageFrame`, `GoalKpiGrid`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ForecastPreview`, `ProofLine`
#### Decision Point
- Open scenario comparison before commit
#### CTA budget
- Primary: `Review growth plan`
- Secondary: `Open scenarios`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/grow/goal`
#### Context
- Intent: decide whether to adjust contribution pace
- Previous: `/grow`
- Next: `/execute`
#### Section Map
- [P1] Goal progress summary (`full`)
- [P2] Forecast contribution view (`two-col`)
- [P3] Goal adjustment action (`full`)
#### Representative Data
- `emergency_fund_progress=73% · $7,300 / $10,000`
#### Signature Visual
- Focused goal trajectory card
#### Must-build components
- `EnginePageFrame`, `GoalProgressCard`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ForecastBand`, `ProofLine`
#### Decision Point
- Keep or adjust target pace
#### CTA budget
- Primary: `Adjust goal`
- Secondary: `Back to grow`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/grow/scenarios`
#### Context
- Intent: compare alternatives before execution
- Previous: `/grow`
- Next: `/execute`
#### Section Map
- [P1] Scenario selection controls (`full`)
- [P2] Comparative forecast with confidence bands (`two-col`)
- [P3] Send-to-execute actions (`full`)
#### Representative Data
- `emergency_fund_progress=73% · $7,300 / $10,000`
#### Signature Visual
- Mandatory `ForecastBand` comparison
#### Must-build components
- `EnginePageFrame`, `ForecastBand`, `ScenarioComparison`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `SensitivityNotes`, `ProofLine`
#### Decision Point
- Select one scenario to execute
#### CTA budget
- Primary: `Send to execute`
- Secondary: `Back to grow`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/execute`
#### Context
- Intent: approve high-impact actions safely
- Previous: `/dashboard` or `/protect/alert-detail`
- Next: `/execute/history`
#### Section Map
- [P1] Queue summary + trust note (`full`)
- [P2] Action cards with explicit controls (`two-col`)
- [P3] Savings/rollback proof rail (`two-col`)
#### Representative Data
- `critical_alert_thr001`
- `pending_actions=5`
- `monthly_savings=$847/month`
#### Signature Visual
- Action cards with explicit approve/decline states
#### Must-build components
- `EnginePageFrame`, `ActionQueueCards`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ConfidenceIndicator`, `ProofLine`
#### Decision Point
- Approve now or defer with evidence
#### CTA budget
- Primary: `Review execution history`
- Secondary: `View history`
#### Collapse policy
- Tier A: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/execute/history`
#### Context
- Intent: verify action outcomes and traceability
- Previous: `/execute`
- Next: `/govern/audit`
#### Section Map
- [P1] Outcome summary metrics (`grid`)
- [P2] History table (`full`)
- [P3] Open-govern-trace action (`full`)
#### Representative Data
- `monthly_savings=$847/month` continuity
#### Signature Visual
- Compact execution-to-govern trace ribbon
#### Must-build components
- `EnginePageFrame`, `ExecutionHistoryTable`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `FilterBar`, `ProofLine`
#### Decision Point
- Move from execution log to immutable audit
#### CTA budget
- Primary: `Open govern trace`
- Secondary: `Back to execute`
#### Collapse policy
- Tier B: 4 block cap, table starts with 5 rows
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern`
#### Context
- Intent: assess governance posture at a glance
- Previous: `/execute` or `/dashboard`
- Next: `/govern/audit`
#### Section Map
- [P1] Governance summary + CTA (`full`)
- [P2] Ledger preview (`two-col`)
- [P3] Compliance + review signals (`two-col`)
#### Representative Data
- `compliance_score=96/100`
- `decisions_audited=1,247`
#### Signature Visual
- Compliance ring + engine-colored ledger preview
#### Must-build components
- `EnginePageFrame`, `ComplianceScoreRing`, `LedgerPreview`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `AuditChip`, `ProofLine`
#### Decision Point
- Open immutable ledger for final validation
#### CTA budget
- Primary: `Open audit ledger`
- Secondary: `Back to dashboard`
#### Collapse policy
- Tier A: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern/audit`
#### Context
- Intent: validate immutable trace integrity
- Previous: `/govern`
- Next: `/govern`
#### Section Map
- [P1] Ledger summary + filter controls (`full`)
- [P2] Immutable log table (`full`)
- [P3] Integrity proof line (`full`)
#### Representative Data
- `decisions_audited=1,247`
- `compliance_score=96/100`
#### Signature Visual
- Immutable ledger with integrity proof line
#### Must-build components
- `EnginePageFrame`, `AuditLedgerTable`, `IntegrityProofLine`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `AuditChip`, `FilterControls`
#### Decision Point
- Confirm governance reliability and return to overview
#### CTA budget
- Primary: `Back to govern overview`
- Secondary: `Back to govern`
#### Collapse policy
- Tier A: 3 block cap, table starts with 5 rows
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/settings`
#### Context
- Intent: tune controls without losing context
- Previous: `/dashboard`
- Next: `/settings`
#### Section Map
- [P1] Settings first-5s summary (`full`)
- [P2] AI/privacy/integration controls (`two-col`)
- [P3] Review action bar (`full`)
#### Representative Data
- Stable control defaults with explicit guardrails
#### Signature Visual
- Calm control panels with status clarity
#### Must-build components
- `EnginePageFrame`, `SettingsControlCards`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ConsentBoundaryHints`, `ProofLine`
#### Decision Point
- Keep defaults or adjust operating boundaries
#### CTA budget
- Primary: `Review settings controls`
- Secondary: `Open AI settings`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/404`
#### Context
- Intent: recover safely from unknown route
- Previous: any invalid path
- Next: `/dashboard`
#### Section Map
- [P1] Not-found message (`full`)
- [P2] Return-to-dashboard action (`full`)
- [P3] Support hint (`full`)
#### Representative Data
- No cross-thread values
#### Signature Visual
- Clean recovery card with clear next step
#### Must-build components
- `SystemFallback`, `PrimaryActionBar`
#### Should-build components
- `SupportHint`
#### Decision Point
- Return to known route immediately
#### CTA budget
- Primary: `Back to dashboard`
- Secondary: none
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

---

## 8. Anti-overload Rules
1. Never render more than one headline-level message in first viewport.
2. Never show more than one primary action cluster in first viewport.
3. Tables and feeds must start compact (<= 5 rows) and expand progressively.
4. If a section does not contribute to current decision point, collapse by default.

---

## 9. Integration Handoff Rules
1. v0 output is draft-only; integrate into existing contracts before merge.
2. `GOVERNANCE_META[route]` is the only source for `GovernFooter` props.
3. `rebuild-contracts.ts` is the only source for first5s, CTA path, and tier policy.
4. Cross-thread values must not drift across routes.

---

## 10. Validation Checklist
1. All target route cards exist and follow the 10-section template.
2. Tier density caps are respected.
3. Cross-thread keys stay consistent across owner routes.
4. Primary CTA stays inside target-ready routes.
5. `Skip link + main landmark` baseline is present in all target pages.
6. `ShapWaterfall` appears on `/protect/alert-detail`.
7. `ForecastBand` appears on `/grow/scenarios`.
