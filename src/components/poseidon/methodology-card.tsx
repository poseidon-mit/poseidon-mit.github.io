/**
 * MethodologyCard — Collapsible model methodology card.
 *
 * Shows model name, version, accuracy, and optional citations.
 * Collapsed by default (detail/deep modes expand).
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Cpu, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitationSource } from '@/types/engine-data'

import { CitationCard } from './citation-card'
import { Surface } from '@/design-system'

export interface MethodologyCardProps {
  modelName: string
  modelVersion: string
  accuracy?: number
  description: string
  citations?: CitationSource[]
  accentColor?: string
  className?: string
}

export function MethodologyCard({
  modelName,
  modelVersion,
  accuracy,
  description,
  citations,
  accentColor = '#00F0FF',
  className,
}: MethodologyCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Surface variant="glass" padding="md" className={cn('flex flex-col gap-3', className)}>
      {/* Header */}
      <button
        className="flex items-center gap-2 w-full cursor-pointer"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <FlaskConical size={14} style={{ color: accentColor }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
          How it works
        </span>
        <ChevronDown
          size={14}
          className="ml-auto transition-transform"
          style={{
            color: '#64748B',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Always visible: model badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}
        >
          <Cpu size={11} />
          {modelName}
        </span>
        <span className="text-xs font-mono" style={{ color: '#64748B' }}>
          v{modelVersion}
        </span>
        {accuracy !== undefined && (
          <span className="text-xs font-mono tabular-nums" style={{ color: '#10B981' }}>
            {(accuracy * 100).toFixed(1)}% accuracy
          </span>
        )}
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                {description}
              </p>

              {citations && citations.length > 0 && (
                <CitationCard
                  summary="References and supporting evidence for this methodology."
                  sources={citations}
                  confidence={accuracy ?? 0.95}
                  accentColor={accentColor}
                  viewMode="deep"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Surface>
  )
}

MethodologyCard.displayName = 'MethodologyCard'
