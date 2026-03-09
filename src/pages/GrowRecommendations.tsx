import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react'
import { Link } from '@/router'
import { usePageTitle } from '@/hooks/use-page-title'
import { EngineBadge, EmptyState, PrioritySpotlight } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/utils'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { CARD_TIER_STYLES, focusGradientStyle, type CardTier } from '@/lib/card-variants'
import { selectSpotlightRecommendation } from '@/domain/poseidon-universe'
import { RECOMMENDATIONS_FOR_LIST } from './grow/recommendation-detail-data'
import type { RecommendationListItem } from './grow/recommendation-detail-data'

type SortMode = 'benefit' | 'easiest'
type Category = 'All' | 'Efficiency' | 'Risk Mitigation' | 'Revenue Growth'
type Difficulty = 'Easy' | 'Medium' | 'Hard'

const SORT_LABELS: Record<SortMode, string> = {
  benefit: 'Highest benefit',
  easiest: 'Easiest first',
}

const CATEGORY_OPTIONS: Category[] = ['All', 'Efficiency', 'Risk Mitigation', 'Revenue Growth']

const DIFFICULTY_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }

const DIFFICULTY_STYLE: Record<Difficulty, { color: string; bg: string }> = {
  Easy: { color: 'var(--engine-protect)', bg: 'rgba(34,197,94,0.12)' },
  Medium: { color: 'var(--engine-execute)', bg: 'rgba(234,179,8,0.12)' },
  Hard: { color: 'var(--state-critical)', bg: 'rgba(239,68,68,0.12)' },
}

/** Annual savings > $500 = standard, ≤ $500 = compact */
function getRecTier(annualSavings: number): CardTier {
  if (annualSavings >= 1000) return 'focus'
  if (annualSavings >= 500) return 'standard'
  return 'compact'
}

export function GrowRecommendations() {
  usePageTitle('Recommendations')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [sort, setSort] = useState<SortMode>('benefit')
  const [category, setCategory] = useState<Category>('All')

  const filtered = useMemo(() => {
    const base = category === 'All'
      ? RECOMMENDATIONS_FOR_LIST
      : RECOMMENDATIONS_FOR_LIST.filter(r => r.category === category)
    return [...base].sort((a, b) => {
      if (sort === 'benefit') return b.annualSavings - a.annualSavings
      return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
    })
  }, [sort, category])

  const spotlightRec = useMemo(() => selectSpotlightRecommendation(), [])

  const totalAnnual = RECOMMENDATIONS_FOR_LIST.reduce((s, r) => s + r.annualSavings, 0)

  // Split remaining recs (excluding spotlight) into tiers
  const remaining = filtered.filter(rec => !spotlightRec || rec.id !== spotlightRec.id)
  const standardRecs = remaining.filter(r => getRecTier(r.annualSavings) !== 'compact')
  const compactRecs = remaining.filter(r => getRecTier(r.annualSavings) === 'compact')

  return (
    <motion.main
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.section variants={staggerContainer} className="flex flex-col gap-5">
        <div>
          <Link
            to="/grow"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Grow
          </Link>
        </div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <EngineBadge engine="grow" icon={Lightbulb} label="Grow · Recommendations" className="self-start" />
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            Recommendations
          </h1>
          <p className="text-white/50 text-base">
            {RECOMMENDATIONS_FOR_LIST.length} AI-ranked opportunities · ${totalAnnual.toLocaleString()} total/yr
          </p>
        </motion.div>

        {/* Filter bar */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
          {(Object.keys(SORT_LABELS) as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                sort === mode
                  ? 'bg-[var(--engine-grow)]/15 text-[var(--engine-grow)] border-[var(--engine-grow)]/30'
                  : 'bg-white/[0.04] text-white/40 border-white/10 hover:border-white/20 hover:text-white/60',
              )}
            >
              {SORT_LABELS[mode]}
            </button>
          ))}
          <div className="w-px h-5 bg-white/10 mx-1" />
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                category === cat
                  ? 'bg-[var(--engine-grow)]/15 text-[var(--engine-grow)] border-[var(--engine-grow)]/30'
                  : 'bg-white/[0.04] text-white/40 border-white/10 hover:border-white/20 hover:text-white/60',
              )}
              data-category={cat}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Filtered count (only when filter is active) */}
        {filtered.length < RECOMMENDATIONS_FOR_LIST.length && (
          <p className="text-xs text-white/40">
            Showing {filtered.length} of {RECOMMENDATIONS_FOR_LIST.length}
          </p>
        )}
      </motion.section>

      {/* Spotlight recommendation */}
      {spotlightRec && (
        <motion.div variants={fadeUp}>
          <PrioritySpotlight engine="grow">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Top Priority
              </span>
              <p className="text-base md:text-lg font-semibold text-white/90 leading-snug">{spotlightRec.title}</p>
              <p className="text-sm text-white/55 line-clamp-2">{spotlightRec.description}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-mono font-bold" style={{ color: 'var(--engine-grow)' }}>
                  ${spotlightRec.annualSavings.toLocaleString()}/yr
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-transparent"
                  style={{
                    background: DIFFICULTY_STYLE[spotlightRec.difficulty]?.bg,
                    color: DIFFICULTY_STYLE[spotlightRec.difficulty]?.color,
                  }}
                >
                  {spotlightRec.difficulty}
                </span>
              </div>
              <Link
                to={`/grow/recommendation?id=${spotlightRec.id}`}
                className={cn(
                  'self-start inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold mt-1 transition-colors',
                  'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
                  'hover:from-violet-400 hover:to-purple-400',
                )}
              >
                See opportunity
                <ArrowRight size={14} />
              </Link>
            </div>
          </PrioritySpotlight>
        </motion.div>
      )}

      {/* Recommendation list */}
      {filtered.length === 0 ? (
        <motion.div variants={fadeUp}>
          <div className="glass-card glass-card-overlay rounded-xl p-12 flex items-center justify-center">
            <EmptyState
              icon={Lightbulb}
              title="No recommendations"
              description="No recommendations match this filter."
              accentColor="var(--engine-grow)"
            />
          </div>
        </motion.div>
      ) : (
        <>
          {/* Standard/Focus tier cards */}
          {standardRecs.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              {standardRecs.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </motion.div>
          )}

          {/* Compact tier cards — 2-column grid on md+ */}
          {compactRecs.length > 0 && (
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {compactRecs.map(rec => (
                <CompactRecommendationCard key={rec.id} rec={rec} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.main>
  )
}

function RecommendationCard({ rec }: { rec: RecommendationListItem }) {
  const diff = DIFFICULTY_STYLE[rec.difficulty]
  const tier = getRecTier(rec.annualSavings)
  const styles = CARD_TIER_STYLES[tier]

  return (
    <Link
      to={`/grow/recommendation?id=${rec.id}`}
      className={cn(
        'glass-card glass-card-overlay rounded-[20px] flex flex-col gap-3 hover:border-white/[0.12] transition-colors border-l-2 group',
        styles.padding,
      )}
      style={{
        borderLeftColor: 'var(--engine-grow)',
        ...(tier === 'focus' ? focusGradientStyle('var(--engine-grow)') : {}),
      }}
    >
      {/* Title row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn('text-white/90', styles.titleSize)}>{rec.title}</span>
        <span
          className="inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest border border-transparent"
          style={{ background: diff.bg, color: diff.color }}
        >
          {rec.difficulty}
        </span>
      </div>

      {/* Description — only for focus tier, capped at 2 lines */}
      {tier === 'focus' && (
        <p className="text-sm text-white/55 leading-relaxed line-clamp-2">{rec.description}</p>
      )}

      {/* Bottom row: amount + CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className={styles.amountSize} style={{ color: 'var(--engine-grow)' }}>
            ${rec.annualSavings.toLocaleString()}
          </span>
          <span className="text-[10px] text-white/40">/yr</span>
        </div>
        {tier === 'focus' ? (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors',
              'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-[var(--engine-grow)] border border-[var(--engine-grow)]/30',
              'group-hover:border-[var(--engine-grow)]/50',
            )}
          >
            See opportunity
            <ArrowRight size={12} />
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold border transition-colors group-hover:border-[var(--engine-grow)]/50"
            style={{
              borderColor: 'color-mix(in srgb, var(--engine-grow) 30%, transparent)',
              color: 'var(--engine-grow)',
              background: 'color-mix(in srgb, var(--engine-grow) 10%, transparent)',
            }}
          >
            See opportunity
            <ArrowRight size={12} />
          </span>
        )}
      </div>
    </Link>
  )
}

/** Compact card for lower-impact recommendations — single row, no description */
function CompactRecommendationCard({ rec }: { rec: RecommendationListItem }) {
  const diff = DIFFICULTY_STYLE[rec.difficulty]

  return (
    <Link
      to={`/grow/recommendation?id=${rec.id}`}
      className="glass-card glass-card-overlay rounded-[16px] p-4 flex items-center gap-3 hover:border-white/[0.12] transition-colors border-l-2 group"
      style={{ borderLeftColor: 'var(--engine-grow)' }}
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white/90 truncate block">{rec.title}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-mono font-bold" style={{ color: 'var(--engine-grow)' }}>
            ${rec.annualSavings.toLocaleString()}/yr
          </span>
          <span
            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border border-transparent"
            style={{ background: diff.bg, color: diff.color }}
          >
            {rec.difficulty}
          </span>
        </div>
      </div>
      <ArrowRight size={14} className="shrink-0 text-white/30 group-hover:text-[var(--engine-grow)] transition-colors" />
    </Link>
  )
}

export default GrowRecommendations
