/**
 * ActionQueue — Pending actions table (desktop) + card list (mobile) for Execute.
 *
 * Owns the action state (approve/reject mutations) since it is the primary consumer.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  CircleDot,
  ListTodo,
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { PriorityBadge, ConfidenceIndicator, ReasoningChain } from '@/components/poseidon'
import { initialActions, engineColor, engineBg, executeReasoningSteps } from './execute-data'
import type { ActionItem, ActionStatus, Engine } from '@/types/engine-data'
import type { ViewMode } from '@/hooks/useViewMode'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

/* ── Local EngineBadge (Execute-specific inline style) ── */

function EngineBadge({ engine }: { engine: Engine }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: engineBg[engine], color: engineColor[engine] }}
    >
      <CircleDot size={10} />
      {engine}
    </span>
  )
}

/* ═══════════════════════════════════════════
   ACTION QUEUE
   ═══════════════════════════════════════════ */

export interface ActionQueueProps {
  viewMode?: ViewMode
}

export function ActionQueue({ viewMode = 'detail' }: ActionQueueProps) {
  const [actions, setActions] = useState<ActionItem[]>(initialActions)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' as ActionStatus } : a))
    )
  }

  const handleReject = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' as ActionStatus } : a))
    )
  }

  const pendingActions = actions.filter((a) => a.status === 'pending')

  return (
    <motion.section variants={staggerContainer} className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        <ListTodo size={20} style={{ color: 'var(--engine-execute)' }} aria-hidden="true" />
        Pending Actions
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl !p-0" data-surface-role="structure">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Priority', 'Action', 'Engine', 'Confidence', 'Amount', 'Time', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold"
                        style={{ color: '#64748B' }}
                        scope="col"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pendingActions.map((item) => {
                  const expanded = expandedId === item.id
                  return (
                    <React.Fragment key={item.id}>
                      <motion.tr
                        variants={fadeUp}
                        className="group transition-colors cursor-pointer"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          ...(item.priority === 'CRITICAL'
                            ? { borderLeft: '2px solid rgba(234,179,8,0.5)' }
                            : {}),
                        }}
                        onClick={() => setExpandedId(expanded ? null : item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setExpandedId(expanded ? null : item.id)
                          }
                        }}
                        tabIndex={0}
                        role="row"
                        aria-expanded={expanded}
                        aria-label={`${item.priority} priority: ${item.action}`}
                      >
                        <td className="px-4 py-3.5">
                          <PriorityBadge priority={item.priority} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                              {item.action}
                            </span>
                            {expanded ? (
                              <ChevronUp size={14} style={{ color: '#64748B' }} />
                            ) : (
                              <ChevronDown size={14} style={{ color: '#64748B' }} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <EngineBadge engine={item.engine} />
                        </td>
                        <td className="px-4 py-3.5">
                          <ConfidenceIndicator value={item.confidence} accentColor="#14B8A6" />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                            {item.amount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs" style={{ color: '#64748B' }}>
                            {item.timeAgo}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApprove(item.id)
                              }}
                              className={cn(buttonVariants({ variant: "glass", size: "sm" }), "inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold")}
                              aria-label={`Approve: ${item.action}`}
                            >
                              <CheckCircle2 size={13} />
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReject(item.id)
                              }}
                              className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold")}
                              aria-label={`Reject: ${item.action}`}
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                      {expanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                              {item.detail}
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {pendingActions.map((item) => (
          <motion.div key={item.id} variants={fadeUp}>
            <div
              className="relative overflow-hidden rounded-[24px] border backdrop-blur-3xl bg-black/60 shadow-xl p-6 flex flex-col gap-3"
              style={{
                borderColor: item.priority === 'CRITICAL' ? 'rgba(234,179,8,0.5)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={item.priority} />
                <EngineBadge engine={item.engine} />
                <span className="ml-auto text-xs" style={{ color: '#64748B' }}>
                  {item.timeAgo}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                {item.action}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                {item.detail}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                  {item.amount}
                </span>
                <ConfidenceIndicator value={item.confidence} accentColor="#14B8A6" />
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <button
                  onClick={() => handleApprove(item.id)}
                  className={cn(buttonVariants({ variant: "glass" }), "w-full flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold")}
                  aria-label={`Approve: ${item.action}`}
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  className={cn(buttonVariants({ variant: "destructive" }), "w-full flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold")}
                  aria-label={`Reject: ${item.action}`}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reasoning chain — deep mode only */}
      {viewMode === 'deep' && (
        <ReasoningChain steps={executeReasoningSteps} accentColor="var(--engine-execute)" className="mt-4" />
      )}
    </motion.section>
  )
}

export default ActionQueue
