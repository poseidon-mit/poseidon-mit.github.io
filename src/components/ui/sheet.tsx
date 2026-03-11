import { useCallback, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ─── Side Drawer (left slide-in) ─────────────────────── */

interface SideDrawerProps {
  open: boolean
  onDismiss: () => void
  children: ReactNode
  className?: string
}

const DRAG_X_CLOSE_THRESHOLD = 80

export function SideDrawer({ open, onDismiss, children, className = '' }: SideDrawerProps) {
  const prefersReduced = useReducedMotionSafe()

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -DRAG_X_CLOSE_THRESHOLD) onDismiss()
    },
    [onDismiss],
  )

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onDismiss])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            className="fixed inset-0 z-[200] bg-black/30"
            onClick={onDismiss}
            aria-hidden="true"
          />
          <motion.div
            key="drawer-content"
            role="dialog"
            aria-modal="true"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 300, damping: 30 }
            }
            drag="x"
            dragConstraints={{ right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed top-0 left-0 bottom-0 z-[210] w-[280px] bg-[#0E0E14] border-r border-white/[0.06] shadow-2xl overflow-y-auto ${className}`}
          >
            <button
              onClick={onDismiss}
              className="absolute top-4 right-3 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface BottomSheetProps {
  open: boolean
  onDismiss: () => void
  children: ReactNode
  className?: string
  /** When true, backdrop tap, drag-down, Escape, and X button are all disabled. */
  persistent?: boolean
}

const DRAG_CLOSE_THRESHOLD = 80

export function BottomSheet({ open, onDismiss, children, className = '', persistent = false }: BottomSheetProps) {
  const prefersReduced = useReducedMotionSafe()

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!persistent && info.offset.y > DRAG_CLOSE_THRESHOLD) onDismiss()
    },
    [onDismiss, persistent],
  )

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) onDismiss()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onDismiss])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — tappable to dismiss (unless persistent), does NOT trap focus */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            className="fixed inset-0 z-[200] bg-black/30"
            onClick={persistent ? undefined : onDismiss}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet-content"
            role="dialog"
            aria-modal={persistent ? "true" : "false"}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { type: 'spring', stiffness: 300, damping: 30 }
            }
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-[210] mx-auto max-w-lg rounded-t-3xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl max-h-[75vh] lg:max-h-[520px] overflow-hidden lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:rounded-3xl ${className}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {/* Close button — hidden in persistent mode */}
            {!persistent && (
              <button
                onClick={onDismiss}
                className="absolute top-3 right-3 p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}

            <div className="px-5 pb-24 lg:pb-6 overflow-y-auto max-h-[calc(75vh-3rem)] lg:max-h-[calc(520px-3rem)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
