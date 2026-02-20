import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, CheckCircle2 } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date';
import { Button, Surface } from '@/design-system';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface TimelineEvent {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  type: string;
  title: string;
  description: string;
  confidence: number;
  time: string;
  day: string;
  auditId: string;
}

const formatDay = (value: string) =>
formatDemoTimestamp(value, { month: 'short', day: 'numeric', year: 'numeric', hour: undefined, minute: undefined });
const formatTime = (value: string) =>
formatDemoTimestamp(value, { month: undefined, day: undefined, year: undefined, hour: '2-digit', minute: '2-digit', hour12: false });

const events: TimelineEvent[] = [
{ id: 'TE-001', engine: 'Protect', type: 'Alert', title: 'Suspicious login blocked', description: 'Login attempt from unrecognized device (IP 203.0.113.42) automatically blocked.', confidence: 0.96, time: formatTime('2026-03-19T14:31:00-04:00'), day: formatDay('2026-03-19T14:31:00-04:00'), auditId: 'GV-2026-0319-846' },
{ id: 'TE-002', engine: 'Execute', type: 'Action', title: 'Subscription cancelled — Netflix', description: 'Monthly $15.99 subscription cancelled per approved action ACT-003.', confidence: 0.92, time: formatTime('2026-03-19T13:45:00-04:00'), day: formatDay('2026-03-19T13:45:00-04:00'), auditId: 'GV-2026-0319-847' },
{
  id: 'TE-003',
  engine: 'Grow',
  type: 'Update',
  title: `Emergency fund — $${DEMO_THREAD.emergencyFund.current.toLocaleString()} reached`,
  description: `${DEMO_THREAD.emergencyFund.percent}% progress toward $${DEMO_THREAD.emergencyFund.target.toLocaleString()} goal.`,
  confidence: 0.87,
  time: formatTime('2026-03-19T12:00:00-04:00'),
  day: formatDay('2026-03-19T12:00:00-04:00'),
  auditId: 'GV-2026-0319-845'
},
{
  id: 'TE-004',
  engine: 'Govern',
  type: 'Audit',
  title: 'Weekly audit report generated',
  description: `${DEMO_THREAD.decisionsAudited.toLocaleString()} decisions audited. 100% coverage. 0 exceptions.`,
  confidence: 0.99,
  time: formatTime('2026-03-19T09:00:00-04:00'),
  day: formatDay('2026-03-19T09:00:00-04:00'),
  auditId: 'GV-2026-0319-844'
},
{ id: 'TE-005', engine: 'Execute', type: 'Action', title: 'Auto-save round-ups completed', description: '$127 in round-ups transferred to savings account.', confidence: 0.95, time: formatTime('2026-03-18T23:55:00-04:00'), day: formatDay('2026-03-18T23:55:00-04:00'), auditId: 'GV-2026-0318-842' },
{ id: 'TE-006', engine: 'Protect', type: 'Resolution', title: 'Fraud alert resolved — Amazon charge', description: 'Charge confirmed legitimate by cardholder. Alert closed.', confidence: 0.88, time: formatTime('2026-03-18T16:20:00-04:00'), day: formatDay('2026-03-18T16:20:00-04:00'), auditId: 'GV-2026-0318-843' },
{ id: 'TE-007', engine: 'Grow', type: 'Insight', title: 'Savings rate improved +2.3%', description: 'Spending optimization actions led to measurable savings rate increase.', confidence: 0.85, time: formatTime('2026-03-18T10:00:00-04:00'), day: formatDay('2026-03-18T10:00:00-04:00'), auditId: 'GV-2026-0318-842' },
{ id: 'TE-008', engine: 'Govern', type: 'Policy', title: 'Trust score updated to 92', description: 'System trust score recalculated after model accuracy improvement.', confidence: 0.97, time: formatTime('2026-03-17T09:00:00-04:00'), day: formatDay('2026-03-17T09:00:00-04:00'), auditId: 'GV-2026-0317-840' }];


const engineDotColor: Record<string, string> = { Protect: 'var(--engine-protect)', Grow: 'var(--engine-grow)', Execute: 'var(--engine-execute)', Govern: 'var(--engine-govern)' };
const engineBadgeCls: Record<string, string> = { Protect: 'bg-emerald-500/20 text-emerald-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };
const typeBadgeCls: Record<string, string> = { Alert: 'bg-red-500/20 text-red-400', Action: 'bg-amber-500/20 text-amber-400', Update: 'bg-blue-500/20 text-blue-400', Audit: 'bg-blue-500/20 text-blue-400', Resolution: 'bg-emerald-500/20 text-emerald-400', Insight: 'bg-violet-500/20 text-violet-400', Policy: 'bg-blue-500/20 text-blue-400' };

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function ActivityTimelinePage() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: stagger } = getMotionPreset(prefersReducedMotion);
  const [engineFilter, setEngineFilter] = useState('all');

  const filtered = engineFilter === 'all' ? events : events.filter((e) => e.engine === engineFilter);
  const grouped = filtered.reduce<Record<string, TimelineEvent[]>>((acc, ev) => {
    (acc[ev.day] ??= []).push(ev);
    return acc;
  }, {});

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
          <span className="text-sm text-white/50">Activity Timeline</span>
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
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5" style={{ color: 'var(--engine-dashboard)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-dashboard)' }}>
              Dashboard · Timeline
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Activity Timeline</h1>
          <p className="text-sm text-slate-400">Chronological event trace across all engines — fully traceable.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Events (7d)', value: '22', color: 'var(--engine-dashboard)' },
            { label: 'Engines active', value: '4/4', color: 'var(--engine-govern)' },
            { label: 'Success rate', value: '99%', color: 'var(--engine-protect)' },
            { label: 'Audit coverage', value: '100%', color: 'var(--engine-execute)' }].
            map((kpi) => <Surface
              key={kpi.label} className="rounded-2xl" variant="glass" padding="md">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </Surface>
            )}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <motion.div variants={fadeUpVariant} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {/* Live indicator + filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'Protect', 'Grow', 'Execute', 'Govern'].map((eng) =>
                <Button
                  key={eng}
                  onClick={() => setEngineFilter(eng)}
                  variant="glass"
                  engine="dashboard"
                  size="sm"
                  className={`rounded-full text-xs font-medium transition-colors ${engineFilter === eng ? 'text-white border border-white/20' : 'text-white/50 border border-white/10 hover:bg-white/10'}`}>
                  
                    {eng === 'all' ? 'All engines' : eng}
                  </Button>
                )}
              </div>
            </div>

            {/* Timeline */}
            {Object.entries(grouped).map(([day, dayEvents]) =>
            <div key={day}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-white/60">{day}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />
                  {dayEvents.map((ev) =>
                <div key={ev.id} className="relative mb-3">
                      <div
                    className="absolute top-3 w-3 h-3 rounded-full ring-2"
                    style={{
                      left: '-16px',
                      background: engineDotColor[ev.engine],
                      boxShadow: '0 0 0 2px #0B1221'
                    }} />
                  
                      <Surface className="rounded-2xl ml-2" variant="glass" padding="md">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] text-white/30">{ev.time}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadgeCls[ev.engine]}`}>{ev.engine}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeBadgeCls[ev.type] ?? 'bg-white/10 text-white/40'}`}>{ev.type}</span>
                          <span className="text-[10px] text-white/30 ml-auto">conf. {formatConfidence(ev.confidence)}</span>
                        </div>
                        <h4 className="text-sm font-medium text-white">{ev.title}</h4>
                        <p className="text-xs text-white/50 mt-1">{ev.description}</p>
                        <Link to={`/govern/audit-detail?decision=${encodeURIComponent(ev.auditId)}`} className="text-[10px] text-blue-400 hover:underline mt-1 inline-block">{ev.auditId}</Link>
                      </Surface>
                    </div>
                )}
                </div>
              </div>
            )}

            <p className="text-xs text-white/30 mt-2">{filtered.length} events displayed · Full traceability · Every event linked to audit ID</p>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Timeline sidebar">
            {/* Today's summary */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Today's Summary</h3>
              <div className="space-y-2.5">
                {[
                { label: 'Protect events', value: '1', color: 'text-emerald-400' },
                { label: 'Grow events', value: '1', color: 'text-violet-400' },
                { label: 'Execute events', value: '1', color: 'text-amber-400' },
                { label: 'Govern events', value: '1', color: 'text-blue-400' }].
                map((row) =>
                <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                  </div>
                )}
                <div className="border-t border-white/[0.06] pt-2.5 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/50">Most active</span>
                    <span className="text-xs text-white/70">Execute</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/50">Audit coverage</span>
                    <span className="text-xs text-emerald-400 font-medium">100%</span>
                  </div>
                </div>
              </div>
            </Surface>

            {/* Key milestones */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--engine-dashboard)' }} />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Key Milestones</h3>
              </div>
              <div className="space-y-3">
                {[
                { label: '22 actions this week', date: 'Mar 19, 2026', done: false },
                { label: 'All engines reporting', date: 'Ongoing', done: true },
                { label: '100% audit coverage', date: 'Maintained', done: true }].
                map((m) =>
                <div key={m.label} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${m.done ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                    <div>
                      <p className="text-xs text-white/70">{m.label}</p>
                      <p className="text-[10px] text-white/30">{m.date}</p>
                    </div>
                  </div>
                )}
              </div>
            </Surface>

            {/* Navigation */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Related</h3>
              <div className="flex flex-col gap-2">
                <Link to="/govern/audit" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Audit Ledger →</Link>
                <Link to="/dashboard/alerts" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Alerts Hub →</Link>
              </div>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/dashboard/timeline'].auditId} pageContext={GOVERNANCE_META['/dashboard/timeline'].pageContext} />
      </motion.div>
    </div>);

}

export default ActivityTimelinePage;
