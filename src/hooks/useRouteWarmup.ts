import { useEffect, useRef } from 'react'
import { useRouter } from '@/router'
import { APP_SHELL_WARMUP_ROUTES } from '@/router/app-shell-routes'
import type { RoutePath } from '@/router/lazyRoutes'

interface NavigatorConnectionLike {
  effectiveType?: string
  saveData?: boolean
}

function shouldSkipWarmup(): boolean {
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return true
  if (typeof window === 'undefined') return true

  const nav = window.navigator as Navigator & {
    connection?: NavigatorConnectionLike
    deviceMemory?: number
  }

  const slowConnection =
    nav.connection?.effectiveType === 'slow-2g' ||
    nav.connection?.effectiveType === '2g' ||
    nav.connection?.effectiveType === '3g'
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4

  return nav.connection?.saveData === true || slowConnection || lowMemory
}

export function useRouteWarmup(currentPath: string) {
  const { prefetch } = useRouter()
  const warmedRef = useRef(false)

  useEffect(() => {
    if (warmedRef.current) return
    if (shouldSkipWarmup()) return
    warmedRef.current = true

    const queue = APP_SHELL_WARMUP_ROUTES.filter((route) => route !== currentPath) as RoutePath[]

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }

    let cancelled = false
    const handles: number[] = []

    const schedule = (task: () => void) => {
      if (typeof idleWindow.requestIdleCallback === 'function') {
        const handle = idleWindow.requestIdleCallback(
          () => {
            if (!cancelled) task()
          },
          { timeout: 1500 },
        )
        handles.push(handle)
        return
      }

      const handle = window.setTimeout(() => {
        if (!cancelled) task()
      }, 120)
      handles.push(handle)
    }

    const warmNext = (index: number) => {
      if (cancelled || index >= queue.length || document.visibilityState === 'hidden') return

      schedule(() => {
        void prefetch(queue[index]).finally(() => {
          warmNext(index + 1)
        })
      })
    }

    warmNext(0)

    return () => {
      cancelled = true
      handles.forEach((handle) => {
        if (typeof idleWindow.cancelIdleCallback === 'function') {
          idleWindow.cancelIdleCallback(handle)
        } else {
          window.clearTimeout(handle)
        }
      })
    }
  }, [currentPath, prefetch])
}
