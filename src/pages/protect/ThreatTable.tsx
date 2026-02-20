/**
 * ThreatTable — Main content area for the Protect engine page.
 *
 * Contains the signals table (desktop + mobile), expandable SHAP panel,
 * definition line, and quick actions.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Eye,
  Clock,
  ChevronDown,
  ExternalLink,
  AlertTriangle,
  AlertOctagon,
  ArrowDown,
  Zap,
} from 'lucide-react'
import { GlassCard, SeverityBadge, ReasoningChain } from '@/components/poseidon'
import type { ViewMode } from '@/hooks/useViewMode'
import { fadeUp } from '@/lib/motion-presets'
import { signals, shapFactors, quickActions, protectReasoningSteps } from './protect-data'
import type { Signal } from './protect-data'
import { Button } from '@/design-system'

/* ─── Props ───────────────────────────────────────────────── */

export interface ThreatTableProps {
  navigate: (path: string) => void
  viewMode?: ViewMode
}

/* ─── Mini Score Ring (inline in table) ───────────────────── */

function MiniScoreRing({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="14" fill="none" stroke="var(--engine-protect)" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${pct * 0.88} ${88 - pct * 0.88}`}
          />
        </svg>
      </div>
      <span className="font-mono text-sm font-semibold" style={{ color: 'var(--engine-protect)' }}>
        {pct}{'%'}
      </span>
    </div>
  )
}

/* ─── SHAP Detail Panel ───────────────────────────────────── */

function SHAPPanel() {
  return (
    <div className="flex flex-col gap-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4" style={{ color: 'var(--engine-protect)' }} />
        <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>SHAP Factor Analysis</span>
      </div>
      <div className="flex flex-col gap-3">
        {shapFactors.map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#CBD5E1' }}>{f.label}</span>
              <span className="font-mono text-sm font-semibold" style={{ color: 'var(--engine-protect)' }}>{f.value.toFixed(2)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--engine-protect), rgba(34,197,94,0.5))' }}
                initial={{ width: 0 }}
                animate={{ width: `${f.value * 100}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="font-mono text-xs" style={{ color: '#64748B' }}>
          {'FraudDetection v3.2 | Trained on 180d | Accuracy 97.2%'}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── MAIN COMPONENT ──────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

export function ThreatTable({ navigate, viewMode = 'detail' }: ThreatTableProps) {
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null)

  return (
    <motion.div variants={fadeUp} className="flex min-w-0 flex-[2] flex-col gap-5">
      {/* Threat Table */}
      <GlassCard
        borderColor="var(--engine-protect)"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
            <AlertTriangle size={18} style={{ color: 'var(--engine-protect)' }} aria-hidden="true" />
            Threat Signals
          </h2>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: 'rgba(var(--state-warning-rgb),0.15)', color: 'var(--state-warning)', border: '1px solid rgba(var(--state-warning-rgb),0.3)' }}
          >
            3 active
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full" role="table">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Severity', 'Signal', 'Amount', 'Confidence', 'Time', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: '#64748B' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signals.map((s: Signal) => (
                <React.Fragment key={s.id}>
                  <tr
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onClick={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedSignal(expandedSignal === s.id ? null : s.id); }}
                    aria-expanded={expandedSignal === s.id}
                  >
                    <td className="py-3 pr-3">
                      <SeverityBadge severity={s.severity} />
                    </td>
                    <td className="py-3 pr-3">
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{s.title}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{s.merchant}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-3 font-mono text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                      {s.amount}
                    </td>
                    <td className="py-3 pr-3">
                      <MiniScoreRing value={s.confidence} />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" style={{ color: '#64748B' }} />
                        <span className="text-sm" style={{ color: '#CBD5E1' }}>{s.time}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Button
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                        variant="glass"
                        engine="protect"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); navigate('/protect/alert-detail'); }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expandedSignal === s.id && (
                    <tr>
                      <td colSpan={6} className="pb-4 pt-1">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-4"
                        >
                          <SHAPPanel />
                          {viewMode === 'deep' && (
                            <ReasoningChain steps={protectReasoningSteps} accentColor="var(--engine-protect)" />
                          )}
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-3 md:hidden">
          {signals.map((s: Signal) => (
            <div key={s.id}>
              <div
                className="flex flex-col gap-3 rounded-xl p-3 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${s.severity === 'critical' ? 'var(--state-critical)' : s.severity === 'warning' ? 'var(--state-warning)' : '#38BDF8'}`,
                }}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedSignal(expandedSignal === s.id ? null : s.id); }}
                aria-expanded={expandedSignal === s.id}
              >
                <div className="flex items-center justify-between">
                  <SeverityBadge severity={s.severity} />
                  <span className="text-xs" style={{ color: '#64748B' }}>{s.time}</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{s.title}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{s.merchant}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold" style={{ color: '#F1F5F9' }}>{s.amount}</span>
                  <MiniScoreRing value={s.confidence} />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    variant="glass"
                    engine="protect"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); navigate('/protect/alert-detail'); }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <ChevronDown
                    className="h-4 w-4 transition-transform"
                    style={{
                      color: '#64748B',
                      transform: expandedSignal === s.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>
              </div>
              {expandedSignal === s.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 flex flex-col gap-4"
                >
                  <SHAPPanel />
                  {viewMode === 'deep' && (
                    <ReasoningChain steps={protectReasoningSteps} accentColor="var(--engine-protect)" />
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* DefinitionLine */}
      <div
        className="rounded-xl p-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="font-mono text-xs leading-relaxed" style={{ color: '#64748B' }}>
          {'Risk Score = weighted_sum(signal_confidence \u00D7 severity_factor) | Unit: 0\u20131 | Period: rolling 24h | Threshold: >0.7 triggers alert'}
        </p>
      </div>

      {/* Quick Actions */}
      <GlassCard
        borderColor="var(--engine-protect)"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2" style={{ color: '#F1F5F9' }}>
          <Zap size={18} style={{ color: 'var(--engine-protect)' }} aria-hidden="true" />
          Quick Actions
        </h2>
        <div className="flex flex-col gap-3">
          {quickActions.map((a) => (
            <div
              key={a.title}
              className="flex items-center gap-3 rounded-xl p-3 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `3px solid ${a.color}`,
                cursor: 'pointer',
              }}
              role="button"
              tabIndex={0}
              onClick={() => { if (a.route) navigate(a.route); }}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && a.route) navigate(a.route); }}
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: a.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{a.title}</p>
                <p className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                  {a.priority === 'urgent' && <AlertOctagon size={10} aria-hidden="true" />}
                  {a.priority === 'normal' && <Clock size={10} aria-hidden="true" />}
                  {a.priority === 'low' && <ArrowDown size={10} aria-hidden="true" />}
                  {a.priority === 'urgent' ? 'Immediate' : a.priority === 'normal' ? '24h SLA' : 'Low'}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0" style={{ color: '#64748B' }} />
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

ThreatTable.displayName = 'ThreatTable'
