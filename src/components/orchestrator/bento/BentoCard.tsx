/**
 * Orchestrator Workbench v4.0 — Bento Card Shell
 * Glass-surface card wrapper with engine color accent, proof badge, loading state,
 * and streaming state rendering (skeleton → streaming → complete).
 */

import { type ReactNode, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { engineTokens, type EngineName } from '@/lib/engine-tokens'
import type { BentoCardSpec, BentoCardState, ProofBadge } from '@/lib/orchestrator/types'
import type { BentoCardStreamingState, StreamingStatus } from '@/lib/orchestrator/workspace/workspace-types'
import { Shimmer } from '@/components/poseidon'

export interface BentoCardProps {
  spec: BentoCardSpec
  state: BentoCardState | null
  streamingState?: BentoCardStreamingState | null
  governMode?: boolean
  onInspect?: (cardId: string) => void
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

// ─── Streaming State Indicators ───────────────────────────────────────────

function SkeletonState({ source, estimatedMs }: { source: string; estimatedMs: number }) {
  const seconds = Math.ceil(estimatedMs / 1000)

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/40 font-mono">
          {source}
        </span>
        <span className="text-[10px] text-white/30 font-mono tabular-nums">
          ~{seconds}s
        </span>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Shimmer className="h-5 w-3/4 rounded" />
        <Shimmer className="h-3 w-1/2 rounded" />
        <Shimmer className="h-10 w-full rounded mt-2" />
        <Shimmer className="h-3 w-2/3 rounded" />
      </div>
    </div>
  )
}

function StreamingState({
  source,
  confidence,
  estimatedMs,
}: {
  source: string
  confidence: number
  estimatedMs: number
}) {
  const pct = Math.round(confidence * 100)

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/50 font-mono">
          ストリーミング: {source}
        </span>
        <span className="text-[10px] text-cyan-400/70 font-mono tabular-nums">
          {pct}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-cyan-400/50"
          initial={{ width: '10%' }}
          animate={{ width: `${Math.max(10, pct)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {/* Partial data placeholder */}
      <div className="flex-1 flex flex-col gap-2 opacity-50">
        <Shimmer className="h-4 w-full rounded" />
        <div className="h-8 w-full rounded bg-white/[0.02]" />
      </div>
    </div>
  )
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <span className="text-lg">⚠</span>
      <span className="text-xs text-red-400/70 text-center">{error}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[10px] px-3 py-1 rounded-md bg-red-500/10 text-red-400/80 hover:bg-red-500/20 transition-colors"
        >
          再試行
        </button>
      )}
    </div>
  )
}

// ─── Confidence Border Logic ────────────────────────────────────────────────

function getConfidenceBorderClass(status: StreamingStatus, confidence: number): string {
  if (status === 'complete') {
    return confidence >= 0.8
      ? 'ring-2 ring-emerald-400/40'
      : 'ring-2 ring-amber-400/60'
  }
  if (status === 'streaming') {
    return 'ring-1 ring-cyan-400/20 animate-pulse'
  }
  if (status === 'error') {
    return 'ring-2 ring-red-500/40'
  }
  return ''
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function BentoCard({
  spec,
  state,
  streamingState,
  governMode = false,
  onInspect,
  children,
}: BentoCardProps) {
  const engine = engineTokens[spec.engine]
  const isLoading = state?.loading ?? true
  const hasError = !!state?.error

  // Streaming state takes precedence for rendering decisions
  const sStatus = streamingState?.streamingStatus
  const isStreaming = sStatus === 'skeleton' || sStatus === 'streaming'
  const isStreamComplete = sStatus === 'complete'
  const isStreamError = sStatus === 'error'
  const showConfidence = isStreamComplete && streamingState?.confidence !== undefined
  const isLowConfidence = showConfidence && (streamingState?.confidence ?? 1) < 0.8

  const handleClick = useCallback(() => {
    if (isLowConfidence && onInspect) {
      onInspect(spec.id)
    }
  }, [isLowConfidence, onInspect, spec.id])

  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-xl border backdrop-blur-md',
        'transition-all duration-300',
        governMode
          ? 'border-blue-500/20 bg-blue-950/30'
          : 'border-white/[0.06] bg-white/[0.03]',
        hasError && !isStreamError && 'border-red-500/30',
        sStatus && getConfidenceBorderClass(sStatus, streamingState?.confidence ?? 0),
        isLowConfidence && 'cursor-pointer',
      )}
      style={{
        borderTopColor: `color-mix(in srgb, ${engine.color} 30%, transparent)`,
        borderTopWidth: '2px',
      }}
      onClick={handleClick}
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
          {/* Confidence badge for low-confidence cards */}
          {isLowConfidence && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400/80">
              要確認
            </span>
          )}
          {state?.proofBadge && <ProofBadgeIndicator badge={state.proofBadge} />}
          {streamingState?.proofBadge && !state?.proofBadge && (
            <ProofBadgeIndicator badge={streamingState.proofBadge} />
          )}
          {state?.humanAddons && state.humanAddons.length > 0 && (
            <span className="text-[10px] text-amber-400/70">
              📌 {state.humanAddons.length}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 h-[calc(100%-2.5rem)]">
        <AnimatePresence mode="wait">
          {/* Streaming: Skeleton phase */}
          {sStatus === 'skeleton' && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <SkeletonState
                source={streamingState?.streamingSource ?? ''}
                estimatedMs={streamingState?.estimatedTimeRemainingMs ?? 3000}
              />
            </motion.div>
          )}

          {/* Streaming: Partial data phase */}
          {sStatus === 'streaming' && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <StreamingState
                source={streamingState?.streamingSource ?? ''}
                confidence={streamingState?.confidence ?? 0}
                estimatedMs={streamingState?.estimatedTimeRemainingMs ?? 0}
              />
            </motion.div>
          )}

          {/* Streaming: Error */}
          {isStreamError && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ErrorState error={state?.error ?? 'ストリーミングエラー'} />
            </motion.div>
          )}

          {/* Complete (streaming done) or non-streaming card */}
          {(isStreamComplete || !sStatus) && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {isLoading && !isStreamComplete ? (
                <div className="flex flex-col gap-2 animate-pulse">
                  <Shimmer className="h-4 w-3/4 rounded" />
                  <Shimmer className="h-3 w-1/2 rounded" />
                  <Shimmer className="h-8 w-full rounded mt-2" />
                </div>
              ) : hasError && !isStreamError ? (
                <ErrorState error={state?.error ?? 'エラー'} />
              ) : (
                children
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
