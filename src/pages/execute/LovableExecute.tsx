import { Link } from "@/router";
import { Zap, Clock, CheckCircle, DollarSign, Cpu } from "lucide-react";
import { selectExecuteActionsView } from "@/domain/poseidon-universe";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableExecute() {
  const universeActions = selectExecuteActionsView();
  const actions = universeActions.map(a => ({
    ...a,
    deadline: a.expiresIn,
    status: a.executionType === 'auto' ? 'completed' : 'pending',
  }));
  const executeStats = {
    pending: actions.filter(a => a.status !== 'completed').length,
    completedThisMonth: actions.filter(a => a.status === 'completed').length,
    totalExecuted: "$1.2M",
    pendingTaxSavings: 399.60
  };
  return (
    <motion.div className="p-4 pb-24" variants={container} initial="hidden" animate="show">
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center gap-3 mb-6">
        <div className="bg-amber-500/15 rounded-xl p-2.5 ring-1 ring-amber-500/20">
          <Zap
            className="h-6 w-6 text-amber-400 animate-pulse"
            style={{ filter: "drop-shadow(0 0 8px rgba(234,179,8,0.5))" }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Execute</h1>
          <p className="text-sm text-white/50">
            Human-approval-first automated execution
          </p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          value={String(executeStats.pending)}
          label="Pending"
          icon={<Clock className="h-5 w-5 text-amber-400" />}
          iconBg="bg-amber-500/15"
        />
        <SummaryCard
          value={String(executeStats.completedThisMonth)}
          label="Completed"
          icon={<CheckCircle className="h-5 w-5 text-green-400" />}
          iconBg="bg-green-500/15"
        />
        <SummaryCard
          value={executeStats.totalExecuted}
          label="Executed"
          icon={<DollarSign className="h-5 w-5 text-amber-400" />}
          iconBg="bg-amber-500/15"
        />
        <SummaryCard
          value={`$${executeStats.pendingTaxSavings}`}
          label="Tax Savings"
          icon={<DollarSign className="h-5 w-5 text-amber-400" />}
          iconBg="bg-amber-500/15"
        />
      </motion.div>

      {/* Action List */}
      <div className="space-y-3">
        {actions.map((action) => (
          <motion.div
            key={action.id}
            variants={item}
            className={`bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-4 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300 ${
              action.status === "completed" ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {action.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  )}
                  <h3 className="font-medium text-white">{action.title}</h3>
                </div>
                <p className="text-sm text-white/50 ml-6">
                  {action.description}
                </p>
                {action.deadline && (
                  <p className="text-xs text-white/30 ml-6 mt-1">
                    Deadline: {action.deadline}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0 mt-3 sm:mt-0">
                <Link
                  to={`/lovable/execute/approval/${action.id}`}
                  className="text-sm font-medium text-white/40 hover:text-white/80 whitespace-nowrap transition-colors"
                >
                  Review Details
                </Link>
                {action.status !== "completed" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Provide quick approve UI hook here
                    }}
                    className="text-sm font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
                  >
                    Quick Approve
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
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
