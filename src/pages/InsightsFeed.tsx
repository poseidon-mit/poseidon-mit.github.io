import React, { useState } from 'react';
import { Link } from '../router';
import { ContributionChart } from '../components/ContributionChart';
import { GovernContractSet } from '../components/GovernContractSet';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

interface Insight {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  category: 'actionable' | 'informational' | 'warning';
  title: string;
  body: string;
  confidence: number;
  impact: string;
  time: string;
  shapFactors: Array<{ label: string; value: number }>;
}

const insights: Insight[] = [
  { id: 'INS-001', engine: 'Grow', category: 'actionable', title: 'Subscription consolidation opportunity', body: 'Three overlapping services detected. Consolidating could save $140/mo with minimal disruption.', confidence: 0.89, impact: '+$140/mo', time: '5m ago', shapFactors: [{ label: 'Service overlap', value: 0.92 }, { label: 'Cost impact', value: 0.88 }, { label: 'Usage frequency', value: 0.45 }] },
  { id: 'INS-002', engine: 'Protect', category: 'warning', title: 'Recurring charge spike — vendor anomaly', body: 'Monthly charges from 3 vendors increased 23% over 60 days without corresponding service changes.', confidence: 0.84, impact: 'Risk alert', time: '15m ago', shapFactors: [{ label: 'Charge variance', value: 0.87 }, { label: 'Historical baseline', value: 0.81 }, { label: 'Pattern deviation', value: 0.76 }] },
  { id: 'INS-003', engine: 'Execute', category: 'actionable', title: 'Optimal save-day identified — transfer on 3rd', body: 'Based on income timing, transferring surplus on the 3rd yields 12% higher savings rate.', confidence: 0.91, impact: '+12% yield', time: '1h ago', shapFactors: [{ label: 'Income timing', value: 0.94 }, { label: 'Buffer adequacy', value: 0.82 }, { label: 'Expense clustering', value: 0.68 }] },
  { id: 'INS-004', engine: 'Grow', category: 'actionable', title: 'Emergency fund at 68% — accelerate possible', body: 'Increasing monthly contribution by $100 would accelerate completion by 3 weeks.', confidence: 0.87, impact: '-3 weeks', time: '2h ago', shapFactors: [{ label: 'Income stability', value: 0.94 }, { label: 'Budget headroom', value: 0.76 }] },
  { id: 'INS-005', engine: 'Protect', category: 'informational', title: 'Model retrained — FraudDetection v3.3', body: 'FraudDetection model updated with latest transaction patterns. Accuracy improved from 99.5% to 99.7%.', confidence: 0.99, impact: '+0.2% accuracy', time: '4h ago', shapFactors: [{ label: 'Dataset coverage', value: 0.95 }, { label: 'Feature engineering', value: 0.78 }] },
  { id: 'INS-006', engine: 'Govern', category: 'informational', title: 'Weekly audit coverage at 100%', body: 'All 1,247 AI decisions this week have complete audit trails. SOC 2 compliance maintained.', confidence: 0.99, impact: 'Compliance OK', time: '6h ago', shapFactors: [{ label: 'Coverage rate', value: 1.0 }, { label: 'Completeness', value: 0.98 }] },
];

const engineBorder = { Protect: 'border-t-teal-500', Grow: 'border-t-violet-500', Execute: 'border-t-amber-500', Govern: 'border-t-blue-500' };
const engineBadge = { Protect: 'bg-teal-500/20 text-teal-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };
const categoryBadge = { actionable: 'bg-emerald-500/20 text-emerald-400', informational: 'bg-blue-500/20 text-blue-400', warning: 'bg-amber-500/20 text-amber-400' };

type TabFilter = 'all' | 'actionable' | 'informational' | 'warning';

const monthlyImpact = [
  { month: 'Mar', amount: 40 }, { month: 'Apr', amount: 80 },
  { month: 'May', amount: 120 }, { month: 'Jun', amount: 160 },
  { month: 'Jul', amount: 200 }, { month: 'Aug', amount: 240 },
];

/* ── component ────────────────────────────────────────────── */

export const InsightsFeed: React.FC = () => {
  const contract = getRouteScreenContract('insights-feed');
  const [tab, setTab] = useState<TabFilter>('all');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const filtered = tab === 'all' ? insights : insights.filter((i) => i.category === tab);

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(['all', 'actionable', 'informational', 'warning'] as TabFilter[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-colors ${tab === t ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
            {t === 'all' ? `All (${insights.length})` : `${t} (${insights.filter((i) => i.category === t).length})`}
          </button>
        ))}
      </div>

      {/* Engine filter pills */}
      <div className="flex gap-2 mb-4">
        {(['Protect', 'Grow', 'Execute', 'Govern'] as const).map((eng) => (
          <span key={eng} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadge[eng]}`}>{eng} ({insights.filter((i) => i.engine === eng).length})</span>
        ))}
      </div>

      {/* Insight Cards */}
      <section className="space-y-3">
        {filtered.map((insight) => (
          <div key={insight.id} className={`engine-card border-t-2 ${engineBorder[insight.engine]}`}>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadge[insight.engine]}`}>{insight.engine}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${categoryBadge[insight.category]}`}>{insight.category}</span>
              <span className="text-[10px] text-white/30 ml-auto">{insight.time}</span>
            </div>

            <h4 className="text-sm font-medium text-white mb-1">{insight.title}</h4>
            <p className="text-xs text-white/50 mb-3">{insight.body}</p>

            {/* Confidence bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-white/40">Confidence</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-violet-500/60" style={{ width: `${insight.confidence * 100}%` }} />
              </div>
              <span className="text-[10px] text-white/60">{insight.confidence}</span>
            </div>

            {/* Impact estimate */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-white/40">Est. impact:</span>
              <span className="text-xs text-violet-300 font-medium">{insight.impact}</span>
            </div>

            {/* Expanded SHAP + actions */}
            {expandedInsight === insight.id ? (
              <div className="pt-3 border-t border-white/5 space-y-2">
                {insight.shapFactors.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-32 shrink-0">{f.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-violet-500/50" style={{ width: `${f.value * 100}%` }} />
                    </div>
                    <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  {insight.category === 'actionable' && <Link to="/execute" className="text-xs text-amber-400 hover:underline">Send to Execute</Link>}
                  <button className="text-xs text-white/40 hover:text-white/60">Dismiss</button>
                  <button onClick={() => setExpandedInsight(null)} className="text-xs text-white/30 hover:text-white/50 ml-auto">Collapse</button>
                </div>
                <ProofLine claim={`Insight ${insight.id}`} evidence={`${insight.engine} engine | Confidence ${insight.confidence}`} source="Cross-engine analysis" basis="rolling 90d" sourceType="model" />
              </div>
            ) : (
              <div className="flex gap-2">
                {insight.category === 'actionable' && <Link to="/execute" className="text-xs text-amber-400 hover:underline">Send to Execute</Link>}
                <button onClick={() => setExpandedInsight(insight.id)} className="text-xs text-white/30 hover:text-white/50">Expand evidence</button>
                <button className="text-xs text-white/30 hover:text-white/50 ml-auto">Dismiss</button>
              </div>
            )}
          </div>
        ))}
      </section>

      <GovernContractSet auditId="GV-2026-0216-FEED" modelVersion="InsightComposite v3.2" explanationVersion="xai-1.1" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card flex flex-col items-center">
        <ScoreRing score={89} maxScore={100} label="Avg confidence" size="md" color="var(--engine-grow)" />
        <p className="text-xs text-white/40 mt-2">Across {insights.length} insights today</p>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Monthly Impact</h4>
        <ContributionChart data={monthlyImpact} targetMonthly={200} accentColor="var(--engine-grow)" />
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Stats</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">Insights today</span><span className="text-white/70">12</span></div>
          <div className="flex justify-between"><span className="text-white/50">Actionable</span><span className="text-emerald-400">4</span></div>
          <div className="flex justify-between"><span className="text-white/50">Avg confidence</span><span className="text-white/70">0.89</span></div>
          <div className="flex justify-between"><span className="text-white/50">Acted on (30d)</span><span className="text-violet-400">78%</span></div>
        </div>
      </article>
    </>
  );

  return (
    <PageShell
      slug="protect"
      contract={contract}
      layout="engine"
      heroVariant="editorial"
      hero={{
        kicker: 'AI Insights',
        headline: '12 insights today | 4 actionable | Avg confidence 0.89',
        subline: 'Evidence-backed recommendations from all engines.',
        proofLine: { claim: '12 insights generated', evidence: '4 actionable | Cross-engine verified | SHAP explained', source: 'Insight composite' },
        freshness: new Date(Date.now() - 5 * 60 * 1000),
        kpis: [
          { label: 'Today', value: '12', accent: 'violet', definition: 'Insights generated today' },
          { label: 'Actionable', value: '4', accent: 'teal', definition: 'Insights with direct actions available' },
          { label: 'Confidence', value: '0.89', accent: 'cyan', definition: 'Average model confidence' },
          { label: 'Impact', value: '+$280/mo', accent: 'amber', definition: 'Total estimated impact if all adopted' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default InsightsFeed;
