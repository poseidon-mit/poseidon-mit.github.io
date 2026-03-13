import { cn } from "@/lib/utils";

export interface CyberToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accent?: "cyan" | "violet" | "amber" | "green" | "blue" | "red";
  disabled?: boolean;
}

export function CyberToggle({
  checked,
  onChange,
  accent = "cyan",
  disabled = false,
}: CyberToggleProps) {
  const accentColorMap = {
    cyan: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]",
    violet: "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]",
    amber: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
    green: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]",
    blue: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]",
    red: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 border",
        checked
          ? "bg-white/[0.08] border-white/20"
          : "bg-white/[0.02] border-white/[0.06]"
      )}
      onClick={() => onChange(!checked)}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={cn(
          "pointer-events-none absolute left-0.5 inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5.5" : "translate-x-0.5 bg-white/30",
          checked ? accentColorMap[accent] : ""
        )}
      />
    </button>
  );
}
