import { ArrowRight, ShieldAlert } from 'lucide-react'
import { Link } from '@/router'
import { buttonVariants } from '@/components/ui/button'
import { ListPortalBar } from './list-portal-bar'
import { cn } from '@/lib/utils'
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroPanel,
} from './hero-concept-primitives'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

type HeroSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export interface ShapFactor {
  label: string
  weight: number
  mitigating: boolean
}

export interface ProtectAnomalyRadarProps {
  alert: {
    id: string
    counterparty: string
    amount: string
    confidence: number
    severity: HeroSeverity
    description: string
    time: string
  }
  radarAxes: {
    label: string
    value: number
    maxValue: number
    color?: string
  }[]
  shapFactors: ShapFactor[]
  auditChain: { alertId: string; actionId: string; decisionId: string } | null
  remainingCount: number
  totalExposure: number
  fpRate: string
  onReviewThreat: () => void
}

import { ShapWaterfall } from '@/components/poseidon/shap-waterfall'

const SHAP_BASE = 0.12 // baseline fraud probability

function ProtectLedgerField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1 border-l border-white/10 pl-4 py-1">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="font-mono text-sm text-white/80">{value}</p>
    </div>
  )
}

function BackgroundTransactionTape({
  items,
  reducedMotion,
}: {
  items: string[]
  reducedMotion: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
      <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_80%)]" />
      <div className="absolute inset-y-0 left-0 flex w-full flex-col justify-between px-4 py-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 md:px-8">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={cn(
              'flex justify-between gap-6 whitespace-nowrap opacity-20',
              !reducedMotion && 'animate-[pulse_8s_ease-in-out_infinite]',
              index % 2 === 0 ? 'translate-x-[5%]' : '-translate-x-[5%]'
            )}
            style={{ animationDelay: `${index * 1.5}s` }}
          >
            <span>{item} verified</span>
            <span>{item} flagged</span>
            <span>{item} verified</span>
            <span>{item} flagged</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProtectAnomalyRadar({
  alert,
  radarAxes, // Kept for interface compatibility but unused in this visual paradigm
  shapFactors,
  auditChain,
  remainingCount,
  totalExposure,
  fpRate,
  onReviewThreat,
}: ProtectAnomalyRadarProps) {
  const reducedMotion = useReducedMotionSafe()
  const tapeItems = [
    `NODE-891`, `NODE-892`, `NODE-893`, `NODE-894`, `NODE-895`, `NODE-896`
  ]

  return (
    <div className="flex flex-col gap-3">
      <section
        role="region"
        aria-labelledby="protect-hero-title"
        className="relative flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#020202]"
      >
        <HeroBackdrop
          accent="var(--engine-protect)"
          secondaryAccent="#020202"
          reducedMotion={reducedMotion}
        />
        <BackgroundTransactionTape items={tapeItems} reducedMotion={reducedMotion} />
        
        {/* Core Content Area */}
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center px-6 py-12 md:px-10">
          
          <div className="flex flex-col items-center gap-2 mb-8 text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]">
            <HeroEyebrow className="border-[var(--engine-protect)]/20 bg-[var(--engine-protect)]/5 text-[var(--engine-protect)]">
              <ShieldAlert className="h-3.5 w-3.5" />
              Protect matrix live
            </HeroEyebrow>
            <h2
              id="protect-hero-title"
              className="sr-only"
            >
              Protect
            </h2>
            <p className="mt-2 text-sm font-medium tracking-wide text-white/50">
              Status: 1 anomaly flagged
            </p>
          </div>

          {/* The Prism: Central Focus Card */}
          <div className="group relative w-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-[1px] shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-[var(--engine-protect)]/30 hover:shadow-[0_0_80px_-20px_var(--engine-protect)]">
             {/* Quantum Routing Border Glow (Hover) */}
             {!reducedMotion && (
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--engine-protect)_360deg)] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:animate-[spin_3s_linear_infinite] group-hover:opacity-100" />
            )}
            
            <div className="relative z-10 grid gap-0 rounded-[23px] bg-[#050A0F] lg:grid-cols-2">
              
              {/* Left Pane: Alert Focus */}
              <div className="flex flex-col p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-2 w-2 rounded-full bg-[var(--engine-protect)] shadow-[0_0_10px_var(--engine-protect)]" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                    Target Identification
                  </span>
                </div>
                
                <p className="text-xl font-semibold text-white/90 md:text-2xl mb-1">
                  {alert.counterparty}
                </p>
                <p className="font-mono text-4xl text-white tracking-tight md:text-5xl mb-6">
                  {alert.amount}
                </p>
                
                <p className="text-sm leading-6 text-white/60 mb-8 max-w-sm">
                  {alert.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  <HeroMetricPill 
                    label="Confidence" 
                    value={`${Math.round(alert.confidence * 100)}%`} 
                    tone="var(--engine-protect)" 
                  />
                  <HeroMetricPill 
                    label="Severity" 
                    value={alert.severity} 
                    tone={alert.severity === 'Critical' ? 'var(--state-critical)' : 'var(--engine-execute)'}
                  />
                </div>
              </div>

              {/* Right Pane: Shapley Hologram */}
              <div className="flex flex-col p-8 md:p-10 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05)_0%,transparent_70%)] relative overflow-hidden">
                {!reducedMotion && (
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--engine-protect)]/30 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
                )}
                
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                    Diagnostic Trace
                  </span>
                  <span className="font-mono text-xs text-[var(--engine-protect)]">
                    {alert.id}
                  </span>
                </div>

                {shapFactors.length > 0 ? (
                  <div className="flex-1 w-full max-w-md ml-auto mt-2">
                    <p className="sr-only">SHAP Waterfall</p>
                    <ShapWaterfall
                      factors={shapFactors.map(f => ({
                        label: f.label,
                        value: f.mitigating ? -f.weight : f.weight
                      }))}
                      baseValue={SHAP_BASE}
                      finalValue={alert.confidence}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                    <p className="font-mono text-xs text-white/30">AWAITING_TELEMETRY</p>
                  </div>
                )}
                
                <div className="mt-10 flex justify-end">
                   <button
                    type="button"
                    onClick={onReviewThreat}
                    className={cn(
                      buttonVariants({ variant: 'default', size: 'lg' }),
                      'min-h-[48px] w-full sm:w-auto rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[var(--engine-protect)] hover:text-black hover:border-[var(--engine-protect)] transition-all duration-300 shadow-[0_0_0_transparent] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]',
                    )}
                  >
                    Review threat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ledger / Metadata (Ghost tier) */}
          <div className="mt-8 flex w-full max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row border-t border-white/5 pt-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <ProtectLedgerField label="Total exposure" value={`$${totalExposure.toLocaleString()}`} />
              <ProtectLedgerField label="False positives" value={fpRate} />
              <ProtectLedgerField 
                label="Linked review" 
                value={auditChain ? auditChain.actionId : 'Govern audit'} 
              />
            </div>
             
             {auditChain && (
               <Link
                 to={`/govern/audit-detail?decision=${auditChain.decisionId}`}
                 className="text-[11px] font-mono uppercase tracking-widest text-white/40 hover:text-[var(--engine-govern)] transition-colors flex items-center gap-2"
               >
                 View audit trail <ArrowRight className="h-3 w-3" />
               </Link>
             )}
          </div>
        </div>
      </section>

      {/* Full-width bottom bar (Ghost Button style) */}
      <Link
        to="/protect/threats"
        className="group relative flex w-full items-center justify-center gap-3 rounded-full py-4 transition-colors hover:bg-white/[0.02]"
      >
        <ShieldAlert className="h-4 w-4 text-[var(--engine-protect)] opacity-50 transition-opacity group-hover:opacity-100" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 transition-colors group-hover:text-white/80">
          {remainingCount} more threats below
        </span>
      </Link>
    </div>
  )
}

export interface ProtectThreatPostureProps {
  activeCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  resolvedCount: number
  fpRate: string
  modelUpdate: string
  topAlert: { id: string; counterparty: string; severity: HeroSeverity } | null
  onOpenTopAlert: (() => void) | null
}

export function ProtectThreatPosture({
  activeCount,
  highCount,
  mediumCount,
  lowCount,
  resolvedCount,
  fpRate,
  modelUpdate,
  topAlert,
  onOpenTopAlert,
}: ProtectThreatPostureProps) {
  const reducedMotion = useReducedMotionSafe()

  return (
    <section className="relative flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#020202] px-6 py-12 md:px-10">
      <HeroBackdrop
        accent="var(--engine-protect)"
        secondaryAccent="#020202"
        reducedMotion={reducedMotion}
      />
      
      {/* Subtle Breathing Green Glow */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-screen opacity-20">
          <div className="h-[40vh] w-[40vw] rounded-full bg-[var(--engine-protect)] blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
        </div>
      )}

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <div className="mb-8 flex items-center justify-center h-16 w-16 rounded-full bg-[var(--engine-protect)]/10 border border-[var(--engine-protect)]/20 text-[var(--engine-protect)] shadow-[0_0_30px_rgba(34,197,94,0.1)]">
           
        </div>
        
        <h2
          className="font-display text-3xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}
        >
          {activeCount === 0 ? 'All clear' : `Monitoring matrix stable. ${activeCount} alerts still tracked.`}
        </h2>
        
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50">
          {activeCount === 0
            ? 'No suspicious activity detected. Protect engines are continuously scanning telemetry in the background.'
            : `Protect stays read-only, keeps background telemetry flowing, and only escalates when the evidence stack becomes undeniable.`}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
          <ProtectLedgerField label="Total Tracked" value={activeCount.toString()} />
          <ProtectLedgerField label="Resolved" value={resolvedCount.toString()} />
          <ProtectLedgerField label="False Positives" value={fpRate} />
          <ProtectLedgerField label="Model Update" value={modelUpdate} />
        </div>

        {topAlert && onOpenTopAlert && (
          <div className="mt-12">
            <button
              type="button"
              onClick={onOpenTopAlert}
              className="inline-flex h-auto min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--engine-protect)] to-[var(--engine-dashboard)] px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:opacity-90"
            >
              Review top alert: {topAlert.counterparty}
            </button>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/protect/threats"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
          >
            View all threats <ArrowRight className="h-3 w-3 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  )
}
