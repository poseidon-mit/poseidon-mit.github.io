/**
 * EmptyState — Reusable empty/no-data placeholder for engine pages.
 *
 * Shows icon + title + description + optional CTA.
 * Follows NN/g empty state pattern: headline → explanation → action.
 */

import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  accentColor?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  accentColor = '#64748B',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: `${accentColor}15` }}
      >
        <Icon size={24} style={{ color: accentColor, opacity: 0.6 }} aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
        {title}
      </h3>
      <p className="text-xs max-w-[240px]" style={{ color: '#64748B' }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-xs font-medium transition-colors hover:underline cursor-pointer"
          style={{ color: accentColor }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

EmptyState.displayName = 'EmptyState'
