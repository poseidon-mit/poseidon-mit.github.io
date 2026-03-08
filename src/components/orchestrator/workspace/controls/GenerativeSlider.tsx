/**
 * Generative UI Controls — Slider
 *
 * Range slider rendered inside BentoCards for numeric adjustments.
 * Engine-colored track. Triggers re-streaming of dependent cards.
 *
 * Built on native HTML range input + Tailwind styling
 * (no @radix-ui/react-slider dependency needed).
 */

import { useCallback, useId } from 'react'
import { cn } from '@/lib/utils'
import { engineTokens } from '@/lib/engine-tokens'
import type { GenerativeSliderControl } from '@/lib/orchestrator/workspace/workspace-types'

export interface GenerativeSliderProps {
  control: GenerativeSliderControl
  onChange: (controlId: string, value: number) => void
}

export function GenerativeSlider({ control, onChange }: GenerativeSliderProps) {
  const inputId = useId()
  const engine = engineTokens[control.engine]
  const pct = ((control.currentValue - control.min) / (control.max - control.min)) * 100

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(control.id, parseFloat(e.target.value))
    },
    [control.id, onChange],
  )

  const displayValue = control.formatLabel
    ? control.formatLabel(control.currentValue)
    : `${control.currentValue}${control.unit}`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-[10px] text-white/50 font-medium"
        >
          {control.label}
        </label>
        <span className="text-[11px] font-mono font-bold tabular-nums text-white/70">
          {displayValue}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/[0.06]" />

        {/* Filled track */}
        <div
          className="absolute left-0 h-1.5 rounded-full transition-all duration-150"
          style={{
            width: `${pct}%`,
            backgroundColor: `color-mix(in srgb, ${engine.color} 50%, transparent)`,
          }}
        />

        {/* Native range input (transparent, positioned above) */}
        <input
          id={inputId}
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={control.currentValue}
          onChange={handleChange}
          className={cn(
            'relative w-full h-5 appearance-none bg-transparent cursor-pointer z-10',
            // Thumb styling via Tailwind arbitrary
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
            // Firefox
            '[&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-transparent',
            '[&::-moz-range-track]:bg-transparent',
          )}
          style={{
            // @ts-expect-error -- CSS custom property for thumb border
            '--tw-ring-color': engine.color,
          }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex items-center justify-between text-[9px] text-white/30 font-mono tabular-nums">
        <span>{control.min}{control.unit}</span>
        <span>{control.max}{control.unit}</span>
      </div>
    </div>
  )
}
