/**
 * ReasoningChain — Vertical stepper visualizing AI reasoning steps.
 *
 * Shows connected steps with optional confidence scores,
 * animated with stagger entry.
 */
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion-presets'
import { ConfidenceIndicator } from './confidence-indicator'
import type { ReasoningStep } from '@/types/engine-data'

export interface ReasoningChainProps {
  steps: ReasoningStep[]
  accentColor?: string
  className?: string
}

export function ReasoningChain({ steps, accentColor = '#00F0FF', className }: ReasoningChainProps) {
  return (
    <motion.div
      variants={staggerContainer}
      className={className}
      role="list"
      aria-label="AI reasoning steps"
    >
      {steps.map((step, i) => (
        <motion.div
          key={step.step}
          variants={staggerItem}
          className="relative flex gap-3 pb-4"
          role="listitem"
        >
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className="absolute left-[11px] top-6 bottom-0"
              style={{ width: 1, background: `${accentColor}33` }}
            />
          )}

          {/* Step marker */}
          <div
            className="relative z-10 flex items-center justify-center rounded-full shrink-0"
            style={{
              width: 24,
              height: 24,
              background: `${accentColor}1A`,
              border: `1px solid ${accentColor}33`,
            }}
          >
            <span className="text-[10px] font-bold" style={{ color: accentColor }}>
              {step.step}
            </span>
          </div>

          {/* Step content */}
          <div className="flex flex-col gap-1 min-w-0 pt-0.5">
            <span className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>
              {step.label}
            </span>
            <span className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
              {step.description}
            </span>
            {step.confidence !== undefined && (
              <div className="mt-1">
                <ConfidenceIndicator value={step.confidence} accentColor={accentColor} />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

ReasoningChain.displayName = 'ReasoningChain'
