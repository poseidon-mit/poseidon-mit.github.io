/**
 * Orchestrator Workbench v2.0 — Intent Preview Modal
 * 3-choice friction modal: Execute / Edit Plan / Do It Myself
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { IntentResult, FrictionPolicy } from '@/lib/orchestrator/types'
import { getFrictionPolicy } from '@/lib/orchestrator/friction-matrix'
import { engineTokens } from '@/lib/engine-tokens'

export interface IntentPreviewModalProps {
  intent: IntentResult
  open: boolean
  onExecute: () => void
  onEditPlan: () => void
  onDoItMyself: () => void
  onClose: () => void
}

export function IntentPreviewModal({
  intent,
  open,
  onExecute,
  onEditPlan,
  onDoItMyself,
  onClose,
}: IntentPreviewModalProps) {
  const policy = getFrictionPolicy(intent.riskLevel)
  const engine = engineTokens[intent.bentoLayout.primaryEngine]

  const riskColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-cyan-400',
    high: 'text-amber-400',
    critical: 'text-red-400',
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'relative w-full max-w-lg rounded-2xl border overflow-hidden',
            'border-white/[0.08] bg-[hsl(220_20%_6%_/_0.95)] backdrop-blur-xl',
          )}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <h3 className="text-sm font-semibold text-white/90">Intent Preview</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              「{intent.rawInput}」
            </p>
          </div>

          {/* Risk + Requirements */}
          <div className="px-5 pb-4 flex items-center gap-3">
            <span className={cn('text-xs font-mono font-bold', riskColors[intent.riskLevel])}>
              Risk: {intent.riskLevel.toUpperCase()}
            </span>
            <span className="text-[10px] text-white/30">·</span>
            <span className="text-[10px] text-white/40">
              {policy.requirements.map((r) => r.type).join(' + ')}
            </span>
          </div>

          {/* 3 Choices */}
          <div className="grid grid-cols-3 gap-3 px-5 pb-4">
            <button
              onClick={onExecute}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                'border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]',
              )}
            >
              <span className="text-xl">▶</span>
              <span className="text-[11px] font-semibold text-white/80">実行</span>
              <span className="text-[9px] text-white/40 text-center leading-tight">
                AIが全自動で処理
              </span>
            </button>

            <button
              onClick={onEditPlan}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                'border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]',
              )}
            >
              <span className="text-xl">✏</span>
              <span className="text-[11px] font-semibold text-white/80">プラン編集</span>
              <span className="text-[9px] text-white/40 text-center leading-tight">
                実行内容を確認・修正後に実行
              </span>
            </button>

            <button
              onClick={onDoItMyself}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                'border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]',
              )}
            >
              <span className="text-xl">🖐</span>
              <span className="text-[11px] font-semibold text-white/80">自分でやる</span>
              <span className="text-[9px] text-white/40 text-center leading-tight">
                参考資料だけ出力。操作は自分で
              </span>
            </button>
          </div>

          {/* Impact Preview */}
          <div className="px-5 pb-4 text-[10px] text-white/30">
            <div className="flex items-center gap-1.5 mb-1">
              <span>📊</span>
              <span className="font-medium">影響範囲プレビュー:</span>
            </div>
            <div className="pl-4 flex flex-col gap-0.5">
              <span>├─ エンジン: {intent.engines.map((e) => engineTokens[e]?.labelJa).join(', ')}</span>
              <span>├─ カード数: {intent.bentoLayout.cards.length}枚</span>
              <span>└─ ロールバック: 72時間以内可能</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
