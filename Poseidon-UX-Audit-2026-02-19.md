# Poseidon.AI — UX / Product Quality Audit Report

**Audit Date:** 2026-02-19
**Auditor:** AI Research Analyst (Static Code Analysis)
**Product:** Poseidon.AI — AI-Powered Financial Guardian
**Live URL:** https://poseidon-mit.com
**Repo:** `/sessions/ecstatic-amazing-bardeen/mnt/poseidon-mit.github.io`
**Stack:** React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4.1 + Framer Motion 12 + GitHub Pages
**Audience:** MIT faculty, industry professionals
**Method:** Full static source analysis across ~25 of 40+ routes. Live browser validation was unavailable during the audit window (Chrome extension not connected); all findings are evidence-tied to specific source files and line numbers. Live validation gaps are flagged in Section F.

---

## Table of Contents

- [A. Executive Summary](#a-executive-summary)
- [B. Findings Table](#b-findings-table)
- [C. Cross-Page Coherence Matrix](#c-cross-page-coherence-matrix)
- [D. Architecture and Technical Debt Assessment](#d-architecture-and-technical-debt-assessment)
- [E. Prioritized Action Plan](#e-prioritized-action-plan)
- [F. Verification Checklist](#f-verification-checklist)

---

## A. Executive Summary

### A.1 Readiness Score

**Overall: 6.1 / 10 — Not MIT-audience-ready without P0 fixes**

| Audit Dimension | Score | Basis |
|---|---|---|
| Visual polish & brand consistency | 7/10 | Strong motion system, glass morphism coherent; GovernFooter has 3 incompatible variants |
| Data coherence — cross-page narrative | 4/10 | Critical fragmentation: merchant name, amount, and SHAP scale all inconsistent across pages |
| Interaction quality & micro-interactions | 5/10 | Multiple dead buttons with no onClick handlers in core workflows |
| Onboarding journey continuity | 5/10 | Contract explicitly requires progress indicator on all 4 steps; none implemented |
| Typography & copy quality | 8/10 | Clean, professional; one factual h1 error ("5 engines" / 4 rendered) |
| Navigation & information architecture | 7/10 | Engine architecture clear; /404 CTA routes to wrong destination |
| Trust & credibility signals | 5/10 | 93% math error on Govern is disqualifying for any numerically literate audience |
| Responsive display | 7/10 | Tailwind responsive classes applied; live breakpoint testing not performed |
| Motion quality | 8/10 | Framer Motion spring presets consistently applied; minor AuroraPulse token violations |
| Empty / error / loading states | 6/10 | 404 page adequate; no empty state for zero-item approval queue |
| Performance & technical polish | 7/10 | Lazy loading, Vite build; numerous SCREEN_BLUEPRINTS.forbiddenPatterns violations |
| Accessibility | 6/10 | Partial skip-links and aria-labels; form submit issues, keyboard-accessible disabled buttons |

The score is weighted by demo-path impact. The three Critical findings alone drive a 1.5-point deduction because they occur on routes central to the demo narrative (protect flow, govern dashboard).

### A.2 Top 10 Risks (Ranked by Demo Impact)

1. **[C-001] Dispute letter hardcodes stale values** — `ProtectDispute.tsx` line 222 auto-generates a letter containing "$4,200.00" and "MerchantX" while the transaction display card above it reads "$2,847.00" and "TechElectro Store" from `DEMO_THREAD`. The product contradicts itself on the same screen.

2. **[C-002] "MerchantX" / "$4,200" embedded in multiple non-canonical files** — `Dashboard.tsx` activity feed, `ProtectAlertDetail.tsx` evidence item, and `protect-data.ts` signals all use the stale merchant name and stale amount, breaking the cross-screen narrative thread established by `DEMO_THREAD`.

3. **[C-003] Govern "Verified: 93%" is mathematically false** — 789 verified entries / 1,247 total decisions = 63.3%. The figure 93% appears to be 789/847 (i.e., as a share of filter-tab entries only), but is presented as a percentage of all audited decisions. Both `/govern` and `/govern/audit` display this figure. For a financial intelligence product targeting MIT faculty, a provably wrong compliance metric is a first-impression disqualifier.

4. **[H-004] Onboarding has no step progress indicator** — `ONBOARDING_FLOW_CONTRACT.sharedLayout.progressRequired = true` in `rebuild-contracts.ts`. None of the four steps (welcome, connect, goals, consent) render any indicator. Users cannot gauge progress or understand scope.

5. **[H-007] SHAP waterfall shown with three incompatible representations** — `protect-data.ts` uses scale 0.0–1.0 with raw field labels; `ProtectAlertDetail.tsx` uses scale 1.8–8.2 with human-readable labels; `ProtectDispute.tsx` uses scale 0.0–1.0 with a third label set. The AI explainability narrative is incoherent across the protect flow.

6. **[H-001] Protect governance audit ID uses date 0215** — `GovernFooter auditId="GV-2026-0215-PRT-SIG"` in `Protect.tsx` while all other pages use `GV-2026-0216-*`. The inconsistency originates in `rebuild-contracts.ts` line 544 — the canonical source itself is wrong. For a governance-first product, mismatched audit IDs signal poor data discipline.

7. **[H-002] Execute "Defer" button is dead** — `Execute.tsx` action card "Defer" button has no `onClick` handler. The only interaction in the primary approval workflow is Approve. Evaluators clicking Defer will encounter a non-response.

8. **[H-003] ProtectAlertDetail "Request verification" button is dead** — The secondary CTA on the critical alert detail page has no `onClick` handler. Any attempt to engage the AI verification flow silently fails.

9. **[H-005] Execute sidebar shows "Completed today: 12" while queue starts empty** — The sidebar stat is hardcoded to `"12"`. On page load, `completed.length === 0`. The sidebar displays a completed count that directly contradicts the main panel.

10. **[H-008] All five threat alerts share a single static route** — Every threat in `Protect.tsx` links to `/protect/alert-detail` with no `alertId` parameter. There is no dynamic routing. Clicking any of the five threats loads the same hardcoded detail for THR-001.

### A.3 Ship Confidence

| Condition | Confidence |
|---|---|
| As-is (no fixes) | 4 / 10 — Critical findings will be noticed immediately by target audience |
| P0 fixes applied (C-001, C-002, C-003) | 7 / 10 — Demo-viable for a first pass |
| P0 + P1 fixes applied | 8.5 / 10 — Presentation-ready for MIT faculty context |
| Full remediation | 9 / 10 — Production-quality demo |

---

## B. Findings Table

**Severity Legend:** Critical = demo-breaking narrative failure | High = core interaction failure or major trust signal damage | Medium = coherence/brand/contract gap | Low = polish, accessibility, or minor deviation

### B.1 Critical Findings

| ID | Route | Component | Dimension | Severity | Description | Evidence | Impact | Fix Effort | Fix Path |
|---|---|---|---|---|---|---|---|---|---|
| C-001 | /protect/dispute | `ProtectDispute.tsx` line 222 | Data coherence | **Critical** | AI-generated dispute letter body hardcodes `$4,200.00` and `MerchantX` in the letter text, while the transaction display card on the same page correctly reads `$2,847.00` and `TechElectro Store` from `DEMO_THREAD`. Self-contradiction on a single screen. | `const LETTER_TEMPLATE = "...dispute a charge of $4,200.00 made on February 16, 2026, to MerchantX on my card ending in 4821."` | Any evaluator reading the dispute letter sees fabricated figures inconsistent with the data the product itself showed moments before. Demo-breaking. | XS — replace 3 string literals with template expressions using `DEMO_THREAD.criticalAlert` values | Replace hardcoded `$4,200.00` → `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`, `MerchantX` → `${DEMO_THREAD.criticalAlert.merchant}`, verify `4821` matches `DEMO_THREAD.criticalAlert.cardLast4` |
| C-002 | /dashboard, /protect/alert-detail, protect-data.ts | `Dashboard.tsx` activity feed; `ProtectAlertDetail.tsx` evidenceItems[1]; `protect-data.ts` signals[0] | Data coherence | **Critical** | Three separate files reference "MerchantX" / "MerchantX Electronics" and "$4,200" — the stale values from before `DEMO_THREAD` was updated to "TechElectro Store" / "$2,847". Breaks the cross-screen narrative thread. | Dashboard: `"Blocked suspicious transfer to MerchantX"`; ProtectAlertDetail: `evidenceItems[1].details = "...MerchantX Electronics..."`; protect-data: `signals[0].merchant = "MerchantX Electronics"`, `signals[0].amount = "$4,200.00"` | Evaluators following the protect golden path see the merchant name change between pages. Signals incomplete data migration. | S — 3 files, each a 1–3 line string substitution | Update all three files to reference `DEMO_THREAD.criticalAlert.merchant` and `DEMO_THREAD.criticalAlert.amount`. Consider centralizing protect-data.ts signal[0] to import from DEMO_THREAD directly. |
| C-003 | /govern, /govern/audit | `Govern.tsx`; `GovernAuditLedger.tsx` | Trust & credibility | **Critical** | "Verified: 93%" is displayed on both governance pages. Arithmetic: 789 / 1,247 = 63.3%, not 93%. The 93% figure appears to derive from 789 / 847 (verified ÷ filter-tab total), but the label presents it as a share of all 1,247 audited decisions. | `Govern.tsx`: `"Verified: 93%, Pending review: 55, Flagged: 3"`; `GovernAuditLedger.tsx` filterTab Verified count: 789, total count from `DEMO_THREAD.decisionsAudited`: 1,247 | On a governance/compliance page of a financial product, a verifiably wrong percentage is an immediate credibility failure. MIT faculty will compute it. | XS — change display value or add qualifying denominator | Either correct the percentage to 63% (789/1,247), or change the denominator label to "of tracked entries" and show 93% = 789/847. Also reconcile filter tab totals: 789+55+3 = 847 ≠ 1,247. |

### B.2 High Findings

| ID | Route | Component | Dimension | Severity | Description | Evidence | Impact | Fix Effort | Fix Path |
|---|---|---|---|---|---|---|---|---|---|
| H-001 | /protect | `Protect.tsx` GovernFooter; `rebuild-contracts.ts` line 544 | Brand consistency / governance | High | `GovernFooter auditId="GV-2026-0215-PRT-SIG"` uses date 0215 while every other page uses 0216. The inconsistency originates in `rebuild-contracts.ts` — the canonical source is wrong. | `rebuild-contracts.ts` line 544: `auditId: 'GV-2026-0215-PRT-SIG'` | Governance audit IDs are a trust signal in this product. A mismatched date implies the protect engine was last verified on a different day than all other engines — either a data entry error or a real audit gap. Evaluators focused on governance will notice. | XS — 1 string in canonical source | Change `GV-2026-0215-PRT-SIG` → `GV-2026-0216-PRT-SIG` in `rebuild-contracts.ts`. The page component reads this via `GOVERNANCE_META` or inlines it — verify both. |
| H-002 | /execute | `Execute.tsx` action card | Interaction quality | High | The "Defer" button on every pending action card has no `onClick` handler. It renders with `cursor-pointer` but clicking produces no response. | `<button className="...cursor-pointer" style=\{\{...\}\}>Defer</button>` — no `onClick` prop | The approve/defer decision is the core UX of the Execute engine. Half of the primary action surface is dead. Evaluators attempting to defer an action will interpret this as a bug. | S — add `handleDefer` state update parallel to `handleApprove` | Implement `handleDefer(id)` that sets `status: "deferred"` (or displays a defer confirmation). Add to both the button `onClick` and the `ActionStatus` type. |
| H-003 | /protect/alert-detail | `ProtectAlertDetail.tsx` | Interaction quality | High | "Request verification" button (secondary CTA below "Approve block") has no `onClick` handler. Clicking is silent. | `<button className="...">Request verification</button>` — no `onClick` prop | In the critical alert detail flow, a user who wants AI verification rather than a direct block decision is stuck. The action produces no feedback. | S — add modal, toast, or navigation to verification workflow | Implement onClick to either open a confirmation modal, navigate to `/protect/dispute`, or display a toast with a "Verification request submitted" message. |
| H-004 | /onboarding (all 4 steps) | `OnboardingWelcome.tsx`, `Onboarding.tsx`, `OnboardingGoals.tsx`, `OnboardingConsent.tsx` | Onboarding journey | High | `ONBOARDING_FLOW_CONTRACT.sharedLayout.progressRequired = true` in `rebuild-contracts.ts`. None of the four onboarding steps renders any step indicator ("Step 1 of 4", progress bar, dots, etc.). OnboardingWelcome references "4 quick steps" in body copy but provides no persistent visual tracking. | `rebuild-contracts.ts`: `ONBOARDING_FLOW_CONTRACT.sharedLayout = { progressRequired: true, ... }`. All four step files: no progress indicator markup. | Users have no way to gauge how far into setup they are. Drop-off risk is high at onboarding. For a demo, evaluators testing the full onboarding path will note the contract violation. | M — add consistent progress bar or step dots component across all 4 pages | Create a shared `<OnboardingProgress step={n} total={4} />` component. Add to the top of each step page. Follows CLAUDE.md shared-component pattern. |
| H-005 | /execute | `Execute.tsx` sidebar | Data coherence | High | Sidebar "Completed today: 12" is hardcoded. On initial page load, `completed.length === 0` because all `queueActions` start with `status: "pending"`. The sidebar displays a count that contradicts the main panel. | `{ label: "Completed today", value: "12", color: "var(--state-healthy)" }` hardcoded in sidebar data array; `completed = actions.filter(a => a.status !== "pending")` → initially empty | An evaluator who reads "Completed today: 12" and then looks at the main panel showing 0 completed items will immediately perceive the UI as disconnected or broken. | XS — wire sidebar stat to computed state | Replace hardcoded `"12"` with a dynamic expression. Either use `completed.length` + a hardcoded "prior" offset (e.g., `String(completed.length + 12)`) or separate "completed today (prior)" from session-completed. |
| H-006 | /execute/history | `ExecuteHistory.tsx` | Data coherence | High | "Reversed: 2" metric in Execute History conflicts with Execute main page sidebar "Rollbacks (24h): 0". Both claim to represent recent rollbacks. | `ExecuteHistory.tsx`: `{ label: "Reversed", value: "2" }`; `Execute.tsx` sidebar: `{ label: "Rollbacks (24h)", value: "0" }` | Evaluators following the Execute engine golden path (main → history) see the rollback count change from 0 to 2. The conflict implies either the history is showing older data or the main page is wrong. | XS — align one value to the other | Decide on canonical rollback count. If rollbacks = 0, set ExecuteHistory "Reversed" to 0. If rollbacks = 2, set Execute sidebar "Rollbacks (24h)" to 2. Prefer pulling both from `DEMO_THREAD`. |
| H-007 | /protect/alert-detail, /protect/dispute | `ProtectAlertDetail.tsx` shapFactors; `protect-data.ts` shapFactors; `ProtectDispute.tsx` shapFactors | Data coherence / AI explainability | High | SHAP waterfall is displayed with three entirely different scale systems and label naming conventions across the protect flow. `protect-data.ts`: scale 0.0–1.0, raw field labels (`merchant_days_since_registration`). `ProtectAlertDetail.tsx`: scale 1.8–8.2, human-readable labels (`Transaction velocity`, `Geo anomaly`). `ProtectDispute.tsx`: scale 0.0–1.0, a third label set (`Merchant history`, `Amount deviation`). | Source files: `protect-data.ts` shapFactors; `ProtectAlertDetail.tsx` const `shapFactors`; `ProtectDispute.tsx` const `shapItems` | Breaks the AI explainability narrative. A technically sophisticated audience (MIT faculty) will notice that the same SHAP framework produces incompatible outputs on consecutive screens. Undermines the core "trustworthy AI" claim. | M — define canonical SHAP representation once, import everywhere | Create `src/lib/protect-shap.ts` with a canonical shapFactors array. Import in all three files. Choose one scale (recommend 0.0–1.0) and one label style (human-readable). |
| H-008 | /protect | `Protect.tsx` threat links | Navigation / IA | High | All 5 threat items in `Protect.tsx` route to `/protect/alert-detail` as a static string. There is no alertId in the route, no dynamic routing, and no way to distinguish which alert was clicked. | `threats.map(t => <Link to="/protect/alert-detail">...)` — no `to={/protect/alert-detail/${t.id}}` | Clicking any of the 5 threats always loads the THR-001 hardcoded detail. For a demo with multiple threats listed, this breaks believability and prevents scenario variety. | S — add route parameter | Add `/protect/alert-detail/:id` to the router. Pass `to={\`/protect/alert-detail/${t.id}\`}`. In `ProtectAlertDetail.tsx`, read the id param to select the correct threat data. For demo, parameterized fallback to THR-001 data is acceptable. |

### B.3 Medium Findings

| ID | Route | Component | Dimension | Severity | Description | Evidence | Impact | Fix Effort | Fix Path |
|---|---|---|---|---|---|---|---|---|---|
| M-001 | All Tier 1-2 pages | GovernFooter (multiple inlined copies) | Brand consistency | Medium | GovernFooter has three incompatible implementations across the codebase. Variant A (Execute, ProtectAlertDetail): ShieldCheck icon + "Verified" badge + "Request human review" → /govern/audit. Variant B (Grow, GrowScenarios, ExecuteHistory, Settings): Scale icon + "Open ledger" text link → /govern/audit. Variant C (GovernAuditLedger): Variant A but "Request human review" links to `/govern` instead of `/govern/audit`. | Compare `Execute.tsx` GovernFooter vs `Grow.tsx` GovernFooter vs `GovernAuditLedger.tsx` GovernFooter | A governance trust signal that looks different on every page signals that governance itself is inconsistent. Particularly notable when GovernAuditLedger's "Request human review" takes you away from the audit page. | M — extract to shared component | Create `src/components/poseidon/GovernFooter.tsx` as a single canonical component with props for `auditId` and `pageContext`. Import in all pages. CLAUDE.md already references GovernFooter as a poseidon facade — it just needs to be implemented as one. |
| M-002 | /settings | `Settings.tsx` primaryActionCTA | Navigation / IA | Medium | "Review settings controls" CTA links to `/settings` — the current page. The self-referential link is confirmed in `rebuild-contracts.ts` (`primaryActionPath: '/settings'`). The CTA is a no-op navigation. | `Settings.tsx`: `<Link to="/settings">Review settings controls</Link>`; `rebuild-contracts.ts`: `'/settings': { primaryActionPath: '/settings' }` | Evaluators clicking the primary settings CTA expect to go somewhere. A same-page navigation is confusing and suggests an incomplete route. | S — define a meaningful destination | Update `rebuild-contracts.ts` and `Settings.tsx` to point to a relevant sub-route (e.g., `/settings/ai`, `/settings/integrations`) or to a help/support page. |
| M-003 | /404 | `NotFound.tsx` | Navigation / IA | Medium | "Back to dashboard" CTA links to `"/"` (landing page). `ROUTE_META_CONTRACT` in `rebuild-contracts.ts` specifies `primaryActionPath: '/dashboard'`. | `NotFound.tsx`: `<Link to="/">Back to dashboard</Link>`; `rebuild-contracts.ts`: `primaryActionPath: '/dashboard'` | Users hitting a 404 are routed to the marketing landing page instead of their command center. Contract violation. | XS — change `"/"` to `"/dashboard"` | 1-line fix in `NotFound.tsx`. |
| M-004 | /dashboard | `Dashboard.tsx` h1 | Copy quality | Medium | h1 copy reads "Poseidon is working across **5 engines**" but the page renders only 4 EngineHealthCard entries (Protect, Grow, Execute, Govern). The 5th engine is undefined in the component. | `Dashboard.tsx`: `"Poseidon is working across 5 engines"` in hero text; `engineHealth` array has 4 entries | Factual error in the product's headline claim on the primary screen. Numerically oriented audience will notice the count mismatch immediately. | XS — change "5" to "4" or add the 5th engine card | Either update copy to "4 engines" or add a 5th engine card. If Dashboard itself is considered the 5th engine, make that explicit in copy. |
| M-005 | Multiple pages | Various `AuroraPulse` inlines | Technical polish / CLAUDE.md compliance | Medium | Multiple pages use hardcoded hex values in `AuroraPulse` (e.g., `#22C55E` in `Protect.tsx`, `#3B82F6` in `Govern.tsx` and `GovernAuditLedger.tsx`). `SCREEN_BLUEPRINTS.forbiddenPatterns` includes `'hardcoded-hex'`. | `Protect.tsx`: `<AuroraPulse color="#22C55E" />`; `Govern.tsx`: `<AuroraPulse color="#3B82F6" />` | Violates the project's own architectural contract. If engine token colors change, these pages will not update automatically. | XS per page — replace hex with CSS variable | Use `color="var(--engine-protect)"` etc. as `Grow.tsx` correctly does. |
| M-006 | /protect (data source) | `protect-data.ts` citations | Trust & credibility | Medium | Citation objects `c1` and `c3` both reference the same arxiv URL `https://arxiv.org/abs/1705.07874` (Shapley values paper). c3 is described differently but links to the same paper. | `protect-data.ts`: `c1 = { url: "https://arxiv.org/abs/1705.07874", ... }` and `c3 = { url: "https://arxiv.org/abs/1705.07874", ... }` | The AI explanation section of the protect flow cites 3 sources, but two are the same source with different labels. Weakens the academic rigor appearance for an MIT audience. | XS — replace c3 with a distinct citation | Find a second relevant paper (e.g., a fraud detection paper) for citation c3. |
| M-007 | /govern/audit | `GovernAuditLedger.tsx` | Interaction quality | Medium | "Export CSV" and "Export PDF" buttons in the audit ledger have no `onClick` handlers. | `<button>Export CSV</button>` and `<button>Export PDF</button>` — no handler | These are standard data export affordances in a governance tool. Non-functional exports make the governance engine feel incomplete. | S — add download stubs | Implement handlers that either generate a stub CSV/PDF from the displayed data, or show a toast "Export initiated — file will download shortly." |
| M-008 | /protect (data source) | `protect-data.ts` signals[0] | Data coherence | Medium | `protect-data.ts` signals[0].amount = "$4,200.00", which conflicts with `DEMO_THREAD.criticalAlert.amount = 2847`. The Protect page uses `DEMO_THREAD` values for the primary threat, but `protect-data.ts` is imported for the SHAP factors and could surface the wrong amount if rendered. | `protect-data.ts`: `amount: "$4,200.00"` for signal PRT-2026-0216-003; `DEMO_THREAD`: `criticalAlert.amount = 2847` | If any component reads the amount from `protect-data.ts` rather than `DEMO_THREAD`, it will display $4,200 on a page that reads $2,847 elsewhere. Already manifests partially in C-001 and C-002. | S — align protect-data.ts to DEMO_THREAD | Update `protect-data.ts` signals[0] to import or reference `DEMO_THREAD.criticalAlert` values directly. |

### B.4 Low Findings

| ID | Route | Component | Dimension | Severity | Description | Evidence | Impact | Fix Effort | Fix Path |
|---|---|---|---|---|---|---|---|---|---|
| L-001 | /signup | `Signup.tsx` | Accessibility / interaction | Low | Form submit CTA is a `<Link to="/onboarding/connect">` component, not a `<button type="submit">`. The form has no `onSubmit` handler. Pressing Enter in a field does not submit. No client-side field validation runs before navigation. | `Signup.tsx`: CTA rendered as `<Link>` not `<button type="submit">`. No `<form onSubmit>` handler. | Users pressing Enter after filling fields will not advance. Empty-field navigation is possible. | S — wrap in form with onSubmit | Add `<form onSubmit={handleSubmit}>`, change CTA to `<button type="submit">`, add basic validation (non-empty email/password). |
| L-002 | /govern/audit | `GovernAuditLedger.tsx` | Data coherence | Low | Filter tab totals sum to 847 (Verified 789 + Pending 55 + Flagged 3), not 1,247 (DEMO_THREAD.decisionsAudited). The 400-decision gap is unaccounted for and inconsistently explained. | `GovernAuditLedger.tsx` filterTabs: Verified=789, Pending=55, Flagged=3 → sum=847; DEMO_THREAD.decisionsAudited=1247 | Secondary issue behind C-003. The filter tabs implicitly suggest only 847 of 1,247 decisions are viewable. Technically plausible (auto-approved entries might not need review) but unexplained. | XS — add explanatory label or align totals | Either add a label "Showing 847 of 1,247 reviewed decisions" or adjust tab totals to sum to 1,247. |
| L-003 | /grow, /execute/history | `Grow.tsx`; `ExecuteHistory.tsx` | Accessibility | Low | Both pages lack a skip-to-content link (`<a href="#main-content" className="sr-only">`). CLAUDE.md does not mandate skip links explicitly, but `Execute.tsx` includes one as a pattern. | `Grow.tsx` and `ExecuteHistory.tsx`: no skip-to-main-content link in file. `Execute.tsx` line 90: has skip link. | Screen reader and keyboard users cannot bypass the navigation header on these pages. Minor but notable in an academic/professional demo context. | XS per file — add one line | Add `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` at the top of both files. |
| L-004 | /onboarding/goals | `OnboardingGoals.tsx` | Accessibility | Low | "Continue" CTA is a `<Link>` styled to appear disabled (pointer-events: none, opacity reduced) when no goals are selected, but keyboard navigation can still reach and activate it because `<Link>` has no `aria-disabled` or `tabIndex={-1}` when disabled. | `OnboardingGoals.tsx`: `style=\{\{ pointerEvents: noGoals ? "none" : "auto", opacity: noGoals ? 0.4 : 1 \}\}` on a `<Link>` element — no `aria-disabled`, no `tabIndex` change | Keyboard-only users can bypass the goals requirement and advance to consent step with no goals selected. | XS — add aria-disabled and tabIndex | Add `aria-disabled={noGoals}` and `tabIndex={noGoals ? -1 : 0}` to the Link. |
| L-005 | /govern, /govern/audit | `Govern.tsx` ledger entries; `GovernAuditLedger.tsx` entries | Brand consistency | Low | `Govern.tsx` ledger preview uses short IDs ("GV-847", "GV-846") while `GovernAuditLedger.tsx` uses full date-stamped format ("GV-2026-0216-847"). Same data, different display format. | `Govern.tsx`: `{ id: "GV-847", ... }`; `GovernAuditLedger.tsx`: entries formatted as `GV-2026-0216-{n}` | Minor visual inconsistency. A user drilling from /govern to /govern/audit will see IDs change format. | XS — align formats | Update `Govern.tsx` ledger preview IDs to match the full format used in `GovernAuditLedger.tsx`. |

---

## C. Cross-Page Coherence Matrix

Seven canonical data values from `DEMO_THREAD` (sourced from `rebuild-contracts.ts` `CROSS_SCREEN_DATA_THREAD`) are tracked across all pages that should display or compute them.

**Legend:** ✓ = matches canonical value | ✗ = contradicts canonical value | ~ = partially correct | — = not applicable on this route

| Data Thread Key | Canonical Value | /dashboard | /protect | /protect/alert-detail | /protect/dispute | /execute | /govern | /govern/audit | /grow | /execute/history |
|---|---|---|---|---|---|---|---|---|---|---|
| `systemConfidence` | 0.92 | ✓ | — | — | — | ✓ | ✓ | — | — | — |
| `decisionsAudited` | 1,247 | ✓ (prose) | — | — | — | — | ✓ (ring) | ✓ (header stat) | — | — |
| `complianceScore` | 96% | ✓ | — | — | — | — | ✓ | — | — | — |
| `pendingActions` | 5 | ✓ | — | — | — | ✓ (h1) | — | — | — | — |
| `monthlySavings` | $847/mo | ✓ | — | — | — | ✓ (sidebar, h1) | — | — | — | ✓ |
| `emergencyFund` (73%, $7,300, $10,000) | 73% / $7,300 / $10,000 | — | — | — | — | — | — | — | ✓ | — |
| `criticalAlert.merchant` | "TechElectro Store" | **✗** "MerchantX" | ✓ | **✗** "MerchantX Electronics" (evidence item) | ~ (display correct; letter body **✗** "MerchantX") | ✓ (EXE-002) | — | — | — | — |
| `criticalAlert.amount` | $2,847 | — | ✓ | ~ (display correct; evidence calc implies $4,200) | ~ (display correct; letter body **✗** "$4,200.00") | ✓ (EXE-002) | — | — | — | — |
| `criticalAlert.confidence` | 0.94 | — | ✓ | ✓ | ✓ | ✓ (EXE-002) | — | — | — | — |
| `criticalAlert.cardLast4` | "4821" | — | — | ✓ | ✓ | — | — | — | — | — |
| `criticalAlert.signalId` | "PRT-2026-0216-003" | — | ✓ | ✓ | ✓ | — | — | — | — | — |
| Verified percentage (derived) | 63.3% (789/1247) | — | — | — | — | — | **✗** 93% | **✗** 93% | — | — |
| GovernFooter auditId date | 0216 (all pages) | ✓ 0216 | **✗** 0215 | ✓ 0216 | ✓ 0216 | ✓ 0216 | ✓ 0216 | ✓ 0216 | ✓ 0216 | ✓ 0216 |
| Rollbacks (24h) | Undefined — conflict | — | — | — | — | 0 (sidebar) | — | — | — | 2 (Reversed) |

**Coherence summary:** 8 of 14 tracked keys are fully coherent across all relevant routes. The `criticalAlert.merchant` and `criticalAlert.amount` keys are the primary failure vectors, manifesting on 3 routes each. The `Verified %` and `auditId date` keys each fail on 1–2 routes with a common root cause.

---

## D. Architecture and Technical Debt Assessment

### D.1 Canonical Data Flow

**Design intent (from CLAUDE.md and rebuild-contracts.ts):** All cross-screen values originate in `rebuild-contracts.ts` → re-exported through `src/lib/demo-thread.ts` as `DEMO_THREAD` → consumed by page components.

**Actual state:** The data flow is partially implemented. `DEMO_THREAD` is correctly used by `Protect.tsx`, `Execute.tsx`, `Grow.tsx`, `Govern.tsx`, and `ProtectDispute.tsx` (transaction display). However, the following bypass the canonical source:

- `protect-data.ts` — maintains its own `signals[0]` with stale merchant/amount values. This file predates `DEMO_THREAD` and was never migrated.
- `Dashboard.tsx` activity feed — hardcodes merchant name in an inline string.
- `ProtectAlertDetail.tsx` evidence items — hardcodes merchant name in an inline array.
- `ProtectDispute.tsx` letter body — hardcodes the dispute amounts in a template string (distinct from the transaction display which correctly reads `DEMO_THREAD`).

The root cause is an incomplete migration to `DEMO_THREAD`. Stale values were not purged from all files after the canonical merchant name was updated from "MerchantX" to "TechElectro Store".

**Recommendation:** Audit every file for the string "MerchantX" using a global search. Each occurrence is a migration gap.

### D.2 SCREEN_BLUEPRINTS.forbiddenPatterns Compliance

`SCREEN_BLUEPRINTS.forbiddenPatterns = ['single-file-self-contained', 'all-data-inline', 'style=\{\{', 'hardcoded-hex']`

Current compliance status across audited pages:

| Pattern | Compliance | Notes |
|---|---|---|
| `single-file-self-contained` | Partial | v0 pages are self-contained by design per CLAUDE.md. This entry in forbiddenPatterns appears to conflict with the v0 integration model. Likely a legacy constraint. |
| `all-data-inline` | Failing | Nearly every page defines its own local data arrays (queueActions, shapFactors, GOAL_KPIS, etc.) rather than importing from a shared data layer. |
| `style=\{\{` | Failing | Inline style objects are pervasive across all page files. This appears to be an accepted pattern given the dark-theme glassmorphism design. The constraint is not enforced. |
| `hardcoded-hex` | Failing | At least 3 pages use hardcoded hex in AuroraPulse: `#22C55E` (Protect), `#3B82F6` (Govern, GovernAuditLedger). `Grow.tsx` correctly uses `var(--engine-grow)`. |

**Assessment:** The forbiddenPatterns list reads as aspirational rather than enforced. The `CI test` (`src/__tests__/infra-integrity.test.ts`) that CLAUDE.md says "automatically verifies" these constraints should be audited — either the test is not running or is not covering these patterns.

### D.3 GovernFooter Fragmentation

The GovernFooter is the product's primary per-page trust signal. It appears on every Tier 1–2 page. Its purpose is to signal that every decision is logged and auditable. Currently:

- **3 distinct inline implementations** exist across the codebase, none sharing code.
- **Variant A** (Execute, ProtectAlertDetail): Full implementation with ShieldCheck icon, "Verified" badge, and "Request human review" → `/govern/audit`.
- **Variant B** (Grow, GrowScenarios, ExecuteHistory, Settings, Govern): Minimal implementation with Scale icon and "Open ledger" text link. No "Verified" badge. No human review button.
- **Variant C** (GovernAuditLedger): Variant A markup but the "Request human review" link routes to `/govern` instead of `/govern/audit`, which is the page the user is already on.

CLAUDE.md explicitly states `GovernFooter` should be a poseidon facade component (`import { GovernFooter } from '@/components/poseidon'`). This is implemented in `ProtectDispute.tsx` (which uniquely imports from `@/components/poseidon`) but every other page inlines its own version.

**Risk:** A trust signal that renders differently on each page communicates inconsistency, which is the opposite of what governance trust signals are meant to do. For an audience of MIT faculty evaluating AI governance, this is a substantive credibility gap.

### D.4 SHAP Visualization Fragmentation

The product's AI explainability claim is central to its value proposition. SHAP waterfall charts appear on three screens in the protect flow. They should present a unified, interpretable model explanation. Currently:

| Location | Scale | Labels (examples) | Source |
|---|---|---|---|
| `protect-data.ts` shapFactors | 0.0–1.0 | `merchant_days_since_registration`, `velocity_score` | Raw ML feature names |
| `ProtectAlertDetail.tsx` shapFactors | 1.8–8.2 | `Transaction velocity`, `Geo anomaly`, `Device fingerprint` | Human-readable, different values |
| `ProtectDispute.tsx` shapItems | 0.0–1.0 | `Merchant history`, `Amount deviation`, `Time pattern` | Human-readable, different from above |

Three representations of the same SHAP model for the same transaction. An ML-literate reviewer (likely in an MIT context) will recognize these as incompatible — they cannot all be correct simultaneously for the same prediction.

**Recommendation:** Define one canonical SHAP representation in `src/lib/protect-shap.ts`. Expose two views if needed: a raw-values view (0.0–1.0, ML labels) and a consumer view (human-readable labels, same underlying values). Import this from all three locations.

### D.5 Motion Preset Duplication

CLAUDE.md Rule: `Motion presets — import { fadeUp, staggerContainer } from '@/lib/motion-presets' (local definition prohibited)`.

All pages except `ProtectDispute.tsx` define their own local `fadeUp` and `staggerContainer` constants. `ProtectDispute.tsx` uniquely imports from `@/lib/motion-presets` as required by contract.

This is a low-risk violation (functionally equivalent) but means that if the motion system changes, only `ProtectDispute.tsx` will pick up the update automatically. Worth addressing in a cleanup pass.

### D.6 Dynamic Routing Gap

The protect alert system has a structural limitation: `/protect/alert-detail` is a static route with no ID parameter. The router in `src/router/lazyRoutes.ts` would need to be updated to support `/protect/alert-detail/:id`. Until then, multi-alert scenarios cannot be demoed without code changes. This is an architecture decision point — if the demo only ever surfaces THR-001, the static route is acceptable, but the five-threat display in `Protect.tsx` implies scenario variety that the routing cannot deliver.

---

## E. Prioritized Action Plan

### P0 — Pre-Demo (Fix before any external presentation)

These three issues actively undermine the demo's credibility and will be noticed immediately by a technical audience. Estimated total effort: 2–3 hours.

**P0-A: Purge all "MerchantX" references** (resolves C-001, C-002, partial C-002)
- Global search repo for `"MerchantX"` and `"MerchantX Electronics"`
- Files confirmed: `Dashboard.tsx` (activity feed), `ProtectAlertDetail.tsx` (evidenceItems[1]), `ProtectDispute.tsx` (letter body), `protect-data.ts` (signals[0].merchant)
- Replace all with `DEMO_THREAD.criticalAlert.merchant` or the string `"TechElectro Store"` where runtime import is impractical
- Simultaneously: replace `$4,200` / `$4,200.00` with `DEMO_THREAD.criticalAlert.amount` references

**P0-B: Fix Govern "Verified: 93%" math error** (resolves C-003)
- Decide on intended semantics: "93% of reviewed entries" (789/847) vs "63% of all audited decisions" (789/1247)
- For maximum credibility with a financial audience, use the correct percentage with the appropriate denominator clearly labeled
- Update both `Govern.tsx` and `GovernAuditLedger.tsx`
- Optionally: align filter tab totals to sum to 1,247 (add an "Auto-approved" or "Archived" tab)

### P1 — High Priority (Fix before formal evaluation)

Estimated total effort: 8–12 hours.

**P1-A: Add onboarding progress indicator** (resolves H-004)
- Create shared `<OnboardingProgress step={n} total={4} />` component
- Add to `OnboardingWelcome.tsx` (step 0 or "pre"), `Onboarding.tsx` (step 1), `OnboardingGoals.tsx` (step 2), `OnboardingConsent.tsx` (step 3)

**P1-B: Implement Execute "Defer" action** (resolves H-002)
- Add `handleDefer(id)` → status: `"deferred"` in state, with appropriate UX (confirm dialog or simple state update)

**P1-C: Fix Protect audit date in canonical source** (resolves H-001)
- Change `rebuild-contracts.ts` line 544 from `GV-2026-0215-PRT-SIG` to `GV-2026-0216-PRT-SIG`
- Verify the GovernFooter in `Protect.tsx` reads this value (or update directly if hardcoded)

**P1-D: Unify SHAP representation** (resolves H-007)
- Create `src/lib/protect-shap.ts` with canonical shapFactors array (0.0–1.0 scale, human-readable labels)
- Import in `protect-data.ts`, `ProtectAlertDetail.tsx`, `ProtectDispute.tsx`

**P1-E: Implement ProtectAlertDetail "Request verification" action** (resolves H-003)
- Add onClick to navigate to `/protect/dispute` or display a confirmation modal

**P1-F: Add dynamic routing to protect alert detail** (resolves H-008)
- Add `/protect/alert-detail/:id` route
- Pass alert ID from `Protect.tsx` threat links
- Demo-safe fallback: if ID is not THR-001, display a "Loading threat data…" stub

### P2 — Medium Priority (Ship-quality improvements)

Estimated total effort: 4–6 hours.

- **P2-A**: Extract GovernFooter to shared poseidon component (resolves M-001) — creates single source of truth for a core trust signal
- **P2-B**: Fix NotFound "Back to dashboard" to link to `/dashboard` (resolves M-003) — 1-line fix, contract compliance
- **P2-C**: Correct Dashboard h1 "5 engines" to "4 engines" (resolves M-004) — 1-word change, factual accuracy
- **P2-D**: Align Execute sidebar "Completed today" to dynamic state (resolves H-005) — wire to `completed.length` + prior-session offset
- **P2-E**: Align Execute/ExecuteHistory rollback counts (resolves H-006) — pick one number, source from DEMO_THREAD
- **P2-F**: Replace AuroraPulse hardcoded hex with CSS variables (resolves M-005) — 3-line change across 2 files
- **P2-G**: Implement GovernAuditLedger export button stubs (resolves M-007) — toast or stub download handler

### P3 — Polish (Post-evaluation cleanup)

Estimated total effort: 2–3 hours.

- **P3-A**: Fix Signup form submit behavior (resolves L-001)
- **P3-B**: Add skip-to-content links to Grow and ExecuteHistory (resolves L-003)
- **P3-C**: Fix OnboardingGoals disabled-state accessibility (resolves L-004)
- **P3-D**: Align GovernAuditLedger filter tab totals or add explanatory label (resolves L-002)
- **P3-E**: Align Govern/GovernAuditLedger ledger entry ID formats (resolves L-005)
- **P3-F**: Replace duplicate protect-data citation c3 with a distinct source (resolves M-006)
- **P3-G**: Fix Settings "Review settings controls" self-link (resolves M-002)
- **P3-H**: Migrate all pages from local motion presets to `@/lib/motion-presets` (CLAUDE.md compliance)

---

## F. Verification Checklist

### F.1 Pre-Demo Validation (P0 fixes)

After applying P0 fixes, walk through the protect golden path in the following order and verify each item:

- [ ] `/protect` — Main threat card shows "TechElectro Store" and "$2,847" in the threat summary
- [ ] `/protect` → click first threat → `/protect/alert-detail` — Alert header shows "TechElectro Store", amount "$2,847", confidence 0.94
- [ ] `/protect/alert-detail` — Evidence item 2 no longer references "MerchantX Electronics"; shows "TechElectro Store"
- [ ] `/protect/alert-detail` → "Dispute" → `/protect/dispute` — Transaction card shows "TechElectro Store", "$2,847.00"
- [ ] `/protect/dispute` — AI-generated letter preview reads "$2,847.00" and "TechElectro Store" (not $4,200 / MerchantX)
- [ ] `/govern` — "Verified: X%" shows a mathematically correct value with clear denominator label
- [ ] `/govern/audit` — Same verified percentage as `/govern`; filter tab totals are explained or aligned
- [ ] `/dashboard` — Activity feed does not contain "MerchantX"; shows "TechElectro Store"

### F.2 Execute Engine Validation

- [ ] `/execute` — "Defer" button on each pending action card produces a visible response on click
- [ ] `/execute` — Sidebar "Completed today" count is consistent with the number of completed items shown in the main panel
- [ ] `/execute/history` — "Reversed" count matches "Rollbacks (24h)" on `/execute`

### F.3 Onboarding Flow Validation

- [ ] `/onboarding` (welcome) — Step progress indicator visible ("Step 1 of 4" or dots)
- [ ] `/onboarding/connect` — Step progress indicator visible ("Step 2 of 4")
- [ ] `/onboarding/goals` — Step progress indicator visible ("Step 3 of 4"); "Continue" not keyboard-accessible when disabled
- [ ] `/onboarding/consent` — Step progress indicator visible ("Step 4 of 4")
- [ ] `/onboarding` → `/onboarding/connect` → `/onboarding/goals` → `/onboarding/consent` → complete — full flow navigable without interruption

### F.4 Governance Trust Signal Validation

- [ ] Every Tier 1-2 page — GovernFooter renders with identical layout and all interactive elements functional
- [ ] `/govern/audit` — GovernFooter "Request human review" stays within the audit context (links to `/govern/audit` or opens modal, not `/govern`)
- [ ] All pages — GovernFooter auditId dates are consistent (all `0216`)

### F.5 Navigation Edge Cases

- [ ] `/nonexistent-route` — Lands on 404 page; "Back to dashboard" routes to `/dashboard`
- [ ] `/settings` — Primary CTA does not navigate to the same page (self-link resolved)

### F.6 Live Site Validation (Pending — Chrome Extension Required)

The following checks could not be performed during this audit pass due to Chrome extension unavailability. These should be validated against the live deployment at https://poseidon-mit.com before any external presentation.

- [ ] Responsive layout at 375×812 (mobile) — all pages, especially Execute action cards and Protect threat list
- [ ] Responsive layout at 768×1024 (tablet) — grid breakpoints, sidebar collapsing
- [ ] Keyboard navigation — tab order through each engine page, focus trap in modals if any
- [ ] Reduced-motion — Framer Motion `useReducedMotion()` correctly suppresses spring animations
- [ ] Page load performance — LCP and TTI on initial dashboard render via GitHub Pages CDN
- [ ] Command palette (if implemented) — search and keyboard shortcut activation
- [ ] GovernFooter "Open ledger" link from all Variant B pages navigates correctly
- [ ] Protected routes — `/dashboard` and engine pages redirect to `/login` when unauthenticated
- [ ] Back-button behavior — browser back from alert detail → protect works without state corruption
- [ ] Onboarding forward/back navigation without state loss

---

*Report generated 2026-02-19 via static source analysis of poseidon-mit.github.io repository. 25 of 40+ routes fully audited. Routes not yet audited include: Pricing, Trust, Deck, Recovery, HelpSupport, GrowGoalDetail, GrowRecommendations, ExecuteApproval, GovernAuditDetail, GovernTrust, GovernOversight, GovernRegistry, GovernPolicy, SettingsAI, SettingsIntegrations, SettingsRights, AlertsHub, and dashboard sub-routes. Supplemental audit of remaining routes recommended prior to full production release.*
