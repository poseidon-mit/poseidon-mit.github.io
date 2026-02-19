import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from '@/router'
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  DollarSign,
} from "lucide-react"
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ── Motion presets ── */
const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Cross-thread ── */
const MONTHLY_SAVINGS = `$${DEMO_THREAD.monthlySavings}/month`

/* ── AuroraPulse ── */
function AuroraPulse({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${color}0F, transparent), radial-gradient(40% 40% at 80% 20%, ${color}08, transparent)`,
        animation: "aurora-drift 8s ease-in-out infinite alternate",
      }}
    />
  )
}

/* ── GovernFooter ── */
function GovernFooter({ auditId, pageContext }: { auditId: string; pageContext: string }) {
  return (
    <footer
      className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4"
      style={{ background: "rgba(255,255,255,0.03)" }}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-3">
        <Scale size={14} style={{ color: "var(--engine-govern)" }} />
        <span className="text-xs" style={{ color: "#94A3B8" }}>
          Every decision on this page is logged to the immutable audit ledger.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#64748B" }}>
          {auditId}
        </span>
        <Link
          to="/govern/audit"
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--engine-govern)" }}
        >
          Open ledger
        </Link>
      </div>
    </footer>
  )
}

/* ── History data ── */
interface HistoryEntry {
  id: string
  action: string
  engine: string
  status: "completed" | "reversed" | "pending"
  amount: string
  date: string
  auditRef: string
}

const HISTORY_DATA: HistoryEntry[] = [
  { id: "EX-001", action: "Savings transfer", engine: "Grow", status: "completed", amount: "+$420", date: "Feb 15, 2026", auditRef: "GV-2026-0215-EXEC-001" },
  { id: "EX-002", action: "Alert escalation", engine: "Protect", status: "completed", amount: "--", date: "Feb 14, 2026", auditRef: "GV-2026-0214-EXEC-002" },
  { id: "EX-003", action: "Budget rebalance", engine: "Execute", status: "completed", amount: "-$85", date: "Feb 13, 2026", auditRef: "GV-2026-0213-EXEC-003" },
  { id: "EX-004", action: "Investment realloc", engine: "Grow", status: "reversed", amount: "+$1,200", date: "Feb 12, 2026", auditRef: "GV-2026-0212-EXEC-004" },
  { id: "EX-005", action: "Card freeze request", engine: "Protect", status: "completed", amount: "--", date: "Feb 11, 2026", auditRef: "GV-2026-0211-EXEC-005" },
]

const statusConfig = {
  completed: { color: "var(--state-healthy)", icon: CheckCircle2, label: "Completed" },
  reversed: { color: "var(--state-critical)", icon: XCircle, label: "Reversed" },
  pending: { color: "var(--state-warning)", icon: Clock, label: "Pending" },
}

const TABS = ["All", "Completed", "Reversed", "Pending"]

export default function ExecuteHistoryPage() {
  const [activeTab, setActiveTab] = useState("All")

  const filtered = activeTab === "All"
    ? HISTORY_DATA
    : HISTORY_DATA.filter((e) => e.status === activeTab.toLowerCase())

  return (
    <div className="relative">
      <AuroraPulse color="var(--engine-execute)" />

      <motion.main
        id="main-content"
        className="command-center__main"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Link to="/execute" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#64748B" }}>
            <ArrowLeft size={14} />
            Back to Execute
          </Link>
        </motion.div>

        {/* ── P1: Outcome Summary Metrics ── */}
        <motion.section
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-6 lg:px-8"
          aria-label="Execution metrics"
        >
          <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Total executed</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "#F1F5F9" }}>23</p>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Reversed</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "var(--state-critical)" }}>2</p>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Monthly savings</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "var(--state-healthy)" }}>{MONTHLY_SAVINGS}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Success rate</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "#F1F5F9" }}>91%</p>
          </motion.div>
        </motion.section>

        {/* ── P2: History Table ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <div className="glass-surface rounded-2xl overflow-hidden">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Filter size={14} style={{ color: "#64748B" }} className="mr-2" />
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: activeTab === tab ? "rgba(255,255,255,0.06)" : "transparent",
                    color: activeTab === tab ? "#F1F5F9" : "#64748B",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#64748B" }}>Action</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#64748B" }}>Engine</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#64748B" }}>Status</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#64748B" }}>Amount</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-4 py-3" style={{ color: "#64748B" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const s = statusConfig[entry.status]
                    return (
                      <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono" style={{ color: "#64748B" }}>{entry.id}</span>
                            <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{entry.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#CBD5E1" }}>{entry.engine}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: s.color }}>
                            <s.icon size={12} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono" style={{ color: "#F1F5F9" }}>{entry.amount}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#94A3B8" }}>{entry.date}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* ── P3: Open Govern Trace ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <div className="glass-surface rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ background: "rgba(59,130,246,0.1)" }}
              >
                <Scale size={20} style={{ color: "var(--engine-govern)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                  Verify execution integrity
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>
                  Every action above has an immutable trace in the govern audit ledger.
                </p>
              </div>
            </div>
            {/* CTA: Primary -> /govern/audit */}
            <Link
              to="/govern/audit"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #EAB308, #F59E0B)",
                color: "#0B1221",
              }}
            >
              Open govern trace
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter auditId="GV-2026-0216-EXEC-HIST" pageContext="execution history" />
        </div>
      </motion.main>
    </div>
  )
}
