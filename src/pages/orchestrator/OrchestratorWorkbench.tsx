/**
 * Orchestrator Workbench v2.0 — Root Page Component
 * Assembles all orchestrator subsystems into the unified workbench UI.
 *
 * Integration points:
 * - WorkbenchProvider → AuditProvider → ApprovalProvider (nested contexts)
 * - useOrchestratorLifecycle: OPFS persistence, auto-purge, audit auto-recording
 * - Friction flow: intent → risk check → passkey → preview → approval → undo
 * - Semantic Audit Trail: 3-layer view with chain verification
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'

// ─── Contexts ─────────────────────────────────────────────────────────────────
import { WorkbenchProvider, useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { AuditProvider, useAuditContext } from '@/contexts/AuditContext'
import { ApprovalProvider, useApprovalContext } from '@/contexts/ApprovalContext'

// ─── Orchestrator Components ─────────────────────────────────────────────────
import { SecurityStateBar } from '@/components/orchestrator/proof/SecurityStateBar'
import { CommandPalette } from '@/components/orchestrator/command-palette/CommandPalette'
import { BentoGrid } from '@/components/orchestrator/bento/BentoGrid'
import { StatusBar } from '@/components/orchestrator/StatusBar'
import { GovernModeToggle } from '@/components/orchestrator/govern/GovernModeToggle'
import { IntentPreviewModal } from '@/components/orchestrator/friction/IntentPreviewModal'
import { UndoToast } from '@/components/orchestrator/friction/UndoToast'
import { PasskeyAuth } from '@/components/orchestrator/friction/PasskeyAuth'
import { SemanticAuditTrail } from '@/components/orchestrator/audit/SemanticAuditTrail'
import { ApprovalTracker } from '@/components/orchestrator/approval/ApprovalTracker'

// ─── Hooks ──────────────────────────────────────────────────────────────────
import { useOrchestratorLifecycle } from '@/hooks/useOrchestratorLifecycle'
import { useFriction } from '@/hooks/useFriction'
import { usePasskey } from '@/hooks/usePasskey'

// ─── Poseidon Facades ────────────────────────────────────────────────────────
import { GovernFooter, AuroraPulse } from '@/components/poseidon'

// ─── Types & Utils ──────────────────────────────────────────────────────────
import type { IntentResult } from '@/lib/orchestrator/types'
import { getFrictionPolicy } from '@/lib/orchestrator/friction-matrix'

// ─── Internal Workbench Layout ───────────────────────────────────────────────

function WorkbenchInner() {
  const { state, dispatch } = useWorkbenchContext()
  const { record: recordAudit } = useAuditContext()
  const { activeFlow, progress: approvalProgress } = useApprovalContext()
  const { evaluateFriction } = useFriction()
  const { status: passkeyStatus, authenticate: authenticatePasskey } = usePasskey()

  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false)
  const [previewIntent, setPreviewIntent] = useState<IntentResult | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showPasskeyAuth, setShowPasskeyAuth] = useState(false)
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [pendingPasskeyIntent, setPendingPasskeyIntent] = useState<IntentResult | null>(null)

  const isGovern = state.themeMode.mode === 'govern'
  const engineColor = isGovern ? 'var(--engine-govern)' : 'var(--engine-dashboard)'

  // ─── Lifecycle: OPFS persistence + auto-purge ───────────────────────────
  useOrchestratorLifecycle({
    persistEnabled: state.localFirstStatus.opfsAvailable,
    autoPurge: true,
  })

  // ─── Cmd+K Global Shortcut ─────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdPaletteOpen((prev) => !prev)
      }
      // Cmd+Shift+A — toggle audit trail
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'a') {
        e.preventDefault()
        setShowAuditTrail((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ─── When intent resolves, evaluate friction ──────────────────────────
  useEffect(() => {
    if (!state.currentIntent) return

    const friction = evaluateFriction(state.currentIntent.riskLevel)

    // Record intent resolution to audit trail
    recordAudit({
      type: 'INTENT_PARSED',
      actor: { type: 'system', id: 'intent-resolver', label: 'Intent Resolver' },
      payload: {
        rawInput: state.currentIntent.rawInput,
        useCase: state.currentIntent.useCase,
        riskLevel: state.currentIntent.riskLevel,
        confidence: state.currentIntent.confidence,
      },
    })

    if (friction.needsPasskey) {
      // Step 1: Require passkey before showing preview
      setPendingPasskeyIntent(state.currentIntent)
      setShowPasskeyAuth(true)
    } else if (friction.needsPreview) {
      // Step 2: Show intent preview modal
      setPreviewIntent(state.currentIntent)
      setShowPreviewModal(true)
    }
    // Low risk: auto-execute (no friction gates)
  }, [state.currentIntent?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Passkey Authentication Handler ───────────────────────────────────
  const handlePasskeySuccess = useCallback(() => {
    setShowPasskeyAuth(false)

    recordAudit({
      type: 'PASSKEY_AUTH',
      actor: { type: 'human', id: 'current-user', label: 'User' },
      payload: { result: 'authenticated' },
    })

    if (pendingPasskeyIntent) {
      // After passkey, check if preview is also needed
      const policy = getFrictionPolicy(pendingPasskeyIntent.riskLevel)
      const needsPreview = policy.requirements.some(
        (r: { type: string }) => r.type === 'intent-preview',
      )

      if (needsPreview) {
        setPreviewIntent(pendingPasskeyIntent)
        setShowPreviewModal(true)
      }
      setPendingPasskeyIntent(null)
    }
  }, [pendingPasskeyIntent, recordAudit])

  const handlePasskeyCancel = useCallback(() => {
    setShowPasskeyAuth(false)
    setPendingPasskeyIntent(null)
    // Revert intent
    dispatch({ type: 'CLEAR_INTENT' })
  }, [dispatch])

  // ─── Friction Modal Handlers ──────────────────────────────────────────
  const handleExecute = useCallback(() => {
    setShowPreviewModal(false)
    recordAudit({
      type: 'ACTION_EXECUTED',
      actor: { type: 'human', id: 'current-user', label: 'User' },
      payload: { decision: 'execute', intentId: state.currentIntent?.id },
    })
  }, [recordAudit, state.currentIntent?.id])

  const handleEditPlan = useCallback(() => {
    setShowPreviewModal(false)
    recordAudit({
      type: 'HUMAN_REVIEW',
      actor: { type: 'human', id: 'current-user', label: 'User' },
      payload: { decision: 'edit-plan', intentId: state.currentIntent?.id },
    })
  }, [recordAudit, state.currentIntent?.id])

  const handleDoItMyself = useCallback(() => {
    setShowPreviewModal(false)
    recordAudit({
      type: 'HUMAN_REVIEW',
      actor: { type: 'human', id: 'current-user', label: 'User' },
      payload: { decision: 'do-it-myself', intentId: state.currentIntent?.id },
    })
  }, [recordAudit, state.currentIntent?.id])

  // ─── Undo Handler ─────────────────────────────────────────────────────
  const handleUndo = useCallback(
    (actionId: string) => {
      dispatch({ type: 'UNDO_ACTION', actionId })
      recordAudit({
        type: 'ACTION_UNDONE',
        actor: { type: 'human', id: 'current-user', label: 'User' },
        payload: { actionId },
      })
    },
    [dispatch, recordAudit],
  )

  // ─── Active undo actions (not yet expired, not yet undone) ────────────
  const activeUndoActions = state.undoableActions.filter(
    (ua) => !ua.undone && new Date(ua.undoExpiresAt).getTime() > Date.now(),
  )

  // ─── Govern mode shows audit trail inline ─────────────────────────────
  const showInlineAudit = isGovern || showAuditTrail

  return (
    <div
      className={cn(
        'flex flex-col h-screen overflow-hidden transition-colors duration-500',
        isGovern ? 'app-bg-govern-deep' : 'app-bg-oled',
      )}
    >
      {/* Aurora Pulse */}
      <AuroraPulse color={engineColor} intensity="subtle" />

      {/* Security State Bar */}
      <SecurityStateBar />

      {/* Main Header */}
      <header
        className={cn(
          'flex items-center justify-between px-4 py-2 border-b',
          isGovern
            ? 'border-blue-500/15 bg-blue-950/20'
            : 'border-white/[0.04] bg-black/20',
        )}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-white/80 tracking-tight">
            Orchestrator Workbench
          </h1>
          <span className="text-[9px] font-mono text-white/20 px-1.5 py-0.5 rounded border border-white/[0.06]">
            v2.0
          </span>
          {state.localFirstStatus.isOffline && (
            <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">
              OFFLINE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Audit Trail Toggle */}
          <button
            onClick={() => setShowAuditTrail((prev) => !prev)}
            className={cn(
              'text-[10px] px-2 py-1 rounded transition-colors font-mono',
              showAuditTrail
                ? isGovern
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-cyan-500/20 text-cyan-300'
                : 'text-white/30 hover:text-white/50',
            )}
            title="⌘⇧A"
          >
            監査証跡 ({state.auditTrail.events.length})
          </button>

          {/* Cmd+K Trigger */}
          <button
            onClick={() => setCmdPaletteOpen(true)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] transition-all',
              isGovern
                ? 'border-blue-500/20 bg-blue-500/5 text-blue-300/60 hover:bg-blue-500/10'
                : 'border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/60',
            )}
          >
            <span className="font-mono text-[10px]">⌘K</span>
            <span>意図を入力...</span>
          </button>

          {/* Govern Mode Toggle */}
          <GovernModeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex">
        {/* Bento Grid Area */}
        <div className={cn('flex-1 px-4 py-4 overflow-auto', showInlineAudit && 'pr-0')}>
          {state.activeBentoLayout ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Intent Summary */}
              {state.currentIntent && (
                <motion.div
                  variants={fadeUp}
                  className={cn(
                    'mb-4 px-4 py-3 rounded-xl border',
                    isGovern
                      ? 'border-blue-500/15 bg-blue-950/20'
                      : 'border-white/[0.06] bg-white/[0.02]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">意図:</span>
                      <span className="text-sm text-white/80 font-medium">
                        「{state.currentIntent.rawInput}」
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded-full font-mono',
                          state.currentIntent.riskLevel === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : state.currentIntent.riskLevel === 'high'
                              ? 'bg-amber-500/20 text-amber-400'
                              : state.currentIntent.riskLevel === 'medium'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-green-500/20 text-green-400',
                        )}
                      >
                        {state.currentIntent.riskLevel.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-white/30 font-mono">
                        {state.currentIntent.useCase ?? 'GENERIC'} · Tier {state.currentIntent.tier}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">
                        Confidence: {(state.currentIntent.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Active Approval Flow */}
              {activeFlow && (
                <motion.div variants={fadeUp} className="mb-4">
                  <ApprovalTracker
                    flows={[activeFlow]}
                    onSelectFlow={() => {}}
                  />
                </motion.div>
              )}

              {/* Bento Grid */}
              <BentoGrid
                layout={state.activeBentoLayout}
                cardStates={state.cardStates}
                governMode={isGovern}
              />
            </motion.div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-6 opacity-30">🎯</div>
                <h2 className="text-lg font-semibold text-white/50 mb-2">
                  Orchestrator Workbench v2.0
                </h2>
                <p className="text-sm text-white/30 mb-6 max-w-md">
                  ⌘K でコマンドパレットを開き、意図を自然言語で入力してください。
                  <br />
                  AI が最適な画面レイアウトと実行プランを自動生成します。
                </p>
                <button
                  onClick={() => setCmdPaletteOpen(true)}
                  className={cn(
                    'px-6 py-2.5 rounded-xl border text-sm font-medium transition-all',
                    isGovern
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                      : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20',
                  )}
                >
                  ⌘K コマンドパレットを開く
                </button>
                <p className="text-[10px] text-white/15 mt-4 font-mono">
                  10 Use Cases · 12 Card Types · Friction-Right · Proof-First · Local-First
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Inline Audit Trail (side panel) */}
        <AnimatePresence>
          {showInlineAudit && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'border-l overflow-hidden shrink-0',
                isGovern ? 'border-blue-500/15 bg-blue-950/10' : 'border-white/[0.04] bg-black/10',
              )}
            >
              <div className="w-[380px] h-full overflow-auto">
                <SemanticAuditTrail />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Undo Toasts */}
      <div className="fixed bottom-16 right-4 z-40 flex flex-col gap-2">
        <AnimatePresence>
          {activeUndoActions.slice(0, 3).map((ua) => (
            <UndoToast
              key={ua.id}
              action={ua}
              onUndo={handleUndo}
              onDismiss={() => dispatch({ type: 'UNDO_ACTION', actionId: ua.id })}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />

      {/* Passkey Auth Modal (Friction Gate) */}
      <PasskeyAuth
        open={showPasskeyAuth}
        actionLabel={pendingPasskeyIntent?.rawInput ?? 'Authenticate'}
        onSuccess={handlePasskeySuccess}
        onCancel={handlePasskeyCancel}
      />

      {/* Intent Preview Modal (Friction Gate) */}
      {previewIntent && (
        <IntentPreviewModal
          intent={previewIntent}
          open={showPreviewModal}
          onExecute={handleExecute}
          onEditPlan={handleEditPlan}
          onDoItMyself={handleDoItMyself}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      {/* Status Bar */}
      <StatusBar />

      {/* Govern Footer */}
      <GovernFooter
        auditId="GOV-ORCHESTRATOR-001"
        pageContext="Orchestrator Workbench v2.0 — Multi-Model AI"
      />
    </div>
  )
}

// ─── Exported Page Component ─────────────────────────────────────────────────

export default function OrchestratorWorkbench() {
  return (
    <WorkbenchProvider>
      <AuditProvider>
        <ApprovalProvider>
          <WorkbenchInner />
        </ApprovalProvider>
      </AuditProvider>
    </WorkbenchProvider>
  )
}