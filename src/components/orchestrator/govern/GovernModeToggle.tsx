/**
 * Orchestrator Workbench v2.0 — Govern Mode Toggle
 * Toggle between Standard (Cyan) and Govern (Deep Blue) themes.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'

export function GovernModeToggle() {
  const { state, dispatch } = useWorkbenchContext()
  const isGovern = state.themeMode.mode === 'govern'

  return (
    <button
      onClick={() => dispatch({ type: 'SET_THEME_MODE', mode: isGovern ? 'standard' : 'govern' })}
      className={cn(
        'relative flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[11px] font-medium',
        isGovern
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
          : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/70',
      )}
      title={isGovern ? 'Switch to Standard Mode' : 'Switch to Govern Mode'}
    >
      <motion.span
        animate={{ rotate: isGovern ? 0 : -15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        🏛
      </motion.span>
      <span>{isGovern ? 'Govern Mode' : 'Standard'}</span>
      {isGovern && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-400"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </button>
  )
}
