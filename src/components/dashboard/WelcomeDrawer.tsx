import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Shield, TrendingUp, Zap, ChevronRight } from 'lucide-react'
import { BottomSheet } from '@/components/ui/sheet'
import { Link } from '@/router'
import { selectProtectThreats, selectExecuteActionsView, selectRecommendationsSummary } from '@/domain/poseidon-universe'

const DRAWER_KEY = 'poseidon-drawer-seen'
const SHOW_DELAY_MS = 500

interface EngineCard {
  engine: string
  color: string
  icon: typeof Shield
  headline: string
  detail: string
  href: string
}

function useEngineCards(): EngineCard[] {
  return useMemo(() => {
    const threatCount = selectProtectThreats().length
    const monthlySavings = selectRecommendationsSummary().reduce((sum, r) => sum + r.monthly, 0)
    const actionCount = selectExecuteActionsView().length

    return [
      {
        engine: 'Protect',
        color: 'var(--engine-protect)',
        icon: Shield,
        headline: `${threatCount} threats detected`,
        detail: 'Suspicious transactions flagged for review',
        href: '/protect',
      },
      {
        engine: 'Grow',
        color: 'var(--engine-grow)',
        icon: TrendingUp,
        headline: `$${monthlySavings}/mo savings found`,
        detail: 'AI-identified optimization opportunities',
        href: '/grow',
      },
      {
        engine: 'Execute',
        color: 'var(--engine-execute)',
        icon: Zap,
        headline: `${actionCount} actions ready`,
        detail: 'Review and approve to optimize',
        href: '/execute',
      },
    ]
  }, [])
}

export function WelcomeDrawer() {
  const CARDS = useEngineCards()
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DRAWER_KEY) === 'true') return
    } catch { /* noop */ }
    timerRef.current = setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const dismiss = useCallback(() => {
    setOpen(false)
    try { sessionStorage.setItem(DRAWER_KEY, 'true') } catch { /* noop */ }
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIndex(idx)
  }, [])

  return (
    <BottomSheet open={open} onDismiss={dismiss}>
      <h2 className="text-base font-semibold text-white mb-3">
        Welcome to Poseidon
      </h2>

      {/* Swipeable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-1 px-1 pb-3"
        style={{ scrollbarWidth: 'none' }}
      >
        {CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.engine}
              to={card.href}
              onClick={dismiss}
              className="snap-center shrink-0 w-[85%] rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${card.color} 20%, transparent)` }}
                >
                  <Icon size={16} style={{ color: card.color }} />
                </div>
                <span className="text-xs font-medium text-white/50">{card.engine}</span>
                <ChevronRight size={12} className="ml-auto text-white/30" />
              </div>
              <p className="text-sm font-semibold text-white">{card.headline}</p>
              <p className="text-xs text-white/50 mt-0.5">{card.detail}</p>
            </Link>
          )
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mb-3">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === activeIndex ? 'bg-white/80' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={dismiss}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 min-h-[44px] text-sm font-semibold text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all"
      >
        Start Exploring
      </button>
    </BottomSheet>
  )
}
