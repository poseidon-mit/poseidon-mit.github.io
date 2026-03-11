import { Link } from "react-router-dom";
import { Shield, Eye, AlertTriangle, ShieldCheck } from "lucide-react";
import { LovablePageHeader } from "@/components/layout/LovablePageHeader";
import { LovableSeverityBadge } from "@/components/shared/LovableSeverityBadge";
import { threats, protectStats } from "@/data/threats";

const summaryCards = [
  {
    value: protectStats.transactionsMonitored.toLocaleString(),
    label: "Transactions Protected",
    icon: Shield,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    value: "100%",
    label: "Monitored",
    icon: Eye,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    value: String(protectStats.threatsDetected),
    label: "Threats Detected",
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    value: String(protectStats.threatsBlocked),
    label: "Threats Blocked",
    icon: ShieldCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default function LovableProtect() {
  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6"
      style={{ animation: "fadeIn 0.4s ease-out both" }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <LovablePageHeader
        icon={Shield}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        title="Protect"
        description="AI-powered threat detection across all accounts"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border p-4 flex flex-col gap-2"
          >
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.iconBg}`}
            >
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Threat List */}
      <div className="space-y-3">
        {threats.map((threat) => (
          <div
            key={threat.id}
            className={`bg-white rounded-xl border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
              threat.status === "dismissed" ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <LovableSeverityBadge severity={threat.severity} />
              <span className="font-semibold text-gray-900">
                {threat.title}
              </span>
            </div>
            {threat.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                {threat.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{threat.timestamp}</span>
              <Link
                to={`/protect/alert-detail/${threat.id}?demo=true`}
                className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
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
