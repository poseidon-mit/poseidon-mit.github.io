import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link, useRouter } from '../router';
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
import { QUEUE_ACTIONS, type QueueAction } from './Execute';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

// Removed hardcoded queueActions in favor of the imported QUEUE_ACTIONS from Execute.tsx


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
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'approve' | 'defer'; } | null>(null);
  const [consentReviewed, setConsentReviewed] = useState(false);
  const { search } = useRouter();

  const actionIdParam = useMemo(() => new URLSearchParams(search).get('actionId'), [search]);

  useEffect(() => {
    if (actionIdParam) {
      setExpandedAction(actionIdParam);
    } else {
      setExpandedAction(QUEUE_ACTIONS[0]?.id || null);
    }
  }, [actionIdParam]);

  const handleConfirm = () => {
    if (confirmAction) {
      const action = QUEUE_ACTIONS.find((a) => a.id === confirmAction.id);
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
  const visibleActions = QUEUE_ACTIONS.filter((a) => actionStatus(a.id) === 'pending' && (!actionIdParam || a.id === actionIdParam));
  const approvedCount = QUEUE_ACTIONS.filter((a) => actionStatus(a.id) === 'approved').length;
  const deferredCount = QUEUE_ACTIONS.filter((a) => actionStatus(a.id) === 'deferred').length;
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
          <span className="text-sm text-white/50">Action Review</span>
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
            Execute · Action Approval
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Action <span className="text-[var(--engine-execute)] drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">Review</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide mb-2">
              Consent-first transparent AI execution: verify expected outcomes and mathematical confidence before proceeding.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8 px-4 md:px-6 lg:px-8">
          {visibleActions.length > 0 ? (
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-8 lg:w-3/4 max-w-4xl">
              {visibleActions.map((action) => (
                <Surface
                  key={action.id}
                  className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl"
                  style={{ borderLeftWidth: 4, borderLeftColor: urgencyBorderColor[action.urgency as 'high' | 'medium' | 'low'] || urgencyBorderColor.medium }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10 p-6 lg:p-10 flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-6 w-full">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-white/[0.05] ${engineBadgeCls[action.engine]}`}>{action.engine}</span>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-white/[0.05] ${urgencyBadgeCls[action.urgency]}`}>{action.urgency}</span>
                          {action.expiresIn && <span className="text-[10px] text-white/40 tracking-widest uppercase font-semibold ml-2">Expires in <span className="text-amber-500 px-1">{action.expiresIn}</span></span>}
                          {action.reversible && <span className="text-[10px] text-[var(--state-healthy)] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] font-semibold tracking-widest uppercase ml-auto border border-[var(--state-healthy)]/20 px-3 py-1 bg-[var(--state-healthy)]/10 rounded-full">Reversible</span>}
                        </div>

                        <h2 className="text-2xl md:text-4xl font-light text-white tracking-wide">
                          {action.title}
                        </h2>
                        <p className="text-base text-white/60 leading-relaxed mt-4 tracking-wide font-light">{action.description}</p>
                      </div>

                      <div className="shrink-0 relative hidden sm:flex items-center justify-center translate-y-2 pr-2">
                        <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                          <circle
                            cx="40" cy="40" r="36" fill="none" stroke="var(--engine-execute)" strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${action.confidence * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
                            transform="rotate(-90 40 40)" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-mono font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{Math.round(action.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.06] flex flex-col gap-8">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--engine-execute)' }}><Zap size={14} />Expected outcome</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="rounded-[24px] bg-emerald-500/5 border border-emerald-500/20 p-6 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                            <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-3">If approved</p>
                            <p className="text-base text-white/80 font-light tracking-wide leading-relaxed">{action.impact.approved}</p>
                          </div>
                          <div className="rounded-[24px] bg-amber-500/5 border border-amber-500/20 p-6 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                            <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-3">If deferred / cancelled</p>
                            <p className="text-base text-white/80 font-light tracking-wide leading-relaxed">{action.impact.deferred}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-t border-white/[0.06] pt-8">
                        <div className="order-2 md:order-1">
                          <p className="text-xs font-semibold uppercase tracking-widest mb-5 flex items-center gap-2 text-white/50">Mathematical Reasoning</p>
                          <div className="space-y-5">
                            {action.factors.map((f: any) =>
                              <div key={f.label} className="flex items-center gap-4">
                                <span className="text-sm font-medium tracking-wide text-white/80 w-40 shrink-0">{f.label}</span>
                                <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/10 shadow-inner">
                                  <div className="h-full rounded-full shadow-[0_0_10px_currentColor] bg-amber-500/80" style={{ width: `${f.value * 100}%` }} />
                                </div>
                                <span className="text-sm font-mono text-white/70 w-12 text-right">{f.value.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="order-1 md:order-2 bg-black/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--engine-protect)' }}>Decision Drivers</p>
                          <ShapWaterfall
                            factors={action.factors.map((f: any) => ({ name: f.label, value: f.value }))}
                            baseValue={50}
                            className="mt-2" />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-4 mt-8 pt-8 border-t border-white/[0.06]">
                        <Button
                          variant="glass"
                          engine="execute"
                          className="rounded-2xl text-base px-10 py-4 bg-[var(--engine-execute)]/10 border border-[var(--engine-execute)]/30 hover:bg-[var(--engine-execute)] hover:text-black transition-colors"
                          onClick={() => setConfirmAction({ id: action.id, type: 'approve' })}>
                          Approve Action
                        </Button>
                        <Button
                          variant="glass"
                          engine="execute"
                          className="rounded-2xl text-base px-10 py-4 border border-white/10 hover:bg-white/10 transition-colors"
                          onClick={() => setConfirmAction({ id: action.id, type: 'defer' })}>
                          Cancel / Defer
                        </Button>
                      </div>
                    </div>
                  </div>
                </Surface>
              ))}
            </motion.div>
          ) : (
            <Surface className="relative overflow-hidden rounded-[32px] p-16 lg:w-3/4 max-w-4xl border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col items-center justify-center gap-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
              <div className="w-24 h-24 rounded-full bg-[var(--engine-protect)]/10 flex items-center justify-center border border-[var(--engine-protect)]/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-12 h-12 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ color: 'var(--engine-protect)' }} />
              </div>
              <div>
                <h3 className="text-3xl font-light text-white tracking-wide mb-3">Action Complete</h3>
                <p className="text-lg font-light text-white/50 tracking-wide">The requested action has been processed and logged.</p>
              </div>
              <ButtonLink to="/dashboard" variant="glass" engine="execute" className="mt-4 rounded-xl px-8 py-3 bg-[var(--engine-protect)]/10 text-[var(--engine-protect)] border-[var(--engine-protect)]/30 hover:bg-[var(--engine-protect)]/20 transition-colors">
                Return to Command Center
              </ButtonLink>
            </Surface>
          )}
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/execute/approval'].auditId} pageContext={GOVERNANCE_META['/execute/approval'].pageContext} />
      </motion.div>

      {/* Confirm Dialog */}
      {confirmAction && (() => {
        const action = QUEUE_ACTIONS.find((a) => a.id === confirmAction.id)!;
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
