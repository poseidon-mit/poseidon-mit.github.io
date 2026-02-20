import { createElement, forwardRef, type CSSProperties, type ElementType } from 'react'
import { cn } from '../../../../lib/utils'
import type { SurfaceProps } from './Surface.schema'

const ENGINE_GLOW_COLORS = {
  protect: 'oklch(0.70 0.18 155)',
  grow: 'oklch(0.58 0.22 285)',
  execute: 'oklch(0.80 0.16 95)',
  govern: 'oklch(0.62 0.18 250)',
} as const

const PADDING_MAP = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const

export const Surface = forwardRef<HTMLElement, SurfaceProps>(
  (
    {
      variant = 'glass',
      engine,
      glow = false,
      interactive = false,
      padding = 'md',
      borderColor,
      borderWidth = 2,
      as: Tag = 'div',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const typedEngine = engine as keyof typeof ENGINE_GLOW_COLORS | undefined
    const typedPadding = padding as keyof typeof PADDING_MAP
    const glowColor = glow && typedEngine ? ENGINE_GLOW_COLORS[typedEngine] : null

    const glowShadow = glowColor
      ? `0 0 var(--ds-glow-spread) ${glowColor}`
      : undefined

    const variantClasses = cn(
      // Base shared styles
      'rounded-[var(--ds-border-radius-surface)] transition-all duration-200',

      // Glass variant
      variant === 'glass' && [
        'border border-[var(--ds-surface-border)]',
        'bg-[var(--ds-surface-bg)]',
        '[backdrop-filter:var(--ds-backdrop-filter)]',
        '[box-shadow:var(--ds-glass-inset),var(--ds-surface-shadow)]',
      ],

      // Elevated variant
      variant === 'elevated' && [
        'border border-[var(--ds-surface-border)]',
        'bg-[var(--ds-surface-bg)]',
        '[backdrop-filter:var(--ds-backdrop-filter)]',
        'shadow-[var(--ds-surface-shadow)]',
      ],

      // Sunken variant
      variant === 'sunken' && [
        'border border-[var(--ds-surface-border)]',
        'bg-[var(--ds-surface-bg)]',
        '[backdrop-filter:var(--ds-backdrop-filter)]',
        'shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08),inset_0_-1px_0_oklch(1_0_0_/_0.06)]',
      ],

      // Inset variant
      variant === 'inset' && [
        'border border-[var(--ds-surface-border)]',
        'bg-[var(--ds-surface-bg)]',
        '[backdrop-filter:var(--ds-backdrop-filter)]',
        'shadow-[inset_0_2px_4px_oklch(0_0_0_/_0.2)]',
      ],

      // Transparent variant — no background or border
      variant === 'transparent' && '',

      // Padding
      PADDING_MAP[typedPadding],

      // Interactive states
      interactive && [
        'cursor-pointer',
        'hover:brightness-110 hover:border-[oklch(1_0_0_/_0.14)] hover:scale-[1.01] hover:-translate-y-[2px]',
        'active:scale-[0.985] active:brightness-95',
      ],
    )

    const Component = Tag as ElementType
    const inlineStyle = ((rest as Record<string, unknown>).style as CSSProperties | undefined) ?? undefined

    const mergedStyle: CSSProperties | undefined = (() => {
      const style: CSSProperties = { ...(inlineStyle ?? {}) }
      if (glowShadow) {
        style.boxShadow = glowShadow
      }
      if (borderColor) {
        style.borderLeftColor = borderColor
        style.borderLeftWidth = `${borderWidth}px`
      }
      return Object.keys(style).length > 0 ? style : undefined
    })()

    return createElement(
      Component as any,
      {
        ...(rest as Record<string, unknown>),
        ref,
        className: cn(variantClasses, className),
        style: mergedStyle,
      },
      children,
    )
  },
)

Surface.displayName = 'Surface'
