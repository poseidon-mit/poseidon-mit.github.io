/**
 * SeverityBadge — Threat severity indicator for the Protect engine.
 *
 * Uses 3-channel encoding (color + shape + text) per PatternFly guidelines.
 */

import { AlertOctagon, AlertTriangle, Info, type LucideIcon } from 'lucide-react'

export type Severity = 'critical' | 'warning' | 'info'

export interface SeverityBadgeProps {
  severity: Severity
}

const config: Record<Severity, { bg: string; border: string; color: string; label: string; icon: LucideIcon }> = {
  critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#EF4444', label: 'Critical', icon: AlertOctagon },
  warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#F59E0B', label: 'Warning', icon: AlertTriangle },
  info: { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)', color: '#38BDF8', label: 'Info', icon: Info },
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const c = config[severity]
  const Icon = c.icon
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      <Icon size={11} aria-hidden="true" />
      {c.label}
    </span>
  )
}

SeverityBadge.displayName = 'SeverityBadge'
