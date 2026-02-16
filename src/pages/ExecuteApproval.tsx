import React, { useState } from 'react';
import { Link } from '../router';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

interface QueueAction {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  confidence: number;
  impact: { approved: string; declined: string };
  reversible: boolean;
  expiresIn: string | null;
  factors: Array<{ label: string; value: number }>;
}

const queueActions: QueueAction[] = [
  {
    id: 'ACT-001', engine: 'Execute', title: 'Consolidate streaming subscriptions',
    description: 'Cancel Netflix + Hulu, subscribe to YouTube Premium family plan.',
    urgency: 'high', confidence: 0.92,
    impact: { approved: 'Save $28/mo ($336/yr)', declined: 'Continue paying $43/mo for overlapping services' },
    reversible: true, expiresIn: '18h',
    factors: [{ label: 'Cost reduction', value: 0.92 }, { label: 'Content overlap', value: 0.88 }, { label: 'Service parity', value: 0.82 }],
  },
  {
    id: 'ACT-002', engine: 'Protect', title: 'Block suspicious card ending 4821',
    description: 'Temporary freeze on card used in unrecognized $4,200 transaction.',
    urgency: 'high', confidence: 0.94,
    impact: { approved: 'Card frozen, transaction disputed automatically', declined: 'Card remains active, potential additional fraud exposure' },
    reversible: true, expiresIn: '6h',
    factors: [{ label: 'Merchant risk', value: 0.87 }, { label: 'Amount anomaly', value: 0.71 }, { label: 'Geo mismatch', value: 0.65 }],
  },
  {
    id: 'ACT-003', engine: 'Grow', title: 'Transfer surplus to high-yield savings',
    description: 'Move $2,400 surplus from checking to savings account earning 4.8% APY.',
    urgency: 'medium', confidence: 0.88,
    impact: { approved: 'Earn additional $9.60/mo in interest', declined: 'Surplus remains idle in checking (0.01% APY)' },
    reversible: true, expiresIn: null,
    factors: [{ label: 'Cash surplus', value: 0.90 }, { label: 'Rate differential', value: 0.78 }, { label: 'Liquidity safe', value: 0.85 }],
  },
  {
    id: 'ACT-004', engine: 'Execute', title: 'Negotiate internet bill renewal',
    description: 'Send auto-negotiation request to ISP before rate increase takes effect.',
    urgency: 'medium', confidence: 0.85,
    impact: { approved: 'Lock in current $65/mo rate for 12 months', declined: 'Rate increases to $89/mo next billing cycle' },
    reversible: false, expiresIn: '3d',
    factors: [{ label: 'Rate lock opportunity', value: 0.85 }, { label: 'Timing window', value: 0.72 }, { label: 'Success likelihood', value: 0.68 }],
  },
  {
    id: 'ACT-005', engine: 'Grow', title: 'Increase emergency fund auto-save',
    description: 'Raise weekly auto-save from $50 to $75 based on increased income stability.',
    urgency: 'low', confidence: 0.81,
    impact: { approved: 'Reach emergency fund goal 3 weeks earlier', declined: 'Continue at current pace, May 2026 completion' },
    reversible: true, expiresIn: null,
    factors: [{ label: 'Income stability', value: 0.94 }, { label: 'Budget headroom', value: 0.76 }, { label: 'Goal acceleration', value: 0.65 }],
  },
];

const urgencyColors = { high: 'border-l-red-500', medium: 'border-l-amber-500', low: 'border-l-blue-500' };
const urgencyBadge = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-blue-500/20 text-blue-400' };
const engineBadge = { Protect: 'bg-teal-500/20 text-teal-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400' };

const milestones = [
  { label: '3 approved today', date: '08:00', status: 'completed' as const },
  { label: '5 pending review', date: 'Now', status: 'current' as const },
  { label: '1 deferred', date: 'Later', status: 'upcoming' as const },
];

/* ── component ────────────────────────────────────────────── */

export const ExecuteApproval: React.FC = () => {
  const contract = getRouteScreenContract('execute-approval');
  const [expandedAction, setExpandedAction] = useState<string | null>(queueActions[0].id);

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Urgency Banner */}
      <div className="engine-card border-l-2 border-red-500/50 mb-4">
        <p className="text-sm text-white"><span className="text-red-400 font-semibold">2 actions expire within 24 hours.</span> Review them before the window closes.</p>
      </div>

      {/* Queue */}
      <section className="space-y-3">
        {queueActions.map((action) => (
          <div key={action.id} className={`engine-card border-l-2 ${urgencyColors[action.urgency]}`}>
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadge[action.engine]}`}>{action.engine}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${urgencyBadge[action.urgency]}`}>{action.urgency}</span>
                  {action.expiresIn && <span className="text-[10px] text-white/30">Expires in {action.expiresIn}</span>}
                  {action.reversible && <span className="text-[10px] text-emerald-400/60">Reversible</span>}
                </div>
                <button onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)} className="text-sm font-medium text-white hover:text-amber-300 transition-colors text-left">
                  {action.title}
                </button>
                <p className="text-xs text-white/50 mt-1">{action.description}</p>
              </div>
              <div className="shrink-0">
                <ScoreRing score={Math.round(action.confidence * 100)} maxScore={100} label="" size="sm" color="var(--engine-execute)" />
              </div>
            </div>

            {/* Expanded evidence */}
            {expandedAction === action.id && (
              <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                {/* SHAP factors */}
                <div className="space-y-2">
                  {action.factors.map((f) => (
                    <div key={f.label} className="flex items-center gap-2">
                      <span className="text-xs text-white/50 w-36 shrink-0">{f.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-amber-500/60" style={{ width: `${f.value * 100}%` }} />
                      </div>
                      <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Impact preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">If approved</p>
                    <p className="text-xs text-white/70">{action.impact.approved}</p>
                  </div>
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                    <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">If declined</p>
                    <p className="text-xs text-white/70">{action.impact.declined}</p>
                  </div>
                </div>

                <ProofLine claim={`Confidence ${action.confidence}`} evidence={`${action.factors.length} factors | ${action.reversible ? 'Reversible' : 'Irreversible'}`} source="Execute engine" basis="per-action" sourceType="model" />

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button className="px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors">Approve</button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">Decline</button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 transition-colors">Defer</button>
                  <Link to="/help" className="px-4 py-2 rounded-lg text-white/30 text-xs hover:text-white/50 transition-colors">More info</Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <ProofLine claim="Consent-first: no action executes without explicit approval" evidence={`${queueActions.length} pending | 3 approved today | 1 deferred`} source="Execute engine" basis="real-time" sourceType="policy" />

      <GovernContractSet auditId="GV-2026-0216-APR1" modelVersion="v1.5" explanationVersion="xai-1.0" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card flex flex-col items-center">
        <ScoreRing score={85} maxScore={100} label="Queue health" size="md" color="var(--engine-execute)" />
        <p className="text-xs text-white/40 mt-2">Composite queue urgency score</p>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Approval Activity</h4>
        <MilestonesTimeline milestones={milestones} accentColor="var(--accent-gold)" />
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Queue Summary</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">Pending</span><span className="text-amber-400 font-medium">5</span></div>
          <div className="flex justify-between"><span className="text-white/50">Approved today</span><span className="text-emerald-400">3</span></div>
          <div className="flex justify-between"><span className="text-white/50">Deferred</span><span className="text-blue-400">1</span></div>
          <div className="flex justify-between"><span className="text-white/50">Avg confidence</span><span className="text-white/70">0.88</span></div>
        </div>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Completed (collapsed)</h4>
        <p className="text-xs text-white/30">3 actions completed today. Expand to review.</p>
        <button className="text-xs text-amber-400 hover:underline mt-2">Show completed</button>
      </article>
    </>
  );

  return (
    <PageShell
      slug="execute"
      contract={contract}
      layout="engine"
      heroVariant="analytical"
      hero={{
        kicker: 'Approval Queue',
        headline: '2 actions expire within 24 hours.',
        subline: 'Consent-first: no action executes without explicit approval.',
        proofLine: { claim: '5 pending approval', evidence: '3 approved today | 1 deferred | All consent-gated', source: 'Execute engine' },
        freshness: new Date(Date.now() - 5 * 60 * 1000),
        kpis: [
          { label: 'Pending', value: '5', accent: 'amber', definition: 'Actions awaiting your approval' },
          { label: 'Approved (24h)', value: '3', accent: 'teal', definition: 'Actions approved in the last 24 hours' },
          { label: 'Deferred', value: '1', accent: 'blue', definition: 'Actions deferred for later review' },
          { label: 'Avg confidence', value: '0.88', accent: 'cyan', definition: 'Mean confidence across pending actions' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default ExecuteApproval;
