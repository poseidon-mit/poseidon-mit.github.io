# Poseidon.AI Baseline Audit Document
**Date Generated:** March 2026
**Purpose:** Phase -1 Artifact. Proof of current-state discovery before implementation begins.

## Current In-Scope Routes (Customer Surfaces)
- `/` (`Landing.tsx`)
- `/signup` (`Signup.tsx`)
- `/login` (`Login.tsx`)
- `/onboarding` (`Onboarding.tsx`)
- `/onboarding/priorities` (`OnboardingPriorities.tsx`)
- `/onboarding/consent` (`OnboardingConsent.tsx`)
- `/onboarding/activate` (`OnboardingActivate.tsx`)
- `/dashboard` (`Dashboard.tsx`)
- `/execute` (`Execute.tsx`)
- `/execute/approval` (`ExecuteApproval.tsx`)
- `/execute/history` (`ExecuteHistory.tsx`)
- `/execute/queue` (`ExecuteQueue.tsx`)
- `/govern` (`Govern.tsx`)
- `/govern/audit` (`GovernAuditLedger.tsx`)
- `/govern/audit/[id]` (`GovernAuditDetail.tsx`)
- `/grow` (`Grow.tsx`)
- `/grow/recommendation` (`GrowRecommendations.tsx`)
- `/grow/recommendation/[id]` (`GrowRecommendationDetail.tsx`)
- `/grow/goal/[id]` (`GrowGoalDetail.tsx`)
- `/grow/scenarios` (`GrowScenarios.tsx`)
- `/protect` (`Protect.tsx`)
- `/protect/alert/[id]` (`ProtectAlertDetail.tsx`)
- `/protect/threats` (`ProtectThreats.tsx`)
- `/notifications` (`Notifications.tsx`)
- `/settings/rights` (`SettingsRights.tsx`)
- `/settings/ai` (`SettingsAI.tsx`)
- `/settings` (`Settings.tsx`)
- `/settings/integrations` (`SettingsIntegrations.tsx`)
- `/command-palette` (`CommandPalette.tsx`)

## Known Hidden Sub-Surfaces / Overlays that MUST be deleted
- `GuidedSetupDrawer.tsx` (Dashboard)
- `OnboardingArrivalSheet.tsx` (Dashboard)
- `GovernImmutableLedger` (Govern)
- `SettingsAIContent` stale AI-wrapper (SettingsAI)

## Known Route & Contract Mismatches (Phase -1 Blockers)
- `/protect/dispute` still defined in `rebuild-contracts.ts` (MUST DELETE)
- `/deck`, `/share`, `/orchestrator` still in `TARGET_SCOPE_READY_ROUTES` (MUST DEFER)
- `OnboardingRedirect` mapping in `target-scope-contracts.test.ts` (MUST MAP DIRECTLY)
- Agentic Signup incorrectly routing to `/dashboard` directly (MUST ROUTE TO `/onboarding`)

## High-Risk Stale B2B Strings Found
- "Protect Engine", "Grow Engine", "Execute Engine", "Govern Engine"
- "VIP", "AML", "Financial Health"
- "Margin account", "wire transfer"
- "Validating", "Broadcasting"
- "0 Auto-executions"
- "Auto-Approve" / "$50 Auto-Approve"
