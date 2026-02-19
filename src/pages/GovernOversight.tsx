import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Bot } from 'lucide-react';
import { Link } from '../router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePageTitle } from '../hooks/use-page-title';
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread'

const reviewCards = [
  {
    id: 'RV-001', urgency: 'Critical' as const, urgencyColor: 'var(--state-critical)', engine: 'Protect', engineColor: 'var(--engine-protect)',
    action: 'Block card', confidence: 0.71, reason: `Amount $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} near threshold`,
    aiRec: 'AI recommends blocking due to anomalous spending pattern. Transaction origin flagged.',
    auditId: 'GV-2026-0216-OVR-001',
  },
  {
    id: 'RV-002', urgency: 'Warning' as const, urgencyColor: 'var(--engine-execute)', engine: 'Execute', engineColor: 'var(--engine-execute)',
    action: 'Auto-pay bill', confidence: 0.76, reason: 'New merchant, first payment',
    aiRec: 'AI recommends proceeding. Merchant verified, amount within normal range.',
    auditId: 'GV-2026-0216-OVR-002',
  },
  {
    id: 'RV-003', urgency: 'Info' as const, urgencyColor: 'var(--engine-govern)', engine: 'Grow', engineColor: 'var(--engine-grow)',
    action: 'Rebalance portfolio', confidence: 0.79, reason: 'Market conditions changed',
    aiRec: 'AI suggests shifting 5% from bonds to equities based on updated forecasts.',
    auditId: 'GV-2026-0216-OVR-003',
  },
];

const recentResolved = [
  { decision: 'Block suspicious transfer', reviewer: 'J. Smith', outcome: 'Confirmed', time: '2h ago' },
  { decision: 'Auto-save $500', reviewer: 'M. Chen', outcome: 'Confirmed', time: '4h ago' },
  { decision: 'Increase 401k contrib.', reviewer: 'A. Patel', outcome: 'Overridden', time: '1d ago' },
  { decision: 'Cancel subscription', reviewer: 'J. Smith', outcome: 'Confirmed', time: '1d ago' },
  { decision: 'Adjust investment mix', reviewer: 'M. Chen', outcome: 'Confirmed', time: '2d ago' },
];

const overrideTrendData = [
  { day: 'Mon', overrides: 2 },
  { day: 'Tue', overrides: 1 },
  { day: 'Wed', overrides: 3 },
  { day: 'Thu', overrides: 1 },
  { day: 'Fri', overrides: 2 },
  { day: 'Sat', overrides: 0 },
  { day: 'Sun', overrides: 1 },
];

const overrideReasons = [
  { reason: 'Low confidence', pct: 45 },
  { reason: 'Edge case', pct: 32 },
  { reason: 'Policy change', pct: 23 },
];

export function GovernOversight() {
  usePageTitle('Oversight Queue');
  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: 'var(--engine-govern)', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }} aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/govern" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
            <ArrowLeft className="h-4 w-4" />Govern
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Human Oversight</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible" role="main">
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Eye className="h-4 w-4" style={{ color: 'var(--engine-govern)' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>Govern · Oversight</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Human Oversight</h1>
          <p className="text-sm text-slate-400">Override rate: 3.2%. Zero escalations this week.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Override rate', value: '3.2%', color: 'var(--engine-protect)' },
            { label: 'Human reviews', value: '41', color: 'var(--engine-govern)' },
            { label: 'Avg review time', value: '4.2m', color: 'var(--engine-dashboard)' },
            { label: 'Escalations', value: '0', color: 'var(--engine-protect)' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main 2-col */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
            {/* Review queue */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-semibold text-white">Flagged for human review</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">3</span>
              </div>
              <div className="flex flex-col gap-4">
                {reviewCards.map((card) => (
                  <div key={card.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6" style={{ borderLeftWidth: 3, borderLeftColor: card.urgencyColor }}>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${card.urgencyColor}20`, color: card.urgencyColor }}>{card.urgency}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${card.engineColor}20`, color: card.engineColor }}>{card.engine}</span>
                      <span className="text-xs text-white/40 ml-auto">Confidence: <span className="font-semibold text-white/70">{card.confidence}</span></span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{card.action}</h3>
                    <p className="text-xs text-slate-400 mb-3">{card.reason}</p>

                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 mb-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Bot className="h-3 w-3 text-white/30" />
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">AI Recommendation</span>
                      </div>
                      <p className="text-xs text-white/50">{card.aiRec}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--engine-govern)' }}>Confirm AI decision</button>
                      <button className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-amber-500/10 transition-colors" style={{ borderColor: 'rgba(234,179,8,0.3)', color: 'var(--engine-execute)' }}>Override</button>
                      <button className="px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors">Request more info</button>
                      <span className="ml-auto text-[10px] font-mono text-white/20">{card.auditId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recently resolved */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Recently Resolved</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[320px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Decision', 'Reviewer', 'Outcome', 'Time'].map((h) => (
                        <th key={h} className="pb-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentResolved.map((r, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        <td className="py-2 text-xs text-white/70">{r.decision}</td>
                        <td className="py-2 text-xs text-white/40">{r.reviewer}</td>
                        <td className="py-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.outcome === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {r.outcome}
                          </span>
                        </td>
                        <td className="py-2 text-xs text-white/30">{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Side rail */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Override trend chart */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Override Trend (7d)</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overrideTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#253852" />
                    <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0F1D32', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94A3B8' }} itemStyle={{ color: 'var(--engine-govern)' }} />
                    <Bar dataKey="overrides" fill="var(--engine-govern)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Decision accuracy */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Decision Accuracy</h3>
              <p className="text-xs text-white/50 mb-2">Post-override accuracy</p>
              <p className="text-lg font-bold text-emerald-400 mb-2">94.2%</p>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: '94.2%', background: 'var(--engine-protect)' }} />
              </div>
            </motion.div>

            {/* Top override reasons */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Top Override Reasons</h3>
              <div className="flex flex-col gap-3">
                {overrideReasons.map((r) => (
                  <div key={r.reason}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{r.reason}</span>
                      <span className="text-white/70 font-semibold">{r.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: 'var(--engine-govern)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/oversight'].auditId} pageContext={GOVERNANCE_META['/govern/oversight'].pageContext} />
      </motion.div>
    </div>
  );
}

export default GovernOversight;
