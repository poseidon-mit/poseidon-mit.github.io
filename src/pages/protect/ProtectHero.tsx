/**
 * ProtectHero — Hero section + KPI grid for the Protect engine page.
 */

import { motion } from 'framer-motion'
import { Shield, Activity, ShieldOff, AlertTriangle, Gauge, Cpu, Calendar, type LucideIcon } from 'lucide-react'
import { GlassCard, ViewModeToggle, CitationCard, CountUp } from '@/components/poseidon'
import type { ViewMode } from '@/hooks/useViewMode'
import { fadeUp } from '@/lib/motion-presets'
import { kpis, protectCitations } from './protect-data'
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ─── KPI value mapping for CountUp ─────────────────────── */

const kpiCountUp: Record<string, { value: number; decimals?: number; suffix?: string }> = {
  'Active signals': { value: 3 },
  'Blocked today': { value: 1 },
  'False positive rate': { value: 2.1, decimals: 1, suffix: '%' },
  'Coverage': { value: 100, suffix: '%' },
}

const kpiIcons: Record<string, LucideIcon> = {
  'Active signals': Activity,
  'Blocked today': ShieldOff,
  'False positive rate': AlertTriangle,
  'Coverage': Shield,
}

/* ─── Props ──────────────────────────────────────────────── */

export interface ProtectHeroProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ProtectHero({ viewMode, onViewModeChange }: ProtectHeroProps) {
  return (
    <>
      {/* ═══ 1. HERO SECTION ═══ */}
      <motion.section variants={fadeUp} className="flex flex-col gap-3" aria-labelledby="protect-headline">
        {/* Kicker badge + View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)' }}
            >
              <Shield className="h-3.5 w-3.5" style={{ color: 'var(--engine-protect)' }} />
            </div>
            <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--engine-protect)' }}>
              Protect
            </span>
          </div>
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} accentColor="var(--engine-protect)" />
        </div>

        {/* Headline */}
        <h1
          id="protect-headline"
          className="text-2xl font-bold leading-tight tracking-tight text-balance md:text-4xl neon-text-teal"
          style={{ color: '#F1F5F9' }}
        >
          3 active signals. Confidence 0.94. No action required.
        </h1>

        {/* Subline */}
        <p className="max-w-xl text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          Continuous monitoring across all accounts. Last scan: 4 minutes ago.
        </p>

        {/* AI Insight — CitationCard */}
        <CitationCard
          summary={`Unusual pattern detected at ${DEMO_THREAD.criticalAlert.merchant} — $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} charge deviates 3.2× from category average. Behavioral analysis flags merchant as new vendor with elevated risk profile.`}
          sources={protectCitations}
          confidence={DEMO_THREAD.criticalAlert.confidence}
          accentColor="var(--engine-protect)"
          viewMode={viewMode}
        />

        {/* ProofLine */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs" style={{ color: 'rgba(165,180,198,0.8)' }}>
          <span className="inline-flex items-center gap-1"><Activity size={10} aria-hidden="true" />3 signals</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span className="inline-flex items-center gap-1"><Gauge size={10} aria-hidden="true" />0.94</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span className="inline-flex items-center gap-1"><Cpu size={10} aria-hidden="true" />FraudDetectionV3.2</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span className="inline-flex items-center gap-1"><Calendar size={10} aria-hidden="true" />180d basis</span>
        </div>
      </motion.section>

      {/* ═══ 2. KPI GRID ═══ */}
      <motion.section variants={fadeUp} aria-label="Key metrics">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {kpis.map((kpi) => {
            const cu = kpiCountUp[kpi.label]
            const KpiIcon = kpiIcons[kpi.label]
            return (
              <GlassCard
                key={kpi.label}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wide flex items-center gap-1.5" style={{ color: '#64748B' }}>
                    {KpiIcon && <KpiIcon size={12} aria-hidden="true" />}
                    {kpi.label}
                  </span>
                  <div className="h-2 w-2 rounded-full" style={{ background: kpi.accent }} />
                </div>
                <p
                  className="mt-2 font-mono text-2xl font-bold tracking-tight md:text-3xl"
                  style={{ color: kpi.accent }}
                >
                  {cu ? (
                    <CountUp
                      value={cu.value}
                      decimals={cu.decimals}
                      suffix={cu.suffix}
                      className="font-mono text-2xl font-bold tracking-tight md:text-3xl"
                    />
                  ) : (
                    kpi.value
                  )}
                </p>
              </GlassCard>
            )
          })}
        </div>
      </motion.section>
    </>
  )
}

ProtectHero.displayName = 'ProtectHero'
