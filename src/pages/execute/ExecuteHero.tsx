/**
 * ExecuteHero — Hero section + KPI grid for the Execute engine page.
 *
 * Contains the engine badge, headline, featured AI insight card, and KPI metrics.
 */

import { motion } from 'framer-motion'
import {
  Zap,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Gauge,
  ShieldOff,
  type LucideIcon,
} from 'lucide-react'
import { fadeUp, staggerContainer, staggerContainerDelayed } from '@/lib/motion-presets'
import { ViewModeToggle, CitationCard, CountUp } from '@/components/poseidon'
import { kpiData, executeCitations } from './execute-data'
import type { ViewMode } from '@/hooks/useViewMode'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { Surface, Button } from '@/design-system'

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */

interface HeroSectionProps {
  navigate: (path: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function HeroSection({ navigate, viewMode, onViewModeChange }: HeroSectionProps) {
  return (
    <motion.section
      variants={staggerContainer}
      className="flex flex-col gap-6"
    >
      {/* Engine badge + View mode toggle */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
            style={{
              borderColor: 'rgba(234,179,8,0.3)',
              background: 'rgba(234,179,8,0.08)',
              color: 'var(--engine-execute)',
            }}
          >
            <Zap size={12} />
            Execute Engine
          </span>
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} accentColor="var(--engine-execute)" />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance neon-text-amber"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          {`${DEMO_THREAD.pendingActions} actions pending review. Confidence 0.91. 2 ready to execute.`}
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          AI-recommended actions across Protect, Grow, and Govern engines. Review threshold: 0.85+
        </p>
      </motion.div>

      {/* Featured AI insight card */}
      <motion.div variants={fadeUp}>
        <CitationCard
          summary={`Block wire transfer to ${DEMO_THREAD.criticalAlert.merchant} — fraud score ${DEMO_THREAD.criticalAlert.confidence.toFixed(2)}, elevated anomaly threshold exceeded. Multi-engine risk aggregation flags immediate action required.`}
          sources={executeCitations}
          confidence={DEMO_THREAD.criticalAlert.confidence}
          accentColor="var(--engine-execute)"
          viewMode={viewMode}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            variant="glass"
            engine="execute"
            aria-label={`Approve action: Block wire transfer to ${DEMO_THREAD.criticalAlert.merchant}`}
            onClick={() => navigate('/execute/approval')}
          >
            <CheckCircle2 size={16} />
            Approve
          </Button>
          <Button
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:shadow-[0_0_12px_rgba(var(--state-critical-rgb),0.3)] active:scale-[0.98] cursor-pointer"
            variant="danger"
            aria-label={`Reject action: Block wire transfer to ${DEMO_THREAD.criticalAlert.merchant}`}
            onClick={() => navigate('/execute/approval')}
          >
            <XCircle size={16} />
            Reject
          </Button>
          <Button
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
            variant="secondary"
            engine="execute"
            onClick={() => navigate('/execute/approval')}
          >
            Review details
          </Button>
        </div>
      </motion.div>
    </motion.section>
  )
}

/* ═══════════════════════════════════════════
   KPI GRID
   ═══════════════════════════════════════════ */

/** Parse a KPI value string into a numeric part and optional suffix for CountUp. */
function parseKpiValue(value: string): { num: number; decimals: number; suffix: string } | null {
  const match = value.match(/^([\d.]+)\s*(.*)$/)
  if (!match) return null
  const num = parseFloat(match[1])
  if (isNaN(num)) return null
  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0
  const suffix = match[2] || ''
  return { num, decimals, suffix }
}

const kpiIcons: Record<string, LucideIcon> = {
  'Pending Actions': Clock,
  'Auto-approved Today': CheckCircle2,
  'Blocked Today': ShieldOff,
  'Avg Review Time': Gauge,
}

function KpiGrid({ viewMode: _viewMode }: { viewMode: ViewMode }) {
  return (
    <motion.section
      variants={staggerContainerDelayed}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      aria-label="Key performance indicators"
    >
      {kpiData.map((kpi) => {
        const parsed = parseKpiValue(kpi.value)
        const KpiIcon = kpiIcons[kpi.label]
        return (
          <motion.div key={kpi.label} variants={fadeUp} className="h-full">
            <Surface variant="glass" padding="md" className="flex flex-col gap-2 h-full">
              <span className="text-xs uppercase tracking-wider font-medium flex items-center gap-1.5" style={{ color: '#64748B' }}>
                {KpiIcon && <KpiIcon size={12} aria-hidden="true" />}
                {kpi.label}
              </span>
              <div className="flex items-end gap-2">
                <span
                  className="text-2xl md:text-3xl font-bold tabular-nums"
                  style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
                >
                  {parsed ? (
                    <>
                      <CountUp value={parsed.num} decimals={parsed.decimals} />
                      {parsed.suffix && ` ${parsed.suffix}`}
                    </>
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
                  {kpi.trend.icon === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.trend.text}
                </span>
              )}
            </Surface>
          </motion.div>
        )
      })}
    </motion.section>
  )
}

/* ═══════════════════════════════════════════
   EXPORTED COMPOSITE
   ═══════════════════════════════════════════ */

export interface ExecuteHeroProps {
  navigate: (path: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ExecuteHero({ navigate, viewMode, onViewModeChange }: ExecuteHeroProps) {
  return (
    <>
      <HeroSection navigate={navigate} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <KpiGrid viewMode={viewMode} />
    </>
  )
}

export default ExecuteHero
