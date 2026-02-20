# Poseidon.AI v0 Screen Prompts — MIT Final Demo Master Spec (2026-02-18)

## 0. Scope
This document is the single prompt spec for the current rebuild scope.

- Functional scope: 16 units
- Implemented route scope: 21 route operation (19 pages + `/onboarding` entry alias + `/404`)
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

### Route `/deck`
#### Context
- Intent: present concise investor/demo narrative
- Previous: `/` or `/pricing`
- Next: `/signup`
#### Section Map
- [P1] Deck viewer header (`full`)
- [P2] Slide/content stage (`full`)
- [P3] Convert action (`full`)
#### Representative Data
- MIT demo deck sections and navigation state
#### Signature Visual
- Focused content viewport with simple controls
#### Must-build components
- `PublicTopBar`, `DeckViewerFrame`, `PrimaryActionBar`
#### Should-build components
- `ProgressDots`
#### Decision Point
- Continue exploring or start activation
#### CTA budget
- Primary: `Create account`
- Secondary: `Back to landing`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/trust`
#### Context
- Intent: validate security and governance confidence
- Previous: `/` or `/pricing`
- Next: `/signup`
#### Section Map
- [P1] Trust summary (`full`)
- [P2] Controls/certifications (`grid`)
- [P3] Conversion action (`full`)
#### Representative Data
- Security controls, compliance statements, audit guarantees
#### Signature Visual
- Calm trust panels with high readability
#### Must-build components
- `PublicTopBar`, `TrustPanels`, `PrimaryActionBar`
#### Should-build components
- `ProofLine`
#### Decision Point
- Proceed to account creation
#### CTA budget
- Primary: `Create account`
- Secondary: `View pricing`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system`
#### Context
- Intent: provide system overview and navigation
- Previous: internal QA routes
- Next: `/design-system/components`
#### Section Map
- [P1] System intro (`full`)
- [P2] Token/component index (`grid`)
- [P3] Quick links (`full`)
#### Representative Data
- Current token groups and primitive coverage
#### Signature Visual
- Documentation-first overview board
#### Must-build components
- `DesignSystemNav`, `TokenIndex`, `ComponentIndex`
#### Should-build components
- `UsageNotes`
#### Decision Point
- Choose next DS area to inspect
#### CTA budget
- Primary: `Open components`
- Secondary: `Open tokens`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system/tokens`
#### Context
- Intent: inspect token architecture quickly
- Previous: `/design-system`
- Next: token detail routes
#### Section Map
- [P1] Token taxonomy summary (`full`)
- [P2] Token families (`grid`)
- [P3] Reference links (`full`)
#### Representative Data
- Color/type/spacing/motion token summaries
#### Signature Visual
- Compact token catalog
#### Must-build components
- `TokenFamilyGrid`, `DesignSystemNav`
#### Should-build components
- `TokenUsageExamples`
#### Decision Point
- Open specific token family
#### CTA budget
- Primary: `Open colors`
- Secondary: `Open motion`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system/tokens/colors`
#### Context
- Intent: validate semantic color system
- Previous: `/design-system/tokens`
- Next: `/design-system/tokens/typography`
#### Section Map
- [P1] Color role overview (`full`)
- [P2] Palette and semantics (`grid`)
- [P3] Usage samples (`full`)
#### Representative Data
- Engine colors, state colors, neutral ramps
#### Signature Visual
- Semantic swatch matrix
#### Must-build components
- `ColorTokenTable`, `SwatchGrid`
#### Should-build components
- `ContrastNotes`
#### Decision Point
- Confirm semantic color coverage
#### CTA budget
- Primary: `Open typography`
- Secondary: `Back to tokens`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system/tokens/typography`
#### Context
- Intent: validate type scale and hierarchy
- Previous: `/design-system/tokens`
- Next: `/design-system/tokens/spacing`
#### Section Map
- [P1] Scale summary (`full`)
- [P2] Roles and examples (`grid`)
- [P3] Guidance links (`full`)
#### Representative Data
- Heading/body/caption tokens and usage
#### Signature Visual
- Readable type ladder presentation
#### Must-build components
- `TypographyScale`, `TypeRoleExamples`
#### Should-build components
- `AccessibilityNotes`
#### Decision Point
- Confirm typography consistency
#### CTA budget
- Primary: `Open spacing`
- Secondary: `Back to tokens`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system/tokens/spacing`
#### Context
- Intent: validate spacing rhythm contracts
- Previous: `/design-system/tokens`
- Next: `/design-system/tokens/motion`
#### Section Map
- [P1] Spacing scale summary (`full`)
- [P2] Layout rhythm examples (`grid`)
- [P3] Rules (`full`)
#### Representative Data
- Spacing increments and component density rules
#### Signature Visual
- Rhythm grid and spacing ladders
#### Must-build components
- `SpacingScale`, `LayoutRhythmGrid`
#### Should-build components
- `DoDontExamples`
#### Decision Point
- Confirm layout density consistency
#### CTA budget
- Primary: `Open motion`
- Secondary: `Back to tokens`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system/tokens/motion`
#### Context
- Intent: verify motion presets and policy
- Previous: `/design-system/tokens`
- Next: `/design-system/components`
#### Section Map
- [P1] Motion contract summary (`full`)
- [P2] Preset examples (`grid`)
- [P3] Policy links (`full`)
#### Representative Data
- Entry/exit/spring presets used by route pages
#### Signature Visual
- Side-by-side motion preset playground
#### Must-build components
- `MotionPresetTable`, `MotionExamples`
#### Should-build components
- `ReducedMotionNotes`
#### Decision Point
- Validate app-wide motion coherence
#### CTA budget
- Primary: `Open components`
- Secondary: `Back to tokens`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/design-system/components`
#### Context
- Intent: inspect primitives and composition patterns
- Previous: `/design-system`
- Next: n/a
#### Section Map
- [P1] Primitive catalog (`full`)
- [P2] Composition examples (`grid`)
- [P3] Constraints and links (`full`)
#### Representative Data
- `Surface`, `Button`, `ButtonLink` canonical usage
#### Signature Visual
- Interactive component showcase
#### Must-build components
- `ComponentCatalog`, `CompositionSamples`
#### Should-build components
- `AntiPatternList`
#### Decision Point
- Confirm component API coverage
#### CTA budget
- Primary: `Back to design system`
- Secondary: none
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/recovery`
#### Context
- Intent: recover account access with low friction
- Previous: `/login`
- Next: `/login`
#### Section Map
- [P1] Recovery explanation (`full`)
- [P2] Recovery form (`full`)
- [P3] Return action (`full`)
#### Representative Data
- Email-based recovery flow
#### Signature Visual
- Minimal recovery panel
#### Must-build components
- `PublicTopBar`, `RecoveryForm`, `PrimaryActionBar`
#### Should-build components
- `SupportHint`
#### Decision Point
- Send recovery link now
#### CTA budget
- Primary: `Send recovery link`
- Secondary: `Back to login`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/dashboard/alerts`
#### Context
- Intent: triage active alerts quickly
- Previous: `/dashboard`
- Next: `/protect/alert-detail`
#### Section Map
- [P1] Alert KPIs (`grid`)
- [P2] Active alert list (`full`)
- [P3] Resolution timeline (`full`)
#### Representative Data
- Alert counts and MTTR with engine breakdown
#### Signature Visual
- Alerts-focused dashboard rail
#### Must-build components
- `EnginePageFrame`, `AlertsKpiGrid`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ResolutionTimeline`
#### Decision Point
- Open highest-risk alert
#### CTA budget
- Primary: `Open protect alerts`
- Secondary: `Back to dashboard`
#### Collapse policy
- Tier A: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/dashboard/insights`
#### Context
- Intent: review actionable insights
- Previous: `/dashboard`
- Next: `/execute`
#### Section Map
- [P1] Insight confidence summary (`full`)
- [P2] Insight feed (`full`)
- [P3] Action rail (`full`)
#### Representative Data
- `system_confidence=0.92`, actionable insights count
#### Signature Visual
- Confidence-first insight cards
#### Must-build components
- `EnginePageFrame`, `InsightsFeed`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ConfidenceIndicator`
#### Decision Point
- Send top recommendation to execute
#### CTA budget
- Primary: `Review execution queue`
- Secondary: `Back to dashboard`
#### Collapse policy
- Tier A: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/dashboard/timeline`
#### Context
- Intent: inspect recent activity chronology
- Previous: `/dashboard`
- Next: `/dashboard`
#### Section Map
- [P1] Timeline summary (`full`)
- [P2] Activity stream (`full`)
- [P3] Next action (`full`)
#### Representative Data
- Recent cross-engine actions and timestamps
#### Signature Visual
- Chronological event rail
#### Must-build components
- `EnginePageFrame`, `ActivityTimeline`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `FilterBar`
#### Decision Point
- Return to command center or inspect event
#### CTA budget
- Primary: `Back to dashboard`
- Secondary: `Open notifications`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/dashboard/notifications`
#### Context
- Intent: clear or route pending notifications
- Previous: `/dashboard`
- Next: relevant engine route
#### Section Map
- [P1] Notification summary (`full`)
- [P2] Notification list (`full`)
- [P3] Batch actions (`full`)
#### Representative Data
- Unread counts and severity tags
#### Signature Visual
- Priority-aware notification list
#### Must-build components
- `EnginePageFrame`, `NotificationsList`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `FilterChips`
#### Decision Point
- Resolve now or defer with clear state
#### CTA budget
- Primary: `Mark all reviewed`
- Secondary: `Back to dashboard`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/protect/dispute`
#### Context
- Intent: contest flagged event with evidence
- Previous: `/protect/alert-detail`
- Next: `/govern/audit`
#### Section Map
- [P1] Dispute summary (`full`)
- [P2] Evidence upload/review (`full`)
- [P3] Submit action (`full`)
#### Representative Data
- Selected alert context and dispute reason
#### Signature Visual
- High-clarity dispute workflow
#### Must-build components
- `EnginePageFrame`, `DisputeForm`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `EvidenceChecklist`
#### Decision Point
- Submit dispute with traceability
#### CTA budget
- Primary: `Submit dispute`
- Secondary: `Back to alert detail`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/grow/recommendations`
#### Context
- Intent: review personalized growth recommendations
- Previous: `/grow`
- Next: `/grow/scenarios`
#### Section Map
- [P1] Recommendation summary (`full`)
- [P2] Ranked recommendations (`full`)
- [P3] Apply action (`full`)
#### Representative Data
- Priority-ranked recommended actions with expected impact
#### Signature Visual
- Ranked recommendation cards
#### Must-build components
- `EnginePageFrame`, `RecommendationList`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ImpactPreview`
#### Decision Point
- Apply recommendation or compare scenarios
#### CTA budget
- Primary: `Open scenarios`
- Secondary: `Back to grow`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/execute/approval`
#### Context
- Intent: approve a single action safely
- Previous: `/execute`
- Next: `/execute/history`
#### Section Map
- [P1] Approval context (`full`)
- [P2] Risk/explainability details (`full`)
- [P3] Approve/decline controls (`full`)
#### Representative Data
- Action amount, risk score, rollback window
#### Signature Visual
- Focused single-approval panel
#### Must-build components
- `EnginePageFrame`, `ApprovalDetail`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `RollbackHint`
#### Decision Point
- Approve now or decline with rationale
#### CTA budget
- Primary: `Approve action`
- Secondary: `Decline`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern/trust`
#### Context
- Intent: inspect trust controls and policy posture
- Previous: `/govern`
- Next: `/govern/audit`
#### Section Map
- [P1] Trust posture summary (`full`)
- [P2] Control matrix (`grid`)
- [P3] Audit handoff action (`full`)
#### Representative Data
- Compliance controls and policy coverage status
#### Signature Visual
- Trust-control matrix with status chips
#### Must-build components
- `EnginePageFrame`, `TrustControlsMatrix`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ProofLine`
#### Decision Point
- Proceed to immutable audit review
#### CTA budget
- Primary: `Open audit ledger`
- Secondary: `Back to govern`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern/audit-detail`
#### Context
- Intent: inspect a single audit record deeply
- Previous: `/govern/audit`
- Next: `/govern/audit`
#### Section Map
- [P1] Record summary (`full`)
- [P2] Event lineage (`full`)
- [P3] Export action (`full`)
#### Representative Data
- Immutable event chain and actor metadata
#### Signature Visual
- Event lineage timeline with integrity markers
#### Must-build components
- `EnginePageFrame`, `AuditRecordDetail`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ExportPanel`
#### Decision Point
- Validate and return to ledger
#### CTA budget
- Primary: `Back to audit ledger`
- Secondary: `Export record`
#### Collapse policy
- Tier B: 4 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern/registry`
#### Context
- Intent: review governed registry entries
- Previous: `/govern`
- Next: `/govern/policy`
#### Section Map
- [P1] Registry summary (`full`)
- [P2] Registry table (`full`)
- [P3] Actions (`full`)
#### Representative Data
- Registry items with verification status
#### Signature Visual
- Structured registry table
#### Must-build components
- `EnginePageFrame`, `RegistryTable`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `FilterControls`
#### Decision Point
- Inspect or update policy linkage
#### CTA budget
- Primary: `Open policy`
- Secondary: `Back to govern`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern/oversight`
#### Context
- Intent: track oversight status and exceptions
- Previous: `/govern`
- Next: `/govern/audit`
#### Section Map
- [P1] Oversight summary (`full`)
- [P2] Exception queue (`full`)
- [P3] Resolve actions (`full`)
#### Representative Data
- Pending oversight items and SLA statuses
#### Signature Visual
- Exception-focused oversight rail
#### Must-build components
- `EnginePageFrame`, `OversightQueue`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `SlaChips`
#### Decision Point
- Resolve or escalate exception
#### CTA budget
- Primary: `Open audit ledger`
- Secondary: `Back to govern`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/govern/policy`
#### Context
- Intent: review and approve policy boundaries
- Previous: `/govern`
- Next: `/settings/rights`
#### Section Map
- [P1] Policy summary (`full`)
- [P2] Policy rules (`full`)
- [P3] Apply action (`full`)
#### Representative Data
- Policy states for approve/alert/rollback
#### Signature Visual
- Clear policy rule matrix
#### Must-build components
- `EnginePageFrame`, `PolicyMatrix`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ChangeLogPreview`
#### Decision Point
- Keep or adjust policy defaults
#### CTA budget
- Primary: `Review access rights`
- Secondary: `Back to govern`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/settings/ai`
#### Context
- Intent: configure AI behavior boundaries
- Previous: `/settings`
- Next: `/settings`
#### Section Map
- [P1] AI settings summary (`full`)
- [P2] Model/guardrail controls (`full`)
- [P3] Save action (`full`)
#### Representative Data
- Model mode, explainability level, guardrail toggles
#### Signature Visual
- Compact control card stack
#### Must-build components
- `EnginePageFrame`, `AiSettingsPanel`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `PolicyReference`
#### Decision Point
- Save or revert AI settings
#### CTA budget
- Primary: `Save AI settings`
- Secondary: `Back to settings`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/settings/integrations`
#### Context
- Intent: manage connected services
- Previous: `/settings`
- Next: `/settings`
#### Section Map
- [P1] Integration summary (`full`)
- [P2] Connected providers (`full`)
- [P3] Connect/disconnect actions (`full`)
#### Representative Data
- Connected institutions/providers and status
#### Signature Visual
- Provider list with trust indicators
#### Must-build components
- `EnginePageFrame`, `IntegrationList`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `ConnectionStatusBadges`
#### Decision Point
- Add or remove integration safely
#### CTA budget
- Primary: `Save integrations`
- Secondary: `Back to settings`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/settings/rights`
#### Context
- Intent: define consent and access rights
- Previous: `/settings`
- Next: `/govern/policy`
#### Section Map
- [P1] Rights summary (`full`)
- [P2] Access matrix (`full`)
- [P3] Review action (`full`)
#### Representative Data
- Consent scope and actor permissions
#### Signature Visual
- Rights matrix with explicit scopes
#### Must-build components
- `EnginePageFrame`, `AccessRightsMatrix`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `PolicyReference`
#### Decision Point
- Confirm rights boundary updates
#### CTA budget
- Primary: `Review policy`
- Secondary: `Back to settings`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/help`
#### Context
- Intent: unblock user quickly
- Previous: any app route
- Next: originating route
#### Section Map
- [P1] Help summary (`full`)
- [P2] FAQ and support options (`full`)
- [P3] Escalation action (`full`)
#### Representative Data
- Top support intents and response channels
#### Signature Visual
- Search-first support layout
#### Must-build components
- `EnginePageFrame`, `HelpSupportPanel`, `PrimaryActionBar`, `GovernFooter`
#### Should-build components
- `FaqAccordion`
#### Decision Point
- Resolve via self-service or escalate
#### CTA budget
- Primary: `Contact support`
- Secondary: `Back`
#### Collapse policy
- Tier C: 3 block cap
#### Technical constraints
- Shared imports, a11y baseline, no inline style, no hardcoded hex

### Route `/test/spectacular`
#### Context
- Intent: internal visual/motion verification
- Previous: internal QA routes
- Next: n/a
#### Section Map
- [P1] Showcase summary (`full`)
- [P2] Surface/button/motion samples (`grid`)
- [P3] Test actions (`full`)
#### Representative Data
- Creator-studio visual and motion primitives
#### Signature Visual
- Controlled showcase sandbox
#### Must-build components
- `TestHarness`, `SurfaceShowcase`, `MotionShowcase`
#### Should-build components
- `TokenReadout`
#### Decision Point
- Validate visual contract or exit
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
