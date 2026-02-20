/**
 * CitationCard — AI insight with inline citation markers and expandable sources.
 *
 * Inspired by Perplexity's citation-forward pattern.
 * Shows summary + confidence, with numbered source references.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitationSource } from '@/types/engine-data'
import type { ViewMode } from '@/hooks/useViewMode'

import { ConfidenceIndicator } from './confidence-indicator'
import { Surface } from '@/design-system'

export interface CitationCardProps {
  summary: string
  sources: CitationSource[]
  confidence: number
  accentColor?: string
  viewMode?: ViewMode
  className?: string
}

export function CitationCard({
  summary,
  sources,
  confidence,
  accentColor = '#00F0FF',
  viewMode = 'detail',
  className,
}: CitationCardProps) {
  const [expanded, setExpanded] = useState(viewMode === 'deep')

  return (
    <Surface variant="glass" padding="none" className={cn('flex flex-col gap-3', className)} borderColor={accentColor}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen size={14} style={{ color: accentColor }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
          AI Insight
        </span>
        <div className="ml-auto">
          <ConfidenceIndicator value={confidence} accentColor={accentColor} />
        </div>
      </div>

      {/* Summary with inline citations */}
      <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
        {summary}
      </p>

      {/* Sources toggle - hidden in glance mode */}
      {viewMode !== 'glance' && sources.length > 0 && (
        <>
          <button
            className="flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
            style={{ color: '#64748B', background: 'transparent', border: 'none', padding: 0 }}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Hide' : 'Show'} ${sources.length} sources`}
          >
            <ChevronDown
              size={14}
              className="transition-transform"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
            {sources.length} source{sources.length > 1 ? 's' : ''}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {sources.map((source, i) => (
                    <div key={source.id} className="flex items-start gap-2">
                      <span
                        className="mt-0.5 inline-flex items-center justify-center rounded-full text-[10px] font-bold shrink-0"
                        style={{
                          width: 18,
                          height: 18,
                          background: `${accentColor}1A`,
                          color: accentColor,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>
                          {source.label}
                        </span>
                        <span className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                          {source.excerpt}
                        </span>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
                            style={{ color: accentColor }}
                          >
                            <ExternalLink size={10} />
                            View source
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Surface>
  )
}

CitationCard.displayName = 'CitationCard'
