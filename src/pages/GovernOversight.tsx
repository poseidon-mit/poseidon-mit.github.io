import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Bot } from 'lucide-react';
import { Link } from '../router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePageTitle } from '../hooks/use-page-title';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, Surface } from '@/design-system';

const reviewCards = [
  {
    id: 'RV-001', urgency: 'Critical' as const, urgencyColor: 'var(--state-critical)', engine: 'Protect', engineColor: 'var(--engine-protect)',
    action: 'Block card', confidence: 0.71, reason: `Amount $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} near threshold`,
    aiRec: 'AI recommends blocking due to anomalous spending pattern. Transaction origin flagged.',
    auditId: 'GV-2026-0216-OVR-001'
  },
  {
    id: 'RV-002', urgency: 'Warning' as const, urgencyColor: 'var(--engine-execute)', engine: 'Execute', engineColor: 'var(--engine-execute)',
    action: 'Auto-pay bill', confidence: 0.76, reason: 'New merchant, first payment',
    aiRec: 'AI recommends proceeding. Merchant verified, amount within normal range.',
    auditId: 'GV-2026-0216-OVR-002'
  },
  {
    id: 'RV-003', urgency: 'Info' as const, urgencyColor: 'var(--engine-govern)', engine: 'Grow', engineColor: 'var(--engine-grow)',
    action: 'Rebalance portfolio', confidence: 0.79, reason: 'Market conditions changed',
    aiRec: 'AI suggests shifting 5% from bonds to equities based on updated forecasts.',
    auditId: 'GV-2026-0216-OVR-003'
  }];


const recentResolved = [
  { decision: 'Block suspicious transfer', reviewer: 'J. Smith', outcome: 'Confirmed', time: '2h ago' },
  { decision: 'Auto-save $500', reviewer: 'M. Chen', outcome: 'Confirmed', time: '4h ago' },
  { decision: 'Increase 401k contrib.', reviewer: 'A. Patel', outcome: 'Overridden', time: '1d ago' },
  { decision: 'Cancel subscription', reviewer: 'J. Smith', outcome: 'Confirmed', time: '1d ago' },
  { decision: 'Adjust investment mix', reviewer: 'M. Chen', outcome: 'Confirmed', time: '2d ago' }];


const overrideTrendData = [
  { day: 'Mon', overrides: 2 },
  { day: 'Tue', overrides: 1 },
  { day: 'Wed', overrides: 3 },
  { day: 'Thu', overrides: 1 },
  { day: 'Fri', overrides: 2 },
  { day: 'Sat', overrides: 0 },
  { day: 'Sun', overrides: 1 }];


const overrideReasons = [
  { reason: 'Low confidence', pct: 45 },
  { reason: 'Edge case', pct: 32 },
  { reason: 'Policy change', pct: 23 }];


export function GovernOversight() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);

  usePageTitle('Oversight Queue');
  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: 'var(--engine-govern)', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/govern" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
            <ArrowLeft className="h-4 w-4" />Govern
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Human Oversight</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-8 w-full font-sans pb-8" style={{ maxWidth: '1440px' }} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 pt-8 lg:pt-12">
          {/* Hero */}
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Eye size={12} /> Govern · Oversight
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Human Oversight</h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">Override rate: <span className="text-[var(--engine-protect)] font-mono drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">3.2%</span>. Zero escalations this week.</p>
          </motion.div>

          {/* KPI bar */}
          <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4">
            {[
              { label: 'Override rate', value: '3.2%', color: 'var(--engine-protect)' },
              { label: 'Human reviews', value: '41', color: 'var(--engine-govern)' },
              { label: 'Avg review time', value: '4.2m', color: 'white' },
              { label: 'Escalations', value: '0', color: 'var(--state-healthy)' }].
              map((kpi) => <Surface
                key={kpi.label} className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-5 md:p-6" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-2">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{kpi.label}</p>
                  <p className="text-2xl md:text-3xl font-light font-mono truncate" style={{ color: kpi.color, textShadow: kpi.color !== 'white' ? `0 0 15px ${kpi.color}60` : 'none' }}>{kpi.value}</p>
                </div>
              </Surface>
              )}
          </motion.div>
        </motion.section>

        {/* Main 2-col */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8 pb-12 w-full">
          {/* Main feed */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-8">
            {/* Review queue */}
            <motion.div variants={staggerContainerVariant} className="flex flex-col gap-6">
              <motion.div variants={fadeUpVariant} className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)]">Flagged for human review</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--state-warning)]/20 text-[var(--state-warning)] border border-[var(--state-warning)]/30">3</span>
              </motion.div>
              <div className="flex flex-col gap-4">
                {reviewCards.map((card) => <Surface
                  key={card.id} className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 p-6 lg:p-8" style={{ borderLeftWidth: 4, borderLeftColor: card.urgencyColor }} variant="glass" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border" style={{ background: `${card.urgencyColor}10`, color: card.urgencyColor, borderColor: `${card.urgencyColor}30` }}>{card.urgency}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border" style={{ background: `${card.engineColor}10`, color: card.engineColor, borderColor: `${card.engineColor}30` }}>{card.engine}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">
                        <span className="text-[10px] uppercase tracking-widest text-white/40">Confidence</span>
                        <span className="text-xs font-mono font-bold" style={{ color: card.engineColor, textShadow: `0 0 10px ${card.engineColor}80` }}>{card.confidence}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl md:text-2xl font-light text-white tracking-wide">{card.action}</h3>
                      <p className="text-sm text-white/50 font-light">{card.reason}</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 lg:p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[var(--engine-govern)]/10 border border-[var(--engine-govern)]/20">
                          <Bot className="h-4 w-4 text-[var(--engine-govern)]" />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--engine-govern)] uppercase tracking-widest">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed font-light">{card.aiRec}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.04] mt-2">
                      <button className="px-5 py-2.5 rounded-xl bg-[var(--engine-govern)] text-black text-xs font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all">Confirm Decision</button>
                      <button className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs font-semibold hover:bg-white/[0.1] transition-colors">Override</button>
                      <button className="px-4 py-2.5 rounded-xl text-white/40 text-xs hover:text-white/70 transition-colors hidden sm:block">Request more info</button>
                      <span className="ml-auto text-[10px] font-mono tracking-widest text-white/20 hidden md:block">{card.auditId}</span>
                    </div>
                  </div>
                </Surface>
                )}
              </div>
            </motion.div>

            {/* Recently Resolved */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h2 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">Recently Resolved</h2>
                <div className="relative z-10 overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Decision', 'Reviewer', 'Outcome', 'Time'].map((h) =>
                          <th key={h} className="pb-4 text-[10px] font-semibold text-white/30 uppercase tracking-widest">{h}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {recentResolved.map((r, i) =>
                        <tr key={i} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 text-sm tracking-wide text-white/80">{r.decision}</td>
                          <td className="py-4 text-xs font-mono text-white/50">{r.reviewer}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${r.outcome === 'Confirmed' ? 'bg-[var(--state-healthy)]/10 text-[var(--state-healthy)] border-[var(--state-healthy)]/30' : 'bg-[var(--state-warning)]/10 text-[var(--state-warning)] border-[var(--state-warning)]/30'}`}>
                              {r.outcome}
                            </span>
                          </td>
                          <td className="py-4 text-xs font-mono text-white/40 text-right">{r.time}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Surface>
            </motion.div>
          </div>

          {/* Side rail */}
          <motion.aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Oversight sidebar" variants={staggerContainerVariant}>
            {/* Override trend chart */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Override Trend (7d)</h3>
                <div className="relative z-10 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overrideTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12, backdropFilter: 'blur(10px)' }} labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }} itemStyle={{ color: 'var(--engine-govern)', fontWeight: 'bold' }} />
                      <Bar dataKey="overrides" fill="var(--engine-govern)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Surface>
            </motion.div>

            {/* Decision accuracy */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8 flex flex-col gap-4" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest border-b border-white/[0.06] pb-4">Decision Accuracy</h3>
                <div className="relative z-10 flex flex-col gap-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Post-override accuracy</p>
                  <p className="text-3xl font-light font-mono text-[var(--state-healthy)] drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">94.2%</p>
                </div>
                <div className="relative z-10 h-2 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.03]">
                  <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: '94.2%', background: 'var(--state-healthy)' }} />
                </div>
              </Surface>
            </motion.div>

            {/* Top override reasons */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Top Override Reasons</h3>
                <div className="relative z-10 flex flex-col gap-5">
                  {overrideReasons.map((r) =>
                    <div key={r.reason} className="flex flex-col gap-2 group">
                      <div className="flex justify-between items-end">
                        <span className="text-xs uppercase tracking-widest text-white/70">{r.reason}</span>
                        <span className="text-xs font-mono font-bold text-white/50">{r.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.03]">
                        <div className="h-full rounded-full transition-all duration-700 bg-[var(--engine-govern)]/60 group-hover:bg-[var(--engine-govern)]" style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </Surface>
            </motion.div>
          </motion.aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/oversight'].auditId} pageContext={GOVERNANCE_META['/govern/oversight'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernOversight;