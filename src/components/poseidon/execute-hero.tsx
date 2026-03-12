import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Link } from '@/router'
import { ArrowRight, CheckCircle2, Timer, Zap, Lock, Activity, ChevronRight } from 'lucide-react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/utils'
import type {
  ExecuteEngineName,
  ExecutionType,
} from '@/domain/poseidon-universe/types'
import { HeroBackdrop, HeroGhostLink } from './hero-concept-primitives'

export interface ExecuteHeroProps {
  queueTotal: number
  urgentCount: number
  agentStepsCompleted: number
  agentStepsTotal: number
  featuredAction: {
    id: string
    title: string
    amountLabel: string
    confidence: number
    engine: ExecuteEngineName
    sourceEngine: ExecuteEngineName
    expiresIn: string | null
    rollbackHours: number | null
    executionType?: ExecutionType
    riskTier?: 1 | 2
  } | null
  engineSources: {
    engine: ExecuteEngineName
    count: number
    color: string
  }[]
  onReviewApproval: (() => void) | null
  urgencyBreakdown?: { high: number; medium: number; low: number }
  currentSavingsUsd?: number
  potentialSavingsUsd?: number
  pendingQueue: { id: string; title: string }[]
}

export type ExecuteApprovalCommandDeckProps = ExecuteHeroProps

const variants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 25, stiffness: 120 }
  }
}

const noMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
}

export function ExecuteHero({
  queueTotal,
  urgentCount,
  agentStepsCompleted,
  agentStepsTotal,
  featuredAction,
  engineSources,
  onReviewApproval,
  urgencyBreakdown,
  currentSavingsUsd,
  potentialSavingsUsd,
  pendingQueue = [],
}: ExecuteHeroProps) {
  const reducedMotion = useReducedMotionSafe()
  const v = reducedMotion ? noMotionVariants : variants
  const [isHoveringApprove, setIsHoveringApprove] = useState(false)

  if (!featuredAction) {
    return (
      <section
        role="region"
        aria-labelledby="execute-hero-title"
        className="relative flex h-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#020202]"
      >
        <HeroBackdrop
          accent="var(--engine-execute)"
          secondaryAccent="var(--engine-protect)"
          reducedMotion={reducedMotion}
        />
        <div className="relative z-10 flex h-full flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-[var(--engine-protect)]" />
          <h2
            id="execute-hero-title"
            className="text-4xl font-semibold tracking-[-0.04em] text-white"
          >
            Queue Clear
          </h2>
          <p className="max-w-2xl text-base leading-8 text-white/55">
            Poseidon has no actions waiting for consent. The command deck is clear and audit
            logging remains active.
          </p>
          {currentSavingsUsd != null && (
            <p className="rounded-full border border-white/10 px-4 py-2 font-mono text-sm text-white/70">
              Current monthly lift: ${currentSavingsUsd.toLocaleString()}
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      role="region"
      aria-labelledby="execute-hero-title"
      className="relative flex h-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#020202]"
    >
      <span className="sr-only">{queueTotal}</span>
      <HeroBackdrop
        accent="var(--engine-execute)"
        secondaryAccent="#020202"
        reducedMotion={reducedMotion}
      />

      <div className="relative z-10 flex h-full flex-1 flex-col p-5 sm:p-8">
        <motion.div
           initial="hidden"
           animate="visible"
           variants={{
             visible: { transition: { staggerChildren: 0.08 } }
           }}
           className="flex h-full flex-col"
        >
          {/* Top Bar: Eyebrow + Status */}
          <motion.div variants={v} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 id="execute-hero-title" className="sr-only">Execute</h2>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[var(--engine-execute)]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--engine-execute)]">
                  [⚡ EXECUTE]
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-white/50">
                  Human authorization required
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               <span className="inline-flex items-center rounded-full border border-[var(--engine-execute)]/30 bg-[var(--engine-execute)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--engine-execute)]">
                 {queueTotal} live queue item{queueTotal === 1 ? '' : 's'}
               </span>
               {urgentCount > 0 && (
                 <span className="inline-flex items-center rounded-full border border-[var(--state-warning)]/30 bg-[var(--state-warning)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--state-warning)]">
                   <Timer className="mr-1 h-3 w-3" />
                   {urgentCount} URGENT
                 </span>
               )}
            </div>
          </motion.div>

          {/* FOCUS PRISM: Center large card */}
          <motion.div variants={v} className="flex flex-col flex-1 items-center justify-center py-8">
            <div 
              className={cn(
                "group relative w-full max-w-4xl rounded-[32px] p-[1px] transition-all duration-700",
                isHoveringApprove && !reducedMotion ? "shadow-[0_0_80px_-20px_var(--engine-execute)]" : ""
              )}
            >
              {/* Static Border Fallback */}
              <div className="absolute inset-0 rounded-[32px] border border-white/5 group-hover:border-white/10 transition-colors z-0" />

              {/* Quantum Routing Border Animation */}
              {!reducedMotion && (
                <div 
                  className={cn(
                    "absolute -inset-[1px] rounded-[33px] opacity-0 transition-opacity duration-500 overflow-hidden pointer-events-none -z-10",
                    isHoveringApprove && "opacity-100"
                  )}
                >
                  <div 
                    className="absolute inset-[-50%] w-[200%] h-[200%]"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 70%, var(--engine-execute) 100%)',
                      animation: 'spin 2s linear infinite',
                      transformOrigin: '50% 50%'
                    }}
                  />
                </div>
              )}

              <div className="relative h-full w-full rounded-[31px] bg-black/60 backdrop-blur-3xl p-6 sm:p-10 z-10 border border-white/5 group-hover:border-white/10 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 min-w-0">
                  {/* Left Data */}
                  <div className="flex-1 min-w-0 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-white/50 border border-white/10 bg-white/5 rounded px-2 py-0.5">
                        {featuredAction.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                        <Activity className="h-3.5 w-3.5" />
                        CONF: {Math.round(featuredAction.confidence * 100)}%
                      </span>
                      {featuredAction.rollbackHours != null && (
                         <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                           <Lock className="h-3.5 w-3.5" />
                           {featuredAction.rollbackHours}H REVERSIBLE
                         </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-snug line-clamp-3">
                        {featuredAction.title}
                      </h3>
                      <p className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-mono text-[var(--engine-execute)] tracking-tighter truncate">
                        {featuredAction.amountLabel}
                      </p>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-center md:justify-center gap-5 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
                     {onReviewApproval && (
                       <button
                         type="button"
                         onClick={onReviewApproval}
                         onMouseEnter={() => setIsHoveringApprove(true)}
                         onMouseLeave={() => setIsHoveringApprove(false)}
                         className={cn(
                           "relative flex min-h-[56px] w-full items-center justify-center rounded-2xl px-6 font-semibold tracking-wide transition-all duration-500",
                           isHoveringApprove && !reducedMotion 
                             ? "-translate-y-1 bg-[var(--engine-execute)] text-black shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)]" 
                             : "bg-white text-black hover:bg-white/90"
                         )}
                       >
                         Review & Approve
                         <ArrowRight className="ml-2 h-5 w-5" />
                       </button>
                     )}
                     {featuredAction.expiresIn && (
                       <div className="hidden md:flex text-xs text-white/40 items-center justify-center font-mono">
                         Exp: {featuredAction.expiresIn}
                       </div>
                     )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pending Details & Status */}
          <motion.div variants={v} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
            
            {/* Left: Pending Queue Terminal */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex flex-col min-w-0">
              <span className="font-mono text-[10px] uppercase text-white/30 mb-4 tracking-wider">
                [PENDING LIMIT: SHOW MAX 3 ITEMS]
              </span>
              <div className="flex flex-col gap-3 font-mono text-xs text-white/60 min-w-0">
                {pendingQueue.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3 items-start min-w-0 group/item">
                    <span className="text-[var(--engine-execute)] opacity-50 font-bold group-hover/item:opacity-100 transition-opacity shrink-0">{'>'}</span>
                    <span className="truncate group-hover/item:text-white transition-colors block">{item.title}</span>
                  </div>
                ))}
                {pendingQueue.length === 0 && (
                  <div className="text-white/30 italic">No additional items pending.</div>
                )}
                {queueTotal > 3 && (
                  <div className="text-white/40 mt-1 pl-4">
                    ... + {queueTotal - 3} more queued
                  </div>
                )}
              </div>
            </div>

            {/* Right: Execution Posture & Cross Engine */}
            <div className="flex flex-col gap-4 min-w-0">
               {/* Posture */}
               <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex flex-col">
                     <span className="font-mono text-[10px] uppercase text-white/30 tracking-wider">
                       Execution posture
                     </span>
                     <span className="text-sm text-white/80 mt-1.5 font-medium">
                       {agentStepsCompleted}/{agentStepsTotal} steps completed
                     </span>
                  </div>
                  {urgencyBreakdown && (
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-6 rounded-full bg-[var(--state-critical)] opacity-60" title={`High: ${urgencyBreakdown.high}`} />
                      <div className="w-1.5 h-6 rounded-full bg-[var(--engine-execute)] opacity-60" title={`Medium: ${urgencyBreakdown.medium}`} />
                      <div className="w-1.5 h-6 rounded-full bg-white/20" title={`Low: ${urgencyBreakdown.low}`} />
                    </div>
                  )}
               </div>

               {/* Engine Sources */}
               <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 flex flex-col min-w-0">
                 <span className="font-mono text-[10px] uppercase text-white/30 tracking-wider mb-3">
                   Cross-engine sources
                 </span>
                 <div className="flex flex-wrap gap-2">
                   {engineSources.map(source => (
                     <span 
                       key={source.engine}
                       className="inline-flex items-center gap-2 text-xs text-white/60 px-2.5 py-1 rounded-md border border-white/5 bg-black/40 backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                     >
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                       <span className="font-medium">{source.engine}</span> 
                       <span className="text-white/30 ml-1 font-mono">{source.count}</span>
                     </span>
                   ))}
                 </div>
               </div>
            </div>

          </motion.div>

          {/* Bottom link */}
          <motion.div variants={v} className="mt-6 flex justify-center pb-2">
            <HeroGhostLink to="/execute/queue" engineColor="var(--engine-execute)">
              VIEW ALL {queueTotal} PENDING ACTIONS
            </HeroGhostLink>
          </motion.div>

        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}

export const ExecuteApprovalCommandDeck = ExecuteHero
