import { Link } from "react-router-dom";
import { FileText, Database, Shield, Target, UserCheck } from "lucide-react";
import { auditRecords, governStats } from "@/data/audit";

const engineColors: Record<string, string> = {
  Protect: "bg-green-500",
  Grow: "bg-violet-500",
  Execute: "bg-amber-500",
  Govern: "bg-blue-500",
};

export default function LovableGovern() {
  const latestRecords = auditRecords.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#ECEAE5] p-4 pb-24 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 rounded-xl p-2.5">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Govern</h1>
          <p className="text-sm text-gray-600">
            Complete auditability for every AI decision
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          value={governStats.totalRecords.toLocaleString()}
          label="Total Records"
          icon={<Database className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <SummaryCard
          value="100%"
          label="Auditable"
          icon={<Shield className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <SummaryCard
          value={governStats.modelAccuracy}
          label="Model Accuracy"
          icon={<Target className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        <SummaryCard
          value={governStats.overrideRate}
          label="Override Rate"
          icon={<UserCheck className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-100"
        />
      </div>

      {/* Latest Audit Records */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Latest Audit Records
      </h2>
      <div className="space-y-2 mb-6">
        {latestRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl border p-3 flex items-center gap-3"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${engineColors[record.engine] ?? "bg-gray-400"}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {record.engine}
                </span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {record.action}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(record.timestamp).toLocaleString()}
              </p>
            </div>
            <ConfidenceBadge value={record.confidence} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/govern/audit"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3 min-h-[44px] font-medium transition-colors"
        >
          View Full Audit Trail &rarr;
        </Link>
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
    <div className="bg-white rounded-xl border p-4">
      <div className={`${iconBg} rounded-lg p-2 w-fit mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = (value * 100).toFixed(0);
  const color =
    value >= 0.9
      ? "bg-green-100 text-green-700"
      : value >= 0.8
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";
  return (
    <span className={`${color} text-xs font-medium rounded-full px-2 py-0.5`}>
      {pct}%
    </span>
  );
}
