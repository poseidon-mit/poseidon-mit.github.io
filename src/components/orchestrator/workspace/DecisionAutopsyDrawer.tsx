/**
 * Orchestrator Workspace v4.0 — Decision Autopsy Drawer
 *
 * Right-side panel showing strictly deterministic data lineage for a card.
 * NO generative text, NO AI-written summaries (compliance requirement).
 *
 * Sections:
 *   1. Data Sources table — source name, fetch timestamp, record count, status
 *   2. Formula Breakdown — calculation steps, inputs → output
 *   3. Audit Trail — linked AuditEvents (reuses existing DeterministicLogPane-style rendering)
 *   4. Raw Inputs — collapsible JSON viewer
 *   5. Proof Badge — hash verification
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { engineTokens } from '@/lib/engine-tokens'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { buildAutopsyData } from '@/lib/orchestrator/workspace/autopsy-builder'
import type { DecisionAutopsyData, AutopsyDataSource, AutopsyFormula } from '@/lib/orchestrator/workspace/workspace-types'
import type { AuditEvent, ProofBadge } from '@/lib/orchestrator/types'

// ─── Section Components ─────────────────────────────────────────────────────

function DataSourcesSection({ sources }: { sources: AutopsyDataSource[] }) {
  return (
    <section>
      <h3 className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">
        データソース
      </h3>
      <div className="rounded-lg border border-white/[0.06] overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left px-3 py-1.5 text-white/40 font-medium">ソース名</th>
              <th className="text-left px-3 py-1.5 text-white/40 font-medium">取得時刻</th>
              <th className="text-right px-3 py-1.5 text-white/40 font-medium">件数</th>
              <th className="text-center px-3 py-1.5 text-white/40 font-medium">状態</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((src, i) => (
              <tr
                key={i}
                className="border-b border-white/[0.03] last:border-0"
              >
                <td className="px-3 py-1.5 text-white/70 font-mono">{src.name}</td>
                <td className="px-3 py-1.5 text-white/50 font-mono tabular-nums">
                  {formatTime(src.fetchTimestamp)}
                </td>
                <td className="px-3 py-1.5 text-white/50 font-mono tabular-nums text-right">
                  {src.recordCount.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 text-center">
                  <StatusBadge status={src.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: AutopsyDataSource['status'] }) {
  const styles = {
    fresh: 'bg-emerald-500/15 text-emerald-400',
    stale: 'bg-amber-500/15 text-amber-400',
    error: 'bg-red-500/15 text-red-400',
  }
  const labels = { fresh: '最新', stale: '古い', error: 'エラー' }

  return (
    <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-mono', styles[status])}>
      {labels[status]}
    </span>
  )
}

function FormulaSection({ formulas }: { formulas: AutopsyFormula[] }) {
  if (formulas.length === 0) return null

  return (
    <section>
      <h3 className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">
        計算式ブレークダウン
      </h3>
      <div className="space-y-2">
        {formulas.map((formula, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-white/70 font-medium">
                {formula.label}
              </span>
              <span className="text-[11px] text-cyan-400/70 font-mono font-bold">
                → {String(formula.output)}
              </span>
            </div>
            <div className="text-[10px] text-white/40 font-mono bg-black/30 rounded px-2 py-1.5 mb-2 break-all">
              {formula.expression}
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(formula.inputs).map(([key, val]) => (
                <span
                  key={key}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/50 font-mono"
                >
                  {key}={typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function AuditTrailSection({ events }: { events: AuditEvent[] }) {
  if (events.length === 0) return null

  return (
    <section>
      <h3 className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">
        監査トレイル
      </h3>
      <div className="space-y-1">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
          >
            {/* Timeline dot */}
            <div className="mt-1 flex-shrink-0">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  event.actor.type === 'system'
                    ? 'bg-cyan-400/60'
                    : event.actor.type === 'ai-model'
                      ? 'bg-violet-400/60'
                      : 'bg-amber-400/60',
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/60 font-medium truncate">
                  {event.actor.label}
                </span>
                <span className="text-[9px] text-white/30 font-mono tabular-nums flex-shrink-0">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <span className="text-[9px] text-white/40 font-mono block truncate">
                {event.type} | hash: {event.hash.slice(0, 8)}…
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function RawInputsSection({ rawInputs }: { rawInputs: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false)
  const json = useMemo(() => JSON.stringify(rawInputs, null, 2), [rawInputs])

  return (
    <section>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2 hover:text-white/70 transition-colors"
      >
        <span className={cn('transition-transform text-[10px]', expanded && 'rotate-90')}>▶</span>
        Raw入力データ
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre className="text-[9px] text-white/40 font-mono bg-black/40 rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto border border-white/[0.04]">
              {json}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProofBadgeSection({ badge }: { badge: ProofBadge | null }) {
  if (!badge) return null

  const typeLabels: Record<ProofBadge['type'], string> = {
    'ai-generated': 'AI生成',
    'human-authored': '人間作成',
    'system-data': 'システムデータ',
    'external-sync': '外部同期',
  }

  return (
    <section>
      <h3 className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2">
        証明バッジ
      </h3>
      <div
        className={cn(
          'rounded-lg border p-3',
          badge.tamperDetected
            ? 'border-red-500/30 bg-red-500/5'
            : 'border-white/[0.06] bg-white/[0.02]',
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/60 font-medium">
            {typeLabels[badge.type]}
          </span>
          {badge.tamperDetected && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">
              改竄検知
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/40">ハッシュ</span>
            <span className="text-white/60 font-mono">{badge.hash ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/40">検証時刻</span>
            <span className="text-white/60 font-mono tabular-nums">
              {formatTime(badge.verifiedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/40">ソース</span>
            <span className="text-white/60 font-mono">{badge.source}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return isoString
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function DecisionAutopsyDrawer() {
  const { state, dispatch } = useWorkbenchContext()

  const targetCardId = state.workspace.autopsyTarget
  const isOpen = !!targetCardId
  const layout = state.activeBentoLayout

  const handleClose = useCallback(() => {
    dispatch({ type: 'SET_AUTOPSY_TARGET', cardId: null })
  }, [dispatch])

  // Build autopsy data from card spec + streaming state
  const autopsyData = useMemo<DecisionAutopsyData | null>(() => {
    if (!targetCardId || !layout) return null

    const cardSpec = layout.cards.find((c) => c.id === targetCardId)
    if (!cardSpec) return null

    const streamingState = state.workspace.streamingCards[targetCardId] ?? null
    return buildAutopsyData(cardSpec, streamingState)
  }, [targetCardId, layout, state.workspace.streamingCards])

  const engine = autopsyData
    ? engineTokens[autopsyData.engine as keyof typeof engineTokens]
    : null

  return (
    <AnimatePresence>
      {isOpen && autopsyData && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={handleClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 right-0 z-50 h-full',
              'w-full md:w-96 lg:w-[420px]',
              'border-l border-white/[0.08]',
              'backdrop-blur-xl bg-black/90',
              'overflow-hidden flex flex-col',
            )}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]"
              style={{
                borderTopColor: engine?.color
                  ? `color-mix(in srgb, ${engine.color} 30%, transparent)`
                  : undefined,
                borderTopWidth: engine ? '2px' : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: engine?.color ?? '#888' }}
                />
                <span className="text-xs font-medium text-white/70">
                  決定分析
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {autopsyData.cardType.replace(/-/g, ' ')}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-white/30 hover:text-white/60 text-sm transition-colors px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Confidence indicator */}
            {state.workspace.streamingCards[autopsyData.cardId] && (
              <div className="px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40">信頼度スコア</span>
                  <ConfidenceIndicator
                    confidence={state.workspace.streamingCards[autopsyData.cardId]?.confidence ?? 0}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <DataSourcesSection sources={autopsyData.dataSources} />
              <FormulaSection formulas={autopsyData.formulas} />
              <AuditTrailSection events={autopsyData.auditEvents} />
              <ProofBadgeSection badge={autopsyData.proofBadge} />
              <RawInputsSection rawInputs={autopsyData.rawInputs} />
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/30 font-mono">
                  計算時刻: {formatTime(autopsyData.computedAt)}
                </span>
                <span className="text-[9px] text-white/20">
                  決定的データのみ — AI生成テキストなし
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Small Helpers ──────────────────────────────────────────────────────────

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const isLow = confidence < 0.8

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isLow ? 'bg-amber-400/60' : 'bg-emerald-400/50',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          'text-[11px] font-mono font-bold tabular-nums',
          isLow ? 'text-amber-400' : 'text-emerald-400',
        )}
      >
        {pct}%
      </span>
    </div>
  )
}
