/**
 * Generative UI Controls — Dispatcher
 *
 * Renders the appropriate control component based on type.
 * Used inside BentoCards to add AI-generated interactive controls
 * (sliders, toggles, dropdowns) that trigger card re-streaming.
 */

import { useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { GenerativeSlider } from './GenerativeSlider'
import { GenerativeToggle } from './GenerativeToggle'
import { GenerativeDropdown } from './GenerativeDropdown'
import type { GenerativeUIControl } from '@/lib/orchestrator/workspace/workspace-types'

export interface ControlRendererProps {
  /** Card ID these controls belong to */
  cardId: string
  /** Controls to render */
  controls: GenerativeUIControl[]
}

export function ControlRenderer({ cardId, controls }: ControlRendererProps) {
  const { dispatch } = useWorkbenchContext()

  const handleChange = useCallback(
    (controlId: string, value: unknown) => {
      dispatch({
        type: 'UPDATE_GENERATIVE_CONTROL',
        cardId,
        controlId,
        value,
      })
    },
    [cardId, dispatch],
  )

  if (controls.length === 0) return null

  return (
    <div className="mt-2 pt-2 border-t border-white/[0.04] space-y-2.5">
      {controls.map((control) => {
        switch (control.type) {
          case 'slider':
            return (
              <GenerativeSlider
                key={control.id}
                control={control}
                onChange={handleChange as (id: string, v: number) => void}
              />
            )
          case 'toggle':
            return (
              <GenerativeToggle
                key={control.id}
                control={control}
                onChange={handleChange as (id: string, v: boolean) => void}
              />
            )
          case 'dropdown':
            return (
              <GenerativeDropdown
                key={control.id}
                control={control}
                onChange={handleChange as (id: string, v: string) => void}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
