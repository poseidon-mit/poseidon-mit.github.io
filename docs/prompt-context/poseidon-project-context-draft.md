# Poseidon.AI — Project Context for UI Polishing (Draft v2)

> **Purpose**: Self-contained context block to prepend to any UI polishing prompt. Gives the AI full product, business, and technical awareness so it can review/improve all screens with narrative coherence.
>
> **Canonical Sources**: `remotion/src/shared/copy.ts` (slide text), `docs/narrative/master-poseidon-story.md` (full narrative), `src/contracts/rebuild-contracts.ts` (cross-page data contracts)
>
> **Last Updated**: 2026-02-24 — v2 refresh from Briefing Group7.docx + docs/ deep research

---

## 1. Product Identity

**Poseidon** is an **AI-native personal finance platform** — not a budgeting app, not a dashboard, not a robo-advisor. It is the first platform where AI coordination across all financial accounts works as one unified, auditable system. The root problem is not missing data — it is missing coordination. Each financial institution optimizes within its own boundary; the consumer becomes the manual integrator.

| | |
|---|---|
| **Tagline** | "The Trusted AI-Native Money Platform" |
| **Vision** | "Establish the trusted financial platform where AI coordination serves human financial wellbeing" |
| **Core Formula** | "Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve." |
| **Prototype URL** | https://poseidon-mit.com |
| **Context** | MIT Professional Education — Blended Professional Certificate Program, Chief Technology Officer |
| **Program Coordinator** | Claudio Aguilera |
| **Capstone Presentation** | March 19, 2026 — Group 7 |
| **Team** | SF: Shinji Fujiwara (US, Director — System Architecture) · SB: Sean Beecroft (CA, Managing Director — Fraud Models) · MH: Michael Hinckley (US, Sector Director — EU AI Act) · AK: Arun Kumar (US, Sr. Test Manager / Test Architect — Design System) |

### The Problem: The Coordination Gap

Data aggregation is solved. Coordination is not. Consumers manually integrate across 3–5 financial institutions. The coordination gap is not a data problem — it is an **architecture problem**.

**Observable harms (total: ~$24B/year):**

- **$133/mo** — Subscription and hidden cost waste per active user (C+R Research, 2024)
- **$12.5B/yr** — Fraud and theft losses across US consumers (FTC, 2024)
- **$12B/yr** — Overdraft and NSF fees (CFPB, 2021)

**Why Mint failed**: Mint shut down March 2024. Visibility alone does not drive coordination — showing data does not coordinate action. The lesson: the missing layer is not aggregation, it is the coordination + execution + governance layer.

**The structural root cause**: No single actor can reliably observe, attribute, and coordinate actions across a customer's full financial data in a timely manner. Fraud monitoring is institution-bound. Consumer insights remain descriptive. Holistic optimization requires formal advisory channels. Execution remains manual.

### Why Now (3 Converging Forces)

1. **Open Banking APIs** — PSD2/EU, UK Open Banking, US Section 1033, Japan standardizing. Consumer-authorized cross-institutional data access via API is now possible at scale.
2. **AI Economics** — Inference costs dropping 10x annually (Epoch AI, 2025); multi-agent + reasoning models now viable at consumer fintech scale
3. **Consumer Expectations** — Generational shift (Gen Z) toward AI-native, proactive, personalized financial services; 2025–2026 is the adoption window

---

## 2. The Four Engines

### Architecture Principle
GOVERN sits **on top** of all other engines (not alongside them). The three operational engines (Protect, Grow, Execute) feed into Govern's audit trail. Cross-engine data flow: Protect signals → feed into Execute actions; Grow recommendations → route to Execute queue; all decisions → logged in Govern. Every decision is immutable, versioned, and explainable.

**Architectural separation**: Deterministic models compute auditable outputs. GenAI only explains and orchestrates — never makes financial decisions alone.

---

### Engine Reference

#### PROTECT — The Guardian (Green `#22C55E` / `--engine-protect`)
- **Purpose**: Real-time threat detection across all linked accounts
- **AI Stack**: Isolation Forest anomaly detection + SHAP explainability
- **Performance**: Detects threats in <100ms · 99.7% accuracy on behavioral patterns
- **Capabilities**: Fraud detection, subscription anomaly identification, transaction risk scoring, SHAP contribution-factor explainability, human review + dispute workflow
- **User Story**: "My bank flagged something — what happened?" User sees threat queue sorted by severity, clicks into THR-001 ($2,847, TechElectro Store, confidence 0.94), reads contributing factors (location anomaly, category mismatch, time deviation), reviews timeline, can dispute or confirm
- **Key Data in UI**: Threat severity (Critical/High/Medium/Low), confidence scores, SHAP waterfall factors, evidence cards, timeline, Govern audit link
- **Inter-engine Links**: Critical alerts appear in Dashboard activity feed; blocked transactions route to Execute queue; all decisions logged in Govern

#### GROW — The Forecaster (Violet `#8B5CF6` / `--engine-grow`)
- **Purpose**: Financial trajectory forecasting and optimization recommendations
- **AI Stack**: Prophet time-series forecasting + RAG (Retrieval-Augmented Generation) for personalized portfolio advice
- **Capabilities**: 7-day predictive cash-flow forecasting with confidence bands, savings goal tracking, AI-powered ranked recommendations, what-if scenario modeling
- **User Story**: "How can I grow my savings?" User sees emergency fund progress (73%, $7,300/$10,000), explores 8 ranked AI recommendations (streaming consolidation $140/mo, 401k boost $180/mo, auto loan refi $95/mo, etc.), runs Conservative/Moderate/Aggressive scenarios
- **Key Data in UI**: Goal progress rings, 12-month forecast charts with median/low/high confidence bands, recommendation cards with annual/monthly savings + confidence
- **Inter-engine Links**: Recommendations link to Execute for approval; goal data shared with Dashboard

#### EXECUTE — The Autopilot (Amber `#EAB308` / `--engine-execute`)
- **Purpose**: Human-approved automated execution of AI-recommended actions
- **AI Stack**: AI Agents with automated audit logging; consent-first workflow; reversible actions with rollback coverage
- **Capabilities**: Prioritized action queue, consent-first approvals, impact analysis, reversible actions (every action undoable with full audit trail)
- **User Story**: "What should I do right now?" User reviews 3 pending actions (portfolio rebalance $12,400, block wire $2,847, subscription cancel $140/mo), each with urgency badge, confidence %, time remaining. Approves/defers with consent checkbox
- **Key Data in UI**: Action queue with urgency (high/medium), confidence scores, impact projections (approved vs deferred), expiry timers, consent confirmation dialog
- **Inter-engine Links**: Receives actions from Protect (block wire) and Grow (rebalance, cancel); all approvals logged in Govern

#### GOVERN — The Transparency Engine (Blue `#3B82F6` / `--engine-govern`)
- **Purpose**: Audit trail, compliance enforcement, AI decision transparency
- **Capabilities**: Immutable decision ledger (SHA-256 logged), SHAP explanations per decision, model version tracking, compliance flags (GDPR/ECOA/CCPA/EU AI Act)
- **MLOps/LLMOps**: MLOps monitors precision, recall, drift, and fairness; LLMOps enforces PII masking, prompt versioning, hallucination rate tracking
- **User Story**: "Can I trust what the AI decided?" User sees 1,247 decisions audited (96% verified, 55 pending, 3 flagged), searches the ledger, drills into individual decisions to see model name/version, top factors with SHAP contributions, compliance status, user feedback
- **Key Data in UI**: Audit stats, sortable/filterable ledger table, decision detail with model info + explanation + factors + compliance flags + data sources
- **Inter-engine Links**: Every action from Protect/Grow/Execute appears here; GovernFooter on every authenticated page links to audit

#### DASHBOARD — Command Center (Cyan `#00F0FF` / `--engine-dashboard`)
- **Purpose**: Unified overview and navigation hub — all four engines visible at a glance
- **Key Data in UI**: System Confidence 0.92, Pending Actions 5, Compliance Score 96/100 (with sparklines), Activity feed with cross-engine action links
- **Inter-engine Links**: Activity feed items link to specific engine detail pages

---

## 3. Target Persona & B2C Tone

### Primary User
US consumer, age 25–45, digitally native, uses 5+ financial apps, frustrated by manual coordination across accounts. Not a financial expert. Wants AI to handle complexity but needs to understand and approve decisions.

### Tone Guidelines
- **Confident but not arrogant** — "Your finances, intelligently coordinated" not "We're the best"
- **Clear, not technical** — "contributing factors" not "SHAP values"; "AI analysis" not "ML model inference"
- **Empowering, not paternalistic** — "You decide" not "We recommend you should"
- **Professional but warm** — MIT audience evaluates it, but the product speaks to consumers

### Language Rules for UI Copy
| Rule | Example |
|------|---------|
| Address user directly | "Your threat queue" not "User's threat queue" |
| Avoid ML jargon | "Why this was flagged" not "SHAP waterfall analysis" |
| Show confidence as % | "94% confidence" not "0.94 confidence" |
| Format currency | "$2,847" not "2847" or "$2847" |
| Use relative time in feeds | "2 hours ago" not "2026-02-21T14:30:00Z" |
| Active voice for actions | "Block wire transfer" not "Wire transfer to be blocked" |
| Governance language | "Every decision is auditable" not "We log everything" |
| Problem framing | "You are the integrator today" not "data is fragmented" |

---

## 4. Demo Flow & QR Code Scenario

### Context
MIT presentation (March 19, 2026) — 10 minutes total (7.5 min delivery + 2.5 min Q&A). Slide 9 (Epilogue) distributes QR codes. Audience — MIT Faculty, CTO program peers, industry professionals — scan and experience the prototype **self-guided** (`SELF_GUIDED_QR_MODE = true` in `src/main.tsx`). Every page must feel complete, polished, and narratively coherent.

### Golden Path (10 screens + sub-screens)

| Step | Route | What User Sees | Emotional Beat |
|------|-------|---------------|----------------|
| 1 | `/` | Landing hero, 4 engine value cards, CTA to sign in | "This looks serious and premium" |
| 2 | `/signup` | Profile initialization, security guarantees | "My data is safe" |
| 3 | `/onboarding` | 4 steps: Connect bank → Goals → Consent → Ready | "I'm in control of what the AI can do" |
| 4 | `/dashboard` | Command center, KPI stats, activity feed | "Everything at a glance" |
| 5 | `/protect` → `/protect/alert-detail` | Threat queue → THR-001 deep dive with SHAP | "The AI caught something real and explains why" |
| 6 | `/grow` → `/grow/recommendations` → `/grow/scenarios` | Growth plan → AI recommendations → what-if | "I can see how to improve and compare options" |
| 7 | `/execute` → `/execute/approval` | Action queue → approve/defer with consent | "I decide. The AI proposes, I approve" |
| 8 | `/govern` → `/govern/audit` → `/govern/audit-detail` | Audit overview → ledger → decision transparency | "Every AI decision is traceable and explainable" |
| 9 | `/settings` | Profile, notification preferences | "I can configure my experience" |
| 10 | `/dashboard/notifications` | 8 notifications across all engines | "The system keeps me informed" |

### Audience Evaluation Criteria
- **Completeness** — Does every screen have real, coherent content (no "lorem ipsum", no empty states)?
- **Consistency** — Do numbers/data match across screens (THR-001 = $2,847 everywhere)?
- **Narrative Coherence** — Does the flow tell a story (detect → explain → approve → audit)?
- **Visual Polish** — Glass morphism, engine colors, animations, responsive layout
- **Technical Sophistication** — SHAP explainability, confidence scores, governance audit trails
- **B2C Readiness** — Could a real consumer use this? Is the copy clear?

---

## 5. Cross-Page Data Contracts

These values are defined in `src/contracts/rebuild-contracts.ts` → `CROSS_SCREEN_DATA_THREAD` and consumed via `src/lib/demo-thread.ts`. They MUST be identical across all pages where they appear.

| Data Point | Canonical Value | Display Format | Owner Routes |
|-----------|----------------|---------------|-------------|
| System Confidence | `0.92` | `0.92` or `92%` | `/`, `/dashboard` |
| Decisions Audited | `1247` | `1,247` | `/`, `/govern`, `/govern/audit` |
| Critical Alert THR-001 | `{ id: 'THR-001', amount: 2847, merchant: 'TechElectro Store', confidence: 0.94, cardLast4: '4821', signalId: 'PRT-2026-0216-003' }` | `THR-001 · $2,847 · TechElectro Store · 0.94` | `/dashboard`, `/protect`, `/protect/alert-detail`, `/execute` |
| Compliance Score | `96` | `96/100` | `/dashboard`, `/protect/alert-detail`, `/govern`, `/govern/audit` |
| Pending Actions | `5` | `5 pending actions` | `/dashboard`, `/execute` |
| Monthly Savings | `847` | `$847/month` | `/dashboard`, `/execute`, `/execute/history` |
| Emergency Fund Progress | `{ percent: 73, current: 7300, target: 10000 }` | `73% · $7,300 / $10,000` | `/dashboard`, `/grow`, `/grow/goal`, `/grow/scenarios` |

**Rule**: If you modify any of these values, update ALL owner routes. The canonical source is `CROSS_SCREEN_DATA_THREAD` in `src/contracts/rebuild-contracts.ts`.

---

## 6. Competitive Positioning (for UI Copy Decisions)

### What Poseidon is NOT
- A budgeting app (Mint shut down March 2024 — proved aggregation alone isn't enough)
- A reactive dashboard (Monarch Money, Empower — show data after the fact)
- An investment-only robo-advisor (Wealthfront, Betterment — optimize investments but ignore broader picture)
- A single-capability tool (Rocket Money — subscription management only)
- Platform-locked (Apple Intelligence — limited to Apple ecosystem)

### What Poseidon IS
- The **first unified coordination platform** — 4 engines working as one auditable system
- **Governance-by-design** — compliance is the architecture, not an afterthought (GOVERN sits on top)
- **Hybrid AI** — deterministic compute (no hallucination in financial logic) + GenAI explain + agentic execute + human approve
- **B2C direct** — freemium funnel (Free → Plus $7.99/mo → Pro $19.99/mo)
- **Cross-institution, cross-platform** — not locked to any bank or ecosystem

### Differentiators (for "Beyond Aggregation" messaging)
| Capability | Traditional Fintech | Poseidon |
|-----------|-------------------|---------|
| Data Aggregation | Available | Available |
| Budgeting Tools | Available | Available |
| AI-Powered Insights | Limited | By design |
| Regulatory Compliance | Basic | Governance by design |
| Prediction & Recommendation | None | Personalized ML models |
| Natural Language Explanation | None | Low temperature + contribution factors |
| Consent-first Automation | None | Human-in-the-loop with auditability |

---

## 7. Business Model & Economics

### Pricing Tiers

| Tier | Price | Engines Included | Notes |
|------|-------|-----------------|-------|
| **Free** | $0 | Dashboard + Govern + Basic Protect | Acquisition funnel |
| **Plus** | $7.99/mo | Full Protect + Grow + Execute (limited) | 3.5% of free users upgrade |
| **Pro** | $19.99/mo | Full capability | 0.8% choose Pro + upgrades |

### Platform-Level Business Metrics (Combined Engines, at Scale)
| Metric | Value | Context |
|--------|-------|---------|
| User Savings | $640/yr | Annual value delivered to Plus user across all engines |
| Value/Cost Ratio | 6.7X | $640 saved / $96 paid (Plus) |
| Gross Margin | 87% | Blended at scale |
| AI + Infra Cost | $1.20/user/mo | Declining with scale |
| LTV/CAC Blended | 17x | Plus tier |
| LTV/CAC by Tier | 10x / 51x | Plus / Pro |
| Operating Breakeven | Month 11–12 | On $25M total capital ($5M Seed + $20M Series A) |

### Engine 1 (Protect) Unit Economics — At 100K Users
| Metric | Value | Notes |
|--------|-------|-------|
| Weighted avg savings | $235/user/year | Overdraft avoidance + subscription cleanup + fee prevention |
| Breakeven | ~9,000 users | Engine 1 standalone |
| Profit margin | 77% | Engine 1 at 100K users |
| Value-to-cost ratio | ~8x | At $10/month subscription reference |

> **Note**: Engine 1 economics ($235/user, 77% margin) represent Protect standalone at 100K users. Platform-level economics ($640/yr, 87% margin) reflect combined all-engine value at scale. Both figures are valid in their respective contexts.

### Market Opportunity
- **Total Market**: $7B (personal finance + AI advisory)
- **Target Segment**: $1.5B (AI-native money management)
- **3-Year Capture**: $25M (conservative 1.2% penetration)
- **Year 3 Target**: 2.2M MAU, 717K paying (33%), $96M annual revenue, 56% operating margin

### Financial Trajectory
| Milestone | Timing |
|-----------|--------|
| Seed capital | $5M, Month 0 |
| Series A trigger | Month 9, at $300K monthly revenue ($20M raise) |
| Operating breakeven | Month 11–12 |
| Cumulative payback | Month 16 |
| $96M ARR | Month 36 |

---

## 8. Phased Roadmap (Compliance-First)

### 3-Phase Delivery (from Briefing, Business-Facing)
| Phase | Timeline | Focus | Key Deliverables |
|-------|----------|-------|-----------------|
| **Phase 1** | Months 1–6 | Protect engine + US market launch | Isolation Forest + SHAP, GenAI explanation, OCC SR 11-7 / CCPA / GDPR compliance, MLOps/LLMOps foundation |
| **Phase 2** | Months 7–12 | Grow engine + Prophet forecasting | Prophet + RAG portfolio advisor, cash-flow forecasting, savings goal tracking |
| **Phase 3** | Months 13–18 | Execute engine + EU/UK expansion | AI Agent fee negotiation + subscription cancellation, PSD2 API integration, EU AI Act compliance |

### 4-Phase Technical Roadmap (Engineering Gates)
| Phase | Timeline | Gate Metrics | Milestones |
|-------|----------|-------------|------------|
| **Foundation** | 0–3mo | — | SOC2, privacy-by-design, AI ethics board, LLMOps/MLOps setup |
| **Automation** | 3–12mo | 70% precision | Execute POC, reversible actions, workflow dashboard |
| **Break-even** | 12–15mo | 277K users, 80% precision, 99.9% uptime | Operating breakeven, full EU AI Act compliance |
| **Scale** | 15+mo | 500K users, 90% precision, <5% FP rate | Geographic expansion, B2B/white-label |

### Key Risk Mitigations
| Risk | Mitigation |
|------|-----------|
| Model drift | MLOps monitoring: precision, recall, drift, fairness |
| LLM hallucination | LLMOps: PII masking, prompt versioning, hallucination rate tracking |
| Security threats | SOC2 Type II, bank-grade encryption, privacy-by-design |
| Regulatory compliance | OCC SR 11-7, CCPA, GDPR, EU AI Act, ECOA alignment |
| Bias | SHAP fairness attribution, continuous PDCA monitoring |

> **Overall residual risk**: Moderate — necessitates continuous monitoring and PDCA (Plan-Do-Check-Act)

---

## 9. Technical Constraints for UI Implementation

### Architecture Rules
| Rule | Detail |
|------|--------|
| Import alias | `@/` maps to `src/` — use for Dashboard; engine pages use relative imports |
| Motion presets | Only from `src/lib/motion-presets.ts` (fadeUp, staggerContainer, staggerItem, etc.) — no local motion definitions |
| Engine colors | Never hardcode hex — use `var(--engine-*)` CSS vars or `engineTokens[engine].*Class` from `src/lib/engine-tokens.ts` |
| GovernFooter | Every authenticated page: `<GovernFooter auditId={...} pageContext={...} />` |
| AuroraPulse | Every sub-page: `<AuroraPulse color="var(--engine-*)" intensity="subtle" />` |
| governance-meta.ts | New routes must have an entry in `src/lib/governance-meta.ts` |
| CSS layers | shadcn.css (Layer 1 — v0 compat) + poseidon.css (Layer 2 — engine extensions). No unlayered global selectors |
| Legacy ban | Never import from `src/legacy/` (135 archived components) or `src/design-system/` directly (use `src/components/poseidon/` facades) |
| v0 output | Preserve v0-generated layout/content as-is; apply only minimal adaptations (import fixes, path fixes, GovernFooter) |

### Component Locations
| Category | Path | Examples |
|----------|------|---------|
| shadcn/ui primitives | `src/components/ui/` | button, card, badge, dialog, command, tabs |
| Poseidon facades | `src/components/poseidon/` | GovernFooter, AuroraPulse, ShapWaterfall, ForecastBand, NeonText, SeverityBadge |
| Layout wrappers | `src/components/layout/` | AppNavShell, AuthShell, OnboardingShell, CommandPalette |
| Dashboard sub-components | `src/components/dashboard/` | HeroSection, KpiGrid, etc. |
| Design system (DO NOT import) | `src/design-system/` | 72 components — use facades instead |
| Legacy (NEVER import) | `src/legacy/` | 135 archived components |

### Engine Color System (Canonical — from `src/lib/engine-tokens.ts`)

| Engine | Hex | CSS Var | Neon Var | Text Class | BG Class |
|--------|-----|---------|----------|-----------|---------|
| Dashboard | `#00F0FF` | `--engine-dashboard` | `--neon-cyan` | `text-cyan-400` | `bg-cyan-500/10` |
| Protect | `#22C55E` | `--engine-protect` | `--neon-teal` | `text-green-400` | `bg-green-500/10` |
| Grow | `#8B5CF6` | `--engine-grow` | `--neon-violet` | `text-violet-400` | `bg-violet-500/10` |
| Execute | `#EAB308` | `--engine-execute` | `--neon-amber` | `text-amber-400` | `bg-amber-500/10` |
| Govern | `#3B82F6` | `--engine-govern` | `--neon-blue` | `text-blue-400` | `bg-blue-500/10` |

### CI Guards
- **Infra tests**: 9 tests in `src/__tests__/infra-integrity.test.ts` — must pass before commit
- **Run**: `npm run test -- --run src/__tests__/infra-integrity.test.ts`
- **What they check**: Router system imports, Tailwind CSS imports, no unlayered selectors, all Tier 1-2 routes registered, V0_READY_ROUTES validity, self-guided QR mode bootstrap, Govern audit links

### Tech Stack
- React 19 + TypeScript 5.9 + Vite 7 (NOT Next.js — Vite-only)
- Tailwind CSS 4.1 + shadcn/ui (new-york style)
- Framer Motion 12 + Recharts 3.7
- Radix UI primitives + class-variance-authority
- cmdk 1.1.1 (Cmd+K command palette)
- Deployed to GitHub Pages (SPA)

---

## 10. Regulatory Framework (for Govern UI Copy)

| Regulation | Jurisdiction | Relevance |
|-----------|-------------|-----------|
| **OCC SR 11-7** | US (OCC) | Model risk management — validation, documentation, ongoing monitoring of AI/ML models |
| **EU AI Act** | EU (2024) | High-risk financial AI classification; explainability + audit trails required |
| **GDPR Art. 22** | EU (2018) | Right not to be subject to automated decisions |
| **US Section 1033** | US/CFPB (2024) | Consumer financial data rights (Open Banking) |
| **ECOA / Reg B** | US (1974) | Fair lending; discrimination monitoring |
| **Colorado SB 24-205** | US/CO (2024) | First US state AI governance law |
| **SOC2 Type II** | US | Security, availability, processing integrity |
| **CCPA** | US/CA (2020) | Consumer privacy rights |

---

## 11. Canonical Sources & Known Caveats

### Source Hierarchy
1. **`src/contracts/rebuild-contracts.ts`** — Cross-page data contracts (CROSS_SCREEN_DATA_THREAD)
2. **`src/lib/engine-tokens.ts`** — Engine colors and CSS classes
3. **`remotion/src/shared/copy.ts`** — All slide text and presentation data
4. **`docs/narrative/master-poseidon-story.md`** — Full narrative (Version 5.0, 925 lines)
5. **`remotion/PRESENTATION_SCRIPT.md`** — 4-5 minute delivery script
6. **`tmp/Briefing Group7.docx`** — Official CTO program briefing document (authoritative for team info, Engine 1 economics, regulatory list)

### Known Number Discrepancies
| Topic | Figure A | Figure B | Resolution for UI |
|-------|----------|----------|-------------------|
| User savings | $235/user/yr (Briefing, Engine 1 only, 100K users) | $640/yr (copy.ts, combined all engines at scale) | Use **$235** when referencing Protect engine specifically; **$640** for platform-level summary |
| Value-to-cost ratio | ~8x (Briefing, $10/mo reference) | 6.7x (copy.ts, Plus $7.99/mo) | Use **6.7x** for Plus tier UI; **8x** in Briefing context |
| Gross margin | 77% (Briefing, Engine 1 at 100K) | 87% (copy.ts, platform blended at scale) | Use **87%** for summary metrics; **77%** for Engine 1 specifics |
| Operating breakeven | "Mo 11" (copy.ts slide08) | "Month 12" (script + slide07FinModel) | Use **Month 11–12** |
| LTV/CAC | 17x (blended, slide07) | 10x/51x (per tier, slide11) | Use **17x** for summary; **10x/51x** for tier breakdown |
| Protect Color | Teal `#14B8A6` (some presentation materials) | Green `#22C55E` (web app) | Use **`#22C55E`** for all UI work |
| Tech stack | "Next.js" (master-poseidon-story.md line 552) | Vite 7 (actual) | **Vite 7** — never import `next/*` |
| AI Cost | $1.20/user/mo (slide07FinModel) | $2.00/user/mo (slide11) | Use **$1.20/user/mo** (more recent) |

---

## Quick Reference: All Routes

### Public
| Route | Page | Demo Priority |
|-------|------|-------------|
| `/` | Landing | P0 |
| `/signup` | Sign Up | P0 |
| `/login` | Login | P0 |
| `/onboarding` | Onboarding (4 steps) | P0 |

### App Shell (Authenticated)
| Route | Page | Engine | Demo Priority |
|-------|------|--------|-------------|
| `/dashboard` | Dashboard | dashboard | P0 |
| `/dashboard/notifications` | Notifications | dashboard | P1 |
| `/protect` | Threat Overview | protect | P0 |
| `/protect/alert-detail` | Alert Investigation | protect | P0 |
| `/grow` | Growth Plan | grow | P0 |
| `/grow/goal` | Goal Detail | grow | P1 |
| `/grow/scenarios` | What-if Scenarios | grow | P1 |
| `/grow/recommendations` | AI Recommendations | grow | P1 |
| `/execute` | Approval Queue | execute | P0 |
| `/execute/approval` | Action Approval | execute | P0 |
| `/govern` | Governance Overview | govern | P0 |
| `/govern/audit` | Audit Ledger | govern | P0 |
| `/govern/audit-detail` | Decision Transparency | govern | P1 |
| `/settings` | Settings | dashboard | P2 |

### System
| Route | Page |
|-------|------|
| `/design-system` | Design System Explorer |
| `/design-system/tokens/*` | Token Documentation (colors, typography, spacing, motion) |
| `/design-system/components` | Component Inventory |
| `/404` | Not Found |
