import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { AppNav } from '../AppNav';
import { BackButton } from '../BackButton';
import { Breadcrumb } from '../Breadcrumb';
import { GovernFooter } from '../GovernFooter';
import { PageShellHero } from './PageShellHero';
import { PageShellKPIGrid } from './PageShellKPIGrid';
import { PageShellSlotGuard } from './PageShellSlotGuard';
import type { ScreenContract } from '../../contracts/screen-contract';
import { useRouter } from '../../router';

// ── Types ────────────────────────────────────────────────────

type AccentColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';

export type ShellLayout = 'dashboard' | 'engine';
export type SemanticMode = 'state-first' | 'engine-first';
export type HeroVariant = 'command' | 'focused' | 'analytical' | 'editorial' | 'minimal';

export interface KPIConfig {
  label: string;
  value: string;
  delta?: string;
  definition: string;
  accent?: AccentColor;
  sparklineData?: Array<{ value: number }>;
  sparklineColor?: string;
}

export interface HeroConfig {
  kicker: string;
  headline: string;
  subline: string;
  valueStatement?: string;
  evidenceLevel?: 'none' | 'basic' | 'strong';
  actionHint?: string;
  proofLine?: { claim: string; evidence: string; source: string };
  heroAction?: {
    label: string;
    text: string;
    cta?: { label: string; to: string };
  };
  freshness: Date;
  kpis: KPIConfig[];
  description?: string;
  statSummary?: string;
  modeHint?: 'focused' | 'analytical' | 'editorial' | 'minimal';
  showProofLine?: boolean;
  showTransitionCue?: boolean;
  engineBadge?: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  analyticalNotes?: string[];
}

interface PageShellBaseProps {
  slug: string;
  contract: ScreenContract;
  primaryFeed: React.ReactNode;
  decisionRail?: React.ReactNode;
  rail?: React.ReactNode;
  governControls?: React.ReactNode;
  fullWidth?: boolean;
  layout?: ShellLayout;
  semanticMode?: SemanticMode;
}

interface CommandPageShellProps extends PageShellBaseProps {
  heroVariant?: 'command';
  hero: HeroConfig & { proofLine: { claim: string; evidence: string; source: string } };
}

interface FocusedPageShellProps extends PageShellBaseProps {
  heroVariant: 'focused';
  hero: HeroConfig & { proofLine: { claim: string; evidence: string; source: string } };
}

interface AnalyticalPageShellProps extends PageShellBaseProps {
  heroVariant: 'analytical';
  hero: HeroConfig & { proofLine: { claim: string; evidence: string; source: string } };
}

interface EditorialPageShellProps extends PageShellBaseProps {
  heroVariant: 'editorial';
  hero: HeroConfig & { proofLine?: { claim: string; evidence: string; source: string } };
}

interface MinimalPageShellProps extends PageShellBaseProps {
  heroVariant: 'minimal';
  hero: HeroConfig & { proofLine?: { claim: string; evidence: string; source: string } };
}

export type PageShellProps =
  | CommandPageShellProps
  | FocusedPageShellProps
  | AnalyticalPageShellProps
  | EditorialPageShellProps
  | MinimalPageShellProps;

// ── Context ──────────────────────────────────────────────────

interface PageShellContextValue {
  slug: string;
  contract: ScreenContract;
  hero: HeroConfig;
  heroVariant: HeroVariant;
  heroHeadingId: string;
  layout: ShellLayout;
  fullWidth: boolean;
}

const PageShellContext = createContext<PageShellContextValue | null>(null);

export function usePageShell(): PageShellContextValue {
  const ctx = useContext(PageShellContext);
  if (!ctx) throw new Error('usePageShell must be used within <PageShell>');
  return ctx;
}

// ── Component ────────────────────────────────────────────────

export function PageShell({
  slug,
  contract,
  hero,
  heroVariant = 'command',
  primaryFeed,
  decisionRail,
  rail,
  governControls,
  fullWidth = false,
  layout = 'engine',
  semanticMode = 'state-first',
}: PageShellProps) {
  const { path } = useRouter();
  const commandClass =
    layout === 'dashboard'
      ? 'dashboard-command'
      : `engine-command${fullWidth ? ' engine-command--full-width' : ''}`;
  const heroHeadingId = `hero-heading-${slug}`;
  const titleBase = hero.headline || hero.kicker || 'Poseidon';
  const parentRouteLabel: Record<string, string> = {
    dashboard: 'Dashboard',
    protect: 'Protect',
    grow: 'Grow',
    execute: 'Execute',
    govern: 'Govern',
    settings: 'Settings',
  };
  const routeTitleLabel: Record<string, string> = {
    '/dashboard/alerts': 'Alerts',
    '/dashboard/insights': 'Insights',
    '/dashboard/timeline': 'Timeline',
    '/dashboard/notifications': 'Notifications',
    '/protect/alert-detail': 'Alert Detail',
    '/protect/dispute': 'Dispute',
    '/grow/scenarios': 'Scenarios',
    '/grow/recommendations': 'Recommendations',
    '/execute/approval': 'Approval',
    '/execute/history': 'History',
    '/govern/trust': 'Trust',
    '/govern/audit': 'Audit Ledger',
    '/govern/audit-detail': 'Audit Detail',
    '/govern/registry': 'Registry',
    '/govern/oversight': 'Oversight',
    '/govern/policy': 'Policy',
    '/settings/ai': 'AI',
    '/settings/integrations': 'Integrations',
    '/settings/rights': 'Rights',
  };
  const normalizedPath = path.split('?')[0];
  const routeSegments = normalizedPath.split('/').filter(Boolean);
  const primarySegment = routeSegments[0] ?? '';
  const showNavigationMeta =
    routeSegments.length > 1 && ['dashboard', 'protect', 'grow', 'execute', 'govern', 'settings'].includes(primarySegment);
  const breadcrumbItems = useMemo(() => {
    if (!showNavigationMeta) return [];
    const parent = `/${primarySegment}`;
    return [
      { label: parentRouteLabel[primarySegment] ?? 'Home', to: parent },
      { label: routeTitleLabel[normalizedPath] ?? titleBase },
    ];
  }, [normalizedPath, primarySegment, showNavigationMeta, titleBase]);

  const ctx: PageShellContextValue = {
    slug,
    contract,
    hero,
    heroVariant,
    heroHeadingId,
    layout,
    fullWidth,
  };

  useEffect(() => {
    document.title = `${titleBase} | Poseidon`;
  }, [titleBase]);

  useEffect(() => {
    if (import.meta.env.PROD) return;
    if (import.meta.env.VITE_DEBUG_HERO_CONTRACT !== '1') return;
    if (heroVariant === 'focused' && !hero.engineBadge) {
      console.warn(`[PageShell/${slug}] focused hero should provide engineBadge for clearer differentiation`);
    }
    if (heroVariant === 'analytical' && !hero.statSummary) {
      console.warn(`[PageShell/${slug}] analytical hero should provide statSummary`);
    }
  }, [hero.engineBadge, hero.statSummary, heroVariant, slug]);

  return (
    <PageShellContext.Provider value={ctx}>
      <div
        className={`entry-screen entry-screen--dashboard engine-page--${slug}`}
        data-screen-contract={contract.id}
        data-semantic-mode={semanticMode}
      >
        <PageShellSlotGuard />
        <div className={commandClass}>
          <AppNav />
          {showNavigationMeta && (
            <div className="entry-route-meta">
              <BackButton to={`/${primarySegment}`} label={`Back to ${parentRouteLabel[primarySegment] ?? 'Overview'}`} />
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}

          <section
            className={[
              layout === 'dashboard' ? 'dashboard-pulse' : 'engine-pulse',
              'command-grid-hero',
            ].join(' ')}
          >
            <PageShellHero variant={heroVariant} />

            <PageShellKPIGrid />
          </section>

          {rail ? <section className="command-grid-strip">{rail}</section> : null}

          <section
            className={[
              layout === 'dashboard' ? 'dashboard-main-col' : 'engine-main-col',
              'command-grid-main',
            ].join(' ')}
            data-slot="primary_feed"
            role="region"
            aria-labelledby={heroHeadingId}
          >
            {primaryFeed}
          </section>

          {!fullWidth && (
            <aside
              className={[
                layout === 'dashboard' ? 'dashboard-side-col' : 'engine-side-col',
                'command-grid-side',
              ].join(' ')}
              data-slot="decision_rail"
            >
              {decisionRail}
            </aside>
          )}

          {fullWidth && <aside data-slot="decision_rail" className="command-grid-side-hidden" aria-hidden="true" />}

          <div className="command-grid-footer" data-slot="govern_controls">
            {governControls ?? <GovernFooter />}
          </div>
          <div className="contract-widget-shadow" aria-hidden="true">
            <span data-widget="MissionSectionHeader" />
            <span data-widget="MissionStatusChip" />
            <span data-widget="MissionActionList" />
            <span data-widget="MissionMetadataStrip" />
            <span data-widget="EngineIconBadge" />
            <span data-widget="DashboardInsightsPanel" />
          </div>
        </div>
      </div>
    </PageShellContext.Provider>
  );
}
