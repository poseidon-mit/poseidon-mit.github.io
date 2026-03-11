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

/* ── Engine Chrome ── */
export { EngineBadge, type EngineBadgeProps } from './engine-badge'
export { KpiCard, type KpiCardProps } from './kpi-card'

/* ── Empty State ── */
export { EmptyState, type EmptyStateProps } from './empty-state'
export { PreviewBadge, type PreviewBadgeProps } from './preview-badge'

/* ── Data Display ── */
export { StatRow, type StatRowProps } from './stat-row'

/* ── Sub-page Navigation ── */
export { SubPageNav, type SubPageNavProps } from './sub-page-nav'

/* ── Cohort Fraud Trend ── */
export { CohortFraudTrend, type CohortFraudTrendProps } from './cohort-fraud-trend'

/* ── Hero Bento Layout ── */
export { HeroBento, type HeroBentoProps } from './hero-bento'
export { ListPortalBar, type ListPortalBarProps, type PortalDestination } from './list-portal-bar'
export { ListHeroBanner, type ListHeroBannerProps, type ListHeroBannerStat } from './list-hero-banner'
export { CostOfInaction, type CostOfInactionProps } from './cost-of-inaction'

/* ── Priority Spotlight ── */
export { PrioritySpotlight, type PrioritySpotlightProps } from './priority-spotlight'

/* ── Protect Hero ── */
export { ProtectAnomalyRadar, type ProtectAnomalyRadarProps, ProtectThreatPosture, type ProtectThreatPostureProps } from './protect-hero'

/* ── Grow Hero ── */
export { GrowHero, GrowGrowthAdvantage, type GrowHeroProps, type GrowGrowthAdvantageProps } from './grow-hero'

/* ── Dashboard Hero ── */
export { DashboardHero, type DashboardHeroProps } from './dashboard-hero'

/* ── Execute Hero ── */
export { ExecuteHero, ExecuteApprovalCommandDeck, type ExecuteHeroProps, type ExecuteApprovalCommandDeckProps } from './execute-hero'

/* ── Govern Hero ── */
export { GovernHero, GovernImmutableLedger, type GovernHeroProps, type GovernImmutableLedgerProps } from './govern-hero'

/* ── Settings Hero ── */
export { SettingsControlCenter, type SettingsControlCenterProps } from './settings-hero'

/* ── Cross-Engine Traceability ── */
export { CrossEngineTrail, type CrossEngineTrailProps } from './cross-engine-trail'

/* ── Decision Council UI Primitives ── */
export { ProofChips, type ProofChipsProps, type ProofPart } from './proof-chips'
export { SlideToApprove, type SlideToApproveProps } from './slide-to-approve'
export { ExportButton, type ExportButtonProps, type ExportFormat } from './export-button'

/* ── Decrypt Text Animation ── */
export { DecryptText, type DecryptTextProps } from './decrypt-text'
