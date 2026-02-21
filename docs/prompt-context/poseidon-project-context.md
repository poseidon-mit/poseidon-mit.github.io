# Poseidon.AI — Project Context for UI Polishing

> **Purpose**: Self-contained context block to prepend to any UI polishing prompt. Gives the AI full product, business, and technical awareness so it can review/improve all screens with narrative coherence.
>
> **Canonical Sources**: `remotion/src/shared/copy.ts` (slide text), `docs/narrative/master-poseidon-story.md` (full narrative), `src/contracts/rebuild-contracts.ts` (cross-page data contracts)
>
> **Last Updated**: 2026-02-21

---

## 1. Product Identity

**Poseidon** is an **AI-native personal finance platform** — not a budgeting app, not a dashboard, not a robo-advisor. It is the first platform where AI coordination across all financial accounts works as one unified, auditable system.

| | |
|---|---|
| **Tagline** | "The Trusted AI-Native Money Platform" |
| **Vision** | "Establish the trusted financial platform where AI coordination serves human financial wellbeing" |
| **Core Formula** | "Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve." |
| **Prototype URL** | https://poseidon-mit.com |
| **Context** | MIT Professional Education CTO Program — Capstone Final Presentation, March 19, 2026 |
| **Team** | Group 7: SF (Shinji Fujiwara, System Architecture), SB (Sean Beecroft, Fraud Models), MH (Michael Hinckley, EU AI Act), AK (Arun Kumar, Design System) |

### The Problem: The Coordination Gap

Data aggregation is solved. Coordination is not. Consumers manually integrate across 5+ financial apps. The cost:

- **$133/mo** — Subscription waste per active user (C+R Research, 2024)
- **$12.5B/yr** — Fraud and theft losses across US (FTC, 2024)
- **$12B/yr** — Overdraft and NSF fees (CFPB, 2021)

Mint's shutdown (March 2024) proved visibility alone doesn't retain users. The coordination layer is missing.

### Why Now (3 Converging Forces)

1. **Open Banking APIs** — PSD2/EU, UK Open Banking, US Section 1033, Japan standardizing
2. **AI Economics** — Inference costs dropping 10x annually (Epoch AI, 2025); multi-agent systems now viable
3. **Consumer Expectations** — Generational shift toward AI-native, proactive financial services

---

## 2. The Four Engines

### Architecture Principle
GOVERN sits **on top** of all other engines (not alongside them). The three operational engines (Protect, Grow, Execute) feed into Govern's audit trail. Cross-engine data flow: Protect signals → feed into Execute actions; Grow recommendations → route to Execute queue; all decisions → logged in Govern.

### Engine Reference

#### PROTECT — The Guardian (Green `#22C55E` / `--engine-protect`)
- **Purpose**: Real-time threat detection across all linked accounts
- **Capabilities**: Fraud detection (<100ms), subscription anomaly identification, transaction risk scoring, SHAP explainability
- **User Story**: "My bank flagged something — what happened?" User sees threat queue sorted by severity, clicks into THR-001 ($2,847, TechElectro Store, confidence 0.94), reads contributing factors, reviews timeline, can dispute or confirm
- **Key Data in UI**: Threat severity (Critical/High/Medium/Low), confidence scores, SHAP waterfall factors, evidence cards, timeline
- **Inter-engine Links**: Critical alerts appear in Dashboard activity feed; blocked transactions route to Execute queue

#### GROW — The Forecaster (Violet `#8B5CF6` / `--engine-grow`)
- **Purpose**: Financial trajectory forecasting and optimization recommendations
- **Capabilities**: Cash flow forecasting with confidence bands, goal tracking, AI-powered recommendations, what-if scenarios
- **User Story**: "How can I grow my savings?" User sees emergency fund progress (73%, $7,300/$10,000), explores 8 ranked AI recommendations (streaming consolidation $140/mo, 401k boost $180/mo, auto loan refi $95/mo, etc.), runs Conservative/Moderate/Aggressive scenarios
- **Key Data in UI**: Goal progress rings, 12-month forecast charts with median/low/high bands, recommendation cards with annual/monthly savings + confidence
- **Inter-engine Links**: Recommendations link to Execute for approval; goal data shared with Dashboard

#### EXECUTE — The Autopilot (Amber `#EAB308` / `--engine-execute`)
- **Purpose**: Human-approved automated execution of AI-recommended actions
- **Capabilities**: Prioritized action queue, consent-first approvals, impact analysis, reversible actions
- **User Story**: "What should I do right now?" User reviews 3 pending actions (portfolio rebalance $12,400, block wire $2,847, subscription cancel $140/mo), each with urgency badge, confidence %, time remaining. Approves/defers with consent checkbox
- **Key Data in UI**: Action queue with urgency (high/medium), confidence scores, impact projections (approved vs deferred), expiry timers, consent confirmation dialog
- **Inter-engine Links**: Receives actions from Protect (block wire) and Grow (rebalance, cancel); all approvals logged in Govern

#### GOVERN — The Transparency Engine (Blue `#3B82F6` / `--engine-govern`)
- **Purpose**: Audit trail, compliance enforcement, AI decision transparency
- **Capabilities**: Immutable decision ledger, SHAP explanations per decision, model version tracking, compliance flags (GDPR/ECOA/CCPA)
- **User Story**: "Can I trust what the AI decided?" User sees 1,247 decisions audited (96% verified, 55 pending, 3 flagged), searches the ledger, drills into individual decisions to see model name/version, top factors with SHAP contributions, compliance status, user feedback
- **Key Data in UI**: Audit stats, sortable/filterable ledger table, decision detail with model info + explanation + factors + compliance flags + data sources
- **Inter-engine Links**: Every action from Protect/Grow/Execute appears here; GovernFooter on every authenticated page links to audit

#### DASHBOARD — Command Center (Cyan `#00F0FF` / `--engine-dashboard`)
- **Purpose**: Unified overview and navigation hub
- **Key Data in UI**: System Confidence 0.92, Pending Actions 5, Compliance Score 96/100 (with sparklines), Activity feed with cross-engine action links
- **Inter-engine Links**: Activity feed items link to specific engine detail pages

---

## 3. Target Persona & B2C Tone

### Primary User
US consumer, age 25-45, digitally native, uses 5+ financial apps, frustrated by manual coordination across accounts. Not a financial expert. Wants AI to handle complexity but needs to understand and approve decisions.

### Tone Guidelines
- **Confident but not arrogant** — "Your finances, intelligently coordinated" not "We're the best"
- **Clear, not technical** — "contributing factors" not "SHAP values"; "AI analysis" not "ML model inference"
- **Empowering, not paternalistic** — "You decide" not "We recommend you should"
- **Professional but warm** — MIT audience sees it, but the product speaks to consumers

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

---

## 4. Demo Flow & QR Code Scenario

### Context
MIT presentation (March 19, 2026) distributes QR codes on Slide 9. Audience members — MIT Faculty, CTO program peers, industry professionals — scan and experience the prototype **self-guided** (`SELF_GUIDED_QR_MODE = true` in `src/main.tsx`). Every page must feel complete, polished, and narratively coherent.

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
The audience evaluates for:
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

## 7. Business Model (for Pricing/Settings UI)

### Pricing Tiers

| Tier | Price | Engines Included | Notes |
|------|-------|-----------------|-------|
| **Free** | $0 | Dashboard + Govern + Basic Protect | Acquisition funnel |
| **Plus** | $7.99/mo | Full Protect + Grow + Execute (limited) | 3.5% of free users upgrade |
| **Pro** | $19.99/mo | Full capability | 0.8% choose Pro + upgrades |

### Key Business Metrics (for UI display)
| Metric | Value | Context |
|--------|-------|---------|
| User Savings | $640/yr | What users save annually |
| Value/Cost Ratio | 6X | $640 saved / $96 paid (Plus) |
| Gross Margin | 87% | At scale |
| Operating Breakeven | Month 12 | On $25M total capital ($5M Seed + $20M Series A) |
| LTV/CAC Blended | 17x | Plus tier |
| LTV/CAC by Tier | 10x / 51x | Plus / Pro |
| AI + Infra Cost | $1.20/user/mo | Declining with scale |

### Market Opportunity
- **Total Market**: $7B (personal finance + AI advisory)
- **Target Segment**: $1.5B (AI-native money management)
- **3-Year Capture**: $25M (conservative 1.2% penetration)
- **Year 3 Target**: 2.2M MAU, 717K paying (33%), $8.0M MRR, 56% operating margin

---

## 8. Technical Constraints for UI Implementation

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

## 9. Canonical Sources & Known Caveats

### Source Hierarchy
1. **`src/contracts/rebuild-contracts.ts`** — Cross-page data contracts (CROSS_SCREEN_DATA_THREAD)
2. **`src/lib/engine-tokens.ts`** — Engine colors and CSS classes
3. **`remotion/src/shared/copy.ts`** — All slide text and presentation data
4. **`docs/narrative/master-poseidon-story.md`** — Full narrative (Version 5.0, 925 lines)
5. **`remotion/PRESENTATION_SCRIPT.md`** — 4-5 minute delivery script

### Known Number Discrepancies (in presentation materials)
| Topic | Discrepancy | Resolution for UI |
|-------|------------|-------------------|
| LTV/CAC | copy.ts slide07: "17x" (blended) vs slide11: "10x/51x" (per tier) | Use **17x** for summary metrics; **10x/51x** when showing tier breakdown |
| Breakeven | copy.ts slide08: "Mo 11" vs script + slide07FinModel: "Month 12" | Use **Month 12** |
| Gross Margin | copy.ts slide11: "73%/89%" (per tier) vs slide07FinModel: "87%" (blended) | Use **87%** for summary; **73%/89%** for tier detail |
| Protect Color | Presentation: Teal `#14B8A6` vs Web app: Green `#22C55E` | Use **web app value** (`#22C55E`) for all UI work |
| Tech Stack | master-poseidon-story.md line 552: "Next.js" | **Outdated** — the app uses **Vite 7**. Never import `next/*` |
| AI Cost | slide07FinModel: "$1.20/user/mo" vs slide11: "$2.00/user/month" | Use **$1.20/user/mo** (more recent) |

### Regulatory Framework (for Govern UI Copy)
| Regulation | Jurisdiction | Relevance |
|-----------|-------------|-----------|
| EU AI Act | EU (2024) | High-risk financial AI classification; explainability + audit trails required |
| GDPR Art. 22 | EU (2018) | Right not to be subject to automated decisions |
| US Section 1033 | US/CFPB (2024) | Consumer financial data rights |
| ECOA / Reg B | US (1974) | Fair lending; discrimination monitoring |
| Colorado SB 24-205 | US/CO (2024) | First US state AI governance law |
| SOC2 Type II | US | Security, availability, processing integrity |
| CCPA | US/CA (2020) | Consumer privacy rights |

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
