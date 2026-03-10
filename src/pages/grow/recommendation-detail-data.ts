/**
 * Grow Engine — Recommendation Detail Data (RE-EXPORT SHIM)
 *
 * All entity data has been migrated to canonical.ts.
 * This file re-exports for backward compatibility.
 * Will be removed in Phase 4 when all Grow consumers migrate to canonical selectors directly.
 */

// Re-export types from canonical types.ts
export type {
  ExecutionType,
  UsageLevel,
  ChangeAction,
  Category,
  CurrentItem,
  RecommendedChange,
  MarketAlternative,
  ActionStep,
  RecommendationDetail,
  RecommendationListItem,
  ComparisonKind,
  RecommendationComparison,
} from '@/domain/poseidon-universe'

// Re-export data via canonical selectors
import {
  selectRecommendationDetails,
  selectRecommendationsSummary,
  selectRecommendationListItems,
} from '@/domain/poseidon-universe'

export const recommendationDetails = selectRecommendationDetails()
export const RECOMMENDATIONS_SUMMARY = selectRecommendationsSummary()
export const RECOMMENDATIONS_FOR_LIST = selectRecommendationListItems()
