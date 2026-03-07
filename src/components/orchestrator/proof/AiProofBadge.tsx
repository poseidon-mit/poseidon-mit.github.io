/**
 * Orchestrator Workbench v2.0 — AI Proof Badge
 * Visual badge showing content provenance (AI, human, system, external).
 */

import { cn } from '@/lib/utils'
import type { ProofBadge } from '@/lib/orchestrator/types'

export interface AiProofBadgeProps {
  badge: ProofBadge
  size?: 'sm' | 'md'
}

const TYPE_CONFIG: Record<ProofBadge['type'], { icon: string; label: string; color: string }> = {
  'ai-generated': { icon: '🤖', label: 'AI Generated', color: 'violet' },
  'human-authored': { icon: '👤', label: 'Human Authored', color: 'cyan' },
  'system-data': { icon: '⚙', label: 'System Data', color: 'blue' },
  'external-sync': { icon: '🔗', label: 'External Sync', color: 'amber' },
}

export function AiProofBadge({ badge, size = 'sm' }: AiProofBadgeProps) {
  const config = TYPE_CONFIG[badge.type]
  const isSm = size === 'sm'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-mono',
        isSm ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-[11px]',
        badge.tamperDetected
          ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
          : 'bg-white/5 text-white/50 ring-1 ring-white/10',
      )}
      title={`Source: ${badge.source}\nVerified: ${badge.verifiedAt}\nHash: ${badge.hash ?? 'N/A'}`}
    >
      <span>{config.icon}</span>
      {!isSm && <span>{config.label}</span>}
      {badge.hash && (
        <span className="text-white/30">{badge.hash.slice(0, 8)}</span>
      )}
      {badge.tamperDetected && <span className="text-red-400 font-bold">⚠</span>}
    </div>
  )
}
