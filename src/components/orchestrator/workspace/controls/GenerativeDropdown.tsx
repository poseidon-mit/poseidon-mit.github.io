/**
 * Generative UI Controls — Dropdown
 *
 * Select control rendered inside BentoCards.
 * Engine-colored accent on active option.
 *
 * Built on native HTML select + Tailwind styling.
 */

import { useCallback, useId } from 'react'
import { cn } from '@/lib/utils'
import { engineTokens } from '@/lib/engine-tokens'
import type { GenerativeDropdownControl } from '@/lib/orchestrator/workspace/workspace-types'

export interface GenerativeDropdownProps {
  control: GenerativeDropdownControl
  onChange: (controlId: string, value: string) => void
}

export function GenerativeDropdown({ control, onChange }: GenerativeDropdownProps) {
  const selectId = useId()
  const engine = engineTokens[control.engine]

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(control.id, e.target.value)
    },
    [control.id, onChange],
  )

  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={selectId}
        className="text-[10px] text-white/50 font-medium flex-shrink-0"
      >
        {control.label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={control.currentValue}
          onChange={handleChange}
          className={cn(
            'appearance-none text-[11px] font-mono text-white/70',
            'bg-white/[0.04] border border-white/[0.08] rounded-lg',
            'px-2.5 py-1.5 pr-7',
            'cursor-pointer transition-colors',
            'hover:bg-white/[0.06] hover:border-white/[0.12]',
            'focus:outline-none focus:ring-1',
          )}
          style={{
            // @ts-expect-error -- CSS custom property
            '--tw-ring-color': `color-mix(in srgb, ${engine.color} 50%, transparent)`,
          }}
        >
          {control.options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-gray-900 text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="text-white/30"
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
