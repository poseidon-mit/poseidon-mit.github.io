import React, { useState } from 'react';
import { Link } from '../router';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

interface TimelineEvent {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  type: string;
  title: string;
  description: string;
  confidence: number;
  time: string;
  day: 'Today' | 'Yesterday' | 'Feb 14';
  auditId: string;
}

const events: TimelineEvent[] = [
  { id: 'TE-001', engine: 'Protect', type: 'Alert', title: 'Suspicious login blocked', description: 'Login attempt from unrecognized device (IP 203.0.113.42) automatically blocked.', confidence: 0.96, time: '14:31', day: 'Today', auditId: 'GV-2026-0216-001' },
  { id: 'TE-002', engine: 'Execute', type: 'Action', title: 'Subscription cancelled — Netflix', description: 'Monthly $15.99 subscription cancelled per approved action ACT-003.', confidence: 0.92, time: '13:45', day: 'Today', auditId: 'GV-2026-0216-002' },
  { id: 'TE-003', engine: 'Grow', type: 'Update', title: 'Emergency fund — $8,160 reached', description: '68% progress toward $12,000 goal. On track for May 2026 completion.', confidence: 0.87, time: '12:00', day: 'Today', auditId: 'GV-2026-0216-003' },
  { id: 'TE-004', engine: 'Govern', type: 'Audit', title: 'Weekly audit report generated', description: '1,247 decisions audited. 100% coverage. 0 exceptions.', confidence: 0.99, time: '09:00', day: 'Today', auditId: 'GV-2026-0216-004' },
  { id: 'TE-005', engine: 'Execute', type: 'Action', title: 'Auto-save round-ups completed', description: '$127 in round-ups transferred to savings account.', confidence: 0.95, time: '23:55', day: 'Yesterday', auditId: 'GV-2026-0215-001' },
  { id: 'TE-006', engine: 'Protect', type: 'Resolution', title: 'Fraud alert resolved — Amazon charge', description: 'Charge confirmed legitimate by cardholder. Alert closed.', confidence: 0.88, time: '16:20', day: 'Yesterday', auditId: 'GV-2026-0215-002' },
  { id: 'TE-007', engine: 'Grow', type: 'Insight', title: 'Savings rate improved +2.3%', description: 'Spending optimization actions led to measurable savings rate increase.', confidence: 0.85, time: '10:00', day: 'Yesterday', auditId: 'GV-2026-0215-003' },
  { id: 'TE-008', engine: 'Govern', type: 'Policy', title: 'Trust score updated to 92', description: 'System trust score recalculated after model accuracy improvement.', confidence: 0.97, time: '09:00', day: 'Feb 14', auditId: 'GV-2026-0214-001' },
];

const engineDotColor = { Protect: 'bg-teal-500', Grow: 'bg-violet-500', Execute: 'bg-amber-500', Govern: 'bg-blue-500' };
const engineBadge = { Protect: 'bg-teal-500/20 text-teal-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };
const typeBadge: Record<string, string> = { Alert: 'bg-red-500/20 text-red-400', Action: 'bg-amber-500/20 text-amber-400', Update: 'bg-blue-500/20 text-blue-400', Audit: 'bg-blue-500/20 text-blue-400', Resolution: 'bg-emerald-500/20 text-emerald-400', Insight: 'bg-violet-500/20 text-violet-400', Policy: 'bg-blue-500/20 text-blue-400' };

const milestones = [
  { label: '22 actions this week', date: 'Today', status: 'current' as const },
  { label: 'All engines reporting', date: 'Ongoing', status: 'completed' as const },
  { label: '100% audit coverage', date: 'Maintained', status: 'completed' as const },
];

/* ── component ────────────────────────────────────────────── */

export const ActivityTimelinePage: React.FC = () => {
  const contract = getRouteScreenContract('activity-timeline');
  const [engineFilter, setEngineFilter] = useState<string>('all');

  const filtered = engineFilter === 'all' ? events : events.filter((e) => e.engine === engineFilter);
  const grouped = filtered.reduce<Record<string, TimelineEvent[]>>((acc, ev) => {
    (acc[ev.day] ??= []).push(ev);
    return acc;
  }, {});

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-emerald-400 font-medium">Live</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'Protect', 'Grow', 'Execute', 'Govern'].map((eng) => (
          <button key={eng} onClick={() => setEngineFilter(eng)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${engineFilter === eng ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
            {eng === 'all' ? 'All engines' : eng}
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      {Object.entries(grouped).map(([day, dayEvents]) => (
        <div key={day} className="mb-6">
          {/* Day separator */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-white/60">{day}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Events */}
          <div className="relative pl-6">
            {/* Central vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />

            {dayEvents.map((ev) => (
              <div key={ev.id} className="relative mb-3">
                {/* Engine-colored dot */}
                <div className={`absolute left-[-16px] top-3 w-3 h-3 rounded-full ring-2 ring-[#0A1628] ${engineDotColor[ev.engine]}`} />

                <div className="engine-card ml-2">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] text-white/30">{ev.time}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadge[ev.engine]}`}>{ev.engine}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeBadge[ev.type] ?? 'bg-white/10 text-white/40'}`}>{ev.type}</span>
                    <span className="text-[10px] text-white/30 ml-auto">conf. {ev.confidence}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">{ev.title}</h4>
                  <p className="text-xs text-white/50 mt-1">{ev.description}</p>
                  <Link to="/govern/audit-detail" className="text-[10px] text-blue-400 hover:underline mt-1 inline-block">{ev.auditId}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <ProofLine claim={`${filtered.length} events displayed`} evidence="Full traceability | Every event linked to audit ID" source="Cross-engine log" basis="real-time" sourceType="audit" />

      <GovernContractSet auditId="GV-2026-0216-TL01" modelVersion="ActivityLog v1.0" explanationVersion="xai-1.1" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Today{'\''}s Summary</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">Protect events</span><span className="text-teal-400">1</span></div>
          <div className="flex justify-between"><span className="text-white/50">Grow events</span><span className="text-violet-400">1</span></div>
          <div className="flex justify-between"><span className="text-white/50">Execute events</span><span className="text-amber-400">1</span></div>
          <div className="flex justify-between"><span className="text-white/50">Govern events</span><span className="text-blue-400">1</span></div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs"><span className="text-white/50">Most active</span><span className="text-white/70">Execute</span></div>
          <div className="flex justify-between text-xs mt-1"><span className="text-white/50">Audit coverage</span><span className="text-emerald-400">100%</span></div>
        </div>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Key Milestones</h4>
        <MilestonesTimeline milestones={milestones} accentColor="var(--accent-blue)" />
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
        kicker: 'Activity Timeline',
        headline: 'Chronological event trace across all engines.',
        subline: 'Every action, alert, and decision — fully traceable.',
        proofLine: { claim: 'Full traceability', evidence: 'Every event linked to engine + audit ID | 100% coverage', source: 'Cross-engine log' },
        freshness: new Date(Date.now() - 1 * 60 * 1000),
        kpis: [
          { label: 'Events (7d)', value: '22', accent: 'teal', definition: 'Total events across engines this week' },
          { label: 'Engines active', value: '4/4', accent: 'blue', definition: 'All engines reporting activity' },
          { label: 'Success rate', value: '99%', accent: 'cyan', definition: 'Actions completed without rollback' },
          { label: 'Audit coverage', value: '100%', accent: 'amber', definition: 'All events have audit trail' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default ActivityTimelinePage;
