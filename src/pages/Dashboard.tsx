import React, { useMemo, useState } from 'react';
import { Link } from '../router';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { DefinitionLine } from '../components/DefinitionLine';
import { GovernContractSet } from '../components/GovernContractSet';
import { GovernVerifiedBadge } from '../components/GovernVerifiedBadge';
import { AuditLinkChip } from '../components/AuditLinkChip';
import { HumanReviewCTA } from '../components/HumanReviewCTA';
import { EngineHealthStrip } from '../components/EngineHealthStrip';
import { TrustIndexCard } from '../components/TrustIndexCard';
import { ExplainableInsightPanel } from '../components/ExplainabilityPanel';
import { ForecastBandChart } from '../components/ForecastBandChart';
import { AlertsHub } from '../components/AlertsHub';
import { DashboardInsightsPanel } from '../components/DashboardInsightsPanel';
import { NetWorthHero } from '../components/NetWorthHero';
import { RiskScoreDial } from '../components/RiskScoreDial';
import { MissionActionList } from '../components/MissionActionList';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import type { MissionTone } from '../components/MissionStatusChip';
import { EngineIconBadge, type EngineKey } from '../components/EngineIconBadge';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import { generateCashFlowForecast } from '../services/mockGrow';
import { useTimeContext } from '../hooks/useTimeContext';

// ── Static mock data ─────────────────────────────────────────

const engineRows: Array<{ key: EngineKey; status: string; score: string; tone: 'teal' | 'violet' | 'amber' | 'blue' }> = [
  { key: 'Protect', status: '0 threats in 24h', score: '0.94', tone: 'teal' },
  { key: 'Grow', status: 'Forecast recalculated 2h ago', score: '0.89', tone: 'violet' },
  { key: 'Execute', status: '3 actions awaiting review', score: '0.91', tone: 'amber' },
  { key: 'Govern', status: 'Last audit pass: clean', score: '0.97', tone: 'blue' },
];

const trustComponents: Array<{ label: string; score: number; trend: 'up' | 'down' | 'stable' }> = [
  { label: 'Protect', score: 94, trend: 'stable' },
  { label: 'Grow', score: 89, trend: 'up' },
  { label: 'Execute', score: 91, trend: 'stable' },
  { label: 'Govern', score: 97, trend: 'up' },
];

const actionQueue = [
  { title: 'Consolidate 3 overlapping subscriptions', meta: 'Projected save $140/mo (92% confidence)', urgency: 'high' as const },
  { title: 'Adjust cash buffer target', meta: 'Current: 14d | Target: 21d (Protect threshold)', urgency: 'medium' as const },
  { title: 'Review flagged vendor risk', meta: 'Confidence 0.94 | Source: Protect anomaly detector', urgency: 'high' as const },
];

const urgencyTone: Record<string, MissionTone> = {
  high: 'warning',
  medium: 'primary',
  low: 'healthy',
};

const kpiSparklines = {
  netPosition: [{ value: 780 }, { value: 795 }, { value: 810 }, { value: 805 }, { value: 830 }, { value: 847 }],
  cashFlow: [{ value: 3.2 }, { value: 3.8 }, { value: 3.5 }, { value: 4.0 }, { value: 3.9 }, { value: 4.1 }],
  risk: [{ value: 3 }, { value: 2 }, { value: 2 }, { value: 1 }, { value: 1 }, { value: 1 }],
  alerts: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: 2 }, { value: 3 }, { value: 2 }],
};

// ── Component ────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<EngineKey>('Protect');
  const { period, greeting } = useTimeContext();
  const contract = getRouteScreenContract('dashboard');
  const forecastData = useMemo(() => generateCashFlowForecast(30), []);

  /* ── PRIMARY FEED (left column, 2/3 width) ── */
  const primaryFeed = (
    <>
      {/* Section 1: Trust Pulse */}
      <article className="dashboard-main-card">
        <MissionSectionHeader
          title="System trust"
          message="Composite confidence across all four engines."
        />
        <TrustIndexCard
          score={92}
          trend="stable"
          components={trustComponents}
          updatedAt="2 hours ago"
        />
        <ProofLine
          claim="Composite confidence 0.92"
          evidence="Protect 0.94 | Grow 0.89 | Execute 0.91 | Govern 0.97"
          source="Real-time weighted composite"
          sourceType="model"
        />
        <DefinitionLine
          metric="Trust index"
          formula="weighted_mean(engine_confidences)"
          unit="0-100 score"
          period="Rolling 30d"
          threshold="> 85"
        />
      </article>

      {/* Section 2: AI Insight / Explainable Panel */}
      <ExplainableInsightPanel
        title="Top recommendation rationale"
        summary="Consolidate 3 overlapping subscriptions across streaming, productivity, and storage. Combined monthly cost: $287. Deduplicated target: $147."
        topFactors={[
          { label: 'Cost overlap', contribution: 0.82, note: '$140/mo redundant' },
          { label: 'Usage frequency', contribution: 0.45, note: '2 of 3 used < 1x/week' },
          { label: 'Contract flexibility', contribution: 0.71, note: 'All month-to-month' },
        ]}
        confidence={0.92}
        recency="2h ago"
        governMeta={{
          auditId: 'GV-2026-0212-DASH-REC',
          modelVersion: 'v3.2',
          explanationVersion: 'xai-2.1',
          timestamp: new Date().toISOString(),
        }}
      />

      {/* Section 3: Cash flow forecast */}
      <article className="dashboard-main-card">
        <MissionSectionHeader
          title="Cash flow forecast"
          message={`Projection driven by ${selectedEngine} engine signals.`}
          right={
            <div className="dashboard-signal-header-right">
              <EngineIconBadge engine={selectedEngine} size={16} />
              <DefinitionLine
                metric="Forecast band"
                formula="monte_carlo(balance, signals)"
                unit="USD"
                period="30d forward"
              />
            </div>
          }
        />
        <div className="dashboard-chart-wrap">
          <ForecastBandChart data={forecastData} height={260} historicalCount={5} />
        </div>
        <ProofLine
          claim="30-day cash flow forecast"
          evidence="Monte Carlo simulation | 1000 paths | 90% confidence band"
          source="Grow engine model v3.2"
          sourceType="model"
        />
      </article>

      {/* Section 4: Alerts Hub */}
      <AlertsHub />

      {/* Section 5: Insights */}
      <div className="dashboard-insights-section">
        <DashboardInsightsPanel variant={period === 'morning' ? 'morning' : 'evening'} />
      </div>

      {/* Section 6: Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-DASH"
        modelVersion="v3.2"
        explanationVersion="xai-2.1"
      />
      <div className="dashboard-govern-footer">
        <GovernVerifiedBadge
          auditId="GV-2026-0215-DASH"
          modelVersion="v3.2"
          explanationVersion="xai-2.1"
        />
        <AuditLinkChip auditId="GV-2026-0215-DASH" />
        <HumanReviewCTA caseType="review" />
      </div>
    </>
  );

  /* ── DECISION RAIL (right column, 1/3 width) ── */
  const decisionRail = (
    <>
      {/* Net worth hero */}
      <article className="dashboard-side-card">
        <NetWorthHero
          total="$847,200"
          change="+$12,400 (+1.5%)"
          trend="up"
          period="vs last month"
          glowColor="var(--engine-grow)"
        />
      </article>

      {/* Risk gauge */}
      <article className="dashboard-side-card">
        <MissionSectionHeader title="Threat level" />
        <RiskScoreDial score={0.12} band="low" trend="down" trendDelta="-0.05" />
        <DefinitionLine
          metric="Composite risk"
          formula="max(signal_threats) * decay(time)"
          unit="0-1"
          period="24h rolling"
          threshold="< 0.30 = Low"
        />
        <ProofLine
          claim="Risk 0.12 -- Low"
          evidence="0 critical signals | 1 medium (resolved) | Trend: declining"
          source="Protect threat model"
          sourceType="model"
        />
      </article>

      {/* Next best actions */}
      <article className="dashboard-side-card">
        <MissionSectionHeader
          title="Next best actions"
          message="Ranked by projected impact across all engines."
        />
        <MissionActionList
          items={actionQueue.map((item) => ({
            title: item.title,
            meta: item.meta,
            tone: urgencyTone[item.urgency] ?? 'primary',
          }))}
        />
        <ProofLine
          claim="3 actions queued"
          evidence="Ranked by projected impact | All reviewed by model v3.2"
          source="Execute engine priority queue"
          sourceType="model"
        />
        <div className="dashboard-side-actions">
          <Link className="entry-btn entry-btn--ghost" to="/execute">Open action queue</Link>
          <Link className="entry-btn entry-btn--ghost" to="/govern">Audit trail</Link>
        </div>
      </article>

      {/* Activity timeline */}
      <article className="dashboard-side-card">
        <ActivityTimeline />
        <ProofLine
          claim="Cross-engine activity"
          evidence="Execute (2) | Protect (1) | Grow (1) | Govern (1)"
          source="Activity ledger"
          basis="last 12h"
          sourceType="system"
        />
      </article>
    </>
  );

  return (
    <PageShell
      slug="dashboard"
      contract={contract}
      layout="dashboard"
      heroVariant="command"
      hero={{
        kicker: 'Dashboard',
        headline: `${greeting}. System confidence: 0.92 across 4 engines.`,
        subline: 'One unresolved alert. Three actions queued. Cash buffer at 14 days.',
        valueStatement: 'Trust pulse nominal. Top recommendation: consolidate subscriptions.',
        proofLine: {
          claim: 'Composite confidence 0.92',
          evidence: 'Protect 0.94 | Grow 0.89 | Execute 0.91 | Govern 0.97 | All nominal',
          source: 'Real-time weighted composite',
        },
        heroAction: {
          label: 'Top recommendation:',
          text: 'Consolidate 3 overlapping subscriptions -- projected save $140/mo (92% confidence)',
          cta: { label: 'Review in Execute', to: '/execute' },
        },
        freshness: new Date(Date.now() - 2 * 60 * 60 * 1000),
        kpis: [
          {
            label: 'Net position',
            value: '$847k',
            delta: '+8.2%',
            definition: 'Sum of all linked account balances, net of pending transfers. Rolling 30d.',
            accent: 'teal',
            sparklineData: kpiSparklines.netPosition,
            sparklineColor: 'var(--state-healthy)',
          },
          {
            label: 'Cash flow',
            value: '+$4.1k',
            delta: '+12%',
            definition: 'Month-to-date inflow minus outflow across all payment channels.',
            accent: 'cyan',
            sparklineData: kpiSparklines.cashFlow,
            sparklineColor: '#00F0FF',
          },
          {
            label: 'Risk',
            value: 'Low',
            delta: 'Down from Med',
            definition: 'Composite threat score from Protect signals. Threshold: < 0.30 = Low.',
            accent: 'blue',
            sparklineData: kpiSparklines.risk,
            sparklineColor: 'var(--state-primary)',
          },
          {
            label: 'Alerts',
            value: '2',
            delta: '-3 resolved',
            definition: 'Unresolved alerts requiring human review. Source: cross-engine alert feed.',
            accent: 'amber',
            sparklineData: kpiSparklines.alerts,
            sparklineColor: 'var(--state-warning)',
          },
        ],
      }}
      rail={
        <EngineHealthStrip
          engines={engineRows}
          selected={selectedEngine}
          onSelect={setSelectedEngine}
        />
      }
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Dashboard;
