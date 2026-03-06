// ─── Screen IDs ───────────────────────────────────────────────────────────────
// Generated from v3Screens.ts — 36 screens across 9 domains.
// DO NOT manually add partial unions. All 36 must be present.

export type ScreenId =
  // Public (3)
  | 'S-V3-PUB01'
  | 'S-V3-PUB02'
  | 'S-V3-PUB03'
  // Activation (7)
  | 'S-V3-ACT01'
  | 'S-V3-ACT02'
  | 'S-V3-ACT03'
  | 'S-V3-ACT04'
  | 'S-V3-ACT05'
  | 'S-V3-ACT06'
  | 'S-V3-ACT07'
  // Core (5)
  | 'S-V3-CORE01'
  | 'S-V3-CORE02'
  | 'S-V3-CORE03'
  | 'S-V3-CORE04'
  | 'S-V3-CORE05'
  // Protect (3)
  | 'S-V3-PRT01'
  | 'S-V3-PRT02'
  | 'S-V3-PRT03'
  // Grow (3)
  | 'S-V3-GRW01'
  | 'S-V3-GRW02'
  | 'S-V3-GRW03'
  // Execute (3)
  | 'S-V3-EXE01'
  | 'S-V3-EXE02'
  | 'S-V3-EXE03'
  // Govern (6)
  | 'S-V3-GOV01'
  | 'S-V3-GOV02'
  | 'S-V3-GOV03'
  | 'S-V3-GOV04'
  | 'S-V3-GOV05'
  | 'S-V3-GOV06'
  // Settings (4)
  | 'S-V3-SET01'
  | 'S-V3-SET02'
  | 'S-V3-SET03'
  | 'S-V3-SET04'
  // System (2)
  | 'S-V3-SYS01'
  | 'S-V3-SYS02';

export const ALL_SCREEN_IDS: ScreenId[] = [
  'S-V3-PUB01','S-V3-PUB02','S-V3-PUB03',
  'S-V3-ACT01','S-V3-ACT02','S-V3-ACT03','S-V3-ACT04','S-V3-ACT05','S-V3-ACT06','S-V3-ACT07',
  'S-V3-CORE01','S-V3-CORE02','S-V3-CORE03','S-V3-CORE04','S-V3-CORE05',
  'S-V3-PRT01','S-V3-PRT02','S-V3-PRT03',
  'S-V3-GRW01','S-V3-GRW02','S-V3-GRW03',
  'S-V3-EXE01','S-V3-EXE02','S-V3-EXE03',
  'S-V3-GOV01','S-V3-GOV02','S-V3-GOV03','S-V3-GOV04','S-V3-GOV05','S-V3-GOV06',
  'S-V3-SET01','S-V3-SET02','S-V3-SET03','S-V3-SET04',
  'S-V3-SYS01','S-V3-SYS02',
];

// ─── Route slugs ──────────────────────────────────────────────────────────────

export type RouteScreenSlug =
  | 'landing'
  | 'trust'
  | 'pricing'
  | 'signup'
  | 'login'
  | 'recovery'
  | 'onboarding'
  | 'onboarding-connect'
  | 'onboarding-goals'
  | 'onboarding-consent'
  | 'onboarding-complete'
  | 'dashboard'
  | 'alerts-hub'
  | 'insights-feed'
  | 'activity-timeline'
  | 'notifications'
  | 'protect'
  | 'protect-alert-detail'
  | 'protect-dispute'
  | 'grow'
  | 'grow-scenarios'
  | 'grow-recommendations'
  | 'execute'
  | 'execute-approval'
  | 'execute-history'
  | 'govern'
  | 'govern-trust'
  | 'govern-audit'
  | 'govern-audit-detail'
  | 'govern-registry'
  | 'govern-oversight'
  | 'govern-policy'
  | 'settings'
  | 'settings-ai'
  | 'settings-integrations'
  | 'settings-rights'
  | 'help'
  | 'not-found';

export type CoreScreenSlug = Extract<
  RouteScreenSlug,
  'dashboard' | 'protect' | 'grow' | 'execute' | 'govern' | 'settings'
>;

// ─── Required Slots ───────────────────────────────────────────────────────────

export type RequiredSlot =
  | 'hero_message'
  | 'proof_line'
  | 'kpi_grid'
  | 'coordination_hero'
  | 'primary_feed'
  | 'decision_rail'
  | 'govern_controls'
  | 'transition_cue'
  | 'explainable_panel'
  | 'consent_scope'
  | 'action_preview'
  | 'factors_dropdown'
  | 'audit_table'
  | 'oversight_queue';

// ─── Required Widgets ─────────────────────────────────────────────────────────

export type RequiredWidget =
  // Foundation
  | 'ProofLine'
  | 'DefinitionLine'
  | 'MissionSectionHeader'
  | 'MissionStatusChip'
  | 'MissionActionList'
  | 'MissionMetadataStrip'
  | 'EngineIconBadge'
  // Dashboard
  | 'DashboardInsightsPanel'
  | 'KPIContractCard'
  | 'DashboardCoordinationProof'
  // Governance
  | 'GovernVerifiedBadge'
  | 'AuditLinkChip'
  | 'HumanReviewCTA'
  | 'GovernContractSet'
  // Explainability
  | 'ExplainableInsightPanel'
  | 'FactorsDropdown'
  | 'ActionOutcomePreview'
  | 'ConsentScopePanel'
  // Data display
  | 'SignalRow'
  | 'RiskScoreDial'
  | 'ForecastBandChart'
  | 'ScenarioControls'
  | 'ActionQueueCard'
  | 'StatusTimeline'
  | 'TrustIndexCard'
  | 'AuditLedgerTable'
  | 'OversightQueueTable'
  | 'PolicyModelCards'
  | 'DataRightsPanel';

// ─── Screen Contract ──────────────────────────────────────────────────────────

export type UniversalScreenState =
  | 'loading'
  | 'empty'
  | 'partial'
  | 'error-recoverable'
  | 'error-permission'
  | 'success';

export interface MobileBehaviorContract {
  touchTargetMin: number;
  inputFontMin: number;
  disclosureDefault: 'collapsed' | 'expanded';
  bottomSheetEnabled: boolean;
}

export interface InteractiveSlotPolicy {
  slot: RequiredSlot;
  mustBeNonEmpty: boolean;
  minInteractiveChildren?: number;
}

export interface ScreenContract {
  id: ScreenId;
  oneScreenMessage: string;
  transitionCue: string;
  transitionTo: string;
  narrativeRole?: 'entry' | 'command' | 'decision' | 'audit' | 'settings';
  heroIntent?: 'command' | 'focused' | 'analytical' | 'editorial' | 'minimal';
  demoCritical?: boolean;
  requiredSlots: RequiredSlot[];
  requiredWidgets: RequiredWidget[];
  governRequired: boolean;
  density: {
    maxSummaryLinesDesktop: number;
    maxSummaryLinesMobile: number;
    detailsDefault: 'collapsed' | 'expanded';
  };
  mobileBehavior: MobileBehaviorContract;
  interactiveSlotPolicy?: InteractiveSlotPolicy[];
  supportedStates: UniversalScreenState[];
}

export const REQUIRED_SLOTS: RequiredSlot[] = [
  'hero_message',
  'proof_line',
  'kpi_grid',
  'coordination_hero',
  'primary_feed',
  'decision_rail',
  'govern_controls',
  'transition_cue',
];

export const GOVERN_CONTRACT_WIDGETS: RequiredWidget[] = [
  'GovernVerifiedBadge',
  'AuditLinkChip',
  'HumanReviewCTA',
];

export const ALL_UNIVERSAL_STATES: UniversalScreenState[] = [
  'loading',
  'empty',
  'partial',
  'error-recoverable',
  'error-permission',
  'success',
];

export const DEFAULT_MOBILE_BEHAVIOR: MobileBehaviorContract = {
  touchTargetMin: 44,
  inputFontMin: 16,
  disclosureDefault: 'collapsed',
  bottomSheetEnabled: false,
};
