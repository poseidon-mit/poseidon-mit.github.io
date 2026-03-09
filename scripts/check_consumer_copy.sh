#!/bin/bash
# check_consumer_copy.sh
# Verifies that no B2B technical or institutional copy has leaked into customer surfaces.

set -e

# Default behavior
DO_FAIL_CUSTOMER=false
DO_INFO_INTERNAL=false

for arg in "$@"; do
  case $arg in
    --fail-customer)
      DO_FAIL_CUSTOMER=true
      shift
      ;;
    --info-internal)
      DO_INFO_INTERNAL=true
      shift
      ;;
  esac
done

BANNED_REGEX="\bFinancial Health\b|\bVIP\b|\bAML\b|\bwire transfer\b|\bMargin account\b|\bAuto-Approve\b|\bBlock & Dispute\b|\bProtect Engine\b|\bGrow Engine\b|\bExecute Engine\b|\bGovern Engine\b|\bValidating\b|\bBroadcasting\b|\bEngine status\b|\bActivate engines\b|\bLLM data retention\b|\bno model training\b|\bDecision Reconstruction\b|\bOpt-out status\b"

# CSS utility class patterns to exclude (false positives from design system tokens)
CSS_CLASS_EXCLUDE="engine-text-|engine-bg-|engine-border-|engine-ring-"

CUSTOMER_FILES=(
  "src/pages/Dashboard.tsx"
  "src/pages/Landing.tsx"
  "src/pages/Signup.tsx"
  "src/pages/Login.tsx"
  "src/pages/Onboarding.tsx"
  "src/pages/OnboardingPriorities.tsx"
  "src/pages/OnboardingConsent.tsx"
  "src/pages/OnboardingActivate.tsx"
  "src/pages/Execute.tsx"
  "src/pages/ExecuteApproval.tsx"
  "src/pages/ExecuteHistory.tsx"
  "src/pages/ExecuteQueue.tsx"
  "src/pages/Govern.tsx"
  "src/pages/GovernAuditLedger.tsx"
  "src/pages/GovernAuditDetail.tsx"
  "src/pages/Grow.tsx"
  "src/pages/GrowRecommendations.tsx"
  "src/pages/grow/GrowRecommendationDetail.tsx"
  "src/pages/GrowGoalDetail.tsx"
  "src/pages/GrowScenarios.tsx"
  "src/pages/protect/Protect.tsx"
  "src/pages/protect/ProtectAlertDetail.tsx"
  "src/pages/protect/ProtectThreats.tsx"
  "src/pages/Notifications.tsx"
  "src/pages/Settings.tsx"
  "src/pages/SettingsIntegrations.tsx"
  "src/pages/SettingsRights.tsx"
  "src/pages/SettingsAI.tsx"
  "src/components/layout/AppNavShell.tsx"
  "src/components/layout/CommandPalette.tsx"
  "src/components/navigation/TopBar.tsx"
  "src/components/navigation/Sidebar.tsx"
  "src/components/ui/TalkToMoneyFab.tsx"
  "src/components/poseidon/govern-footer.tsx"
  "src/components/poseidon/dashboard-hero.tsx"
  "src/components/poseidon/page-skeleton.tsx"
  "src/components/poseidon/govern-hero.tsx"
  "src/components/poseidon/execute-hero.tsx"
  "src/components/poseidon/grow-hero.tsx"
  "src/components/poseidon/protect-hero.tsx"
  "src/lib/govern-trace.ts"
  "src/lib/governance-meta.ts"
  "src/lib/breadcrumb-registry.ts"
  "src/router/lazyRoutes.ts"
  "src/contracts/rebuild-contracts.ts"
  "src/content/landing-copy.ts"
  "src/features/talk-to-money/types.ts"
  "src/features/talk-to-money/route-context.ts"
  "src/features/talk-to-money/use-talk-to-money.ts"
  "src/features/talk-to-money/TalkToMoneyConversation.tsx"
  "src/features/talk-to-money/TalkToMoneyPanel.tsx"
  "src/features/talk-to-money/TalkToMoneySheet.tsx"
)

DEFERRED_FILES=(
  "src/pages/deck/Deck.tsx"
  "src/pages/orchestrator/Orchestrator.tsx"
  "src/pages/share/Share.tsx"
  "src/lib/decision-protocol.ts"
  "src/lib/govern-audit-data.ts"
  "src/domain/poseidon-universe/canonical.ts"
)

# 1. Customer Check
if [ "$DO_FAIL_CUSTOMER" = true ]; then
  echo "🕵️  Scanning customer surfaces for B2B leaks..."
  # Filter to only files that exist on disk
  EXISTING_FILES=()
  for f in "${CUSTOMER_FILES[@]}"; do
    [ -f "$f" ] && EXISTING_FILES+=("$f")
  done
  # Grep for banned terms, then exclude CSS class false positives
  CUSTOMER_HITS=$(grep -rnE -i "$BANNED_REGEX" "${EXISTING_FILES[@]}" | grep -v -E "$CSS_CLASS_EXCLUDE" || true)

  if [ -n "$CUSTOMER_HITS" ]; then
    echo "❌ FAILED: Found B2B remnants in customer surfaces!"
    echo "$CUSTOMER_HITS"
    exit 1
  else
    echo "✅ PASSED: No B2B leaks found in customer surfaces."
  fi
fi

# 2. Internal Check
if [ "$DO_INFO_INTERNAL" = true ]; then
  echo ""
  echo "ℹ️  Scanning deferred/internal surfaces (Informational Only)..."
  # Filter to only files that exist on disk
  EXISTING_DEFERRED=()
  for f in "${DEFERRED_FILES[@]}"; do
    [ -f "$f" ] && EXISTING_DEFERRED+=("$f")
  done
  if [ ${#EXISTING_DEFERRED[@]} -gt 0 ]; then
    INTERNAL_HITS=$(grep -rnE -i "$BANNED_REGEX" "${EXISTING_DEFERRED[@]}" 2>/dev/null || true)
  else
    INTERNAL_HITS=""
  fi

  if [ -n "$INTERNAL_HITS" ]; then
    echo "⚠️  INFO: Found B2B terminology in deferred surfaces (Expected):"
    echo "$INTERNAL_HITS"
  else
    echo "✅ PASSED: Outstanding. No B2B terminology in deferred surfaces either."
  fi
fi

exit 0
