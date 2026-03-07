/**
 * Orchestrator Workbench v2.0 — Security State Bar
 * Header bar showing encryption status, chain validity, govern score, and offline indicator.
 */

import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { getGovernScoreLabel, getGovernScoreColor } from '@/lib/orchestrator/types'

export function SecurityStateBar() {
  const { state } = useWorkbenchContext()
  const { governScore, localFirstStatus, auditTrail, themeMode } = state
  const isGovern = themeMode.mode === 'govern'

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-1.5 text-[10px] font-mono border-b',
        isGovern
          ? 'bg-blue-950/40 border-blue-500/15 text-blue-300/60'
          : 'bg-black/30 border-white/[0.04] text-white/40',
      )}
    >
      {/* Encryption */}
      <span className="flex items-center gap-1">
        {localFirstStatus.encryptionKeyLoaded ? (
          <>
            <span className="text-green-400">🔒</span>
            <span>E2E Encrypted</span>
          </>
        ) : (
          <>
            <span className="text-amber-400">🔓</span>
            <span>Unencrypted</span>
          </>
        )}
      </span>

      {/* Chain Validity */}
      <span className="flex items-center gap-1">
        {auditTrail.chainValid ? (
          <>
            <span className="text-green-400">✓</span>
            <span>Chain Valid ({auditTrail.events.length})</span>
          </>
        ) : (
          <>
            <span className="text-red-400">⚠</span>
            <span className="text-red-400">Chain Broken</span>
          </>
        )}
      </span>

      {/* Govern Score */}
      <span className="flex items-center gap-1">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: getGovernScoreColor(governScore.overall) }}
        />
        <span>Govern: {governScore.overall}</span>
      </span>

      {/* Spacer */}
      <span className="flex-1" />

      {/* Offline / Online */}
      {localFirstStatus.isOffline ? (
        <span className="flex items-center gap-1 text-amber-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Offline Mode
        </span>
      ) : (
        <span className="flex items-center gap-1 text-green-400/50">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400/50" />
          Connected
        </span>
      )}

      {/* Last Sync */}
      {localFirstStatus.lastSyncAt && (
        <span className="text-white/25">
          Last sync: {new Date(localFirstStatus.lastSyncAt).toLocaleTimeString('ja-JP')}
        </span>
      )}
    </div>
  )
}
