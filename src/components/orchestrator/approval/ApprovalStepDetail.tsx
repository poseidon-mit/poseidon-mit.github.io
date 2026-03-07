/**
 * Orchestrator Workbench v2.0 — Approval Step Detail
 * Shows detailed info for each step in the approval flow.
 */

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, User, AlertCircle } from 'lucide-react'
import type { ApprovalStep } from '@/lib/orchestrator/types'

interface ApprovalStepDetailProps {
  step: ApprovalStep
  stepIndex: number
  isActive: boolean
  governMode?: boolean
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: 'text-zinc-400',
    bg: 'bg-zinc-800/50',
    label: '待機中',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-900/30',
    label: '承認済',
  },
  'in-progress': {
    icon: AlertCircle,
    color: 'text-cyan-400',
    bg: 'bg-cyan-900/30',
    label: '進行中',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-900/30',
    label: '却下',
  },
} as const

export function ApprovalStepDetail({ step, stepIndex, isActive, governMode }: ApprovalStepDetailProps) {
  const config = STATUS_CONFIG[step.status]
  const Icon = config.icon
  const accentColor = governMode ? 'border-blue-500' : 'border-cyan-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        rounded-lg border p-3 transition-colors
        ${isActive ? `${accentColor} border-opacity-100` : 'border-zinc-700/50'}
        ${config.bg}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className="text-xs font-medium text-zinc-200">
            Step {stepIndex + 1}: {step.label}
          </span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <User className="w-3 h-3 text-zinc-500" />
        <span className="text-[11px] text-zinc-400">
          {step.assignee.name}
          {step.assignee.role && (
            <span className="text-zinc-600 ml-1">({step.assignee.role})</span>
          )}
        </span>
      </div>

      {/* Channel indicator */}
      {step.assignee.channel && (
        <div className="text-[10px] text-zinc-500 font-mono ml-4">
          via {step.assignee.channel}
        </div>
      )}

      {/* Timestamp */}
      {step.completedAt && (
        <div className="mt-2 text-[10px] text-zinc-600 font-mono">
          {new Date(step.completedAt).toLocaleString('ja-JP')}
        </div>
      )}

      {/* Active indicator pulse */}
      {isActive && step.status === 'pending' && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              governMode ? 'bg-blue-400' : 'bg-cyan-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              governMode ? 'bg-blue-500' : 'bg-cyan-500'
            }`} />
          </span>
          <span className="text-[10px] text-zinc-500">承認待ち</span>
        </div>
      )}
    </motion.div>
  )
}
