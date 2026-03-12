import {  Link  } from "@/router";
import { FileText, Database, Shield, Target, UserCheck } from "lucide-react";
import { selectGovernAuditEntries } from "@/domain/poseidon-universe";
import { motion } from "framer-motion";

const engineColors: Record<string, string> = {
  Protect: "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  Grow: "bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.5)]",
  Execute: "bg-amber-400 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  Govern: "bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
};

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableGovern() {
  const governStats = {
    totalRecords: 2847,
    modelAccuracy: "99.8%",
    userOverrides: "12 (0.4%)",
  };
  const universeRecords = selectGovernAuditEntries();
  const auditRecords = universeRecords.map(r => ({
    id: r.id,
    engine: r.type.charAt(0).toUpperCase() + r.type.slice(1),
    action: r.action || "Monitor System",
    timestamp: r.timestampIso,
    confidence: r.confidence,
  }));
  const latestRecords = auditRecords.slice(0, 5);

  return (
    <motion.div className="p-4 pb-24" variants={container} initial="hidden" animate="show">
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500/15 rounded-xl p-2.5 ring-1 ring-blue-500/20">
          <FileText className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Govern</h1>
          <p className="text-sm text-white/50">
            Complete auditability for every AI decision
          </p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          value={governStats.totalRecords.toLocaleString()}
          label="Total Records"
          icon={<Database className="h-5 w-5 text-blue-400" />}
          iconBg="bg-blue-500/15"
        />
        <SummaryCard
          value="100%"
          label="Auditable"
          icon={<Shield className="h-5 w-5 text-blue-400" />}
          iconBg="bg-blue-500/15"
        />
        <SummaryCard
          value={governStats.modelAccuracy}
          label="Model Accuracy"
          icon={<Target className="h-5 w-5 text-green-400" />}
          iconBg="bg-green-500/15"
        />
        <SummaryCard
          value={governStats.userOverrides}
          label="User Overrides"
          icon={<UserCheck className="h-5 w-5 text-amber-400" />}
          iconBg="bg-amber-500/15"
        />
      </motion.div>

      {/* Latest Audit Records */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white mb-3">
          Latest Audit Records
        </h2>
      </motion.div>
      <div className="space-y-2 mb-6">
        {latestRecords.map((record) => (
          <motion.div
            key={record.id}
            variants={item}
            className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-3 flex items-center gap-3 hover:bg-white/[0.07] transition-all duration-300"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${engineColors[record.engine] ?? "bg-gray-400"}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white/40">
                  {record.engine}
                </span>
                <span className="text-sm font-medium text-white truncate">
                  {record.action}
                </span>
              </div>
              <p className="text-xs text-white/30">
                {new Date(record.timestamp).toLocaleString()}
              </p>
            </div>
            <ConfidenceBadge value={record.confidence} />
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div variants={item} className="text-center">
        <Link
          to="/lovable/govern/audit"
          className="inline-block bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-6 py-3 min-h-[44px] font-medium shadow-lg shadow-blue-500/25 transition-all duration-200"
        >
          View Full Audit Trail &rarr;
        </Link>
      </motion.div>
    </motion.div>
  );
}

function SummaryCard({
  value,
  label,
  icon,
  iconBg,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-4 hover:bg-white/[0.07] transition-all duration-300">
      <div className={`${iconBg} rounded-lg p-2 w-fit mb-2 ring-1 ring-white/[0.08]`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/40">{label}</p>
    </div>
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
