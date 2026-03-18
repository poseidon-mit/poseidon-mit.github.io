import { motion } from 'framer-motion'
import {
  TrendingUp,
  Lightbulb,
  PiggyBank,
  Shield,
} from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RECOMMENDATIONS_FOR_LIST } from './grow/recommendation-detail-data'
import type { RecommendationListItem } from './grow/recommendation-detail-data'

const CATEGORY_ICON: Record<string, typeof Lightbulb> = {
  Efficiency: PiggyBank,
  'Risk Mitigation': Shield,
  'Revenue Growth': TrendingUp,
}

export function GrowRecommendations() {
  usePageTitle('Recommendations')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)

  const spotlightRec = RECOMMENDATIONS_FOR_LIST[0] ?? null
  const listRecommendations = RECOMMENDATIONS_FOR_LIST.slice(1)

  return (
    <main id="main-content" role="main" className="hero-viewport">
      <motion.div
        className="flex flex-col gap-5 h-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Back link */}
        <motion.div variants={fadeUp}>
          <a
            href="/grow"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Grow
          </a>
        </motion.div>

        {/* Scrollable list area */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">

          {/* Spotlight recommendation */}
          {spotlightRec && (
            <motion.div variants={fadeUp}>
              <div
                className="border border-white/[0.06] backdrop-blur-lg rounded-2xl p-6 border-l-[3px]"
                style={{
                  borderLeftColor: 'var(--engine-grow)',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--engine-grow) 6%, transparent), transparent)',
                  boxShadow: '0 0 24px color-mix(in srgb, var(--engine-grow) 8%, transparent), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <div className="flex flex-col gap-3">
                  <Badge variant="outline" className="self-start border-violet-500/20 bg-violet-500/10 text-violet-400 text-[10px] uppercase tracking-widest">
                    Top observation
                  </Badge>
                  <p className="text-lg font-semibold text-foreground leading-snug">{spotlightRec.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{spotlightRec.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recommendation list */}
          {RECOMMENDATIONS_FOR_LIST.length === 0 ? (
            <motion.div variants={fadeUp}>
              <Card className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-md">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lightbulb className="h-12 w-12 text-white/40" />
                  <p className="mt-4 text-lg font-medium text-foreground">No recommendations</p>
                  <p className="text-muted-foreground">No recommendations match this filter.</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="space-y-3">
              {listRecommendations.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  )
}

function RecommendationCard({ rec }: { rec: RecommendationListItem }) {
  const CategoryIcon = CATEGORY_ICON[rec.category] ?? Lightbulb

  return (
    <div
      className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm rounded-2xl p-5 border-l-[3px]"
      style={{ borderLeftColor: 'var(--engine-grow)' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/15">
          <CategoryIcon className="h-5 w-5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{rec.title}</p>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{rec.description}</p>
        </div>
      </div>
    </div>
  )
}

export default GrowRecommendations
