/**
 * GoalsSection — Goal list with expandable GoalCard subcomponent.
 *
 * Contains: GoalCard (progress bar, target details, AI recommendation, actions)
 * and GoalsSection wrapper with stagger animation.
 */

import { motion } from 'framer-motion'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { ConfidenceIndicator, CitationCard } from '@/components/poseidon'
import { Surface, Button } from '@/design-system'
import type { ViewMode } from '@/hooks/useViewMode'
import { goals, statusConfig } from './grow-data'
import type { Goal } from './grow-data'

/* ── Props ── */

interface GoalsSectionProps {
  navigate: (path: string) => void
  viewMode?: ViewMode
}

/* ── GoalCard ── */

function GoalCard({ goal, navigate, viewMode = 'detail' }: { goal: Goal; navigate: (path: string) => void; viewMode?: ViewMode }) {
  const sc = statusConfig[goal.status]
  return (
    <motion.div variants={fadeUp}>
      <Surface variant="glass" padding="md" borderColor={goal.status === 'Behind' ? 'var(--state-warning)' : 'rgba(139,92,246,0.3)'} className="flex flex-col gap-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>{goal.name}</h3>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: sc.bg, color: sc.color }}
          >
            {goal.status === 'On track' || goal.status === 'Ahead' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
            {goal.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#64748B' }}>Progress</span>
            <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--engine-grow)' }}>{goal.progress}%</span>
          </div>
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            role="progressbar"
            aria-valuenow={goal.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${goal.progress}% progress toward ${goal.name}`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--engine-grow)' }}
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Target details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Target</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: '#F1F5F9' }}>{goal.target}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Current</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: '#F1F5F9' }}>{goal.current}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Gap</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: 'var(--state-warning)' }}>{goal.gap}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2">
          <Clock size={12} style={{ color: '#64748B' }} />
          <span className="text-xs" style={{ color: '#94A3B8' }}>{goal.timeline}</span>
        </div>

        {/* AI Recommendation */}
        <div
          className="rounded-xl px-3 py-2.5 flex items-start gap-2"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <CircleDot size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--engine-grow)' }} />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>
              AI recommendation: {goal.recommendation}
            </span>
            <ConfidenceIndicator value={goal.confidence} accentColor="var(--engine-grow)" />
          </div>
        </div>

        {/* Deep mode: CitationCard with recommendation detail */}
        {viewMode === 'deep' && (
          <CitationCard
            summary={goal.recommendation}
            sources={[{ id: `goal-${goal.id}`, label: 'GrowthOptimizer v2.8', excerpt: `Based on Monte Carlo analysis of ${goal.name} trajectory.` }]}
            confidence={goal.confidence}
            accentColor="var(--engine-grow)"
            viewMode="deep"
            className="mt-2"
          />
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {goal.actions.map((action, i) => (
            <Button
              key={action}
              variant={i === 0 ? 'glass' : 'secondary'}
              engine="grow"
              size="sm"
              className="rounded-xl text-xs"
              aria-label={`${action} for ${goal.name}`}
              onClick={() => {
                if (action === 'View scenarios') navigate('/grow/scenarios')
                else if (action === 'Recommendations') navigate('/grow/recommendations')
                else navigate('/grow/goal')
              }}
            >
              {action}
            </Button>
          ))}
        </div>
      </Surface>
    </motion.div>
  )
}

/* ── GoalsSection ── */

export function GoalsSection({ navigate, viewMode = 'detail' }: GoalsSectionProps) {
  return (
    <motion.section variants={staggerContainer} className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        Your Goals
      </h2>
      <div className="flex flex-col gap-4">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} navigate={navigate} viewMode={viewMode} />
        ))}
      </div>
    </motion.section>
  )
}
