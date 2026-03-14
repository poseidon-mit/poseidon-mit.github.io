// ─── Per-Screen Contract Definitions ──────────────────────────────────────────
// Derived from v3Screens.ts requires + articulation doc specs.
// Each screen maps to its specific required widgets and slots.

import { v3Screens } from '../data/v3Screens';
import type {
  InteractiveSlotPolicy,
  RequiredSlot,
  RequiredWidget,
  ScreenContract,
  ScreenId,
  MobileBehaviorContract,
} from './screen-contract';
import {
  ALL_UNIVERSAL_STATES,
  DEFAULT_MOBILE_BEHAVIOR,
  GOVERN_CONTRACT_WIDGETS,
} from './screen-contract';

// ─── Per-screen widget requirements ───────────────────────────────────────────

const SCREEN_WIDGETS: Record<ScreenId, RequiredWidget[]> = {
  // Public
  'S-V3-PUB01': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine'],
  'S-V3-PUB02': ['MissionSectionHeader', 'ProofLine'],
  'S-V3-PUB03': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine'],

  // Activation
  'S-V3-ACT01': ['MissionSectionHeader', 'ProofLine'],
  'S-V3-ACT02': ['MissionSectionHeader', 'ProofLine'],
  'S-V3-ACT03': ['MissionSectionHeader', 'ProofLine'],
  'S-V3-ACT04': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ConsentScopePanel'],
  'S-V3-ACT05': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine'],
  'S-V3-ACT06': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ConsentScopePanel'],
  'S-V3-ACT07': ['MissionSectionHeader', 'ProofLine'],

  // Core
  'S-V3-CORE01': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'DashboardCoordinationProof', 'ExplainableInsightPanel', 'DashboardInsightsPanel', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-CORE02': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'SignalRow', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-CORE03': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ExplainableInsightPanel', 'FactorsDropdown', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-CORE04': ['MissionSectionHeader', 'ProofLine', 'StatusTimeline'],
  'S-V3-CORE05': ['MissionSectionHeader', 'SignalRow'],

  // Protect
  'S-V3-PRT01': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'SignalRow', 'RiskScoreDial', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-PRT02': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ExplainableInsightPanel', 'FactorsDropdown', 'ActionOutcomePreview', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-PRT03': ['MissionSectionHeader', 'ProofLine', 'HumanReviewCTA', ...GOVERN_CONTRACT_WIDGETS],

  // Grow
  'S-V3-GRW01': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ForecastBandChart', 'KPIContractCard', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GRW02': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ScenarioControls', 'ActionOutcomePreview', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GRW03': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'RecommendationList', 'CategoryFilterBar', ...GOVERN_CONTRACT_WIDGETS],

  // Execute
  'S-V3-EXE01': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ActionQueueCard', 'ExplainableInsightPanel', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-EXE02': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ExplainableInsightPanel', 'FactorsDropdown', 'ConsentScopePanel', 'ActionOutcomePreview', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-EXE03': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'StatusTimeline', 'AuditLinkChip', ...GOVERN_CONTRACT_WIDGETS],

  // Govern
  'S-V3-GOV01': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'TrustIndexCard', 'KPIContractCard', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GOV02': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'AuditEntryList', 'StatusFilterBar', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GOV03': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ExplainableInsightPanel', 'FactorsDropdown', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GOV04': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GOV05': ['MissionSectionHeader', 'ProofLine', 'OversightQueueTable', ...GOVERN_CONTRACT_WIDGETS],
  'S-V3-GOV06': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'PolicyModelCards', ...GOVERN_CONTRACT_WIDGETS],

  // Settings
  'S-V3-SET01': ['MissionSectionHeader', 'ProofLine'],
  'S-V3-SET02': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine'],
  'S-V3-SET03': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine'],
  'S-V3-SET04': ['MissionSectionHeader', 'ProofLine', 'DefinitionLine', 'ConsentScopePanel'],

  // System
  'S-V3-SYS01': ['MissionSectionHeader', 'ProofLine', 'StatusTimeline'],
  'S-V3-SYS02': ['MissionSectionHeader'],
};

// ─── Per-screen slot requirements ─────────────────────────────────────────────

const SCREEN_SLOTS: Record<ScreenId, RequiredSlot[]> = {
  'S-V3-PUB01': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-PUB02': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-PUB03': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-ACT01': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-ACT02': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-ACT03': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-ACT04': ['hero_message', 'proof_line', 'consent_scope', 'transition_cue'],
  'S-V3-ACT05': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-ACT06': ['hero_message', 'proof_line', 'consent_scope', 'transition_cue'],
  'S-V3-ACT07': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-CORE01': ['hero_message', 'proof_line', 'coordination_hero', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-CORE02': ['hero_message', 'proof_line', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-CORE03': ['hero_message', 'proof_line', 'explainable_panel', 'factors_dropdown', 'govern_controls', 'transition_cue'],
  'S-V3-CORE04': ['hero_message', 'proof_line', 'primary_feed', 'transition_cue'],
  'S-V3-CORE05': ['hero_message', 'primary_feed', 'transition_cue'],
  'S-V3-PRT01': ['hero_message', 'proof_line', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-PRT02': ['hero_message', 'proof_line', 'explainable_panel', 'factors_dropdown', 'action_preview', 'decision_rail', 'govern_controls', 'transition_cue'],
  'S-V3-PRT03': ['hero_message', 'proof_line', 'decision_rail', 'govern_controls', 'transition_cue'],
  'S-V3-GRW01': ['hero_message', 'proof_line', 'kpi_grid', 'govern_controls', 'transition_cue'],
  'S-V3-GRW02': ['hero_message', 'proof_line', 'action_preview', 'govern_controls', 'transition_cue'],
  'S-V3-GRW03': ['hero_message', 'proof_line', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-EXE01': ['hero_message', 'proof_line', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-EXE02': ['hero_message', 'proof_line', 'explainable_panel', 'factors_dropdown', 'consent_scope', 'action_preview', 'decision_rail', 'govern_controls', 'transition_cue'],
  'S-V3-EXE03': ['hero_message', 'proof_line', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-GOV01': ['hero_message', 'proof_line', 'kpi_grid', 'govern_controls', 'transition_cue'],
  'S-V3-GOV02': ['hero_message', 'proof_line', 'primary_feed', 'govern_controls', 'transition_cue'],
  'S-V3-GOV03': ['hero_message', 'proof_line', 'explainable_panel', 'factors_dropdown', 'govern_controls', 'transition_cue'],
  'S-V3-GOV04': ['hero_message', 'proof_line', 'govern_controls', 'transition_cue'],
  'S-V3-GOV05': ['hero_message', 'proof_line', 'oversight_queue', 'govern_controls', 'transition_cue'],
  'S-V3-GOV06': ['hero_message', 'proof_line', 'govern_controls', 'transition_cue'],
  'S-V3-SET01': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-SET02': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-SET03': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-SET04': ['hero_message', 'proof_line', 'consent_scope', 'transition_cue'],
  'S-V3-SYS01': ['hero_message', 'proof_line', 'transition_cue'],
  'S-V3-SYS02': ['hero_message', 'transition_cue'],
};

// ─── Route transition targets ─────────────────────────────────────────────────

const TRANSITION_ROUTES: Record<ScreenId, string> = {
  'S-V3-PUB01': '/signup',
  'S-V3-PUB02': '/signup',
  'S-V3-PUB03': '/signup',
  'S-V3-ACT01': '/dashboard',
  'S-V3-ACT02': '/dashboard',
  'S-V3-ACT03': '/login',
  'S-V3-ACT04': '/dashboard',
  'S-V3-ACT05': '/dashboard',
  'S-V3-ACT06': '/dashboard',
  'S-V3-ACT07': '/dashboard',
  'S-V3-CORE01': '/protect',
  'S-V3-CORE02': '/protect/alert-detail',
  'S-V3-CORE03': '/execute',
  'S-V3-CORE04': '/govern/audit',
  'S-V3-CORE05': '/settings',
  'S-V3-PRT01': '/protect/alert-detail',
  'S-V3-PRT02': '/protect/dispute',
  'S-V3-PRT03': '/dashboard',
  'S-V3-GRW01': '/grow/scenarios',
  'S-V3-GRW02': '/grow/recommendations',
  'S-V3-GRW03': '/execute',
  'S-V3-EXE01': '/execute/approval',
  'S-V3-EXE02': '/execute/history',
  'S-V3-EXE03': '/govern/audit',
  'S-V3-GOV01': '/govern/audit',
  'S-V3-GOV02': '/govern/audit-detail',
  'S-V3-GOV03': '/govern/oversight',
  'S-V3-GOV04': '/govern/policy',
  'S-V3-GOV05': '/dashboard',
  'S-V3-GOV06': '/dashboard',
  'S-V3-SET01': '/settings',
  'S-V3-SET02': '/settings',
  'S-V3-SET03': '/settings',
  'S-V3-SET04': '/dashboard',
  'S-V3-SYS01': '/dashboard',
  'S-V3-SYS02': '/dashboard',
};

// ─── Mobile behavior overrides ────────────────────────────────────────────────

const BOTTOM_SHEET_SCREENS: Set<ScreenId> = new Set([
  'S-V3-PRT02', 'S-V3-EXE02', 'S-V3-GOV03',
]);

const SCREEN_INTERACTIVE_SLOT_POLICY: Partial<Record<ScreenId, InteractiveSlotPolicy[]>> = {
  'S-V3-ACT04': [{ slot: 'consent_scope', mustBeNonEmpty: true, minInteractiveChildren: 1 }],
  'S-V3-ACT06': [{ slot: 'consent_scope', mustBeNonEmpty: true, minInteractiveChildren: 1 }],
  'S-V3-PRT02': [
    { slot: 'explainable_panel', mustBeNonEmpty: true },
    { slot: 'factors_dropdown', mustBeNonEmpty: true, minInteractiveChildren: 1 },
    { slot: 'action_preview', mustBeNonEmpty: true, minInteractiveChildren: 1 },
    { slot: 'decision_rail', mustBeNonEmpty: true },
  ],
  'S-V3-EXE02': [
    { slot: 'explainable_panel', mustBeNonEmpty: true },
    { slot: 'factors_dropdown', mustBeNonEmpty: true, minInteractiveChildren: 1 },
    { slot: 'consent_scope', mustBeNonEmpty: true, minInteractiveChildren: 1 },
    { slot: 'action_preview', mustBeNonEmpty: true, minInteractiveChildren: 1 },
    { slot: 'decision_rail', mustBeNonEmpty: true },
  ],
  'S-V3-GOV03': [
    { slot: 'explainable_panel', mustBeNonEmpty: true },
    { slot: 'factors_dropdown', mustBeNonEmpty: true, minInteractiveChildren: 1 },
  ],
  'S-V3-SET04': [{ slot: 'consent_scope', mustBeNonEmpty: true, minInteractiveChildren: 1 }],
};

const DEMO_CRITICAL_SCREENS: Set<ScreenId> = new Set([
  'S-V3-PUB01',
  'S-V3-CORE01',
  'S-V3-PRT01',
  'S-V3-EXE01',
  'S-V3-GOV01',
  'S-V3-SET01',
]);

function inferNarrativeRole(screenId: ScreenId): NonNullable<ScreenContract['narrativeRole']> {
  if (screenId.startsWith('S-V3-PUB') || screenId.startsWith('S-V3-ACT')) return 'entry';
  if (screenId === 'S-V3-CORE01') return 'command';
  if (screenId.startsWith('S-V3-PRT') || screenId.startsWith('S-V3-GRW') || screenId.startsWith('S-V3-EXE')) {
    return 'decision';
  }
  if (screenId.startsWith('S-V3-GOV')) return 'audit';
  return 'settings';
}

function inferHeroIntent(screenId: ScreenId): NonNullable<ScreenContract['heroIntent']> {
  if (screenId === 'S-V3-CORE01') return 'command';
  if (screenId.startsWith('S-V3-PRT') || screenId.startsWith('S-V3-GRW')) return 'focused';
  if (screenId.startsWith('S-V3-EXE') || screenId.startsWith('S-V3-GOV')) return 'analytical';
  if (screenId.startsWith('S-V3-SET') || screenId === 'S-V3-SYS01') return 'editorial';
  return 'minimal';
}

// ─── Build contracts ──────────────────────────────────────────────────────────

const byId = new Map(v3Screens.map((s) => [s.id as ScreenId, s]));

function buildContract(screenId: ScreenId): ScreenContract {
  const source = byId.get(screenId);
  if (!source) {
    throw new Error(`Missing v3Screens entry for ${screenId}`);
  }

  const governRequired = source.requires.governContract;
  const widgets = SCREEN_WIDGETS[screenId] ?? ['MissionSectionHeader'];
  const slots = SCREEN_SLOTS[screenId] ?? ['hero_message', 'transition_cue'];

  const mobileBehavior: MobileBehaviorContract = {
    ...DEFAULT_MOBILE_BEHAVIOR,
    bottomSheetEnabled: BOTTOM_SHEET_SCREENS.has(screenId),
    disclosureDefault: source.densityContract.defaultDisclosure === 'summary-first' ? 'collapsed' : 'expanded',
  };

  return {
    id: screenId,
    oneScreenMessage: source.oneScreenMessage,
    transitionCue: source.transitionCue,
    transitionTo: TRANSITION_ROUTES[screenId],
    narrativeRole: inferNarrativeRole(screenId),
    heroIntent: inferHeroIntent(screenId),
    demoCritical: DEMO_CRITICAL_SCREENS.has(screenId),
    requiredSlots: slots,
    requiredWidgets: widgets,
    governRequired,
    density: {
      maxSummaryLinesDesktop: source.densityContract.maxVisibleBodyLinesDesktop,
      maxSummaryLinesMobile: source.densityContract.maxVisibleBodyLinesMobile,
      detailsDefault: source.densityContract.defaultDisclosure === 'summary-first' ? 'collapsed' : 'expanded',
    },
    mobileBehavior,
    interactiveSlotPolicy: SCREEN_INTERACTIVE_SLOT_POLICY[screenId],
    supportedStates: ALL_UNIVERSAL_STATES,
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const screenContractsV4: Record<ScreenId, ScreenContract> = Object.fromEntries(
  (Object.keys(SCREEN_WIDGETS) as ScreenId[]).map((id) => [id, buildContract(id)])
) as Record<ScreenId, ScreenContract>;

export function getScreenContractV4(screenId: ScreenId): ScreenContract {
  const contract = screenContractsV4[screenId];
  if (!contract) throw new Error(`No V4 contract for ${screenId}`);
  return contract;
}

export function getGovernRequiredScreens(): ScreenId[] {
  return (Object.keys(screenContractsV4) as ScreenId[]).filter(
    (id) => screenContractsV4[id].governRequired
  );
}
