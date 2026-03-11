interface SeverityBadgeProps {
  severity: "high" | "medium" | "low";
}

const severityStyles: Record<SeverityBadgeProps["severity"], string> = {
  high: "bg-red-500/15 text-red-400 border-red-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  low: "bg-blue-500/15 text-blue-400 border-blue-500/20",
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
