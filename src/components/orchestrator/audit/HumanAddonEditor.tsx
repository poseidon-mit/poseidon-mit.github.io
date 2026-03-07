/**
 * Orchestrator Workbench v2.0 — Human Add-on Editor
 * Layer 3: Human annotations/notes attached to audit events.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { generateId } from '@/lib/orchestrator/crypto'
import type { HumanAddon } from '@/lib/orchestrator/types'

export function HumanAddonEditor() {
  const { state, dispatch } = useWorkbenchContext()
  const [editingContent, setEditingContent] = useState('')
  const [targetEventId, setTargetEventId] = useState('')

  const addons = state.auditTrail.addons
  const events = state.auditTrail.events

  const handleSubmit = () => {
    if (!editingContent.trim()) return

    const addon: HumanAddon = {
      id: generateId(),
      eventId: targetEventId || 'general',
      author: { email: 'demo@poseidon.ai', name: 'Demo User' },
      content: editingContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Record in audit trail
    dispatch({
      type: 'RECORD_AUDIT_EVENT',
      event: {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: 'HUMAN_ADDON',
        actor: { type: 'human', id: 'demo-user', label: 'Demo User' },
        payload: { addonId: addon.id, content: addon.content },
        hash: '',
        previousHash: '',
      },
    })

    setEditingContent('')
    setTargetEventId('')
  }

  return (
    <div className="space-y-3">
      {/* Existing Add-ons */}
      {addons.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-auto">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className={cn(
                'px-3 py-2.5 rounded-lg border',
                'border-amber-500/10 bg-amber-500/5',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-white/70 leading-relaxed">
                    {addon.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[9px] text-white/25">
                    <span>✍ {addon.author.name}</span>
                    <span>·</span>
                    <span>
                      {new Date(addon.createdAt).toLocaleString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {addon.eventId !== 'general' && (
                      <>
                        <span>·</span>
                        <span>Event: {addon.eventId.slice(0, 8)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-white/30">
          <span className="text-2xl block mb-2">✍</span>
          No human annotations yet.
        </div>
      )}

      {/* New Add-on Form */}
      <div className="border-t border-white/[0.04] pt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-white/40">Attach to event:</span>
          <select
            value={targetEventId}
            onChange={(e) => setTargetEventId(e.target.value)}
            className={cn(
              'bg-transparent text-[10px] text-white/60 border border-white/[0.08] rounded px-2 py-0.5',
              'outline-none focus:border-white/[0.15]',
            )}
          >
            <option value="">General note</option>
            {events.slice(-10).map((e) => (
              <option key={e.id} value={e.id}>
                {e.type} — {e.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="注記を追加... (Enter で送信)"
            className={cn(
              'flex-1 bg-transparent text-xs text-white/70 placeholder:text-white/25',
              'border border-white/[0.08] rounded-lg px-3 py-2',
              'outline-none focus:border-white/[0.15]',
            )}
          />
          <button
            onClick={handleSubmit}
            disabled={!editingContent.trim()}
            className={cn(
              'px-3 py-2 rounded-lg text-[11px] font-medium transition-all',
              editingContent.trim()
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-white/[0.03] text-white/20 cursor-not-allowed',
            )}
          >
            追加
          </button>
        </div>
      </div>
    </div>
  )
}
