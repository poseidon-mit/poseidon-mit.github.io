/**
 * Poseidon Component Facades — Architecture B Expression Layer
 *
 * Shared UI components for the Poseidon design language.
 * Import from '@/components/poseidon' in engine pages and v0 adaptations.
 */

export { GovernFooter, type GovernFooterProps } from './govern-footer'
export { ProofLine, type ProofLineProps } from './proof-line'
export { NeonText, type NeonTextProps } from './neon-text'
export { ShapWaterfall, type ShapWaterfallProps, type ShapFactor } from './shap-waterfall'
export { ForecastBand, type ForecastBandProps, type ForecastPoint } from './forecast-band'
export { AuditChip, type AuditChipProps } from './audit-chip'

/* ── Shared sub-components (Phase 1 extraction) ── */
export { ConfidenceIndicator, type ConfidenceIndicatorProps } from './confidence-indicator'
export { SeverityBadge, type SeverityBadgeProps, type Severity } from './severity-badge'
export { PriorityBadge, type PriorityBadgeProps, type Priority } from './priority-badge'
export { StatusBadge, type StatusBadgeProps, type DecisionStatus } from './status-badge'
export { ViewModeToggle, type ViewModeToggleProps } from './view-mode-toggle'
export { BentoGrid, type BentoGridProps, BentoItem, type BentoItemProps } from './bento-grid'
export { CountUp, type CountUpProps } from './count-up'
export { Shimmer, type ShimmerProps } from './shimmer'

/* ── AI Credibility Layer (Phase 5) ── */
export { CitationCard, type CitationCardProps } from './citation-card'
export { ReasoningChain, type ReasoningChainProps } from './reasoning-chain'
export { MethodologyCard, type MethodologyCardProps } from './methodology-card'

/* ── Presentation Mode (Phase 7) ── */
export { AuroraPulse, type AuroraPulseProps } from './aurora-pulse'

/* ── Empty State ── */
export { EmptyState, type EmptyStateProps } from './empty-state'
