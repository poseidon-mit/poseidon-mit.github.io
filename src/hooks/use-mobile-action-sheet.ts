import { useSyncExternalStore } from 'react'

const LG_BREAKPOINT = 1024

function subscribe(cb: () => void) {
  const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

function getSnapshot() {
  return window.innerWidth < LG_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

/** Returns true when viewport < 1024px (Tailwind lg breakpoint). */
export function useIsMobileSheet(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
