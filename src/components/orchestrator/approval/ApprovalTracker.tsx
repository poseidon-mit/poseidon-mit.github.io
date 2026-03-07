/**
 * Orchestrator Workbench v2.0 — Approval Tracker
 * Visual pipeline showing approval flow progress.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ApprovalFlow } from '@/lib/orchestrator/types'
import { staggerContainer, staggerItem } from '@/lib/motion-presets'

export interface ApprovalTrackerProps {
  flows: ApprovalFlow[]
  onSelectFlow: (flowId: string) => void
}

export function ApprovalTracker({ flows, onSelectFlow }: ApprovalTrackerProps) {
  if (flows.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-white/30">
        <span className="text-2xl block mb-2">📋</span>
        No active approval flows.
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {flows.map((flow) => {
        const completedSteps = flow.steps.filter((s) => s.status === 'completed').length
        const progress = (completedSteps / flow.steps.length) * 100
        const hasRejection = flow.steps.some((s) => s.status === 'rejected')

        return (
          <motion.button
            key={flow.id}
            variants={staggerItem}
            onClick={() => onSelectFlow(flow.id)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border transition-all',
              hasRejection
                ? 'border-red-500/15 bg-red-500/5 hover:bg-red-500/8'
                : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]',
            )}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full',
                    hasRejection ? 'bg-red-400' : 'bg-green-400',
                  )}
                />
              </div>
              <span className="text-[10px] font-mono text-white/30">
                {completedSteps}/{flow.steps.length}
              </span>
            </div>

            {/* Steps as dots */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {flow.steps.map((step, i) => (
                <div
                  key={step.id}
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[9px]',
                    step.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : step.status === 'in-progress'
                        ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                        : step.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-white/[0.04] text-white/20',
                  )}
                >
                  {step.status === 'completed'
                    ? '✓'
                    : step.status === 'rejected'
                      ? '✗'
                      : step.status === 'in-progress'
                        ? '●'
                        : i + 1}
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/40">
                Flow: {flow.id.slice(0, 8)}
              </span>
              {flow.deadline && (
                <span className="text-amber-400/60 font-mono">
                  Deadline: {new Date(flow.deadline).toLocaleDateString('ja-JP')}
                </span>
              )}
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
