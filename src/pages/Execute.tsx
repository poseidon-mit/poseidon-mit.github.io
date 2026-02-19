import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useRouter } from '@/router'
import {
  Zap,
  Shield,
  ShieldCheck,
  ExternalLink,
  User,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RotateCcw,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { EmptyState } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'

/* ── Motion presets ── */
const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: spring } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

/* ── Cross-thread values ── */
const PENDING_ACTIONS = DEMO_THREAD.pendingActions
const MONTHLY_SAVINGS = DEMO_THREAD.monthlySavings

/* ── Shared ── */
function AuroraPulse({ color }: { color: string }) {
  return <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: `radial-gradient(70% 50% at 50% 0%, ${color}0F, transparent), radial-gradient(40% 40% at 80% 20%, ${color}08, transparent)`, animation: "aurora-drift 8s ease-in-out infinite alternate" }} />
}

function GovernFooter({ auditId, pageContext }: { auditId: string; pageContext: string }) {
  return (
    <footer className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4" style={{ background: "rgba(255,255,255,0.03)" }} role="contentinfo" aria-label="Governance verification footer">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "rgba(59,130,246,0.12)" }}><ShieldCheck size={14} style={{ color: "var(--engine-govern)" }} /></div>
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: "rgba(16,185,129,0.12)", color: "var(--state-healthy)" }}><Shield size={10} />Verified</span>
      </div>
      <span className="text-xs font-mono" style={{ color: "#64748B" }}>{auditId}</span>
      <Link to="/govern/audit" className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04]" style={{ borderColor: "rgba(255,255,255,0.08)", color: "#CBD5E1", minHeight: "44px" }} aria-label={`Request human review of ${pageContext}`}><User size={14} />Request human review</Link>
    </footer>
  )
}

function GlassCard({ children, className = "", borderColor }: { children: React.ReactNode; className?: string; borderColor?: string }) {
  return <div className={`rounded-2xl border border-white/[0.06] p-4 md:p-6 ${className}`} style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", ...(borderColor ? { borderLeftWidth: "2px", borderLeftColor: borderColor } : {}) }}>{children}</div>
}

/* ── Data ── */
type ActionStatus = "pending" | "approved" | "rejected" | "deferred"
interface QueueAction {
  id: string; title: string; engine: string; amount: string; confidence: number; status: ActionStatus; time: string; description: string
}

const queueActions: QueueAction[] = [
  { id: "EXE-001", title: "Portfolio rebalance", engine: "Execute", amount: "$12,400", confidence: 0.97, status: "pending", time: "14:28", description: "Optimize allocation based on 90-day pattern" },
  { id: "EXE-002", title: "Block wire transfer", engine: "Protect", amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`, confidence: DEMO_THREAD.criticalAlert.confidence, status: "pending", time: "14:15", description: `Suspicious transaction to ${DEMO_THREAD.criticalAlert.merchant}` },
  { id: "EXE-003", title: "Subscription consolidation", engine: "Grow", amount: "$140/mo", confidence: 0.89, status: "pending", time: "13:52", description: "3 overlapping subscriptions detected" },
  { id: "EXE-004", title: "Archive invoices", engine: "Execute", amount: "-", confidence: 0.78, status: "pending", time: "11:20", description: "Batch archive of 47 paid invoices" },
  { id: "EXE-005", title: "Pay electricity bill", engine: "Execute", amount: "$187", confidence: 0.99, status: "pending", time: "10:30", description: "Recurring auto-payment" },
]

const engineColorMap: Record<string, string> = {
  Execute: "var(--engine-execute)",
  Protect: "var(--engine-protect)",
  Grow: "var(--engine-grow)",
  Govern: "var(--engine-govern)",
}

/* ═══════════════════════════════════════════════════════
   EXECUTE PAGE
   CTA: "Review execution history" -> /execute/history (line 623-624)
   ═══════════════════════════════════════════════════════ */

export default function ExecutePage() {
  const { navigate } = useRouter()
  const [actions, setActions] = useState(queueActions)

  const handleApprove = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: "approved" as ActionStatus } : a))
  }

  const handleDefer = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: "deferred" as ActionStatus } : a))
  }

  const pending = actions.filter(a => a.status === "pending")
  const completed = actions.filter(a => a.status === "approved" || a.status === "rejected")
  const deferred = actions.filter(a => a.status === "deferred")

  return (
    <div className="relative min-h-screen w-full" style={{ background: "#0B1221" }}>
      <AuroraPulse color="#EAB308" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-execute)", color: "#0B1221" }}>Skip to main content</a>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: "1280px" }} variants={staggerContainer} initial="hidden" animate="visible" role="main">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "rgba(234,179,8,0.3)", background: "rgba(234,179,8,0.08)", color: "var(--engine-execute)" }}>
              <Zap size={12} />Execute Engine
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>
            {PENDING_ACTIONS} actions queued. Projected savings: <span style={{ color: "var(--engine-execute)" }}>${MONTHLY_SAVINGS}/mo</span>.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed" style={{ color: "#CBD5E1" }}>
            AI-optimized execution queue. Every action is auditable and reversible within 24 hours.
          </motion.p>
        </motion.section>

        {/* ── Content: Queue + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            {/* Pending actions */}
            <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Pending approval ({pending.length})</h2>
              {pending.length === 0 && (
                <GlassCard>
                  <EmptyState
                    icon={CheckCircle2}
                    title="All pending actions are cleared"
                    description="You can review completed and deferred items in execution history."
                    accentColor="var(--state-healthy)"
                    action={{ label: "Open execution history", onClick: () => navigate('/execute/history') }}
                  />
                </GlassCard>
              )}
              {pending.map(action => (
                <motion.div key={action.id} variants={fadeUp}>
                  <GlassCard borderColor={engineColorMap[action.engine]} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-medium" style={{ color: "var(--engine-execute)" }}>{action.id}</span>
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${engineColorMap[action.engine]}15`, color: engineColorMap[action.engine] }}>{action.engine}</span>
                      <span className="ml-auto text-[10px] font-mono" style={{ color: "#64748B" }}>{action.time}</span>
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{action.title}</h3>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{action.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{action.amount}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${action.confidence * 100}%`, background: action.confidence >= 0.9 ? "var(--state-healthy)" : "var(--state-warning)" }} />
                        </div>
                        <span className="text-xs font-mono tabular-nums" style={{ color: action.confidence >= 0.9 ? "var(--state-healthy)" : "var(--state-warning)" }}>{action.confidence.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(action.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer" style={{ background: "linear-gradient(135deg, var(--engine-execute), #CA8A04)", color: "#0B1221", minHeight: "44px" }}>
                        <CheckCircle2 size={14} />Approve
                      </button>
                      <button onClick={() => handleDefer(action.id)} className="inline-flex items-center justify-center gap-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.08)", color: "#94A3B8", background: "transparent", minHeight: "44px" }}>
                        <Clock size={14} />Defer
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              {/* Deferred */}
              {deferred.length > 0 && (
                <>
                  <h2 className="text-sm font-semibold uppercase tracking-wider mt-4" style={{ color: "#64748B" }}>Deferred ({deferred.length})</h2>
                  {deferred.map(action => (
                    <motion.div key={action.id} variants={fadeUp}>
                      <GlassCard className="flex items-center gap-4 !py-3 opacity-80">
                        <Clock size={16} style={{ color: "var(--state-warning)" }} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{action.title}</span>
                          <span className="text-xs block" style={{ color: "#64748B" }}>{action.id}</span>
                        </div>
                        <span className="text-xs font-mono" style={{ color: "#64748B" }}>{action.time}</span>
                      </GlassCard>
                    </motion.div>
                  ))}
                </>
              )}

              {/* Completed */}
              {completed.length > 0 && (
                <>
                  <h2 className="text-sm font-semibold uppercase tracking-wider mt-4" style={{ color: "#64748B" }}>Completed ({completed.length})</h2>
                  {completed.map(action => (
                    <motion.div key={action.id} variants={fadeUp}>
                      <GlassCard className="flex items-center gap-4 !py-3 opacity-60">
                        <CheckCircle2 size={16} style={{ color: "var(--state-healthy)" }} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{action.title}</span>
                          <span className="text-xs block" style={{ color: "#64748B" }}>{action.id}</span>
                        </div>
                        <span className="text-xs font-mono" style={{ color: "#64748B" }}>{action.time}</span>
                      </GlassCard>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Execute sidebar">
            {/* Queue summary */}
            <GlassCard className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Queue Summary</h3>
                {[
                { label: "Pending actions", value: String(pending.length), color: "var(--state-warning)" },
                { label: "Completed today", value: String(completed.length), color: "var(--state-healthy)" },
                { label: "Auto-approved", value: "8" },
                { label: "Rollbacks (24h)", value: "2", color: "var(--state-healthy)" },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#64748B" }}>{d.label}</span>
                  <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: d.color || "#F1F5F9" }}>{d.value}</span>
                </div>
              ))}
            </GlassCard>

            {/* Savings tracker */}
            <GlassCard className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Savings Tracker</h3>
              <div className="flex items-center gap-2">
                <DollarSign size={20} style={{ color: "var(--engine-execute)" }} />
                <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: "var(--engine-execute)" }}>${MONTHLY_SAVINGS}/mo</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={12} style={{ color: "var(--state-healthy)" }} />
                <span className="text-xs" style={{ color: "var(--state-healthy)" }}>+12% vs last month</span>
              </div>
            </GlassCard>

            {/* Rollback info */}
            <GlassCard className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Rollback Safety</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>All actions are reversible within 24 hours. Rollback requests are processed immediately.</p>
              <div className="flex items-center gap-2"><RotateCcw size={12} style={{ color: "var(--engine-govern)" }} /><span className="text-xs font-mono" style={{ color: "var(--engine-govern)" }}>{"2 active rollbacks"}</span></div>
            </GlassCard>

            {/* Primary CTA: Review execution history -> /execute/history */}
            <Link to="/execute/history" className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, var(--engine-execute), #CA8A04)", color: "#0B1221", minHeight: "48px" }}>
              Review execution history <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/execute'].auditId}
          pageContext={GOVERNANCE_META['/execute'].pageContext}
        />
      </motion.div>
    </div>
  )
}
