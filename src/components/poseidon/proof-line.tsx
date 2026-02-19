/**
 * ProofLine — Evidence/rationale display for AI transparency.
 *
 * Shows a proof of reasoning with source, confidence, and timestamp.
 * Injected into data cards during "Poseidon化" step.
 */
import { cn, formatConfidence, type ConfidenceFormat } from '@/lib/utils'
import type { EngineName } from '@/lib/engine-tokens'
import { engineTokens } from '@/lib/engine-tokens'

export interface ProofLineProps {
  source: string
  confidence?: number
  confidenceMode?: ConfidenceFormat
  timestamp?: string
  engine?: EngineName
  className?: string
}

export function ProofLine({
  source,
  confidence,
  confidenceMode = 'percent',
  timestamp,
  engine,
  className,
}: ProofLineProps) {
  const token = engine ? engineTokens[engine] : null

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-[11px] text-white/40 border-t border-white/[0.06] pt-2 mt-2',
        className,
      )}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
      <span className="truncate">{source}</span>
      {confidence != null && (
        <span className={cn('tabular-nums font-medium', token?.textClass ?? 'text-cyan-400')}>
          {formatConfidence(confidence, { mode: confidenceMode })}
        </span>
      )}
      {timestamp && (
        <span className="ml-auto shrink-0 text-white/30">{timestamp}</span>
      )}
    </div>
  )
}

ProofLine.displayName = 'ProofLine'
