import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, CheckCircle2, Clock, TrendingDown, Shield } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse, EmptyState } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { usePageTitle } from '../hooks/use-page-title';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, ButtonLink, Surface } from '@/design-system';

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  title: string;
  confidence: number;
  time: string;
  status: 'unread' | 'in-progress' | 'resolved';
  shapFactors: Array<{label: string;value: number;}>;
}

const alerts: Alert[] = [
{
  id: DEMO_THREAD.criticalAlert.id,
  severity: 'critical',
  engine: 'Protect',
  title: `Suspicious vendor charge — ${DEMO_THREAD.criticalAlert.merchant} $${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`,
  confidence: DEMO_THREAD.criticalAlert.confidence,
  time: '12m ago',
  status: 'unread',
  shapFactors: [{ label: 'Merchant history', value: 0.55 }, { label: 'Amount deviation', value: 0.30 }, { label: 'Category risk', value: 0.15 }]
},
{
  id: 'ALT-002',
  severity: 'warning',
  engine: 'Protect',
  title: 'Unusual login from new device — IP 203.0.113.42',
  confidence: 0.86,
  time: '28m ago',
  status: 'unread',
  shapFactors: [{ label: 'Device fingerprint', value: 0.42 }, { label: 'Geo anomaly', value: 0.35 }, { label: 'Session timing', value: 0.23 }]
},
{ id: 'ALT-003', severity: 'warning', engine: 'Grow', title: 'Budget threshold approaching — 87% utilized', confidence: 0.84, time: '1h ago', status: 'in-progress', shapFactors: [{ label: 'Spending rate', value: 0.50 }, { label: 'Budget remaining', value: 0.30 }] },
{ id: 'ALT-004', severity: 'warning', engine: 'Execute', title: '2 actions expire within 24 hours', confidence: 0.82, time: '3h ago', status: 'unread', shapFactors: [{ label: 'Time urgency', value: 0.45 }, { label: 'Impact', value: 0.35 }] },
{ id: 'ALT-005', severity: 'info', engine: 'Grow', title: 'New savings opportunity — surplus cash detected', confidence: 0.78, time: '6h ago', status: 'in-progress', shapFactors: [{ label: 'Cash surplus', value: 0.60 }, { label: 'Rate differential', value: 0.25 }] },
{ id: 'ALT-006', severity: 'info', engine: 'Govern', title: 'Model retrained — FraudDetection v3.3 deployed', confidence: 0.99, time: '8h ago', status: 'resolved', shapFactors: [{ label: 'Model accuracy', value: 0.72 }, { label: 'Dataset coverage', value: 0.28 }] }];


const severityDot: Record<Alert['severity'], string> = { critical: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500' };
const severityLabel: Record<Alert['severity'], string> = { critical: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400' };
const engineBadge: Record<Alert['engine'], string> = {
  Protect: 'bg-emerald-500/20 text-emerald-400',
  Grow: 'bg-violet-500/20 text-violet-400',
  Execute: 'bg-amber-500/20 text-amber-400',
  Govern: 'bg-blue-500/20 text-blue-400'
};
const statusColor: Record<Alert['status'], string> = { unread: 'bg-white', 'in-progress': 'bg-amber-400', resolved: 'bg-emerald-400' };

type SeverityFilter = 'all' | 'critical' | 'warning' | 'info';
type EngineFilter = 'all' | 'Protect' | 'Grow' | 'Execute' | 'Govern';

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function AlertsHub() {
  usePageTitle('Alerts');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [engineFilter, setEngineFilter] = useState<EngineFilter>('all');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(alerts[0].id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (engineFilter !== 'all' && a.engine !== engineFilter) return false;
    return true;
  });
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved').length;
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved').length;
  const sharedRootCauseAlerts = alerts.filter((a) => /vendor|charge/i.test(a.title)).length;
  const falsePositiveRate = Math.round(alerts.filter((a) => a.severity === 'info').length / alerts.length * 100);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  };

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
          <span className="text-sm text-white/50">Alerts Hub</span>
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
            <Bell className="h-5 w-5" style={{ color: 'var(--engine-dashboard)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-dashboard)' }}>
              Dashboard · Alerts
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Alerts Hub</h1>
          <p className="text-sm text-slate-400">
            {sharedRootCauseAlerts} {sharedRootCauseAlerts === 1 ? 'alert shares' : 'alerts share'} a common root cause: vendor payment anomaly.
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Active', value: String(activeAlerts), color: 'var(--engine-execute)' },
            { label: 'Resolved (7d)', value: String(resolvedAlerts), color: 'var(--engine-protect)' },
            { label: 'MTTR', value: '25m', color: 'var(--engine-dashboard)' },
            { label: 'False positive', value: `${falsePositiveRate}%`, color: 'var(--engine-govern)' }].
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
          <motion.div variants={fadeUp} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {/* AI root cause insight */}
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/[0.06] p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                  <span className="text-violet-400 text-xs font-bold">AI</span>
                </div>
                <div>
                  <p className="text-sm text-white">3 alerts share a common root cause: <span className="text-violet-300 font-semibold">vendor payment anomaly</span>.</p>
                  <p className="text-xs text-white/50 mt-1">Correlation detected across Protect and Execute engines.</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'Protect', 'Grow', 'Execute', 'Govern'] as EngineFilter[]).map((eng) => {
                const count = eng === 'all' ? alerts.length : alerts.filter((a) => a.engine === eng).length;
                return (
                  <Button
                    key={eng}
                    onClick={() => setEngineFilter(eng)}
                    variant="glass"
                    engine="dashboard"
                    size="sm"
                    className={`!min-h-8 rounded-full px-3 py-1.5 text-xs ${engineFilter === eng ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
                    
                    {eng === 'all' ? 'All' : eng} ({count})
                  </Button>);

              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'critical', 'warning', 'info'] as SeverityFilter[]).map((sev) =>
              <Button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                variant="glass"
                engine="dashboard"
                size="sm"
                className={`!min-h-8 rounded-full px-3 py-1.5 text-xs capitalize ${severityFilter === sev ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
                
                  {sev === 'all' ? 'All severity' : sev}
                </Button>
              )}
            </div>

            {/* Batch actions */}
            {selectedIds.size > 0 &&
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/60">{selectedIds.size} selected</span>
                <Button variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Resolve all</Button>
                <Button variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/40 hover:text-white/60 transition-colors">Dismiss all</Button>
              </div>
            }

            {/* Alert list */}
            <div className="space-y-2">
              {filtered.length === 0 &&
              <EmptyState
                icon={Shield}
                title="No alerts match your filters"
                description="System is operating normally. Try resetting engine and severity filters."
                accentColor="var(--engine-protect)"
                action={{
                  label: 'Reset filters',
                  onClick: () => {
                    setEngineFilter('all');
                    setSeverityFilter('all');
                  }
                }} />

              }
              {filtered.map((alert) => <Surface
                key={alert.id} className="rounded-2xl" variant="glass" padding="md">
                  <div className="flex items-start gap-3">
                    <input
                    type="checkbox"
                    checked={selectedIds.has(alert.id)}
                    onChange={() => toggleSelect(alert.id)}
                    className="mt-1.5 accent-cyan-500 cursor-pointer"
                    aria-label={`Select alert ${alert.id}`} />
                  
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${severityDot[alert.severity]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadge[alert.engine]}`}>{alert.engine}</span>
                        <span className={`text-[10px] font-medium uppercase ${severityLabel[alert.severity]}`}>{alert.severity}</span>
                        <span className="text-[10px] text-white/30">{alert.time}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ml-auto ${statusColor[alert.status]}`} title={alert.status} />
                      </div>
                      <Button
                      onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                      variant="ghost"
                      engine="dashboard"
                      className="text-sm font-medium text-white hover:text-cyan-300 transition-colors text-left mt-1 w-full justify-start !px-0 !min-h-0 !h-auto"
                      aria-expanded={expandedAlert === alert.id}>
                      
                        {alert.title}
                      </Button>
                      <p className="text-[10px] text-white/40 mt-0.5">Confidence {(alert.confidence * 100).toFixed(0)}%</p>

                      {expandedAlert === alert.id &&
                    <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
                          {alert.shapFactors.map((f) =>
                      <div key={f.label} className="flex items-center gap-2">
                              <span className="text-xs text-white/50 w-32 shrink-0">{f.label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-white/10">
                                <div className="h-full rounded-full bg-cyan-500/60" style={{ width: `${f.value * 100}%` }} />
                              </div>
                              <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                            </div>
                      )}
                          <div className="flex gap-3 mt-3">
                            <ButtonLink to="/protect/alert-detail" variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">View detail →</ButtonLink>
                            <Button variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/40 hover:text-white/60 transition-colors">Dismiss</Button>
                          </div>
                        </div>
                    }
                    </div>
                  </div>
                </Surface>
              )}
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Alert statistics">
            {/* MTTR */}
            <Surface as={motion.div} variants={fadeUp} className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Mean Time to Resolve</h3>
              </div>
              <p className="text-3xl font-bold text-cyan-400">25m</p>
              <p className="text-xs text-white/40 mt-1">Across all active alerts</p>
            </Surface>

            {/* By engine */}
            <Surface as={motion.div} variants={fadeUp} className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">By Engine</h3>
              <div className="space-y-2.5">
                {(['Protect', 'Grow', 'Execute', 'Govern'] as Alert['engine'][]).map((eng) => {
                  const count = alerts.filter((a) => a.engine === eng).length;
                  const colors: Record<Alert['engine'], string> = { Protect: 'var(--engine-protect)', Grow: 'var(--engine-grow)', Execute: 'var(--engine-execute)', Govern: 'var(--engine-govern)' };
                  return (
                    <div key={eng} className="flex items-center gap-2">
                      <span className="text-xs text-white/50 w-16">{eng}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${count / alerts.length * 100}%`, background: colors[eng] }} />
                      </div>
                      <span className="text-xs text-white/50 w-4 text-right">{count}</span>
                    </div>);

                })}
              </div>
            </Surface>

            {/* Alert stats */}
            <Surface as={motion.div} variants={fadeUp} className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Alert Stats</h3>
              </div>
              <div className="space-y-2.5">
                {[
                { label: 'Resolved this week', value: String(resolvedAlerts), positive: true },
                { label: 'Avg resolution', value: '25m', positive: false },
                { label: 'False positive rate', value: `${falsePositiveRate}%`, positive: false }].
                map((stat) =>
                <div key={stat.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{stat.label}</span>
                    <span className={`text-xs font-medium ${stat.positive ? 'text-emerald-400' : 'text-white/70'}`}>{stat.value}</span>
                  </div>
                )}
              </div>
            </Surface>

            {/* Resolution timeline */}
            <Surface as={motion.div} variants={fadeUp} className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Resolution Timeline</h3>
              </div>
              <div className="space-y-2">
                {[
                { label: 'Root cause identified', time: '14:28', done: true },
                { label: 'Alerts correlated', time: '14:30', done: true },
                { label: 'User notified', time: '14:31', done: false },
                { label: 'Resolution pending', time: '—', done: false }].
                map((step) =>
                <div key={step.label} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${step.done ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className="text-xs text-white/60 flex-1">{step.label}</span>
                    <span className="text-xs text-white/30">{step.time}</span>
                  </div>
                )}
              </div>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/dashboard/alerts'].auditId} pageContext={GOVERNANCE_META['/dashboard/alerts'].pageContext} />
      </motion.div>
    </div>);

}

export default AlertsHub;
