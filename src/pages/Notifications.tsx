import { useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Settings2 } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse, EmptyState } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, Surface } from '@/design-system';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface Notification {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  category: 'security' | 'growth' | 'actions' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionLink?: string;
}

const notifications: Notification[] = [
  { id: 'N-001', engine: 'Protect', category: 'security', title: 'Suspicious transaction blocked', body: `Card ending ${DEMO_THREAD.criticalAlert.cardLast4} temporarily frozen after unrecognized $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} charge.`, time: 'Just now', read: false, actionLink: '/protect/alert-detail' },
  { id: 'N-002', engine: 'Protect', category: 'security', title: 'Login from new device detected', body: 'IP 203.0.113.42 — if this was you, no action needed.', time: '12m ago', read: false, actionLink: '/protect' },
  { id: 'N-003', engine: 'Grow', category: 'growth', title: `Emergency fund milestone — $${DEMO_THREAD.emergencyFund.current.toLocaleString()} reached`, body: `You are now ${DEMO_THREAD.emergencyFund.percent}% toward your $${DEMO_THREAD.emergencyFund.target.toLocaleString()} goal.`, time: '1h ago', read: false },
  { id: 'N-004', engine: 'Grow', category: 'growth', title: 'New savings recommendation available', body: 'Subscription consolidation could save $140/mo.', time: '2h ago', read: false },
  { id: 'N-005', engine: 'Execute', category: 'actions', title: 'Action approved — Bill negotiation sent', body: 'Internet bill renegotiation request submitted to ISP.', time: '3h ago', read: true, actionLink: '/execute/history' },
  { id: 'N-006', engine: 'Execute', category: 'actions', title: '2 actions expiring soon', body: 'Streaming consolidation and card freeze expire in 18h.', time: '4h ago', read: true, actionLink: '/execute/approval' },
  { id: 'N-007', engine: 'Govern', category: 'system', title: 'Weekly audit report ready', body: '1,247 decisions audited. 100% coverage maintained.', time: '6h ago', read: true, actionLink: '/govern/audit' },
  { id: 'N-008', engine: 'Govern', category: 'system', title: 'Model update — FraudDetection v3.3', body: 'New model deployed with 0.2% accuracy improvement.', time: '8h ago', read: true }];


const engineBadgeCls: Record<string, string> = { Protect: 'bg-emerald-500/20 text-emerald-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };
const engineInitial: Record<string, string> = { Protect: 'P', Grow: 'G', Execute: 'E', Govern: 'G' };

type CategoryFilter = 'all' | 'security' | 'growth' | 'actions' | 'system';

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function Notifications() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);

  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [readState, setReadState] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.id, n.read]))
  );

  const unreadCount = Object.values(readState).filter((r) => !r).length;
  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.category === filter);
  const sorted = [...filtered].sort((a, b) => readState[a.id] === readState[b.id] ? 0 : readState[a.id] ? 1 : -1);
  const categoryCounts = {
    security: notifications.filter((n) => n.category === 'security').length,
    growth: notifications.filter((n) => n.category === 'growth').length,
    actions: notifications.filter((n) => n.category === 'actions').length,
    system: notifications.filter((n) => n.category === 'system').length
  };

  const markAllRead = () => setReadState(Object.fromEntries(notifications.map((n) => [n.id, true])));
  const markRead = (id: string) => setReadState((prev) => ({ ...prev, [id]: true }));
  const markReadByKeyboard = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      markRead(id);
    }
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
          <span className="text-sm text-white/50">Notifications</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main">

        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-5 w-5" style={{ color: 'var(--engine-dashboard)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-dashboard)' }}>
              Dashboard · Notifications
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-slate-400">
            {unreadCount} unread notifications across all engines
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Unread', value: String(unreadCount), color: 'var(--engine-execute)' },
              { label: 'Security', value: String(categoryCounts.security), color: 'var(--engine-protect)' },
              { label: 'Growth', value: String(categoryCounts.growth), color: 'var(--engine-grow)' },
              { label: 'Actions', value: String(categoryCounts.actions), color: 'var(--engine-dashboard)' }].
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
            {/* Header controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">{unreadCount} unread</span>
                {unreadCount > 0 && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <Button onClick={markAllRead} variant="ghost" engine="dashboard" size="sm" className="!min-h-7 !px-2 text-xs text-white/40 hover:text-white/60 transition-colors">Mark all read</Button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'security', 'growth', 'actions', 'system'] as CategoryFilter[]).map((t) =>
                <Button
                  key={t}
                  onClick={() => setFilter(t)}
                  variant="glass"
                  engine="dashboard"
                  size="sm"
                  className={`!min-h-8 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap capitalize transition-colors ${filter === t ? 'text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>

                  {t === 'all' ? `All (${notifications.length})` : `${t} (${notifications.filter((n) => n.category === t).length})`}
                </Button>
              )}
            </div>

            {/* Notification list */}
            <div className="flex flex-col gap-2" aria-live="polite" aria-label="Notifications list">
              {sorted.length === 0 && (
                <EmptyState
                  title="No notifications found"
                  description="Try another filter to view more updates."
                  icon={Bell}
                  accentColor="var(--engine-dashboard)"
                />
              )}
              {sorted.map((notif) =>
                <div
                  key={notif.id}
                  className={`rounded-2xl border border-white/[0.08] p-4 flex items-start gap-3 cursor-pointer transition-colors ${!readState[notif.id] ? 'bg-white/[0.05]' : 'bg-white/[0.02]'}`}
                  onClick={() => markRead(notif.id)}
                  onKeyDown={(event) => markReadByKeyboard(event, notif.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${notif.title}. ${readState[notif.id] ? 'Read' : 'Unread'}. ${notif.time}`}>

                  {/* Unread dot */}
                  <div className="pt-1.5 w-2 shrink-0">
                    {!readState[notif.id] && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </div>

                  {/* Engine icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${engineBadgeCls[notif.engine]}`}>
                    {engineInitial[notif.engine]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm ${!readState[notif.id] ? 'font-semibold text-white' : 'font-medium text-white/70'}`}>{notif.title}</h4>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{notif.body}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/30">{notif.time}</span>
                      {notif.actionLink &&
                        <Link to={notif.actionLink} className="text-[10px] text-cyan-400 hover:underline" onClick={(e) => e.stopPropagation()}>View</Link>
                      }
                    </div>
                  </div>

                  {/* Menu button */}
                  <Button variant="ghost" engine="dashboard" size="sm" className="text-white/20 hover:text-white/40 text-lg leading-none shrink-0 !h-8 !min-h-8 !w-8 !px-0" onClick={(e) => e.stopPropagation()}>⋯</Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Notification preferences">
            {/* Preferences */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="rounded-2xl" variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="h-4 w-4" style={{ color: 'var(--engine-dashboard)' }} />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Alert Preferences</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Security alerts', type: 'Push + Email', enabled: true },
                    { label: 'Growth insights', type: 'Push only', enabled: true },
                    { label: 'Action updates', type: 'Push only', enabled: true },
                    { label: 'System notices', type: 'Email digest', enabled: false }
                  ].map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0 pb-3">
                      <div>
                        <span className="text-sm font-medium text-white tracking-wide">{pref.label}</span>
                        <span className="text-[10px] text-white/40 block uppercase tracking-widest font-semibold mt-0.5">{pref.type}</span>
                      </div>
                      <div className={`w-9 h-5 rounded-full relative ${pref.enabled ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${pref.enabled ? 'left-4' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="text-xs text-white/50 block mb-1">Digest frequency</span>
                    <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70 focus:outline-none">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-white/30 mt-4 uppercase tracking-widest font-semibold border-t border-white/[0.04] pt-4">3 channels active · Push + Email for security</p>
              </Surface>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="rounded-2xl" variant="glass" padding="md">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Notification Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total today', value: String(notifications.length), color: 'text-white' },
                    { label: 'Unread', value: String(unreadCount), color: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' },
                    { label: 'Security', value: String(categoryCounts.security), color: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]' },
                    { label: 'Actioned (7d)', value: '87%', color: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' }
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-1 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">{row.label}</span>
                      <span className={`text-sm font-mono ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </Surface>
            </motion.div>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/dashboard/notifications'].auditId} pageContext={GOVERNANCE_META['/dashboard/notifications'].pageContext} />
      </motion.div>
    </div>);

}

export default Notifications;
