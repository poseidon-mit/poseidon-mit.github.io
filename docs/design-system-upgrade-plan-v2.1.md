---
render_with_liquid: false
---
Poseidon.AI Design System Overhaul: Comprehensive Implementation Plan v2

Language note: All implementation (code, commits, PRs, component APIs, variable names) MUST be conducted in English. Japanese is used in this document solely for narrative context where beneficial.
Plan version: 2.1 (supersedes v1 and v2.0, incorporating all review feedback)
Total duration: ~19-21 weeks (7 phases, Phase 0 through Phase 6)


Table of Contents

Context and Scope
Decisions
Phase 0: Baseline Recovery
Phase 1: Foundation
Phase 2: Adaptive Hero System
Phase 3: Component API Redesign
Phase 4: Layout System
Phase 5: CSS Architecture
Phase 6: Governance and Documentation
Cross-Cutting Concerns
Risk Register
Critical File Index
Verification Protocol


Context and Scope
Problem Statement
Poseidon.AI has 44 total routes in src/router/lazyRoutes.ts (36 canonical + 8 compatibility aliases), served by 34 unique page files sharing two shell components:

CommandCenterShell (193 lines, 7 data-slot nodes): Imported by 9 page files (Dashboard, Landing, TrustSecurity, Pricing, Signup, Login, Recovery, Onboarding, NotFound)
EnginePageShell (44 lines, delegates to CommandCenterShell with layout="engine"): Imported by 25 page files (all engine sub-pages, Settings sub-pages, Help)


Terminology: "36 canonical routes" counts URL paths including 4 /onboarding/* sub-routes that map to a single Onboarding.tsx file. "34 unique page files" is the migration-relevant count used throughout this plan.

All pages are forced into CommandCenterShell's rigid slot structure (hero_message, proof_line, kpi_grid, primary_feed, decision_rail, govern_controls, transition_cue), producing visually identical layouts regardless of page function.
Additional structural debt:

CSS monolith: components.css (~60KB) + entry-flow.css (~79KB) = ~143KB raw / ~26.5KB gzip
Dual component registries: src/design-system/component-registry.ts (73 canonical) vs scripts/design-system-config.mjs (69 canonical) -- diverged, causing check:design-system failures
Screen contract coupling: src/contracts/screen-contracts-v4.ts defines requiredSlots / requiredWidgets for 36 screens (ScreenId union in screen-contract.ts line 5: "36 screens across 9 domains"); tests validate data-slot DOM nodes at runtime
Red test baseline: Multiple test files fail under current state, blocking CI-driven development
Theme duplication: src/shared/theme.ts (299 lines) duplicates CSS custom properties from src/styles/tokens.css

Route Inventory (36 canonical)
SectionRoutesShellCountPublic/, /trust, /pricingCommandCenterShell3Activation/signup, /login, /recovery, /onboarding/* (4 sub-routes)CommandCenterShell7Core/dashboard, /dashboard/alerts, /dashboard/insights, /dashboard/timeline, /dashboard/notificationsCCS / EPS5Protect/protect, /protect/alert-detail, /protect/disputeEnginePageShell3Grow/grow, /grow/scenarios, /grow/recommendationsEnginePageShell3Execute/execute, /execute/approval, /execute/historyEnginePageShell3Govern/govern, /govern/trust, /govern/audit, /govern/audit-detail, /govern/registry, /govern/oversight, /govern/policyEnginePageShell7Settings/settings, /settings/ai, /settings/integrations, /settings/rightsEnginePageShell4System/helpEnginePageShell1Total36

Decisions
DecisionChoiceRationaleMigration strategyAll pages, 4-wave rolloutFull scope (34 unique page files), phased by complexityCSS approachTailwind 4 + shadcn/ui + Radix UI + CVAType-safe variants, accessible primitives, Tailwind ecosystemCompound Component scopeAll major components (Shell, Card, Section, Form, Chart)Consistent API, composabilityMobile handlingSimultaneous desktop + mobileContainer Queries + responsive tokens from Phase 1Slot compatibilityPreserve all data-slot DOM nodes through migrationScreen contracts enforce runtime validationRegistry unificationSingle source of truth in component-registry.tsEliminate divergence with design-system-config.mjsNavigation targetAppNav (inside CommandCenterShell)TopNav/BottomNav are disabled for app routes (showTopNav={!isKnownRoute}, showBottomNav={false})

Phase 0: Baseline Recovery (1.5 weeks)
Objective
Establish a green CI baseline before any design system changes begin. No design system work proceeds until npm run test:run and npm run check:design-system both pass.
Step 0.1: Fix Failing Tests (M)
Current state: Multiple test files report failures. Verified file paths:

src/pages/__tests__/visual-system-all-pages.test.tsx -- validates 7 REQUIRED_SLOTS on 19 pages
src/design-system/__tests__/design-system-enforcement.test.ts -- runs npm run check:design-system
src/__tests__/flows/execute-approval.test.tsx -- validates data-slot="consent_scope"
src/__tests__/flows/rights-exercise.test.tsx -- tests export/delete with confirmation
src/__tests__/flows/govern-audit.test.tsx -- govern audit flow
src/__tests__/flows/protect-decision.test.tsx -- protect decision flow
src/pages/__tests__/DashboardInsights.test.tsx -- dashboard insights

Actions:

Run npm run test:run and capture full failure output
Categorize failures:

Slot assertion failures: Missing data-slot attributes → add missing slots to components
Contract validation failures: requiredSlots mismatch → update screen-contracts-v4.ts or component DOM
Design system check failures: Registry divergence → see Step 0.2


Fix each category, committing atomically per failure category
Run npm run test:run until all tests pass

Files to modify:

src/pages/__tests__/visual-system-all-pages.test.tsx
src/design-system/__tests__/design-system-enforcement.test.ts
src/__tests__/flows/execute-approval.test.tsx
src/__tests__/flows/rights-exercise.test.tsx
Various component files (to add missing data-slot attributes)
src/contracts/screen-contracts-v4.ts (if contracts are out of sync with 36-screen scope)

Step 0.2: Unify Dual Registries (M)
Current state: Two independent registries with divergent canonical lists:

src/design-system/component-registry.ts: 73 canonical, 1 compat, 4 legacy, 2 forbidden
scripts/design-system-config.mjs: 69 canonical, ACTIVE_PAGES (42), STYLE_EXCEPTION_FILES (8)

SSoT format decision: TypeScript (component-registry.ts) is the single source of truth.
Rationale:

App code and tests already import from component-registry.ts
TypeScript strict mode catches entry mismatches at compile time
Scripts need ESM-compatible data, solved by a JSON generation step

Architecture:

Authoritative source: src/design-system/component-registry.ts (hand-edited, typed)
Generated derivative: scripts/design-system-registry.gen.json (auto-generated, never hand-edited)
Script consumer: scripts/design-system-config.mjs reads from .gen.json instead of maintaining its own canonical list
CI guard: A pre-check script validates .gen.json is up-to-date with .ts; fails if stale

Actions:

Diff canonical lists between the two files; identify missing/extra entries
Reconcile all entries into component-registry.ts (the SSoT)
Add a build step: tsx scripts/generate-registry-json.ts that reads component-registry.ts and writes scripts/design-system-registry.gen.json
Refactor scripts/design-system-config.mjs to read from .gen.json for COMPONENT_REGISTRY; keep ACTIVE_PAGES, STYLE_EXCEPTION_FILES, TOKEN_HYGIENE_TARGET_PREFIXES in design-system-config.mjs (these are script-specific config, not registry data)
Update check-design-system-usage.mjs and check-design-token-hygiene.mjs imports accordingly
Add CI check: npm run check:registry-sync that verifies .gen.json matches .ts
Run npm run check:design-system:strict until passing

Files to modify:

src/design-system/component-registry.ts (SSoT, reconcile entries)
scripts/generate-registry-json.ts (NEW: generates .gen.json from .ts)
scripts/design-system-registry.gen.json (NEW: generated, gitignored or committed)
scripts/design-system-config.mjs (refactor: read registry from .gen.json)
scripts/check-design-system-usage.mjs (update imports)
scripts/check-design-token-hygiene.mjs (update imports if needed)
package.json (add check:registry-sync and generate:registry scripts)

Step 0.3: Establish Measurement Baselines (S)
Record all metrics before any design changes. These become the "before" snapshot for Phase 5 targets.
Actions:

Run npm run build and record:

CSS raw: Total CSS output size in bytes (uncompressed, minified)
CSS gzip: gzip -c dist/assets/*.css | wc -c
JS raw + gzip: Same for JS bundles


Run npm run test:run and record pass/fail counts
Run npm run check:design-system and record clean pass
Capture visual screenshots of all 36 canonical routes (Playwright or manual)
Store baselines in docs/baselines/phase-0-metrics.md

New files:

docs/baselines/phase-0-metrics.md

Phase Gate
CheckRequired Statusnpm run test:runAll pass (0 failures)npm run check:design-systemClean (0 violations)npm run buildSuccess (exit 0)Baseline metrics recordedYes
CRITICAL: No Phase 1 work begins until all Phase 0 gates pass.

Phase 1: Foundation (2 weeks)
Objective
Integrate shadcn/ui + Radix UI + CVA into the existing Vite + Tailwind 4 environment without breaking any existing functionality.
Step 1.1: Add Dependencies (S)
File: package.json
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select \
  @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-dropdown-menu \
  @radix-ui/react-slot cmdk

Note: shadcn/ui's Command component is built on cmdk (not @radix-ui/react-command, which does not exist as a standalone Radix primitive). The cmdk package internally uses Radix primitives.

Step 1.2: shadcn/ui Setup (M)
New files:

/src/lib/utils.ts -- cn() utility (clsx + tailwind-merge)
/components.json -- shadcn/ui config (style: "new-york", rsc: false, tsx: true)

Step 1.3: Radix UI Base Primitives (M)
New directory: /src/components/ui/
Create Radix-wrapped primitives with CVA variant definitions:

dialog.tsx, tabs.tsx, select.tsx, tooltip.tsx, popover.tsx, dropdown-menu.tsx, command.tsx (wraps cmdk), slot.tsx

Each primitive uses CVA for variant/size/tone definitions. Example pattern:

```tsx
// src/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dialogOverlayVariants = cva(
  "fixed inset-0 z-50 transition-opacity",
  {
    variants: {
      tone: {
        default: "bg-black/50 backdrop-blur-sm",
        dark: "bg-black/80 backdrop-blur-md",
      },
    },
    defaultVariants: { tone: "default" },
  }
);
```
Step 1.4: Token Architecture Harmonization (M)
New files:

/src/design-system/theme.ts -- Token Registry with metadata (replaces legacy src/theme.ts)
/src/design-system/variants.ts -- CVA color/tone mapping aligned with engine semantics from src/design-system/engine-semantic.ts

Modifications:

Merge src/theme.ts (43 lines, legacy) into src/shared/theme.ts (299 lines)
Delete src/theme.ts after merge
Update all imports referencing src/theme.ts

Step 1.5: Update Component Registry (S)
Add new canonical entries to src/design-system/component-registry.ts:

Status canonical: All new ui/* primitives
Ensure scripts/design-system-config.mjs derives correctly (per Phase 0 unification)

Phase Gate
CheckRequired Statusnpm run test:runAll passnpm run check:design-systemCleannpm run buildSuccessRadix Dialog/Tabs/Select render correctlyManual verificationCVA sample Button renders with correct variantsManual verificationcn() class merging worksUnit test

Phase 2: Adaptive Hero System (4 weeks)
Objective
Replace CommandCenterShell's fixed hero structure with a 5-variant PageShell Compound Component. Migrate all 34 unique page files across 4 waves.
Slot Compatibility Policy
CRITICAL: CommandCenterShell's 7 data-slot attribute nodes are validated by:

visual-system-all-pages.test.tsx -- checks REQUIRED_SLOTS on 19 pages
screen-contracts-v4.ts -- defines requiredSlots for 36 screens

Rule: PageShell MUST render all data-slot DOM nodes that the page's ScreenContract requires. The migration layer inside PageShell will:

Accept a contract prop with the screen's ScreenContract
Auto-inject any requiredSlots as placeholder DOM nodes if the page template omits them (development-only; logs a warning)
Validate at dev-time that all contract slots are satisfied

Slot content validation (mitigating "hollow pass" risk): Auto-injected empty data-slot nodes pass existence-only tests but mask missing content. To prevent this:

Slots with interactive semantics (consent_scope, action_preview, factors_dropdown, decision_rail) MUST be tested for non-empty content and operability, not merely DOM presence.
visual-system-all-pages.test.tsx will be extended with a INTERACTIVE_SLOTS set. For these slots, tests assert element.children.length > 0 or element.textContent.trim() !== ''.
execute-approval.test.tsx already validates consent_scope operability; similar assertions will be added for action_preview and factors_dropdown in their respective flow tests.
Auto-injection in production builds should emit a console.error (not silently pass) if a contract-required interactive slot has no content.

Every PR that modifies a page's shell MUST also update screen-contracts-v4.ts in the same PR if slot requirements change.
5 Hero Variants
VariantTarget PagesStructureKPI CountcommandDashboardKicker + Headline + ProofLine + ActionSlot + KPIGrid0-4focusedProtect, Grow (hub pages)Headline + SubheadLine + KPIGrid + EngineIcon4-6analyticalExecute, Govern (hub pages)Title + ChartThumbnail + StatSummary + KPIGrid2-4editorialSettings, Help, sub-pagesTitle + Description + optional CTA0-2minimalError, Empty, Auth, PublicTitle + optional description0
New File Structure
src/components/PageShell/
├── PageShell.tsx              -- Root Compound Component + PageShellContext
├── PageShellHero.tsx          -- Hero slot (variant dispatch)
├── PageShellKPIGrid.tsx       -- 0-6 card auto-layout grid
├── PageShellContent.tsx       -- PrimaryFeed + DecisionRail + SideRail slots
├── PageShellSlotGuard.tsx     -- Contract slot validation + auto-injection
├── variants/
│   ├── HeroCommand.tsx        -- Dashboard
│   ├── HeroFocused.tsx        -- Protect/Grow hubs
│   ├── HeroAnalytical.tsx     -- Execute/Govern hubs
│   ├── HeroEditorial.tsx      -- Settings/Help/sub-pages
│   └── HeroMinimal.tsx        -- Error/Empty/Auth/Public
├── __tests__/
│   └── PageShell.test.tsx     -- Slot contract validation tests
└── index.ts
PageShell Compound API

```tsx
<PageShell variant="focused" slug="protect" contract={protectContract}>
  <PageShell.Hero
    headline="Prevent loss before it compounds."
    proofLine=\{\{ claim: "...", evidence: "..." \}\}
  />
  <PageShell.KPIGrid kpis={kpis} />  {/* 4-6 cards, auto-layout */}
  <PageShell.PrimaryFeed>
    <AlertsHub />
  </PageShell.PrimaryFeed>
  <PageShell.DecisionRail>
    <RiskScoreDial />
  </PageShell.DecisionRail>
</PageShell>
```
KPI Auto-Layout Logic
CountLayout0Grid hidden1-2flex-row equal width33-column grid42x2 grid53+2 asymmetric63x2 grid
Navigation: AppNav (Not TopNav/BottomNav)
Context: App.tsx sets showTopNav={!isKnownRoute} and showBottomNav={false}. For all app routes, the actual navigation is AppNav (72 lines, 9 nav links), rendered inside CommandCenterShell.
Migration rule: PageShell MUST continue to render <AppNav /> in the same structural position. Navigation refactoring (if desired) is a separate initiative, not part of this plan.
4-Wave Page Migration
Wave A: Core Hub Pages (6 pages) -- Week 1-2
Highest-value, most visually differentiated pages. Validates all 5 hero variants.
Page FileRouteCurrent ShellTarget VariantDashboard.tsx (238 lines)/dashboardCommandCenterShellcommandProtect.tsx (314 lines)/protectEnginePageShellfocusedGrow.tsx (232 lines)/growEnginePageShellfocusedExecute.tsx (250 lines)/executeEnginePageShellanalyticalGovern.tsx (185 lines)/governEnginePageShellanalyticalSettings.tsx (100 lines)/settingsEnginePageShelleditorial
Wave B: Detail/Sub-pages (9 pages) -- Week 2-3
Engine sub-pages that inherit parent engine's visual identity.
Page FileRouteTarget VariantAlertsHub.tsx/dashboard/alertseditorialInsightsFeed.tsx/dashboard/insightseditorialActivityTimelinePage.tsx/dashboard/timelineeditorialNotifications.tsx/dashboard/notificationseditorialProtectAlertDetail.tsx/protect/alert-detaileditorialProtectDispute.tsx/protect/disputeeditorialGrowScenarios.tsx/grow/scenarioseditorialGrowRecommendations.tsx/grow/recommendationseditorialExecuteApproval.tsx/execute/approvaleditorial
Wave C: Operations/Admin (11 pages) -- Week 3-4
Govern sub-pages, Settings sub-pages, system pages.
Page FileRouteTarget VariantExecuteHistory.tsx/execute/historyeditorialGovernTrust.tsx/govern/trusteditorialGovernAuditLedger.tsx/govern/auditeditorialGovernAuditDetail.tsx/govern/audit-detaileditorialGovernRegistry.tsx/govern/registryeditorialGovernOversight.tsx/govern/oversighteditorialGovernPolicy.tsx/govern/policyeditorialSettingsAI.tsx/settings/aieditorialSettingsIntegrations.tsx/settings/integrationseditorialSettingsRights.tsx/settings/rightseditorialHelpSupport.tsx/helpeditorial
Wave D: Public/Auth (8 pages) -- Week 4
Public-facing and authentication pages with minimal shell needs.
Page FileRouteTarget VariantLanding.tsx/minimalTrustSecurity.tsx/trustminimalPricing.tsx/pricingminimalSignup.tsx/signupminimalLogin.tsx/loginminimalRecovery.tsx/recoveryminimalOnboarding.tsx/onboarding/*minimalNotFound.tsx(fallback)minimal
Deprecation Strategy

Implement PageShell + 5 variants in parallel (does not touch existing shells)
Create deprecation wrapper in CommandCenterShell.tsx that internally delegates to PageShell
Migrate pages wave-by-wave, each page switching from CommandCenterShell/EnginePageShell to PageShell directly
After Wave D: mark CommandCenterShell and EnginePageShell as deprecated in component registry
After Phase 3: mark as forbidden

Files Modified

/src/components/CommandCenterShell.tsx (193 lines) -- deprecation wrapper
/src/components/EnginePageShell.tsx (44 lines) -- deprecation wrapper
/src/contracts/screen-contracts-v4.ts (219 lines) -- update requiredSlots per page if needed
All 34 page files in /src/pages/ (see wave tables above)
/src/design-system/component-registry.ts -- add PageShell canonical, deprecate old shells
/src/components/index.ts -- add PageShell exports

Phase Gate
CheckRequired Statusnpm run test:runAll passnpm run check:design-systemCleannpm run buildSuccessAll 34 pages render with PageShellVisual verification (all routes)5 hero variants responsive (375px, 768px, 1024px, 1440px)Screenshot comparisonKPI auto-layout 0-6 cardsUnit testdata-slot attributes preserved for all contracted screensvisual-system-all-pages.test.tsx passesAppNav renders correctly in all app routesManual verification

Phase 3: Component API Redesign (5 weeks)
Objective
Redesign ~30 major components into Compound Component + CVA pattern. Migrate all usages.
Wave 1 (Week 1-2): Card Components (12)
New file: /src/components/Card/Card.tsx -- Base Card Compound Component
tsx<Card variant="alert" tone="critical">
  <Card.Header>
    <Card.Title>High-risk transaction</Card.Title>
    <Card.Badge>Critical</Card.Badge>
  </Card.Header>
  <Card.Body>
    <Card.Meta label="Detected" value="2m ago" />
    <Card.Evidence content="..." />
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost">Details</Button>
    <Button variant="primary">Approve</Button>
  </Card.Footer>
</Card>
CVA variants: variant (alert / insight / metric / action / audit / rule / control / stat / kpi / default), tone (critical / warning / primary / healthy / neutral)
Migration mapping:
Current ComponentNew APIThreatAlertCard<Card variant="alert">ActionQueueCard<Card variant="action">SubscriptionLeakCard<Card variant="insight">AuditLogCard<Card variant="audit">AutoSaveRuleCard<Card variant="rule">PrivacyControlCard<Card variant="control">WellnessCard<Card variant="metric">SavingsGoalCard<Card variant="metric">TrustIndexCard<Card variant="metric">StatCard<Card variant="stat">GlassCardRemoved; absorbed into Card systemKPIContractCard<Card variant="kpi">
Wave 2 (Week 2-3): Section/Layout Components (8)
New file: /src/components/Section/Section.tsx
tsx<Section>
  <Section.Header>
    <Section.Icon />
    <Section.Title>Threat alerts</Section.Title>
    <Section.Description>Sorted by severity.</Section.Description>
    <Section.Slot name="right">
      <MissionStatusChip tone="critical" label="5 pending" />
    </Section.Slot>
  </Section.Header>
  <Section.Content>{children}</Section.Content>
</Section>
Target components: MissionSectionHeader, MissionDataRows, MissionActionList, MissionMetricTiles, MissionEvidencePanel, EngineHealthStrip, ActivityTimeline, AlertsHub (internal structure)
Wave 3 (Week 3-4): Dialog/Form Components (10)
ComponentApproachDialogRadix Dialog wrapper (extend Phase 1 ui/dialog.tsx)DrawerNew (Radix Dialog + slide animation via CVA)BottomSheetRefactor to Radix-basedTextInputCVA variants + Radix primitivesSelectRadix Select wrapper with CVACheckboxCVA variants + Radix primitivesRadioCVA variants + Radix primitivesToggleCVA variants + Radix primitivesSearchBarRefactor with Radix Command integrationCommandPaletteRefactor with Radix Command
Wave 4 (Week 4-5): Chart/Visualization + Remaining (varies)

Chart wrapper components with CVA for tone/size
Remaining utility components (LoadingSpinner, NotificationToast, OfflineBanner, PWAInstallPrompt, etc.)
Full migration sweep: replace all old API usages across 34 pages

Compatibility Strategy

Create deprecation wrappers: old flat API internally delegates to new Compound API
console.warn with migration guide URL in development mode
Update component registry: old components → deprecated
Phase 5 completion: old API wrappers → forbidden
Phase 6: remove deprecated wrappers entirely

Phase Gate
CheckRequired Statusnpm run test:runAll passnpm run check:design-systemCleannpm run buildSuccessAll 30 components have Compound APICode reviewCVA variants are type-safe (TypeScript strict)tsc --noEmitDeprecation warnings fire for old API usageDev console verificationAll 34 pages use new APIsgrep for deprecated imports = 0

Phase 4: Layout System (2 weeks)
Objective
Implement responsive grid system, Container Queries, and responsive tokens.
Grid System
New file: /src/components/Grid/Grid.tsx
Props:

columns: 1 | 2 | 3 | 4 | "auto" (auto = auto-fit with minmax)
gap: "compact" (8px) | "normal" (16px) | "spacious" (24px)
responsive: { mobile: number, tablet: number, desktop: number }

Container Queries

Add @tailwindcss/container-queries plugin to tailwind.config.ts
Opt-in @container on Card, Section, PageShell content areas
Container breakpoints: xs (320px), sm (640px), md (800px), lg (1024px)
Required: @supports (container-type: inline-size) fallback for older browsers

Responsive Tokens
Extend /src/styles/tokens.css:
css:root {
  --page-padding: 12px;
  --section-gap: 12px;
  --card-padding: 12px;
}
@media (min-width: 640px) {
  :root { --page-padding: 16px; --section-gap: 16px; }
}
@media (min-width: 1024px) {
  :root { --page-padding: 24px; --section-gap: 20px; --card-padding: 16px; }
}
Navigation Responsive (AppNav)
Target: AppNav.tsx (72 lines) -- the actual navigation component for app routes.

Mobile (< 640px): Icon-only nav
Tablet (640-1023px): Icon + selected label
Desktop (>= 1024px): Full nav with labels

NOT in scope: TopNav / BottomNav (these are disabled for app routes per App.tsx logic and remain untouched).
Phase Gate
CheckRequired Statusnpm run test:runAll passnpm run buildSuccessGrid 1/2/3/4/auto-column layouts render correctlyVisual verificationContainer Queries resize Card/Section by container widthManual testAppNav responsive at 375px, 768px, 1024px, 1440pxScreenshot@supports fallback renders acceptably on older browsersManual test

Phase 5: CSS Architecture (2.5 weeks)
Objective
Decompose monolithic CSS into modular file structure. Achieve measurable bundle size reduction.
Bundle Size Targets
Measurement definition: Production build (npm run build), CSS output measured as:

Raw: wc -c dist/assets/*.css (uncompressed, minified by Vite/PostCSS)
Gzip: gzip -9 -c dist/assets/*.css | wc -c

MetricPhase 0 Baseline (approx)TargetReductionCSS raw~143.8 KB< 86 KB>= 40%CSS gzip~26.5 KB< 18 KB>= 30%JS raw delta0< +20 KBRadix UI overhead
Note: Exact baselines will be recorded in Phase 0. Targets are percentages of measured baseline, not absolute values.
New CSS Structure
src/styles/
├── index.css                 -- Import order management
├── system/
│   ├── tokens.css            -- All design tokens (extended with responsive)
│   ├── base.css              -- Reset + Aurora BG + animation keyframes
│   └── utilities.css         -- Custom Tailwind utilities
├── components/
│   ├── button.css
│   ├── card.css
│   ├── dialog.css
│   ├── section.css
│   ├── nav.css               -- AppNav styles
│   └── ...                   -- One file per component family
├── layouts/
│   ├── page-shell.css        -- PageShell + 5 hero variants
│   ├── app-shell.css
│   └── grid.css
└── pages/
    ├── dashboard.css
    ├── engine.css             -- Shared Protect/Grow/Execute/Govern
    ├── settings.css
    ├── auth.css               -- Login/Signup/Recovery/Onboarding
    └── public.css             -- Landing/Trust/Pricing
Decomposition Steps

Create src/styles/system/ structure, extract tokens and base reset
Create src/styles/utilities.css with shared Tailwind utilities
Decompose components.css (~60KB) → src/styles/components/*.css
Decompose entry-flow.css (~79KB) → src/styles/layouts/*.css + src/styles/pages/*.css
Convert hardcoded values in src/shared/theme.ts to CSS variable references
Rebuild src/styles/index.css import chain
Delete original monolith files after verification
Run Tailwind purge optimization, verify unused class removal

Files Modified/Deleted
FileActionsrc/styles/components.css (~60KB)Decompose, then deletesrc/styles/pages/entry-flow.css (~79KB)Decompose, then deletesrc/styles/index.cssRewrite import chainsrc/shared/theme.ts (299 lines)Convert to CSS variable reference utilitytailwind.config.tsAdd container queries plugin, purge optimizationsrc/styles/tokens.cssExtend with responsive + component-level tokens
Phase Gate
CheckRequired Statusnpm run test:runAll passnpm run check:design-systemCleannpm run buildSuccessCSS raw < 86KB (or 40% below Phase 0 baseline)wc -c measurementCSS gzip < 18KB (or 30% below Phase 0 baseline)gzip -c measurementAll 36 routes: no visual regressionPlaywright screenshot diffNo monolith CSS files remainFile system check

Phase 6: Governance and Documentation (2 weeks)
Objective
Establish automated guardrails, documentation, and Storybook to prevent design system regression.
ESLint Custom Plugin
New directory: /eslint-plugin-poseidon/
Rules:

no-deprecated-import: Error on importing deprecated or forbidden components from registry
no-inline-style: Error on style={} JSX props (whitelist via src/design-system/style-exceptions.ts)
no-hardcoded-color: Error on raw hex/rgb values outside of token files
compound-slot-validation: Warn on Compound Component usage missing required sub-components
single-registry-source: Error if design-system-config.mjs defines canonical entries not in component-registry.ts

Storybook
Step 6.1: Add Storybook Dependencies and Scripts (S)
Storybook is not currently installed. This step MUST execute first before any story files are created.
bashnpx storybook@latest init --builder vite --type react --skip-install
npm install -D @storybook/react @storybook/react-vite @storybook/addon-essentials \
  @storybook/addon-a11y @storybook/addon-interactions @storybook/test
Add to package.json scripts:
json"storybook": "storybook dev -p 6006",
"storybook:build": "storybook build -o storybook-static"
Step 6.2: Configure and Create Stories (L)
New files: /.storybook/main.ts, /.storybook/preview.ts, **/*.stories.tsx per component

All canonical components get a story
a11y addon (axe-core) integrated
Chromatic visual test integration (optional, CI-configurable)
Dark mode / engine theme toggles in Storybook toolbar

Documentation
FileContentdocs/design-tokens.mdToken reference with categories, values, usage examplesdocs/migration-guides/page-shell.mdCommandCenterShell/EnginePageShell → PageShell step-by-stepdocs/migration-guides/card.mdGlassCard / flat cards → Card Compound Componentdocs/migration-guides/slot-contracts.mdHow to update screen contracts when changing shellsdocs/.templates/component-checklist.mdNew component creation checklistdocs/baselines/phase-0-metrics.md(Created in Phase 0)
Component Registry Final Update
Update src/design-system/component-registry.ts:
StatusComponentscanonical (new)PageShell, Card (Compound), Section (Compound), Grid, all ui/* primitivesdeprecated → forbiddenCommandCenterShell, EnginePageShell, GlassCard, DashboardStats, EngineStatusCardforbiddenAll old flat API wrapper components
Remove all deprecation wrappers. Any remaining imports of forbidden components will cause ESLint errors.
Phase Gate
CheckRequired Statusnpm run test:runAll passnpm run check:design-systemCleannpm run buildSuccessESLint plugin catches deprecated importsTest with intentional violationStorybook builds and renders all canonical componentsnpm run storybook:buildAll migration guide docs reviewedPR reviewNo deprecated or forbidden imports remain in src/ESLint + grep verification

Cross-Cutting Concerns
Testing Strategy
LayerToolWhenScopeUnitVitest + Testing LibraryEvery PRIndividual componentsContractscreen-contracts-v4.ts validationEvery PR touching shells/pagesSlot/widget requirementsVisual RegressionPlaywright screenshot comparisonPhase Gate checksAll 36 routes at 4 breakpointsDesign Systemnpm run check:design-systemEvery PR (CI)Registry + token hygienea11yaxe-core (Storybook addon + CI)Phase Gate + StorybookAll canonical componentsBundlenpm run build + size measurementPhase Gate checksCSS + JS output
Performance Budget
MetricBudgetCSS raw (production build)< 86KB (or 40% below Phase 0 baseline)CSS gzip (production build)< 18KB (or 30% below Phase 0 baseline)JS bundle delta from Radix UI< +20KB rawComponent render time< 16ms (60fps)Lighthouse Performance score>= 80 (maintain or improve from baseline)
Accessibility (WCAG 2.1 AA)

Color contrast ratio >= 4.5:1 (text), >= 3:1 (large text, UI components)
Full keyboard navigation for all interactive components
ARIA labels + focus trap on Dialog/Drawer/BottomSheet (Radix provides)
Preserve colorblind-palettes.css (14KB, existing)
Screen reader testing for PageShell navigation flow

Browser Support
FeatureMinimumContainer QueriesChrome 105+, Safari 16+, Firefox 110+CSS Custom PropertiesAll modern browsersBackdrop Filter (glass morphism)Chrome 76+, Safari 9+, Firefox 103+
All Container Query usage MUST include @supports (container-type: inline-size) fallback.
Slot Compatibility Invariant
Throughout all phases, the following invariants MUST hold:
Invariant 1 (Existence):
  For every screen S in screen-contracts-v4.ts:
    For every slot in S.requiredSlots:
      The rendered DOM of route(S) contains a node with data-slot={slot}

Invariant 2 (Content, for interactive slots):
  For every slot in INTERACTIVE_SLOTS (consent_scope, action_preview, factors_dropdown, decision_rail):
    If slot is in S.requiredSlots:
      The data-slot node is non-empty and contains operable content
Violations of Invariant 1 will cause visual-system-all-pages.test.tsx to fail. Violations of Invariant 2 will cause the respective flow tests (execute-approval, protect-decision, etc.) to fail. Both block the Phase Gate.
Implementation rule: Any PR that changes a page's shell component MUST include corresponding updates to screen-contracts-v4.ts if slot structure changes. The PR description must explicitly state: "Screen contracts updated: [list of changed screens]" or "Screen contracts: no changes required."

Risk Register
RiskProbabilityImpactMitigationCSS decomposition causes visual regressionHIGHHIGHPlaywright visual tests from Phase 0; rollback branch per decomposition stepRadix UI increases JS bundle beyond budgetHIGHMEDIUMTree-shake verification with vite-bundle-visualizer; measure per-component deltaSlot contract violations during shell migrationHIGHHIGHPageShellSlotGuard auto-injection; contract-aware tests run on every PRAll-at-once migration causes page breakageMEDIUMHIGH4-wave rollout; each wave is independently deployable; deprecation wrapper fallbackDual registry re-diverges after Phase 0 unificationMEDIUMMEDIUMESLint rule single-registry-source (Phase 6); CI checkTeam unfamiliarity with Compound Component + CVA patternsMEDIUMMEDIUMWorkshop before Phase 3; Storybook examples; pair reviewsContainer Queries not supported on target browsersLOWMEDIUM@supports fallback mandatory; browser analytics check before Phase 4Slot auto-injection creates "hollow pass" (empty slots pass existence tests)MEDIUMHIGHINTERACTIVE_SLOTS content assertions; production console.error on empty interactive slotscheck:design-system regressions during migrationMEDIUMLOWRun in CI on every PR; Phase Gate blocks progression

Critical File Index
FileLinesPhasesOperationsrc/design-system/component-registry.ts1630, 1, 2, 3, 6SSoT unification, lifecycle updatesscripts/design-system-config.mjs1530Refactor to derive from component-registry.tssrc/contracts/screen-contracts-v4.ts2190, 2Fix baseline, update per shell migrationsrc/shared/theme.ts2991, 5Token merge, CSS variable reference conversionsrc/theme.ts431Merge into shared/theme.ts, deletesrc/styles/tokens.css200+4, 5Extend with responsive tokenssrc/components/CommandCenterShell.tsx1932Deprecation wrappersrc/components/EnginePageShell.tsx442Deprecation wrappersrc/components/AppNav.tsx722, 4Preserve in PageShell, responsive updatesrc/components/AppShell.tsx722Verify TopNav/BottomNav logic preservedsrc/App.tsx1002Verify route logic unchangedtailwind.config.ts1121, 4Plugin additionssrc/styles/components.css~60KB5Decompose, deletesrc/styles/pages/entry-flow.css~79KB5Decompose, deletesrc/styles/index.cssvaries5Rewrite import chainsrc/components/index.ts1082, 3, 6Export map updatessrc/design-system/engine-semantic.ts561, 3CVA variant alignmentsrc/design-system/style-exceptions.ts476ESLint whitelist sourcepackage.jsonvaries0, 1Dependencies, scriptsAll 34 page files in src/pages/varies2, 3PageShell migration, component API migrationscripts/generate-registry-json.tsNEW0Generate .gen.json from SSoTTest files: src/pages/__tests__/, src/design-system/__tests__/, src/__tests__/flows/, src/contracts/__tests__/, src/components/__tests__/varies0Fix failures

Verification Protocol
Per-PR Checks (CI)
bashnpm run test:run                    # All tests pass
npm run check:design-system         # Registry + token hygiene
npm run build                       # Production build succeeds
tsc --noEmit                        # TypeScript strict mode
Per-Phase Gate Checks
bash# 1. Full test suite
npm run test:run

# 2. Design system checks
npm run check:design-system

# 3. Production build
npm run build

# 4. Bundle size measurement (raw + gzip)
wc -c dist/assets/*.css
gzip -9 -c dist/assets/*.css | wc -c
wc -c dist/assets/*.js
gzip -9 -c dist/assets/*.js | wc -c

# 5. Visual regression (all 36 routes x 4 breakpoints)
# Playwright screenshot comparison against Phase 0 baselines

# 6. Accessibility
# axe-core scan on all routes (CI or manual)

# 7. Responsive verification
# Chrome DevTools: 375px, 768px, 1024px, 1440px
Phase Progression Rule
No phase may begin until the previous phase's gate checks ALL pass. If a gate check fails:

Root-cause the failure
Fix within the current phase
Re-run all gate checks
Only proceed when all checks are green


Timeline Summary
PhaseDurationKey DeliverablePhase 0: Baseline Recovery1.5 weeksGreen CI, unified registry, measurement baselinesPhase 1: Foundation2 weeksshadcn/ui + Radix + CVA integrated, token architecturePhase 2: Adaptive Hero System4 weeksPageShell (5 variants), 34 pages migrated in 4 wavesPhase 3: Component API Redesign5 weeks~30 components as Compound + CVA, all pages updatedPhase 4: Layout System2 weeksGrid, Container Queries, responsive tokens, AppNav responsivePhase 5: CSS Architecture2.5 weeksModular CSS, >= 40% raw size reductionPhase 6: Governance & Docs2 weeksESLint plugin, Storybook, migration guides, cleanupTotal~19-21 weeks

Plan v2.1 -- Incorporates v2.0 review feedback (8 items: cmdk dependency fix, route/file count separation, test path corrections, 36-screen contract scope, Storybook deps step, registry SSoT format decision, duration unification, slot hollow-pass mitigation). All implementation in English.
