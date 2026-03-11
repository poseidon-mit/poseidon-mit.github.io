import { Link } from "react-router-dom";
import { Zap, Clock, CheckCircle, DollarSign, Cpu } from "lucide-react";
import { actions, executeStats } from "@/data/actions";

export default function LovableExecute() {
  return (
    <div className="min-h-screen bg-[#ECEAE5] p-4 pb-24 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-100 rounded-xl p-2.5">
          <Zap
            className="h-6 w-6 text-yellow-600 animate-pulse"
            style={{ filter: "drop-shadow(0 0 8px rgba(234,179,8,0.5))" }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Execute</h1>
          <p className="text-sm text-gray-600">
            Human-approval-first automated execution
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          value={String(executeStats.pending)}
          label="Pending"
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <SummaryCard
          value={String(executeStats.completedThisMonth)}
          label="Completed"
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        <SummaryCard
          value={executeStats.totalExecuted}
          label="Executed"
          icon={<DollarSign className="h-5 w-5 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <SummaryCard
          value={executeStats.automationRate}
          label="Automation"
          icon={<Cpu className="h-5 w-5 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
      </div>

      {/* Action List */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`bg-white rounded-xl border p-4 transition-shadow hover:shadow-md ${
              action.status === "completed" ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {action.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500 shrink-0" />
                  )}
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {action.description}
                </p>
                {action.deadline && (
                  <p className="text-xs text-gray-500 ml-6 mt-1">
                    Deadline: {action.deadline}
                  </p>
                )}
              </div>
              <Link
                to={`/lovable/execute/approval/${action.id}`}
                className="text-sm font-medium text-yellow-600 hover:text-yellow-700 whitespace-nowrap"
              >
                Review &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
      <div className={`${iconBg} rounded-lg p-2 w-fit mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
