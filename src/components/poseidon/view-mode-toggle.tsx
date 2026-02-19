/**
 * ViewModeToggle — 3-tier pill toggle for Progressive Disclosure.
 *
 * Renders a segmented control with Glance / Detail / Deep buttons.
 * Uses engine accent color for active state.
 */
import { Eye, LayoutGrid, Database, type LucideIcon } from 'lucide-react'
import type { ViewMode } from '@/hooks/useViewMode'

export interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  accentColor?: string  // engine color for active state, default '#00F0FF'
}

const modes: { key: ViewMode; label: string; Icon: LucideIcon }[] = [
  { key: 'glance', label: 'Glance', Icon: Eye },
  { key: 'detail', label: 'Detail', Icon: LayoutGrid },
  { key: 'deep', label: 'Deep', Icon: Database },
]

export function ViewModeToggle({ value, onChange, accentColor = '#00F0FF' }: ViewModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-xl border p-1"
      style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
      role="radiogroup"
      aria-label="View mode"
    >
      {modes.map(({ key, label, Icon }) => {
        const active = value === key
        return (
          <button
            key={key}
            role="radio"
            aria-checked={active}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer"
            style={{
              background: active ? `${accentColor}14` : 'transparent',
              color: active ? accentColor : '#64748B',
              minHeight: '32px',
            }}
            onClick={() => onChange(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

ViewModeToggle.displayName = 'ViewModeToggle'
