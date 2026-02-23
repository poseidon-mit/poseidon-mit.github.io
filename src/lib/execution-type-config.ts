/**
 * Canonical execution-type display configuration.
 *
 * Single source of truth for the Tailwind-class badge styles
 * used in Execute queue and Approval pages.
 */
import type { ExecutionType } from '@/domain/poseidon-universe'

export const EXECUTION_TYPE_BADGE: Record<ExecutionType, { label: string; cls: string }> = {
  auto: { label: 'Auto', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  'semi-auto': { label: 'Semi-Auto', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  manual: { label: 'Manual', cls: 'bg-slate-400/15 text-slate-300 border-slate-400/20' },
  hybrid: { label: 'Hybrid', cls: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
}
