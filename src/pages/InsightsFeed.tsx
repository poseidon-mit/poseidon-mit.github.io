import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse, EmptyState } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { usePageTitle } from '../hooks/use-page-title';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, Surface } from '@/design-system';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface Insight {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  category: 'actionable' | 'informational' | 'warning';
  title: string;
  body: string;
  confidence: number;
  impact: string;
  time: string;
  shapFactors: Array<{label: string;value: number;}>;
}

const insights: Insight[] = [
{ id: 'INS-001', engine: 'Grow', category: 'actionable', title: 'Subscription consolidation opportunity', body: 'Three overlapping services detected. Consolidating could save $140/mo with minimal disruption.', confidence: 0.89, impact: '+$140/mo', time: '5m ago', shapFactors: [{ label: 'Service overlap', value: 0.92 }, { label: 'Cost impact', value: 0.88 }, { label: 'Usage frequency', value: 0.45 }] },
{ id: 'INS-002', engine: 'Protect', category: 'warning', title: 'Recurring charge spike — vendor anomaly', body: 'Monthly charges from 3 vendors increased 23% over 60 days without corresponding service changes.', confidence: 0.84, impact: 'Risk alert', time: '15m ago', shapFactors: [{ label: 'Charge variance', value: 0.87 }, { label: 'Historical baseline', value: 0.81 }, { label: 'Pattern deviation', value: 0.76 }] },
{ id: 'INS-003', engine: 'Execute', category: 'actionable', title: 'Optimal save-day identified — transfer on 3rd', body: 'Based on income timing, transferring surplus on the 3rd yields 12% higher savings rate.', confidence: 0.91, impact: '+12% yield', time: '1h ago', shapFactors: [{ label: 'Income timing', value: 0.94 }, { label: 'Buffer adequacy', value: 0.82 }, { label: 'Expense clustering', value: 0.68 }] },
{ id: 'INS-004', engine: 'Grow', category: 'actionable', title: `Emergency fund at ${DEMO_THREAD.emergencyFund.percent}% — accelerate possible`, body: 'Increasing monthly contribution by $100 would accelerate completion by 3 weeks.', confidence: 0.87, impact: '-3 weeks', time: '2h ago', shapFactors: [{ label: 'Income stability', value: 0.94 }, { label: 'Budget headroom', value: 0.76 }] },
{ id: 'INS-005', engine: 'Protect', category: 'informational', title: 'Model retrained — FraudDetection v3.3', body: 'FraudDetection model updated with latest transaction patterns. Accuracy improved from 99.5% to 99.7%.', confidence: 0.99, impact: '+0.2% accuracy', time: '4h ago', shapFactors: [{ label: 'Dataset coverage', value: 0.95 }, { label: 'Feature engineering', value: 0.78 }] },
{ id: 'INS-006', engine: 'Govern', category: 'informational', title: 'Weekly audit coverage at 100%', body: 'All 1,247 AI decisions this week have complete audit trails. SOC 2 Type II in progress.', confidence: 0.99, impact: 'Compliance OK', time: '6h ago', shapFactors: [{ label: 'Coverage rate', value: 1.0 }, { label: 'Completeness', value: 0.98 }] }];


const engineColor: Record<string, string> = { Protect: 'var(--engine-protect)', Grow: 'var(--engine-grow)', Execute: 'var(--engine-execute)', Govern: 'var(--engine-govern)' };
const engineBadgeCls: Record<string, string> = { Protect: 'bg-emerald-500/20 text-emerald-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };
const categoryBadgeCls: Record<string, string> = { actionable: 'bg-emerald-500/20 text-emerald-400', informational: 'bg-blue-500/20 text-blue-400', warning: 'bg-amber-500/20 text-amber-400' };

type TabFilter = 'all' | 'actionable' | 'informational' | 'warning';

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function InsightsFeed() {
  usePageTitle('Insights');
  const [tab, setTab] = useState<TabFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = tab === 'all' ? insights : insights.filter((i) => i.category === tab);
  const actionableCount = insights.filter((i) => i.category === 'actionable').length;
  const avgConfidence = (insights.reduce((s, i) => s + i.confidence, 0) / insights.length).toFixed(2);
  const estMonthlyImpact = insights.
  filter((i) => i.category === 'actionable').
  reduce((sum, i) => {
    const match = i.impact.match(/\$([\d,]+)\s*\/mo/i);
    if (!match) return sum;
    return sum + Number(match[1].replace(/,/g, ''));
  }, 0);

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-dashboard)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-dashboard)', color: 'var(--bg-oled)' }}>
        
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"

        aria-label="Breadcrumb">
        
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-dashboard)' }}>
            
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">AI Insights</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main">
        
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-5 w-5" style={{ color: 'var(--engine-dashboard)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-dashboard)' }}>
              Dashboard · AI Insights
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Insights Feed</h1>
          <p className="text-sm text-slate-400">
            {insights.length} insights today · {actionableCount} actionable · Avg confidence {avgConfidence}
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Today', value: String(insights.length), color: 'var(--engine-dashboard)' },
            { label: 'Actionable', value: String(actionableCount), color: 'var(--engine-protect)' },
            { label: 'Avg confidence', value: avgConfidence, color: 'var(--engine-grow)' },
            { label: 'Est. impact', value: `+$${estMonthlyImpact}/mo`, color: 'var(--engine-execute)' }].
            map((kpi) => <Surface
              key={kpi.label} className="rounded-2xl p-4" variant="glass" padding="none">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </Surface>
            )}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'actionable', 'informational', 'warning'] as TabFilter[]).map((t) =>
              <Button
                key={t}
                onClick={() => setTab(t)}
                variant="glass"
                engine="dashboard"
                size="sm"
                className={`!min-h-8 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap capitalize transition-colors ${tab === t ? 'text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
                
                  {t === 'all' ? `All (${insights.length})` : `${t} (${insights.filter((i) => i.category === t).length})`}
                </Button>
              )}
            </div>

            {/* Engine pills */}
            <div className="flex gap-2 flex-wrap">
              {(['Protect', 'Grow', 'Execute', 'Govern'] as const).map((eng) =>
              <span key={eng} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadgeCls[eng]}`}>
                  {eng} ({insights.filter((i) => i.engine === eng).length})
                </span>
              )}
            </div>

            {/* Insight cards */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 &&
              <EmptyState
                icon={Sparkles}
                title="No insights match your filter"
                description="Try selecting a different category."
                accentColor="var(--engine-grow)"
                action={{ label: 'Show all insights', onClick: () => setTab('all') }} />

              }
              {filtered.map((insight) => <Surface

                key={insight.id} className="rounded-2xl p-4"

                style={{ borderTopWidth: 2, borderTopColor: engineColor[insight.engine] }} variant="glass" padding="none">
                
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadgeCls[insight.engine]}`}>{insight.engine}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${categoryBadgeCls[insight.category]}`}>{insight.category}</span>
                    <span className="text-[10px] text-white/30 ml-auto">{insight.time}</span>
                  </div>

                  <h4 className="text-sm font-medium text-white mb-1">{insight.title}</h4>
                  <p className="text-xs text-white/50 mb-3">{insight.body}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-white/40">Confidence</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-violet-500/60" style={{ width: `${insight.confidence * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-white/60">{insight.confidence}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] text-white/40">Est. impact:</span>
                    <span className="text-xs text-violet-300 font-medium">{insight.impact}</span>
                  </div>

                  {expandedId === insight.id ?
                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      {insight.shapFactors.map((f) =>
                  <div key={f.label} className="flex items-center gap-2">
                          <span className="text-xs text-white/50 w-32 shrink-0">{f.label}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-violet-500/50" style={{ width: `${f.value * 100}%` }} />
                          </div>
                          <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                        </div>
                  )}
                      <div className="flex gap-2 pt-2">
                        {insight.category === 'actionable' &&
                    <Link to="/execute" className="text-xs text-amber-400 hover:underline">Send to Execute</Link>
                    }
                        <Button variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/40 hover:text-white/60">Dismiss</Button>
                        <Button onClick={() => setExpandedId(null)} variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/30 hover:text-white/50 ml-auto">Collapse</Button>
                      </div>
                    </div> :

                <div className="flex gap-2">
                      {insight.category === 'actionable' &&
                  <Link to="/execute" className="text-xs text-amber-400 hover:underline">Send to Execute</Link>
                  }
                      <Button onClick={() => setExpandedId(insight.id)} variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/30 hover:text-white/50">Expand evidence</Button>
                      <Button variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/30 hover:text-white/50 ml-auto">Dismiss</Button>
                    </div>
                }
                </Surface>
              )}
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Insights sidebar">
            {/* Avg confidence ring */}
            <Surface className="rounded-2xl p-4 flex flex-col items-center" variant="glass" padding="none">
              <div className="relative" aria-label={`Average confidence: ${avgConfidence}`}>
                <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="32" fill="none" stroke="var(--engine-dashboard)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${parseFloat(avgConfidence) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                    transform="rotate(-90 40 40)" />
                  
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">{avgConfidence}</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">Avg confidence</p>
              <p className="text-[10px] text-white/30">Across {insights.length} insights today</p>
            </Surface>

            {/* Monthly impact */}
            <Surface className="rounded-2xl p-4" variant="glass" padding="none">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" style={{ color: 'var(--engine-dashboard)' }} />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Monthly Impact</h3>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[40, 80, 120, 160, 200, 240].map((v, i) =>
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${v / 240 * 100}%`, background: 'var(--engine-dashboard)', opacity: 0.4 + i * 0.1 }} />
                )}
              </div>
              <div className="flex justify-between text-[10px] text-white/30 mt-1">
                <span>Mar</span><span>Aug</span>
              </div>
            </Surface>

            {/* Stats */}
            <Surface className="rounded-2xl p-4" variant="glass" padding="none">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Stats</h3>
              <div className="space-y-2.5">
                {[
                { label: 'Insights today', value: String(insights.length), color: 'text-white/70' },
                { label: 'Actionable', value: String(actionableCount), color: 'text-emerald-400' },
                { label: 'Avg confidence', value: avgConfidence, color: 'text-white/70' },
                { label: 'Acted on (30d)', value: '78%', color: 'text-violet-400' }].
                map((row) =>
                <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                  </div>
                )}
              </div>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/dashboard/insights'].auditId} pageContext={GOVERNANCE_META['/dashboard/insights'].pageContext} />
      </motion.div>
    </div>);

}

export default InsightsFeed;