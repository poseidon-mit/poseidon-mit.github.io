import { useMemo } from 'react'
import { DISMISSED_ALERTS_KEY } from './protect-data'

export function useDismissedAlerts() {
  const dismissed = useMemo(() => {
    try { return new Set<string>(JSON.parse(localStorage.getItem(DISMISSED_ALERTS_KEY) || '[]')) }
    catch { return new Set<string>() }
  }, [])

  const dismiss = (id: string) => {
    const prev: string[] = JSON.parse(localStorage.getItem(DISMISSED_ALERTS_KEY) || '[]')
    if (!prev.includes(id)) localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify([...prev, id]))
  }

  return { dismissed, dismiss }
}
