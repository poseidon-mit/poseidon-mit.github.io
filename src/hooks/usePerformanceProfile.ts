import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

export type PerformanceProfile = 'full' | 'lite' | 'static'

interface NavigatorConnectionLike {
  effectiveType?: string
  saveData?: boolean
}

interface DeviceSignals {
  deviceMemory: number | null
  hardwareConcurrency: number | null
  saveData: boolean
  effectiveType: string | null
}

export interface PerformanceProfileResult {
  profile: PerformanceProfile
  allowBackdrop: boolean
  allowContinuousAnimation: boolean
  allowHeavyBlur: boolean
  allowHoverEnhancements: boolean
  allowMarquee: boolean
  coarsePointer: boolean
  hoverNone: boolean
  prefersReducedMotion: boolean
  isPageVisible: boolean
}

function readDeviceSignals(): DeviceSignals {
  if (typeof window === 'undefined') {
    return {
      deviceMemory: null,
      hardwareConcurrency: null,
      saveData: false,
      effectiveType: null,
    }
  }

  const nav = window.navigator as Navigator & {
    connection?: NavigatorConnectionLike
    deviceMemory?: number
  }

  return {
    deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    hardwareConcurrency:
      typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null,
    saveData: nav.connection?.saveData === true,
    effectiveType: nav.connection?.effectiveType ?? null,
  }
}

export function usePerformanceProfile(): PerformanceProfileResult {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const hoverNone = useMediaQuery('(hover: none)')
  const [signals, setSignals] = useState<DeviceSignals>(() => readDeviceSignals())
  const [isPageVisible, setIsPageVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState !== 'hidden',
  )

  useEffect(() => {
    setSignals(readDeviceSignals())

    if (typeof document === 'undefined') return undefined

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState !== 'hidden')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return useMemo(() => {
    const lowMemory = (signals.deviceMemory ?? Infinity) <= 4
    const lowCpu = (signals.hardwareConcurrency ?? Infinity) <= 4
    const slowConnection =
      signals.effectiveType === 'slow-2g' ||
      signals.effectiveType === '2g' ||
      signals.effectiveType === '3g'

    const profile: PerformanceProfile =
      prefersReducedMotion || signals.saveData
        ? 'static'
        : coarsePointer || hoverNone || lowMemory || lowCpu || slowConnection
          ? 'lite'
          : 'full'

    const allowHoverEnhancements =
      profile === 'full' && !coarsePointer && !hoverNone && isPageVisible

    return {
      profile,
      allowBackdrop: profile !== 'static',
      allowContinuousAnimation: profile === 'full' && isPageVisible,
      allowHeavyBlur: profile === 'full',
      allowHoverEnhancements,
      allowMarquee: allowHoverEnhancements,
      coarsePointer,
      hoverNone,
      prefersReducedMotion,
      isPageVisible,
    }
  }, [
    coarsePointer,
    hoverNone,
    isPageVisible,
    prefersReducedMotion,
    signals.deviceMemory,
    signals.effectiveType,
    signals.hardwareConcurrency,
    signals.saveData,
  ])
}
