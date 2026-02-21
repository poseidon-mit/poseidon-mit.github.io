import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from '@/router';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  DollarSign
} from
  "lucide-react";
import { DEMO_THREAD } from '@/lib/demo-thread';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { formatDemoTimestamp } from '@/lib/demo-date';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button, ButtonLink, Surface } from '@/design-system';


/* ── Cross-thread ── */
const MONTHLY_SAVINGS = `$${DEMO_THREAD.monthlySavings}/month`;

/* ── History data ── */
interface HistoryEntry {
  id: string;
  action: string;
  engine: string;
  status: "completed" | "reversed" | "pending";
  amount: string;
  date: string;
  auditRef: string;
}

const HISTORY_DATA: HistoryEntry[] = [
  { id: "EX-001", action: "Savings transfer", engine: "Grow", status: "completed", amount: "+$420", date: formatDemoTimestamp("2026-03-19T08:45:00-04:00"), auditRef: "GV-2026-0319-EXEC-001" },
  { id: "EX-002", action: "Alert escalation", engine: "Protect", status: "completed", amount: "--", date: formatDemoTimestamp("2026-03-18T18:10:00-04:00"), auditRef: "GV-2026-0318-EXEC-002" },
  { id: "EX-003", action: "Budget rebalance", engine: "Execute", status: "completed", amount: "-$85", date: formatDemoTimestamp("2026-03-18T11:30:00-04:00"), auditRef: "GV-2026-0318-EXEC-003" },
  { id: "EX-004", action: "Investment realloc", engine: "Grow", status: "reversed", amount: "+$1,200", date: formatDemoTimestamp("2026-03-17T16:05:00-04:00"), auditRef: "GV-2026-0317-EXEC-004" },
  { id: "EX-005", action: "Card freeze request", engine: "Protect", status: "completed", amount: "--", date: formatDemoTimestamp("2026-03-17T09:20:00-04:00"), auditRef: "GV-2026-0317-EXEC-005" }];


const statusConfig = {
  completed: { color: "var(--state-healthy)", icon: CheckCircle2, label: "Completed" },
  reversed: { color: "var(--state-critical)", icon: XCircle, label: "Reversed" },
  pending: { color: "var(--state-warning)", icon: Clock, label: "Pending" }
};

const TABS = ["All", "Completed", "Reversed", "Pending"];

export default function ExecuteHistoryPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ?
    HISTORY_DATA :
    HISTORY_DATA.filter((e) => e.status === activeTab.toLowerCase());

  return (
    <div className="relative">
      <AuroraPulse engine="execute" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--engine-execute)", color: 'var(--bg-oled)' }}>

        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full pt-8 lg:pt-12"
        style={{ maxWidth: '1440px' }}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        role="main">

        {/* Breadcrumb & Header */}
        <motion.div variants={fadeUp} className="px-4 md:px-6 lg:px-8 flex flex-col gap-6">
          <Link to="/execute" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/50 hover:text-white/80 transition-colors w-fit">
            <ArrowLeft size={16} />
            Back to Execute
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Execution <span className="text-[var(--engine-execute)] drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">History</span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              Immutable ledger of all AI-driven actions and human interventions.
            </p>
          </div>
        </motion.div>

        {/* ── P1: Outcome Summary Metrics ── */}
        <motion.section
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-6 lg:px-8"
          aria-label="Execution metrics">

          <Surface variants={fadeUp} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 border border-white/[0.08]" as={motion.div}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <p className="relative z-10 text-[10px] uppercase tracking-widest font-semibold text-white/40">Total executed</p>
            <p className="relative z-10 text-3xl font-light font-mono text-white">23</p>
          </Surface>
          <Surface variants={fadeUp} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 border border-white/[0.08]" as={motion.div}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <p className="relative z-10 text-[10px] uppercase tracking-widest font-semibold text-white/40">Reversed</p>
            <p className="relative z-10 text-3xl font-light font-mono text-[var(--state-critical)] drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">2</p>
          </Surface>
          <Surface variants={fadeUp} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 border border-white/[0.08]" as={motion.div}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <p className="relative z-10 text-[10px] uppercase tracking-widest font-semibold text-white/40">Monthly savings</p>
            <p className="relative z-10 text-3xl font-light font-mono text-[var(--state-healthy)] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">{MONTHLY_SAVINGS}</p>
          </Surface>
          <Surface variants={fadeUp} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-2 border border-white/[0.08]" as={motion.div}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <p className="relative z-10 text-[10px] uppercase tracking-widest font-semibold text-white/40">Success rate</p>
            <p className="relative z-10 text-3xl font-light font-mono text-white">91%</p>
          </Surface>
        </motion.section>

        {/* ── P2: History Table ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" data-surface-role="structure">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            {/* Filter tabs */}
            <div className="relative z-10 flex flex-wrap items-center gap-2 p-4 lg:p-6 border-b border-white/[0.06]">
              <Filter size={16} className="text-white/40 mr-2" />
              {TABS.map((tab) =>
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant="glass"
                  engine="execute"
                  size="sm"
                  className={`text-xs font-semibold tracking-wider uppercase rounded-xl transition-all ${activeTab === tab ? 'bg-white/10 text-white border-white/20' : 'text-white/40 border-transparent hover:bg-white/5 hover:text-white/70'}`}
                  springPress={false}>

                  {tab}
                </Button>
              )}
            </div>

            {/* Table */}
            <div className="relative z-10 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-6 py-4 text-white/40">Action</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-6 py-4 text-white/40">Engine</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-6 py-4 text-white/40">Status</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-6 py-4 text-white/40">Amount</th>
                    <th className="text-[10px] font-semibold uppercase tracking-widest px-6 py-4 text-white/40 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const s = statusConfig[entry.status];
                    return (
                      <tr key={entry.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-medium text-white/30 tracking-widest">{entry.id}</span>
                            <span className="text-sm font-medium tracking-wide text-white/90">{entry.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] bg-white/[0.02] text-white/60">
                            {entry.engine}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide" style={{ color: s.color, textShadow: `0 0 10px ${s.color}60` }}>
                            <s.icon size={14} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono tracking-wide text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] whitespace-nowrap">{entry.amount}</td>
                        <td className="px-6 py-4 text-xs font-mono text-white/40 tracking-widest text-right whitespace-nowrap">{entry.date}</td>
                      </tr>);

                  })}
                </tbody>
              </table>
            </div>
          </Surface>
        </motion.section>

        {/* ── P3: Open Govern Trace ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="relative overflow-hidden rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 p-6 lg:p-8 border border-[var(--engine-govern)]/20 backdrop-blur-3xl bg-[var(--engine-govern)]/5 shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-govern)]/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl border border-[var(--engine-govern)]/20 shadow-inner"
                style={{ background: "rgba(20,184,166,0.1)" }}>

                <Scale size={24} style={{ color: "var(--engine-govern)" }} className="drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-light tracking-wide text-white group-hover:text-[var(--engine-govern)] transition-colors">
                  Verify execution integrity
                </p>
                <p className="text-sm font-light text-white/50 tracking-wide">
                  Every action above has an immutable trace in the govern audit ledger.
                </p>
              </div>
            </div>
            {/* CTA: Primary -> /govern/audit */}
            <ButtonLink
              to="/govern/audit"
              variant="primary"
              engine="govern"
              className="relative z-10 rounded-2xl text-sm px-8 py-3 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all bg-[var(--engine-govern)] text-black font-semibold border-none shrink-0 w-full md:w-auto flex items-center justify-center gap-2">

              Open govern trace
              <ArrowRight size={18} />
            </ButtonLink>
          </Surface>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/execute/history'].auditId}
            pageContext={GOVERNANCE_META['/execute/history'].pageContext} />

        </div>
      </motion.main>
    </div>);

}
