/**
 * GrowHero — Hero section + KPI grid for the Grow engine page.
 *
 * Contains: engine badge, headline, featured AI insight card, and KPI grid.
 */

import { motion } from 'framer-motion'
import { TrendingUp, Target, ArrowUpRight, Wallet, Gauge, type LucideIcon } from 'lucide-react'
import { fadeUp, staggerContainer, staggerContainerDelayed } from '@/lib/motion-presets'
import { GlassCard, ViewModeToggle, CitationCard, CountUp } from '@/components/poseidon'
import type { ViewMode } from '@/hooks/useViewMode'
import { kpiData, growCitations } from './grow-data'

/* ── Props ── */

interface GrowHeroProps {
  navigate: (path: string) => void
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

/* ── Hero Section ── */

export function HeroSection({ navigate, viewMode = 'detail', onViewModeChange }: GrowHeroProps) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Engine badge + view mode toggle */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
            style={{
              borderColor: 'rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.08)',
              color: '#8B5CF6',
            }}
          >
            <TrendingUp size={12} />
            Grow Engine
          </span>
          {onViewModeChange && (
            <ViewModeToggle value={viewMode} onChange={onViewModeChange} accentColor="#8B5CF6" />
          )}
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance neon-text-violet"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          3 active goals. Confidence 0.89. On track for 2 of 3.
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          AI-driven forecasts and optimization scenarios. Net worth growth: +$12.4k this month.
        </p>
      </motion.div>

      {/* Featured AI insight card */}
      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <CitationCard
          summary="Retire by 2045 — increase monthly contributions by $420 to stay on track. Monte Carlo simulation shows 89% probability of achieving target with this adjustment."
          sources={growCitations}
          confidence={0.89}
          accentColor="#8B5CF6"
          viewMode={viewMode}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              color: '#ffffff',
              minHeight: '44px',
            }}
            aria-label="Review growth scenarios"
            onClick={() => navigate('/grow/scenarios')}
          >
            <Target size={16} />
            Review scenarios
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
            onClick={() => navigate('/grow/goal')}
          >
            Adjust goal
          </button>
        </div>
      </motion.div>
    </motion.section>
  )
}

/* ── KPI Grid ── */

interface KpiGridProps {
  viewMode?: ViewMode
}

const kpiIcons: Record<string, LucideIcon> = {
  'Net Worth': Wallet,
  'Goal Progress': Target,
  'Projected Growth': TrendingUp,
  'Risk-adjusted Return': Gauge,
}

export function KpiGrid({ viewMode = 'detail' }: KpiGridProps) {
  return (
    <motion.section
      variants={staggerContainerDelayed}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      aria-label="Key performance indicators"
    >
      {kpiData.map((kpi) => {
        const KpiIcon = kpiIcons[kpi.label]
        return (
          <motion.div key={kpi.label} variants={fadeUp} className="h-full">
            <GlassCard className="flex flex-col gap-2 h-full">
              <span className="text-xs uppercase tracking-wider font-medium flex items-center gap-1.5" style={{ color: '#64748B' }}>
                {KpiIcon && <KpiIcon size={12} aria-hidden="true" />}
                {kpi.label}
              </span>
              <div className="flex items-end gap-2">
                <span
                  className="text-2xl md:text-3xl font-bold tabular-nums"
                  style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
                >
                  {viewMode !== 'glance' && kpi.numeric ? (
                    <CountUp
                      value={kpi.numeric.value}
                      decimals={kpi.numeric.decimals ?? 0}
                      prefix={kpi.numeric.prefix ?? ''}
                      suffix={kpi.numeric.suffix ?? ''}
                    />
                  ) : (
                    kpi.value
                  )}
                </span>
                {kpi.badge && (
                  <span
                    className="mb-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: kpi.badge.bg, color: kpi.badge.color }}
                  >
                    {kpi.badge.text}
                  </span>
                )}
              </div>
              {kpi.trend && (
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: kpi.trend.color }}>
                  <ArrowUpRight size={12} />
                  {kpi.trend.text}
                </span>
              )}
            </GlassCard>
          </motion.div>
        )
      })}
    </motion.section>
  )
}
