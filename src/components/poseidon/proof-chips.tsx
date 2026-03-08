/**
 * ProofChips — Inline calculation breakdown
 *
 * Shows how a total was derived from constituent parts.
 * Glass pill style, engine-colored accent, collapsible on mobile.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface ProofPart {
  label: string
  value: number
}

export interface ProofChipsProps {
  total: string
  parts: ProofPart[]
  className?: string
  formatValue?: (value: number) => string
}

const defaultFormat = (value: number) =>
  `$${Math.abs(value).toLocaleString()}`

export function ProofChips({
  total,
  parts,
  className = '',
  formatValue = defaultFormat,
}: ProofChipsProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium
          glass-surface transition-colors hover:bg-white/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        aria-expanded={expanded}
        aria-label={`${total} — click to ${expanded ? 'collapse' : 'expand'} breakdown`}
      >
        <span className="text-white/90 font-semibold">{total}</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/50"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-1.5 overflow-hidden"
          >
            {parts.map((part, i) => (
              <span
                key={part.label}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
                  text-[11px] bg-white/5 border border-white/10 text-white/70"
              >
                <span className="text-white/50">{part.label}</span>
                <span className="text-white/90 font-medium">
                  {i > 0 && '+ '}
                  {formatValue(part.value)}
                </span>
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
