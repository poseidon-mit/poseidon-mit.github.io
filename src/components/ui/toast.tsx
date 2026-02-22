import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastProps {
    id?: string
    message: string
    variant?: ToastVariant
    onDismiss?: () => void
    className?: string
}

const variantsConfig = {
    info: { icon: Info, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
    success: { icon: CheckCircle2, color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/10' },
    warning: { icon: AlertCircle, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
    error: { icon: XCircle, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' },
}

export function Toast({ message, variant = 'info', onDismiss, className }: ToastProps) {
    const config = variantsConfig[variant]
    const Icon = config.icon

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            role="status"
            className={cn(
                'group relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-md',
                'bg-[#050508]/80',
                config.border,
                className
            )}
        >
            <div className={cn('absolute inset-0 opacity-20', config.bg)} />

            <Icon className={cn('relative z-10 size-5 shrink-0', config.color)} />
            <p className="relative z-10 flex-1 text-sm font-medium text-slate-100">{message}</p>

            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="relative z-10 shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                    aria-label="Close"
                >
                    <X className="size-4 text-slate-300" />
                </button>
            )}
        </motion.div>
    )
}
