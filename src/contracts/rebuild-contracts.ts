import type { EngineName } from '@/lib/engine-tokens';

export type ScreenType = 'public' | 'auth' | 'onboarding' | 'app' | 'design-system' | 'system';
export type NavType = 'public-topbar' | 'app-shell' | 'onboarding-shell' | 'system-shell' | 'none';
export type RouteIntent = 'monitor' | 'investigate' | 'approve' | 'audit' | 'configure';
export type NavGroup = 'public' | 'core' | 'engine' | 'settings';
export type CognitiveLoad = 'low' | 'medium' | 'high';
export type ReadyScope = 'target16' | 'deferred' | 'internal';
export type AudienceProfile = 'mit-faculty' | 'cto-peer' | 'industry-evaluator';
export type DemoScenario = 'wow-30s' | 'engine-proof-120s' | 'activation-90s';
export type PromptTier = 'A' | 'B' | 'C';
export type SectionMapLayout = 'full' | 'two-col' | 'grid';
export type CrossThreadKey =
  | 'system_confidence'
  | 'decisions_audited'
  | 'critical_alert_thr001'
  | 'compliance_score'
  | 'pending_actions'
  | 'monthly_savings'
  | 'emergency_fund_progress';

export interface CtaBudget {
  primary: 1;
  secondaryMax: 1;
}

export interface PromptPolicy {
  sharedComponentsRequired: boolean;
  inlineDataForbidden: boolean;
  inlineStyleForbidden: boolean;
  singleFileSelfContainedForbidden: boolean;
}

export interface EvidenceContract {
  shapMode: 'waterfall' | 'summary' | 'none';
  confidenceIndicator: 'required' | 'optional' | 'none';
}

export interface RouteMetaContract {
  route: string;
  screenType: ScreenType;
  navType: NavType;
  parentRoute: string | null;
  intent: RouteIntent;
  navGroup: NavGroup;
  cognitiveLoad: CognitiveLoad;
  primaryActionLabel: string;
  primaryActionPath: string;
  first5sMessage: string;
  demoPriority: 'P0' | 'P1' | 'P2';
  ctaBudget: CtaBudget;
  readyScope: ReadyScope;
  governance?: {
    auditId: string;
    pageContext: string;
    engine: EngineName;
  };
  evidence: EvidenceContract;
}

export interface ScreenBlueprint {
  route: string;
  intent: RouteIntent;
  first5sMessage: string;
  ctaBudget: CtaBudget;
  requiredModules: string[];
  forbiddenPatterns: string[];
  requiredA11y: Array<'skip-link' | 'main-landmark' | 'keyboard-focus' | 'aria-labels'>;
  contentBudget: {
    primaryMessageBlocks: 1;
    primaryActions: 1;
    secondaryActionsMax: 1;
  };
}

export interface CrossThreadDatum {
  key: CrossThreadKey;
  value: unknown;
  displayFormat: string;
  ownerRoutes: string[];
  description: string;
}

export interface RoutePromptSection {
  id: string;
  title: string;
  layout: SectionMapLayout;
  priority: 1 | 2 | 3;
}

export interface RoutePromptBlueprint {
  route: string;
  tier: PromptTier;
  primaryProfiles: AudienceProfile[];
  scenarioRoles: DemoScenario[];
  sectionMap: RoutePromptSection[];
  mustBuild: string[];
  shouldBuild: string[];
  decisionPoint: string;
  crossThreadKeys: CrossThreadKey[];
  initialDisclosure: 'summary-first';
  initialBlockCap: 3 | 4;
}

export interface OnboardingFlowStep {
  route: string;
  stepIndex: 0 | 1 | 2 | 3;
  title: string;
  primaryAction: string;
  backAction?: string;
}

export interface OnboardingFlowContract {
  routeGroup: '/onboarding';
  steps: [OnboardingFlowStep, OnboardingFlowStep, OnboardingFlowStep, OnboardingFlowStep];
  sharedLayout: {
    progressRequired: true;
    bottomActionBarRequired: true;
    trustCopyRequired: true;
  };
}

export const PROMPT_POLICY: PromptPolicy = {
  sharedComponentsRequired: true,
  inlineDataForbidden: true,
  inlineStyleForbidden: true,
  singleFileSelfContainedForbidden: true,
};

export const DEFAULT_CTA_BUDGET: CtaBudget = {
  primary: 1,
  secondaryMax: 1,
};

export const TARGET_SCOPE_READY_ROUTES = [
  '/',
  '/deck',
  '/trust',
  '/pricing',
  '/signup',
  '/login',
  '/recovery',
  '/onboarding',
  '/onboarding/connect',
  '/onboarding/goals',
  '/onboarding/consent',
  '/onboarding/complete',
  '/dashboard',
  '/dashboard/alerts',
  '/dashboard/insights',
  '/dashboard/timeline',
  '/dashboard/notifications',
  '/protect',
  '/protect/alert-detail',
  '/protect/dispute',
  '/grow',
  '/grow/goal',
  '/grow/scenarios',
  '/grow/recommendations',
  '/execute',
  '/execute/approval',
  '/execute/history',
  '/govern',
  '/govern/trust',
  '/govern/audit',
  '/govern/audit-detail',
  '/govern/registry',
  '/govern/oversight',
  '/govern/policy',
  '/settings',
  '/settings/ai',
  '/settings/integrations',
  '/settings/rights',
  '/help',
  '/test/spectacular',
  '/404',
] as const;

const TARGET_ROUTE_SET = new Set<string>(TARGET_SCOPE_READY_ROUTES);

const EVIDENCE_NONE: EvidenceContract = { shapMode: 'none', confidenceIndicator: 'optional' };
const EVIDENCE_SUMMARY: EvidenceContract = { shapMode: 'summary', confidenceIndicator: 'optional' };
const EVIDENCE_WATERFALL: EvidenceContract = { shapMode: 'waterfall', confidenceIndicator: 'optional' };

function readyScope(route: string): ReadyScope {
  return TARGET_ROUTE_SET.has(route) ? 'target16' : 'deferred';
}

function routeMeta(meta: Omit<RouteMetaContract, 'ctaBudget' | 'demoPriority' | 'readyScope'> & {
  demoPriority?: RouteMetaContract['demoPriority'];
}): RouteMetaContract {
  return {
    ...meta,
    ctaBudget: DEFAULT_CTA_BUDGET,
    demoPriority: meta.demoPriority ?? 'P2',
    readyScope: readyScope(meta.route),
  };
}

export const ROUTE_META_CONTRACT: Record<string, RouteMetaContract> = {
  '/': routeMeta({
    route: '/',
    screenType: 'public',
    navType: 'public-topbar',
    parentRoute: null,
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Open dashboard',
    primaryActionPath: '/dashboard',
    first5sMessage: 'This is a real AI-native financial operating system.',
    demoPriority: 'P0',
    evidence: EVIDENCE_SUMMARY,
  }),
  '/deck': routeMeta({
    route: '/deck',
    screenType: 'public',
    navType: 'public-topbar',
    parentRoute: '/',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Return home',
    primaryActionPath: '/',
    first5sMessage: 'Review the demo deck artifacts quickly.',
    evidence: EVIDENCE_NONE,
  }),
  '/trust': routeMeta({
    route: '/trust',
    screenType: 'public',
    navType: 'public-topbar',
    parentRoute: '/',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Open dashboard',
    primaryActionPath: '/dashboard',
    first5sMessage: 'Security and compliance posture in one place.',
    evidence: EVIDENCE_SUMMARY,
  }),
  '/pricing': routeMeta({
    route: '/pricing',
    screenType: 'public',
    navType: 'public-topbar',
    parentRoute: '/',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Create account',
    primaryActionPath: '/signup',
    first5sMessage: 'Transparent pricing with auditability included.',
    demoPriority: 'P1',
    evidence: EVIDENCE_SUMMARY,
  }),

  '/design-system': routeMeta({
    route: '/design-system',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: null,
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse tokens',
    primaryActionPath: '/design-system/tokens',
    first5sMessage: 'Design tokens and components source of truth.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/design-system/tokens': routeMeta({
    route: '/design-system/tokens',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: '/design-system',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse components',
    primaryActionPath: '/design-system/components',
    first5sMessage: 'Token definitions for color, typography, spacing, and motion.',
    evidence: EVIDENCE_NONE,
  }),
  '/design-system/tokens/colors': routeMeta({
    route: '/design-system/tokens/colors',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: '/design-system/tokens',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse components',
    primaryActionPath: '/design-system/components',
    first5sMessage: 'Color semantics and engine mapping.',
    evidence: EVIDENCE_NONE,
  }),
  '/design-system/tokens/typography': routeMeta({
    route: '/design-system/tokens/typography',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: '/design-system/tokens',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse components',
    primaryActionPath: '/design-system/components',
    first5sMessage: 'Typography scale and usage contracts.',
    evidence: EVIDENCE_NONE,
  }),
  '/design-system/tokens/spacing': routeMeta({
    route: '/design-system/tokens/spacing',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: '/design-system/tokens',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse components',
    primaryActionPath: '/design-system/components',
    first5sMessage: 'Spacing contracts and layout rhythm.',
    evidence: EVIDENCE_NONE,
  }),
  '/design-system/tokens/motion': routeMeta({
    route: '/design-system/tokens/motion',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: '/design-system/tokens',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse components',
    primaryActionPath: '/design-system/components',
    first5sMessage: 'Motion presets and reduced-motion policy.',
    evidence: EVIDENCE_NONE,
  }),
  '/design-system/components': routeMeta({
    route: '/design-system/components',
    screenType: 'design-system',
    navType: 'none',
    parentRoute: '/design-system',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Browse tokens',
    primaryActionPath: '/design-system/tokens',
    first5sMessage: 'Canonical component inventory.',
    evidence: EVIDENCE_NONE,
  }),

  '/signup': routeMeta({
    route: '/signup',
    screenType: 'auth',
    navType: 'public-topbar',
    parentRoute: '/',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Continue onboarding',
    primaryActionPath: '/onboarding/connect',
    first5sMessage: 'Create your account to activate Poseidon.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/login': routeMeta({
    route: '/login',
    screenType: 'auth',
    navType: 'public-topbar',
    parentRoute: '/',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Sign in',
    primaryActionPath: '/dashboard',
    first5sMessage: 'Sign in and continue from your command center.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/recovery': routeMeta({
    route: '/recovery',
    screenType: 'auth',
    navType: 'public-topbar',
    parentRoute: '/login',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Back to login',
    primaryActionPath: '/login',
    first5sMessage: 'Recover account access securely.',
    evidence: EVIDENCE_NONE,
  }),
  '/onboarding': routeMeta({
    route: '/onboarding',
    screenType: 'onboarding',
    navType: 'onboarding-shell',
    parentRoute: '/signup',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Continue setup',
    primaryActionPath: '/onboarding/connect',
    first5sMessage: 'Complete setup in four guided steps.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/onboarding/connect': routeMeta({
    route: '/onboarding/connect',
    screenType: 'onboarding',
    navType: 'onboarding-shell',
    parentRoute: '/onboarding',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Continue to goals',
    primaryActionPath: '/onboarding/goals',
    first5sMessage: 'Connect your accounts with read-only security.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/onboarding/goals': routeMeta({
    route: '/onboarding/goals',
    screenType: 'onboarding',
    navType: 'onboarding-shell',
    parentRoute: '/onboarding',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Continue to consent',
    primaryActionPath: '/onboarding/consent',
    first5sMessage: 'Pick goals to personalize recommendations.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/onboarding/consent': routeMeta({
    route: '/onboarding/consent',
    screenType: 'onboarding',
    navType: 'onboarding-shell',
    parentRoute: '/onboarding',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Activate Poseidon',
    primaryActionPath: '/onboarding/complete',
    first5sMessage: 'Set clear consent boundaries before automation.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),
  '/onboarding/complete': routeMeta({
    route: '/onboarding/complete',
    screenType: 'onboarding',
    navType: 'onboarding-shell',
    parentRoute: '/onboarding',
    intent: 'configure',
    navGroup: 'public',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Enter dashboard',
    primaryActionPath: '/dashboard',
    first5sMessage: 'Setup complete. Begin from your dashboard.',
    demoPriority: 'P1',
    evidence: EVIDENCE_NONE,
  }),

  '/dashboard': routeMeta({
    route: '/dashboard',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: null,
    intent: 'monitor',
    navGroup: 'core',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Review plan',
    primaryActionPath: '/execute',
    first5sMessage: 'See risk, opportunities, and actions in one screen.',
    demoPriority: 'P0',
    governance: { auditId: 'GV-2026-0216-DASH', pageContext: 'financial overview', engine: 'dashboard' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/dashboard/alerts': routeMeta({
    route: '/dashboard/alerts',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'investigate',
    navGroup: 'core',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Open top alert',
    primaryActionPath: '/protect/alert-detail',
    first5sMessage: 'Review active threats in one queue.',
    governance: { auditId: 'GV-2026-0216-ALRT', pageContext: 'alert monitoring', engine: 'dashboard' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/dashboard/insights': routeMeta({
    route: '/dashboard/insights',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'monitor',
    navGroup: 'core',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Review recommendation',
    primaryActionPath: '/grow/recommendations',
    first5sMessage: 'Prioritized insights with evidence.',
    governance: { auditId: 'GV-2026-0216-INSI', pageContext: 'insight feed', engine: 'dashboard' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/dashboard/timeline': routeMeta({
    route: '/dashboard/timeline',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'audit',
    navGroup: 'core',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Open audit ledger',
    primaryActionPath: '/govern/audit',
    first5sMessage: 'Trace what happened and when.',
    governance: { auditId: 'GV-2026-0216-TMLN', pageContext: 'activity timeline', engine: 'dashboard' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/dashboard/notifications': routeMeta({
    route: '/dashboard/notifications',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'investigate',
    navGroup: 'core',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Review alerts',
    primaryActionPath: '/protect',
    first5sMessage: 'All system notifications in one feed.',
    governance: { auditId: 'GV-2026-0216-NOTF', pageContext: 'notifications', engine: 'dashboard' },
    evidence: EVIDENCE_SUMMARY,
  }),

  '/protect': routeMeta({
    route: '/protect',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'investigate',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Open top alert',
    primaryActionPath: '/protect/alert-detail',
    first5sMessage: 'Catch financial threats before they escalate.',
    demoPriority: 'P0',
    governance: { auditId: 'GV-2026-0216-PRT-SIG', pageContext: 'threat signals', engine: 'protect' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/protect/alert-detail': routeMeta({
    route: '/protect/alert-detail',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/protect',
    intent: 'investigate',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Open execute queue',
    primaryActionPath: '/execute',
    first5sMessage: 'Inspect model factors and evidence for this alert.',
    governance: { auditId: 'GV-2026-0216-PRT-DET', pageContext: 'alert investigation', engine: 'protect' },
    evidence: EVIDENCE_WATERFALL,
  }),
  '/protect/dispute': routeMeta({
    route: '/protect/dispute',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/protect',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Return to protect',
    primaryActionPath: '/protect',
    first5sMessage: 'Manage the dispute workflow with audit traceability.',
    governance: { auditId: 'GV-2026-0216-PRT-DSP', pageContext: 'dispute resolution', engine: 'protect' },
    evidence: EVIDENCE_SUMMARY,
  }),

  '/grow': routeMeta({
    route: '/grow',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'monitor',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Review growth plan',
    primaryActionPath: '/execute',
    first5sMessage: 'Forecast outcomes and compare growth paths.',
    demoPriority: 'P1',
    governance: { auditId: 'GV-2026-0216-GROW', pageContext: 'growth projections', engine: 'grow' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/grow/goal': routeMeta({
    route: '/grow/goal',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/grow',
    intent: 'monitor',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Adjust goal',
    primaryActionPath: '/execute',
    first5sMessage: 'Track goal contribution and expected timeline.',
    governance: { auditId: 'GV-2026-0216-GROW-GL', pageContext: 'goal tracking', engine: 'grow' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/grow/scenarios': routeMeta({
    route: '/grow/scenarios',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/grow',
    intent: 'monitor',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Send to Execute',
    primaryActionPath: '/execute',
    first5sMessage: 'Compare what-if scenarios before committing.',
    governance: { auditId: 'GV-2026-0216-GROW-SC', pageContext: 'scenario analysis', engine: 'grow' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/grow/recommendations': routeMeta({
    route: '/grow/recommendations',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/grow',
    intent: 'approve',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Approve in Execute',
    primaryActionPath: '/execute/approval',
    first5sMessage: 'AI recommendations ranked by impact and confidence.',
    governance: { auditId: 'GV-2026-0216-GROW-RC', pageContext: 'growth recommendations', engine: 'grow' },
    evidence: EVIDENCE_SUMMARY,
  }),

  '/execute': routeMeta({
    route: '/execute',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'approve',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Review execution history',
    primaryActionPath: '/execute/history',
    first5sMessage: 'Approve high-impact actions with context.',
    demoPriority: 'P0',
    governance: { auditId: 'GV-2026-0216-EXEC', pageContext: 'this execution batch', engine: 'execute' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/execute/approval': routeMeta({
    route: '/execute/approval',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/execute',
    intent: 'approve',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Review history',
    primaryActionPath: '/execute/history',
    first5sMessage: 'Review queued actions before approval.',
    governance: { auditId: 'GV-2026-0216-EXEC-APR', pageContext: 'approval queue', engine: 'execute' },
    evidence: EVIDENCE_WATERFALL,
  }),
  '/execute/history': routeMeta({
    route: '/execute/history',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/execute',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Open govern trace',
    primaryActionPath: '/govern/audit',
    first5sMessage: 'Inspect executed actions with audit references.',
    governance: { auditId: 'GV-2026-0216-EXEC-HIST', pageContext: 'execution history', engine: 'execute' },
    evidence: EVIDENCE_SUMMARY,
  }),

  '/govern': routeMeta({
    route: '/govern',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Open audit ledger',
    primaryActionPath: '/govern/audit',
    first5sMessage: 'Trace every decision with audit-ready transparency.',
    demoPriority: 'P0',
    governance: { auditId: 'GV-2026-0216-GOV', pageContext: 'governance decisions', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/govern/trust': routeMeta({
    route: '/govern/trust',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/govern',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Open oversight queue',
    primaryActionPath: '/govern/oversight',
    first5sMessage: 'Tune trust metrics and thresholds.',
    governance: { auditId: 'GV-2026-0216-GOV-TRS', pageContext: 'trust metrics', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/govern/audit': routeMeta({
    route: '/govern/audit',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/govern',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Back to govern overview',
    primaryActionPath: '/govern',
    first5sMessage: 'Review immutable decision ledger entries.',
    governance: { auditId: 'GV-2026-0216-GOV-AUD', pageContext: 'audit ledger', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/govern/audit-detail': routeMeta({
    route: '/govern/audit-detail',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/govern/audit',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Back to audit ledger',
    primaryActionPath: '/govern/audit',
    first5sMessage: 'Inspect evidence and reasoning for one decision.',
    governance: { auditId: 'GV-2026-0216-GOV-ADT', pageContext: 'audit detail', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/govern/registry': routeMeta({
    route: '/govern/registry',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/govern',
    intent: 'configure',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Open policy controls',
    primaryActionPath: '/govern/policy',
    first5sMessage: 'Model registry and approval status.',
    governance: { auditId: 'GV-2026-0216-GOV-REG', pageContext: 'model registry', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/govern/oversight': routeMeta({
    route: '/govern/oversight',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/govern',
    intent: 'audit',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Back to dashboard',
    primaryActionPath: '/dashboard',
    first5sMessage: 'Human review queue for high-risk decisions.',
    governance: { auditId: 'GV-2026-0216-GOV-OVR', pageContext: 'human oversight queue', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),
  '/govern/policy': routeMeta({
    route: '/govern/policy',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/govern',
    intent: 'configure',
    navGroup: 'engine',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Review settings',
    primaryActionPath: '/settings',
    first5sMessage: 'Adjust governance policy controls safely.',
    governance: { auditId: 'GV-2026-0216-GOV-POL', pageContext: 'policy controls', engine: 'govern' },
    evidence: EVIDENCE_SUMMARY,
  }),

  '/settings': routeMeta({
    route: '/settings',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/dashboard',
    intent: 'configure',
    navGroup: 'settings',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Review settings controls',
    primaryActionPath: '/settings',
    first5sMessage: 'Configure controls without losing context.',
    demoPriority: 'P0',
    governance: { auditId: 'GV-2026-0216-SETT', pageContext: 'settings overview', engine: 'dashboard' },
    evidence: EVIDENCE_NONE,
  }),
  '/settings/ai': routeMeta({
    route: '/settings/ai',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/settings',
    intent: 'configure',
    navGroup: 'settings',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Open integrations',
    primaryActionPath: '/settings/integrations',
    first5sMessage: 'Tune AI control and explanation preferences.',
    governance: { auditId: 'GV-2026-0216-SETT-AI', pageContext: 'AI configuration', engine: 'dashboard' },
    evidence: EVIDENCE_NONE,
  }),
  '/settings/integrations': routeMeta({
    route: '/settings/integrations',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/settings',
    intent: 'configure',
    navGroup: 'settings',
    cognitiveLoad: 'medium',
    primaryActionLabel: 'Open rights controls',
    primaryActionPath: '/settings/rights',
    first5sMessage: 'Manage third-party integrations securely.',
    governance: { auditId: 'GV-2026-0216-SETT-INT', pageContext: 'integrations', engine: 'dashboard' },
    evidence: EVIDENCE_NONE,
  }),
  '/settings/rights': routeMeta({
    route: '/settings/rights',
    screenType: 'app',
    navType: 'app-shell',
    parentRoute: '/settings',
    intent: 'configure',
    navGroup: 'settings',
    cognitiveLoad: 'high',
    primaryActionLabel: 'Return to dashboard',
    primaryActionPath: '/dashboard',
    first5sMessage: 'Exercise data rights with clear control boundaries.',
    governance: { auditId: 'GV-2026-0216-SETT-RTS', pageContext: 'data rights', engine: 'dashboard' },
    evidence: EVIDENCE_NONE,
  }),

  '/help': routeMeta({
    route: '/help',
    screenType: 'system',
    navType: 'system-shell',
    parentRoute: '/settings',
    intent: 'configure',
    navGroup: 'settings',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Return to settings',
    primaryActionPath: '/settings',
    first5sMessage: 'Get support without leaving workflow context.',
    governance: { auditId: 'GV-2026-0216-HELP', pageContext: 'help system', engine: 'dashboard' },
    evidence: EVIDENCE_NONE,
  }),

  '/test/spectacular': routeMeta({
    route: '/test/spectacular',
    screenType: 'system',
    navType: 'none',
    parentRoute: null,
    intent: 'monitor',
    navGroup: 'settings',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Return home',
    primaryActionPath: '/',
    first5sMessage: 'Isolated UI testing environment.',
    evidence: EVIDENCE_NONE,
  }),
  '/404': routeMeta({
    route: '/404',
    screenType: 'system',
    navType: 'none',
    parentRoute: '/dashboard',
    intent: 'monitor',
    navGroup: 'public',
    cognitiveLoad: 'low',
    primaryActionLabel: 'Back to dashboard',
    primaryActionPath: '/dashboard',
    first5sMessage: 'Page not found. Return safely to the command center.',
    evidence: EVIDENCE_NONE,
  }),
};

export const SCREEN_BLUEPRINTS: Record<string, ScreenBlueprint> = Object.fromEntries(
  Object.values(ROUTE_META_CONTRACT)
    .filter((meta) => meta.readyScope === 'target16' && meta.route !== '/404')
    .map((meta) => [
      meta.route,
      {
        route: meta.route,
        intent: meta.intent,
        first5sMessage: meta.first5sMessage,
        ctaBudget: meta.ctaBudget,
        requiredModules: ['PublicTopBar', 'AuthFrame', 'OnboardingFrame', 'EnginePageFrame', 'GovernFooter'],
        forbiddenPatterns: ['single-file-self-contained', 'all-data-inline', 'style={{', 'hardcoded-hex'],
        requiredA11y: ['skip-link', 'main-landmark', 'keyboard-focus', 'aria-labels'],
        contentBudget: {
          primaryMessageBlocks: 1,
          primaryActions: 1,
          secondaryActionsMax: 1,
        },
      } satisfies ScreenBlueprint,
    ]),
);

export const ONBOARDING_FLOW_CONTRACT: OnboardingFlowContract = {
  routeGroup: '/onboarding',
  steps: [
    {
      route: '/onboarding/connect',
      stepIndex: 0,
      title: 'Connect your accounts',
      primaryAction: 'Continue to goals',
    },
    {
      route: '/onboarding/goals',
      stepIndex: 1,
      title: 'Select your goals',
      primaryAction: 'Continue to consent',
      backAction: 'Back to connect',
    },
    {
      route: '/onboarding/consent',
      stepIndex: 2,
      title: 'Set consent boundaries',
      primaryAction: 'Activate Poseidon',
      backAction: 'Back to goals',
    },
    {
      route: '/onboarding/complete',
      stepIndex: 3,
      title: 'Ready to launch',
      primaryAction: 'Enter dashboard',
      backAction: 'Back to goals',
    },
  ],
  sharedLayout: {
    progressRequired: true,
    bottomActionBarRequired: true,
    trustCopyRequired: true,
  },
};

export const EVIDENCE_CONTRACT: Record<string, EvidenceContract> = Object.fromEntries(
  Object.values(ROUTE_META_CONTRACT).map((meta) => [meta.route, meta.evidence]),
);

export const CROSS_SCREEN_DATA_THREAD: Record<CrossThreadKey, CrossThreadDatum> = {
  system_confidence: {
    key: 'system_confidence',
    value: 0.92,
    displayFormat: '0.92',
    ownerRoutes: ['/', '/dashboard'],
    description: 'Composite confidence summary shown in public entry and command center.',
  },
  decisions_audited: {
    key: 'decisions_audited',
    value: 1247,
    displayFormat: '1,247',
    ownerRoutes: ['/', '/govern', '/govern/audit'],
    description: 'Total immutable decision records visible in trust-facing screens.',
  },
  critical_alert_thr001: {
    key: 'critical_alert_thr001',
    value: {
      id: 'THR-001',
      amount: 2847,
      merchant: 'TechElectro Store',
      confidence: 0.94,
      cardLast4: '4821',
      signalId: 'PRT-2026-0216-003',
    },
    displayFormat: 'THR-001 · $2,847 · TechElectro Store · 0.94',
    ownerRoutes: ['/dashboard', '/protect', '/protect/alert-detail', '/execute'],
    description: 'Canonical high-severity alert used to prove cross-engine continuity.',
  },
  compliance_score: {
    key: 'compliance_score',
    value: 96,
    displayFormat: '96/100',
    ownerRoutes: ['/dashboard', '/protect/alert-detail', '/govern', '/govern/audit'],
    description: 'Governance score reused across dashboard and governance screens.',
  },
  pending_actions: {
    key: 'pending_actions',
    value: 5,
    displayFormat: '5 pending actions',
    ownerRoutes: ['/dashboard', '/execute'],
    description: 'Action queue volume linking monitor and approval experiences.',
  },
  monthly_savings: {
    key: 'monthly_savings',
    value: 847,
    displayFormat: '$847/month',
    ownerRoutes: ['/dashboard', '/execute', '/execute/history'],
    description: 'Savings metric used across recommendation and execution reporting.',
  },
  emergency_fund_progress: {
    key: 'emergency_fund_progress',
    value: {
      percent: 73,
      current: 7300,
      target: 10000,
    },
    displayFormat: '73% · $7,300 / $10,000',
    ownerRoutes: ['/dashboard', '/grow', '/grow/goal', '/grow/scenarios'],
    description: 'Shared growth KPI to keep planning and scenario routes consistent.',
  },
};

export const ROUTE_PROMPT_BLUEPRINTS: Record<string, RoutePromptBlueprint> = {
  '/': {
    route: '/',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'industry-evaluator'],
    scenarioRoles: ['wow-30s'],
    sectionMap: [
      { id: 'hero', title: 'First 5s hero + primary CTA', layout: 'full', priority: 1 },
      { id: 'metrics', title: 'Live metrics strip', layout: 'grid', priority: 2 },
      { id: 'engines', title: 'Four-engine overview cards', layout: 'grid', priority: 3 },
    ],
    mustBuild: ['PublicTopBar', 'First5sMessageBlock', 'MetricsStrip', 'PrimaryActionBar'],
    shouldBuild: ['EngineCards', 'GovernanceProofBar'],
    decisionPoint: 'Decide whether to enter the command center immediately.',
    crossThreadKeys: ['system_confidence', 'decisions_audited'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/pricing': {
    route: '/pricing',
    tier: 'B',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'hero', title: 'Plan positioning + trust note', layout: 'full', priority: 1 },
      { id: 'plans', title: 'Three-plan pricing grid', layout: 'grid', priority: 2 },
      { id: 'comparison', title: 'Feature comparison with CTA', layout: 'full', priority: 3 },
    ],
    mustBuild: ['PublicTopBar', 'PricingCards', 'PrimaryActionBar'],
    shouldBuild: ['FaqAccordion', 'ProofLine'],
    decisionPoint: 'Choose whether to start with account creation.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/signup': {
    route: '/signup',
    tier: 'B',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'first5s', title: 'Trust-first signup value statement', layout: 'full', priority: 1 },
      { id: 'form', title: 'Editable signup form + SSO options', layout: 'two-col', priority: 2 },
      { id: 'cta', title: 'Continue onboarding action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['PublicTopBar', 'AuthForm', 'PrimaryActionBar'],
    shouldBuild: ['TrustBadges', 'SecondaryCtaLink'],
    decisionPoint: 'Complete signup and continue to onboarding.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/login': {
    route: '/login',
    tier: 'B',
    primaryProfiles: ['industry-evaluator', 'cto-peer'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'first5s', title: 'Resume-command-center message', layout: 'full', priority: 1 },
      { id: 'form', title: 'Editable login form + recovery path', layout: 'full', priority: 2 },
      { id: 'cta', title: 'Primary sign-in action', layout: 'full', priority: 3 },
    ],
    mustBuild: ['PublicTopBar', 'AuthForm', 'PrimaryActionBar'],
    shouldBuild: ['SsoOptions', 'ForgotPasswordLink'],
    decisionPoint: 'Authenticate quickly and return to dashboard.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/onboarding': {
    route: '/onboarding',
    tier: 'C',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'intro', title: 'Onboarding flow overview', layout: 'full', priority: 1 },
      { id: 'progress', title: 'Step progress map', layout: 'full', priority: 2 },
      { id: 'next', title: 'Continue to connect step', layout: 'full', priority: 3 },
    ],
    mustBuild: ['OnboardingFrame', 'ProgressIndicator', 'PrimaryActionBar'],
    shouldBuild: ['TrustCopy'],
    decisionPoint: 'Start guided onboarding with clear expectations.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/onboarding/connect': {
    route: '/onboarding/connect',
    tier: 'B',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'progress', title: 'Step indicator (1/4)', layout: 'full', priority: 1 },
      { id: 'accounts', title: 'Account connection choices', layout: 'grid', priority: 2 },
      { id: 'actions', title: 'Continue / skip action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['OnboardingFrame', 'ProgressIndicator', 'PrimaryActionBar'],
    shouldBuild: ['TrustCopy', 'ConnectionStatusBadges'],
    decisionPoint: 'Connect at least one account or safely defer.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/onboarding/goals': {
    route: '/onboarding/goals',
    tier: 'C',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'progress', title: 'Step indicator (2/4)', layout: 'full', priority: 1 },
      { id: 'goals', title: 'Goal selection grid', layout: 'grid', priority: 2 },
      { id: 'actions', title: 'Continue / back action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['OnboardingFrame', 'ProgressIndicator', 'PrimaryActionBar'],
    shouldBuild: ['TrustCopy'],
    decisionPoint: 'Select goals that drive model recommendations.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/onboarding/consent': {
    route: '/onboarding/consent',
    tier: 'B',
    primaryProfiles: ['mit-faculty', 'industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'progress', title: 'Step indicator (3/4)', layout: 'full', priority: 1 },
      { id: 'boundaries', title: 'Explicit consent boundaries', layout: 'full', priority: 2 },
      { id: 'actions', title: 'Activate / back action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['OnboardingFrame', 'ConsentBoundaryPanel', 'PrimaryActionBar'],
    shouldBuild: ['TrustCopy', 'PolicyReference'],
    decisionPoint: 'Approve boundaries before any automation begins.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/onboarding/complete': {
    route: '/onboarding/complete',
    tier: 'C',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'summary', title: 'Setup completion summary', layout: 'full', priority: 1 },
      { id: 'readiness', title: 'Readiness confirmations', layout: 'grid', priority: 2 },
      { id: 'actions', title: 'Enter dashboard action', layout: 'full', priority: 3 },
    ],
    mustBuild: ['OnboardingFrame', 'CompletionSummary', 'PrimaryActionBar'],
    shouldBuild: ['TrustCopy'],
    decisionPoint: 'Enter dashboard with setup confidence.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/dashboard': {
    route: '/dashboard',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'cto-peer'],
    scenarioRoles: ['wow-30s', 'engine-proof-120s'],
    sectionMap: [
      { id: 'command', title: 'First 5s command summary + CTA', layout: 'full', priority: 1 },
      { id: 'kpi', title: 'KPI + engine health strip', layout: 'grid', priority: 2 },
      { id: 'next', title: 'Critical feed + decision rail', layout: 'two-col', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'BentoGrid', 'EngineHealthStrip', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ProofLine', 'AuroraPulse'],
    decisionPoint: 'Select the first high-impact path to investigate.',
    crossThreadKeys: [
      'system_confidence',
      'critical_alert_thr001',
      'compliance_score',
      'pending_actions',
      'monthly_savings',
      'emergency_fund_progress',
    ],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/protect': {
    route: '/protect',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'cto-peer'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'hero', title: 'Threat posture summary + top alert CTA', layout: 'full', priority: 1 },
      { id: 'threats', title: 'Threat table prioritized by severity', layout: 'two-col', priority: 2 },
      { id: 'evidence', title: 'Risk ring + proof line', layout: 'two-col', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'ThreatTable', 'RiskScoreRing', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ConfidenceIndicator', 'ProofLine'],
    decisionPoint: 'Inspect the critical alert before approving action.',
    crossThreadKeys: ['critical_alert_thr001'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/protect/alert-detail': {
    route: '/protect/alert-detail',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'cto-peer'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'summary', title: 'Alert summary + confidence context', layout: 'full', priority: 1 },
      { id: 'shap', title: 'SHAP waterfall evidence (mandatory)', layout: 'full', priority: 2 },
      { id: 'actions', title: 'Escalate / mark-safe action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'ShapWaterfall', 'ConfidenceIndicator', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['EvidenceTimeline', 'SimilarIncidentsPanel'],
    decisionPoint: 'Decide whether the alert is fraud or false positive.',
    crossThreadKeys: ['critical_alert_thr001', 'compliance_score'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/grow': {
    route: '/grow',
    tier: 'C',
    primaryProfiles: ['industry-evaluator', 'cto-peer'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'hero', title: 'Growth summary + primary plan CTA', layout: 'full', priority: 1 },
      { id: 'kpi', title: 'Goal and forecast KPIs', layout: 'grid', priority: 2 },
      { id: 'next', title: 'Top growth recommendations', layout: 'two-col', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'GoalKpiGrid', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ForecastPreview', 'ProofLine'],
    decisionPoint: 'Choose whether to inspect scenarios before execution.',
    crossThreadKeys: ['emergency_fund_progress'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/grow/goal': {
    route: '/grow/goal',
    tier: 'C',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'goal', title: 'Goal progress summary', layout: 'full', priority: 1 },
      { id: 'forecast', title: 'Contribution and forecast view', layout: 'two-col', priority: 2 },
      { id: 'actions', title: 'Adjust goal action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'GoalProgressCard', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ForecastBand', 'ProofLine'],
    decisionPoint: 'Adjust contribution pace based on timeline confidence.',
    crossThreadKeys: ['emergency_fund_progress'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/grow/scenarios': {
    route: '/grow/scenarios',
    tier: 'B',
    primaryProfiles: ['mit-faculty', 'cto-peer'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'summary', title: 'Scenario goal and selection controls', layout: 'full', priority: 1 },
      { id: 'comparison', title: 'Scenario cards + forecast bands', layout: 'two-col', priority: 2 },
      { id: 'actions', title: 'Send-to-execute action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'ForecastBand', 'ScenarioComparison', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['SensitivityNotes', 'ProofLine'],
    decisionPoint: 'Select the scenario to push into execution.',
    crossThreadKeys: ['emergency_fund_progress'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/execute': {
    route: '/execute',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'industry-evaluator'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'hero', title: 'Queue summary + approval principle', layout: 'full', priority: 1 },
      { id: 'queue', title: 'Top action cards with explicit controls', layout: 'two-col', priority: 2 },
      { id: 'rail', title: 'Savings + rollback proof rail', layout: 'two-col', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'ActionQueueCards', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ConfidenceIndicator', 'ProofLine'],
    decisionPoint: 'Approve or defer high-impact actions with full context.',
    crossThreadKeys: ['critical_alert_thr001', 'pending_actions', 'monthly_savings'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/execute/history': {
    route: '/execute/history',
    tier: 'B',
    primaryProfiles: ['cto-peer', 'mit-faculty'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'summary', title: 'Execution outcome stats', layout: 'grid', priority: 1 },
      { id: 'table', title: 'History table (max 5 rows initial)', layout: 'full', priority: 2 },
      { id: 'trace', title: 'Open-govern-trace action', layout: 'full', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'ExecutionHistoryTable', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ProofLine', 'FilterBar'],
    decisionPoint: 'Trace completed actions into governance evidence.',
    crossThreadKeys: ['monthly_savings'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 4,
  },
  '/govern': {
    route: '/govern',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'cto-peer'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'hero', title: 'Governance posture summary', layout: 'full', priority: 1 },
      { id: 'ledger-preview', title: 'Engine-colored ledger preview', layout: 'two-col', priority: 2 },
      { id: 'compliance', title: 'Compliance ring + human review signal', layout: 'two-col', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'ComplianceScoreRing', 'LedgerPreview', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ProofLine', 'AuditChip'],
    decisionPoint: 'Confirm governance integrity before deep audit.',
    crossThreadKeys: ['compliance_score', 'decisions_audited'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/govern/audit': {
    route: '/govern/audit',
    tier: 'A',
    primaryProfiles: ['mit-faculty', 'cto-peer'],
    scenarioRoles: ['engine-proof-120s'],
    sectionMap: [
      { id: 'summary', title: 'Immutable ledger summary', layout: 'full', priority: 1 },
      { id: 'ledger', title: 'Audit ledger table + filters', layout: 'full', priority: 2 },
      { id: 'integrity', title: 'Integrity proof line', layout: 'full', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'AuditLedgerTable', 'IntegrityProofLine', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['FilterControls', 'AuditChip'],
    decisionPoint: 'Validate traceability and governance reliability.',
    crossThreadKeys: ['decisions_audited', 'compliance_score'],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/settings': {
    route: '/settings',
    tier: 'C',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['activation-90s'],
    sectionMap: [
      { id: 'summary', title: 'Control summary + first5s', layout: 'full', priority: 1 },
      { id: 'controls', title: 'AI/privacy/integration controls', layout: 'two-col', priority: 2 },
      { id: 'actions', title: 'Settings review action bar', layout: 'full', priority: 3 },
    ],
    mustBuild: ['EnginePageFrame', 'SettingsControlCards', 'PrimaryActionBar', 'GovernFooter'],
    shouldBuild: ['ConsentBoundaryHints', 'ProofLine'],
    decisionPoint: 'Set operating boundaries without losing context.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
  '/404': {
    route: '/404',
    tier: 'C',
    primaryProfiles: ['industry-evaluator'],
    scenarioRoles: ['wow-30s'],
    sectionMap: [
      { id: 'message', title: 'Not found explanation', layout: 'full', priority: 1 },
      { id: 'next', title: 'Return-to-dashboard action', layout: 'full', priority: 2 },
      { id: 'assist', title: 'Support hint', layout: 'full', priority: 3 },
    ],
    mustBuild: ['SystemFallback', 'PrimaryActionBar'],
    shouldBuild: ['SupportHint'],
    decisionPoint: 'Recover safely back to a known route.',
    crossThreadKeys: [],
    initialDisclosure: 'summary-first',
    initialBlockCap: 3,
  },
};

export function getRouteMetaContract(path: string): RouteMetaContract | undefined {
  const normalized = path.split('?')[0];
  return ROUTE_META_CONTRACT[normalized];
}
