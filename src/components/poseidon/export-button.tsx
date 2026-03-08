/**
 * ExportButton — Download data as CSV or JSON
 *
 * Creates a blob URL and triggers a download via a hidden anchor element.
 */

import { useCallback } from 'react'
import { Download } from 'lucide-react'

export type ExportFormat = 'csv' | 'json'

export interface ExportButtonProps {
  data: Record<string, unknown>[]
  filename: string
  format?: ExportFormat
  label?: string
  className?: string
}

function toCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return ''
  const headers = Object.keys(data[0])
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const rows = data.map((row) => headers.map((h) => escape(row[h])).join(','))
  return [headers.join(','), ...rows].join('\n')
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ExportButton({
  data,
  filename,
  format = 'csv',
  label,
  className = '',
}: ExportButtonProps) {
  const handleExport = useCallback(() => {
    if (format === 'json') {
      download(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json')
    } else {
      download(toCSV(data), `${filename}.csv`, 'text/csv')
    }
  }, [data, filename, format])

  const buttonLabel = label ?? `Export ${format.toUpperCase()}`

  return (
    <button
      type="button"
      onClick={handleExport}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium
        bg-white/5 border border-white/10 text-white/70
        hover:bg-white/10 hover:text-white/90 transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
        ${className}`}
      aria-label={buttonLabel}
    >
      <Download className="h-3.5 w-3.5" />
      {buttonLabel}
    </button>
  )
}
