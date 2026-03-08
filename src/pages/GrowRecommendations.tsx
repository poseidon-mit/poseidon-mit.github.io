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
          <p className="text-xs text-white/30">
            Showing {filtered.length} of {RECOMMENDATIONS_FOR_LIST.length}
          </p>
        )}
      </motion.section>

      {/* Spotlight recommendation */}
      {spotlightRec && (
        <motion.div variants={fadeUp}>
          <PrioritySpotlight engine="grow">
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2 block">
                  Top Priority
                </span>
                <p className="text-sm font-semibold text-white/90 leading-snug mb-1">{spotlightRec.title}</p>
                <p className="text-xs text-white/40 mb-1">{spotlightRec.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-base font-mono font-bold" style={{ color: 'var(--engine-grow)' }}>
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
              </div>
              <Link
                to={`/grow/recommendation?id=${spotlightRec.id}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
                style={{
                  borderColor: 'color-mix(in srgb, var(--engine-grow) 30%, transparent)',
                  color: 'var(--engine-grow)',
                  background: 'color-mix(in srgb, var(--engine-grow) 10%, transparent)',
                }}
              >
                See opportunity
                <ArrowRight size={12} />
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
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {filtered
            .filter(rec => !spotlightRec || rec.id !== spotlightRec.id)
            .map(rec => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
        </motion.div>
      )}
    </motion.main>
  )
}

function RecommendationCard({ rec }: { rec: RecommendationListItem }) {
  const diff = DIFFICULTY_STYLE[rec.difficulty]

  return (
    <div
      className="glass-card glass-card-overlay rounded-[20px] p-5 lg:p-6 flex items-center gap-4 hover:border-white/[0.12] transition-colors border-l-2"
      style={{ borderLeftColor: 'var(--engine-grow)' }}
    >
      {/* Amount hero */}
      <div
        className="w-16 shrink-0 text-right hidden sm:block"
      >
        <span className="text-base font-mono font-bold" style={{ color: 'var(--engine-grow)' }}>
          ${rec.annualSavings.toLocaleString()}
        </span>
        <span className="text-[10px] text-white/30 block">/yr</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-white/90 truncate">{rec.title}</span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-transparent"
            style={{ background: diff.bg, color: diff.color }}
          >
            {rec.difficulty}
          </span>
        </div>
        <p className="text-xs text-white/40 mb-1 truncate">{rec.description}</p>
        <p className="text-[10px] text-white/25 truncate">{rec.evidence}</p>
      </div>

      {/* CTA */}
      <Link
        to={`/grow/recommendation?id=${rec.id}`}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
        style={{
          borderColor: 'color-mix(in srgb, var(--engine-grow) 30%, transparent)',
          color: 'var(--engine-grow)',
          background: 'color-mix(in srgb, var(--engine-grow) 10%, transparent)',
        }}
      >
        See opportunity
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}

export default GrowRecommendations
