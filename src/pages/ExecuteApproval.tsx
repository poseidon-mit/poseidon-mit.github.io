import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter } from '../components/dashboard/GovernFooter';
import { Dialog, DialogContent } from '../components/ui/dialog';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

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
  { id: 'ACT-001', engine: 'Execute', title: 'Consolidate streaming subscriptions', description: 'Cancel Netflix + Hulu, subscribe to YouTube Premium family plan.', urgency: 'high', confidence: 0.92, impact: { approved: 'Save $28/mo ($336/yr)', declined: 'Continue paying $43/mo for overlapping services' }, reversible: true, expiresIn: '18h', factors: [{ label: 'Cost reduction', value: 0.92 }, { label: 'Content overlap', value: 0.88 }, { label: 'Service parity', value: 0.82 }] },
  { id: 'ACT-002', engine: 'Protect', title: 'Block suspicious card ending 4821', description: 'Temporary freeze on card used in unrecognized $4,200 transaction.', urgency: 'high', confidence: 0.94, impact: { approved: 'Card frozen, transaction disputed automatically', declined: 'Card remains active, potential additional fraud exposure' }, reversible: true, expiresIn: '6h', factors: [{ label: 'Merchant risk', value: 0.87 }, { label: 'Amount anomaly', value: 0.71 }, { label: 'Geo mismatch', value: 0.65 }] },
  { id: 'ACT-003', engine: 'Grow', title: 'Transfer surplus to high-yield savings', description: 'Move $2,400 surplus from checking to savings account earning 4.8% APY.', urgency: 'medium', confidence: 0.88, impact: { approved: 'Earn additional $9.60/mo in interest', declined: 'Surplus remains idle in checking (0.01% APY)' }, reversible: true, expiresIn: null, factors: [{ label: 'Cash surplus', value: 0.90 }, { label: 'Rate differential', value: 0.78 }, { label: 'Liquidity safe', value: 0.85 }] },
  { id: 'ACT-004', engine: 'Execute', title: 'Negotiate internet bill renewal', description: 'Send auto-negotiation request to ISP before rate increase takes effect.', urgency: 'medium', confidence: 0.85, impact: { approved: 'Lock in current $65/mo rate for 12 months', declined: 'Rate increases to $89/mo next billing cycle' }, reversible: false, expiresIn: '3d', factors: [{ label: 'Rate lock opportunity', value: 0.85 }, { label: 'Timing window', value: 0.72 }, { label: 'Success likelihood', value: 0.68 }] },
  { id: 'ACT-005', engine: 'Grow', title: 'Increase emergency fund auto-save', description: 'Raise weekly auto-save from $50 to $75 based on increased income stability.', urgency: 'low', confidence: 0.81, impact: { approved: 'Reach emergency fund goal 3 weeks earlier', declined: 'Continue at current pace, May 2026 completion' }, reversible: true, expiresIn: null, factors: [{ label: 'Income stability', value: 0.94 }, { label: 'Budget headroom', value: 0.76 }, { label: 'Goal acceleration', value: 0.65 }] },
];

const urgencyBorderColor = { high: '#EF4444', medium: '#EAB308', low: '#3B82F6' };
const urgencyBadgeCls = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-blue-500/20 text-blue-400' };
const engineBadgeCls = { Protect: 'bg-emerald-500/20 text-emerald-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400' };

const circumference = 2 * Math.PI * 40;

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function ExecuteApproval() {
  const [expandedAction, setExpandedAction] = useState<string | null>(queueActions[0].id);
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'approve' | 'decline' } | null>(null);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  const handleConfirm = () => {
    if (confirmAction) {
      setProcessedIds((prev) => new Set([...prev, confirmAction.id]));
      setExpandedAction(null);
      setConfirmAction(null);
    }
  };

  const visibleActions = queueActions.filter((a) => !processedIds.has(a.id));

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#EAB308', color: '#0B1221' }}
      >
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
        style={{ background: 'rgba(11,18,33,0.8)' }}
        aria-label="Breadcrumb"
      >
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/execute"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#EAB308' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Execute
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Approval Queue</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5" style={{ color: '#EAB308' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#EAB308' }}>
              Execute · Approval Queue
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Approval Queue</h1>
          <p className="text-sm text-slate-400">
            Consent-first: no action executes without your approval · 2 actions expire within 24 hours
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Pending', value: '5', color: '#EAB308' },
              { label: 'Approved (24h)', value: '3', color: '#22C55E' },
              { label: 'Deferred', value: '1', color: '#3B82F6' },
              { label: 'Avg confidence', value: '0.88', color: '#00F0FF' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {/* Urgency banner */}
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4" style={{ borderLeftWidth: 2, borderLeftColor: '#EF4444' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-white">
                  <span className="text-red-400 font-semibold">2 actions expire within 24 hours.</span>
                  {' '}Review them before the window closes.
                </p>
              </div>
            </div>

            {/* Action queue */}
            <div className="flex flex-col gap-3">
              {visibleActions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-5"
                  style={{ borderLeftWidth: 3, borderLeftColor: urgencyBorderColor[action.urgency] }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadgeCls[action.engine]}`}>{action.engine}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${urgencyBadgeCls[action.urgency]}`}>{action.urgency}</span>
                        {action.expiresIn && <span className="text-[10px] text-white/30">Expires in {action.expiresIn}</span>}
                        {action.reversible && <span className="text-[10px] text-emerald-400/60">Reversible</span>}
                      </div>
                      <button
                        onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                        className="text-sm font-medium text-white hover:text-amber-300 transition-colors text-left"
                      >
                        {action.title}
                      </button>
                      <p className="text-xs text-white/50 mt-1">{action.description}</p>
                    </div>

                    {/* Confidence ring (small) */}
                    <div className="shrink-0 relative" aria-label={`Confidence: ${Math.round(action.confidence * 100)}%`}>
                      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <circle
                          cx="20" cy="20" r="16" fill="none" stroke="#EAB308" strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${action.confidence * 2 * Math.PI * 16} ${2 * Math.PI * 16}`}
                          transform="rotate(-90 20 20)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-amber-400">{Math.round(action.confidence * 100)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded evidence */}
                  {expandedAction === action.id && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-3">
                      {/* SHAP factors */}
                      <div className="space-y-2">
                        {action.factors.map((f) => (
                          <div key={f.label} className="flex items-center gap-2">
                            <span className="text-xs text-white/50 w-36 shrink-0">{f.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-amber-500/60" style={{ width: `${f.value * 100}%` }} />
                            </div>
                            <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Impact preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3">
                          <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">If approved</p>
                          <p className="text-xs text-white/70">{action.impact.approved}</p>
                        </div>
                        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                          <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">If declined</p>
                          <p className="text-xs text-white/70">{action.impact.declined}</p>
                        </div>
                      </div>

                      <p className="text-xs text-white/30">Confidence {action.confidence} · {action.factors.length} factors · {action.reversible ? 'Reversible' : 'Irreversible'} · Execute engine</p>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          className="px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                          style={{ background: '#EAB308', color: '#0B1221' }}
                          onClick={() => setConfirmAction({ id: action.id, type: 'approve' })}
                        >
                          Approve
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors"
                          onClick={() => setConfirmAction({ id: action.id, type: 'decline' })}
                        >Decline</button>
                        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 transition-colors">Defer</button>
                        <Link to="/dashboard" className="px-4 py-2 rounded-lg text-white/30 text-xs hover:text-white/50 transition-colors">More info</Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {visibleActions.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16">
                <CheckCircle2 className="w-12 h-12 opacity-30" style={{ color: '#22C55E' }} />
                <p className="text-sm text-white/50">All actions reviewed. Queue is clear.</p>
                <p className="text-xs text-white/30">3 actions approved today.</p>
              </div>
            )}
            <p className="text-xs text-white/30">Consent-first: no action executes without explicit approval · {visibleActions.length} pending · 3 approved today</p>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Approval queue sidebar">
            {/* Queue health ring */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col items-center">
              <div className="relative" aria-label="Queue health: 85">
                <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="32" fill="none" stroke="#EAB308" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${0.85 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">85</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">Queue health</p>
              <p className="text-[10px] text-white/30">Composite urgency score</p>
            </div>

            {/* Approval activity */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Approval Activity</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: '3 approved today', date: '08:00', done: true },
                  { label: '5 pending review', date: 'Now', done: false, current: true },
                  { label: '1 deferred', date: 'Later', done: false },
                ].map((m) => (
                  <div key={m.label} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${m.done ? 'bg-emerald-400' : m.current ? 'bg-amber-400 animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <p className="text-xs text-white/70">{m.label}</p>
                      <p className="text-[10px] text-white/30">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue summary */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Queue Summary</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Pending', value: '5', color: 'text-amber-400' },
                  { label: 'Approved today', value: '3', color: 'text-emerald-400' },
                  { label: 'Deferred', value: '1', color: 'text-blue-400' },
                  { label: 'Avg confidence', value: '0.88', color: 'text-white/70' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Completed</h3>
              <p className="text-xs text-white/30">3 actions completed today. Expand to review.</p>
              <button className="text-xs mt-2 hover:underline" style={{ color: '#EAB308' }}>Show completed</button>
            </div>
          </aside>
        </div>

        <GovernFooter />
      </motion.div>

      {/* Confirm / Decline Dialog */}
      {confirmAction && (() => {
        const action = queueActions.find((a) => a.id === confirmAction.id)!;
        const isApprove = confirmAction.type === 'approve';
        return (
          <Dialog open={true} onOpenChange={(open) => !open && setConfirmAction(null)}>
            <DialogContent
              className="max-w-md"
              style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="flex flex-col gap-4 p-2">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: isApprove ? '#EAB308' : '#EF4444' }}
                  >
                    {isApprove ? 'Confirm Approval' : 'Confirm Decline'}
                  </p>
                  <h3 className="text-base font-semibold text-white">{action.title}</h3>
                  <p className="text-xs text-white/50 mt-1">{action.description}</p>
                </div>

                {/* Impact preview */}
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: isApprove ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
                    border: `1px solid ${isApprove ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}
                >
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: isApprove ? '#22C55E' : '#EF4444' }}>
                    {isApprove ? 'Expected outcome' : 'If declined'}
                  </p>
                  <p className="text-xs text-white/70">
                    {isApprove ? action.impact.approved : action.impact.declined}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: isApprove ? '#EAB308' : '#EF4444',
                      color: isApprove ? '#0B1221' : '#ffffff',
                    }}
                    onClick={handleConfirm}
                  >
                    {isApprove ? 'Approve' : 'Decline'}
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
                    onClick={() => setConfirmAction(null)}
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-[10px] text-white/25 text-center">
                  Confidence {action.confidence} · {action.reversible ? 'Reversible' : 'Irreversible'}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}

export default ExecuteApproval;
