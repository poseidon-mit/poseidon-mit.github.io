/**
 * CrossEngineTrail — visual chain showing a cross-engine event sequence.
 *
 * Renders a horizontal trail of nodes connected by arrows:
 *   Protect alert  →  Execute action  →  Govern decision
 *   Grow recommendation  →  Execute action  →  Govern decision
 *
 * Designed for Zone B (Proof) panels in hero sections.
 */
import { ArrowRight, Lock, Shield, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CrossEngineChain } from '@/domain/poseidon-universe'

export interface CrossEngineTrailProps {
  chain: CrossEngineChain
  className?: string
}

const ORIGIN_CONFIG = {
  alert: {
    icon: Shield,
    label: 'Alert Detected',
    engine: 'protect',
    color: 'var(--engine-protect)',
  },
  recommendation: {
    icon: TrendingUp,
    label: 'Recommendation',
    engine: 'grow',
    color: 'var(--engine-grow)',
  },
} as const

function TrailNode({
  icon: Icon,
  label,
  id,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  id: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-0">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl border"
        style={{ borderColor: `color-mix(in srgb, ${color} 30%, transparent)`, background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
      >
        <Icon size={16} className="[color:inherit]" />
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-widest text-white/40 text-center leading-tight">{label}</span>
      <span className="text-[9px] font-mono text-white/25 truncate max-w-[80px] text-center">{id}</span>
    </div>
  )
}

function TrailArrow() {
  return (
    <div className="flex items-center justify-center pb-5">
      <ArrowRight size={12} className="text-white/20 shrink-0" />
    </div>
  )
}

export function CrossEngineTrail({ chain, className }: CrossEngineTrailProps) {
  const originCfg = ORIGIN_CONFIG[chain.origin]
  const originId = chain.origin === 'alert' ? chain.alertId : chain.recommendationId

  return (
    <div className={cn('flex items-start gap-2', className)}>
      {/* Origin node */}
      <TrailNode
        icon={originCfg.icon}
        label={originCfg.label}
        id={originId}
        color={originCfg.color}
      />

      <TrailArrow />

      {/* Execute action */}
      <TrailNode
        icon={Zap}
        label="Action Queued"
        id={chain.actionId}
        color="var(--engine-execute)"
      />

      {chain.decisionId && (
        <>
          <TrailArrow />
          {/* Govern decision */}
          <TrailNode
            icon={Lock}
            label="Decision Logged"
            id={chain.decisionId}
            color="var(--engine-govern)"
          />
        </>
      )}
    </div>
  )
}

CrossEngineTrail.displayName = 'CrossEngineTrail'
