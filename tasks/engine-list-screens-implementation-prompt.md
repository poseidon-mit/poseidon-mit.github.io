# Poseidon.AI Engine List Screens: Repo-Aware Implementation Prompt

Use the block below as the final copy-paste prompt for another AI agent. It is tailored for this repository and replaces the generic v0 assumptions with the actual routing, layout, motion, data, and test contracts used here.

```text
You are implementing a redesign for four existing React pages in a Vite + React + Tailwind + Framer Motion codebase.

Your job is to upgrade the presentation of the four list screens to a more premium "Cinematic Dark-Luxe" style while preserving this repository's architecture, routes, data sources, and existing behavior contracts.

Read the target files and their related tests first, then edit only the target files unless a tiny shared helper is absolutely necessary.

TARGET FILES
- src/pages/protect/ProtectThreats.tsx
- src/pages/GrowRecommendations.tsx
- src/pages/ExecuteQueue.tsx
- src/pages/GovernAuditLedger.tsx

READ THESE TESTS BEFORE EDITING
- src/__tests__/protect-threats.test.tsx
- src/__tests__/grow-recommendations.test.tsx
- src/__tests__/execute-deep-link.test.tsx
- src/__tests__/govern-audit-ledger.test.tsx
- src/__tests__/spotlight-mobile-navigation.test.tsx
- src/__tests__/infra-integrity.test.ts

DO NOT CHANGE THESE ARCHITECTURE RULES
- Do not create new routes, wrappers, or standalone v0 app files.
- Do not modify src/main.tsx, src/router/lazyRoutes.ts, src/styles/tailwind.css, or route registration.
- Do not import or render AuroraPulse, GovernFooter, AppNavShell, AuthenticatedLayout, or PageShell inside the target page files. Those are layout-owned in this repo.
- Do not import from src/legacy/ or src/design-system/ directly.
- Do not use next/* imports.
- Do not add "use client".
- Do not introduce new global CSS unless there is no clean local alternative.

ROUTER AND LINK CONTRACTS
- Use the internal router from "@/router".
- Preserve these exact route patterns:
  - /protect/alert-detail?alertId=
  - /grow/recommendation?id=GRW-...
  - /execute/approval?actionId=
  - /govern/audit-detail?decision=

ROOT PAGE CONTRACTS
- Keep id="main-content" and role="main" on each page root.
- Keep the overall page shape as a self-contained screen inside the existing app shell.
- Do not add horizontal scrolling at 375px width.

MOTION CONTRACTS
- Use useReducedMotionSafe().
- Use getMotionPreset() from "@/lib/motion-presets" instead of inventing a new motion system.
- Use stagger/fade-up entry only as enhancement.
- Reduced motion must render the same information hierarchy without animation.

DATA CONTRACTS
- Do not invent new mock data.
- Keep the current page-level data sources and derive UI from them:
  - Govern: selectGovernAuditEntries(), selectSpotlightAuditEntry()
  - Execute: useDemoState(), selectExecuteActionsView(), selectSpotlightAction()
  - Grow: RECOMMENDATIONS_FOR_LIST, selectSpotlightRecommendation()
  - Protect: THREATS, selectAccounts(), useDismissedAlerts()
- Do not rewrite canonical selectors or change domain data structures.

DESIGN DIRECTION
Use the "Focused Prism" layout across all four screens:
- A compact list hero/banner at the top
- One elevated spotlight card for the highest-priority item
- A vertical list of compressed rows/cards below
- Strong hierarchy, high density, low clutter

The look should feel:
- cinematic
- institutional
- dark-luxe
- glassy but precise
- premium without becoming noisy

VISUAL SYSTEM RULES
- Do not use flat solid boxes when a glass treatment is appropriate.
- Use subtle glass surfaces such as:
  - bg-white/[0.02]
  - border border-white/[0.04]
  - backdrop-blur-md
  - rounded-2xl
- Hover states should feel crisp, not floaty:
  - hover:bg-white/[0.04]
  - hover:border-white/[0.1]
  - transition-all duration-300
- Use engine-colored accents sparingly. One or two accent hotspots per screen is enough.
- Use engine CSS variables that actually exist in this repo:
  - var(--engine-protect)
  - var(--engine-grow)
  - var(--engine-execute)
  - var(--engine-govern)
- Prefer semantic colors for severity/state:
  - critical or flagged: var(--state-critical)
  - warning or pending: var(--state-warning)
  - healthy or verified: var(--state-healthy) when appropriate
- Do not rely on a fictional generic variable like var(--engine-color). It does not exist globally in this codebase.
- For complex gradients, glows, and shadows, prefer inline style with color-mix(...) when Tailwind arbitrary values would become brittle or invalid.

TYPOGRAPHY RULES
- Titles: high-contrast, compact, confident
- Numeric values and IDs: mono, tight tracking, tabular feeling
- Metadata labels: uppercase mono micro-labels
- Avoid generic soft gray typography everywhere. Important data needs crisp contrast.

SHARED LAYOUT GUIDANCE

Desktop:
- top banner with back link, engine label, title, subtitle, stats
- spotlight card under the banner
- remaining rows below in a dense but readable stack
- allow some rows to collapse into 2-column grids only when it improves scan speed

Mobile:
- single column
- spotlight card remains visually dominant
- metadata stacks vertically when needed
- no clipped badges, no overflow from long IDs, amounts, or counterparties
- every interactive chip/button/link should keep at least 44px target size

REUSE WHAT ALREADY EXISTS WHEN HELPFUL
- ListHeroBanner
- PrioritySpotlight
- EngineBadge
- existing shadcn/ui primitives from src/components/ui

If a tiny new helper is needed, prefer a local function inside the same page file rather than creating a new shared component.

PAGE-SPECIFIC BEHAVIOR TO PRESERVE

1. Govern / Audit Ledger
- Keep the page title and visible heading as "Audit Ledger".
- Keep the immutable, forensic, transparent feeling.
- Preserve the audit-detail deep link pattern with decision query string.
- Preserve the current search/filter capability.
- Records should continue showing engine/type information from real data.
- Spotlight should feel like the most anomalous or urgent audit event.

2. Execute / Queue
- Keep the page title concept as the approval queue.
- Preserve the empty state when all actions are already decided.
- Preserve the current deep link pattern into the approval page.
- The spotlight must remain the highest-priority pending action.
- The large amount is a key visual anchor.
- Keep the CTA label "Review & Approve" as the accessible action label.

3. Grow / Recommendations
- Preserve category filtering and sort behavior.
- Preserve recommendation links to /grow/recommendation?id=GRW-...
- Keep the CTA label "See opportunity" as the accessible action label.
- Spotlight should represent the highest-impact recommendation.
- Annual savings impact remains a major visual number.

4. Protect / Threats
- Preserve the sort controls with these labels:
  - Critical first
  - Highest confidence
  - Most recent
- Preserve threat links to /protect/alert-detail?alertId=
- Keep the CTA label "Investigate" as the accessible action label.
- Protect is special: use green for engine context and semantic red/amber for active threat severity. Do not paint the whole screen green.
- Spotlight should represent the most critical active threat.

SPOTLIGHT CARD CONTRACTS
- The spotlight card must be a full-card tappable link on mobile where applicable.
- Do not place nested <a> tags inside the spotlight card link.
- Make the spotlight feel materially richer than the list rows:
  - slightly stronger border
  - subtle engine gradient tint
  - restrained ambient glow
  - stronger data typography

ROW DESIGN CONTRACTS
- Each row should scan in this order:
  - leading accent or icon
  - title or ID
  - key metadata
  - status badge
  - action affordance
- A subtle left engine border is encouraged where it helps scanability.
- Rows can translate slightly on hover, but keep the movement subtle.

STATUS BADGE CONTRACTS
- Use vibrant translucent pill badges for status/severity/urgency.
- Keep badges compact and uppercase.
- Use semantic colors where possible.

ACCESSIBILITY AND TEST SAFETY
- Do not change accessible names that tests depend on unless you also update the tests.
- Preserve:
  - "Investigate"
  - "See opportunity"
  - "Review & Approve"
  - "Audit Ledger"
- Keep links and buttons discoverable by role.
- Do not hide the spotlight link on mobile.

IMPLEMENTATION STYLE
- Tailwind + Framer Motion + existing repo utilities only.
- Keep code readable and production-ready.
- Do not output pseudo-code.
- Do not output generic design commentary.
- Return complete updated source code for the edited files.

VERIFICATION
If you can run tests, run the relevant ones after editing:
- src/__tests__/protect-threats.test.tsx
- src/__tests__/grow-recommendations.test.tsx
- src/__tests__/execute-deep-link.test.tsx
- src/__tests__/govern-audit-ledger.test.tsx
- src/__tests__/spotlight-mobile-navigation.test.tsx
- src/__tests__/infra-integrity.test.ts

DESIGN GOAL SUMMARY
Deliver four pages that clearly belong to the same Poseidon family, but each still expresses its own engine personality:
- Govern: immutable, forensic, auditable
- Execute: high-stakes, kinetic, decisive
- Grow: generative, strategic, opportunity-led
- Protect: vigilant, severe, continuously scanning

Do not chase novelty at the expense of compile safety, route safety, accessibility, or repo conventions.
```
