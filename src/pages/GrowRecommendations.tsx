import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Lightbulb,
  ChevronRight,
  PiggyBank,
  Shield,
} from 'lucide-react'
import { Link } from '@/router'
import { usePageTitle } from '@/hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListHeroBanner } from '@/components/poseidon/list-hero-banner'
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

const DIFFICULTY_BADGE: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Hard: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

const CATEGORY_ICON: Record<string, typeof Lightbulb> = {
  Efficiency: PiggyBank,
  'Risk Mitigation': Shield,
  'Revenue Growth': TrendingUp,
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
  const activeCount = RECOMMENDATIONS_FOR_LIST.length
  const hasActiveFilters = sort !== 'benefit' || category !== 'All'

  return (
    <div className="hero-viewport">
      <motion.div
        className="flex flex-col gap-5 h-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Banner */}
        <motion.div variants={fadeUp}>
          <ListHeroBanner
            engine="grow"
            icon={Lightbulb}
            engineLabel="Grow · Recommendations"
            title="AI Recommendations"
            subtitle="Personalized suggestions to optimize your finances"
            backTo="/grow"
            backLabel="Back to Grow"
            stats={[
              { label: 'Active', value: activeCount },
              { label: 'Savings/yr', value: `$${totalAnnual.toLocaleString()}`, color: 'var(--state-healthy)' },
              { label: 'Completed', value: 12 },
            ]}
          />
        </motion.div>

        {/* Scrollable list area */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
          {/* Filter bar */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            {(Object.keys(SORT_LABELS) as SortMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setSort(mode)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  sort === mode
                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    : 'bg-white/[0.03] text-muted-foreground border-white/[0.06] hover:border-white/10 hover:text-foreground',
                )}
              >
                {SORT_LABELS[mode]}
              </button>
            ))}
            <div className="w-px h-5 bg-white/[0.06] mx-1" />
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  category === cat
                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    : 'bg-white/[0.03] text-muted-foreground border-white/[0.06] hover:border-white/10 hover:text-foreground',
                )}
                data-category={cat}
              >
                {cat}
              </button>
            ))}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => { setSort('benefit'); setCategory('All') }}
              >
                Clear
              </Button>
            )}
          </motion.div>

          {/* Filtered count */}
          {filtered.length < RECOMMENDATIONS_FOR_LIST.length && (
            <p className="text-xs text-white/40">
              Showing {filtered.length} of {RECOMMENDATIONS_FOR_LIST.length}
            </p>
          )}

          {/* Spotlight recommendation */}
          {spotlightRec && (
            <motion.div variants={fadeUp}>
              <Link to={`/grow/recommendation?id=${spotlightRec.id}`} className="block">
                <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 transition-shadow hover:from-violet-500/15 hover:to-purple-500/15">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3">
                      <Badge variant="outline" className="self-start border-violet-500/20 bg-violet-500/10 text-violet-400 text-[10px] uppercase tracking-widest">
                        Top Priority
                      </Badge>
                      <p className="text-lg font-semibold text-foreground leading-snug">{spotlightRec.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{spotlightRec.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="typo-hero-number text-3xl text-violet-400">
                          ${spotlightRec.annualSavings.toLocaleString()}/yr
                        </span>
                        <DifficultyBadge difficulty={spotlightRec.difficulty} />
                      </div>
                      <span className="self-start hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold mt-1 transition-colors bg-violet-600 text-white hover:bg-violet-700">
                        See opportunity
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Recommendation list */}
          {filtered.length === 0 ? (
            <motion.div variants={fadeUp}>
              <Card className="bg-card border-white/[0.06]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="h-12 w-12 text-white/40" />
                  <p className="mt-4 text-lg font-medium text-foreground">No recommendations</p>
                  <p className="text-muted-foreground">No recommendations match this filter.</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="space-y-3">
              {filtered
                .filter(rec => !spotlightRec || rec.id !== spotlightRec.id)
                .map(rec => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const style = DIFFICULTY_BADGE[difficulty]
  return (
    <Badge variant="outline" className={cn('text-[10px] uppercase tracking-widest', style.bg, style.text, style.border)}>
      {difficulty}
    </Badge>
  )
}

function RecommendationCard({ rec }: { rec: RecommendationListItem }) {
  const CategoryIcon = CATEGORY_ICON[rec.category] ?? Lightbulb

  return (
    <Card className="bg-card border-white/[0.06] transition-shadow hover:bg-white/[0.04]">
      <CardContent className="p-5">
        <Link to={`/grow/recommendation?id=${rec.id}`} className="block">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <CategoryIcon className="h-5 w-5 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{rec.title}</p>
                <DifficultyBadge difficulty={rec.difficulty} />
              </div>
              <p className="text-xs text-white/40 mt-0.5">{rec.category}</p>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{rec.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: 'var(--engine-grow)' }}>
                  Impact: ${rec.annualSavings.toLocaleString()}/yr
                </span>
                <Button variant="outline" size="sm" className="shrink-0">
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

export default GrowRecommendations
