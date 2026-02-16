import React, { useState } from 'react';
import { Link } from '../router';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  title: string;
  confidence: number;
  time: string;
  status: 'unread' | 'in-progress' | 'resolved';
  shapFactors: Array<{ label: string; value: number }>;
}

const alerts: Alert[] = [
  { id: 'ALT-001', severity: 'critical', engine: 'Protect', title: 'Unusual login from new device — IP 203.0.113.42', confidence: 0.96, time: '12m ago', status: 'unread', shapFactors: [{ label: 'Device fingerprint', value: 0.42 }, { label: 'Geo anomaly', value: 0.35 }, { label: 'Session timing', value: 0.23 }] },
  { id: 'ALT-002', severity: 'critical', engine: 'Protect', title: 'Suspicious vendor charge — MerchantX $4,200', confidence: 0.94, time: '28m ago', status: 'unread', shapFactors: [{ label: 'Merchant history', value: 0.55 }, { label: 'Amount deviation', value: 0.30 }, { label: 'Category risk', value: 0.15 }] },
  { id: 'ALT-003', severity: 'warning', engine: 'Grow', title: 'Budget threshold approaching — 87% utilized', confidence: 0.84, time: '1h ago', status: 'in-progress', shapFactors: [{ label: 'Spending rate', value: 0.50 }, { label: 'Budget remaining', value: 0.30 }] },
  { id: 'ALT-004', severity: 'warning', engine: 'Execute', title: '2 actions expire within 24 hours', confidence: 0.82, time: '3h ago', status: 'unread', shapFactors: [{ label: 'Time urgency', value: 0.45 }, { label: 'Impact', value: 0.35 }] },
  { id: 'ALT-005', severity: 'info', engine: 'Grow', title: 'New savings opportunity — surplus cash detected', confidence: 0.78, time: '6h ago', status: 'in-progress', shapFactors: [{ label: 'Cash surplus', value: 0.60 }, { label: 'Rate differential', value: 0.25 }] },
  { id: 'ALT-006', severity: 'info', engine: 'Govern', title: 'Model retrained — FraudDetection v3.3 deployed', confidence: 0.99, time: '8h ago', status: 'resolved', shapFactors: [{ label: 'Model accuracy', value: 0.72 }, { label: 'Dataset coverage', value: 0.28 }] },
];

const severityColors = { critical: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500' };
const severityText = { critical: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400' };
const engineColors = { Protect: 'bg-teal-500/20 text-teal-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400', Govern: 'bg-blue-500/20 text-blue-400' };
const statusDots = { unread: 'bg-white', 'in-progress': 'bg-amber-400', resolved: 'bg-emerald-400' };

type SeverityFilter = 'all' | 'critical' | 'warning' | 'info';
type EngineFilter = 'all' | 'Protect' | 'Grow' | 'Execute' | 'Govern';

const milestones = [
  { label: 'Root cause identified', date: '14:28', status: 'completed' as const },
  { label: 'Alerts correlated', date: '14:30', status: 'completed' as const },
  { label: 'User notified', date: '14:31', status: 'current' as const },
  { label: 'Resolution pending', date: '—', status: 'upcoming' as const },
];

/* ── component ────────────────────────────────────────────── */

export const AlertsHub: React.FC = () => {
  const contract = getRouteScreenContract('alerts-hub');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [engineFilter, setEngineFilter] = useState<EngineFilter>('all');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(alerts[0].id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (engineFilter !== 'all' && a.engine !== engineFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* AI Root Cause Insight */}
      <div className="engine-card border-l-2 border-violet-500/50 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
            <span className="text-violet-400 text-sm">AI</span>
          </div>
          <div>
            <p className="text-sm text-white">3 alerts share a common root cause: <span className="text-violet-300 font-semibold">vendor payment anomaly</span>.</p>
            <p className="text-xs text-white/50 mt-1">Correlation detected across Protect and Execute engines.</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Engine filter chips */}
        {(['all', 'Protect', 'Grow', 'Execute', 'Govern'] as EngineFilter[]).map((eng) => {
          const count = eng === 'all' ? alerts.length : alerts.filter((a) => a.engine === eng).length;
          return (
            <button key={eng} onClick={() => setEngineFilter(eng)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${engineFilter === eng ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
              {eng === 'all' ? 'All' : eng} ({count})
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'critical', 'warning', 'info'] as SeverityFilter[]).map((sev) => (
          <button key={sev} onClick={() => setSeverityFilter(sev)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${severityFilter === sev ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>
            {sev === 'all' ? 'All severity' : sev}
          </button>
        ))}
      </div>

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <span className="text-xs text-white/60">{selectedIds.size} selected</span>
          <button className="text-xs text-teal-400 hover:underline">Resolve all</button>
          <button className="text-xs text-white/40 hover:underline">Dismiss all</button>
        </div>
      )}

      {/* Alert List */}
      <section className="space-y-2">
        {filtered.map((alert) => (
          <div key={alert.id} className="engine-card">
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <input type="checkbox" checked={selectedIds.has(alert.id)} onChange={() => toggleSelect(alert.id)} className="mt-1.5 accent-teal-500" />

              {/* Severity dot */}
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${severityColors[alert.severity]}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineColors[alert.engine]}`}>{alert.engine}</span>
                  <span className={`text-[10px] font-medium uppercase ${severityText[alert.severity]}`}>{alert.severity}</span>
                  <span className="text-[10px] text-white/30">{alert.time}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ml-auto ${statusDots[alert.status]}`} title={alert.status} />
                </div>
                <button onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)} className="text-sm font-medium text-white hover:text-teal-300 transition-colors text-left mt-1">
                  {alert.title}
                </button>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-white/40">Confidence {alert.confidence}</span>
                </div>

                {/* Expanded SHAP factors */}
                {expandedAlert === alert.id && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                    {alert.shapFactors.map((f) => (
                      <div key={f.label} className="flex items-center gap-2">
                        <span className="text-xs text-white/50 w-32 shrink-0">{f.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-teal-500/60" style={{ width: `${f.value * 100}%` }} />
                        </div>
                        <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <Link to="/protect/alert-detail" className="text-xs text-teal-400 hover:underline">View detail</Link>
                      <button className="text-xs text-white/40 hover:text-white/60">Dismiss</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <ProofLine claim={`${filtered.length} alerts displayed`} evidence="Priority-sorted by severity and confidence | All engines reporting" source="Cross-engine composite" basis="real-time" sourceType="model" />

      <GovernContractSet auditId="GV-2026-0216-ALT1" modelVersion="v3.2" explanationVersion="xai-1.1" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card flex flex-col items-center">
        <ScoreRing score={25} maxScore={100} label="MTTR" size="md" color="var(--accent-teal)" />
        <p className="text-xs text-white/40 mt-2">Mean time to resolve: 25 minutes</p>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">By Engine</h4>
        <CategoryScoreBar categories={[
          { label: 'Protect', score: 3, color: 'var(--accent-teal)' },
          { label: 'Grow', score: 1, color: 'var(--accent-violet)' },
          { label: 'Execute', score: 1, color: 'var(--accent-gold)' },
          { label: 'Govern', score: 1, color: 'var(--accent-blue)' },
        ]} />
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Resolution Timeline</h4>
        <MilestonesTimeline milestones={milestones} accentColor="var(--accent-teal)" />
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Alert Stats</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">Resolved this week</span><span className="text-emerald-400">35</span></div>
          <div className="flex justify-between"><span className="text-white/50">Avg resolution</span><span className="text-white/70">2.4h</span></div>
          <div className="flex justify-between"><span className="text-white/50">False positive rate</span><span className="text-white/70">3%</span></div>
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
        kicker: 'Alerts Hub',
        headline: '3 alerts share a common root cause: vendor payment anomaly.',
        subline: '12 active | 35 resolved this week | Avg resolution: 2.4h',
        proofLine: { claim: '12 active alerts', evidence: 'Cross-engine priority ranking | Real-time correlation', source: 'Signal composite' },
        freshness: new Date(Date.now() - 3 * 60 * 1000),
        kpis: [
          { label: 'Active', value: '12', accent: 'amber', definition: 'Unresolved alerts across all engines' },
          { label: 'Resolved (7d)', value: '35', accent: 'teal', definition: 'Alerts resolved in the last 7 days' },
          { label: 'MTTR', value: '25m', accent: 'cyan', definition: 'Mean time to resolve alerts' },
          { label: 'False pos.', value: '3%', accent: 'blue', definition: 'Rate of incorrectly flagged alerts' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default AlertsHub;
