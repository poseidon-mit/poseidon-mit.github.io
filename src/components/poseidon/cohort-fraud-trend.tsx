/**
 * CohortFraudTrend — facade component for platform-level fraud trend display.
 *
 * Two variants:
 * - compact: Landing hero proof cards (label + percent + period, no factors)
 * - detailed: Protect sidebar (full heading, factors list)
 */

export interface CohortFraudTrendProps {
  label: string
  changePercent: number
  period: string
  factors: Array<{ label: string; value: number }>
  /** 'compact' for Landing proof cards, 'detailed' for Protect sidebar (default) */
  variant?: 'compact' | 'detailed'
  accentColor?: string
}

export function CohortFraudTrend({
  label,
  changePercent,
  period,
  factors,
  variant = 'detailed',
  accentColor = 'var(--engine-protect)',
}: CohortFraudTrendProps) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-white/70 leading-snug">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold" style={{ color: accentColor }}>
            {changePercent > 0 ? '+' : ''}{changePercent}%
          </span>
          <span className="text-[10px] text-white/30">{period}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
        Platform Fraud Trends
      </h3>
      <p className="text-sm text-white/80 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-mono font-bold" style={{ color: accentColor }}>
          {changePercent > 0 ? '+' : ''}{changePercent}%
        </span>
        <span className="text-xs text-white/40">{period}</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {factors.map((f, i) => (
          <li key={i} className="text-xs text-white/40 flex items-start gap-2">
            <span className="text-white/20 mt-0.5 shrink-0">·</span>
            <span>{f.label} ({f.value.toFixed(2)})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
