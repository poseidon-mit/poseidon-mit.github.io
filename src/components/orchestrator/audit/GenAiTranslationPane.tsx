/**
 * Orchestrator Workbench v2.0 — GenAI Translation Pane
 * Layer 2: AI-generated human-readable translations of audit events.
 */

import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { shortHash } from '@/lib/orchestrator/crypto'

export function GenAiTranslationPane() {
  const { state } = useWorkbenchContext()
  const translations = state.auditTrail.translations

  if (translations.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-white/30">
        <span className="text-2xl block mb-2">🤖</span>
        No AI translations generated yet.
        <p className="text-[10px] mt-1 text-white/20">
          Translations are auto-generated when audit events are recorded.
        </p>
      </div>
    )
  }

  return (
    <div className="max-h-[400px] overflow-auto space-y-2">
      {translations.map((t) => (
        <div
          key={t.eventId}
          className={cn(
            'px-3 py-2.5 rounded-lg border',
            'border-white/[0.04] bg-white/[0.02]',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-white/70 leading-relaxed flex-1">
              {t.plainText}
            </p>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-[9px] font-mono text-violet-400/60">
                {t.model}
              </span>
              <span className="text-[9px] font-mono text-white/20">
                {shortHash(t.hash)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-white/25">
            <span>Event: {t.eventId.slice(0, 8)}</span>
            <span>·</span>
            <span>
              {new Date(t.generatedAt).toLocaleString('ja-JP', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
