import { useState, useEffect } from 'react'
import { DISMISSED_ALERTS_KEY } from './protect-data'

const DISMISS_EVENT = 'poseidon:alert-dismissed'

function loadDismissed(): Set<string> {
  try { return new Set<string>(JSON.parse(localStorage.getItem(DISMISSED_ALERTS_KEY) || '[]')) }
  catch { return new Set<string>() }
}

export function useDismissedAlerts() {
  const [dismissed, setDismissed] = useState(loadDismissed)

  // Sync with other instances (Sidebar, AuthenticatedLayout) and Reset Demo via custom event
  useEffect(() => {
    const handler = () => setDismissed(loadDismissed())
    window.addEventListener(DISMISS_EVENT, handler)
    return () => window.removeEventListener(DISMISS_EVENT, handler)
  }, [])

  const dismiss = (id: string) => {
    const prev: string[] = JSON.parse(localStorage.getItem(DISMISSED_ALERTS_KEY) || '[]')
    if (!prev.includes(id)) {
      localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify([...prev, id]))
    }
    setDismissed(prev => new Set([...prev, id]))
    window.dispatchEvent(new CustomEvent(DISMISS_EVENT))
  }

  return { dismissed, dismiss }
}
