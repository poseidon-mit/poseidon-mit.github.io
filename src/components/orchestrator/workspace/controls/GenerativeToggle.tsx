/**
 * Generative UI Controls — Toggle
 *
 * Boolean switch rendered inside BentoCards.
 * Engine-colored track when active.
 *
 * Built on native HTML checkbox + Tailwind styling.
 */

import { useCallback, useId } from 'react'
import { cn } from '@/lib/utils'
import { engineTokens } from '@/lib/engine-tokens'
import type { GenerativeToggleControl } from '@/lib/orchestrator/workspace/workspace-types'

export interface GenerativeToggleProps {
  control: GenerativeToggleControl
  onChange: (controlId: string, value: boolean) => void
}

export function GenerativeToggle({ control, onChange }: GenerativeToggleProps) {
  const inputId = useId()
  const engine = engineTokens[control.engine]

  const handleChange = useCallback(() => {
    onChange(control.id, !control.currentValue)
  }, [control.id, control.currentValue, onChange])

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={inputId}
        className="text-[10px] text-white/50 font-medium cursor-pointer"
      >
        {control.label}
      </label>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-[9px] font-mono transition-colors',
            !control.currentValue ? 'text-white/60' : 'text-white/30',
          )}
        >
          {control.offLabel}
        </span>

        {/* Toggle switch */}
        <button
          id={inputId}
          role="switch"
          aria-checked={control.currentValue}
          onClick={handleChange}
          className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full',
            'transition-colors duration-200 focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          )}
          style={{
            backgroundColor: control.currentValue
              ? `color-mix(in srgb, ${engine.color} 50%, transparent)`
              : 'rgba(255, 255, 255, 0.08)',
          }}
        >
          <span
            className={cn(
              'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              control.currentValue ? 'translate-x-[18px]' : 'translate-x-[3px]',
            )}
          />
        </button>

        <span
          className={cn(
            'text-[9px] font-mono transition-colors',
            control.currentValue ? 'text-white/60' : 'text-white/30',
          )}
        >
          {control.onLabel}
        </span>
      </div>
    </div>
  )
}
