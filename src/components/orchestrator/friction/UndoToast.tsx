/**
 * Orchestrator Workbench v2.0 — Undo Toast
 * 72-hour undo window toast notification for executed actions.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { UndoableAction } from '@/lib/orchestrator/types'

export interface UndoToastProps {
  action: UndoableAction
  onUndo: (actionId: string) => void
  onDismiss: () => void
}

export function UndoToast({ action, onUndo, onDismiss }: UndoToastProps) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    function updateRemaining() {
      const now = Date.now()
      const expiry = new Date(action.undoExpiresAt).getTime()
      const diff = expiry - now
      if (diff <= 0) {
        setRemaining('Expired')
        return
      }
      const hours = Math.floor(diff / 3_600_000)
      const minutes = Math.floor((diff % 3_600_000) / 60_000)
      setRemaining(`${hours}h ${minutes}m remaining`)
    }

    updateRemaining()
    const interval = setInterval(updateRemaining, 60_000)
    return () => clearInterval(interval)
  }, [action.undoExpiresAt])

  if (action.undone) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border',
        'border-white/[0.08] bg-[hsl(220_20%_8%_/_0.95)] backdrop-blur-xl',
        'shadow-lg max-w-md',
      )}
    >
      <span className="text-amber-400">⏪</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/80 truncate">
          {action.action.label}
        </p>
        <p className="text-[10px] text-white/40 font-mono">{remaining}</p>
      </div>
      <button
        onClick={() => onUndo(action.id)}
        className={cn(
          'px-3 py-1 text-[11px] font-medium rounded-lg transition-colors',
          'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
        )}
      >
        Undo
      </button>
      <button
        onClick={onDismiss}
        className="text-white/30 hover:text-white/50 text-sm"
      >
        ✕
      </button>
    </motion.div>
  )
}
