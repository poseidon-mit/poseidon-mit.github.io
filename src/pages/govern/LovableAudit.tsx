import { useState } from "react";
import {  Link  } from "@/router";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { selectGovernAuditEntries } from "@/domain/poseidon-universe";
import { motion } from "framer-motion";

type EngineFilter = "All" | "Protect" | "Grow" | "Execute";
type StatusFilter = "All" | "pending" | "completed" | "rejected";

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableAudit() {
  const [engineFilter, setEngineFilter] = useState<EngineFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const universeRecords = selectGovernAuditEntries();
  const auditRecords = universeRecords.map(r => ({
    id: r.id,
    engine: r.type.charAt(0).toUpperCase() + r.type.slice(1),
    action: r.action || "System Audit",
    timestamp: r.timestampIso,
    confidence: r.confidence,
    model: "POSEIDON-V1",
    processingMs: 245,
    status: r.status === "Flagged" ? "rejected" : "completed"
  }));

  const filtered = auditRecords.filter((r) => {
    if (engineFilter !== "All" && r.engine !== engineFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <motion.div className="p-4 pb-24" variants={container} initial="hidden" animate="show">
      {/* Back Link */}
      <motion.div variants={item}>
        <Link
          to="/lovable/govern"
          className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Govern
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white mb-4">Audit Trail</h1>
      </motion.div>

      {/* Filter Row */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={engineFilter}
          onChange={(e) => setEngineFilter(e.target.value as EngineFilter)}
          className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-3 py-2 text-sm min-h-[44px] text-white [&>option]:bg-[#0d1526] [&>option]:text-white"
        >
          <option value="All">All Engines</option>
          <option value="Protect">Protect</option>
          <option value="Grow">Grow</option>
          <option value="Execute">Execute</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-3 py-2 text-sm min-h-[44px] text-white [&>option]:bg-[#0d1526] [&>option]:text-white"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Dismissed</option>
        </select>

        <button
          onClick={() => alert("Demo mode \u2014 export simulated")}
          className="ml-auto inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/[0.1] min-h-[44px] transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left">
              <th className="px-4 py-3 font-medium text-white/40">Timestamp</th>
              <th className="px-4 py-3 font-medium text-white/40">Engine</th>
              <th className="px-4 py-3 font-medium text-white/40">Action</th>
              <th className="px-4 py-3 font-medium text-white/40">Model</th>
              <th className="px-4 py-3 font-medium text-white/40">Confidence</th>
              <th className="px-4 py-3 font-medium text-white/40">Processing</th>
              <th className="px-4 py-3 font-medium text-white/40">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/30">
                  No records match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-white/50">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <EngineBadge engine={r.engine} />
                  </td>
                  <td className="px-4 py-3 text-white max-w-[200px] truncate">
                    {r.action}
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs font-mono">
                    {r.model}
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge value={r.confidence} />
                  </td>
                  <td className="px-4 py-3 text-white/50">{r.processingMs}ms</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

function EngineBadge({ engine }: { engine: string }) {
  const colors: Record<string, string> = {
    Protect: "bg-green-500/15 text-green-400",
    Grow: "bg-violet-500/15 text-violet-400",
    Execute: "bg-amber-500/15 text-amber-400",
    Govern: "bg-blue-500/15 text-blue-400",
  };
  return (
    <span
      className={`${colors[engine] ?? "bg-white/[0.06] text-white/50"} text-xs font-medium rounded-full px-2.5 py-0.5`}
    >
      {engine}
    </span>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = (value * 100).toFixed(0);
  const color =
    value >= 0.9
      ? "bg-green-500/15 text-green-400"
      : value >= 0.8
        ? "bg-amber-500/15 text-amber-400"
        : "bg-red-500/15 text-red-400";
  return (
    <span className={`${color} text-xs font-medium rounded-full px-2 py-0.5`}>
      {pct}%
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400",
    completed: "bg-green-500/15 text-green-400",
    rejected: "bg-red-500/15 text-red-400",
  };
  return (
    <span
      className={`${colors[status] ?? "bg-white/[0.06] text-white/50"} text-xs font-medium rounded-full px-2.5 py-0.5 capitalize`}
    >
      {status}
    </span>
  );
}
