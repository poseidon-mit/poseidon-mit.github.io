import React, { useState } from 'react';
import { Link } from '../router';
import { GovernContractSet } from '../components/GovernContractSet';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

interface Notification {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  category: 'security' | 'growth' | 'actions' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionLink?: string;
  grouped?: number;
}

const notifications: Notification[] = [
  { id: 'N-001', engine: 'Protect', category: 'security', title: 'Suspicious transaction blocked', body: 'Card ending 4821 temporarily frozen after unrecognized $4,200 charge.', time: 'Just now', read: false, actionLink: '/protect/alert-detail' },
  { id: 'N-002', engine: 'Protect', category: 'security', title: 'Login from new device detected', body: 'IP 203.0.113.42 — if this was you, no action needed.', time: '12m ago', read: false, actionLink: '/protect' },
  { id: 'N-003', engine: 'Grow', category: 'growth', title: 'Emergency fund milestone — $8,000 reached', body: 'You are now 67% toward your $12,000 goal.', time: '1h ago', read: false },
  { id: 'N-004', engine: 'Grow', category: 'growth', title: 'New savings recommendation available', body: 'Subscription consolidation could save $140/mo.', time: '2h ago', read: false, actionLink: '/grow/recommendations' },
  { id: 'N-005', engine: 'Execute', category: 'actions', title: 'Action approved — Bill negotiation sent', body: 'Internet bill renegotiation request submitted to ISP.', time: '3h ago', read: true, actionLink: '/execute/history' },
  { id: 'N-006', engine: 'Execute', category: 'actions', title: '2 actions expiring soon', body: 'Streaming consolidation and card freeze expire in 18h.', time: '4h ago', read: true, actionLink: '/execute/approval' },
  { id: 'N-007', engine: 'Govern', category: 'system', title: 'Weekly audit report ready', body: '1,247 decisions audited. 100% coverage maintained.', time: '6h ago', read: true, actionLink: '/govern/audit' },
  { id: 'N-008', engine: 'Govern', category: 'system', title: 'Model update — FraudDetection v3.3', body: 'New model deployed with 0.2% accuracy improvement.', time: '8h ago', read: true },
];

const categoryTabs = [
  { key: 'all', label: 'All', count: 23 },
  { key: 'security', label: 'Security', count: 5, color: 'text-teal-400' },
  { key: 'growth', label: 'Growth', count: 8, color: 'text-violet-400' },
  { key: 'actions', label: 'Actions', count: 6, color: 'text-amber-400' },
  { key: 'system', label: 'System', count: 4, color: 'text-white/40' },
] as const;

const engineIcon = { Protect: 'S', Grow: 'G', Execute: 'E', Govern: 'V' };
const engineBadge = { Protect: 'bg-teal-500/20 text-teal-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };

type CategoryFilter = typeof categoryTabs[number]['key'];

/* ── component ────────────────────────────────────────────── */

export const Notifications: React.FC = () => {
  const contract = getRouteScreenContract('notifications');
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [readState, setReadState] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.id, n.read]))
  );

  const unreadCount = Object.values(readState).filter((r) => !r).length;
  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.category === filter);
  const sorted = [...filtered].sort((a, b) => (readState[a.id] === readState[b.id] ? 0 : readState[a.id] ? 1 : -1));

  const markAllRead = () => setReadState(Object.fromEntries(notifications.map((n) => [n.id, true])));
  const markRead = (id: string) => setReadState((prev) => ({ ...prev, [id]: true }));

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Header with mark all read */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">{unreadCount} unread</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          )}
        </div>
        <button onClick={markAllRead} className="text-xs text-white/40 hover:text-white/60 transition-colors">Mark all read</button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categoryTabs.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === tab.key ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notification list */}
      <section className="space-y-2">
        {sorted.map((notif) => (
          <div key={notif.id} className={`engine-card flex items-start gap-3 ${!readState[notif.id] ? 'bg-white/[0.04]' : ''}`} onClick={() => markRead(notif.id)}>
            {/* Unread dot */}
            <div className="pt-1.5 w-2 shrink-0">
              {!readState[notif.id] && <div className="w-2 h-2 rounded-full bg-teal-500" />}
            </div>

            {/* Engine icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${engineBadge[notif.engine]}`}>
              {engineIcon[notif.engine]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm ${!readState[notif.id] ? 'font-semibold text-white' : 'font-medium text-white/70'}`}>{notif.title}</h4>
              <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{notif.body}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-white/30">{notif.time}</span>
                {notif.actionLink && (
                  <Link to={notif.actionLink} className="text-[10px] text-teal-400 hover:underline">View</Link>
                )}
              </div>
            </div>

            {/* Three-dot menu */}
            <button className="text-white/20 hover:text-white/40 text-lg leading-none shrink-0">...</button>
          </div>
        ))}
      </section>

      <GovernContractSet auditId="GV-2026-0216-NOTIF" modelVersion="NotifEngine v1.0" explanationVersion="xai-1.0" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Preferences</h4>
        <div className="space-y-3">
          {[
            { label: 'Security alerts', type: 'Push + Email', enabled: true },
            { label: 'Growth insights', type: 'Push only', enabled: true },
            { label: 'Action updates', type: 'Push only', enabled: true },
            { label: 'System notices', type: 'Email digest', enabled: false },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <span className="text-xs text-white/70">{pref.label}</span>
                <span className="text-[10px] text-white/30 block">{pref.type}</span>
              </div>
              <div className={`w-9 h-5 rounded-full relative ${pref.enabled ? 'bg-teal-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${pref.enabled ? 'left-4' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
          <div className="pt-2">
            <span className="text-xs text-white/50 block mb-1">Digest frequency</span>
            <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70 focus:outline-none">
              <option>Daily</option><option>Weekly</option><option>Monthly</option>
            </select>
          </div>
        </div>
        <ProofLine claim="3 channels active" evidence="Push + Email for security | Push for growth and actions" source="Notification policy" basis="current" sourceType="policy" />
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
        kicker: 'Notifications',
        headline: `${unreadCount} unread notifications across all engines.`,
        subline: 'Filtered to action-relevant alerts only.',
        proofLine: { claim: `${unreadCount} unread`, evidence: '23 total | Categorized by engine and type', source: 'Notification engine' },
        freshness: new Date(Date.now() - 1 * 60 * 1000),
        kpis: [
          { label: 'Unread', value: String(unreadCount), accent: 'amber', definition: 'Notifications awaiting review' },
          { label: 'Security', value: '5', accent: 'teal', definition: 'Security-related notifications' },
          { label: 'Growth', value: '8', accent: 'violet', definition: 'Growth insight notifications' },
          { label: 'Actions', value: '6', accent: 'cyan', definition: 'Action-related notifications' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Notifications;
