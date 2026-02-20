/**
 * ProtectSidebar — Right decision rail for the Protect engine page.
 *
 * Contains the large score ring, category breakdown bars,
 * signal timeline, and evidence summary.
 */

import { motion } from 'framer-motion'
import {
  Check,
  AlertCircle,
  Layers,
  Activity,
} from 'lucide-react'
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts'
import { MethodologyCard } from '@/components/poseidon'
import type { ViewMode } from '@/hooks/useViewMode'
import { fadeUp } from '@/lib/motion-presets'
import { categoryScores, milestones, protectMethodology } from './protect-data'
import { Surface } from '@/design-system'

/* ─── Score Ring (large, for Decision Rail) ────────────────── */

function ScoreRingLarge({ score }: { score: number }) {
  const data = [{ value: score, fill: 'var(--engine-protect)' }]
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#64748B' }}>
        Risk Score
      </p>
      <div className="relative">
        <RadialBarChart
          width={180}
          height={180}
          cx={90}
          cy={90}
          innerRadius={62}
          outerRadius={80}
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: 'rgba(255,255,255,0.06)' }}
            angleAxisId={0}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold" style={{ color: '#F1F5F9' }}>{score}</span>
          <span className="text-xs" style={{ color: '#64748B' }}>{'/100'}</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color: 'var(--engine-protect)' }}>
        {'Low \u2014 monitoring'}
      </span>
    </div>
  )
}

/* ─── Category Score Bars ─────────────────────────────────── */

function CategoryScoreBars() {
  return (
    <div className="flex flex-col gap-3">
      {categoryScores.map((cat) => {
        const Icon = cat.icon
        return (
          <div
            key={cat.name}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)' }}
            >
              <Icon className="h-4 w-4" style={{ color: 'var(--engine-protect)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{cat.name}</span>
                <span className="font-mono text-sm font-semibold" style={{ color: 'var(--engine-protect)' }}>{cat.score}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--engine-protect), rgba(34,197,94,0.6))' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Milestones Timeline ─────────────────────────────────── */

function Timeline() {
  return (
    <div className="flex flex-col">
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1
        return (
          <div key={m.label} className="relative flex gap-4">
            {!isLast && (
              <div
                className="absolute left-4 top-8 h-full w-px -translate-x-1/2"
                style={{
                  background: m.status === 'completed'
                    ? 'linear-gradient(to bottom, rgba(34,197,94,0.3), rgba(34,197,94,0.1))'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                }}
              />
            )}
            <div className="z-10 shrink-0">
              {m.status === 'completed' ? (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'rgba(34,197,94,0.15)', boxShadow: 'inset 0 0 0 2px rgba(34,197,94,0.3)' }}
                >
                  <Check className="h-4 w-4" style={{ color: 'var(--state-healthy)' }} />
                </div>
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'rgba(34,197,94,0.15)', boxShadow: 'inset 0 0 0 2px rgba(34,197,94,0.3)' }}
                >
                  <div className="h-3 w-3 animate-pulse rounded-full" style={{ background: 'var(--engine-protect)' }} />
                </div>
              )}
            </div>
            <div className={`flex flex-1 items-center justify-between ${isLast ? 'pb-0' : 'pb-6'}`}>
              <div>
                <p className="text-sm font-medium" style={{ color: m.status === 'completed' ? '#F1F5F9' : '#CBD5E1' }}>
                  {m.label}
                </p>
                <p className="text-xs" style={{ color: '#64748B' }}>{m.time}</p>
              </div>
              {m.status === 'completed' && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--state-healthy)' }}
                >
                  Done
                </span>
              )}
              {m.status === 'current' && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--engine-protect)' }}
                >
                  Active
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Evidence Summary ────────────────────────────────────── */

function EvidenceSummary() {
  return (
    <Surface variant="glass" padding="md"
      borderColor="var(--engine-protect)"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <h3 className="mb-3 text-sm font-semibold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
        <AlertCircle size={14} style={{ color: 'var(--engine-protect)' }} aria-hidden="true" />
        Evidence Summary
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
        AI identified 3 correlated signals across 2 accounts in the last 6 hours.
      </p>
    </Surface>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── MAIN COMPONENT ──────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

export interface ProtectSidebarProps {
  viewMode?: ViewMode
}

export function ProtectSidebar({ viewMode = 'detail' }: ProtectSidebarProps) {
  return (
    <motion.aside variants={fadeUp} className="flex min-w-0 flex-1 flex-col gap-5" aria-label="Decision rail">
      {/* Score Ring */}
      <Surface variant="glass" padding="md"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <ScoreRingLarge score={94} />
      </Surface>

      {/* Category Score Bars */}
      <Surface variant="glass" padding="md"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h3 className="mb-4 text-sm font-semibold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
          <Layers size={14} style={{ color: 'var(--engine-protect)' }} aria-hidden="true" />
          Category Breakdown
        </h3>
        <CategoryScoreBars />
      </Surface>

      {/* Milestones Timeline */}
      <Surface variant="glass" padding="md"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h3 className="mb-4 text-sm font-semibold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
          <Activity size={14} style={{ color: 'var(--engine-protect)' }} aria-hidden="true" />
          Signal Timeline
        </h3>
        <Timeline />
      </Surface>

      {/* Evidence Summary */}
      <EvidenceSummary />

      {/* Methodology Card (deep mode only) */}
      {viewMode === 'deep' && (
        <MethodologyCard
          modelName={protectMethodology.modelName}
          modelVersion={protectMethodology.modelVersion}
          accuracy={protectMethodology.accuracy}
          description={protectMethodology.description}
          accentColor="var(--engine-protect)"
        />
      )}
    </motion.aside>
  )
}

ProtectSidebar.displayName = 'ProtectSidebar'
