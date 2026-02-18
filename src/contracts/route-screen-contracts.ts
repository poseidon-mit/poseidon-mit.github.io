import type { RouteScreenSlug, ScreenContract, ScreenId } from './screen-contract';
import { screenContractsV4 } from './screen-contracts-v4';

// ─── Canonical route → ScreenId mapping ───────────────────────────────────────

export const ROUTE_SCREEN_MAP: Record<string, ScreenId> = {
  // Public
  '/': 'S-V3-PUB01',
  '/trust': 'S-V3-PUB02',
  '/pricing': 'S-V3-PUB03',

  // Activation
  '/signup': 'S-V3-ACT01',
  '/login': 'S-V3-ACT02',
  '/recovery': 'S-V3-ACT03',
  '/onboarding/connect': 'S-V3-ACT04',
  '/onboarding/goals': 'S-V3-ACT05',
  '/onboarding/consent': 'S-V3-ACT06',
  '/onboarding/complete': 'S-V3-ACT07',

  // Core
  '/dashboard': 'S-V3-CORE01',
  '/dashboard/alerts': 'S-V3-CORE02',
  '/dashboard/insights': 'S-V3-CORE03',
  '/dashboard/timeline': 'S-V3-CORE04',
  '/dashboard/notifications': 'S-V3-CORE05',

  // Protect
  '/protect': 'S-V3-PRT01',
  '/protect/alert-detail': 'S-V3-PRT02',
  '/protect/dispute': 'S-V3-PRT03',

  // Grow
  '/grow': 'S-V3-GRW01',
  '/grow/goal': 'S-V3-GRW01',
  '/grow/scenarios': 'S-V3-GRW02',
  '/grow/recommendations': 'S-V3-GRW03',

  // Execute
  '/execute': 'S-V3-EXE01',
  '/execute/approval': 'S-V3-EXE02',
  '/execute/history': 'S-V3-EXE03',

  // Govern
  '/govern': 'S-V3-GOV01',
  '/govern/trust': 'S-V3-GOV01',
  '/govern/audit': 'S-V3-GOV02',
  '/govern/audit-detail': 'S-V3-GOV03',
  '/govern/registry': 'S-V3-GOV04',
  '/govern/oversight': 'S-V3-GOV05',
  '/govern/policy': 'S-V3-GOV06',

  // Settings
  '/settings': 'S-V3-SET01',
  '/settings/ai': 'S-V3-SET02',
  '/settings/integrations': 'S-V3-SET03',
  '/settings/rights': 'S-V3-SET04',

  // System
  '/help': 'S-V3-SYS01',
  '/not-found': 'S-V3-SYS02',
};

// ─── Compatibility aliases ────────────────────────────────────────────────────

export const COMPAT_ROUTE_ALIASES: Record<string, string> = {
  '/protect-v2': '/protect',
  '/grow-v2': '/grow',
  '/execute-v2': '/execute',
  '/govern-v2': '/govern',
  '/engines': '/dashboard',
  '/v3': '/dashboard',
  '/onboarding': '/onboarding/connect',
  '/onboarding-v2': '/onboarding/connect',
};

// ─── Slug → ScreenId mapping ─────────────────────────────────────────────────

const SLUG_SCREEN_MAP: Record<RouteScreenSlug, ScreenId> = {
  'landing': 'S-V3-PUB01',
  'trust': 'S-V3-PUB02',
  'pricing': 'S-V3-PUB03',
  'signup': 'S-V3-ACT01',
  'login': 'S-V3-ACT02',
  'recovery': 'S-V3-ACT03',
  'onboarding': 'S-V3-ACT04',
  'onboarding-connect': 'S-V3-ACT04',
  'onboarding-goals': 'S-V3-ACT05',
  'onboarding-consent': 'S-V3-ACT06',
  'onboarding-complete': 'S-V3-ACT07',
  'dashboard': 'S-V3-CORE01',
  'alerts-hub': 'S-V3-CORE02',
  'insights-feed': 'S-V3-CORE03',
  'activity-timeline': 'S-V3-CORE04',
  'notifications': 'S-V3-CORE05',
  'protect': 'S-V3-PRT01',
  'protect-alert-detail': 'S-V3-PRT02',
  'protect-dispute': 'S-V3-PRT03',
  'grow': 'S-V3-GRW01',
  'grow-scenarios': 'S-V3-GRW02',
  'grow-recommendations': 'S-V3-GRW03',
  'execute': 'S-V3-EXE01',
  'execute-approval': 'S-V3-EXE02',
  'execute-history': 'S-V3-EXE03',
  'govern': 'S-V3-GOV01',
  'govern-trust': 'S-V3-GOV01',
  'govern-audit': 'S-V3-GOV02',
  'govern-audit-detail': 'S-V3-GOV03',
  'govern-registry': 'S-V3-GOV04',
  'govern-oversight': 'S-V3-GOV05',
  'govern-policy': 'S-V3-GOV06',
  'settings': 'S-V3-SET01',
  'settings-ai': 'S-V3-SET02',
  'settings-integrations': 'S-V3-SET03',
  'settings-rights': 'S-V3-SET04',
  'help': 'S-V3-SYS01',
  'not-found': 'S-V3-SYS02',
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getRouteScreenId(slug: RouteScreenSlug): ScreenId {
  return SLUG_SCREEN_MAP[slug];
}

interface OnboardingContext {
  onboardingStepIndex?: number;
  onboardingCompleted?: boolean;
}

export function getRouteScreenContract(slug: RouteScreenSlug, ctx?: OnboardingContext): ScreenContract {
  if (slug === 'onboarding' && ctx) {
    if (ctx.onboardingCompleted) {
      return screenContractsV4[SLUG_SCREEN_MAP['onboarding-complete']];
    }
    const stepSlugs: RouteScreenSlug[] = ['onboarding-connect', 'onboarding-goals', 'onboarding-consent', 'onboarding-complete'];
    const resolvedSlug = stepSlugs[ctx.onboardingStepIndex ?? 0] ?? 'onboarding-connect';
    return screenContractsV4[SLUG_SCREEN_MAP[resolvedSlug]];
  }
  const screenId = getRouteScreenId(slug);
  return screenContractsV4[screenId];
}

export function getScreenContractByRoute(route: string): ScreenContract | undefined {
  const resolved = COMPAT_ROUTE_ALIASES[route] ?? route;
  const screenId = ROUTE_SCREEN_MAP[resolved];
  if (!screenId) return undefined;
  return screenContractsV4[screenId];
}

export function resolveRoute(route: string): string {
  return COMPAT_ROUTE_ALIASES[route] ?? route;
}
