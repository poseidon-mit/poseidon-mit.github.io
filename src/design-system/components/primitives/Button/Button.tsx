import { forwardRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ButtonProps } from './Button.schema'
import { creatorStudioSpringPress } from '../../../../lib/motion-presets'

const enginePrimary: Record<string, string> = {
  dashboard: 'bg-gradient-to-r from-cyan-300 to-cyan-200 text-slate-950 hover:brightness-110',
  protect: 'bg-gradient-to-r from-emerald-400 to-green-300 text-slate-950 hover:brightness-110',
  grow: 'bg-gradient-to-r from-violet-400 to-fuchsia-300 text-slate-950 hover:brightness-110',
  execute: 'bg-gradient-to-r from-amber-300 to-yellow-200 text-slate-950 hover:brightness-110',
  govern: 'bg-gradient-to-r from-blue-400 to-sky-300 text-slate-950 hover:brightness-110',
  default: 'bg-gradient-to-r from-cyan-300 to-cyan-200 text-slate-950 hover:brightness-110',
}

const engineSecondary: Record<string, string> = {
  dashboard: 'border-cyan-400/55 text-cyan-200',
  protect: 'border-emerald-400/50 text-emerald-300',
  grow: 'border-violet-400/50 text-violet-300',
  execute: 'border-amber-400/50 text-amber-300',
  govern: 'border-blue-400/50 text-blue-300',
  default: 'border-cyan-400/55 text-cyan-200',
}

const engineGlass: Record<string, string> = {
  dashboard: 'border-cyan-300/25 bg-cyan-400/12 hover:bg-cyan-300/20 hover:border-cyan-200/45 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]',
  protect: 'border-emerald-300/25 bg-emerald-400/12 hover:bg-emerald-300/20 hover:border-emerald-200/45 hover:shadow-[0_0_24px_rgba(52,211,153,0.2)]',
  grow: 'border-violet-300/25 bg-violet-400/12 hover:bg-violet-300/20 hover:border-violet-200/45 hover:shadow-[0_0_24px_rgba(167,139,250,0.2)]',
  execute: 'border-amber-300/25 bg-amber-400/12 hover:bg-amber-300/20 hover:border-amber-200/45 hover:shadow-[0_0_24px_rgba(252,211,77,0.2)]',
  govern: 'border-blue-300/25 bg-blue-400/12 hover:bg-blue-300/20 hover:border-blue-200/45 hover:shadow-[0_0_24px_rgba(96,165,250,0.2)]',
  default: 'border-cyan-300/25 bg-cyan-400/12 hover:bg-cyan-300/20 hover:border-cyan-200/45 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]',
}

/* ── Size tokens ───────────────────────────────────────────────── */
const sizeMap: Record<string, string> = {
  sm: 'h-8 min-h-[44px] px-3 text-sm gap-1.5',
  md: 'h-10 min-h-[44px] px-4 text-sm gap-2',
  lg: 'h-12 min-h-[44px] px-6 text-base gap-2.5',
}

/* ── Spinner ───────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

/* ── Button ────────────────────────────────────────────────────── */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    engine,
    loading = false,
    springPress = true,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  const key = engine ?? 'dashboard'
  const isDisabled = disabled || loading

  const variantClass: Record<string, string> = {
    primary: clsx(enginePrimary[key]),
    secondary: clsx('bg-transparent border hover:bg-white/5', engineSecondary[key]),
    ghost: clsx('bg-transparent border-none hover:bg-white/5', engineSecondary[key]),
    danger:    'bg-red-600 text-white hover:bg-red-500',
    outline:   'bg-transparent border border-white/20 text-white hover:bg-white/5',
    glass: clsx(
      'border text-white [backdrop-filter:var(--ds-backdrop-filter)]',
      engineGlass[key],
    ),
  }

  const classes = twMerge(
    clsx(
      /* base */
      'inline-flex items-center justify-center rounded-full font-medium',
      'transition-all duration-150 select-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
      /* variant + size */
      variantClass[variant],
      sizeMap[size],
      /* state */
      fullWidth && 'w-full',
      isDisabled && 'pointer-events-none opacity-50',
    ),
    className,
  )

  const iconEl = loading ? <Spinner /> : (icon as ReactNode)
  const hasIcon = !!iconEl

  return (
    <motion.div
      className={fullWidth ? 'w-full' : 'inline-block'}
      whileHover={springPress && !isDisabled ? { scale: 1.02 } : undefined}
      whileTap={springPress && !isDisabled ? { scale: 0.98 } : undefined}
      transition={springPress ? creatorStudioSpringPress : undefined}
    >
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classes}
        {...rest}
      >
        {hasIcon && iconPosition === 'left' && iconEl}
        {children}
        {hasIcon && iconPosition === 'right' && iconEl}
      </button>
    </motion.div>
  )
})
