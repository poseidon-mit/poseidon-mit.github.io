import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { DSToast } from '@/design-system'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastInput {
  message: string
  variant?: ToastVariant
  durationMs?: number
}

interface ToastContextValue {
  showToast: (input: ToastInput) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => '',
  dismissToast: () => {},
  clearToasts: () => {},
})

function createToastId() {
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timerId = timersRef.current.get(id)
    if (timerId) {
      window.clearTimeout(timerId)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    ({ message, variant = 'info', durationMs = 4000 }: ToastInput) => {
      const id = createToastId()
      setToasts((prev) => [{ id, message, variant }, ...prev].slice(0, 3))

      const timerId = window.setTimeout(() => {
        dismissToast(id)
      }, durationMs)
      timersRef.current.set(id, timerId)

      return id
    },
    [dismissToast],
  )

  const clearToasts = useCallback(() => {
    for (const timerId of timersRef.current.values()) {
      window.clearTimeout(timerId)
    }
    timersRef.current.clear()
    setToasts([])
  }, [])

  const contextValue = useMemo<ToastContextValue>(
    () => ({ showToast, dismissToast, clearToasts }),
    [showToast, dismissToast, clearToasts],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="pointer-events-none fixed right-3 top-3 z-[var(--z-toast)] flex w-[min(92vw,420px)] flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <DSToast
              variant={toast.variant}
              message={toast.message}
              onDismiss={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext(): ToastContextValue {
  return useContext(ToastContext)
}
