# Landing Copy Audit

## Scope

- Live route: `/` via `src/pages/Landing.tsx`
- Rendered copy sources:
  - `src/pages/Landing.tsx`
  - `src/content/landing-copy.ts`
  - `src/content/trust-policies.ts`
  - `src/components/landing/jeton/MenuOverlay.tsx`
  - `src/components/landing/jeton/Footer.tsx`
- Excluded from this audit:
  - Alternate landing implementations not mounted at `/` such as `LandingV3`, `LovableLanding`, `LandingPreviewNew`, and `components/landing-v2/*`

## Current Live Copy Inventory

### Non-visual and navigation copy

| Area | Current copy | Source |
| --- | --- | --- |
| Document title | `Welcome to Poseidon` | `src/pages/Landing.tsx:28` |
| Skip link | `Skip to content` | `src/pages/Landing.tsx:66-71` |
| Nav brand aria-label | `Poseidon home` | `src/components/landing/jeton/MenuOverlay.tsx:18-25` |
| Nav brand text | `POSEIDON` | `src/components/landing/jeton/MenuOverlay.tsx:18-25` |
| Nav CTA | `Open Prototype` | `src/components/landing/jeton/MenuOverlay.tsx:27-36` |

### Hero

| Area | Current copy | Source |
| --- | --- | --- |
| Badge | `MIT CTO Program Group7` | `src/content/landing-copy.ts:12` and `src/pages/Landing.tsx:106-109` |
| Headline line 1 | `Your Money. One Brain.` | `src/pages/Landing.tsx:111-116` |
| Headline line 2 | `Always Your Call.` | `src/pages/Landing.tsx:111-116` |
| Subtitle | `Four AI engines compute, explain, and stage actions — nothing moves until you approve.` | `src/content/landing-copy.ts:15` and `src/pages/Landing.tsx:119-121` |
| Primary CTA | `Open Prototype` | `src/content/landing-copy.ts:16` and `src/pages/Landing.tsx:123-130` |
| Secondary CTA | `Watch Film` | `src/pages/Landing.tsx:132-140` |
| Trust bar item 1 | `Read-only bank connections` | `src/content/trust-policies.ts:6` and `src/pages/Landing.tsx:150-157` |
| Trust bar item 2 | `SOC 2 Type II` | `src/content/trust-policies.ts:7` and `src/pages/Landing.tsx:150-157` |
| Trust bar item 3 | `AES-256 encrypted` | `src/content/trust-policies.ts:8` and `src/pages/Landing.tsx:150-157` |
| Trust bar item 4 | `LLM zero-retention` | `src/content/trust-policies.ts:9` and `src/pages/Landing.tsx:150-157` |

### Engine showcase

| Area | Current copy | Source |
| --- | --- | --- |
| Section title | `Cinematic HUD` | `src/pages/Landing.tsx:174-179` |
| Section subtitle | `Four interlocking AI engines working in parallel. Real-time telemetry visualized as a unified horizontal console.` | `src/pages/Landing.tsx:177-179` |
| Card 1 | `Protect` / `Predictive fraud detection and multi-factor threat analysis.` / `99.9%` | `src/pages/Landing.tsx:20-25` and `src/pages/Landing.tsx:381-384` |
| Card 2 | `Grow` / `Continuous yield optimization and rate monitoring.` / `98.2%` | `src/pages/Landing.tsx:20-25` and `src/pages/Landing.tsx:381-384` |
| Card 3 | `Execute` / `Staged transactions requiring human authorization.` / `100%` | `src/pages/Landing.tsx:20-25` and `src/pages/Landing.tsx:381-384` |
| Card 4 | `Govern` / `Immutable audit logs and compliance tracking.` / `100%` | `src/pages/Landing.tsx:20-25` and `src/pages/Landing.tsx:381-384` |

### Trust and explainability section

| Area | Current copy | Source |
| --- | --- | --- |
| Section title | `The Glass Vault` | `src/pages/Landing.tsx:227-232` |
| Section subtitle | `Absolute transparency in how your data is handled. Every recommendation is traceable, every action is reversible. Data sovereignty as a physical dimension.` | `src/pages/Landing.tsx:230-232` |
| Feature 1 | `End-to-End Encryption` / `Secure enclave computation.` | `src/pages/Landing.tsx:235-245` |
| Feature 2 | `Explainable AI` / `Every model decision is documented.` | `src/pages/Landing.tsx:235-245` |
| Feature 3 | `Immutable Audit` / `Cryptographically verifiable logs.` | `src/pages/Landing.tsx:235-245` |
| Hover tooltip | `Traceability Active` | `src/pages/Landing.tsx:425-428` |

### Final CTA

| Area | Current copy | Source |
| --- | --- | --- |
| Headline line 1 | `Experience` | `src/pages/Landing.tsx:302-307` |
| Headline line 2 | `the Prototype.` | `src/pages/Landing.tsx:302-307` |
| Subtitle | `Interactive demonstration with simulated data. Explore the harmony of Protect, Grow, Execute, and Govern.` | `src/pages/Landing.tsx:310-312` |
| CTA button | `OPEN PROTOTYPE` | `src/pages/Landing.tsx:477-483` |
| Proof point 1 | `No real data required` | `src/pages/Landing.tsx:317-320` |
| Proof point 2 | `Full capability access` | `src/pages/Landing.tsx:317-320` |

### Footer

| Area | Current copy | Source |
| --- | --- | --- |
| Footer meta | `MIT Sloan CTO Program · Group 7 · 2026` | `src/components/landing/jeton/Footer.tsx:7-9` |
| Footer link 1 | `Trust` | `src/components/landing/jeton/Footer.tsx:10-13` |
| Footer link 2 | `Pricing` | `src/components/landing/jeton/Footer.tsx:14-16` |
| Footer link 3 | `Contact` | `src/components/landing/jeton/Footer.tsx:17-19` |

## Defined In `LANDING_COPY` But Not Rendered On `/`

### Unused hero fields

- `hero.titleA = "Your Money. One Brain."`
- `hero.titleB = "Always Your Call."`
- `hero.secondaryCta = "Deck"`
- `hero.protectProof.sublabel = "Evidence: merchant pattern, amount deviation, timing anomaly"`
- `hero.growProof.sublabel = "Projected 3-year advantage for your finances"`

### Entire unused sections

- `gap.title = "The coordination gap is real."`
- `gap.subtitle = "Your money is spread across apps that don't talk to each other."`
- `gap.stats`
  - `$12.5B` / `Lost to fraud annually in the US` / `FTC, 2024`
  - `$5,328` / `Average annual savings left on the table per household` / `McKinsey, 2024`
  - `37%` / `Of fraud alerts are false positives` / `Aite-Novarica, 2024`
- `architecture.title = "Human-centered AI architecture."`
- `architecture.subtitle = "Four steps. You stay in control."`
- `architecture.steps`
  - `Models Compute` / `Specialized AI models analyze your spending, savings, and risk in real time.`
  - `Council Deliberates` / `Multiple models challenge each other — disagreements are surfaced, not hidden.`
  - `Agents Prepare` / `Autonomous agents stage actions — nothing executes without your authorization.`
  - `You Authorize` / `Approve with a tap for important actions, full audit trail and rollback window.`
- `engines.title = "Four Engines. One Balance Sheet."`
- `cta.title = "The interactive prototype runs on simulated data. Explore all four engines in under a minute."`
- `cta.button = "Launch Dashboard"`
- `institutional.label = "Academic Affiliation"`
- `institutional.program = "MIT Professional Education — CTO Program Capstone"`
- `institutional.cohort = "2026 MAR · Group 7"`

## Review

### 1. Source-of-truth drift is the main problem

The landing copy is split across inline JSX, `LANDING_COPY`, trust constants, nav/footer components, and duplicated hero strings. Because of that, there is no single canonical copy object for the live page. The biggest issue is not a single bad sentence; it is copy governance drift.

### 2. The hero is memorable but underspecified

`Your Money. One Brain. Always Your Call.` has strong rhythm and premium feel, but it does not tell a first-time visitor what Poseidon is. The subtitle does the explanatory work alone, so the headline reads more like a brand film title than a landing-page value proposition.

### 3. Visual metaphors are overpowering user outcomes

`Cinematic HUD` and `The Glass Vault` are visually aligned with the page aesthetic, but they are weak information scents. They describe the art direction more than the user benefit. A visitor should be able to skim headings and understand protection, growth, approvals, and auditability without decoding metaphors.

### 4. CTA language is inconsistent and not tiered

The page uses `Open Prototype`, `Watch Film`, and `OPEN PROTOTYPE`. The intent hierarchy is not explicit. The primary conversion path is clear, but the label casing and repeated wording make the CTA system feel assembled rather than authored.

### 5. Trust language is strong but disconnected from proof

The trust bar is the most concrete copy on the page. It is also isolated. The rest of the landing page does not translate those claims into understandable customer value such as "nothing executes without approval", "audit coverage is complete", or "no retained prompts".

### 6. Engine descriptions explain functions, not outcomes

The engine cards currently describe system capabilities. They do not clearly answer "what does this do for me?" The current wording is precise enough for internal teams, but not persuasive enough for an external landing page.

### 7. The trust section is accurate but too abstract

`Data sovereignty as a physical dimension.` sounds cinematic, but it is not concrete. The section already has a strong truth base: traceability, reversibility, auditability, encryption. The copy should cash that out in plain language.

### 8. The final CTA undersells urgency

`Explore the harmony of Protect, Grow, Execute, and Govern.` is poetic but low-friction in the wrong way. The page needs a sharper final reason to click now, especially because the product is a prototype on simulated data.

### 9. Dormant copy should either be reactivated or deleted

The unused `gap`, `architecture`, `cta`, and `institutional` fields are better structured than some of the live inline copy, but they are currently dead weight. The next rewrite should decide whether those fields become the canonical landing schema or get removed.

## Rewrite Direction

- Keep the tone premium, calm, and controlled.
- Make the first screen legible to a new visitor in under five seconds.
- Favor user outcomes over cinematic metaphors.
- Preserve trust claims only when they are concretely supported by repo truths.
- Treat MIT affiliation as context, not endorsement.
- Keep the current information architecture unless the user explicitly asks for a redesign.
- If the code stays repo-safe, preserve the trust-bar claims exactly as they are today:
  - `Read-only bank connections`
  - `SOC 2 Type II`
  - `AES-256 encrypted`
  - `LLM zero-retention`
