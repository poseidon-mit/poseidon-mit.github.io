/**
 * Card Tier System — shared visual hierarchy tokens for list screens.
 *
 * Three tiers:
 * - focus:    Critical/high-priority items — larger, prominent, tinted background
 * - standard: Default items — current card look with minor enhancements
 * - compact:  Low-priority/resolved items — dense single-row layout
 */

export type CardTier = 'focus' | 'standard' | 'compact'

export const CARD_TIER_STYLES = {
  focus: {
    padding: 'p-6 lg:p-8',
    titleSize: 'text-base md:text-lg font-semibold',
    descSize: 'text-sm text-white/55 leading-relaxed',
    metaSize: 'text-xs text-white/55',
    iconSize: 20,
    iconBoxSize: 'w-12 h-12 rounded-2xl',
    gap: 'gap-5',
    amountSize: 'text-lg font-mono font-bold',
  },
  standard: {
    padding: 'p-5 lg:p-6',
    titleSize: 'text-sm font-medium',
    descSize: 'text-xs text-white/55 leading-relaxed',
    metaSize: 'text-[10px] text-white/40',
    iconSize: 16,
    iconBoxSize: 'w-10 h-10 rounded-xl',
    gap: 'gap-4',
    amountSize: 'text-base font-mono font-bold',
  },
  compact: {
    padding: 'p-4',
    titleSize: 'text-sm font-medium',
    descSize: 'hidden',
    metaSize: 'text-[10px] text-white/40',
    iconSize: 14,
    iconBoxSize: 'w-8 h-8 rounded-lg',
    gap: 'gap-3',
    amountSize: 'text-sm font-mono font-bold',
  },
} as const satisfies Record<CardTier, {
  padding: string
  titleSize: string
  descSize: string
  metaSize: string
  iconSize: number
  iconBoxSize: string
  gap: string
  amountSize: string
}>

/** Subtle gradient tint for focus-tier cards */
export function focusGradientStyle(accentColor: string) {
  return {
    background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 6%, transparent), transparent 60%)`,
  }
}
