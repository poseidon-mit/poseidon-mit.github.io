import React, { useState } from 'react';
import { Link } from '../router';
import { ContributionChart } from '../components/ContributionChart';
import { DefinitionLine } from '../components/DefinitionLine';
import { FactorsDropdown } from '../components/FactorsDropdown';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

const scenarios = [
  { id: 'A', name: 'Aggressive Savings', income: '+0%', expense: '-20%', projectedBalance: '$48,200', delta: '+$8,400', runway: '+42 days', confidence: 82, risk: 'Medium', tone: 'warning' as const },
  { id: 'B', name: 'Moderate Growth', income: '+10%', expense: '-5%', projectedBalance: '$44,600', delta: '+$4,800', runway: '+26 days', confidence: 91, risk: 'Low', tone: 'healthy' as const },
  { id: 'C', name: 'Conservative Hold', income: '+0%', expense: '+0%', projectedBalance: '$39,800', delta: '—', runway: 'Baseline', confidence: 96, risk: 'Minimal', tone: 'primary' as const },
];

const monthlyImpact = [
  { month: 'Mar', amount: 200 }, { month: 'Apr', amount: 350 },
  { month: 'May', amount: 480 }, { month: 'Jun', amount: 580 },
  { month: 'Jul', amount: 700 }, { month: 'Aug', amount: 800 },
  { month: 'Sep', amount: 950 }, { month: 'Oct', amount: 1100 },
  { month: 'Nov', amount: 1200 }, { month: 'Dec', amount: 1350 },
  { month: 'Jan', amount: 1500 }, { month: 'Feb', amount: 1680 },
];

const scenarioFactors = [
  { label: 'Income stability', contribution: 0.94, note: 'Monthly salary consistent for 18 months' },
  { label: 'Expense variance', contribution: 0.78, note: '15% monthly fluctuation detected' },
  { label: 'Savings rate impact', contribution: 0.85, note: 'Direct correlation to projection' },
  { label: 'Market conditions', contribution: 0.62, note: 'Low interest rate environment' },
  { label: 'Seasonal patterns', contribution: -0.15, note: 'Holiday spending offsets partial gains' },
];

const milestones = [
  { label: 'Scenario created', date: 'Today', status: 'completed' as const },
  { label: 'Monte Carlo run', date: 'Today', status: 'completed' as const },
  { label: 'Results compared', date: 'Today', status: 'current' as const },
  { label: 'Sent to Execute', date: 'Pending', status: 'upcoming' as const },
];

const horizonOptions = ['30d', '90d', '1yr'] as const;

/* ── component ────────────────────────────────────────────── */

export const GrowScenarios: React.FC = () => {
  const contract = getRouteScreenContract('grow-scenarios');
  const [activeScenario, setActiveScenario] = useState('B');
  const [horizon, setHorizon] = useState<(typeof horizonOptions)[number]>('1yr');
  const [incomeAdj, setIncomeAdj] = useState(10);
  const [expenseAdj, setExpenseAdj] = useState(-5);

  const selected = scenarios.find((s) => s.id === activeScenario) ?? scenarios[1];

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Scenario Controls */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Scenario Controls</h3>

        <div className="engine-card space-y-5">
          <label className="block">
            <span className="text-xs text-white/50 uppercase tracking-wider">Scenario Name</span>
            <input
              type="text"
              defaultValue={selected.name}
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </label>

          <div>
            <span className="text-xs text-white/50 uppercase tracking-wider">Income Adjustment: {incomeAdj > 0 ? '+' : ''}{incomeAdj}%</span>
            <input type="range" min={-50} max={100} value={incomeAdj} onChange={(e) => setIncomeAdj(Number(e.target.value))} className="mt-1 w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-white/30"><span>-50%</span><span>+100%</span></div>
          </div>

          <div>
            <span className="text-xs text-white/50 uppercase tracking-wider">Expense Adjustment: {expenseAdj > 0 ? '+' : ''}{expenseAdj}%</span>
            <input type="range" min={-50} max={50} value={expenseAdj} onChange={(e) => setExpenseAdj(Number(e.target.value))} className="mt-1 w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-white/30"><span>-50%</span><span>+50%</span></div>
          </div>

          <div>
            <span className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Forecast Horizon</span>
            <div className="flex gap-2">
              {horizonOptions.map((h) => (
                <button key={h} onClick={() => setHorizon(h)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${horizon === h ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>{h}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 rounded-lg bg-violet-500 text-white text-sm font-semibold py-2.5 hover:bg-violet-600 transition-colors">Run Scenario</button>
            <button className="rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-2.5 hover:bg-white/10 transition-colors">Reset</button>
          </div>
        </div>

        <ProofLine claim="10,000 Monte Carlo simulations per scenario" evidence="Confidence bands derived from historical variance analysis" source="ScenarioEngine v1.4" basis="12-month lookback" sourceType="model" />
      </section>

      {/* Forecast Chart placeholder */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Forecast Projection</h3>
        <div className="engine-card">
          <div className="h-48 rounded-lg bg-gradient-to-b from-violet-500/10 to-transparent border border-white/5 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-white/40">Forecast Band Chart</p>
              <p className="text-xs text-white/25 mt-1">Baseline (white) vs {selected.name} (violet dashed)</p>
              <p className="text-lg font-bold text-violet-400 mt-2">{selected.projectedBalance}</p>
            </div>
          </div>
          <DefinitionLine metric="Projected balance" formula="baseline + scenario_delta over horizon" unit="USD" period={horizon} />
        </div>
      </section>

      {/* Results Comparison */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Results Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline card */}
          <div className="engine-card border-l-2 border-white/20">
            <p className="text-xs text-white/50 uppercase tracking-wider">Baseline</p>
            <p className="text-2xl font-bold text-white mt-1">$39,800</p>
            <div className="mt-3 space-y-1 text-xs text-white/50">
              <p>Delta: <span className="text-white/70">—</span></p>
              <p>Runway: <span className="text-white/70">Baseline</span></p>
              <p>Confidence: <span className="text-white/70">96%</span></p>
            </div>
          </div>
          {/* Selected scenario card */}
          <div className="engine-card border-l-2 border-violet-500/60">
            <p className="text-xs text-violet-400 uppercase tracking-wider">{selected.name}</p>
            <p className="text-2xl font-bold text-white mt-1">{selected.projectedBalance}</p>
            <div className="mt-3 space-y-1 text-xs text-white/50">
              <p>Delta: <span className="text-violet-300">{selected.delta}</span></p>
              <p>Runway: <span className="text-violet-300">{selected.runway}</span></p>
              <p>Confidence: <span className="text-violet-300">{selected.confidence}%</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation */}
      <section className="engine-section">
        <div className="engine-card border-l-2 border-violet-500/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
              <span className="text-violet-400 text-sm">AI</span>
            </div>
            <div>
              <p className="text-sm text-white">Scenario B is achievable with <span className="text-violet-300 font-semibold">91% probability</span>.</p>
              <p className="text-xs text-white/50 mt-1">Based on your income stability and historical expense patterns, moderate growth has the best risk-adjusted return.</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Link to="/execute" className="entry-btn entry-btn--primary">Send to Execute</Link>
            <button className="entry-btn entry-btn--ghost">Save Scenario</button>
          </div>
          <ProofLine claim="91% achievability probability" evidence="Historical spending patterns + income stability analysis" source="ScenarioEngine v1.4" basis="Monte Carlo simulation" sourceType="model" />
        </div>
      </section>

      <GovernContractSet auditId="GV-2026-0216-SC01" modelVersion="ScenarioEngine v1.4" explanationVersion="xai-1.0" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      {/* Scenario selector */}
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Saved Scenarios</h4>
        <div className="space-y-2">
          {scenarios.map((s) => (
            <button key={s.id} onClick={() => setActiveScenario(s.id)} className={`w-full text-left rounded-lg p-3 transition-colors border ${activeScenario === s.id ? 'bg-violet-500/10 border-violet-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{s.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.tone === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : s.tone === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{s.risk}</span>
              </div>
              <p className="text-xs text-white/40 mt-1">Delta: {s.delta} | Conf: {s.confidence}%</p>
            </button>
          ))}
        </div>
      </article>

      {/* Confidence Ring */}
      <article className="engine-card flex flex-col items-center">
        <ScoreRing score={selected.confidence} maxScore={100} label="Confidence" size="md" color="var(--engine-grow)" />
        <p className="text-xs text-white/40 mt-2 text-center">Monte Carlo confidence for {selected.name}</p>
      </article>

      {/* Monthly Impact */}
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Monthly Impact</h4>
        <ContributionChart data={monthlyImpact} targetMonthly={500} accentColor="var(--engine-grow)" />
      </article>

      {/* Scenario Factors */}
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Projection Factors</h4>
        <FactorsDropdown allFactors={scenarioFactors} whyItMatters="These factors determine how scenario parameters translate into projected outcomes. Higher contribution means more influence on the final result." />
      </article>

      {/* Milestones */}
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Workflow</h4>
        <MilestonesTimeline milestones={milestones} accentColor="var(--accent-violet)" />
      </article>
    </>
  );

  return (
    <PageShell
      slug="grow"
      contract={contract}
      layout="engine"
      heroVariant="focused"
      hero={{
        kicker: 'Grow / Scenarios',
        headline: 'Model financial outcomes under different assumptions.',
        subline: 'Based on your patterns, a +$500/mo savings scenario extends your runway by 4.2 days.',
        proofLine: { claim: '10,000 Monte Carlo simulations', evidence: 'Confidence 0.91 | Horizon: 12 months', source: 'ScenarioEngine v1.4' },
        freshness: new Date(Date.now() - 10 * 60 * 1000),
        kpis: [
          { label: 'Scenarios', value: '3', accent: 'violet', definition: 'Active scenario comparisons' },
          { label: 'Best delta', value: '+$8.4k', accent: 'teal', definition: 'Best projected annual improvement' },
          { label: 'Avg confidence', value: '0.90', accent: 'cyan', definition: 'Mean scenario confidence' },
          { label: 'Horizon', value: '12 mo', accent: 'blue', definition: 'Projection window' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default GrowScenarios;
