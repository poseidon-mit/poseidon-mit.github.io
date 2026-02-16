import React, { useState, useMemo } from 'react';
import { Link } from '../router';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import type { CategoryScore } from '../components/CategoryScoreBar';
import { ContributionChart } from '../components/ContributionChart';
import { DefinitionLine } from '../components/DefinitionLine';
import { ForecastBandChart } from '../components/ForecastBandChart';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { MissionActionList } from '../components/MissionActionList';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { NetWorthHero } from '../components/NetWorthHero';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { SavingsGoalCard } from '../components/SavingsGoalCard';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import {
  generateCashFlowForecast,
  mockGrowStats,
  mockSavingsGoals,
} from '../services/mockGrow';

// ── Static data ──────────────────────────────────────────────

const healthCategories: CategoryScore[] = [
  { name: 'Savings rate', score: 85, icon: DollarSign, color: 'var(--accent-violet)' },
  { name: 'Debt ratio', score: 72, icon: TrendingUp, color: 'var(--accent-violet)' },
  { name: 'Income growth', score: 81, icon: TrendingUp, color: 'var(--accent-violet)' },
  { name: 'Investment', score: 74, icon: Target, color: 'var(--accent-violet)' },
];

const growMilestones: Milestone[] = [
  { label: 'Emergency fund started', date: 'Jan 2026', status: 'completed' },
  { label: '$5k milestone', date: 'Jan 28', status: 'completed' },
  { label: '$8k milestone', date: 'Feb 10', status: 'completed' },
  { label: '$12k target', date: 'May 2026 (projected)', status: 'upcoming' },
  { label: '6-month runway', date: 'Aug 2026', status: 'future' },
];

const monthlyContributions = [
  { month: 'Sep', amount: 1400 },
  { month: 'Oct', amount: 1650 },
  { month: 'Nov', amount: 1800 },
  { month: 'Dec', amount: 1950 },
  { month: 'Jan', amount: 2000 },
  { month: 'Feb', amount: 2100 },
];

const kpiSparklines = {
  netWorth: [{ value: 780 }, { value: 795 }, { value: 810 }, { value: 825 }, { value: 840 }, { value: 847 }],
  savings: [{ value: 1.4 }, { value: 1.6 }, { value: 1.8 }, { value: 1.9 }, { value: 2.0 }, { value: 2.1 }],
  goals: [{ value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }, { value: 3 }, { value: 3 }],
  confidence: [{ value: 0.85 }, { value: 0.86 }, { value: 0.87 }, { value: 0.88 }, { value: 0.89 }, { value: 0.89 }],
};

// ── Component ────────────────────────────────────────────────

export const Grow: React.FC = () => {
  const [forecastDays, setForecastDays] = useState(30);
  const contract = getRouteScreenContract('grow');
  const cashFlowData = useMemo(() => generateCashFlowForecast(forecastDays), [forecastDays]);
  const currentBalance = cashFlowData[0]?.balance || 0;
  const projectedBalance = cashFlowData[cashFlowData.length - 1]?.balance || 0;
  const balanceChange = projectedBalance - currentBalance;
  const endConfidence = cashFlowData[cashFlowData.length - 1]?.confidence || 0;

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Net worth hero */}
      <article className="engine-card">
        <NetWorthHero
          total="$847,200"
          change="+$12,400 (+1.5%)"
          trend="up"
          period="this quarter"
          glowColor="var(--engine-grow)"
        />
      </article>

      {/* Forecast chart */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Cash flow forecast"
          message="Monte Carlo simulation with 10,000 paths. Updated every 6 hours."
          right={
            <MissionStatusChip
              tone={balanceChange >= 0 ? 'healthy' : 'warning'}
              label={`${forecastDays}d horizon`}
            />
          }
        />
        <div className="grow-forecast-controls">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              type="button"
              className={forecastDays === days ? 'entry-btn entry-btn--primary' : 'entry-btn entry-btn--ghost'}
              onClick={() => setForecastDays(days)}
            >
              {days}d
            </button>
          ))}
        </div>
        <ForecastBandChart
          data={cashFlowData}
          height={320}
          historicalCount={Math.min(5, forecastDays)}
        />
        <ProofLine
          claim={`${forecastDays}-day forecast`}
          evidence={`Projected ${balanceChange >= 0 ? '+' : ''}$${Math.abs(balanceChange).toLocaleString()} | Confidence ${endConfidence}%`}
          source="GrowthForecast v3.2"
          basis="180-day pattern analysis"
          sourceType="model"
        />
        <DefinitionLine
          metric="Forecast confidence"
          formula="ensemble(LSTM, ARIMA, seasonal)"
          unit="percentage"
          period={`${forecastDays} days rolling`}
          threshold="> 80%"
        />
      </article>

      {/* Goal cards */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Savings goals"
          message="Progress toward active financial goals."
          right={<MissionStatusChip tone="healthy" label={`${mockGrowStats.goalsOnTrack}/${mockGrowStats.totalGoals} on track`} />}
        />
        <div className="engine-item-list">
          {mockSavingsGoals.map((goal) => (
            <SavingsGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
        <ProofLine
          claim={`${mockGrowStats.goalsOnTrack} of ${mockGrowStats.totalGoals} goals on track`}
          evidence={`${mockGrowStats.forecastAccuracy}% forecast accuracy | Updated 6h ago`}
          source="Goal tracker v2.1"
          sourceType="model"
        />
      </section>

      {/* Contribution chart */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Monthly contributions"
          message="Contribution history with target line."
        />
        <ContributionChart
          data={monthlyContributions}
          targetMonthly={2000}
          accentColor="var(--engine-grow)"
        />
      </article>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-GRW"
        modelVersion="GrowthForecast v3.2"
        explanationVersion="SHAP v2.1"
      />
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Financial health score */}
      <article className="engine-card">
        <ScoreRing
          score={78}
          label="Financial Health"
          subtitle="/ 100"
          statusText="Good"
          color="var(--accent-violet)"
          size="lg"
        />
      </article>

      {/* Category breakdown */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Health categories"
          message="Score breakdown by financial dimension."
        />
        <CategoryScoreBar categories={healthCategories} iconAccent="var(--accent-violet)" />
      </article>

      {/* Goal milestones */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Goal milestones"
          message="Progress toward key financial targets."
        />
        <MilestonesTimeline
          milestones={growMilestones}
          accentColor="var(--accent-violet)"
        />
      </article>

      {/* AI recommendation */}
      <article className="engine-card">
        <MissionSectionHeader title="AI recommendation" />
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            Increasing monthly savings by $200 would accelerate emergency fund goal by 2.3 months.
          </p>
        </div>
        <ProofLine
          claim="Acceleration possible"
          evidence="+$200/mo brings completion to Mar 2026"
          source="GrowthForecast v3.2"
          sourceType="model"
        />
      </article>

      {/* Navigation */}
      <div className="mission-dual-actions">
        <Link className="entry-btn entry-btn--ghost" to="/grow/scenarios">Scenario simulator</Link>
        <Link className="entry-btn entry-btn--ghost" to="/govern">Audit trail</Link>
      </div>
    </>
  );

  return (
    <PageShell
      slug="grow"
      contract={contract}
      layout="engine"
      heroVariant="focused"
      hero={{
        kicker: 'Grow',
        engineBadge: 'Grow',
        headline: 'Net worth trajectory: +8.2% this quarter. 3 goals on track.',
        subline: 'Monte Carlo forecast with 10,000 simulations. Updated every 6 hours.',
        proofLine: {
          claim: 'Forecast confidence 0.89',
          evidence: 'Simulations: 10,000 | Model: GrowthForecast v3.2 | Basis: 180-day pattern analysis',
          source: 'Grow engine',
        },
        heroAction: {
          label: 'AI insight:',
          text: 'Increasing monthly savings by $200 would accelerate emergency fund goal by 2.3 months.',
          cta: { label: 'Send to Execute', to: '/execute' },
        },
        freshness: new Date(Date.now() - 6 * 60 * 60 * 1000),
        kpis: [
          {
            label: 'Net worth',
            value: '$847k',
            delta: '+8.2%',
            definition: 'Total net worth across all linked accounts.',
            accent: 'teal',
            sparklineData: kpiSparklines.netWorth,
            sparklineColor: 'var(--state-healthy)',
          },
          {
            label: 'Monthly savings',
            value: '$2.1k',
            delta: '+12%',
            definition: 'Total saved this month across all goals.',
            accent: 'violet',
            sparklineData: kpiSparklines.savings,
            sparklineColor: 'var(--engine-grow)',
          },
          {
            label: 'Goals on track',
            value: '3/4',
            definition: 'Goals projected to meet target on time.',
            accent: 'cyan',
            sparklineData: kpiSparklines.goals,
            sparklineColor: '#00F0FF',
          },
          {
            label: 'Forecast confidence',
            value: '0.89',
            definition: 'Statistical confidence of primary forecast path.',
            accent: 'blue',
            sparklineData: kpiSparklines.confidence,
            sparklineColor: 'var(--state-primary)',
          },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Grow;
