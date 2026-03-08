/**
 * Orchestrator Workspace v5.0 — Autonomy Dial
 *
 * 3-position horizontal Radix Slider: Copilot ↔ Balanced ↔ Autonomous.
 * Dispatches SET_AUTONOMY_LEVEL with the corresponding AutonomyConfig preset.
 *
 * Mounted in WorkspaceHeader.
 */

import { useCallback, useMemo } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { AUTONOMY_PRESETS, AUTONOMY_LABELS } from '@/lib/orchestrator/workspace/v5/autonomy-engine'
import type { AutonomyLevel } from '@/lib/orchestrator/workspace/v5/v5-types'

const LEVELS: AutonomyLevel[] = ['copilot', 'balanced', 'autonomous']

export function AutonomyDial() {
  const { state, dispatch } = useWorkbenchContext()
  const currentLevel = state.workspace.v5?.autonomy.level ?? 'balanced'
  const currentIndex = LEVELS.indexOf(currentLevel)

  const handleValueChange = useCallback(
    (value: number[]) => {
      const idx = value[0]
      const level = LEVELS[idx]
      if (level && level !== currentLevel) {
        dispatch({
          type: 'SET_AUTONOMY_LEVEL',
          level,
          config: AUTONOMY_PRESETS[level],
        })
      }
    },
    [dispatch, currentLevel],
  )

  const label = useMemo(
    () => AUTONOMY_LABELS[currentLevel],
    [currentLevel],
  )

  return (
    <div className="flex items-center gap-2">
      {/* Compact label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentLevel}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'text-[10px] font-mono font-medium min-w-[60px] text-right',
            currentLevel === 'copilot' && 'text-blue-400',
            currentLevel === 'balanced' && 'text-white/50',
            currentLevel === 'autonomous' && 'text-amber-400',
          )}
          title={label.description}
        >
          {label.label.toUpperCase()}
        </motion.span>
      </AnimatePresence>

      {/* Slider */}
      <Slider.Root
        className="relative flex items-center w-[72px] h-5 select-none touch-none"
        value={[currentIndex]}
        min={0}
        max={2}
        step={1}
        onValueChange={handleValueChange}
        aria-label="Autonomy Level"
      >
        <Slider.Track className="relative h-[3px] w-full rounded-full bg-white/[0.08]">
          <Slider.Range
            className={cn(
              'absolute h-full rounded-full transition-colors duration-200',
              currentLevel === 'copilot' && 'bg-blue-400/40',
              currentLevel === 'balanced' && 'bg-white/20',
              currentLevel === 'autonomous' && 'bg-amber-400/40',
            )}
          />
        </Slider.Track>

        <Slider.Thumb
          className={cn(
            'block w-3.5 h-3.5 rounded-full border-2 transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-black',
            currentLevel === 'copilot' && 'bg-blue-400 border-blue-400/60 shadow-[0_0_8px_rgba(59,130,246,0.4)] focus-visible:ring-blue-400/50',
            currentLevel === 'balanced' && 'bg-white/60 border-white/30 focus-visible:ring-white/30',
            currentLevel === 'autonomous' && 'bg-amber-400 border-amber-400/60 shadow-[0_0_8px_rgba(234,179,8,0.4)] focus-visible:ring-amber-400/50',
          )}
        />
      </Slider.Root>

      {/* Step dots */}
      <div className="flex items-center gap-[6px] ml-[-2px]" aria-hidden>
        {LEVELS.map((level, i) => (
          <div
            key={level}
            className={cn(
              'w-1 h-1 rounded-full transition-colors',
              i <= currentIndex ? 'bg-white/30' : 'bg-white/[0.08]',
            )}
          />
        ))}
      </div>
    </div>
  )
}
