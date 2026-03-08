import { RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UndoBannerProps {
  actionId: string
  actionTitle?: string
  onUndo: () => void
  onDismiss: () => void
}

export function UndoBanner({ actionId, actionTitle, onUndo, onDismiss }: UndoBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-5 py-3 border mb-4',
        'border-amber-500/30 bg-amber-500/10 engine-border-execute engine-bg-execute',
      )}
      role="status"
      aria-live="polite"
    >
      <RotateCcw size={16} className="text-amber-400 engine-text-execute shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-300 engine-text-execute">Action queued for execution · 72-hour undo window</p>
        {actionTitle && (
          <p className="text-xs text-amber-400/70 engine-text-execute truncate mt-0.5">
            <span className="font-mono">{actionId}</span> · {actionTitle}
          </p>
        )}
      </div>
      <button
        onClick={onUndo}
        className="shrink-0 text-xs font-semibold text-amber-300 engine-text-execute border border-amber-500/40 engine-border-execute px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-colors cursor-pointer"
      >
        Undo
      </button>
      <button
        onClick={onDismiss}
        className="shrink-0 text-amber-400/60 engine-text-execute hover:text-amber-400 transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}
