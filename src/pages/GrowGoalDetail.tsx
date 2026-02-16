import React from 'react';
import { Link } from '../router';
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import type { CategoryScore } from '../components/CategoryScoreBar';
import { ContributionChart } from '../components/ContributionChart';
import { DefinitionLine } from '../components/DefinitionLine';
import { ForecastBandChart } from '../components/ForecastBandChart';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import { generateCashFlowForecast, mockSavingsGoals } from '../services/mockGrow';

// ── Static data ──────────────────────────────────────────────

const goal = mockSavingsGoals[0];
const progressPct = Math.round((goal.current / goal.target) * 100);
const remaining = goal.target - goal.current;

const contributionData = [
  { month: 'Sep', amount: 400 }, { month: 'Oct', amount: 500 },
  { month: 'Nov', amount: 450 }, { month: 'Dec', amount: 550 },
  { month: 'Jan', amount: 500 }, { month: 'Feb', amount: 520 },
];

const goalMilestones: Milestone[] = [
  { label: 'Goal created', date: 'Jan 2026', status: 'completed' },
  { label: '$2k saved', date: 'Jan 15', status: 'completed' },
  { label: '$5k saved', date: 'Feb 1', status: 'completed' },
  { label: '$8k saved (current)', date: 'Feb 15', status: 'upcoming' },
  { label: '$12k target', date: 'May 2026', status: 'future' },
];

const healthCategories: CategoryScore[] = [
  { name: 'Savings rate', score: 85, icon: DollarSign, color: 'var(--accent-violet)' },
  { name: 'Consistency', score: 78, icon: TrendingUp, color: 'var(--accent-violet)' },
  { name: 'Growth rate', score: 72, icon: Target, color: 'var(--accent-violet)' },
];

const kpiSparklines = {
  progress: [{ value: 40 }, { value: 48 }, { value: 55 }, { value: 60 }, { value: 65 }, { value: 68 }],
  monthly: [{ value: 400 }, { value: 450 }, { value: 480 }, { value: 490 }, { value: 500 }, { value: 500 }],
  confidence: [{ value: 0.83 }, { value: 0.84 }, { value: 0.85 }, { value: 0.86 }, { value: 0.87 }, { value: 0.87 }],
  completion: [{ value: 8 }, { value: 7 }, { value: 6 }, { value: 5 }, { value: 4 }, { value: 3 }],
};

const forecastData = generateCashFlowForecast(90);

// ── Component ────────────────────────────────────────────────

export const GrowGoalDetail: React.FC = () => {
  const contract = getRouteScreenContract('grow');

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Progress ring */}
      <article className="engine-card">
        <ScoreRing
          score={progressPct}
          label="Progress"
          subtitle={`$${goal.current.toLocaleString()} of $${goal.target.toLocaleString()}`}
          statusText={`On track -- ${progressPct}% complete`}
          color="var(--accent-violet)"
          size="lg"
        />
      </article>

      {/* Contribution chart */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Monthly contributions"
          message="12-month contribution history with target line."
        />
        <ContributionChart
          data={contributionData}
          targetMonthly={500}
          accentColor="var(--engine-grow)"
        />
        <DefinitionLine
          metric="Progress"
          formula="sum(contributions) / target"
          unit="percentage"
          period="cumulative"
          threshold="100% = goal met"
        />
      </article>

      {/* Forecast */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Projected savings trajectory"
          message="Confidence band forecast crossing the $12,000 line in May 2026."
        />
        <ForecastBandChart data={forecastData} height={260} historicalCount={5} />
        <ProofLine
          claim="Projected completion: May 2026"
          evidence="Confidence 0.87 | Model: GoalTracker v2.1"
          source="Grow engine"
          sourceType="model"
        />
      </article>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-GRW-GOAL"
        modelVersion="GoalTracker v2.1"
        explanationVersion="SHAP v2.1"
      />
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Category breakdown */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Goal health"
          message="Score breakdown by savings dimension."
        />
        <CategoryScoreBar categories={healthCategories} iconAccent="var(--accent-violet)" />
      </article>

      {/* Milestones */}
      <article className="engine-card">
        <MissionSectionHeader title="Goal milestones" />
        <MilestonesTimeline
          milestones={goalMilestones}
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
            Increasing monthly contribution by $100 would accelerate completion by 3 weeks.
          </p>
        </div>
        <ProofLine
          claim="Acceleration possible"
          evidence="+$100/mo brings completion to early May 2026"
          source="GoalTracker v2.1"
          sourceType="model"
        />
      </article>

      {/* Navigation */}
      <div className="mission-dual-actions">
        <Link className="entry-btn entry-btn--primary" to="/execute">Add funds</Link>
        <Link className="entry-btn entry-btn--ghost" to="/grow">Back to Grow</Link>
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
        kicker: 'Grow / Goal',
        engineBadge: 'Grow',
        headline: `Emergency Fund -- $${goal.target.toLocaleString()} target`,
        subline: `On track -- ${progressPct}% complete. Projected completion: May 2026. Confidence 0.87.`,
        proofLine: {
          claim: `Projected completion: May 2026 | Confidence 0.87`,
          evidence: `Model: GoalTracker v2.1 | ${progressPct}% progress`,
          source: 'Grow engine',
        },
        freshness: new Date(Date.now() - 6 * 60 * 60 * 1000),
        kpis: [
          { label: 'Progress', value: `${progressPct}%`, definition: 'Current vs target savings.', accent: 'violet', sparklineData: kpiSparklines.progress, sparklineColor: 'var(--engine-grow)' },
          { label: 'Monthly avg', value: '$500', definition: 'Average monthly contribution.', accent: 'teal', sparklineData: kpiSparklines.monthly, sparklineColor: 'var(--state-healthy)' },
          { label: 'Confidence', value: '0.87', definition: 'Likelihood of reaching goal on time.', accent: 'cyan', sparklineData: kpiSparklines.confidence, sparklineColor: '#00F0FF' },
          { label: 'Months left', value: '3', definition: 'Estimated months to goal completion.', accent: 'amber', sparklineData: kpiSparklines.completion, sparklineColor: 'var(--state-warning)' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default GrowGoalDetail;
