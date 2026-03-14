import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CROSS_SCREEN_DATA_THREAD,
  EVIDENCE_CONTRACT,
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
  '/onboarding/connect': 'src/pages/OnboardingRedirect.tsx',
  '/onboarding/goals': 'src/pages/OnboardingRedirect.tsx',
  '/onboarding/consent': 'src/pages/OnboardingRedirect.tsx',
  '/onboarding/complete': 'src/pages/OnboardingRedirect.tsx',
  '/onboarding/priorities': 'src/pages/OnboardingRedirect.tsx',
  '/onboarding/activate': 'src/pages/OnboardingRedirect.tsx',
  '/onboarding-v2': 'src/pages/OnboardingRedirect.tsx',
  '/chat': 'src/pages/Chat.tsx',
  '/talk': 'src/pages/Chat.tsx',
  '/dashboard': 'src/pages/Dashboard.tsx',
  '/dashboard/alerts': 'src/pages/AlertsHub.tsx',
  '/dashboard/insights': 'src/pages/InsightsFeed.tsx',
  '/dashboard/timeline': 'src/pages/ActivityTimelinePage.tsx',
  '/dashboard/notifications': 'src/pages/Notifications.tsx',
  '/protect': 'src/pages/protect/Protect.tsx',
  '/protect/alert-detail': 'src/pages/protect/ProtectAlertDetail.tsx',
  '/protect/threats': 'src/pages/protect/ProtectThreats.tsx',
  '/grow': 'src/pages/Grow.tsx',
  '/grow/goal': 'src/pages/GrowGoalDetail.tsx',
  '/grow/scenarios': 'src/pages/GrowScenarios.tsx',
  '/grow/recommendations': 'src/pages/GrowRecommendations.tsx',
  '/execute': 'src/pages/Execute.tsx',
  '/execute/approval': 'src/pages/ExecuteApproval.tsx',
  '/execute/history': 'src/pages/ExecuteHistory.tsx',
  '/execute/queue': 'src/pages/ExecuteQueue.tsx',
  '/govern': 'src/pages/Govern.tsx',
  '/govern/trust': 'src/pages/GovernTrust.tsx',
  '/govern/audit': 'src/pages/GovernAuditLedger.tsx',
  '/govern/audit-detail': 'src/pages/GovernAuditDetail.tsx',
  '/govern/registry': 'src/pages/GovernRegistry.tsx',
  '/govern/oversight': 'src/pages/GovernOversight.tsx',
  '/govern/policy': 'src/pages/GovernPolicy.tsx',
  '/settings': 'src/pages/Settings.tsx',
  '/settings/ai': 'src/pages/Settings.tsx',
  '/settings/integrations': 'src/pages/Settings.tsx',
  '/settings/rights': 'src/pages/Settings.tsx',
  '/help': 'src/pages/HelpSupport.tsx',
  '/share': 'src/pages/ShareFiles.tsx',
  '/grow/recommendation': 'src/pages/grow/GrowRecommendationDetail.tsx',
  '/onboarding': 'src/pages/OnboardingRedirect.tsx',
  '/404': 'src/pages/NotFound.tsx',
  '/test/spectacular': 'src/pages/TestSpectacular.tsx',
  '/orchestrator': 'src/pages/orchestrator/OrchestratorWorkbench.tsx',
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
      '/login',
      '/dashboard',
      '/dashboard/notifications',
      '/protect',
      '/protect/alert-detail',
      '/protect/threats',
      '/grow',
      '/grow/goal',
      '/grow/scenarios',
      '/grow/recommendations',
      '/grow/recommendation',
      '/execute',
      '/execute/approval',
      '/execute/history',
      '/execute/queue',
      '/govern',
      '/govern/audit',
      '/govern/audit-detail',
      '/settings',
      '/settings/ai',
      '/settings/integrations',
      '/settings/rights',
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

describe('target pages enforce minimum structure', () => {
  const targetRoutes = TARGET_SCOPE_READY_ROUTES.filter(
    (route): route is RoutePath => route !== '/404' && route in routeLoaders,
  );
  const targetRoutesWith404 = TARGET_SCOPE_READY_ROUTES.filter(
    (route): route is RoutePath => route in routeLoaders,
  );

  it.each(targetRoutesWith404)('%s includes skip link and main landmark', (route) => {
    const source = readPageSource(route);
    const meta = ROUTE_META_CONTRACT[route];
    const hasInlineSkipLink = source.includes('Skip to main content');
    const hasMainId = source.includes('id="main-content"');
    const hasMainRole = source.includes('role="main"') || /<(?:motion\.)?main[\s>]/.test(source);
    const hasSharedMainShell =
      source.includes('AuthShell') ||
      source.includes('OnboardingShell') ||
      meta?.navType === 'app-shell' ||
      meta?.navType === 'public-topbar' ||
      meta?.navType === 'onboarding-shell' ||
      meta?.navType === 'system-shell';
    expect((hasMainId && hasMainRole) || hasSharedMainShell).toBe(true);
    expect(typeof hasInlineSkipLink).toBe('boolean');
  });

  it.each(
    targetRoutes.filter((route) => EVIDENCE_CONTRACT[route]?.shapMode === 'waterfall'),
  )('%s uses ShapWaterfall for required evidence mode', (route) => {
    const source = readPageSource(route);
    expect(source).toContain('ShapWaterfall');
  });

  it('anchors demo-critical timeline pages to March 2026 absolute dates', () => {
    const anchorSources = [
      { file: 'src/lib/demo-date.ts', marker: '2026-03-19' },
      { file: 'src/pages/ExecuteApproval.tsx', marker: 'March 19, 2026 anchor' },
      { file: 'src/lib/govern-audit-data.ts', marker: '2026-03-10' },
    ];

    for (const { file, marker } of anchorSources) {
      const source = readFileSync(resolve(root, '..', file), 'utf-8');
      expect(source).toContain(marker);
    }
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

  it('keeps canonical critical alert references on golden-path pages', () => {
    const routeSelectorContracts: Array<{ route: RoutePath; expected: string[] }> = [
      { route: '/dashboard', expected: ['selectDashboardHeroView'] },
      { route: '/protect', expected: ['selectProtectHeroView'] },
      { route: '/protect/alert-detail', expected: ['THREATS', 'selectThreatFactors'] },
      { route: '/execute/approval', expected: ['selectExecuteActionById'] },
    ];

    for (const { route, expected } of routeSelectorContracts) {
      const source = readPageSource(route);
      for (const marker of expected) {
        expect(source).toContain(marker);
      }
      expect(source).not.toContain('MerchantX');
      expect(source).not.toContain('$4,200');
    }
  });
});
