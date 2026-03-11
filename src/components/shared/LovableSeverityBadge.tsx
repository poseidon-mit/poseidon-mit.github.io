interface SeverityBadgeProps {
  severity: "high" | "medium" | "low";
}

const severityStyles: Record<SeverityBadgeProps["severity"], string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export function LovableSeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border capitalize ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  );
}
