import { lazy } from 'react';

// Lazy load page components for code splitting — 36 canonical + compat aliases
export const routeLoaders = {
  // ─── Public ─────────────────────────────────────────────────────────────────
  '/': () => import('../pages/Landing'),
  '/trust': () => import('../pages/TrustSecurity'),
  '/pricing': () => import('../pages/Pricing'),

  // ─── Design System ──────────────────────────────────────────────────────────
  '/design-system': () => import('../pages/DesignSystemLanding'),
  '/design-system/tokens': () => import('../pages/DesignSystemTokens'),
  '/design-system/tokens/colors': () => import('../pages/DesignSystemTokensColors'),
  '/design-system/tokens/typography': () => import('../pages/DesignSystemTokensTypography'),
  '/design-system/tokens/spacing': () => import('../pages/DesignSystemTokensSpacing'),
  '/design-system/tokens/motion': () => import('../pages/DesignSystemTokensMotion'),
  '/design-system/components': () => import('../pages/DesignSystemComponents'),

  // ─── Activation ─────────────────────────────────────────────────────────────
  '/signup': () => import('../pages/Signup'),
  '/login': () => import('../pages/Login'),
  '/recovery': () => import('../pages/Recovery'),
  '/onboarding/connect': () => import('../pages/Onboarding'),
  '/onboarding/goals': () => import('../pages/OnboardingGoals'),
  '/onboarding/consent': () => import('../pages/OnboardingConsent'),
  '/onboarding/complete': () => import('../pages/OnboardingComplete'),

  // ─── Core ───────────────────────────────────────────────────────────────────
  '/dashboard': () => import('../pages/Dashboard'),
  '/dashboard/alerts': () => import('../pages/AlertsHub'),
  '/dashboard/insights': () => import('../pages/InsightsFeed'),
  '/dashboard/timeline': () => import('../pages/ActivityTimelinePage'),
  '/dashboard/notifications': () => import('../pages/Notifications'),

  // ─── Protect ────────────────────────────────────────────────────────────────
  '/protect': () => import('../pages/Protect'),
  '/protect/alert-detail': () => import('../pages/ProtectAlertDetail'),
  '/protect/dispute': () => import('../pages/ProtectDispute'),

  // ─── Grow ───────────────────────────────────────────────────────────────────
  '/grow': () => import('../pages/Grow'),
  '/grow/goal': () => import('../pages/GrowGoalDetail'),
  '/grow/scenarios': () => import('../pages/GrowScenarios'),
  '/grow/recommendations': () => import('../pages/GrowRecommendations'),

  // ─── Execute ────────────────────────────────────────────────────────────────
  '/execute': () => import('../pages/Execute'),
  '/execute/approval': () => import('../pages/ExecuteApproval'),
  '/execute/history': () => import('../pages/ExecuteHistory'),

  // ─── Govern ─────────────────────────────────────────────────────────────────
  '/govern': () => import('../pages/Govern'),
  '/govern/trust': () => import('../pages/GovernTrust'),
  '/govern/audit': () => import('../pages/GovernAuditLedger'),
  '/govern/audit-detail': () => import('../pages/GovernAuditDetail'),
  '/govern/registry': () => import('../pages/GovernRegistry'),
  '/govern/oversight': () => import('../pages/GovernOversight'),
  '/govern/policy': () => import('../pages/GovernPolicy'),

  // ─── Settings ───────────────────────────────────────────────────────────────
  '/settings': () => import('../pages/Settings'),
  '/settings/ai': () => import('../pages/SettingsAI'),
  '/settings/integrations': () => import('../pages/SettingsIntegrations'),
  '/settings/rights': () => import('../pages/SettingsRights'),

  // ─── System ─────────────────────────────────────────────────────────────────
  '/help': () => import('../pages/HelpSupport'),

  '/onboarding': () => import('../pages/Onboarding'),
} as const;

export type RoutePath = keyof typeof routeLoaders;

/**
 * Routes rebuilt with v0 and ready for production.
 * All other routes render a "Coming Soon" placeholder.
 * To unlock a route, add its path here.
 */
export const V0_READY_ROUTES = new Set<RoutePath>([
  '/',
  '/trust',
  '/pricing',
  '/signup',
  '/login',
  '/recovery',
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
]);

export interface RouteUXMeta {
  intent: 'monitor' | 'investigate' | 'approve' | 'audit' | 'configure';
  primaryActionLabel: string;
  primaryActionPath: string;
  navGroup: 'public' | 'core' | 'engine' | 'settings';
  cognitiveLoad: 'low' | 'medium' | 'high';
  demoPriority?: 'P0' | 'P1' | 'P2';
  ctaBudget?: number;
  first5sMessage?: string;
}

export interface ResolvedRouteUXMeta extends Omit<RouteUXMeta, 'demoPriority' | 'ctaBudget'> {
  demoPriority: 'P0' | 'P1' | 'P2';
  ctaBudget: number;
}

export const routeUxMeta: Record<string, RouteUXMeta> = {
  '/': { intent: 'monitor', primaryActionLabel: 'Open dashboard', primaryActionPath: '/dashboard', navGroup: 'public', cognitiveLoad: 'low', demoPriority: 'P0', ctaBudget: 1, first5sMessage: 'Understand your financial posture instantly.' },
  '/trust': { intent: 'monitor', primaryActionLabel: 'Open dashboard', primaryActionPath: '/dashboard', navGroup: 'public', cognitiveLoad: 'low' },
  '/pricing': { intent: 'monitor', primaryActionLabel: 'Start onboarding', primaryActionPath: '/onboarding/connect', navGroup: 'public', cognitiveLoad: 'low' },
  '/design-system': { intent: 'monitor', primaryActionLabel: 'Browse tokens', primaryActionPath: '/design-system/tokens', navGroup: 'public', cognitiveLoad: 'low', demoPriority: 'P1', ctaBudget: 1, first5sMessage: 'Explore tokens, components, and quality gates.' },
  '/design-system/tokens': { intent: 'monitor', primaryActionLabel: 'Browse components', primaryActionPath: '/design-system/components', navGroup: 'public', cognitiveLoad: 'low' },
  '/design-system/tokens/colors': { intent: 'monitor', primaryActionLabel: 'Browse components', primaryActionPath: '/design-system/components', navGroup: 'public', cognitiveLoad: 'low' },
  '/design-system/tokens/typography': { intent: 'monitor', primaryActionLabel: 'Browse components', primaryActionPath: '/design-system/components', navGroup: 'public', cognitiveLoad: 'low' },
  '/design-system/tokens/spacing': { intent: 'monitor', primaryActionLabel: 'Browse components', primaryActionPath: '/design-system/components', navGroup: 'public', cognitiveLoad: 'low' },
  '/design-system/tokens/motion': { intent: 'monitor', primaryActionLabel: 'Browse components', primaryActionPath: '/design-system/components', navGroup: 'public', cognitiveLoad: 'low' },
  '/design-system/components': { intent: 'monitor', primaryActionLabel: 'Browse tokens', primaryActionPath: '/design-system/tokens', navGroup: 'public', cognitiveLoad: 'low' },
  '/signup': { intent: 'configure', primaryActionLabel: 'Continue signup', primaryActionPath: '/onboarding/connect', navGroup: 'public', cognitiveLoad: 'medium' },
  '/login': { intent: 'configure', primaryActionLabel: 'Sign in and continue', primaryActionPath: '/dashboard', navGroup: 'public', cognitiveLoad: 'medium' },
  '/recovery': { intent: 'configure', primaryActionLabel: 'Back to login', primaryActionPath: '/login', navGroup: 'public', cognitiveLoad: 'medium' },
  '/onboarding': { intent: 'configure', primaryActionLabel: 'Continue setup', primaryActionPath: '/onboarding/connect', navGroup: 'public', cognitiveLoad: 'high' },
  '/dashboard': { intent: 'monitor', primaryActionLabel: 'Review plan', primaryActionPath: '/execute', navGroup: 'core', cognitiveLoad: 'medium', demoPriority: 'P0', ctaBudget: 1, first5sMessage: 'See risk, opportunities, and actions in one screen.' },
  '/dashboard/alerts': { intent: 'investigate', primaryActionLabel: 'Open top alert', primaryActionPath: '/protect/alert-detail', navGroup: 'core', cognitiveLoad: 'high' },
  '/dashboard/insights': { intent: 'monitor', primaryActionLabel: 'Review recommendation', primaryActionPath: '/grow/recommendations', navGroup: 'core', cognitiveLoad: 'medium' },
  '/dashboard/timeline': { intent: 'audit', primaryActionLabel: 'Open audit ledger', primaryActionPath: '/govern/audit', navGroup: 'core', cognitiveLoad: 'medium' },
  '/dashboard/notifications': { intent: 'investigate', primaryActionLabel: 'Review active alerts', primaryActionPath: '/protect', navGroup: 'core', cognitiveLoad: 'medium' },
  '/protect': { intent: 'investigate', primaryActionLabel: 'Open top alert', primaryActionPath: '/protect/alert-detail', navGroup: 'engine', cognitiveLoad: 'high', demoPriority: 'P0', ctaBudget: 1, first5sMessage: 'Catch financial threats before they escalate.' },
  '/protect/alert-detail': { intent: 'investigate', primaryActionLabel: 'Open dispute flow', primaryActionPath: '/protect/dispute', navGroup: 'engine', cognitiveLoad: 'high' },
  '/protect/dispute': { intent: 'audit', primaryActionLabel: 'Return to alerts', primaryActionPath: '/protect', navGroup: 'engine', cognitiveLoad: 'high' },
  '/grow': { intent: 'monitor', primaryActionLabel: 'Review growth plan', primaryActionPath: '/execute', navGroup: 'engine', cognitiveLoad: 'medium', demoPriority: 'P1', ctaBudget: 1 },
  '/grow/goal': { intent: 'monitor', primaryActionLabel: 'Adjust goal', primaryActionPath: '/execute', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/grow/scenarios': { intent: 'monitor', primaryActionLabel: 'Send to Execute', primaryActionPath: '/execute', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/grow/recommendations': { intent: 'approve', primaryActionLabel: 'Approve in Execute', primaryActionPath: '/execute/approval', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/execute': { intent: 'approve', primaryActionLabel: 'Open approval queue', primaryActionPath: '/execute/approval', navGroup: 'engine', cognitiveLoad: 'high', demoPriority: 'P0', ctaBudget: 1, first5sMessage: 'Approve high-impact actions with explainable evidence.' },
  '/execute/approval': { intent: 'approve', primaryActionLabel: 'Review history', primaryActionPath: '/execute/history', navGroup: 'engine', cognitiveLoad: 'high' },
  '/execute/history': { intent: 'audit', primaryActionLabel: 'Open govern trace', primaryActionPath: '/govern/audit', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/govern': { intent: 'audit', primaryActionLabel: 'Open audit ledger', primaryActionPath: '/govern/audit', navGroup: 'engine', cognitiveLoad: 'high', demoPriority: 'P0', ctaBudget: 1, first5sMessage: 'Trace every decision with audit-ready transparency.' },
  '/govern/trust': { intent: 'audit', primaryActionLabel: 'Open oversight queue', primaryActionPath: '/govern/oversight', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/govern/audit': { intent: 'audit', primaryActionLabel: 'Open audit detail', primaryActionPath: '/govern/audit-detail', navGroup: 'engine', cognitiveLoad: 'high' },
  '/govern/audit-detail': { intent: 'audit', primaryActionLabel: 'Return to audit ledger', primaryActionPath: '/govern/audit', navGroup: 'engine', cognitiveLoad: 'high' },
  '/govern/registry': { intent: 'configure', primaryActionLabel: 'Open policy controls', primaryActionPath: '/govern/policy', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/govern/oversight': { intent: 'audit', primaryActionLabel: 'Return to dashboard', primaryActionPath: '/dashboard', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/govern/policy': { intent: 'configure', primaryActionLabel: 'Review settings', primaryActionPath: '/settings', navGroup: 'engine', cognitiveLoad: 'medium' },
  '/settings': { intent: 'configure', primaryActionLabel: 'Review rights controls', primaryActionPath: '/settings/rights', navGroup: 'settings', cognitiveLoad: 'medium', demoPriority: 'P0', ctaBudget: 1, first5sMessage: 'Configure controls without losing operational context.' },
  '/settings/ai': { intent: 'configure', primaryActionLabel: 'Open integrations', primaryActionPath: '/settings/integrations', navGroup: 'settings', cognitiveLoad: 'medium' },
  '/settings/integrations': { intent: 'configure', primaryActionLabel: 'Open rights controls', primaryActionPath: '/settings/rights', navGroup: 'settings', cognitiveLoad: 'medium' },
  '/settings/rights': { intent: 'configure', primaryActionLabel: 'Return to dashboard', primaryActionPath: '/dashboard', navGroup: 'settings', cognitiveLoad: 'high' },
  '/help': { intent: 'configure', primaryActionLabel: 'Open dashboard', primaryActionPath: '/dashboard', navGroup: 'settings', cognitiveLoad: 'low' },
  '/not-found': { intent: 'monitor', primaryActionLabel: 'Back to dashboard', primaryActionPath: '/dashboard', navGroup: 'public', cognitiveLoad: 'low' },
};

function resolveRouteUXMeta(meta: RouteUXMeta): ResolvedRouteUXMeta {
  return {
    ...meta,
    demoPriority: meta.demoPriority ?? 'P2',
    ctaBudget: meta.ctaBudget ?? 1,
  };
}

export function getRouteUXMeta(path: string): ResolvedRouteUXMeta | undefined {
  const normalized = path.split('?')[0];
  if (routeUxMeta[normalized]) return resolveRouteUXMeta(routeUxMeta[normalized]);

  if (normalized.startsWith('/onboarding/')) return resolveRouteUXMeta(routeUxMeta['/onboarding']);
  if (normalized.startsWith('/dashboard/')) return resolveRouteUXMeta(routeUxMeta['/dashboard']);
  if (normalized.startsWith('/protect/')) return resolveRouteUXMeta(routeUxMeta['/protect']);
  if (normalized.startsWith('/grow/')) return resolveRouteUXMeta(routeUxMeta['/grow']);
  if (normalized.startsWith('/execute/')) return resolveRouteUXMeta(routeUxMeta['/execute']);
  if (normalized.startsWith('/govern/')) return resolveRouteUXMeta(routeUxMeta['/govern']);
  if (normalized.startsWith('/settings/')) return resolveRouteUXMeta(routeUxMeta['/settings']);

  if (normalized === '/protect-v2') return resolveRouteUXMeta(routeUxMeta['/protect']);
  if (normalized === '/grow-v2') return resolveRouteUXMeta(routeUxMeta['/grow']);
  if (normalized === '/execute-v2') return resolveRouteUXMeta(routeUxMeta['/execute']);
  if (normalized === '/govern-v2') return resolveRouteUXMeta(routeUxMeta['/govern']);
  if (normalized === '/engines' || normalized === '/v3') return resolveRouteUXMeta(routeUxMeta['/dashboard']);
  if (normalized === '/onboarding-v2') return resolveRouteUXMeta(routeUxMeta['/onboarding']);

  return undefined;
}

const prefetchedRoutes = new Set<RoutePath>();

export async function prefetchRoute(path: RoutePath): Promise<void> {
  if (prefetchedRoutes.has(path)) return;

  const load = routeLoaders[path];
  if (!load) return;

  prefetchedRoutes.add(path);
  try {
    await load();
  } catch {
    prefetchedRoutes.delete(path);
  }
}

const comingSoonLoader = () => import('../pages/ComingSoon');

export const routes = Object.fromEntries(
  Object.entries(routeLoaders).map(([path, loader]) => [
    path,
    lazy(V0_READY_ROUTES.has(path as RoutePath) ? loader : comingSoonLoader),
  ]),
) as { [K in RoutePath]: ReturnType<typeof lazy> };
