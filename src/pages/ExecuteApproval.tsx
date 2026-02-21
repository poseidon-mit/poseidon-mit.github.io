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
  impact: { approved: string; deferred: string; };
  reversible: boolean;
  expiresIn: string | null;
  factors: Array<{ label: string; value: number; }>;
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
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'approve' | 'defer'; } | null>(null);
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

        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1440px' }}>
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
        className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full pt-8 lg:pt-12"
        style={{ maxWidth: '1440px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main">

        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)] text-xs font-bold tracking-widest uppercase self-start shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--engine-execute)]/20"><Zap size={12} /></span>
            Execute · Approval Queue
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Approval <span className="text-[var(--engine-execute)] drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">Queue</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide mb-2">
              Consent-first: no action executes without your approval · 2 actions expire within 24 hours
            </p>
          </div>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant} className="px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'Pending', value: String(visibleActions.length), color: 'var(--engine-execute)' },
              { label: 'Approved (24h)', value: String(approvedCount), color: 'var(--engine-protect)' },
              { label: 'Deferred', value: String(deferredCount), color: 'var(--engine-govern)' },
              { label: 'Avg confidence', value: avgConfidence.toFixed(2), color: 'var(--engine-dashboard)' }].
              map((kpi) => <Surface
                key={kpi.label} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 border border-white/[0.08]" as={motion.div}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <p className="relative z-10 text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">{kpi.label}</p>
                <p className="relative z-10 text-3xl font-light font-mono" style={{ color: kpi.color, textShadow: `0 0 10px ${kpi.color}60` }}>{kpi.value}</p>
              </Surface>
              )}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8">
          {/* Main feed */}
          <motion.div variants={fadeUpVariant} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-6">
            {/* Consent scope card — must be reviewed before approving */}
            <Surface
              data-surface-role="glass"
              onClick={() => setConsentReviewed(true)}
              className="relative overflow-hidden rounded-[32px] border border-[var(--engine-execute)]/30 backdrop-blur-3xl bg-[var(--engine-execute)]/5 p-6 lg:p-8 cursor-pointer hover:bg-[var(--engine-execute)]/10 transition-colors shadow-[0_0_30px_rgba(251,191,36,0.1)]"
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && setConsentReviewed(true)}
              aria-label="Review consent scope">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--engine-execute)' }}>Consent scope</p>
                  <p className="text-base text-white/70 tracking-wide font-light">Click to review the data access scope for these actions.</p>
                </div>
                {consentReviewed ?
                  <span className="text-xs font-semibold text-[var(--state-healthy)] shrink-0 px-3 py-1.5 rounded-full border border-[var(--state-healthy)]/20 bg-[var(--state-healthy)]/10">Reviewed</span> :
                  <span className="text-xs text-white/30 shrink-0 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 uppercase tracking-widest font-semibold flex items-center gap-2">Tap to review <Zap size={14} className="text-amber-500/50" /></span>
                }
              </div>
            </Surface>

            {/* Primary approve action */}
            <Button
              disabled={!consentReviewed}
              onClick={() => {
                if (!consentReviewed) return;
                const firstPending = visibleActions[0];
                if (firstPending) setConfirmAction({ id: firstPending.id, type: 'approve' });
              }}
              variant="primary"
              engine="execute"
              className="rounded-2xl text-base px-6 py-4 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] text-black border-none font-semibold w-full">

              {consentReviewed ? 'Approve & execute first' : 'Review consent scope to proceed'}
            </Button>

            {/* Urgency banner */}
            <Surface className="relative overflow-hidden rounded-[24px] border border-[var(--state-critical)]/30 backdrop-blur-2xl bg-[var(--state-critical)]/5 p-5" style={{ borderLeftWidth: 4, borderLeftColor: 'var(--state-critical)' }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[var(--state-critical)] shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <p className="text-sm text-white font-light tracking-wide">
                  <span className="text-[var(--state-critical)] font-medium mr-1">2 actions expire within 24 hours.</span>
                  Review them before the window closes.
                </p>
              </div>
            </Surface>

            {/* Action queue */}
            <div className="flex flex-col gap-6 mt-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 px-2 -mb-2">Pending ({visibleActions.length})</h2>
              {visibleActions.map((action) => <Surface

                key={action.id} className="relative overflow-hidden rounded-[32px] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-3xl bg-black/60 shadow-2xl transition-all"

                style={{ borderLeftWidth: 4, borderLeftColor: urgencyBorderColor[action.urgency] }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-white/[0.05] ${engineBadgeCls[action.engine]}`}>{action.engine}</span>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-white/[0.05] ${urgencyBadgeCls[action.urgency]}`}>{action.urgency}</span>
                        {action.expiresIn && <span className="text-[10px] text-white/40 tracking-widest uppercase font-semibold ml-2">Expires in <span className="text-amber-500 px-1">{action.expiresIn}</span></span>}
                        {action.reversible && <span className="text-[10px] text-[var(--state-healthy)] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] font-semibold tracking-widest uppercase ml-auto border border-[var(--state-healthy)]/20 px-3 py-1 bg-[var(--state-healthy)]/10 rounded-full">Reversible</span>}
                      </div>

                      <Button
                        onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                        variant="ghost"
                        engine="execute"
                        className="text-xl md:text-3xl font-light text-white hover:text-[var(--engine-execute)] transition-colors text-left !px-0 !h-auto !min-h-0 block w-full tracking-wide">

                        {action.title}
                      </Button>
                      <p className="text-[15px] text-white/50 leading-relaxed mt-2 tracking-wide font-light">{action.description}</p>
                    </div>

                    {/* Confidence ring (small) */}
                    <div className="shrink-0 relative hidden sm:flex items-center justify-center translate-y-2 pr-2" aria-label={`Confidence: ${Math.round(action.confidence * 100)}%`}>
                      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <circle
                          cx="32" cy="32" r="28" fill="none" stroke="var(--engine-execute)" strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${action.confidence * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                          transform="rotate(-90 32 32)" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-mono font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{Math.round(action.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded evidence */}
                  {expandedAction === action.id &&
                    <div className="mt-4 pt-6 border-t border-white/[0.06] flex flex-col gap-6">
                      {/* Expected outcome */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--engine-execute)' }}><Zap size={10} />Expected outcome</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-[24px] bg-emerald-500/5 border border-emerald-500/20 p-5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">If approved</p>
                            <p className="text-sm text-white/70 font-light tracking-wide leading-relaxed">{action.impact.approved}</p>
                          </div>
                          <div className="rounded-[24px] bg-amber-500/5 border border-amber-500/20 p-5 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">If deferred</p>
                            <p className="text-sm text-white/70 font-light tracking-wide leading-relaxed">{action.impact.deferred}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/[0.06] pt-6">
                        {/* Action evidence */}
                        <div className="order-2 md:order-1">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4 flex items-center gap-2 text-white/50">Action evidence</p>
                          <div className="space-y-4">
                            {action.factors.map((f) =>
                              <div key={f.label} className="flex items-center gap-4">
                                <span className="text-xs font-medium tracking-wide text-white/70 w-36 shrink-0">{f.label}</span>
                                <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/10 shadow-inner">
                                  <div className="h-full rounded-full shadow-[0_0_10px_currentColor] bg-amber-500/80" style={{ width: `${f.value * 100}%` }} />
                                </div>
                                <span className="text-xs font-mono text-white/70 w-10 text-right">{f.value.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* SHAP attribution waterfall */}
                        <div className="order-1 md:order-2 bg-black/20 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--engine-protect)' }}>SHAP attribution</p>
                          <ShapWaterfall
                            factors={action.factors.map((f) => ({ name: f.label, value: f.value }))}
                            baseValue={50}
                            className="mt-1" />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-white/[0.06]">
                        <div className="flex gap-3">
                          <Button
                            variant="glass"
                            engine="execute"
                            className="rounded-2xl text-sm px-8 py-3 bg-[var(--engine-execute)]/10 border border-[var(--engine-execute)]/30 hover:bg-[var(--engine-execute)] hover:text-black transition-colors"
                            onClick={() => setConfirmAction({ id: action.id, type: 'approve' })}>

                            Approve
                          </Button>
                          <Button
                            variant="glass"
                            engine="execute"
                            className="rounded-2xl text-sm px-8 py-3 border border-white/10 hover:bg-white/10 transition-colors"
                            onClick={() => setConfirmAction({ id: action.id, type: 'defer' })}>
                            Defer</Button>
                        </div>
                        <ButtonLink to="/dashboard" variant="ghost" engine="execute" className="rounded-2xl text-xs text-white/40 hover:text-white pb-0 pt-0">Review details</ButtonLink>
                      </div>
                    </div>
                  }
                </div>
              </Surface>
              )}
            </div>

            {visibleActions.length === 0 &&
              <Surface className="relative overflow-hidden rounded-[32px] p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col items-center justify-center gap-4 mt-4 text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
                <div className="w-20 h-20 rounded-full bg-[var(--engine-protect)]/10 flex items-center justify-center border border-[var(--engine-protect)]/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="w-10 h-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ color: 'var(--engine-protect)' }} />
                </div>
                <h3 className="text-2xl font-light text-white tracking-wide mt-2">All actions reviewed</h3>
                <p className="text-base font-light text-white/50 tracking-wide">The approval queue is clear. {approvedCount} actions were approved today.</p>
              </Surface>
            }
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6" aria-label="Approval queue sidebar">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Queue health ring */}
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col items-center gap-4 border border-white/[0.08]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10" aria-label={`Queue health: ${queueHealthScore}`}>
                  <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none" stroke="var(--engine-execute)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(queueHealthScore / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                      transform="rotate(-90 50 50)" />

                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <span className="text-3xl font-light font-mono text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{queueHealthScore}</span>
                  </div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <p className="text-sm font-semibold tracking-wide text-white/90 uppercase tracking-widest mt-2">Queue health</p>
                  <p className="text-xs font-light text-white/50">Composite urgency score</p>
                </div>
              </Surface>

              {/* Approval activity */}
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 border border-white/[0.08]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--engine-execute)]" />
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Approval Activity</h3>
                  </div>
                </div>
                <div className="relative z-10 space-y-4">
                  {[
                    { label: `${approvedCount} approved today`, date: 'Now', done: approvedCount > 0 },
                    { label: `${visibleActions.length} pending review`, date: 'Now', done: false, current: true },
                    { label: `${deferredCount} deferred`, date: 'Later', done: false }].
                    map((m) =>
                      <div key={m.label} className="flex items-start gap-4 p-2 -mx-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m.done ? 'bg-[var(--state-healthy)] drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]' : m.current ? 'bg-[var(--engine-execute)] animate-pulse drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'bg-white/20'}`} />
                        <div className="flex-1">
                          <p className={`text-sm tracking-wide ${m.current ? 'text-white font-medium' : 'text-white/60 font-light'}`}>{m.label}</p>
                          <p className="text-[10px] font-mono tracking-widest text-white/40 mt-1 uppercase">{m.date}</p>
                        </div>
                      </div>
                    )}
                </div>
              </Surface>

              {/* Completed */}
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4 border border-white/[0.08]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--state-healthy)]/10 to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest border-b border-white/[0.06] pb-4">Completed</h3>
                <p className="relative z-10 text-sm font-light text-white/70 tracking-wide leading-relaxed">{approvedCount} actions completed today. Review history for full traceability.</p>
                <div className="relative z-10 mt-2">
                  <ButtonLink to="/execute/history" variant="glass" engine="execute" className="w-full rounded-xl text-sm py-3 justify-center text-white/80 hover:bg-white/10 transition-colors">Open history</ButtonLink>
                </div>
              </Surface>
            </div>
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
