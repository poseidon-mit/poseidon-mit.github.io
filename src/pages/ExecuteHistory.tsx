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
  DollarSign } from
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
        className="command-center__main"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}>
        
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Link to="/execute" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#64748B" }}>
            <ArrowLeft size={14} />
            Back to Execute
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[var(--tracking-h2)] text-slate-100">Execution History</h1>
        </motion.div>

        {/* ── P1: Outcome Summary Metrics ── */}
        <motion.section
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-6 lg:px-8"
          aria-label="Execution metrics">
          
          <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Total executed</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "#F1F5F9" }}>23</p>
          </Surface>
          <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Reversed</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "var(--state-critical)" }}>2</p>
          </Surface>
          <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Monthly savings</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "var(--state-healthy)" }}>{MONTHLY_SAVINGS}</p>
          </Surface>
          <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#64748B" }}>Success rate</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "#F1F5F9" }}>91%</p>
          </Surface>
        </motion.section>

        {/* ── P2: History Table ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl overflow-hidden" variant="glass" padding="none" data-surface-role="structure">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Filter size={14} style={{ color: "#64748B" }} className="mr-2" />
              {TABS.map((tab) =>
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant="glass"
                engine="execute"
                size="sm"
                className="text-xs font-medium rounded-lg transition-colors"
                springPress={false}>
                
                  {tab}
                </Button>
              )}
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
                    const s = statusConfig[entry.status];
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
                      </tr>);

                  })}
                </tbody>
              </table>
            </div>
          </Surface>
        </motion.section>

        {/* ── P3: Open Govern Trace ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4" variant="glass" padding="md">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ background: "rgba(59,130,246,0.1)" }}>
                
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
            <ButtonLink
              to="/govern/audit"
              variant="glass"
              engine="execute"
              className="rounded-xl text-sm">
              
              Open govern trace
              <ArrowRight size={16} />
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
