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
import { Surface, Button } from '@/design-system'

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
        <Surface variant="glass" padding="none" data-surface-role="structure" className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
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
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApprove(item.id)
                              }}
                              variant="glass"
                              engine="execute"
                              size="sm"
                              className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold"
                              aria-label={`Approve: ${item.action}`}
                            >
                              <CheckCircle2 size={13} />
                              Approve
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReject(item.id)
                              }}
                              variant="danger"
                              size="sm"
                              className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold"
                              aria-label={`Reject: ${item.action}`}
                            >
                              <XCircle size={13} />
                              Reject
                            </Button>
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
        </Surface>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {pendingActions.map((item) => (
          <motion.div key={item.id} variants={fadeUp}>
            <Surface variant="glass" padding="md"
              borderColor={item.priority === 'CRITICAL' ? 'rgba(234,179,8,0.5)' : undefined}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
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
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleApprove(item.id)}
                  variant="glass"
                  engine="execute"
                  fullWidth
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold"
                  aria-label={`Approve: ${item.action}`}
                >
                  <CheckCircle2 size={16} />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(item.id)}
                  variant="danger"
                  fullWidth
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold"
                  aria-label={`Reject: ${item.action}`}
                >
                  <XCircle size={16} />
                  Reject
                </Button>
              </div>
            </Surface>
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
