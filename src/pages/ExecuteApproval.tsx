import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, ShapWaterfall, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { usePageTitle } from '../hooks/use-page-title';
import { getMotionPreset } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, ButtonLink, Surface } from '@/design-system';
import { useDemoState } from '@/lib/demo-state/provider';
import { useToast } from '@/hooks/useToast';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

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
  impact: {approved: string;deferred: string;};
  reversible: boolean;
  expiresIn: string | null;
  factors: Array<{label: string;value: number;}>;
}

const queueActions: QueueAction[] = [
  {
    id: 'EXE-001',
    engine: 'Execute',
    title: 'Portfolio rebalance',
    description: 'Optimize allocation based on 90-day pattern.',
    urgency: 'high',
    confidence: 0.97,
    impact: {
      approved: 'Allocation adjusted and tracked in the govern audit trace.',
      deferred: 'Portfolio keeps current drift and review is deferred to next cycle.',
    },
    reversible: true,
    expiresIn: '14h',
    factors: [
      { label: 'Concentration risk', value: 0.91 },
      { label: 'Cash allocation', value: 0.87 },
      { label: 'Volatility outlook', value: 0.78 },
    ],
  },
  {
    id: 'EXE-002',
    engine: 'Protect',
    title: 'Block wire transfer',
    description: `Suspicious transaction to ${DEMO_THREAD.criticalAlert.merchant}.`,
    urgency: 'high',
    confidence: DEMO_THREAD.criticalAlert.confidence,
    impact: {
      approved: 'Wire transfer is blocked and dispute workflow opens automatically.',
      deferred: 'Transaction remains active and fraud exposure window extends.',
    },
    reversible: true,
    expiresIn: '6h',
    factors: [
      { label: 'Merchant risk', value: 0.87 },
      { label: 'Amount anomaly', value: 0.71 },
      { label: 'Geo mismatch', value: 0.65 },
    ],
  },
  {
    id: 'EXE-003',
    engine: 'Grow',
    title: 'Subscription consolidation',
    description: '3 overlapping subscriptions detected.',
    urgency: 'medium',
    confidence: 0.89,
    impact: {
      approved: 'Estimated savings of $140/mo are queued for execution.',
      deferred: 'Current subscription stack remains unchanged.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'Cost reduction', value: 0.92 },
      { label: 'Overlap confidence', value: 0.88 },
      { label: 'Usage parity', value: 0.82 },
    ],
  },
  {
    id: 'EXE-004',
    engine: 'Execute',
    title: 'Archive invoices',
    description: 'Batch archive of 47 paid invoices.',
    urgency: 'medium',
    confidence: 0.78,
    impact: {
      approved: 'Legacy invoices are archived and indexed for governance audit.',
      deferred: 'Invoice archive remains unchanged and queue re-checks in 24h.',
    },
    reversible: false,
    expiresIn: '3d',
    factors: [
      { label: 'Document age', value: 0.84 },
      { label: 'Archive confidence', value: 0.77 },
      { label: 'Policy fit', value: 0.73 },
    ],
  },
  {
    id: 'EXE-005',
    engine: 'Execute',
    title: 'Pay electricity bill',
    description: 'Recurring auto-payment scheduled today.',
    urgency: 'low',
    confidence: 0.99,
    impact: {
      approved: 'Payment executes and receipt is logged in the audit ledger.',
      deferred: 'Payment is deferred and reminder is raised to the queue.',
    },
    reversible: true,
    expiresIn: '18h',
    factors: [
      { label: 'Payment confidence', value: 0.99 },
      { label: 'Schedule consistency', value: 0.93 },
      { label: 'Balance sufficiency', value: 0.95 },
    ],
  },
];


const urgencyBorderColor = { high: 'var(--state-critical)', medium: 'var(--engine-execute)', low: 'var(--engine-govern)' };
const urgencyBadgeCls = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-blue-500/20 text-blue-400' };
const engineBadgeCls = { Protect: 'bg-emerald-500/20 text-emerald-400', Grow: 'bg-violet-500/20 text-violet-400', Execute: 'bg-amber-500/20 text-amber-400' };


/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function ExecuteApproval() {
  usePageTitle('Action Approval');
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: stagger } = getMotionPreset(prefersReducedMotion);
  const { state, setExecuteDecision } = useDemoState();
  const { showToast } = useToast();
  const [expandedAction, setExpandedAction] = useState<string | null>(queueActions[0].id);
  const [confirmAction, setConfirmAction] = useState<{id: string;type: 'approve' | 'defer';} | null>(null);
  const [consentReviewed, setConsentReviewed] = useState(false);

  const handleConfirm = () => {
    if (confirmAction) {
      const action = queueActions.find((a) => a.id === confirmAction.id);
      if (action) {
        const decision = confirmAction.type === 'approve' ? 'approved' : 'deferred';
        setExecuteDecision({
          actionId: action.id,
          actionTitle: action.title,
          decision,
        });
        showToast({
          variant: decision === 'approved' ? 'success' : 'info',
          message: decision === 'approved'
            ? `${action.id} approved and logged.`
            : `${action.id} deferred and queued for review.`,
        });
      }
      setExpandedAction(null);
      setConfirmAction(null);
    }
  };

  const actionStatus = (id: string) => state.execute.actionStates[id]?.status ?? 'pending';
  const visibleActions = queueActions.filter((a) => actionStatus(a.id) === 'pending');
  const approvedCount = queueActions.filter((a) => actionStatus(a.id) === 'approved').length;
  const deferredCount = queueActions.filter((a) => actionStatus(a.id) === 'deferred').length;
  const avgConfidence = useMemo(
    () => (visibleActions.length > 0 ? visibleActions.reduce((sum, action) => sum + action.confidence, 0) / visibleActions.length : 0),
    [visibleActions],
  );
  const queueHealthScore = Math.round(avgConfidence * 100);

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-execute)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-execute)', color: 'var(--bg-oled)' }}>
        
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"

        aria-label="Breadcrumb">
        
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/execute"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-execute)' }}>
            
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
        role="main">
        
        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5" style={{ color: 'var(--engine-execute)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-execute)' }}>
              Execute · Approval Queue
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Approval Queue</h1>
          <p className="text-sm text-slate-400">
            Consent-first: no action executes without your approval · 2 actions expire within 24 hours
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Pending', value: String(visibleActions.length), color: 'var(--engine-execute)' },
            { label: 'Approved (24h)', value: String(approvedCount), color: 'var(--engine-protect)' },
            { label: 'Deferred', value: String(deferredCount), color: 'var(--engine-govern)' },
            { label: 'Avg confidence', value: avgConfidence.toFixed(2), color: 'var(--engine-dashboard)' }].
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
            {/* Consent scope card — must be reviewed before approving */}
            <div
              data-slot="consent_scope"
              onClick={() => setConsentReviewed(true)}
              className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 cursor-pointer hover:bg-amber-500/10 transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setConsentReviewed(true)}
              aria-label="Review consent scope">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--engine-execute)' }}>Consent scope</p>
                  <p className="text-sm text-white/70">Click to review the data access scope for these actions.</p>
                </div>
                {consentReviewed ?
                <span className="text-xs font-semibold text-emerald-400 shrink-0">Reviewed</span> :

                <span className="text-xs text-white/30 shrink-0">Tap to review</span>
                }
              </div>
            </div>

            {/* Primary approve action */}
            <Button
              disabled={!consentReviewed}
              onClick={() => {
                if (!consentReviewed) return;
                const firstPending = visibleActions[0];
                if (firstPending) setConfirmAction({ id: firstPending.id, type: 'approve' });
              }}
              variant="glass"
              engine="execute"
              fullWidth
              className="rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              
              {consentReviewed ? 'Approve & execute' : 'Review consent scope first'}
            </Button>

            {/* Urgency banner */}
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4" style={{ borderLeftWidth: 2, borderLeftColor: 'var(--state-critical)' }}>
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
              {visibleActions.map((action) => <Surface

                key={action.id} className="rounded-2xl"

                style={{ borderLeftWidth: 3, borderLeftColor: urgencyBorderColor[action.urgency] }} variant="glass" padding="md">
                
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${engineBadgeCls[action.engine]}`}>{action.engine}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${urgencyBadgeCls[action.urgency]}`}>{action.urgency}</span>
                        {action.expiresIn && <span className="text-[10px] text-white/30">Expires in {action.expiresIn}</span>}
                        {action.reversible && <span className="text-[10px] text-emerald-400/60">Reversible</span>}
                      </div>
                      <Button
                      onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                      variant="ghost"
                      engine="execute"
                      className="text-sm font-medium text-white hover:text-amber-300 transition-colors text-left !px-0 !h-auto !min-h-0">
                      
                        {action.title}
                      </Button>
                      <p className="text-xs text-white/50 mt-1">{action.description}</p>
                    </div>

                    {/* Confidence ring (small) */}
                    <div className="shrink-0 relative" aria-label={`Confidence: ${Math.round(action.confidence * 100)}%`}>
                      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <circle
                        cx="20" cy="20" r="16" fill="none" stroke="var(--engine-execute)" strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${action.confidence * 2 * Math.PI * 16} ${2 * Math.PI * 16}`}
                        transform="rotate(-90 20 20)" />
                      
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-amber-400">{Math.round(action.confidence * 100)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded evidence */}
                  {expandedAction === action.id &&
                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-3">
                      {/* Action evidence */}
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--engine-execute)' }}>Action evidence</p>
                      <div className="space-y-2">
                        {action.factors.map((f) =>
                    <div key={f.label} className="flex items-center gap-2">
                            <span className="text-xs text-white/50 w-36 shrink-0">{f.label}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-amber-500/60" style={{ width: `${f.value * 100}%` }} />
                            </div>
                            <span className="text-xs text-white/40 w-8 text-right">{f.value.toFixed(2)}</span>
                          </div>
                    )}
                      </div>

                      {/* SHAP attribution waterfall */}
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--engine-execute)' }}>SHAP attribution</p>
                      <ShapWaterfall
                    factors={action.factors.map((f) => ({ name: f.label, value: f.value }))}
                    baseValue={50}
                    className="mt-1" />
                  

                      {/* Expected outcome */}
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--engine-execute)' }}>Expected outcome</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3">
                          <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">If approved</p>
                          <p className="text-xs text-white/70">{action.impact.approved}</p>
                        </div>
                        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                          <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">If deferred</p>
                          <p className="text-xs text-white/70">{action.impact.deferred}</p>
                        </div>
                      </div>

                      <p className="text-xs text-white/30">Confidence {action.confidence} · {action.factors.length} factors · {action.reversible ? 'Reversible' : 'Irreversible'} · Execute engine</p>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <Button
                      variant="glass"
                      engine="execute"
                      size="sm"
                      className="rounded-lg text-xs"
                      onClick={() => setConfirmAction({ id: action.id, type: 'approve' })}>
                      
                          Approve
                        </Button>
                        <Button
                      variant="secondary"
                      engine="execute"
                      size="sm"
                      className="rounded-lg text-xs"
                      onClick={() => setConfirmAction({ id: action.id, type: 'defer' })}>
                      Defer</Button>
                        <ButtonLink to="/dashboard" variant="ghost" engine="execute" size="sm" className="rounded-lg text-xs text-white/30 hover:text-white/50">More info</ButtonLink>
                      </div>
                    </div>
                }
                </Surface>
              )}
            </div>

            {visibleActions.length === 0 &&
            <div className="flex flex-col items-center gap-3 py-16">
                <CheckCircle2 className="w-12 h-12 opacity-30" style={{ color: 'var(--engine-protect)' }} />
                <p className="text-sm text-white/50">All actions reviewed. Queue is clear.</p>
                <p className="text-xs text-white/30">{approvedCount} actions approved today.</p>
              </div>
            }
            <p className="text-xs text-white/30">Consent-first: no action executes without explicit approval · {visibleActions.length} pending · {approvedCount} approved</p>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Approval queue sidebar">
            {/* Queue health ring */}
            <Surface className="rounded-2xl flex flex-col items-center" variant="glass" padding="md">
              <div className="relative" aria-label={`Queue health: ${queueHealthScore}`}>
                <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="32" fill="none" stroke="var(--engine-execute)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(queueHealthScore / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                    transform="rotate(-90 40 40)" />
                  
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">{queueHealthScore}</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">Queue health</p>
              <p className="text-[10px] text-white/30">Composite urgency score</p>
            </Surface>

            {/* Approval activity */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Approval Activity</h3>
              </div>
              <div className="space-y-3">
                {[
                { label: `${approvedCount} approved today`, date: 'Now', done: approvedCount > 0 },
                { label: `${visibleActions.length} pending review`, date: 'Now', done: false, current: true },
                { label: `${deferredCount} deferred`, date: 'Later', done: false }].
                map((m) =>
                <div key={m.label} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${m.done ? 'bg-emerald-400' : m.current ? 'bg-amber-400 animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <p className="text-xs text-white/70">{m.label}</p>
                      <p className="text-[10px] text-white/30">{m.date}</p>
                    </div>
                  </div>
                )}
              </div>
            </Surface>

            {/* Queue summary */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Queue Summary</h3>
              <div className="space-y-2.5">
                {[
                { label: 'Pending', value: String(visibleActions.length), color: 'text-amber-400' },
                { label: 'Approved today', value: String(approvedCount), color: 'text-emerald-400' },
                { label: 'Deferred', value: String(deferredCount), color: 'text-blue-400' },
                { label: 'Avg confidence', value: avgConfidence.toFixed(2), color: 'text-white/70' }].
                map((row) =>
                <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                  </div>
                )}
              </div>
            </Surface>

            {/* Completed */}
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Completed</h3>
              <p className="text-xs text-white/30">{approvedCount} actions completed today. Review history for full trace.</p>
              <ButtonLink to="/execute/history" variant="ghost" engine="execute" size="sm" className="text-xs mt-2 !px-0 hover:underline">Open history</ButtonLink>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/execute/approval'].auditId} pageContext={GOVERNANCE_META['/execute/approval'].pageContext} />
      </motion.div>

      {/* Confirm Dialog */}
      {confirmAction && (() => {
        const action = queueActions.find((a) => a.id === confirmAction.id)!;
        const isApprove = confirmAction.type === 'approve';
        return (
          <Dialog open={true} onOpenChange={(open) => !open && setConfirmAction(null)}>
            <DialogContent
              className="max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="execute-approval-confirm-title"
              style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)' }}>
              
              <div className="flex flex-col gap-4 p-2">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: isApprove ? 'var(--engine-execute)' : 'var(--state-warning)' }}>
                    
                    {isApprove ? 'Confirm Approval' : 'Confirm Deferral'}
                  </p>
                  <h3 id="execute-approval-confirm-title" className="text-base font-semibold text-white">{action.title}</h3>
                  <p className="text-xs text-white/50 mt-1">{action.description}</p>
                </div>

                {/* Impact preview */}
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: isApprove ? 'rgba(34,197,94,0.05)' : 'rgba(251,191,36,0.08)',
                    border: `1px solid ${isApprove ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.22)'}`
                  }}>
                  
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: isApprove ? 'var(--engine-protect)' : 'var(--engine-execute)' }}>
                    {isApprove ? 'Expected outcome' : 'If deferred'}
                  </p>
                  <p className="text-xs text-white/70">
                    {isApprove ? action.impact.approved : action.impact.deferred}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant={isApprove ? 'glass' : 'secondary'}
                    engine="execute"
                    fullWidth
                    className="rounded-xl text-sm"
                    onClick={handleConfirm}>
                    
                    {isApprove ? 'Approve' : 'Defer'}
                  </Button>
                  <Button
                    variant="secondary"
                    engine="execute"
                    fullWidth
                    className="rounded-xl text-sm"
                    onClick={() => setConfirmAction(null)}>
                    
                    Cancel
                  </Button>
                </div>

                <p className="text-[10px] text-white/25 text-center">
                  Confidence {action.confidence} · {action.reversible ? 'Reversible' : 'Irreversible'}
                </p>
              </div>
            </DialogContent>
          </Dialog>);

      })()}
    </div>);

}

export default ExecuteApproval;
