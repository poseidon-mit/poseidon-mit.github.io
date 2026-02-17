/**
 * GovernHero — Hero section with engine badge, headline, featured AI insight
 * card, and KPI grid for the Govern engine page.
 */
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Eye,
  FileText,
  TrendingUp,
  CheckCircle2,
  Database,
  User,
  type LucideIcon,
} from 'lucide-react';
import { fadeUp, staggerContainer, staggerContainerDelayed } from '@/lib/motion-presets';
import { GlassCard, ViewModeToggle, CitationCard, CountUp } from '@/components/poseidon';
import type { ViewMode } from '@/hooks/useViewMode';
import { kpiData, governCitations } from './govern-data';

interface GovernHeroProps {
  navigate: (path: string) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */

function HeroSection({ navigate, viewMode = 'detail', onViewModeChange }: GovernHeroProps) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Engine badge + ViewModeToggle */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
            style={{
              borderColor: 'rgba(59,130,246,0.3)',
              background: 'rgba(59,130,246,0.08)',
              color: '#3B82F6',
            }}
          >
            <ShieldCheck size={12} />
            Govern Engine
          </span>
          {onViewModeChange && (
            <ViewModeToggle value={viewMode} onChange={onViewModeChange} accentColor="#3B82F6" />
          )}
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance neon-text-blue"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          Full transparency across 847 decisions. Confidence 0.97. 100% traceable.
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          Complete audit trail from AI recommendation to execution. Every decision has evidence.
        </p>
      </motion.div>

      {/* Featured AI insight — CitationCard */}
      <motion.div variants={fadeUp}>
        <CitationCard
          summary="Decision GV-2026-0214-42 verified — portfolio rebalance approved with 12 evidence points. Full provenance chain intact."
          sources={governCitations}
          confidence={0.97}
          accentColor="#3B82F6"
          viewMode={viewMode}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: '#ffffff',
              minHeight: '44px',
            }}
            aria-label="View audit trail for decision GV-2026-0214-42"
            onClick={() => navigate('/govern/audit-detail')}
          >
            <Eye size={16} />
            View audit trail
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
            onClick={() => navigate('/govern/audit')}
          >
            <FileText size={16} />
            Export report
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   KPI GRID
   ═══════════════════════════════════════════ */

/**
 * Parse a KPI value string and return CountUp props or plain text.
 * Handles formats: "847", "100%", "8.4", "3"
 */
function renderKpiValue(value: string) {
  const pctMatch = value.match(/^([\d.]+)%$/)
  if (pctMatch) {
    const num = parseFloat(pctMatch[1])
    return <CountUp value={num} suffix="%" decimals={num % 1 !== 0 ? 1 : 0} />
  }
  const numMatch = value.match(/^[\d.]+$/)
  if (numMatch) {
    const num = parseFloat(value)
    return <CountUp value={num} decimals={num % 1 !== 0 ? 1 : 0} />
  }
  return value
}

interface KpiGridProps {
  viewMode?: ViewMode;
}

const kpiIcons: Record<string, LucideIcon> = {
  'Decisions Audited': FileText,
  'Verifiable': CheckCircle2,
  'Avg Evidence Points': Database,
  'Human Reviews': User,
}

function KpiGrid({ viewMode: _viewMode = 'detail' }: KpiGridProps) {
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
          <motion.div key={kpi.label} variants={fadeUp}>
            <GlassCard className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider font-medium flex items-center gap-1.5" style={{ color: '#64748B' }}>
                {KpiIcon && <KpiIcon size={12} aria-hidden="true" />}
                {kpi.label}
              </span>
              <div className="flex items-end gap-2">
                <span
                  className="text-2xl md:text-3xl font-bold tabular-nums"
                  style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
                >
                  {renderKpiValue(kpi.value)}
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
                  <TrendingUp size={12} />
                  {kpi.trend.text}
                </span>
              )}
            </GlassCard>
          </motion.div>
        )
      })}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   COMBINED EXPORT
   ═══════════════════════════════════════════ */

export function GovernHero({ navigate, viewMode = 'detail', onViewModeChange }: GovernHeroProps) {
  return (
    <>
      <HeroSection navigate={navigate} viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <KpiGrid viewMode={viewMode} />
    </>
  );
}

export default GovernHero;
