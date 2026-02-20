import { useMemo } from 'react'
import { FlaskConical } from 'lucide-react'
import { useRouter } from '@/router'
import { getRouteUXMeta } from '@/router/lazyRoutes'

const HIDDEN_ROUTES = new Set(['/404'])

export function DemoModeBanner() {
  const { path } = useRouter()

  const meta = useMemo(() => getRouteUXMeta(path), [path])

  if (HIDDEN_ROUTES.has(path)) return null

  return (
    <aside
      className="pointer-events-none fixed bottom-3 left-3 z-[var(--z-toast)] max-w-[min(92vw,460px)] rounded-xl border border-cyan-400/35 bg-[rgba(2,6,23,0.78)] px-3 py-2 text-cyan-100 backdrop-blur"
      role="status"
      aria-live="polite"
      aria-label="Demo mode active"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
        Demo Mode · Simulated Data
      </div>
      {meta?.first5sMessage ? (
        <p className="mt-1 hidden text-[11px] text-cyan-100/85 md:block">{meta.first5sMessage}</p>
      ) : null}
    </aside>
  )
}

export default DemoModeBanner
