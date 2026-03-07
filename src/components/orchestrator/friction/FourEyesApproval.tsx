/**
 * Orchestrator Workbench v2.0 — Four-Eyes Approval
 * Multi-approver verification for critical-risk actions.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ApprovalFlow, ApprovalStep } from '@/lib/orchestrator/types'

export interface FourEyesApprovalProps {
  flow: ApprovalFlow
  open: boolean
  onApprove: (stepIndex: number) => void
  onReject: (stepIndex: number) => void
  onClose: () => void
}

const STATUS_STYLES: Record<ApprovalStep['status'], { icon: string; color: string; bg: string }> = {
  completed: { icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10' },
  'in-progress': { icon: '⏳', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  pending: { icon: '○', color: 'text-white/30', bg: 'bg-white/[0.02]' },
  rejected: { icon: '❌', color: 'text-red-400', bg: 'bg-red-500/10' },
}

export function FourEyesApproval({
  flow,
  open,
  onApprove,
  onReject,
  onClose,
}: FourEyesApprovalProps) {
  if (!open) return null

  const allApproved = flow.steps.every((s) => s.status === 'completed')
  const hasRejection = flow.steps.some((s) => s.status === 'rejected')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'relative w-full max-w-md rounded-2xl border overflow-hidden',
            'border-white/[0.08] bg-[hsl(220_20%_6%_/_0.95)] backdrop-blur-xl',
          )}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">👁👁</span>
              <h3 className="text-sm font-semibold text-white/90">Four-Eyes Approval</h3>
            </div>
            <p className="text-[11px] text-white/50">
              Critical action requires {flow.steps.length} independent approvals.
            </p>
          </div>

          {/* Steps */}
          <div className="px-5 pb-4 space-y-2">
            {flow.steps.map((step, index) => {
              const style = STATUS_STYLES[step.status]
              const isCurrentStep = index === flow.currentStepIndex

              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                    isCurrentStep
                      ? 'border-cyan-500/20 bg-cyan-500/5'
                      : 'border-white/[0.04]',
                    style.bg,
                  )}
                >
                  <span className="text-base">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-medium', style.color)}>
                        {step.label}
                      </span>
                      {step.assignee.channel && (
                        <span className="text-[9px] font-mono text-white/20">
                          via {step.assignee.channel}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/30">
                      {step.assignee.name} · {step.assignee.role}
                    </div>
                    {step.completedAt && (
                      <div className="text-[9px] text-white/15 font-mono">
                        Completed: {new Date(step.completedAt).toLocaleTimeString('ja-JP')}
                      </div>
                    )}
                  </div>

                  {/* Actions for current step */}
                  {isCurrentStep && step.status === 'in-progress' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onApprove(index)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        承認
                      </button>
                      <button
                        onClick={() => onReject(index)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        却下
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 flex items-center justify-between">
            <div className="text-[10px] text-white/30">
              {allApproved && '✅ All approvals complete'}
              {hasRejection && '❌ Approval rejected — action blocked'}
              {!allApproved && !hasRejection && `Step ${flow.currentStepIndex + 1} of ${flow.steps.length}`}
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/40 hover:text-white/60 transition-colors"
            >
              閉じる
            </button>
          </div>

          {/* Undo Window Info */}
          <div className="px-5 pb-3 text-[9px] text-white/15 font-mono border-t border-white/[0.03] pt-2">
            Undo window expires: {new Date(flow.undoWindowExpiresAt).toLocaleString('ja-JP')}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
