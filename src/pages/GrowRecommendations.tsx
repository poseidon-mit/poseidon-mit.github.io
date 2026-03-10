import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  PiggyBank,
  Shield,
  CheckCircle2,
} from 'lucide-react'
import { Link } from '@/router'
import { usePageTitle } from '@/hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/utils'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Easy: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  Hard: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
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
    <motion.main
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/grow"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Grow
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
          <Lightbulb className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-gray-500">Personalized suggestions to optimize your finances</p>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={fadeUp}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-violet-200 bg-violet-50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                <Lightbulb className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-700">{activeCount}</p>
                <p className="text-sm text-violet-600">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">${totalAnnual.toLocaleString()}</p>
                <p className="text-sm text-green-600">Potential Savings/yr</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">12</p>
                <p className="text-sm text-blue-600">Completed (30d)</p>
              </div>
            </CardContent>
          </Card>
        </div>
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
                ? 'bg-violet-100 text-violet-700 border-violet-200'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {SORT_LABELS[mode]}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              category === cat
                ? 'bg-violet-100 text-violet-700 border-violet-200'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700',
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
            className="text-gray-500"
            onClick={() => { setSort('benefit'); setCategory('All') }}
          >
            Clear
          </Button>
        )}
      </motion.div>

      {/* Filtered count */}
      {filtered.length < RECOMMENDATIONS_FOR_LIST.length && (
        <p className="text-xs text-gray-400">
          Showing {filtered.length} of {RECOMMENDATIONS_FOR_LIST.length}
        </p>
      )}

      {/* Spotlight recommendation */}
      {spotlightRec && (
        <motion.div variants={fadeUp}>
          <Link to={`/grow/recommendation?id=${spotlightRec.id}`} className="block">
            <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <Badge variant="outline" className="self-start border-violet-200 bg-violet-100 text-violet-700 text-[10px] uppercase tracking-widest">
                    Top Priority
                  </Badge>
                  <p className="text-lg font-semibold text-gray-900 leading-snug">{spotlightRec.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{spotlightRec.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-mono font-bold text-violet-700">
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
          <Card className="bg-white border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lightbulb className="h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-900">No recommendations</p>
              <p className="text-gray-500">No recommendations match this filter.</p>
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
    </motion.main>
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
    <Card className="bg-white border-gray-200 transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <Link to={`/grow/recommendation?id=${rec.id}`} className="block">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
              <CategoryIcon className="h-5 w-5 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-gray-900">{rec.title}</p>
                <DifficultyBadge difficulty={rec.difficulty} />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{rec.category}</p>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{rec.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-600">
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
