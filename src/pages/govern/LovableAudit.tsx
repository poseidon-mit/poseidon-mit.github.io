import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { auditRecords } from "@/data/audit";

type EngineFilter = "All" | "Protect" | "Grow" | "Execute";
type StatusFilter = "All" | "pending" | "completed" | "rejected";

export default function LovableAudit() {
  const [engineFilter, setEngineFilter] = useState<EngineFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filtered = auditRecords.filter((r) => {
    if (engineFilter !== "All" && r.engine !== engineFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#ECEAE5] p-4 pb-24 animate-fade-in">
      {/* Back Link */}
      <Link
        to="/govern"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Govern
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Audit Trail</h1>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={engineFilter}
          onChange={(e) => setEngineFilter(e.target.value as EngineFilter)}
          className="bg-white border rounded-xl px-3 py-2 text-sm min-h-[44px]"
        >
          <option value="All">All Engines</option>
          <option value="Protect">Protect</option>
          <option value="Grow">Grow</option>
          <option value="Execute">Execute</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="bg-white border rounded-xl px-3 py-2 text-sm min-h-[44px]"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Dismissed</option>
        </select>

        <button
          onClick={() => toast("Demo mode \u2014 export simulated")}
          className="ml-auto inline-flex items-center gap-1.5 bg-white border rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600">Timestamp</th>
              <th className="px-4 py-3 font-medium text-gray-600">Engine</th>
              <th className="px-4 py-3 font-medium text-gray-600">Action</th>
              <th className="px-4 py-3 font-medium text-gray-600">Model</th>
              <th className="px-4 py-3 font-medium text-gray-600">Confidence</th>
              <th className="px-4 py-3 font-medium text-gray-600">Processing</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No records match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <EngineBadge engine={r.engine} />
                  </td>
                  <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">
                    {r.action}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs font-mono">
                    {r.model}
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge value={r.confidence} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.processingMs}ms</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EngineBadge({ engine }: { engine: string }) {
  const colors: Record<string, string> = {
    Protect: "bg-green-100 text-green-700",
    Grow: "bg-violet-100 text-violet-700",
    Execute: "bg-amber-100 text-amber-700",
    Govern: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`${colors[engine] ?? "bg-gray-100 text-gray-700"} text-xs font-medium rounded-full px-2.5 py-0.5`}
    >
      {engine}
    </span>
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`${colors[status] ?? "bg-gray-100 text-gray-700"} text-xs font-medium rounded-full px-2.5 py-0.5 capitalize`}
    >
      {status}
    </span>
  );
}
