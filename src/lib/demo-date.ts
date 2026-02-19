export const DEMO_PRESENTATION_DATE = '2026-03-19T10:00:00-04:00'

export type ConfidenceFormatStyle = 'decimal' | 'percent'

function normalizeDate(value: string | number | Date): Date {
  if (value instanceof Date) return value
  return new Date(value)
}

export function formatDemoTimestamp(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = normalizeDate(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  }).format(date)
}

export function formatConfidence(
  value: number,
  style: ConfidenceFormatStyle = 'decimal',
): string {
  if (!Number.isFinite(value)) return style === 'percent' ? '0%' : '0.00'

  if (style === 'percent') {
    return `${Math.round(value * 100)}%`
  }

  return value.toFixed(2)
}
