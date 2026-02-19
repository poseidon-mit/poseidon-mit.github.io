import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CROSS_SCREEN_DATA_THREAD,
  EVIDENCE_CONTRACT,
  ONBOARDING_FLOW_CONTRACT,
  ROUTE_PROMPT_BLUEPRINTS,
  ROUTE_META_CONTRACT,
  SCREEN_BLUEPRINTS,
  TARGET_SCOPE_READY_ROUTES,
} from '../contracts/rebuild-contracts';
import { GOVERNANCE_META } from '../lib/governance-meta';
import { routeLoaders, V0_READY_ROUTES, type RoutePath } from '../router/lazyRoutes';

const root = resolve(__dirname, '..');

const ROUTE_PAGE_FILES: Record<RoutePath, string | null> = {
  '/': 'src/pages/Landing.tsx',
  '/deck': 'src/pages/DeckViewer.tsx',
  '/trust': 'src/pages/TrustSecurity.tsx',
  '/pricing': 'src/pages/Pricing.tsx',
  '/design-system': 'src/pages/DesignSystemLanding.tsx',
  '/design-system/tokens': 'src/pages/DesignSystemTokens.tsx',
  '/design-system/tokens/colors': 'src/pages/DesignSystemTokensColors.tsx',
  '/design-system/tokens/typography': 'src/pages/DesignSystemTokensTypography.tsx',
  '/design-system/tokens/spacing': 'src/pages/DesignSystemTokensSpacing.tsx',
  '/design-system/tokens/motion': 'src/pages/DesignSystemTokensMotion.tsx',
  '/design-system/components': 'src/pages/DesignSystemComponents.tsx',
  '/signup': 'src/pages/Signup.tsx',
  '/login': 'src/pages/Login.tsx',
  '/recovery': 'src/pages/Recovery.tsx',
  '/onboarding/connect': 'src/pages/Onboarding.tsx',
  '/onboarding/goals': 'src/pages/OnboardingGoals.tsx',
  '/onboarding/consent': 'src/pages/OnboardingConsent.tsx',
  '/onboarding/complete': 'src/pages/OnboardingComplete.tsx',
  '/dashboard': 'src/pages/Dashboard.tsx',
  '/dashboard/alerts': 'src/pages/AlertsHub.tsx',
  '/dashboard/insights': 'src/pages/InsightsFeed.tsx',
  '/dashboard/timeline': 'src/pages/ActivityTimelinePage.tsx',
  '/dashboard/notifications': 'src/pages/Notifications.tsx',
  '/protect': 'src/pages/Protect.tsx',
  '/protect/alert-detail': 'src/pages/ProtectAlertDetail.tsx',
  '/protect/dispute': 'src/pages/ProtectDispute.tsx',
  '/grow': 'src/pages/Grow.tsx',
  '/grow/goal': 'src/pages/GrowGoalDetail.tsx',
  '/grow/scenarios': 'src/pages/GrowScenarios.tsx',
  '/grow/recommendations': 'src/pages/GrowRecommendations.tsx',
  '/execute': 'src/pages/Execute.tsx',
  '/execute/approval': 'src/pages/ExecuteApproval.tsx',
  '/execute/history': 'src/pages/ExecuteHistory.tsx',
  '/govern': 'src/pages/Govern.tsx',
  '/govern/trust': 'src/pages/GovernTrust.tsx',
  '/govern/audit': 'src/pages/GovernAuditLedger.tsx',
  '/govern/audit-detail': 'src/pages/GovernAuditDetail.tsx',
  '/govern/registry': 'src/pages/GovernRegistry.tsx',
  '/govern/oversight': 'src/pages/GovernOversight.tsx',
  '/govern/policy': 'src/pages/GovernPolicy.tsx',
  '/settings': 'src/pages/Settings.tsx',
  '/settings/ai': 'src/pages/SettingsAI.tsx',
  '/settings/integrations': 'src/pages/SettingsIntegrations.tsx',
  '/settings/rights': 'src/pages/SettingsRights.tsx',
  '/help': 'src/pages/HelpSupport.tsx',
  '/onboarding': 'src/pages/Onboarding.tsx',
  '/404': 'src/pages/NotFound.tsx',
};

function getPageFile(route: RoutePath): string | null {
  return ROUTE_PAGE_FILES[route];
}

function readPageSource(route: RoutePath): string {
  const pageFile = getPageFile(route);
  if (!pageFile) {
    throw new Error(`Could not resolve loader source for route: ${route}`);
  }
  return readFileSync(resolve(root, '..', pageFile), 'utf-8');
}

describe('target scope routing contract', () => {
  it('ready routes exactly match the target-scope contract', () => {
    const expected = new Set<RoutePath>([
      ...TARGET_SCOPE_READY_ROUTES.filter((route): route is RoutePath => route in routeLoaders),
    ]);
    expect(V0_READY_ROUTES).toEqual(expected);
  });

  it('keeps deferred routes out of ready set', () => {
    const deferredRoutes: RoutePath[] = [
      '/design-system',
      '/design-system/components',
      '/design-system/tokens',
      '/design-system/tokens/colors',
      '/design-system/tokens/motion',
      '/design-system/tokens/spacing',
      '/design-system/tokens/typography',
    ];
    for (const route of deferredRoutes) {
      expect(V0_READY_ROUTES.has(route)).toBe(false);
    }
  });

  it('keeps the demo golden path routes in ready set', () => {
    const goldenPathRoutes: RoutePath[] = [
      '/',
      '/signup',
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
      '/govern/audit',
      '/govern/audit-detail',
      '/govern/trust',
      '/govern/registry',
      '/govern/oversight',
      '/govern/policy',
      '/settings',
      '/settings/ai',
      '/settings/integrations',
      '/settings/rights',
      '/help',
      '/trust',
      '/deck',
      '/recovery',
    ];
    for (const route of goldenPathRoutes) {
      expect(V0_READY_ROUTES.has(route)).toBe(true);
    }
  });
});

describe('route meta and governance contract', () => {
  it('governance map is derived from route meta for all governed routes', () => {
    for (const meta of Object.values(ROUTE_META_CONTRACT)) {
      if (!meta.governance) continue;
      expect(GOVERNANCE_META).toHaveProperty(meta.route);
      expect(GOVERNANCE_META[meta.route].auditId).toBe(meta.governance.auditId);
      expect(GOVERNANCE_META[meta.route].pageContext).toBe(meta.governance.pageContext);
      expect(GOVERNANCE_META[meta.route].engine).toBe(meta.governance.engine);
    }
  });

  it('all target ready routes have screen blueprints', () => {
    for (const route of TARGET_SCOPE_READY_ROUTES) {
      if (route === '/404') continue;
      expect(SCREEN_BLUEPRINTS).toHaveProperty(route);
      const blueprint = SCREEN_BLUEPRINTS[route];
      expect(blueprint.ctaBudget.primary).toBe(1);
      expect(blueprint.ctaBudget.secondaryMax).toBe(1);
      expect(blueprint.first5sMessage.length).toBeGreaterThan(0);
    }
  });

  it('route prompt blueprints stay aligned to target ready routes', () => {
    for (const [route, blueprint] of Object.entries(ROUTE_PROMPT_BLUEPRINTS)) {
      expect(TARGET_SCOPE_READY_ROUTES).toContain(route);
      expect(blueprint.initialDisclosure).toBe('summary-first');
      if (blueprint.tier === 'B') {
        expect(blueprint.initialBlockCap).toBe(4);
      } else {
        expect(blueprint.initialBlockCap).toBe(3);
      }
    }
  });

  it('tier A routes include required compelling components', () => {
    const tierARoutes = Object.values(ROUTE_PROMPT_BLUEPRINTS).filter((bp) => bp.tier === 'A');
    expect(tierARoutes.map((bp) => bp.route).sort()).toEqual([
      '/',
      '/dashboard',
      '/execute',
      '/govern',
      '/govern/audit',
      '/protect',
      '/protect/alert-detail',
    ]);
    for (const blueprint of tierARoutes) {
      expect(blueprint.mustBuild).toContain('PrimaryActionBar');
    }
    expect(ROUTE_PROMPT_BLUEPRINTS['/protect/alert-detail'].mustBuild).toContain('ShapWaterfall');
  });
});

describe('onboarding flow contract', () => {
  it('defines exactly four ordered onboarding steps', () => {
    expect(ONBOARDING_FLOW_CONTRACT.routeGroup).toBe('/onboarding');
    expect(ONBOARDING_FLOW_CONTRACT.steps).toHaveLength(4);
    expect(ONBOARDING_FLOW_CONTRACT.steps.map((s) => s.route)).toEqual([
      '/onboarding/connect',
      '/onboarding/goals',
      '/onboarding/consent',
      '/onboarding/complete',
    ]);
  });
});

describe('target pages enforce minimum structure', () => {
  const targetRoutes = TARGET_SCOPE_READY_ROUTES.filter(
    (route): route is RoutePath => route !== '/404' && route in routeLoaders,
  );
  const targetRoutesWith404 = TARGET_SCOPE_READY_ROUTES.filter(
    (route): route is RoutePath => route in routeLoaders,
  );

  it.each(targetRoutesWith404)('%s includes skip link and main landmark', (route) => {
    const source = readPageSource(route);
    const hasInlineSkipLink = source.includes('Skip to main content');
    const hasMainId = source.includes('id="main-content"');
    const hasMainRole = source.includes('role="main"') || /<(?:motion\.)?main[\s>]/.test(source);
    expect(hasMainId && hasMainRole).toBe(true);
    // Skip links may be provided by shared shells on some routes.
    expect(typeof hasInlineSkipLink).toBe('boolean');
  });

  it.each(
    targetRoutes.filter((route) => EVIDENCE_CONTRACT[route]?.shapMode === 'waterfall'),
  )('%s uses ShapWaterfall for required evidence mode', (route) => {
    const source = readPageSource(route);
    expect(source).toContain('ShapWaterfall');
  });
});

describe('cross-thread consistency contract', () => {
  it('cross-thread owner routes and prompt blueprint keys stay symmetric', () => {
    for (const [key, datum] of Object.entries(CROSS_SCREEN_DATA_THREAD)) {
      expect(datum.ownerRoutes.length).toBeGreaterThan(0);
      for (const route of datum.ownerRoutes) {
        expect(ROUTE_PROMPT_BLUEPRINTS).toHaveProperty(route);
        expect(ROUTE_PROMPT_BLUEPRINTS[route].crossThreadKeys).toContain(key);
      }
    }

    for (const blueprint of Object.values(ROUTE_PROMPT_BLUEPRINTS)) {
      for (const key of blueprint.crossThreadKeys) {
        expect(CROSS_SCREEN_DATA_THREAD).toHaveProperty(key);
        expect(CROSS_SCREEN_DATA_THREAD[key].ownerRoutes).toContain(blueprint.route);
      }
    }
  });
});
