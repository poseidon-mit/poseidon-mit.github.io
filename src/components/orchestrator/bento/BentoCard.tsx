/**
 * Orchestrator Workbench v2.0 — Bento Card Shell
 * Glass-surface card wrapper with engine color accent, proof badge, and loading state.
 */

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { engineTokens, type EngineName } from '@/lib/engine-tokens'
import type { BentoCardSpec, BentoCardState, ProofBadge } from '@/lib/orchestrator/types'
import { Shimmer } from '@/components/poseidon'

export interface BentoCardProps {
  spec: BentoCardSpec
  state: BentoCardState | null
  governMode?: boolean
  children: ReactNode
}

function ProofBadgeIndicator({ badge }: { badge: ProofBadge }) {
  const typeIcons: Record<ProofBadge['type'], string> = {
    'ai-generated': '🤖',
    'human-authored': '👤',
    'system-data': '⚙',
    'external-sync': '🔗',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono',
        badge.tamperDetected
          ? 'bg-red-500/20 text-red-400'
          : 'bg-white/5 text-white/50',
      )}
      title={`Hash: ${badge.hash?.slice(0, 8) ?? 'N/A'} | Source: ${badge.source}`}
    >
      <span>{typeIcons[badge.type]}</span>
      <span>{badge.hash?.slice(0, 8) ?? '—'}</span>
      {badge.tamperDetected && <span className="text-red-400">⚠</span>}
    </div>
  )
}

export function BentoCard({ spec, state, governMode = false, children }: BentoCardProps) {
  const engine = engineTokens[spec.engine]
  const isLoading = state?.loading ?? true
  const hasError = !!state?.error

  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-xl border backdrop-blur-md',
        'transition-all duration-300',
        governMode
          ? 'border-blue-500/20 bg-blue-950/30'
          : 'border-white/[0.06] bg-white/[0.03]',
        hasError && 'border-red-500/30',
      )}
      style={{
        borderTopColor: `color-mix(in srgb, ${engine.color} 30%, transparent)`,
        borderTopWidth: '2px',
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: engine.color }}
          />
          <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
            {spec.type.replace(/-/g, ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {state?.proofBadge && <ProofBadgeIndicator badge={state.proofBadge} />}
          {state?.humanAddons && state.humanAddons.length > 0 && (
            <span className="text-[10px] text-amber-400/70">
              📌 {state.humanAddons.length}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 h-[calc(100%-2.5rem)]">
        {isLoading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <Shimmer className="h-4 w-3/4 rounded" />
            <Shimmer className="h-3 w-1/2 rounded" />
            <Shimmer className="h-8 w-full rounded mt-2" />
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center h-full text-red-400/70 text-xs">
            <span className="text-lg mb-1">⚠</span>
            <span>{state?.error}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
