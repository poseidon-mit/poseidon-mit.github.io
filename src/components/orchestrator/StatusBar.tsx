/**
 * Orchestrator Workbench v2.0 — Status Bar
 * Bottom status bar showing session info, govern score, local-first status, and audit chain.
 */

import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { getGovernScoreLabel, getGovernScoreColor } from '@/lib/orchestrator/types'

export function StatusBar() {
  const { state } = useWorkbenchContext()
  const { governScore, localFirstStatus, auditTrail, themeMode, sessionId } = state

  const isGovern = themeMode.mode === 'govern'
  const eventCount = auditTrail.events.length
  const chainStatus = auditTrail.chainValid ? '✓ Chain Valid' : '⚠ Chain Broken'

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-1.5 text-[10px] font-mono border-t',
        isGovern
          ? 'bg-blue-950/50 border-blue-500/20 text-blue-300/60'
          : 'bg-black/40 border-white/[0.04] text-white/40',
      )}
    >
      {/* Left: Session + Govern Score */}
      <div className="flex items-center gap-4">
        <span>Session: {sessionId.slice(0, 8)}</span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: getGovernScoreColor(governScore.overall) }}
          />
          Govern: {governScore.overall}
          <span className="text-white/30">({getGovernScoreLabel(governScore.overall)})</span>
        </span>
      </div>

      {/* Center: Audit Chain */}
      <div className="flex items-center gap-4">
        <span>Audit: {eventCount} events {chainStatus}</span>
        {state.undoableActions.filter((a) => !a.undone).length > 0 && (
          <span className="text-amber-400/70">
            Undo: {state.undoableActions.filter((a) => !a.undone).length} pending
          </span>
        )}
      </div>

      {/* Right: Local-First + Offline */}
      <div className="flex items-center gap-4">
        {localFirstStatus.isOffline && (
          <span className="text-amber-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Offline
          </span>
        )}
        <span>
          OPFS: {localFirstStatus.opfsAvailable ? '✓' : '✗'}
        </span>
        <span>
          Encryption: {localFirstStatus.encryptionKeyLoaded ? '🔒' : '🔓'}
        </span>
        {localFirstStatus.pendingSyncCount > 0 && (
          <span className="text-cyan-400/70">
            Sync: {localFirstStatus.pendingSyncCount} queued
          </span>
        )}
      </div>
    </div>
  )
}
