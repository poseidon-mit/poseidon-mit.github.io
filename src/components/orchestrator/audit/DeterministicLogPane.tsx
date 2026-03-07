/**
 * Orchestrator Workbench v2.0 — Deterministic Log Pane
 * Layer 1: Raw machine-readable audit events with SHA-256 chain hashes.
 */

import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { shortHash } from '@/lib/orchestrator/crypto'
import type { AuditEventType } from '@/lib/orchestrator/types'

const EVENT_TYPE_STYLES: Record<AuditEventType, { icon: string; color: string }> = {
  INTENT_PARSED: { icon: '🎯', color: 'text-cyan-400' },
  DATA_FETCHED: { icon: '📥', color: 'text-blue-400' },
  AI_GENERATION: { icon: '🤖', color: 'text-violet-400' },
  AI_VERIFICATION: { icon: '✅', color: 'text-green-400' },
  HUMAN_REVIEW: { icon: '👁', color: 'text-amber-400' },
  HUMAN_ADDON: { icon: '✍', color: 'text-orange-400' },
  PASSKEY_AUTH: { icon: '🔑', color: 'text-yellow-400' },
  APPROVAL_STEP: { icon: '📋', color: 'text-emerald-400' },
  ACTION_EXECUTED: { icon: '▶', color: 'text-cyan-400' },
  ACTION_UNDONE: { icon: '⏪', color: 'text-amber-400' },
  SESSION_START: { icon: '🚀', color: 'text-green-400' },
  SESSION_END: { icon: '🏁', color: 'text-white/40' },
  DATA_PURGE: { icon: '🗑', color: 'text-red-400' },
}

export function DeterministicLogPane() {
  const { state } = useWorkbenchContext()
  const events = state.auditTrail.events

  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-white/30">
        <span className="text-2xl block mb-2">📋</span>
        No audit events recorded yet.
      </div>
    )
  }

  return (
    <div className="max-h-[400px] overflow-auto">
      <table className="w-full text-[10px] font-mono">
        <thead>
          <tr className="text-white/30 border-b border-white/[0.04]">
            <th className="text-left px-2 py-1.5">Time</th>
            <th className="text-left px-2 py-1.5">Type</th>
            <th className="text-left px-2 py-1.5">Actor</th>
            <th className="text-left px-2 py-1.5">Hash</th>
            <th className="text-left px-2 py-1.5">Prev</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const style = EVENT_TYPE_STYLES[event.type] ?? {
              icon: '•',
              color: 'text-white/50',
            }
            return (
              <tr
                key={event.id}
                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-2 py-1.5 text-white/40 whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className={cn('px-2 py-1.5 whitespace-nowrap', style.color)}>
                  <span className="mr-1">{style.icon}</span>
                  {event.type}
                </td>
                <td className="px-2 py-1.5 text-white/50 whitespace-nowrap">
                  <span className="text-white/25">{event.actor.type}:</span>{' '}
                  {event.actor.label}
                </td>
                <td className="px-2 py-1.5 text-green-400/60 whitespace-nowrap">
                  {shortHash(event.hash)}
                </td>
                <td className="px-2 py-1.5 text-white/20 whitespace-nowrap">
                  {shortHash(event.previousHash)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
