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
import { GlassCard, PriorityBadge, ConfidenceIndicator, ReasoningChain } from '@/components/poseidon'
import { initialActions, engineColor, engineBg, executeReasoningSteps } from './execute-data'
import type { ActionItem, ActionStatus, Engine } from '@/types/engine-data'
import type { ViewMode } from '@/hooks/useViewMode'

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
    <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        <ListTodo size={20} style={{ color: '#EAB308' }} aria-hidden="true" />
        Pending Actions
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden !p-0">
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApprove(item.id)
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                                color: '#04141a',
                              }}
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
                              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:shadow-[0_0_8px_rgba(239,68,68,0.3)] active:scale-[0.98] cursor-pointer"
                              style={{
                                borderColor: 'rgba(239,68,68,0.3)',
                                color: '#EF4444',
                                background: 'transparent',
                              }}
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
        </GlassCard>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {pendingActions.map((item) => (
          <motion.div key={item.id} variants={fadeUp}>
            <GlassCard
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
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                    color: '#04141a',
                    minHeight: '44px',
                  }}
                  aria-label={`Approve: ${item.action}`}
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:shadow-[0_0_8px_rgba(239,68,68,0.3)] active:scale-[0.98] cursor-pointer"
                  style={{
                    borderColor: 'rgba(239,68,68,0.3)',
                    color: '#EF4444',
                    background: 'transparent',
                    minHeight: '44px',
                  }}
                  aria-label={`Reject: ${item.action}`}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Reasoning chain — deep mode only */}
      {viewMode === 'deep' && (
        <ReasoningChain steps={executeReasoningSteps} accentColor="#EAB308" className="mt-4" />
      )}
    </motion.section>
  )
}

export default ActionQueue
