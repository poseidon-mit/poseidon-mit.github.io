export type ComponentStatus = 'canonical' | 'compat' | 'legacy' | 'forbidden';

export interface DesignSystemRegistryEntry {
  name: string;
  status: ComponentStatus;
  replacement?: string;
  note?: string;
}

export interface DesignSystemRuleResult {
  rule: string;
  file: string;
  level: 'error' | 'warning';
  message: string;
}

const canonicalNames = [
  // -- ui/* Radix primitives (Phase 1) --
  'command',
  'dialog',
  'dropdown-menu',
  'popover',
  'select',
  'slot',
  'tabs',
  'tooltip',
  // -- Domain components --
  'ActionOutcomePreview',
  'AdaptiveCardGrid',
  'AIChatbot',
  'ActionQueueCard',
  'ActionQueueItem',
  'ActivityRail',
  'ActivityTimeline',
  'AlertsHub',
  'AppNav',
  'AppShell',
  'AuthShell',
  'AriaLiveAnnouncer',
  'AuditChip',
  'AuditLedgerTable',
  'AuditLinkChip',
  'AuditLogCard',
  'AutoSaveRuleCard',
  'BottomNav',
  'BottomSheet',
  'BootSplash',
  'Button',
  'Card',
  'CashFlowChart',
  'CategoryScoreBar',
  'ChatInput',
  'ChatMessage',
  'CommandPalette',
  'ConsentScopePanel',
  'ContributionChart',
  'DashboardInsightsPanel',
  'DataRightsPanel',
  'DefinitionLine',
  'EngineHealthStrip',
  'EngineIconBadge',
  'EngineTabs',
  'ErrorBoundary',
  'ExplainableInsightPanel',
  'FactorsDropdown',
  'FilterPanel',
  'ForecastBand',
  'ForecastBandChart',
  'FreshnessIndicator',
  'Grid',
  'GovernContractSet',
  'GovernFooter',
  'GovernVerifiedBadge',
  'FeatureSection',
  'Footer',
  'HumanReviewCTA',
  'jeton-config',
  'JetonLandingPage',
  'KPIContractCard',
  'LandingExperience',
  'LoadingSpinner',
  'MilestonesTimeline',
  'MissionActionList',
  'MissionDataRows',
  'MissionEmptyState',
  'MissionEvidencePanel',
  'MissionMetadataStrip',
  'MissionMetricTiles',
  'MissionSectionHeader',
  'MissionStatusChip',
  'MissionToggle',
  'EmptyState',
  'MobileDisclosure',
  'NetWorthHero',
  'NotificationToast',
  'OfflineBanner',
  'OnboardingShell',
  'OnboardingProgress',
  'OversightQueueTable',
  'PageShell',
  'PWAInstallPrompt',
  'PolicyModelCards',
  'PrivacyControlCard',
  'PriorityBadge',
  'ProofLine',
  'ReasoningChain',
  'RiskScoreDial',
  'SavingsGoalCard',
  'ScenarioControls',
  'ScoreRing',
  'ScenarioSimulator',
  'ScreenStateHandler',
  'Section',
  'SearchBar',
  'SettingsPanel',
  'SignalEvidenceDecisionCard',
  'SignalRow',
  'Skeleton',
  'Sparkline',
  'StatCard',
  'SubscriptionLeakCard',
  'SystemStatus',
  'ThreatAlertCard',
  'TransactionTable',
  'Toast',
  'TrustIndexCard',
  'TopNav',
  'UpdateNotification',
  'VoiceInput',
  'ViewModeToggle',
  'WellnessCard',
  'AuroraPulse',
  'BentoGrid',
  'BentoItem',
  'CitationCard',
  'ConfidenceIndicator',
  'CountUp',
  'DashboardGlance',
  'DecisionRail',
  'HeroSection',
  'KpiGrid',
  'MethodologyCard',
  'MenuOverlay',
  'ParticleWave',
  'PrimaryFeed',
  'SpotlightCard',
  'SeverityBadge',
  'ShapWaterfall',
  'StatusBadge',
  'useJetonWebGLEnabled',
] as const;

const compatEntries: Record<string, Pick<DesignSystemRegistryEntry, 'replacement' | 'note'>> = {
  // ExplainabilityPanel removed: it's a file-name alias, not a component name.
  // The canonical component exported from that file is ExplainableInsightPanel.
};

const legacyEntries: Record<string, Pick<DesignSystemRegistryEntry, 'replacement' | 'note'>> = {
  CommandCenterShell: {
    replacement: 'PageShell',
    note: 'Deprecated shell wrapper. Use PageShell variants directly.',
  },
  EnginePageShell: {
    replacement: 'PageShell',
    note: 'Deprecated engine shell wrapper. Use PageShell variants directly.',
  },
  DashboardStats: {
    replacement: 'MissionMetricTiles',
    note: 'Legacy dashboard summary card system.',
  },
  EngineStatusCard: {
    replacement: 'EngineHealthStrip',
    note: 'Legacy card-per-engine visual grammar.',
  },
  OnboardingStep: {
    replacement: 'Onboarding page shell sections',
    note: 'Legacy standalone onboarding surface.',
  },
};

const forbiddenEntries: Record<string, Pick<DesignSystemRegistryEntry, 'replacement' | 'note'>> = {
  ProtectV2Card: {
    replacement: 'Protect page canonical components',
    note: 'Deprecated V2 card archetype.',
  },
  LegacyHeroStrip: {
    replacement: 'CommandCenterShell hero contract',
    note: 'Deprecated standalone hero implementation.',
  },
  AppleGlassCard: {
    replacement: 'Surface',
    note: 'Deprecated temporary glass card component from spectacular.',
  },
  GlassCard: {
    replacement: 'Surface',
    note: 'Deprecated legacy glass card. Use Surface primitive.',
  },
  AppleSpringButton: {
    replacement: 'Button',
    note: 'Deprecated temporary spring button component from spectacular.',
  },
  DashboardShowcase: {
    replacement: 'Surface/Button + motion presets',
    note: 'Deprecated showcase wrapper from spectacular.',
  },
};

const entries: DesignSystemRegistryEntry[] = [
  ...canonicalNames.map((name) => ({ name, status: 'canonical' as const })),
  ...Object.entries(compatEntries).map(([name, meta]) => ({
    name,
    status: 'compat' as const,
    ...meta,
  })),
  ...Object.entries(legacyEntries).map(([name, meta]) => ({
    name,
    status: 'legacy' as const,
    ...meta,
  })),
  ...Object.entries(forbiddenEntries).map(([name, meta]) => ({
    name,
    status: 'forbidden' as const,
    ...meta,
  })),
];

export const DESIGN_SYSTEM_COMPONENT_REGISTRY = Object.freeze(
  Object.fromEntries(entries.map((entry) => [entry.name, entry])) as Record<
    string,
    DesignSystemRegistryEntry
  >,
);

export function getComponentRegistryEntry(name: string): DesignSystemRegistryEntry | undefined {
  return DESIGN_SYSTEM_COMPONENT_REGISTRY[name];
}

export function isLegacyOrForbiddenComponent(name: string): boolean {
  const entry = getComponentRegistryEntry(name);
  return entry?.status === 'legacy' || entry?.status === 'forbidden';
}
