/**
 * BentoGrid — Responsive CSS Grid with Surface items for dashboard layouts.
 *
 * Provides variable-width cells via colSpan/rowSpan on BentoItem.
 */
import { cn } from '@/lib/utils'
import { Surface } from '@/design-system'

export interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(160px,auto)]', className)}>
      {children}
    </div>
  )
}

BentoGrid.displayName = 'BentoGrid'

/* ── BentoItem ── */

const colSpanClasses: Record<number, string> = {
  1: '',
  2: 'md:col-span-2',
  3: 'md:col-span-2 lg:col-span-3',
}

const rowSpanClasses: Record<number, string> = {
  1: '',
  2: 'row-span-2',
}

export interface BentoItemProps {
  children: React.ReactNode
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
  className?: string
}

export function BentoItem({ children, colSpan = 1, rowSpan = 1, className }: BentoItemProps) {
  return (
    <Surface variant="glass" padding="none" className={cn(colSpanClasses[colSpan], rowSpanClasses[rowSpan], className)}>
      {children}
    </Surface>
  )
}

BentoItem.displayName = 'BentoItem'
